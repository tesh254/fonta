import Layout from '@/components/Layout';
import { getFontById } from '@/utils/supabase-admin';
import { useRouter } from 'next/router';
import { CopyBlock, vs2015 } from 'react-code-blocks';
import { Tab } from '@headlessui/react';
import { useEffect, useState } from 'react';

export default function SingleFonts({ font }) {
  const router = useRouter();
  const [tabs, setTabs] = useState([
    {
      id: 1,
      label: 'Details'
    },
    {
      id: 2,
      label: 'Edit'
    }
  ]);
  const [url, setUrl] = useState(null);

  function classNames(...classes) {
    return classes.filter(Boolean).join(' ');
  }

  useEffect(() => {
    if (!font) {
      router.push(`'/404`);
    }
    const { location } = window;
    setUrl(location.protocol + '//' + location.host);
  }, []);

  return (
    <Layout
      meta={{
        title: font?.font_name
      }}
    >
      <h1 className="text-5xl">{font?.font_name}</h1>
      <section className="w-full px-2 py-3 sm:px-0">
        <Tab.Group>
          <Tab.List className={'flex p-1 space-x-1 rounded-xl'}>
            {tabs.map((item) => {
              return (
                <Tab
                  key={item.id}
                  className={({ selected }) =>
                    classNames(
                      'w-auto py-2 text-sm leading-5 font-medium text-blue-700 px-4',
                      'focus:outline-none',
                      selected
                        ? 'border-b-2 border-white'
                        : 'text-blue-100 hover:bg-white/[0.12] hover:text-white'
                    )
                  }
                >
                  {item.label}
                </Tab>
              );
            })}
          </Tab.List>
          <Tab.Panels>
            <Tab.Panel>
              {url && (
                <section>
                  <section className="mb-4 mt-4">
                    <p>1. Add this to the top of your css file.</p>
                    <CopyBlock
                      language={'css'}
                      text={`@import url('${url}/api/host/${font?.id}');`}
                      showLineNumbers={false}
                      theme={vs2015}
                      wrapLines={true}
                      codeBlock
                    />
                  </section>

                  <section className="mb-4 mt-4">
                    <p>2. Set font to any element,class, or id</p>
                    <CopyBlock
                      language={'css'}
                      text={`/* ... */\nfont-family: '${font?.font_name}', ${font?.font_category};\n/* ... */`}
                      showLineNumbers={false}
                      theme={vs2015}
                      wrapLines={true}
                      codeBlock
                    />
                  </section>
                </section>
              )}
            </Tab.Panel>
            <Tab.Panel></Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </section>
    </Layout>
  );
}

export async function getServerSideProps({ query, res }) {
  const fontId = query.font_id;

  if (!fontId) {
    res.writeHead(301, { Location: '/404' });
    res.end();
  } else {
    const response = await getFontById(fontId);

    return {
      props: {
        font: response || null
      }
    };
  }
}
