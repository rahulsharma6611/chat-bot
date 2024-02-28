import { THEME_KEY } from '@/constants';
import { IConversation, RAPIConversations, RAPILimitChat } from '@/interfaces';
import { fetcher } from '@/services/fetcher';
import { useSession } from 'next-auth/react';
import { createContext, useEffect, useState } from 'react';
import useSWR, { KeyedMutator } from 'swr';

interface IGlobalContext {
  setShowSidebar: React.Dispatch<React.SetStateAction<boolean>>;
  showSidebar: boolean;
  setLoadingChat?: React.Dispatch<React.SetStateAction<boolean>>;
  loadingChat?: boolean;
  setTheme: React.Dispatch<React.SetStateAction<string>>;
  theme: string;
  limitChats?: RAPILimitChat;
  mutateLimitChats?: KeyedMutator<RAPILimitChat>;
  conversations?: RAPIConversations;
  mutateConversations?: KeyedMutator<RAPIConversations>;
  selectedConversation?: IConversation;
  setSelectedConversation?: React.Dispatch<React.SetStateAction<IConversation | undefined>>;
}

const GlobalContext = createContext<IGlobalContext>({
  setShowSidebar: () => {},
  showSidebar: false,
  setTheme: () => {},
  theme: 'light',
});

export const GlobalContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [showSidebar, setShowSidebar] = useState(false);
  const [theme, setTheme] = useState('light');
  const [selectedConversation, setSelectedConversation] = useState<IConversation>();
  const [loadingChat, setLoadingChat] = useState(false);

  const { data: limitChats, mutate: mutateLimitChats } = useSWR<RAPILimitChat>(
    `/api/chats/limit`,
    () => fetcher(`/api/chats/limit`)
  );

  const { data: conversations, mutate: mutateConversations } = useSWR<RAPIConversations>(
    `/api/conversations`,
    () => fetcher(`/api/conversations`),
    {
      revalidateOnReconnect: true,
      revalidateOnMount: true,
    }
  );

  useEffect(() => {
    const localTheme = localStorage.getItem(THEME_KEY);
    if (!localTheme) {
      localStorage.setItem(THEME_KEY, 'light');
      setTheme('light');
    } else {
      if (localTheme === 'dark') {
        document.documentElement.classList.add('dark');
        document.body.classList.add('bg-gray-800');
        document.body.classList.remove('bg-gray-100');
        setTheme('dark');
      } else {
        document.documentElement.classList.remove('dark');
        document.body.classList.add('bg-gray-800');
        document.body.classList.remove('bg-gray-100');
        setTheme('light');
      }
    }
  }, [theme]);

  return (
    <GlobalContext.Provider
      value={{
        showSidebar,
        setShowSidebar,
        theme,
        setTheme,
        limitChats,
        mutateLimitChats,
        conversations,
        mutateConversations,
        selectedConversation,
        setSelectedConversation,
        loadingChat,
        setLoadingChat,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalContext;
