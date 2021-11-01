import moment from 'moment';
import momentTimezone from 'moment-timezone';
import Link from 'next/link';
import { css } from 'goober';
import ICONS from '../Icons';
import { CardContent } from './styles';

function FontCardItem({ font_name, created_at, font_weight, font_link }) {
  return (
    <Link href={font_link}>
      <a>
        <section
          className={`w-full hover:bg-white hover:text-black relative h-auto mt-2 mb-4 bg-black border border-1 border-gray-500 rounded-md px-2 py-4 ${css`
            transition: 0.3s all;
          `}`}
        >
          <CardContent>
            <h3 className="text-accent-4 font-bold">{font_name}</h3>
            <h3 className="text-accent-4 text-[12px]">{font_weight}</h3>
            <h3 className="text-accent-4 text-[12px]">
              {moment(
                momentTimezone.tz(created_at, momentTimezone.tz.guess())
              ).fromNow()}
            </h3>
          </CardContent>
          <button
            className={`p-2 bg-white text-black hover:text-gray-400 rounded-full absolute ${css`
              top: -10px;
              right: -10px;
            `}`}
          >
            {ICONS.link()}
          </button>
        </section>
      </a>
    </Link>
  );
}

export default FontCardItem;
