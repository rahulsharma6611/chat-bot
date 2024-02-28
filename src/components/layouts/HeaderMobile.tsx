import GlobalContext from '@/context/GlobalContext';
import React, { useContext } from 'react';
import IconButton from '../IconButton';
import { Bars3Icon, PlusIcon } from '@heroicons/react/24/outline';

export default function HeaderMobile() {
  const { setShowSidebar, selectedConversation } = useContext(GlobalContext);

  return (
    <header className="fixed top-0 flex items-center justify-between w-full p-5 bg-white shadow-sm lg:hidden dark:bg-gray-900 dark:shadow-md">
      <IconButton onClick={() => setShowSidebar(true)}>
        <Bars3Icon className="w-5" />
      </IconButton>
      <p className="font-medium">{selectedConversation?.title || 'New Chat'}</p>
      <IconButton onClick={() => setShowSidebar(true)}>
        <PlusIcon className="w-5" />
      </IconButton>
    </header>
  );
}
