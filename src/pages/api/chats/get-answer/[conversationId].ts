import { COLLECTION_NAME } from '@/constants';
import { connectMongoDB } from '@/database/connect';
import { IChat, RAPIChat } from '@/interfaces';
import moment from 'moment';
import type { NextApiRequest, NextApiResponse } from 'next';
import { getToken } from 'next-auth/jwt';
import { Configuration, OpenAIApi } from 'openai';
import { v4 } from 'uuid';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '5000kb',
    },
  },
};

const handler = async (req: NextApiRequest, res: NextApiResponse<RAPIChat>) => {
  try {
    const token = await getToken({ req });
    
    if (!token) return res.status(401).json({ status: 'error', message: 'Unauthorized' });

    if (req.method?.toUpperCase() !== 'POST')
      return res.status(405).json({ status: 'error', message: 'Method not allowed' });

    const md = await connectMongoDB();

    const conversationId = req.query.conversationId as string;
    const { message } = req.body;

    const openAI = new OpenAIApi(
      new Configuration({
        apiKey: process.env.OPENAI_KEY,
      })
    );

    const getAllConversation = await md.db
      .collection(COLLECTION_NAME.Chat)
      .find({
        conversationId: conversationId,
      }).sort({_id:-1}).limit(9)
      .toArray();

    let prompt = [{role:"system", content:"you are a helpful assistant named tom. tom is a computer science genius."}];

    getAllConversation.forEach((item) => {
      prompt.push({role: item.sender === 'user' ? 'user' : 'assistant' ,content : item.message} )
    });

    prompt.push({role:"user", content:message})

    const resOpenAI = await openAI.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages:prompt,
    });

    if (!resOpenAI.data.choices[0].message) {
      return res.status(500).json({ status: 'error', message: 'Something went wrong' });
    }

    const responseAI: IChat = {
      message: resOpenAI.data.choices[0].message || 'Sorry, I do not understand',
      sender: 'assistant',
    };

    

    await md.db.collection(COLLECTION_NAME.Chat).insertMany([
      {
        conversationId: conversationId,
        message,
        sender: 'user',
        createdAt: new Date(),
      },
      {
        conversationId: conversationId,
        message: resOpenAI.data.choices[0].message.content ,
        sender: 'assistant',
        createdAt: new Date(),
      },
    ]);

    await md.client.close();

    res.json({
      status: 'success',
      message: '',
      data: { _id: v4(), ...responseAI },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: 'error', message: 'Something went wrong' });
  }
};

export default handler;
