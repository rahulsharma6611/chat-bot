import { COLLECTION_NAME } from '@/constants';
import { connectMongoDB } from '@/database/connect';
import { ObjectId } from 'mongodb';
import type { NextApiRequest, NextApiResponse } from 'next';
import { getToken } from 'next-auth/jwt';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '5000kb',
    },
  },
};
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const token = await getToken({ req });

  if (!token) return res.status(401).json({ message: 'Unauthorized' });
  let message = '';

  if (
    req.method !== 'PUT' &&
    req.method !== 'DELETE' &&
    req.method !== 'POST' &&
    req.method !== 'GET'
  )
    return res.status(405).json({ message: 'Method not allowed' });

  const { title } = req.body;
  const id = req.query.id as string;

  const md = await connectMongoDB();

  let result;

  if (req.method === 'POST') {
    if (id !== 'new') {
      return res.status(404).json({ message: 'Not found' });
    }

    result = await md.db.collection(COLLECTION_NAME.Conversation).insertOne({
      title: title || 'New Chat',
      email: token?.email,
      chats: [],
    });
    message = 'Create success';
  }

  if (req.method === 'PUT') {
    result = await md.db.collection(COLLECTION_NAME.Conversation).updateOne(
      {
        _id: new ObjectId(id),
      },
      {
        $set: {
          title: title || 'New Chat',
        },
      }
    );
    message = 'Update success';
  }

  if (req.method === 'DELETE') {
    result = await md.db.collection(COLLECTION_NAME.Conversation).deleteOne({
      _id: new ObjectId(id),
    });
    message = 'Delete success';
  }

  if (req.method === 'GET') {
    result = await md.db.collection(COLLECTION_NAME.Conversation).findOne({
      _id: new ObjectId(id),
    });
    if (!result) {
      return res.status(404).json({ message: 'Not found' });
    }
    const chats = await md.db
      .collection(COLLECTION_NAME.Chat)
      .find({
        conversationId: id,
      })
      .toArray();

    result.chats = chats;
    message = 'Get success';
  }

  await md.client.close();

  res.status(201).json({
    status: 'success',
    message: message,
    data: result,
  });
};
export default handler;
