'use client';

import { LoginFormState } from '@/app/(header)/login/action';
import { InputPassword } from '@/components/ui/input';
import { Button } from '@heroui/button';
import { Form, FormProps } from '@heroui/form';
import { Input } from '@heroui/input';

interface LoginFormProps {
  onSubmit: FormProps['action'];
  state: LoginFormState;
}

export const LoginForm = ({ onSubmit, state }: LoginFormProps) => {
  return (
    <>
      <Form
        className="w-full max-w-sm flex flex-col gap-3"
        validationBehavior="native"
        action={onSubmit}
      >
        <Input
          isRequired
          errorMessage="メールアドレスを入力してください"
          label="メールアドレス"
          labelPlacement="outside"
          name="email"
          autoComplete="email"
          placeholder="メールアドレスを入力してください"
          id="credentials-email"
        />

        <InputPassword
          isRequired
          errorMessage="パスワードを入力してください"
          label="パスワード"
          labelPlacement="outside"
          name="password"
          autoComplete="current-password"
          placeholder="パスワードを入力してください"
          id="credentials-password"
        />

        {state.errorMessage && (
          <p className="text-red-500">{state.errorMessage}</p>
        )}

        <Button variant="solid" color="primary" type="submit">
          ログイン
        </Button>
      </Form>
    </>
  );
};
