import Layout from '@/components/Layout';
import Button from '@/components/ui/Button';
import ICONS from '@/components/ui/Icons';
import { getActiveProductsWithPrices } from '@/utils/supabase-client';
import { useUser } from '@/utils/useUser';
import { useRouter } from 'next/router';

export default function IndexPage() {
  const router = useRouter();
  const { user } = useUser();

  function getStarted(route) {
    router.push(`/${route}`);
  }

  return (
    <Layout>
      <section>
        <div className="sm:flex sm:flex-col sm:align-center">
          <h1 className="text-4xl font-extrabold text-white sm:text-center sm:text-6xl">
            Fonta
          </h1>
          <p className="mt-5 text-xl text-accents-6 sm:text-center sm:text-2xl max-w-2xl m-auto">
            Easily host all your fonts and use them anywhere securely
          </p>
          <br />
          <section className="flex flex-col justify-between max-w-lg p-3 m-auto w-80">
            <section className="flex flex-col space-y-4">
              {user ? (
                <Button
                  onClick={() => getStarted('fonts')}
                  className="mt-1 w-auto"
                  variant="slim"
                  type="submit"
                >
                  <span>Upload Font</span> {ICONS.upload('ml-2')}
                </Button>
              ) : (
                <Button
                  onClick={() => getStarted('signin')}
                  className="mt-1 w-auto"
                  variant="slim"
                  type="submit"
                >
                  Try it free now
                </Button>
              )}
            </section>
          </section>
        </div>
      </section>
    </Layout>
  );
}

export async function getStaticProps() {
  return {
    props: {
      products: []
    },
    revalidate: 60
  };
}
