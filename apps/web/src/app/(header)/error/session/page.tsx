'use client';

import { logOut } from '@/auth/logout';
import { Button } from '@heroui/button';
import { Card, CardBody, CardFooter, CardHeader } from '@heroui/card';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

const LogInButton = () => {
  const callbackUrl = useSearchParams().get('callbackUrl');

  const logInUrl = callbackUrl
    ? '/login?callbackUrl=' + encodeURIComponent(callbackUrl)
    : '/login';

  return (
    <Button variant="flat" color="primary" onPress={() => logOut(logInUrl)}>
      ログイン
    </Button>
  );
};

export default function SessionErrorPage() {
  return (
    <>
      <Card className="w-full max-w-sm">
        <CardHeader className="flex justify-center">
          <h1 className="text-2xl font-medium">エラー</h1>
        </CardHeader>
        <CardBody>
          <p>
            セッションの有効期限が切れました。お手数をおかけしますが、再度ログインしてください。
          </p>
        </CardBody>
        <CardFooter className="flex justify-center">
          <Suspense>
            <LogInButton />
          </Suspense>
        </CardFooter>
      </Card>
    </>
  );
}
