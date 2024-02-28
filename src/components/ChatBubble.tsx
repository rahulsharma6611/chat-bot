import { IChat } from '@/interfaces';
import React, { useEffect, useState } from 'react';

export default function ChatBubble({ item, isAnimated }: { item: IChat; isAnimated?: boolean }) {
  const [array, setArray] = useState<string[]>([]);
  const splittedMessage = item.sender === "user" ? item.message: item.message.content
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (isAnimated) {
      const interval = setInterval(() => {
        // You'd want an exit condition here
        if (currentIndex < splittedMessage.length) {
          setArray((arr) => {
            return [...arr, splittedMessage[currentIndex]];
          });
          setCurrentIndex((prev) => prev + 1);
          document.getElementById('chatBox')?.scrollTo({
            behavior: 'smooth',
            top: document.getElementById('chatBox')?.scrollHeight,
            left: 0,
          });
        }
      }, 200);

      return () => clearInterval(interval);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex]);

  if (item.sender === 'user')
    return (
      <div className="flex flex-col items-end justify-end">
        <p
          className="p-3 bg-gray-200 rounded dark:bg-slate-500 dark:shadow-sm"
          dangerouslySetInnerHTML={{
            __html: isAnimated ? array.join(' ') : splittedMessage,
          }}
        ></p>
      </div>
    );

  return (
    <div className="flex flex-col items-start justify-start">
      <p
        className="p-3 bg-white rounded shadow-sm dark:shadow-sm dark:bg-slate-700"
        dangerouslySetInnerHTML={{
          __html: isAnimated ? array.join(' ') : splittedMessage,
        }}
      ></p>
      <p className="text-xs capitalize text-gry-500">{item.sender}</p>
    </div>
  );
}
