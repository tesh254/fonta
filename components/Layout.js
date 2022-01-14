import Head from 'next/head';
import { useRouter } from 'next/router';

import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/ui/Footer';

export default function Layout({ children, meta: pageMeta, title }) {
  const router = useRouter();
  const meta = {
    title: 'Fonta: Create your own library of fonts',
    description: 'Fonta is a font hosting platform. Create your own library of fonts and share it with the world.',
    cardImage: '/og.png',
    ...pageMeta
  };

  return (
    <>
      <Head>
        <title>{title || meta.title}</title>
        <meta name="robots" content="follow, index" />
        <link href="/favicon.ico" rel="shortcut icon" />
        <meta content={meta.description} name="description" />
        <meta
          property="og:url"
          content={`https://subscription-starter.vercel.app${router.asPath}`}
        />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content={title || meta.title} />
        <meta property="og:description" content={meta.description} />
        <meta property="og:title" content={title || meta.title} />
        <meta property="og:image" content={meta.cardImage} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@vercel" />
        <meta name="twitter:title" content={title || meta.title} />
        <meta name="twitter:description" content={meta.description} />
        <meta name="twitter:image" content={meta.cardImage} />
      </Head>
      <Navbar />
      <main id="skip">
        <section className="max-w-6xl mx-auto px-2">{children}</section>
      </main>
      <Footer />
    </>
  );
}
