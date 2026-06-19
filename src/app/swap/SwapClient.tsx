'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import {
  useAccount,
  useConnect,
  useDisconnect,
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
} from 'wagmi';
import { parseUnits, formatUnits } from 'viem';

// ─── Config ──────────────────────────────────────────────────────────────────
const OLD_TOKEN_ADDRESS = '0x8d3c1FbF7FF526f94dbE8a8F3d176Ad047286C6F' as const;
const NEW_TOKEN_ADDRESS = '0x154a8Ca29526184D1A3a02f047e4127FD14156b9' as const;

// TODO: Fill in the migration contract address once deployed
const MIGRATION_CONTRACT_ADDRESS = '' as const;

const SWAP_RATIO = 1;

// ─── ABIs ────────────────────────────────────────────────────────────────────
const ERC20_ABI = [
  { name: 'balanceOf', type: 'function', stateMutability: 'view', inputs: [{ name: 'account', type: 'address' }], outputs: [{ type: 'uint256' }] },
  { name: 'allowance', type: 'function', stateMutability: 'view', inputs: [{ name: 'owner', type: 'address' }, { name: 'spender', type: 'address' }], outputs: [{ type: 'uint256' }] },
  { name: 'approve', type: 'function', stateMutability: 'nonpayable', inputs: [{ name: 'spender', type: 'address' }, { name: 'amount', type: 'uint256' }], outputs: [{ type: 'bool' }] },
  { name: 'decimals', type: 'function', stateMutability: 'view', inputs: [], outputs: [{ type: 'uint8' }] },
] as const;

const MIGRATION_ABI = [
  { name: 'swap', type: 'function', stateMutability: 'nonpayable', inputs: [{ name: 'amount', type: 'uint256' }], outputs: [] },
] as const;

// ─── Types ───────────────────────────────────────────────────────────────────
type Step = 'idle' | 'input' | 'approving' | 'waitApprove' | 'swapping' | 'waitSwap' | 'done';

export default function SwapClient() {
  const { t } = useTranslation();
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();

  const metaMaskConnector = connectors.find(c => c.type === 'injected');
  const wcConnector = connectors.find(c => c.type === 'walletConnect');

  const [step, setStep] = useState<Step>('idle');
  const [showConnectors, setShowConnectors] = useState(false);
  const [inputAmount, setInputAmount] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [approveTxHash, setApproveTxHash] = useState<`0x${string}` | undefined>();
  const [swapTxHash, setSwapTxHash] = useState<`0x${string}` | undefined>();

  const migrationReady = MIGRATION_CONTRACT_ADDRESS !== '';

  // ─── Contract reads ──────────────────────────────────────────────────────
  const { data: decimals = 18 } = useReadContract({
    address: OLD_TOKEN_ADDRESS,
    abi: ERC20_ABI,
    functionName: 'decimals',
  });

  const { data: oldBalance = BigInt(0), refetch: refetchBalance } = useReadContract({
    address: OLD_TOKEN_ADDRESS,
    abi: ERC20_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  });

  const { data: allowance = BigInt(0), refetch: refetchAllowance } = useReadContract({
    address: OLD_TOKEN_ADDRESS,
    abi: ERC20_ABI,
    functionName: 'allowance',
    args: address && migrationReady ? [address, MIGRATION_CONTRACT_ADDRESS as `0x${string}`] : undefined,
    query: { enabled: !!address && migrationReady },
  });

  // ─── Contract writes ─────────────────────────────────────────────────────
  const { writeContractAsync: writeApprove } = useWriteContract();
  const { writeContractAsync: writeSwap } = useWriteContract();

  const { isSuccess: approveConfirmed } = useWaitForTransactionReceipt({
    hash: approveTxHash,
    query: { enabled: !!approveTxHash },
  });

  const { isSuccess: swapConfirmed } = useWaitForTransactionReceipt({
    hash: swapTxHash,
    query: { enabled: !!swapTxHash },
  });

  // ─── Effects ─────────────────────────────────────────────────────────────
  useEffect(() => {
    if (isConnected && step === 'idle') setStep('input');
    if (!isConnected) { setStep('idle'); setInputAmount(''); }
  }, [isConnected, step]);

  useEffect(() => {
    if (approveConfirmed && step === 'waitApprove') {
      void refetchAllowance();
      setStep('input');
    }
  }, [approveConfirmed, step, refetchAllowance]);

  useEffect(() => {
    if (swapConfirmed && step === 'waitSwap') {
      void refetchBalance();
      setStep('done');
    }
  }, [swapConfirmed, step, refetchBalance]);

  // ─── Helpers ─────────────────────────────────────────────────────────────
  const parsedAmount = (() => {
    try { return inputAmount ? parseUnits(inputAmount, Number(decimals)) : BigInt(0); } catch { return BigInt(0); }
  })();

  const formattedBalance = formatUnits(oldBalance as bigint, Number(decimals));
  const needsApproval = migrationReady && parsedAmount > BigInt(0) && (allowance as bigint) < parsedAmount;
  const receiveAmount = inputAmount && !isNaN(Number(inputAmount)) ? (Number(inputAmount) * SWAP_RATIO).toLocaleString() : '—';

  function handleMax() {
    setInputAmount(formatUnits(oldBalance as bigint, Number(decimals)));
  }

  async function handleApprove() {
    if (!migrationReady || !parsedAmount) return;
    setErrorMsg('');
    setStep('approving');
    try {
      const hash = await writeApprove({
        address: OLD_TOKEN_ADDRESS,
        abi: ERC20_ABI,
        functionName: 'approve',
        args: [MIGRATION_CONTRACT_ADDRESS as `0x${string}`, parsedAmount],
      });
      setApproveTxHash(hash);
      setStep('waitApprove');
    } catch {
      setErrorMsg(t('swap.approvalError'));
      setStep('input');
    }
  }

  async function handleSwap() {
    if (!migrationReady || !parsedAmount) return;
    setErrorMsg('');
    setStep('swapping');
    try {
      const hash = await writeSwap({
        address: MIGRATION_CONTRACT_ADDRESS as `0x${string}`,
        abi: MIGRATION_ABI,
        functionName: 'swap',
        args: [parsedAmount],
      });
      setSwapTxHash(hash);
      setStep('waitSwap');
    } catch {
      setErrorMsg(t('swap.swapError'));
      setStep('input');
    }
  }

  const isLoading = step === 'approving' || step === 'waitApprove' || step === 'swapping' || step === 'waitSwap';

  const loadingText =
    step === 'approving' ? t('swap.awaitingApproval') :
    step === 'waitApprove' ? t('swap.confirmingApproval') :
    step === 'swapping' ? t('swap.awaitingSwap') :
    t('swap.confirmingSwap');

  return (
    <div className="min-h-screen bg-white font-sans selection:bg-[#0052ff] selection:text-white flex flex-col">
      {/* Header */}
      <header className="h-[64px] bg-[#0a0b0d] text-white flex items-center justify-between px-6 md:px-12 border-b border-white/10 shrink-0">
        <Link href="/" className="flex items-center gap-3">
          <Image src="/logo_alt.png" alt="BANA" width={24} height={24} unoptimized className="object-contain" />
          <span className="text-[14px] font-medium tracking-wide">BANA Protocol</span>
        </Link>
        {isConnected && address && (
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 rounded-full bg-white/8 border border-white/10 px-4 py-1.5">
              <span className="h-2 w-2 rounded-full bg-[#05b169]" />
              <span className="text-[13px] font-mono text-white/80">{address.slice(0, 6)}...{address.slice(-4)}</span>
              <span className="text-[11px] text-[#05b169] font-medium">BNB Chain</span>
            </div>
            <button
              onClick={() => disconnect()}
              className="text-[12px] text-white/30 hover:text-white/70 transition-colors px-2"
            >
              {t('swap.disconnect')}
            </button>
          </div>
        )}
      </header>

      <main className="flex-1 flex flex-col">
        {/* Hero */}
        <section className="bg-[#0a0b0d] text-white px-6 md:px-12 py-[64px] md:py-[80px]">
          <div className="mx-auto max-w-6xl grid md:grid-cols-2 gap-12 md:gap-16 items-start">

            {/* Left */}
            <div className="space-y-8">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 rounded-full bg-[#16181c] border border-white/10 px-4 py-1.5 text-[12px] font-semibold tracking-wide">
                  <span className="h-2 w-2 rounded-full bg-[#f5a623]" />
                  {t('swap.badge')}
                </div>
                <h1 className="text-[40px] md:text-[56px] font-normal leading-[1.1] tracking-[-1.4px]">
                  {t('swap.titleLine1')}<br />{t('swap.titleLine2')}
                </h1>
                <p className="text-[17px] text-[#a8acb3] max-w-md leading-relaxed">
                  {t('swap.description')}
                </p>
              </div>

              {/* Contract info */}
              <div className="pt-8 border-t border-white/10 space-y-5">
                <div>
                  <p className="text-[12px] text-[#a8acb3] font-medium mb-1 uppercase tracking-wider">{t('swap.oldContractLabel')}</p>
                  <a
                    href={`https://bscscan.com/token/${OLD_TOKEN_ADDRESS}`}
                    target="_blank"
                    rel="noreferrer"
                    className="font-mono text-[13px] text-white/60 hover:text-[#0052ff] transition-colors break-all"
                  >
                    {OLD_TOKEN_ADDRESS}
                  </a>
                </div>
                <div>
                  <p className="text-[12px] text-[#a8acb3] font-medium mb-1 uppercase tracking-wider">{t('swap.newContractLabel')}</p>
                  <a
                    href={`https://bscscan.com/token/${NEW_TOKEN_ADDRESS}`}
                    target="_blank"
                    rel="noreferrer"
                    className="font-mono text-[13px] text-white/60 hover:text-[#0052ff] transition-colors break-all"
                  >
                    {NEW_TOKEN_ADDRESS}
                  </a>
                </div>
              </div>

              {/* Balance bar */}
              {isConnected && address && (
                <div className="rounded-[16px] bg-[#16181c] border border-white/8 p-5 space-y-3">
                  <p className="text-[11px] text-[#a8acb3] uppercase tracking-widest font-medium">{t('swap.balanceLabel')}</p>
                  <p className="text-[28px] font-medium font-mono">
                    {Number(formattedBalance).toLocaleString(undefined, { maximumFractionDigits: 4 })}
                    <span className="text-[16px] text-[#a8acb3] ml-2">BANA</span>
                  </p>
                  <a
                    href={`https://bscscan.com/address/${address}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[12px] text-[#0052ff] hover:underline"
                  >
                    {t('swap.viewBscScan')}
                  </a>
                </div>
              )}
            </div>

            {/* Right: Swap card */}
            <div className="bg-[#16181c] rounded-[24px] shadow-2xl border border-white/5 overflow-hidden">

              {/* Not connected */}
              {!isConnected && (
                <div className="p-8 md:p-10 space-y-8">
                  <div className="space-y-2">
                    <h3 className="text-[24px] font-normal tracking-tight">{t('swap.connectTitle')}</h3>
                    <p className="text-[15px] text-[#a8acb3]">{t('swap.connectDesc')}</p>
                  </div>
                  <div className="rounded-[16px] bg-[#0a0b0d] border border-white/8 p-5 space-y-3">
                    {[
                      { label: t('swap.network'), value: 'BNB Chain' },
                      { label: t('swap.exchangeRateLabel'), value: `1 BANA → ${SWAP_RATIO} BANA` },
                      { label: t('swap.deadline'), value: t('swap.deadline') },
                    ].map((r) => (
                      <div key={r.label} className="flex justify-between text-[14px]">
                        <span className="text-[#a8acb3]">{r.label}</span>
                        <span className="text-white font-medium">{r.value}</span>
                      </div>
                    ))}
                  </div>
                  {!showConnectors ? (
                    <button
                      onClick={() => setShowConnectors(true)}
                      className="w-full h-[56px] rounded-full bg-[#0052ff] hover:bg-[#003ecc] text-white text-[16px] font-semibold transition-colors"
                    >
                      {t('swap.connectBtn')}
                    </button>
                  ) : (
                    <div className="space-y-3">
                      {metaMaskConnector && (
                        <button
                          onClick={() => connect({ connector: metaMaskConnector })}
                          className="w-full h-[52px] rounded-full bg-[#f5841f] hover:bg-[#e07010] text-white text-[15px] font-semibold transition-colors"
                        >
                          MetaMask
                        </button>
                      )}
                      {wcConnector && (
                        <button
                          onClick={() => connect({ connector: wcConnector })}
                          className="w-full h-[52px] rounded-full bg-[#3b99fc] hover:bg-[#2a88eb] text-white text-[15px] font-semibold transition-colors"
                        >
                          WalletConnect
                        </button>
                      )}
                      <button onClick={() => setShowConnectors(false)} className="w-full text-[13px] text-[#7c828a] hover:text-white transition-colors py-1">
                        {t('swap.cancelBtn')}
                      </button>
                    </div>
                  )}
                  <p className="text-[12px] text-[#7c828a] text-center">{t('swap.walletHint')}</p>
                </div>
              )}

              {/* Loading */}
              {isConnected && isLoading && (
                <div className="p-8 md:p-10 py-20 flex flex-col items-center justify-center space-y-5">
                  <div className="w-12 h-12 rounded-full border-[3px] border-[#0052ff]/30 border-t-[#0052ff] animate-spin" />
                  <p className="text-[15px] text-[#a8acb3]">{loadingText}</p>
                  {(step === 'waitApprove' && approveTxHash) && (
                    <a href={`https://bscscan.com/tx/${approveTxHash}`} target="_blank" rel="noreferrer" className="text-[12px] text-[#0052ff] hover:underline">
                      {t('swap.viewTransaction')}
                    </a>
                  )}
                  {(step === 'waitSwap' && swapTxHash) && (
                    <a href={`https://bscscan.com/tx/${swapTxHash}`} target="_blank" rel="noreferrer" className="text-[12px] text-[#0052ff] hover:underline">
                      {t('swap.viewTransaction')}
                    </a>
                  )}
                </div>
              )}

              {/* Swap form */}
              {isConnected && step === 'input' && (
                <div className="p-8 md:p-10 space-y-8">
                  <div className="space-y-2">
                    <h3 className="text-[24px] font-normal tracking-tight">{t('swap.migrateTitle')}</h3>
                    <p className="text-[15px] text-[#a8acb3]">{t('swap.migrateDesc')}</p>
                  </div>

                  {!migrationReady && (
                    <div className="rounded-[12px] bg-[#f5a623]/10 border border-[#f5a623]/20 px-4 py-3">
                      <p className="text-[13px] text-[#f5a623]">{t('swap.comingSoon')}</p>
                    </div>
                  )}

                  <div className="space-y-3">
                    {/* You send */}
                    <div className="rounded-[16px] bg-[#0a0b0d] border border-white/10 p-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <p className="text-[12px] text-[#a8acb3] uppercase tracking-wider">{t('swap.youSend')}</p>
                        <button onClick={handleMax} className="text-[11px] text-[#0052ff] hover:underline font-medium">
                          {t('swap.maxLabel')}: {Number(formattedBalance).toLocaleString(undefined, { maximumFractionDigits: 4 })}
                        </button>
                      </div>
                      <div className="flex items-center gap-3">
                        <input
                          type="number"
                          min="0"
                          value={inputAmount}
                          onChange={(e) => setInputAmount(e.target.value)}
                          placeholder="0.0"
                          className="flex-1 bg-transparent text-[28px] font-medium text-white placeholder:text-white/20 focus:outline-none"
                        />
                        <div className="flex items-center gap-2 rounded-full bg-white/8 border border-white/10 px-3 py-1.5">
                          <span className="text-[13px] font-medium text-white">BANA</span>
                          <span className="text-[10px] text-[#a8acb3]">OLD</span>
                        </div>
                      </div>
                    </div>

                    {/* Arrow */}
                    <div className="flex justify-center">
                      <div className="w-8 h-8 rounded-full bg-[#0a0b0d] border border-white/10 flex items-center justify-center">
                        <svg className="w-4 h-4 text-[#a8acb3]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                        </svg>
                      </div>
                    </div>

                    {/* You receive */}
                    <div className="rounded-[16px] bg-[#0a0b0d] border border-white/10 p-4 space-y-2">
                      <p className="text-[12px] text-[#a8acb3] uppercase tracking-wider">{t('swap.youReceive')}</p>
                      <div className="flex items-center gap-3">
                        <span className="flex-1 text-[28px] font-medium text-[#05b169]">{receiveAmount}</span>
                        <div className="flex items-center gap-2 rounded-full bg-[#05b169]/10 border border-[#05b169]/20 px-3 py-1.5">
                          <span className="text-[13px] font-medium text-[#05b169]">BANA</span>
                          <span className="text-[10px] text-[#05b169]/60">NEW</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Rate */}
                  <div className="flex justify-between text-[13px] px-1">
                    <span className="text-[#a8acb3]">{t('swap.exchangeRateLabel')}</span>
                    <span className="text-white">1 BANA (old) = {SWAP_RATIO} BANA (new)</span>
                  </div>

                  {errorMsg && <p className="text-[14px] text-[#cf202f]">{errorMsg}</p>}

                  {/* CTA */}
                  {needsApproval ? (
                    <button
                      onClick={handleApprove}
                      disabled={!migrationReady || !parsedAmount || parsedAmount > (oldBalance as bigint)}
                      className="w-full h-[56px] rounded-full bg-[#f5a623] hover:bg-[#e09510] disabled:opacity-40 text-white text-[16px] font-semibold transition-colors disabled:cursor-not-allowed"
                    >
                      {t('swap.approveBtn')}
                    </button>
                  ) : (
                    <button
                      onClick={handleSwap}
                      disabled={!migrationReady || !parsedAmount || parsedAmount > (oldBalance as bigint)}
                      className="w-full h-[56px] rounded-full bg-[#0052ff] hover:bg-[#003ecc] disabled:opacity-40 text-white text-[16px] font-semibold transition-colors disabled:cursor-not-allowed"
                    >
                      {!migrationReady ? t('swap.unavailableBtn') : t('swap.swapBtn')}
                    </button>
                  )}

                  {needsApproval && migrationReady && (
                    <p className="text-[12px] text-[#7c828a] text-center">{t('swap.step')}</p>
                  )}
                </div>
              )}

              {/* Done */}
              {step === 'done' && (
                <div className="p-8 md:p-10 space-y-8">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <h3 className="text-[24px] font-normal tracking-tight">{t('swap.doneTitle')}</h3>
                      <div className="w-6 h-6 rounded-full bg-[#05b169]/10 flex items-center justify-center">
                        <svg className="w-3.5 h-3.5 text-[#05b169]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    </div>
                    <p className="text-[15px] text-[#a8acb3]">{t('swap.doneDesc')}</p>
                  </div>

                  <div className="rounded-[16px] bg-[#0a0b0d] border border-white/10 p-5 space-y-4">
                    {[
                      { label: t('swap.walletLabel'), value: address ? `${address.slice(0, 10)}...${address.slice(-8)}` : '', mono: true },
                      { label: t('swap.receivedLabel'), value: `${receiveAmount} BANA` },
                      { label: t('swap.newContractDetailLabel'), value: `${NEW_TOKEN_ADDRESS.slice(0, 10)}...${NEW_TOKEN_ADDRESS.slice(-8)}`, mono: true },
                    ].map((row) => (
                      <div key={row.label} className="flex justify-between items-center text-[14px]">
                        <span className="text-[#a8acb3]">{row.label}</span>
                        <span className={`text-white ${row.mono ? 'font-mono text-[12px]' : 'font-medium'}`}>{row.value}</span>
                      </div>
                    ))}
                  </div>

                  {swapTxHash && (
                    <a
                      href={`https://bscscan.com/tx/${swapTxHash}`}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full h-[48px] rounded-full border border-[#0052ff] text-[#0052ff] hover:bg-[#0052ff] hover:text-white text-[15px] font-semibold transition-colors flex items-center justify-center"
                    >
                      {t('swap.viewTx')}
                    </a>
                  )}

                  <button
                    onClick={() => { setStep('input'); setInputAmount(''); setSwapTxHash(undefined); }}
                    className="w-full h-[56px] rounded-full border border-white/20 hover:border-white text-white text-[16px] font-semibold transition-colors"
                  >
                    {t('swap.swapMore')}
                  </button>

                  <Link
                    href="/"
                    className="w-full h-[48px] rounded-full text-[#7c828a] hover:text-white text-[15px] transition-colors flex items-center justify-center"
                  >
                    {t('swap.returnHome')}
                  </Link>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="bg-white text-[#0a0b0d] px-6 md:px-12 py-[80px]">
          <div className="mx-auto max-w-6xl space-y-10">
            <h2 className="text-[32px] font-normal tracking-[-0.5px]">{t('swap.howTitle')}</h2>
            <div className="grid md:grid-cols-3 gap-5">
              {([
                { n: '1', title: t('swap.how1Title'), desc: t('swap.how1Desc') },
                { n: '2', title: t('swap.how2Title'), desc: t('swap.how2Desc') },
                { n: '3', title: t('swap.how3Title'), desc: t('swap.how3Desc') },
              ] as const).map((s) => (
                <div key={s.n} className="rounded-[20px] bg-[#f7f7f7] border border-[#dee1e6] p-7 space-y-4">
                  <div className="w-9 h-9 rounded-full bg-[#0052ff] text-white flex items-center justify-center font-semibold text-[15px]">{s.n}</div>
                  <h3 className="text-[17px] font-semibold">{s.title}</h3>
                  <p className="text-[15px] text-[#5b616e] leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>

            {/* Warning */}
            <div className="rounded-[20px] bg-[#fff8ec] border border-[#f5a623]/30 p-6 flex gap-4">
              <div className="w-5 h-5 mt-0.5 shrink-0 text-[#f5a623]">
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                </svg>
              </div>
              <div className="space-y-1">
                <p className="text-[14px] font-semibold text-[#0a0b0d]">{t('swap.warningTitle')}</p>
                <p className="text-[14px] text-[#5b616e]">{t('swap.warningDesc')}</p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
