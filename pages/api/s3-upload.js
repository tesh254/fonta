// pages/api/s3-upload.js
import { APIRoute } from 'next-s3-upload';

const handler = APIRoute.configure({
  key(req, filename) {
    return `fonts/${filename}`;
  }
});

export default handler;
