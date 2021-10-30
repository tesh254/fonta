import moment from 'moment';
import momentTimezone from 'moment-timezone';
import { CardContent } from './styles';

function FontCardItem({ font_name, created_at, font_weight }) {
  return (
    <section className="w-full h-auto my-2 bg-black border border-1 border-gray-500 rounded-md px-2 py-4">
      <CardContent>
        <h3 className="text-accent-4 font-bold">{font_name}</h3>
        <h3 className="text-accent-4 text-[12px]">{font_weight}</h3>
        <h3 className="text-accent-4 text-[12px]">
          {moment(
            momentTimezone.tz(created_at, momentTimezone.tz.guess())
          ).fromNow()}
        </h3>
      </CardContent>
    </section>
  );
}

export default FontCardItem;
