'use client';

import dynamic from 'next/dynamic';

const AttestClient = dynamic(() => import('./AttestClient'), { ssr: false });

export default function AttestPage() {
  return <AttestClient />;
}
