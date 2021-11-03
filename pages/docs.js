import Layout from '@/components/Layout';
import Button from '@/components/ui/Button';
import ICONS from '@/components/ui/Icons';
import Image from 'next/image';
import { css } from 'goober';

export default function Docs() {
  return (
    <Layout title="Docs - Fonta">
      <section>
        <div className="sm:flex sm:flex-col sm:align-center">
          <h1 className="text-4xl font-extrabold text-white sm:text-center sm:text-6xl">
            Docs
          </h1>
          <br />
          <section className="my-8">
            <section
              className={`${css`
                box-shadow: 0 0px 4px rgba(255, 255, 255, 0.4);
              `} rounded-xl`}
            >
              <Image
                className={`rounded-xl`}
                src="/home-image.png"
                alt="Fonta Dash"
                width={1467}
                height={455}
              />
            </section>
          </section>
          {/* Steps */}
          <section>
            <ul
              className={`${css`
                list-style-type: none;
                text-align: center;
              `}`}
            >
              <li className="my-8">
                <h1 className="text-white text-2xl font-bold my-2">
                  Upload your font
                </h1>
                <p className="text-gray-400 my-2">
                  Add all different font formats i.e <code>.otf</code>,{' '}
                  <code>.woff</code>, <code>.woff2</code>, <code>.ttf</code> and{' '}
                  <code>.eot</code>
                </p>
                <section
                  className={`${css`
                    box-shadow: 0 0px 4px rgba(255, 255, 255, 0.4);
                  `} rounded-xl my-2`}
                >
                  <Image
                    src="/upload.png"
                    width={1152}
                    height={727}
                    alt="Upload font in Fonta"
                    className="rounded-xl"
                  />
                </section>
              </li>
              <li className="my-8">
                <h1 className="text-white text-2xl font-bold my-2">
                  Use it anywhere
                </h1>
                <p className="text-gray-400 my-2">
                  Just add the <code>@import url('...');</code> line in any of
                  your css files and use the font.
                </p>
                <section
                  className={`${css`
                    box-shadow: 0 0px 4px rgba(255, 255, 255, 0.4);
                  `} rounded-xl my-2`}
                >
                  <Image
                    src="/css-code.png"
                    width={1168}
                    height={368}
                    alt="CSS code in Fonta"
                    className="rounded-xl"
                  />
                </section>
              </li>
            </ul>
          </section>
        </div>
      </section>
    </Layout>
  );
}
