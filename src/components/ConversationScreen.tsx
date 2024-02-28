import GlobalContext from '@/context/GlobalContext';
import React, { useContext } from 'react';
import InitChatScreen from './InitChatScreen';
import ChatBubble from './ChatBubble';

export default function ConversationScreen() {
  const { selectedConversation, loadingChat } = useContext(GlobalContext);
  if (loadingChat && !selectedConversation) {
    return (
      <div className="flex items-center justify-center h-screen gap-2">
        <span className="relative flex w-3 h-3">
          <span className="absolute inline-flex w-full h-full bg-gray-600 rounded-full opacity-75 dark:bg-gray-200 animate-ping"></span>
          <span className="relative inline-flex w-3 h-3 bg-gray-800 rounded-full dark:bg-gray-300"></span>
        </span>
        <span>Loading conversation...</span>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center h-screen">
      {!selectedConversation && (
        <div className="flex flex-col items-center justify-center gap-2 px-5">
          <h1 className="text-4xl font-bold text-gray-700 dark:text-gray-50">
            Select a conversation.
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Select a conversation or create a new one to get started
          </p>
        </div>
      )}

      {selectedConversation?.chats.length === 0 ? (
        <InitChatScreen />
      ) : (
        <div
          className="flex flex-col w-full h-screen gap-3 px-4 mb-32 overflow-auto pt-36 lg:pt-2"
          id="chatBox"
        >
          <div className="h-52 lg:h-16"></div>
          {selectedConversation?.chats.map((chat, index) => (
            <ChatBubble
              item={chat}
              isAnimated={
                false
              }
              key={chat._id}
            />
          ))}
          {loadingChat && (
            <div className="flex items-center gap-2">
              <span className="relative flex w-3 h-3">
                <span className="absolute inline-flex w-full h-full bg-gray-600 rounded-full opacity-75 dark:bg-gray-200 animate-ping"></span>
                <span className="relative inline-flex w-3 h-3 bg-gray-800 rounded-full dark:bg-gray-300"></span>
              </span>
              <span>Generating answer for you...</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
