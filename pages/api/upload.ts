// pages/api/upload.ts
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
const tempUploadDir = '/tmp/uploads';
if (!fs.existsSync(tempUploadDir)) {
  fs.mkdirSync(tempUploadDir, { recursive: true });
}

const publicUploadDir = path.join(process.cwd(), 'public/uploads');
if (!fs.existsSync(publicUploadDir)) {
  fs.mkdirSync(publicUploadDir, { recursive: true });
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const form = new IncomingForm({
    uploadDir: tempUploadDir,
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

    const tempFilePath = file.filepath;
    const fileName = path.basename(tempFilePath);
    const publicFilePath = path.join(publicUploadDir, fileName);
    const fileUrl = `/uploads/${fileName}`;

    try {
      // Move file to public directory
      fs.renameSync(tempFilePath, publicFilePath);

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
