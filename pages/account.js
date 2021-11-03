import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';

import LoadingDots from '@/components/ui/LoadingDots';
import Button from '@/components/ui/Button';
import { useUser } from '@/utils/useUser';
import { postData } from '@/utils/helpers';
import Layout from '@/components/Layout';

function Card({ title, description, footer, children }) {
  return (
    <div className="border border-accents-1	max-w-6xl w-full p rounded-md m-auto my-8">
      <div className="px-5 py-4">
        <h3 className="text-2xl mb-1 font-medium">{title}</h3>
        <p className="text-accents-5">{description}</p>
        {children}
      </div>
      <div className="border-t border-accents-1 bg-primary-2 p-4 text-accents-3 rounded-b-md">
        {footer}
      </div>
    </div>
  );
}
export default function Account() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { userLoaded, user, session, userDetails, subscription } = useUser();

  useEffect(() => {
    if (!user) router.replace('/signin');
  }, [user]);

  const redirectToCustomerPortal = async () => {
    setLoading(true);
    const { url, error } = await postData({
      url: '/api/create-portal-link',
      token: session.access_token
    });
    if (error) return alert(error.message);
    window.location.assign(url);
    setLoading(false);
  };

  const subscriptionName = subscription && subscription.prices.products.name;
  const subscriptionPrice =
    subscription &&
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: subscription.prices.currency,
      minimumFractionDigits: 0
    }).format(subscription.prices.unit_amount / 100);

  return (
    <Layout title="Fonts">
      <section className="bg-black mb-32">
        <div className="max-w-6xl mx-auto pt-8 sm:pt-24 pb-8 px-4 sm:px-6 lg:px-8">
          <div className="sm:flex sm:flex-col sm:align-center">
            <h1 className="text-4xl font-extrabold text-white text-left sm:text-6xl">
              Account
            </h1>
          </div>
        </div>
        <div className="p-4">
          <Card
            title="Your Email"
            description="Please enter the email address you want to use to login."
            footer={<p>We will email you to verify the change.</p>}
          >
            <p className="text-xl mt-8 mb-4 font-semibold">
              {user ? user.email : undefined}
            </p>
          </Card>
          <Card
            title="Your Plan"
            description={`Fonta is on early access and free for now, with premium features for teams coming soon such as hosting esm modules and so much more`}
            footer={
              <div className="flex items-start justify-between flex-col sm:flex-row sm:items-center">
                <p className="pb-4 sm:pb-0">Manage your subscription.</p>
                <Button
                  variant="slim"
                  loading={loading}
                  disabled={loading || !subscription}
                  onClick={redirectToCustomerPortal}
                >
                  Coming Soon
                </Button>
              </div>
            }
          >
            {/* <div className="text-xl mt-8 mb-4 font-semibold">
              {!userLoaded ? (
                <div className="h-12 mb-6">
                  <LoadingDots />
                </div>
              ) : subscriptionPrice ? (
                `${subscriptionPrice}/${subscription.prices.interval}`
              ) : (
                <Link href="/">
                  <a>Choose your plan</a>
                </Link>
              )}
            </div> */}
          </Card>
        </div>
      </section>
    </Layout>
  );
}
