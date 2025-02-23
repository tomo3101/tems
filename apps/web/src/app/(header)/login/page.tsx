'use client';

import { LoginForm } from '@/components/layout/login/form';
import { Card, CardBody, CardHeader } from '@heroui/card';
import { useSearchParams } from 'next/navigation';
import { Suspense, useActionState } from 'react';
import { sendLogin } from './action';

const SuspendLoginForm = () => {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl');

  const [state, onSubmit] = useActionState(sendLogin, {
    success: false,
    role: 'member',
    callbackUrl: callbackUrl,
  });

  return <LoginForm onSubmit={onSubmit} state={state} />;
};

export default function LoginPage() {
  return (
    <>
      <Card className="w-full max-w-sm mx-4">
        <CardHeader className="flex justify-center">
          <h2 className="text-2xl">ログイン</h2>
        </CardHeader>
        <CardBody>
          <Suspense>
            <SuspendLoginForm />
          </Suspense>
        </CardBody>
      </Card>
    </>
  );
}
