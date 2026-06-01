import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { config } from 'dotenv';

config({ path: '.env' });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY in .env');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const START_DATE = new Date('2026-02-19');
const END_DATE = new Date();
END_DATE.setHours(0, 0, 0, 0);

function seededRandom(seed) {
  const x = Math.sin(seed + 1) * 10000;
  return x - Math.floor(x);
}

function assignDates(totalCount) {
  const totalDays = Math.floor((END_DATE - START_DATE) / 86400000) + 1;
  const weights = [];
  for (let d = 0; d < totalDays; d++) {
    const progress = d / totalDays;
    const weight = 0.3 + progress * 1.4 + Math.sin(progress * Math.PI) * 0.3;
    weights.push(weight);
  }
  const totalWeight = weights.reduce((a, b) => a + b, 0);

  const dates = [];
  let idx = 0;
  for (let d = 0; d < totalDays; d++) {
    const count = Math.round((weights[d] / totalWeight) * totalCount);
    const date = new Date(START_DATE);
    date.setDate(date.getDate() + d);
    const dateStr = date.toISOString().split('T')[0];
    for (let i = 0; i < count && idx < totalCount; i++, idx++) {
      dates.push(dateStr);
    }
  }
  while (dates.length < totalCount) {
    dates.push(END_DATE.toISOString().split('T')[0]);
  }
  return dates;
}

async function main() {
  console.log('Reading bsc_wallets.json...');
  const wallets = JSON.parse(readFileSync('./bsc_wallets.json', 'utf-8'));
  console.log(`Total wallets: ${wallets.length}`);

  const dates = assignDates(wallets.length);

  const rows = wallets.map((w, i) => ({
    address: w.address,
    join_date: dates[i],
  }));

  const BATCH = 1000;
  let uploaded = 0;

  for (let i = 0; i < rows.length; i += BATCH) {
    const batch = rows.slice(i, i + BATCH);
    const { error } = await supabase.from('wallets').upsert(batch, { onConflict: 'address' });
    if (error) {
      console.error(`Error at batch ${i}:`, error.message);
      process.exit(1);
    }
    uploaded += batch.length;
    process.stdout.write(`\rUploaded: ${uploaded} / ${rows.length}`);
  }

  console.log('\nDone!');
}

main();
