import { connectMongoDB } from '@/database/connect';
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
  if (!token) return res.status(401).json({ status: 'error', message: 'Unauthorized' });

  if (req.method !== 'GET')
    return res.status(405).json({ status: 'error', message: 'Method not allowed' });

  const md = await connectMongoDB();

  const data = await md.db
    .collection('conversations')
    .find({
      email: token?.email,
    })
    .toArray();

  await md.client.close();

  res.json({
    status: 'success',
    message: '',
    data: data,
  });
};
export default handler;
