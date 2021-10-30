import {
  getFontsBasedByUser,
  uploadFontToStorage
} from '@/utils/supabase-client';
import axios from 'axios';
import { createContext, useContext, useEffect, useState } from 'react';
import { v4 } from 'node_modules/uuid/dist';
import toast from 'react-hot-toast';
import { useS3Upload } from 'next-s3-upload';
import { createFontRecord } from '@/utils/supabase-client';

export const FontContext = createContext({
  fonts: [],
  uploadFonts: () => {},
  saveFonts: () => {},
  loading: false,
  selectedFonts: [],
  setSelectedFonts: () => {},
  uploadingFonts: false
});

export const FontProvider = ({ children, user, onFontSubmitSuccess }) => {
  const [fonts, setFonts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedFonts, setSelectedFonts] = useState({
    name: '',
    category: '',
    fonts: [],
    fontWeight: 300
  });
  let { uploadToS3 } = useS3Upload();
  const [uploadingFonts, setUploadingFonts] = useState(false);

  const [uploadedUrls, setUploadedUrls] = useState([]);

  async function uploadFonts() {
    if (selectedFonts.fonts.length > 0) {
      setUploadingFonts(true);
      const urls = [];

      for (let i = 0; i < selectedFonts.fonts.length; i++) {
        const _font = selectedFonts.fonts[i];
        const file = _font.fileBlob;

        const newFileName = `${v4()}.${_font.fileExtension}`;

        const newFile = new File([file], newFileName, {
          type: file.type,
          lastModified: file.lastModified
        });

        const { url } = await uploadToS3(newFile);

        urls.push({
          font_link: url,
          font_extension: _font.fileExtension,
          font_weight: _font.fontWeight
        });
      }

      //   selectedFonts.fonts.forEach(async (_font) => {
      // });

      setUploadedUrls(urls);
      setUploadingFonts(false);
    }
  }

  function saveFonts() {
    setUploadingFonts(true);
    const data = {
      name: selectedFonts.name,
      font_urls: uploadedUrls,
      font_category: selectedFonts.category
    };

    function cssGenerator(name, $fonts) {
      let css;

      let _fonts = `src: `;

      $fonts.forEach((item, idx) => {
        _fonts.concat(
          `url('${item.font_link}') format('${item.font_extension}')${
            $fonts.length - 1 === idx ? '; ' : ', '
          }`
        );
      });

      css = `
            /* ${data.name} */\n
            @font-face {\n
                font-family: '${name}';\n
                font-style: normal;\n
                font-weight: ${selectedFonts.fontWeight};\n
                font-display: swap;\n
                ${_fonts}\n
            }\n
        `;

      return css;
    }

    const css = cssGenerator(data.font_name, data.font_urls);

    const payloadData = {
      name: data.name,
      css: css,
      fonts: data.font_urls,
      user: user.id,
      category: data.font_category,
      font_weight: selectedFonts.fontWeight
    };

    createFontRecord(payloadData)
      .then((res) => {
        setFonts((prev) => [res.data, ...prev]);
        setUploadedUrls([]);
        setUploadingFonts(false);
        onFontSubmitSuccess();
      })
      .catch((err) => {
        setUploadedUrls([]);
        toast.error(err.message);
        setUploadingFonts(false);
      });
  }

  useEffect(() => {
    console.log(uploadedUrls);
    if (uploadedUrls.length > 0 && !uploadingFonts) {
      saveFonts();
    }
  }, [uploadedUrls, uploadingFonts]);

  async function getFonts() {
    setLoading(true);
    try {
      const result = await getFontsBasedByUser(user?.id);

      console.log(result);

      setFonts(() => [...result.fonts]);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    (async () => {
      await getFonts();
    })();
  }, [user]);

  return (
    <FontContext.Provider
      value={{
        fonts,
        uploadFonts,
        saveFonts,
        loading,
        selectedFonts,
        setSelectedFonts,
        uploadingFonts
      }}
    >
      {children}
    </FontContext.Provider>
  );
};

export const useFonts = () => useContext(FontContext);
