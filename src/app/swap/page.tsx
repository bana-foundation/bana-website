'use client';

import dynamic from 'next/dynamic';

const SwapClient = dynamic(() => import('./SwapClient'), { ssr: false });

export default function SwapPage() {
  return <SwapClient />;
}
