import { updateFontRecord } from '@/utils/supabase-client';
import { createContext, useContext, useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { useS3Upload } from 'next-s3-upload';
import {} from '@/utils/supabase-client';

export const SingleFontContext = createContext({
  font: {},
  isUpdating: false,
  updateFont: () => {},
  editedFont: {},
  handleChange: () => {}
});

export const SingleFontProvider = ({
  children,
  font: fetchedFont,
  updateGlobalFont
}) => {
  const [font, setFonts] = useState(fetchedFont);
  const [isUpdating, setIsUpdating] = useState(false);
  const [newFont, setNewFonts] = useState(fetchedFont);

  const onChange = (NAME, VALUE) => {
    setNewFonts((prev) => ({
      ...prev,
      [NAME]: VALUE
    }));
  };

  const onUpdate = () => {
    let css;
    let _fonts;
    let data;

    if (newFont.font_name !== font.font_name) {
      _fonts = font.font_urls
        .map(
          (item, idx) =>
            `url('${item.font_link}') format('${item.font_extension}')${
              font.font_urls.length - 1 === idx ? '; ' : ', '
            }`
        )
        .join(' ');

      let fontCss = `src: `.concat(_fonts);

      css = `
        /* ${newFont.font_name} */
        @font-face {
            font-family: '${newFont.font_name}';
            font-style: normal;
            font-weight: ${newFont.font_weight};
            font-display: swap;
            ${fontCss}
        }
      `;
      data = {
        font_name: newFont.font_name,
        font_css: css,
        font_category: newFont.font_category,
        allowed_domains: []
      };
    } else {
      data = {
        font_name: newFont.font_name,
        font_css: font.font_css,
        font_category: newFont.font_category,
        allowed_domains: []
      };
    }
    setIsUpdating(true);
    updateFontRecord(font.id, data)
      .then((res) => {
        setIsUpdating(false);
        updateGlobalFont(res[0]);
      })
      .catch((err) => {
        setIsUpdating(false);
        toast.error(err.message);
      });
  };

  return (
    <SingleFontContext.Provider
      value={{
        font,
        updateFont: onUpdate,
        editedFont: newFont,
        isUpdating,
        handleChange: onChange
      }}
    >
      {children}
      <Toaster
        position="top-right"
        reverseOrder={false}
        gutter={8}
        containerClassName=""
        containerStyle={{}}
        toastOptions={{
          // Define default options
          className: '',
          duration: 5000,
          style: {
            background: '#363636',
            color: '#fff'
          },
          // Default options for specific types
          success: {
            duration: 3000,
            theme: {
              primary: 'green',
              secondary: 'black'
            }
          }
        }}
      />
    </SingleFontContext.Provider>
  );
};

export const useSingleFont = () => useContext(SingleFontContext);
