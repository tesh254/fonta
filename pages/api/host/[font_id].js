import { getFontById } from '@/utils/supabase-admin';

async function handler(req, res) {
  if (req.method === 'GET') {
    const fontId = req.query.font_id;

    const response = await getFontById(fontId);

    res.writeHead(200, {
      'Content-Type': 'text/css; charset=utf-8',
      'Cross-Origin-Resource-Policy': '*',
      'Transfer-Encoding': 'chunked',
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'private, max-age=86400'
    });

    if (response && response.id) {
      res.write(response.font_css || `/* No CSS ${fontId} */`);
      res.end();
    } else {
      res.write(`/* No Css ${fontId}*/`);
      res.end();
    }
  }
}

export default handler;
