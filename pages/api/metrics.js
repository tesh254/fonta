import { createFontMetric, getAllFontsForMets } from '@/utils/supabase-admin';
import axios from 'axios';
import { v4 } from 'uuid';

async function handler(req, res) {
  try {
    const allFonts = await getAllFontsForMets();
    if (allFonts.length > 0) {
      allFonts.forEach(async (singleFont) => {
        let fontMetrics = {
          id: v4(),
          font_id: singleFont.id,
          load_times: []
        };
        singleFont.font_urls.forEach(async (link) => {
          let start_time = new Date().getTime();
          let metric;
          try {
            metric = await axios.get(link.font_link);
          } catch (error) {
            console.log(JSON.stringify(error))
          }
          const req_time = new Date().getTime() - start_time;
          console.log(fontMetrics);

          Object.assign(fontMetrics, {
            ...fontMetrics,
            load_times: [
              ...fontMetrics.load_times,
              {
                font_extension: link.font_extension,
                request_time: req_time
              }
            ]
          });
        });

        let data = await createFontMetric(fontMetrics);

        console.log(data);
      });
    }
    res.status(200).send('Ok');
  } catch (error) {
    console.log(error, '>>>>>>>>>>');
    res.status(200).send('OK');
  }
}

export default handler;
