'use client';

import { HeroUIProvider } from '@heroui/react';
import type { ThemeProviderProps } from 'next-themes';
import { ThemeProvider as NextThemasProvider } from 'next-themes';

interface ProvidersProps {
  children: React.ReactNode;
  themaProps?: ThemeProviderProps;
}

export function Providers({ children, themaProps }: ProvidersProps) {
  return (
    <HeroUIProvider>
      <NextThemasProvider {...themaProps}>{children}</NextThemasProvider>
    </HeroUIProvider>
  );
}
