import { getUser } from '@/utils/supabase-admin';

const uploadFont = async (req, res) => {
  if (req.method === 'POST') {
    const token = req.headers.token;

    try {
      const user = await getUser(token);
    } catch (error) {
      res.setHeader('Allow', 'POST');
      res.status(400).json({
        message: `Cannot upload file: ${error.message}`
      });
    }
  }
};
