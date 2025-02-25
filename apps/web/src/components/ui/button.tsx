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

export const AdminPageButton = (props: ButtonProps) => {
  return (
    <Button {...props} as={Link} href="/admin">
      <p className="text-lg">管理者ページ</p>
    </Button>
  );
};

export const AdminAccountButton = (props: ButtonProps) => {
  return (
    <Button {...props} as={Link} href="/admin/account">
      <p className="text-lg">管理アカウント設定</p>
    </Button>
  );
};

export const AdminPasswordSettingsButton = (props: ButtonProps) => {
  return (
    <Button {...props} as={Link} href="/admin/password">
      <p className="text-lg">パスワード変更</p>
    </Button>
  );
};

export const DashboardAdminButton = (props: ButtonProps) => {
  return (
    <Button {...props} as={Link} href="/admin/dashboard/admin">
      <p className="text-lg">管理者一覧</p>
    </Button>
  );
};

export const DashBoardMemberButton = (props: ButtonProps) => {
  return (
    <Button {...props} as={Link} href="/admin/dashboard/member">
      <p className="text-lg">会員一覧</p>
    </Button>
  );
};

export const DashBoardEventButton = (props: ButtonProps) => {
  return (
    <Button {...props} as={Link} href="/admin/dashboard/event">
      <p className="text-lg">イベント一覧</p>
    </Button>
  );
};

export const DashBoardReservationButton = (props: ButtonProps) => {
  return (
    <Button {...props} as={Link} href="/admin/dashboard/reservation">
      <p className="text-lg">予約一覧</p>
    </Button>
  );
};
