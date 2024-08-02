import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const comments = await prisma.comment.findMany();
      res.status(200).json(comments);
    } catch (error) {
      res.status(500).json({ error: 'Unable to fetch comments' });
    }
  } else if (req.method === 'POST') {
    const { content, photoId } = req.body;
    try {
      const newComment = await prisma.comment.create({
        data: { content, photoId },
      });
      res.status(201).json(newComment);
    } catch (error) {
      res.status(500).json({ error: 'Unable to create comment' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
