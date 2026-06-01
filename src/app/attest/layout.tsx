import { Web3ModalProvider } from '@/context/Web3Modal';
import { type ReactNode } from 'react';

export default function AttestLayout({ children }: { children: ReactNode }) {
  return <Web3ModalProvider>{children}</Web3ModalProvider>;
}
