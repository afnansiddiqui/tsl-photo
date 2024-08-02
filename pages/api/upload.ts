
import type { NextApiRequest, NextApiResponse } from 'next';
import formidable, { IncomingForm } from 'formidable';
import fs from 'fs';
import path from 'path';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const config = {
  api: {
    bodyParser: false,
  },
};

// Temporary directory in Vercel build environment
const uploadDir = '/tmp/uploads';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const form = new IncomingForm({
    uploadDir,
    keepExtensions: true,
  });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error('File upload error:', err);
      return res.status(500).json({ error: 'File upload failed' });
    }

    const file = (files.file as formidable.File[])[0];
    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const filePath = file.filepath;
    const fileName = path.basename(filePath);
    const fileUrl = `/api/files/${fileName}`;

    try {
      // Move file to temporary directory without resizing
      const newFilePath = path.join(uploadDir, fileName);
      fs.renameSync(filePath, newFilePath);

      // Save photo information to database
      const newPhoto = await prisma.photo.create({
        data: { url: fileUrl },
      });

      res.status(201).json(newPhoto);
    } catch (error) {
      console.error('File processing error:', error);
      res.status(500).json({ error: 'Failed to process file' });
    }
  });
}



