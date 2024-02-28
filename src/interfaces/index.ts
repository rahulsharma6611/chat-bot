export interface RAPI {
  status: string;
  message: string;
  data?: any;
  error?: any;
}

export interface RAPILimitChat {
  status: string;
  message: string;
  data: {
    date: string;
    limit: number;
    sentChats: number;
  };
}

export interface IChat {
  _id?: string;
  message: {content:string};
  sender: 'user' | 'assistant';
}

export interface RAPIChat {
  status: string;
  message: string;
  data?: IChat;
}

export interface IConversation {
  _id: string;
  title: string;
  email: string;
  chats: IChat[];
}

export interface RAPIConversations {
  status: string;
  message: string;
  data: IConversation[];
}
