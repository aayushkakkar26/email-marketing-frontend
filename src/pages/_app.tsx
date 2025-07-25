import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { ClerkProvider } from "@clerk/nextjs";
import { Inter } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
const inter = Inter({ subsets: ["latin"] });



export default function App({ Component, pageProps }: AppProps) {
  const [client] = useState(() => new QueryClient());
  return (
    <QueryClientProvider client={client}>
      <ClerkProvider
        {...pageProps}
        signInUrl="/sign-in"
        signUpUrl="/sign-up"
        fallbackRedirectUrl="/dashboard"
      >
        <Component {...pageProps} />
        <Toaster />
      </ClerkProvider>
    </QueryClientProvider>
  );
}
