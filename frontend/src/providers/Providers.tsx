"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import { useState } from "react";

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            retry: 1,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#1A1A1A",
            color: "#FFFFFF",
            border: "1px solid #2A2A2A",
            borderRadius: "0",
            fontFamily: "var(--font-inter)",
          },
          success: {
            iconTheme: { primary: "#C9A96E", secondary: "#000" },
          },
          error: {
            iconTheme: { primary: "#EF4444", secondary: "#fff" },
          },
          duration: 3000,
        }}
      />
    </QueryClientProvider>
  );
}
