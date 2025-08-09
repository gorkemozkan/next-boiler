'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { type FC, type ReactNode, useState } from 'react';

interface Props {
  children: ReactNode;
}

const QueryProvider: FC<Props> = (props) => {
  // data is not shared between different users only creating query client once per component lifecycle

  const [queryClient] = useState(() => new QueryClient());

  return <QueryClientProvider client={queryClient}>{props.children}</QueryClientProvider>;
};

export default QueryProvider;
