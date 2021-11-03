import { useEffect } from 'react';
import '@/assets/main.css';
import '@/assets/chrome-bug.css';
import React from 'react';
import { setup } from 'goober';
import { prefix } from 'goober-autoprefixer';
import Script from 'next/script';

// This could be the best place to define it once.
// Since `_app.js is running for both
setup(React.createElement, prefix);

import Layout from '@/components/Layout';
import { UserContextProvider } from '@/utils/useUser';

export default function MyApp({ Component, pageProps }) {
  useEffect(() => {
    document.body.classList?.remove('loading');
  }, []);

  return (
    <div className="bg-primary">
      <UserContextProvider>
        <Component {...pageProps} />
        <Script
          strategy="beforeInteractive"
          src="https://cdn.splitbee.io/sb.js"
        />
        <Script
          strategy="beforeInteractive"
          data-api="/_hive"
          src="/bee.js"
        ></Script>
      </UserContextProvider>
    </div>
  );
}
