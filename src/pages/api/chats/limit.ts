import { COLLECTION_NAME } from '@/constants';
import { connectMongoDB } from '@/database/connect';
import moment from 'moment';
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
  const md = await connectMongoDB();
  const date = moment().format('YYYY-MM-DD');
  const token = await getToken({ req });

  if (!token) return res.status(401).json({ status: 'error', message: 'Unauthorized' });

  const addLimit = await md.db.collection(COLLECTION_NAME.UserChatDailyLimit).findOne({
    email: token?.email,
  });

  if (!addLimit) {
    await md.db.collection(COLLECTION_NAME.UserChatDailyLimit).insertOne({
      email: token?.email,
      limit: 10,
    });
  }

  const result = await md.db.collection(COLLECTION_NAME.DailyLimit).findOne({
    email: token?.email,
    date,
  });

  if (!result) {
    await md.db.collection(COLLECTION_NAME.DailyLimit).insertOne({
      email: token?.email,
      sentChats: 0,
      date,
    });
  }

  const limit = await md.db.collection(COLLECTION_NAME.UserChatDailyLimit).findOne({
    email: token?.email,
  });

  const dailyLimit = await md.db.collection(COLLECTION_NAME.DailyLimit).findOne({
    email: token?.email,
    date,
  });

  res.json({
    status: 'success',
    message: '',
    data: {
      date: date,
      limit: limit?.limit,
      sentChats: dailyLimit?.sentChats,
    },
  });
};
export default handler;
