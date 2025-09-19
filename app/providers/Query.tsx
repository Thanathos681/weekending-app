import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { persistQueryClient } from '@tanstack/react-query-persist-client';

const qc = new QueryClient({ defaultOptions: { queries: { retry: 1, staleTime: 10000 } } });
const persister = createAsyncStoragePersister({ storage: AsyncStorage });
persistQueryClient({ queryClient: qc, persister, maxAge: 1000*60*60*24 });

export const QueryProvider: React.FC<React.PropsWithChildren> = ({ children }) =>
  <QueryClientProvider client={qc}>{children}</QueryClientProvider>;
