import { createClient } from '@supabase/supabase-js';
import { Wallet } from 'ethers';
import { config } from 'dotenv';

config({ path: '.env' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
);

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function main() {
  const today = new Date().toISOString().split('T')[0];
  const count = randomInt(50, 100);

  console.log(`[${new Date().toLocaleString('ko-KR')}] ${count}개 지갑 생성 시작`);

  const rows = [];
  for (let i = 0; i < count; i++) {
    const wallet = Wallet.createRandom();
    rows.push({ address: wallet.address, join_date: today });
  }

  const { error } = await supabase.from('wallets').upsert(rows, { onConflict: 'address', ignoreDuplicates: true });

  if (error) {
    console.error('Insert error:', error.message);
    process.exit(1);
  }

  console.log(`✅ ${count}개 지갑 등록 완료`);
}

main();
