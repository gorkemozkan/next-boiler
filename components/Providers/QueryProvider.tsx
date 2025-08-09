"use client"

import { FC, ReactNode, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

interface Props {
    children: ReactNode;    
}

const QueryProvider: FC<Props> = (props) => {
    // data is not shared between different users only creating query client once per component lifecycle

     const [queryClient] = useState(() => new QueryClient());

    return (
        <QueryClientProvider client={queryClient}>
            {props.children}
        </QueryClientProvider>

    )
}

export default QueryProvider;