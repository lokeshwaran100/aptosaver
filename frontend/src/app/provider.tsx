// app/providers.tsx
'use client';

import { CacheProvider } from '@chakra-ui/next-js';
import { ChakraProvider } from '@chakra-ui/react';
import { UserProvider } from '@/context/UserContext';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <CacheProvider>
      <UserProvider>
      <ChakraProvider>{children}</ChakraProvider>
      </UserProvider>
    </CacheProvider>
  );
}