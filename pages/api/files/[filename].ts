// pages/api/files/[filename].ts
import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { filename } = req.query;
  const filePath = path.join('/tmp/uploads', filename as string);

  if (fs.existsSync(filePath)) {
    const ext = path.extname(filename as string).toLowerCase();
    const mimeTypes: Record<string, string> = {
      '.png': 'image/png',
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.gif': 'image/gif',
    };

    const mimeType = mimeTypes[ext] || 'application/octet-stream';

    res.setHeader('Content-Type', mimeType);
    fs.createReadStream(filePath).pipe(res);
  } else {
    res.status(404).json({ error: 'File not found' });
  }
}
