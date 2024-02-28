import { COLLECTION_NAME } from '@/constants';
import { connectMongoDB } from '@/database/connect';
import type { NextApiRequest, NextApiResponse } from 'next';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '5000kb',
    },
  },
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return res.status(405).json({
      status: 'error',
      message: 'Only accept POST request',
    });
  }

  if (typeof req.body === 'string') req.body = JSON.parse(req.body);

  const { email } = req.body;

  if (!req.body.email) {
    return res.status(400).json({
      status: 'error',
      message: 'Email is required',
    });
  }

  const md = await connectMongoDB();

  let user = await md.db.collection(COLLECTION_NAME.User).findOne({ email });

  if (!user) {
    await md.db
      .collection(COLLECTION_NAME.User)
      .insertOne({ ...req.body, createdAt: new Date(), updatedAt: new Date() });
  } else {
    await md.db
      .collection(COLLECTION_NAME.User)
      .updateOne({ email }, { $set: { updatedAt: new Date() } });
  }

  user = await md.db.collection(COLLECTION_NAME.User).findOne({ email });

  await md.client.close();

  res.json({
    status: 'success',
    message: 'Get user info',
    data: user,
  });
};

export default handler;
