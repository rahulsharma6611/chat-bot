import GlobalContext from '@/context/GlobalContext';
import { ChevronRightIcon, SunIcon, MoonIcon } from '@heroicons/react/24/outline';
import React, { useContext } from 'react';
import { toast } from 'react-hot-toast';

const EXAMPLE_QUESTIONS = [
  `Got any creative ideas for a 10 year old's birthday?`,
  `Explain quantum computing in simple terms`,
  `How do I make an HTTP request in Javascript?"`,
];

export default function InitChatScreen() {
  const { theme } = useContext(GlobalContext);
  return (
    <div className="flex flex-col items-center justify-center p-5 bg-white rounded shadow-sm dark:bg-gray-900 dark:shadow-md">
      {theme === 'light' ? <SunIcon className="w-7" /> : <MoonIcon className="w-7" />}

      <p className="mt-2 font-medium">Start with examples or ask your own question</p>
      <div className="flex flex-col gap-2 mt-3">
        {EXAMPLE_QUESTIONS.map((question) => (
          <button
            key={question}
            className="block p-2 px-3 font-serif italic text-left bg-gray-100 rounded outline-none dark:bg-gray-800 focus:bg-gray-600 focus:text-gray-50 active:ring-1 ring-offset-1 ring-gray-600 dark:ring-gray-500"
            onClick={async () => {
              await navigator.clipboard.writeText(question);
              toast.success('Copied to clipboard');
            }}
          >
            {question}
            <ChevronRightIcon className="inline-block w-4" />
          </button>
        ))}
      </div>
    </div>
  );
}
