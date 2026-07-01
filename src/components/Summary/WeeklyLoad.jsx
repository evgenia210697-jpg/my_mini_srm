import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import WidgetCard from './WidgetCard';
import { getWeeklyLoad } from '../../lib/taskUtils';

export default function WeeklyLoad({ tasks }) {
  const data = getWeeklyLoad(tasks, 6);

  return (
    <WidgetCard title="Загрузка по неделям">
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
            <CartesianGrid vertical={false} stroke="#EEF0F3" />
            <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#9AA1AE' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: '#9AA1AE' }} axisLine={false} tickLine={false} allowDecimals={false} />
            <Tooltip
              formatter={(value, name) => [value, name === 'count' ? 'Задач' : 'Часов']}
              labelFormatter={(label) => `Неделя от ${label}`}
            />
            <Bar dataKey="count" fill="#2D6BFF" radius={[6, 6, 0, 0]} maxBarSize={28} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <p className="text-xs text-[#9AA1AE] mt-1">Число задач со сроком в каждую из ближайших 6 недель</p>
    </WidgetCard>
  );
}
