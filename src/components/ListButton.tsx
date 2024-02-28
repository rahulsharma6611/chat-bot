import React from 'react';

interface Props
  extends React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {
  icon: any;
  title: string;
  removeLi?: boolean;
}

export default function ListButton(props: Props) {
  const button = (
    <button
      {...props}
      className="flex items-center w-full gap-1 p-2 px-2 text-left border rounded outline-none active:bg-gray-600 active:text-gray-50 active:ring-1 ring-offset-1 ring-gray-600"
    >
      <props.icon className="w-4" />
      <span className="text-sm">{props.title}</span>
    </button>
  );

  if (props.removeLi) {
    return button;
  }

  return <li>{button}</li>;
}
