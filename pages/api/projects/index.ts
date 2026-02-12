import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';
import { mockProjects, mockWorkTypes } from '@/lib/mock-data';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (req.method === 'GET') {
    return res.status(200).json({
      projects: mockProjects,
      workTypes: mockWorkTypes,
    });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
