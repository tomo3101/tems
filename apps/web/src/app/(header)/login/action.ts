'use server';

import { signIn } from '@/auth';
import { ADMIN_BASE_ROUTE, DEFAULT_LOGIN_REDIRECT } from '@/auth/routes';
import { AuthError } from 'next-auth';

export interface LoginFormState {
  success: boolean;
  role: 'member' | 'admin';
  callbackUrl?: string | null;
  errorMessage?: string;
}

export const sendLogin = async (state: LoginFormState, form: FormData) => {
  try {
    const email = form.get('email');
    const password = form.get('password');
    const role = state.role;

    if (state.callbackUrl === null) {
      if (role === 'admin') {
        state.callbackUrl = ADMIN_BASE_ROUTE;
      } else {
        state.callbackUrl = DEFAULT_LOGIN_REDIRECT;
      }
    }

    await signIn('credentials', {
      email,
      password,
      role,
      redirectTo: state.callbackUrl,
    });

    return {
      success: true,
      role: state.role,
      callbackUrl: state.callbackUrl,
    } as LoginFormState;
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return {
            success: false,
            callbackUrl: state.callbackUrl,
            role: state.role,
            errorMessage: 'メールアドレスまたはパスワードが間違っています',
          } as LoginFormState;

        default:
          return {
            success: false,
            callbackUrl: state.callbackUrl,
            role: state.role,
            errorMessage: 'ログインに失敗しました',
          } as LoginFormState;
      }
    }

    throw error;
  }
};
