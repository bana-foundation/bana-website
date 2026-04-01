import { cookies } from 'next/headers';
import type { AppLanguage } from './resources';
import { LANGUAGE_COOKIE } from './constants';

export async function getRequestLanguage(): Promise<AppLanguage> {
  const cookieStore = await cookies();
  const value = cookieStore.get(LANGUAGE_COOKIE)?.value;

  if (value === 'en' || value === 'zh' || value === 'th' || value === 'vi' || value === 'ko') {
    return value;
  }

  return 'en';
}
