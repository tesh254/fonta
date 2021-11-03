import {
  getFontsBasedByUser,
  subscribeToFonts,
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
          font_weight: _font.fontWeight,
          font_size: newFile.size
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

      let _fonts;

      // $fonts.forEach((item, idx) => {
      //   _fonts.concat(
      //     `url('${item.font_link}') format('${item.font_extension}')${
      //       $fonts.length - 1 === idx ? '; ' : ', '
      //     }`
      //   );
      // });

      _fonts = $fonts
        .map(
          (item, idx) =>
            `url('${item.font_link}') format('${item.font_extension}')${
              $fonts.length - 1 === idx ? '; ' : ', '
            }`
        )
        .join(' ');

      let fontCss = `src: `.concat(_fonts);

      css = `
        /* ${name} */
        @font-face {
            font-family: '${name}';
            font-style: normal;
            font-weight: ${selectedFonts.fontWeight};
            font-display: swap;
            ${fontCss}
        }
      `;

      return css;
    }

    const css = cssGenerator(data.name, data.font_urls);

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
        setFonts((prev) => [res[0], ...prev]);
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
    if (uploadedUrls.length > 0 && !uploadingFonts) {
      saveFonts();
    }
  }, [uploadedUrls, uploadingFonts]);

  async function getFonts() {
    setLoading(true);
    try {
      const result = await getFontsBasedByUser(user?.id);

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
        uploadingFonts,
        gettingFonts: loading
      }}
    >
      {children}
    </FontContext.Provider>
  );
};

export const useFonts = () => useContext(FontContext);
