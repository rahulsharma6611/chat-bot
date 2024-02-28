import GlobalContext from '@/context/GlobalContext';
import useFetch from '@/hooks/useFetch';
import { IChat, RAPIChat } from '@/interfaces';
import { PaperAirplaneIcon } from '@heroicons/react/24/outline';
import React, { useContext, useState } from 'react';
import { toast } from 'react-hot-toast';
import { v4 } from 'uuid';

export default function ChatForm() {
  const {
    selectedConversation,
    setSelectedConversation,
    loadingChat,
    setLoadingChat,
    mutateLimitChats,
    limitChats,
  } = useContext(GlobalContext);
  const [message, setMessage] = useState('');
  const { handleFetch } = useFetch();

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!limitChats) return;

    if (limitChats?.data.limit <= limitChats?.data.sentChats) {
      toast.error('You have reached the limit of sending messages. Come back tomorrow!');
      return;
    }

    setSelectedConversation?.((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        chats: [...prev.chats, { _id: v4(), message, sender: 'user' }],
      };
    });
    try {
      setLoadingChat?.(true);
      const response: RAPIChat = await handleFetch<RAPIChat>({
        url: `/api/chats/get-answer/${selectedConversation?._id}`,
        method: 'POST',
        data: { message },
      });

      if (response.data) {
        setSelectedConversation?.((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            chats: [...prev.chats, response?.data as IChat],
          };
        });
        setMessage('');
        mutateLimitChats?.();
      }
    } catch (error: any) {
      toast.error(error.response.data.message);
    } finally {
      document.getElementById('chatBox')?.scrollTo({
        behavior: 'smooth',
        top: document.getElementById('chatBox')?.scrollHeight,
        left: 0,
      });
      setTimeout(() => {
        setLoadingChat?.(false);
      }, 500);
    }
  };

  if (!selectedConversation) return <></>;

  return (
    <form className="flex items-center px-4 overflow-hidden h-14" onSubmit={handleSubmit}>
      <input
        type="text"
        className="flex-1 w-full p-2 bg-transparent outline-none placeholder:text-gray-300 disabled:text-gray-600 disabled:cursor-not-allowed"
        placeholder={loadingChat ? 'Please wait...' : 'Type your message here'}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        disabled={loadingChat}
      />
      <button
        type="submit"
        className={`p-2 transition-all duration-200 rounded-lg outline-none focus:ring ring-gray-500 disabled:text-gray-600 disabled:cursor-not-allowed ${
          false ? 'translate-x-14' : 'translate-x-1'
        }`}
        disabled={loadingChat}
      >
        <PaperAirplaneIcon
          className={`duration-150 ${loadingChat ? 'text-gray-600' : ''} ${
            loadingChat ? 'w-8 h-8 text-gray-500 animate-pulse' : 'text-gray-600 w-6 h-6'
          }`}
        />
      </button>
    </form>
  );
}
