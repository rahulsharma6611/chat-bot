import type { AppProps } from 'next/app';
import { SessionProvider } from 'next-auth/react';
import { Toaster } from 'react-hot-toast';

import '@/styles/globals.css';
import { GlobalContextProvider } from '@/context/GlobalContext';
import Head from 'next/head';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <SessionProvider session={pageProps.session}>
      <Head>
        <meta
          name="description"
          content="Welcome to the AI Chatbot. This page using ChatGPT model to generate the answers"
        />
      </Head>
      <GlobalContextProvider>
        <Component {...pageProps} />
      </GlobalContextProvider>
      <Toaster />
    </SessionProvider>
  );
}
