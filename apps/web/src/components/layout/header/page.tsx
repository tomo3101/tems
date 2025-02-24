'use client';

import { sendLogout } from '@/auth/actions/sendLogout';
import { LoginButton, RegisterButton } from '@/components/ui/button';
import { useCurrentSession } from '@/hook/useCurrentSession';
import { ChevronDownIcon } from '@heroicons/react/24/solid';
import { Avatar } from '@heroui/avatar';
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from '@heroui/dropdown';
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle,
} from '@heroui/navbar';
import { Button, Link } from '@heroui/react';
import { Spinner } from '@heroui/spinner';
import NextLink from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const { session } = useCurrentSession();

  return (
    <Navbar
      isBlurred={false}
      maxWidth="lg"
      isMenuOpen={isMenuOpen}
      onMenuOpenChange={setIsMenuOpen}
    >
      <NavbarContent justify="start">
        <NavbarMenuToggle
          aria-label={isMenuOpen ? 'Close Menu' : 'Open Menu'}
          className="md:hidden"
        />
        <NavbarBrand as="li" className="max-w-fit">
          <NextLink className="flex justify-start items-center gap-2" href="/">
            <p className="text-2xl font-black text-inherit">TEMS</p>
          </NextLink>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="hidden md:flex gap-4" justify="center">
        <NavigationItem />
      </NavbarContent>

      <NavbarContent justify="end">
        <NavigationLoginMenu />
      </NavbarContent>
      <NavbarMenu>
        {(session?.user.role === 'admin' && (
          <>
            {adminMenuItems.map((item) => (
              <NavbarMenuItem key={item.key}>
                {item.dropdown ? (
                  <>
                    <Dropdown>
                      <DropdownTrigger>
                        <Button
                          disableRipple
                          endContent={<ChevronDownIcon className="size-6" />}
                          radius="sm"
                          variant="light"
                          className={`p-0 text-lg ${
                            pathname.startsWith('/admin/dashboard')
                              ? 'text-primary'
                              : ''
                          }`}
                        >
                          {item.label}
                        </Button>
                      </DropdownTrigger>
                      <DropdownMenu
                        aria-label={item.label}
                        items={item.dropdown}
                      >
                        {(item) => (
                          <DropdownItem
                            key={item.key}
                            textValue={item.label}
                            aria-current={
                              pathname === item.href ? 'page' : undefined
                            }
                            color={
                              pathname === item.href ? 'primary' : 'default'
                            }
                            className={
                              pathname === item.href ? 'text-primary' : ''
                            }
                            href={item.href}
                          >
                            {item.label}
                          </DropdownItem>
                        )}
                      </DropdownMenu>
                    </Dropdown>
                  </>
                ) : (
                  <Link
                    aria-current={pathname === item.href ? 'page' : undefined}
                    color={pathname === item.href ? 'primary' : 'foreground'}
                    href={item.href}
                    size="lg"
                  >
                    {item.label}
                  </Link>
                )}
              </NavbarMenuItem>
            ))}
          </>
        )) || (
          <>
            {menuItems.map((item) => (
              <NavbarMenuItem key={item.key}>
                <Link
                  className="w-full"
                  color={pathname === item.href ? 'primary' : 'foreground'}
                  href={item.href}
                  size="lg"
                  onPress={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </Link>
              </NavbarMenuItem>
            ))}
          </>
        )}
      </NavbarMenu>
    </Navbar>
  );
};

const menuItems = [
  {
    key: 'home',
    label: 'ホーム',
    href: '/',
  },
  {
    key: 'blog',
    label: 'ブログ',
    href: '/blog',
  },
  {
    key: 'news',
    label: 'お知らせ',
    href: '/news',
  },
  {
    key: 'status',
    label: '空き状況',
    href: '/status',
  },
  {
    key: 'waiting',
    label: '待ち状況',
    href: '/waiting',
  },
];

const adminMenuItems = [
  {
    key: 'admin',
    label: '管理トップ',
    href: '/admin',
  },
  {
    key: 'admin/dashboard',
    label: '管理ダッシュボード',
    dropdown: [
      {
        key: 'admin/dashboard/event',
        label: 'イベント',
        href: '/admin/dashboard/event',
      },
      {
        key: 'admin/dashboard/reservation',
        label: '予約',
        href: '/admin/dashboard/reservation',
      },
      {
        key: 'admin/dashboard/member',
        label: '会員',
        href: '/admin/dashboard/member',
      },
      {
        key: 'admin/dashboard/admin',
        label: '管理者',
        href: '/admin/dashboard/admin',
      },
    ],
  },
  {
    key: 'admin/call',
    label: '予約呼出',
    href: '/admin/call',
  },
  {
    key: 'admin/receipt',
    label: '受付端末用画面',
    href: '/admin/receipt',
  },
];

const NavigationItem = () => {
  const pathname = usePathname();
  const { session } = useCurrentSession();

  switch (session?.user.role) {
    case 'admin':
      return (
        <>
          {adminMenuItems.map((item) => (
            <NavbarItem key={item.key}>
              {item.dropdown ? (
                <>
                  <Dropdown>
                    <DropdownTrigger>
                      <Button
                        disableRipple
                        endContent={<ChevronDownIcon className="size-6" />}
                        radius="sm"
                        variant="light"
                        className={`text-lg ${pathname.startsWith('/admin/dashboard') ? 'text-primary' : ''}`}
                      >
                        {item.label}
                      </Button>
                    </DropdownTrigger>
                    <DropdownMenu aria-label={item.label} items={item.dropdown}>
                      {(item) => (
                        <DropdownItem
                          key={item.key}
                          textValue={item.label}
                          aria-current={
                            pathname === item.href ? 'page' : undefined
                          }
                          color={pathname === item.href ? 'primary' : 'default'}
                          className={
                            pathname === item.href ? 'text-primary' : ''
                          }
                          href={item.href}
                        >
                          {item.label}
                        </DropdownItem>
                      )}
                    </DropdownMenu>
                  </Dropdown>
                </>
              ) : (
                <Link
                  aria-current={pathname === item.href ? 'page' : undefined}
                  color={pathname === item.href ? 'primary' : 'foreground'}
                  href={item.href}
                  size="lg"
                >
                  {item.label}
                </Link>
              )}
            </NavbarItem>
          ))}
        </>
      );

    default:
      return (
        <>
          {menuItems.map((item) => (
            <NavbarItem key={item.key}>
              <Link
                aria-current={pathname === item.href ? 'page' : undefined}
                color={pathname === item.href ? 'primary' : 'foreground'}
                href={item.href}
                size="lg"
              >
                {item.label}
              </Link>
            </NavbarItem>
          ))}
        </>
      );
  }
};

const NavigationLoginMenu = () => {
  const { session, status } = useCurrentSession();

  const memberItems = [
    {
      key: 'profile',
      label: `${session?.user.name}様`,
    },
    {
      key: 'mypage',
      label: 'マイページ',
      href: '/mypage',
    },
    {
      key: 'reserve/search',
      label: '新規予約',
      href: '/reserve/search',
    },
    {
      key: 'mypage/reservation',
      label: '予約確認',
      href: '/mypage/reservation',
    },
    {
      key: 'logout',
      label: 'ログアウト',
      onPress: () => sendLogout(),
    },
  ];

  const adminItems = [
    {
      key: 'profile',
      label: `${session?.user.name}様`,
    },
    {
      key: 'admin',
      label: '管理トップ',
      href: '/admin',
    },
    {
      key: 'admin/call',
      label: '予約呼出',
      href: '/admin/call',
    },
    {
      key: 'admin/receipt',
      label: '受付端末用画面',
      href: '/admin/receipt',
    },
    {
      key: 'admin/account',
      label: '管理アカウント設定',
      href: '/admin/account',
    },
    {
      key: 'logout',
      label: 'ログアウト',
      onPress: () => sendLogout(),
    },
  ];

  if (session?.user) {
    return (
      <Dropdown placement="bottom-end">
        <DropdownTrigger>
          <Avatar
            isBordered
            showFallback
            as="button"
            className="transition-transform"
            color="default"
            size="sm"
            src={session.user.image ?? ''}
          />
        </DropdownTrigger>
        <DropdownMenu
          aria-label="User Menu"
          variant="solid"
          items={session.user.role === 'admin' ? adminItems : memberItems}
        >
          {(item) => (
            <DropdownItem
              key={item.key}
              textValue={item.label}
              className={`${item.key === 'logout' ? 'text-danger' : ''}`}
              color={item.key === 'logout' ? 'danger' : 'default'}
              href={item.href}
              onPress={item.onPress}
            >
              {item.key === 'profile' ? (
                <p className="font-semibold">{item.label}</p>
              ) : (
                item.label
              )}
            </DropdownItem>
          )}
        </DropdownMenu>
      </Dropdown>
    );
  } else {
    if (status === 'loading') {
      return <Spinner size="sm" />;
    }

    return (
      <>
        <NavbarItem>
          <RegisterButton variant="flat" color="primary" />
        </NavbarItem>
        <NavbarItem>
          <LoginButton variant="flat" color="primary" />
        </NavbarItem>
      </>
    );
  }
};
