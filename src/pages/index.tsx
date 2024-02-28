import React, { useContext } from 'react';
import { signIn } from 'next-auth/react';
import { GetServerSideProps } from 'next';
import { getToken } from 'next-auth/jwt';
import { ArrowRightIcon, MoonIcon, SunIcon } from '@heroicons/react/24/outline';
import { Inter } from 'next/font/google';
import GlobalContext from '@/context/GlobalContext';
import { THEME_KEY } from '@/constants';
import Head from 'next/head';

const inter = Inter({ subsets: ['latin'] });

export default function Home(props: any) {
  const { theme, setTheme } = useContext(GlobalContext);

  const handleToggleTheme = () => {
    if (theme === 'light') {
      setTheme('dark');
      document.documentElement.classList.add('dark');
      localStorage.setItem(THEME_KEY, 'dark');
    } else {
      setTheme('light');
      document.documentElement.classList.remove('dark');
      localStorage.setItem(THEME_KEY, 'light');
    }
  };

  return (
    <>
      <Head>
        <title>Home | Chatest.AI</title>
      </Head>
      <div
        className={`h-screen ${inter.className} flex-col flex items-center justify-center px-10 text-gray-700 bg-gray-50 dark:text-gray-50 dark:bg-gray-800`}
      >
        <div className="w-full lg:w-1/2">
          <div className="mb-3">
            <p className="text-5xl font-bold">
              Welcome<span className="leading-3 text-9xl">.</span>
            </p>
            <p className="mt-1">Sign in to interact with AI, today.</p>
          </div>
          <button
            onClick={() => signIn()}
            className="flex items-center gap-2 p-2 px-2 text-left border rounded outline-none focus:bg-gray-600 hover:bg-gray-600 focus:text-gray-50 hover:text-gray-50 active:ring-1 ring-offset-1 ring-gray-600 dark:hover:text-gray-800 dark:hover:bg-gray-50 dark:active:ring-gray-50 dark:active:ring-offset-gray-800"
          >
            <ArrowRightIcon className="w-4" />
            <span>Sign In</span>
          </button>
          <div className="h-2" />
          <button
            onClick={handleToggleTheme}
            className="flex items-center gap-2 p-2 px-2 text-left border rounded outline-none focus:bg-gray-600 hover:bg-gray-600 focus:text-gray-50 hover:text-gray-50 active:ring-1 ring-offset-1 ring-gray-600 dark:hover:text-gray-800 dark:hover:bg-gray-50 dark:active:ring-gray-50 dark:active:ring-offset-gray-800"
          >
            {theme === 'light' ? <MoonIcon className="w-4" /> : <SunIcon className="w-4" />}
            <span>{theme === 'light' ? 'Dark Mode' : 'Light Mode'}</span>
          </button>
        </div>
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const token = await getToken({ req: context.req });

  if (token) {
    return {
      redirect: {
        destination: '/chat',
        permanent: false,
      },
    };
  }

  return {
    props: {
      token: token,
    },
  };
};
