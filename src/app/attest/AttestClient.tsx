'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { useAccount, useConnect, useDisconnect, useSignMessage } from 'wagmi';

const CHECKUP_TYPES = [
  'Annual Physical',
  'Blood Test',
  'Vision Exam',
  'Dental Checkup',
  'Cardiac Screening',
  'Cancer Screening',
  'Other',
];

type Step = 'idle' | 'checking' | 'new' | 'already' | 'attesting' | 'done';

interface ExistingAttestation {
  address: string;
  checkup_date: string;
  checkup_type: string;
  signature: string;
  attested_at: string;
}

export default function AttestPage() {
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();

  const metaMaskConnector = connectors.find(c => c.type === 'injected');
  const wcConnector = connectors.find(c => c.type === 'walletConnect');
  const { signMessageAsync } = useSignMessage();

  const [step, setStep] = useState<Step>('idle');
  const [showConnectors, setShowConnectors] = useState(false);
  const [checkupDate, setCheckupDate] = useState('');
  const [checkupType, setCheckupType] = useState(CHECKUP_TYPES[0]);
  const [agreed, setAgreed] = useState(false);
  const [existing, setExisting] = useState<ExistingAttestation | null>(null);
  const [newAttestation, setNewAttestation] = useState<ExistingAttestation | null>(null);
  const [error, setError] = useState('');
  const [totalCount, setTotalCount] = useState(0);
  const [todayCount, setTodayCount] = useState(0);

  useEffect(() => {
    setCheckupDate(new Date().toISOString().split('T')[0]);
    void (async () => {
      const today = new Date().toISOString().split('T')[0];
      const [totalRes, todayRes] = await Promise.all([
        supabase.from('attestations').select('*', { count: 'exact', head: true }),
        supabase.from('attestations').select('*', { count: 'exact', head: true }).gte('attested_at', today),
      ]);
      setTotalCount(totalRes.count ?? 0);
      setTodayCount(todayRes.count ?? 0);
    })();
  }, []);

  // 지갑 연결되면 어테스테이션 상태 확인
  useEffect(() => {
    if (!isConnected || !address) {
      if (step !== 'idle') setStep('idle');
      return;
    }
    if (step === 'idle') {
      setStep('checking');
      void (async () => {
        const { data } = await supabase
          .from('attestations')
          .select('*')
          .eq('address', address)
          .order('attested_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        if (data) {
          setExisting(data as ExistingAttestation);
          setStep('already');
        } else {
          setStep('new');
        }
      })();
    }
  }, [isConnected, address, step]);

  async function attest() {
    if (!agreed || !checkupDate || !address) return;
    setError('');
    setStep('attesting');

    const message = [
      'BANA Health Attestation',
      '',
      'I certify that I have completed a health checkup.',
      '',
      `Checkup Type: ${checkupType}`,
      `Checkup Date: ${checkupDate}`,
      `Wallet: ${address}`,
      `Timestamp: ${Date.now()}`,
      '',
      'This attestation is recorded on the BANA Protocol.',
    ].join('\n');

    try {
      const signature = await signMessageAsync({ message });

      const today = new Date().toISOString().split('T')[0];
      await Promise.all([
        supabase.from('attestations').insert({
          address,
          checkup_date: checkupDate,
          checkup_type: checkupType,
          signature,
        }),
        supabase.from('wallets').upsert(
          { address, join_date: today },
          { onConflict: 'address', ignoreDuplicates: true }
        ),
      ]);

      setNewAttestation({
        address,
        checkup_date: checkupDate,
        checkup_type: checkupType,
        signature,
        attested_at: new Date().toISOString(),
      });
      setTotalCount((c) => c + 1);
      setStep('done');
    } catch {
      setError('Signing cancelled.');
      setStep('new');
    }
  }

  const displayAttestation = step === 'done' ? newAttestation : existing;

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
              onClick={() => { disconnect(); setStep('idle'); setExisting(null); setNewAttestation(null); }}
              className="text-[12px] text-white/30 hover:text-white/70 transition-colors px-2"
            >
              Disconnect
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
                  <span className="h-2 w-2 rounded-full bg-[#05b169]" />
                  Health RWA · BNB Chain
                </div>
                <h1 className="text-[40px] md:text-[56px] font-normal leading-[1.1] tracking-[-1.4px]">
                  Health Data<br />Attestation
                </h1>
                <p className="text-[17px] text-[#a8acb3] max-w-md leading-relaxed">
                  Attest your health checkup completion on-chain. Earn BANA rewards and contribute to real-world health data infrastructure.
                </p>
              </div>

              {/* Stats */}
              <div className="pt-8 border-t border-white/10 grid grid-cols-2 gap-8">
                <div>
                  <p className="text-[12px] text-[#a8acb3] font-medium mb-1 uppercase tracking-wider">Total Attestations</p>
                  <p className="text-[28px] font-medium font-mono">{totalCount.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-[12px] text-[#a8acb3] font-medium mb-1 uppercase tracking-wider">Today</p>
                  <p className="text-[28px] font-medium font-mono text-[#05b169]">+{todayCount.toLocaleString()}</p>
                </div>
              </div>

              {/* Wallet info bar - shown when connected */}
              {isConnected && address && step !== 'checking' && (
                <div className="rounded-[16px] bg-[#16181c] border border-white/8 p-5 space-y-3">
                  <p className="text-[11px] text-[#a8acb3] uppercase tracking-widest font-medium">Wallet</p>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[14px] text-white">{address.slice(0, 16)}...{address.slice(-8)}</span>
                    <a
                      href={`https://bscscan.com/address/${address}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[12px] text-[#0052ff] hover:underline"
                    >
                      BscScan ↗
                    </a>
                  </div>
                  <div className="flex items-center gap-3 pt-1">
                    <span className="flex items-center gap-1.5 rounded-full bg-[#0a0b0d] border border-white/10 px-3 py-1 text-[12px] text-white/60">
                      <span className="h-1.5 w-1.5 rounded-full bg-yellow-400" />
                      BNB Chain
                    </span>
                    {(step === 'already' || step === 'done') ? (
                      <span className="flex items-center gap-1.5 rounded-full bg-[#05b169]/10 border border-[#05b169]/20 px-3 py-1 text-[12px] text-[#05b169]">
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                        Attested
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5 rounded-full bg-white/5 border border-white/10 px-3 py-1 text-[12px] text-[#a8acb3]">
                        Not yet attested
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Right: DApp Card */}
            <div className="bg-[#16181c] rounded-[24px] shadow-2xl border border-white/5 overflow-hidden">

              {/* Landing */}
              {!isConnected && (
                <div className="p-8 md:p-10 space-y-8">
                  <div className="space-y-2">
                    <h3 className="text-[24px] font-normal tracking-tight">Connect Wallet</h3>
                    <p className="text-[15px] text-[#a8acb3]">Connect to verify your health checkup and earn BANA.</p>
                  </div>
                  <div className="rounded-[16px] bg-[#0a0b0d] border border-white/8 p-5 space-y-3">
                    {[
                      { label: 'Network', value: 'BNB Chain' },
                      { label: 'Reward', value: '100 BANA' },
                      { label: 'Gas Required', value: 'None (sign only)' },
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
                      Connect Wallet
                    </button>
                  ) : (
                    <div className="space-y-3">
                      {metaMaskConnector && (
                        <button
                          onClick={() => connect({ connector: metaMaskConnector })}
                          className="w-full h-[52px] rounded-full bg-[#f5841f] hover:bg-[#e07010] text-white text-[15px] font-semibold transition-colors flex items-center justify-center gap-2"
                        >
                          MetaMask
                        </button>
                      )}
                      {wcConnector && (
                        <button
                          onClick={() => connect({ connector: wcConnector })}
                          className="w-full h-[52px] rounded-full bg-[#3b99fc] hover:bg-[#2a88eb] text-white text-[15px] font-semibold transition-colors flex items-center justify-center gap-2"
                        >
                          WalletConnect
                        </button>
                      )}
                      <button onClick={() => setShowConnectors(false)} className="w-full text-[13px] text-[#7c828a] hover:text-white transition-colors py-1">
                        Cancel
                      </button>
                    </div>
                  )}
                  <p className="text-[12px] text-[#7c828a] text-center">MetaMask, WalletConnect, and more</p>
                </div>
              )}

              {/* Checking */}
              {step === 'checking' && (
                <div className="p-8 md:p-10 py-20 flex flex-col items-center justify-center space-y-5">
                  <div className="w-12 h-12 rounded-full border-[3px] border-white/10 border-t-[#0052ff] animate-spin" />
                  <p className="text-[15px] text-[#a8acb3]">Checking attestation status...</p>
                </div>
              )}

              {/* New - form */}
              {step === 'new' && (
                <div className="p-8 md:p-10 space-y-8">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <h3 className="text-[24px] font-normal tracking-tight">New Attestation</h3>
                    </div>
                    <p className="text-[15px] text-[#a8acb3]">Enter your checkup details to receive your on-chain certificate.</p>
                  </div>

                  <div className="space-y-5">
                    <div className="space-y-2">
                      <label className="block text-[13px] font-medium text-[#a8acb3]">Checkup Type</label>
                      <select
                        value={checkupType}
                        onChange={(e) => setCheckupType(e.target.value)}
                        className="w-full h-[48px] rounded-[12px] bg-[#0a0b0d] border border-white/20 px-4 text-[15px] text-white focus:border-[#0052ff] focus:outline-none transition-colors appearance-none"
                      >
                        {CHECKUP_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="block text-[13px] font-medium text-[#a8acb3]">Checkup Date</label>
                      <input
                        type="date"
                        value={checkupDate}
                        onChange={(e) => setCheckupDate(e.target.value)}
                        max={new Date().toISOString().split('T')[0]}
                        className="w-full h-[48px] rounded-[12px] bg-[#0a0b0d] border border-white/20 px-4 text-[15px] text-white focus:border-[#0052ff] focus:outline-none transition-colors"
                        style={{ colorScheme: 'dark' }}
                      />
                    </div>
                    <label className="flex items-start gap-3 cursor-pointer group pt-1">
                      <div className="relative mt-0.5">
                        <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} className="peer sr-only" />
                        <div className="w-5 h-5 rounded-[4px] border border-white/30 peer-checked:bg-[#0052ff] peer-checked:border-[#0052ff] transition-colors flex items-center justify-center">
                          {agreed && (
                            <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>
                      </div>
                      <span className="text-[14px] text-[#a8acb3] leading-relaxed group-hover:text-white transition-colors">
                        I confirm completion of this health checkup and consent to on-chain recording.
                      </span>
                    </label>
                  </div>

                  {error && <p className="text-[14px] text-[#cf202f]">{error}</p>}

                  <button
                    onClick={attest}
                    disabled={!agreed || !checkupDate}
                    className="w-full h-[56px] rounded-full bg-[#0052ff] hover:bg-[#003ecc] disabled:opacity-40 text-white text-[16px] font-semibold transition-colors disabled:cursor-not-allowed"
                  >
                    Sign & Attest
                  </button>
                </div>
              )}

              {/* Already attested */}
              {(step === 'already' || step === 'done') && displayAttestation && (
                <div className="p-8 md:p-10 space-y-8">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <h3 className="text-[24px] font-normal tracking-tight">
                        {step === 'done' ? 'Attestation Complete' : 'Already Attested'}
                      </h3>
                      <div className="w-6 h-6 rounded-full bg-[#05b169]/10 flex items-center justify-center">
                        <svg className="w-3.5 h-3.5 text-[#05b169]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    </div>
                    {step === 'already' && (
                      <p className="text-[15px] text-[#a8acb3]">This wallet has already claimed its attestation reward.</p>
                    )}
                    {step === 'done' && (
                      <p className="text-[15px] text-[#a8acb3]">Your health attestation is now recorded on-chain.</p>
                    )}
                  </div>

                  <div className="rounded-[16px] bg-[#0a0b0d] border border-white/10 p-5 space-y-4">
                    <p className="text-[11px] text-[#a8acb3] uppercase tracking-widest font-medium mb-2">Certificate Details</p>
                    {[
                      { label: 'Wallet', value: `${displayAttestation.address.slice(0, 10)}...${displayAttestation.address.slice(-8)}`, mono: true },
                      { label: 'Checkup Type', value: displayAttestation.checkup_type },
                      { label: 'Checkup Date', value: displayAttestation.checkup_date },
                      { label: 'Attested', value: new Date(displayAttestation.attested_at).toLocaleDateString() },
                      { label: 'Signature', value: `${displayAttestation.signature.slice(0, 14)}...${displayAttestation.signature.slice(-6)}`, mono: true },
                    ].map((row) => (
                      <div key={row.label} className="flex justify-between items-center text-[14px]">
                        <span className="text-[#a8acb3]">{row.label}</span>
                        <span className={`text-white ${row.mono ? 'font-mono text-[12px]' : ''}`}>{row.value}</span>
                      </div>
                    ))}
                  </div>

                  <div className="rounded-[16px] bg-[#0a0b0d] border border-white/10 p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <p className="text-[11px] text-[#a8acb3] uppercase tracking-widest font-medium">Reward</p>
                      <p className="text-[20px] font-medium text-white mt-1">100 BANA</p>
                    </div>
                    {step === 'already' && (
                      <div className="inline-flex items-center gap-1.5 rounded-full bg-white/5 border border-white/10 px-3 py-1.5 text-[12px] text-[#a8acb3]">
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Limit 1 per wallet
                      </div>
                    )}
                  </div>

                  <Link
                    href="/"
                    className="w-full h-[56px] rounded-full border border-white hover:bg-white hover:text-[#0a0b0d] text-white text-[16px] font-semibold transition-colors flex items-center justify-center"
                  >
                    Return Home
                  </Link>
                </div>
              )}

              {/* Attesting */}
              {step === 'attesting' && (
                <div className="p-8 md:p-10 py-20 flex flex-col items-center justify-center space-y-5">
                  <div className="w-12 h-12 rounded-full border-[3px] border-[#0052ff]/30 border-t-[#0052ff] animate-spin" />
                  <p className="text-[15px] text-[#a8acb3]">Awaiting signature in wallet...</p>
                </div>
              )}
            </div>

          </div>
        </section>

        {/* How It Works */}
        <section className="bg-white text-[#0a0b0d] px-6 md:px-12 py-[80px]">
          <div className="mx-auto max-w-6xl space-y-10">
            <h2 className="text-[32px] font-normal tracking-[-0.5px]">How It Works</h2>
            <div className="grid md:grid-cols-3 gap-5">
              {[
                { n: '1', title: 'Connect Wallet', desc: 'Connect your BNB Chain compatible wallet. No gas required.' },
                { n: '2', title: 'Verify Details', desc: 'Enter your health checkup type and date.' },
                { n: '3', title: 'Sign & Earn', desc: 'Sign the attestation message and earn 100 BANA. One per wallet.' },
              ].map((s) => (
                <div key={s.n} className="rounded-[20px] bg-[#f7f7f7] border border-[#dee1e6] p-7 space-y-4">
                  <div className="w-9 h-9 rounded-full bg-[#0052ff] text-white flex items-center justify-center font-semibold text-[15px]">{s.n}</div>
                  <h3 className="text-[17px] font-semibold">{s.title}</h3>
                  <p className="text-[15px] text-[#5b616e] leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
