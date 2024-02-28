import axios, { AxiosRequestConfig } from 'axios';
import React, { useState } from 'react';

export default function useFetch() {
  const [isLoading, setIsLoading] = useState(false);

  const handleFetch = async <T>(data: AxiosRequestConfig): Promise<T> => {
    try {
      setIsLoading(true);
      const response = (await axios(data).then((res) => res.data)) as T;
      return response;
    } catch (error: any) {
      return error.response.data;
    } finally {
      setIsLoading(false);
    }
  };
  return { isLoading, handleFetch };
}
