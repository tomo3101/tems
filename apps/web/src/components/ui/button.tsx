'use client';

import { logOut } from '@/auth/logout';
import { TrainIcon } from '@/components/ui/icon';
import { MagnifyingGlassIcon } from '@heroicons/react/24/solid';
import { Button, ButtonProps } from '@heroui/button';
import Link from 'next/link';

export const LoginButton = (props: ButtonProps) => {
  return (
    <Button {...props} as={Link} href="/login">
      ログイン
    </Button>
  );
};

export const LogoutButton = (props: ButtonProps) => {
  return (
    <Button {...props} onPress={() => logOut()}>
      ログアウト
    </Button>
  );
};

export const RegisterButton = (props: ButtonProps) => {
  return (
    <Button {...props} as={Link} href="/register">
      会員登録
    </Button>
  );
};

export const NewReserveButton = (props: ButtonProps) => {
  return (
    <Button
      {...props}
      as={Link}
      href="/reserve/search"
      startContent={<TrainIcon />}
    >
      <p className="text-lg">新規予約</p>
    </Button>
  );
};

export const MyReservationsButton = (props: ButtonProps) => {
  return (
    <Button
      {...props}
      as={Link}
      href="/mypage/reservation"
      startContent={<MagnifyingGlassIcon className="size-6" />}
    >
      <p className="text-lg">予約確認</p>
    </Button>
  );
};

export const MyAccountSettingsButton = (props: ButtonProps) => {
  return (
    <Button {...props} as={Link} href="/mypage/account">
      <p className="text-lg">アカウント設定</p>
    </Button>
  );
};

export const MyPasswordSettingsButton = (props: ButtonProps) => {
  return (
    <Button {...props} as={Link} href="/mypage/password">
      <p className="text-lg">パスワード変更</p>
    </Button>
  );
};
