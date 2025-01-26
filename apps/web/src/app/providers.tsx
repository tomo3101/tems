'use client';

import { HeroUIProvider } from '@heroui/react';
import type { ThemeProviderProps } from 'next-themes';
import { ThemeProvider as NextThemasProvider } from 'next-themes';
import { useRouter } from 'next/navigation';

interface ProvidersProps {
  children: React.ReactNode;
  themaProps?: ThemeProviderProps;
}

declare module '@react-types/shared' {
  interface RouterConfig {
    routerOptions: NonNullable<
      Parameters<ReturnType<typeof useRouter>['push']>[1]
    >;
  }
}

export function Providers({ children, themaProps }: ProvidersProps) {
  return (
    <HeroUIProvider navigate={router.push}>
      <NextThemasProvider {...themaProps}>{children}</NextThemasProvider>
    </HeroUIProvider>
  );
}
