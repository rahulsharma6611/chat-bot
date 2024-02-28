import { useSession } from 'next-auth/react';
import { AxiosRequestConfig } from 'axios';
import useSWR from 'swr';

import { fetcher } from '@/services/fetcher';

export interface IUser {
  _id: string;
  email: string;
  name: string;
  image: string;
}

export interface RAPIUser {
  status: string;
  message: string;
  data: IUser;
}

export default function useUser() {
  const { data: session } = useSession();

  const init: AxiosRequestConfig = {
    method: 'POST',
    data: {
      ...session?.user,
    },
  };

  const { data, error, isLoading } = useSWR<RAPIUser>(
    `${process.env.NEXT_PUBLIC_URL}/api/profile`,
    () => fetcher(`${process.env.NEXT_PUBLIC_URL}/api/profile`, init)
  );

  return {
    user: data?.data,
    isLoading,
    error,
  };
}
