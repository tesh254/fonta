import { v4 } from 'uuid';
import aws from 'aws-sdk';

export default async function handler(req, res) {
  aws.config.update({
    accessKeyId: process.env.S3_UPLOAD_KEY,
    secretAccessKey: process.env.S3_UPLOAD_SECRET,
    region: process.env.S3_UPLOAD_REGION
  });

  const s3 = new aws.S3({
    params: {
      Bucket: process.env.S3_UPLOAD_BUCKET
    }
  });

  if (req.method === 'POST') {
    const post = await s3.createPresignedPost({
      Bucket: process.env.S3_UPLOAD_BUCKET,
      Fields: {
        key: `fonts/${req.query.file_name}`
      },
      Conditions: [['content-length-range', 0, 1048576]]
    });

    res.status(201).json({
      font_url: `https://d19k2ygvtsqgyt.cloudfront.net/${post.fields.key}`,
      data: post
    });
  }

  if (req.method === 'GET') {
    const objects = s3.listObjects({ Delimiter: '/' }, function (err, data) {
      res.status(200).json(data);
    });
  }
}
