import { cookies } from 'next/headers';
import type { AppLanguage } from './resources';
import { LANGUAGE_COOKIE } from './constants';

export async function getRequestLanguage(): Promise<AppLanguage> {
  const cookieStore = await cookies();
  const value = cookieStore.get(LANGUAGE_COOKIE)?.value;

  return value === 'en' ? 'en' : 'ko';
}
