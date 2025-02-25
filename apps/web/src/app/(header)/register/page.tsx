'use client';

import { LoginButton } from '@/components/ui/button';
import { InputPassword } from '@/components/ui/input';
import { Button } from '@heroui/button';
import { Card, CardBody, CardHeader } from '@heroui/card';
import { Form } from '@heroui/form';
import { Input } from '@heroui/input';
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '@heroui/modal';
import { startTransition, useActionState } from 'react';
import { sendRegister } from './actions';

export default function RegisterPage() {
  const [state, formAction] = useActionState(sendRegister, {
    errors: {},
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    startTransition(() => {
      formAction(formData);
    });
  };

  return (
    <>
      <Card className="w-full max-w-sm mx-4">
        <CardHeader className="flex justify-center">
          <h2 className="text-2xl font-medium">会員登録</h2>
        </CardHeader>
        <CardBody>
          <Form
            className="flex flex-col gap-3"
            validationBehavior="native"
            validationErrors={state.errors}
            onSubmit={handleSubmit}
          >
            <Input
              isRequired
              label="アカウント名"
              labelPlacement="outside"
              name="name"
              autoComplete="name"
              placeholder="アカウント名を入力してください"
            />
            <Input
              isRequired
              label="メールアドレス"
              labelPlacement="outside"
              name="email"
              autoComplete="email"
              type="email"
              placeholder="メールアドレスを入力してください"
            />
            <InputPassword
              isRequired
              label="パスワード"
              labelPlacement="outside"
              name="password"
              autoComplete="new-password"
              placeholder="パスワードを入力してください"
            />
            <InputPassword
              isRequired
              label="パスワードの確認"
              labelPlacement="outside"
              name="passwordConfirm"
              autoComplete="new-password"
              placeholder="パスワードを再度入力してください"
            />

            {state.errors.message && (
              <div className="flex flex-col">
                <p className="text-red-500">{state.errors.message}</p>
                <p>もう一度やり直してください</p>
              </div>
            )}

            <Button variant="solid" color="primary" type="submit">
              登録
            </Button>
          </Form>
        </CardBody>
      </Card>
      <Modal
        isOpen={state.status === 'success'}
        placement="center"
        hideCloseButton
      >
        <ModalContent>
          <ModalHeader>登録完了</ModalHeader>
          <ModalBody>
            <p>登録が完了しました。以下のボタンからログインしてください。</p>
          </ModalBody>
          <ModalFooter>
            <LoginButton variant="solid" color="primary" />
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
