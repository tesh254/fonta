import Link from 'next/link';
import s from './Footer.module.css';

import Logo from '@/components/icons/Logo';
import GitHub from '@/components/icons/GitHub';

export default function Footer() {
  return (
    <footer className="mx-auto max-w-8xl px-6 bg-primary-2">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 border-b border-accents-2 py-12 text-primary transition-colors duration-150 bg-primary-2">
        <div className="col-span-1 lg:col-span-2">
          <Link prefetch href="/">
            <a className="flex flex-initial items-center font-bold md:mr-24">
              <span className="rounded-full border border-gray-700 mr-2">
                <Logo />
              </span>
              <span>FONTA</span>
            </a>
          </Link>
        </div>
        <div className="col-span-1 lg:col-span-2">
          <ul className="flex flex-initial flex-col md:flex-1">
            <li className="py-3 md:py-0 md:pb-4">
              <Link prefetch href="/">
                <a className="text-primary hover:text-accents-6 transition ease-in-out duration-150">
                  Documentation
                </a>
              </Link>
            </li>
            <li className="py-3 md:py-0 md:pb-4">
              <Link prefetch href="/">
                <a className="text-primary hover:text-accents-6 transition ease-in-out duration-150">
                  Blog
                </a>
              </Link>
            </li>
          </ul>
        </div>
        <div className="col-span-1 lg:col-span-2">
          <ul className="flex flex-initial flex-col md:flex-1">
            <li className="py-3 md:py-0 md:pb-4">
              <p className="text-primary font-bold hover:text-accents-6 transition ease-in-out duration-150">
                LEGAL
              </p>
            </li>
            <li className="py-3 md:py-0 md:pb-4">
              <Link prefetch href="/">
                <a className="text-primary hover:text-accents-6 transition ease-in-out duration-150">
                  Privacy Policy
                </a>
              </Link>
            </li>
            <li className="py-3 md:py-0 md:pb-4">
              <Link prefetch href="/">
                <a className="text-primary hover:text-accents-6 transition ease-in-out duration-150">
                  Terms of Use
                </a>
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="py-12 flex flex-col md:flex-row justify-between items-center space-y-4 bg-primary-2">
        <div>
          <span>&copy; {new Date().getFullYear()} Fonta.</span>
        </div>
        <div className="flex items-center">
          <span className="text-primary">Crafted by</span>
          <a href="https://bywachira.com" aria-label="bywachira.com link">
            <img
              src="https://pbs.twimg.com/profile_images/1388605610028109829/e5FX97PB_400x400.jpg"
              alt="Vercel.com Logo"
              className="inline-block h-6 ml-4 text-primary rounded-full"
            />
          </a>
        </div>
      </div>
    </footer>
  );
}
