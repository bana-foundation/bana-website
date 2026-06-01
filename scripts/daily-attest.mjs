import { createClient } from '@supabase/supabase-js';
import { Wallet } from 'ethers';
import { readFileSync } from 'fs';
import { config } from 'dotenv';

config({ path: '.env' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
);

const CHECKUP_TYPES = [
  'Annual Physical',
  'Blood Test',
  'Vision Exam',
  'Dental Checkup',
  'Cardiac Screening',
  'Cancer Screening',
];

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomCheckupType() {
  return CHECKUP_TYPES[Math.floor(Math.random() * CHECKUP_TYPES.length)];
}

function randomPastDate(daysBack = 90) {
  const d = new Date();
  d.setDate(d.getDate() - randomInt(1, daysBack));
  return d.toISOString().split('T')[0];
}

async function main() {
  // 오늘 날짜로 이미 들어간 수 확인
  const today = new Date().toISOString().split('T')[0];
  const { count: todayCount } = await supabase
    .from('attestations')
    .select('*', { count: 'exact', head: true })
    .eq('attested_at::date', today);

  if (todayCount > 0) {
    console.log(`Already added ${todayCount} attestations today. Skipping.`);
    process.exit(0);
  }

  // 전체 attestations 수 (= 다음 시작 인덱스)
  const { count: totalCount } = await supabase
    .from('attestations')
    .select('*', { count: 'exact', head: true });

  const offset = totalCount ?? 0;

  // 지갑 로드
  const wallets = JSON.parse(readFileSync('./bsc_wallets.json', 'utf-8'));

  if (offset >= wallets.length) {
    console.log('All wallets have been attested.');
    process.exit(0);
  }

  // 오늘 추가할 수 (85~115 랜덤)
  const dailyCount = randomInt(85, 115);
  const batch = wallets.slice(offset, offset + dailyCount);

  console.log(`Adding ${batch.length} attestations (offset: ${offset})...`);

  const rows = [];
  for (const w of batch) {
    const checkupType = randomCheckupType();
    const checkupDate = randomPastDate(90);
    const wallet = new Wallet('0x' + w.private_key);

    const message = [
      'BANA Health Attestation',
      '',
      'I certify that I have completed a health checkup.',
      '',
      `Checkup Type: ${checkupType}`,
      `Checkup Date: ${checkupDate}`,
      `Wallet: ${wallet.address}`,
      `Timestamp: ${Date.now()}`,
      '',
      'This attestation is recorded on the BANA Protocol.',
    ].join('\n');

    const signature = await wallet.signMessage(message);

    rows.push({
      address: wallet.address,
      checkup_date: checkupDate,
      checkup_type: checkupType,
      signature,
    });
  }

  const { error } = await supabase.from('attestations').insert(rows);
  if (error) {
    console.error('Insert error:', error.message);
    process.exit(1);
  }

  console.log(`Done! Added ${rows.length} attestations.`);
}

main();
