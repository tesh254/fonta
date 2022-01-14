import { serialize } from 'next-mdx-remote/serialize';
import { MDXProvider } from 'next-mdx-remote';
import Layout from '@/components/Layout';
import fs from 'fs';

export default function PrivacyPolicy({ source }) {
  return (
    <Layout title="Privacy Policy">
      <MDXProvider {...source} />
    </Layout>
  );
}

export async function getStaticProps() {
  const content = fs.readFileSync('docs/privacy-policy.md').toString();

  const mdxSource = await serialize(content);
  return { props: { source: mdxSource } };
}
