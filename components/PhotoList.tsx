// pages/api/upload.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import formidable, { IncomingForm } from 'formidable';
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const config = {
  api: {
    bodyParser: false,
  },
};

const uploadDir = path.join('/tmp/uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const form = new IncomingForm({
    uploadDir,
    keepExtensions: true,
  });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error('Error parsing form:', err);
      return res.status(500).json({ error: 'File upload failed', details: (err as Error).message });
    }

    const file = (files.file as formidable.File[])[0];
    if (!file) {
      console.error('No file uploaded');
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const filePath = file.filepath;
    const fileName = path.basename(filePath);
    const resizedFilePath = path.join(uploadDir, `resized_${fileName}`);

    try {
      console.log(`Starting image resize: ${filePath} -> ${resizedFilePath}`);
      await sharp(filePath)
        .resize(600, 600)
        .toFile(resizedFilePath);
      console.log('Image resized successfully');

      fs.unlinkSync(filePath);
      console.log('Original image deleted');

      const fileUrl = `uploads/resized_${fileName}`;

      const newPhoto = await prisma.photo.create({
        data: { url: fileUrl },
      });
      console.log('Image URL saved to database');

      res.status(201).json(newPhoto);
    } catch (error) {
      console.error('Error processing image or saving to database:', error);
      res.status(500).json({ error: 'Failed to process image', details: (error as Error).message });
    }
  });
}
