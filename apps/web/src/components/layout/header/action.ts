'use server';

import { auth, signOut } from '@/auth';
import { DEFAULT_LOGIN_REDIRECT } from '@/auth/routes';
import { hcWithType } from 'api/hc';

export const logOut = async () => {
  const session = await auth();
  if (session) {
    const client = hcWithType('http://localhost:3001/');
    const rowResponce = await client.api.v1.logout.$delete({
      json: {
        refreshToken: session.user.refreshToken,
      },
    });

    if (rowResponce.ok || rowResponce.status === 404) {
      await signOut({ redirectTo: DEFAULT_LOGIN_REDIRECT });
    }
  }
};
