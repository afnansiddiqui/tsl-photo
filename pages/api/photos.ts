// pages/api/photos.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const photos = await prisma.photo.findMany({
        include: { comments: true }, // Include comments with photos
      });
      res.status(200).json(photos);
    } catch (error) {
      res.status(500).json({ error: 'Unable to fetch photos' });
    }
  } else if (req.method === 'POST') {
    const { url, comments } = req.body;
    try {
      const newPhoto = await prisma.photo.create({
        data: {
          url,
          comments: {
            create: comments,
          },
        },
      });
      res.status(201).json(newPhoto);
    } catch (error) {
      res.status(500).json({ error: 'Unable to create photo' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
