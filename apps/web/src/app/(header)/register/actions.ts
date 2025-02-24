'use server';

import { hc } from '@/utils/hc';

interface RegisterFormState {
  status?: 'success' | 'error';
  errors: {
    name?: string;
    email?: string;
    password?: string;
    passwordConfirm?: string;
    message?: string;
  };
}

export const sendRegister = async (
  _state: RegisterFormState,
  form: FormData,
) => {
  const client = hc;

  const name = form.get('name');
  const email = form.get('email');
  const password = form.get('password');
  const passwordConfirm = form.get('passwordConfirm');

  const errors: RegisterFormState['errors'] = {};
  if (!name) {
    errors['name'] = 'アカウント名を入力してください';
  }

  if (!email) {
    errors['email'] = 'メールアドレスを入力してください';
  }

  if (!password) {
    errors['password'] = 'パスワードを入力してください';
  }

  if (!passwordConfirm) {
    errors['passwordConfirm'] = 'パスワードを再度入力してください';
  }

  if (!(name && email && password && passwordConfirm)) {
    return {
      status: 'error',
      errors,
    } as RegisterFormState;
  }

  if (password !== passwordConfirm) {
    return {
      status: 'error',
      errors: {
        passwordConfirm: 'パスワードが一致しません',
      },
    } as RegisterFormState;
  }

  const rowResponse = await client.api.v1.members.$post({
    json: {
      name: name.toString(),
      email: email.toString(),
      password: password.toString(),
    },
  });

  if (rowResponse.ok) {
    return {
      status: 'success',
      errors: {},
    } as RegisterFormState;
  }

  const response = await rowResponse.json();

  if (response.error === 'email already exists') {
    return {
      status: 'error',
      errors: {
        email: 'メールアドレスは既に登録されています',
      },
    } as RegisterFormState;
  }

  return {
    status: 'error',
    errors: {
      message: '登録に失敗しました',
    },
  } as RegisterFormState;
};
