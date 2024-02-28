import React from 'react';

export default function IconButton(
  props: React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>
) {
  return (
    <button
      className={`p-1 text-gray-700 rounded-sm outline-none ring-offset-1 active:ring-1 hover:bg-gray-700 hover:text-gray-50 ring-gray-700 dark:text-gray-50  disabled:text-gray-500/50 ${props.className}`}
      {...props}
    >
      {props.children}
    </button>
  );
}
