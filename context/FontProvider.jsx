import { getFontsBasedByUser } from '@/utils/supabase-client';
import { createContext, useContext, useEffect, useState } from 'react';

export const FontContext = createContext({
  fonts: [],
  uploadFonts: () => {},
  saveFonts: () => {},
  loading: false,
  selectedFonts: [],
  setSelectedFonts: () => {}
});

export const FontProvider = ({ children, user }) => {
  const [fonts, setFonts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedFonts, setSelectedFonts] = useState({
    name: '',
    fonts: []
  });

  function uploadFonts() {}

  function saveFonts() {}

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
        setSelectedFonts
      }}
    >
      {children}
    </FontContext.Provider>
  );
};

export const useFonts = () => useContext(FontContext);
