'use client';

import { sendLogout } from '@/auth/actions/sendLogout';
import { DEFAULT_LOGIN_REDIRECT } from '@/auth/routes';

export const logOut = async (redirectTo?: string | null) => {
  await sendLogout();
  window.location.replace(redirectTo || DEFAULT_LOGIN_REDIRECT);
};
