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

const uploadDir = path.join(process.cwd(), 'public/uploads');
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
      return res.status(500).json({ error: 'File upload failed' });
    }

    const file = (files.file as formidable.File[])[0]; // Use a type assertion
    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const filePath = file.filepath;
    const fileName = path.basename(filePath);
    const resizedFilePath = path.join(uploadDir, `resized_${fileName}`);

    try {
      // Resize the image to 600x600 pixels
      await sharp(filePath)
        .resize(600, 600)
        .toFile(resizedFilePath);

      // Remove the original file if needed
      fs.unlinkSync(filePath);

      const fileUrl = `/uploads/resized_${fileName}`;

      const newPhoto = await prisma.photo.create({
        data: { url: fileUrl },
      });
      res.status(201).json(newPhoto);
    } catch (error) {
      res.status(500).json({ error: 'Failed to process image' });
    }
  });
}
