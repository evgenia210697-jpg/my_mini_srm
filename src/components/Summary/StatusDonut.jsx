import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import WidgetCard from './WidgetCard';
import { STATUSES } from '../../lib/constants';

export default function StatusDonut({ tasks }) {
  const data = STATUSES.map((s) => ({
    name: s.label,
    value: tasks.filter((t) => t.status === s.id).length,
    color: s.color,
  })).filter((d) => d.value > 0);

  return (
    <WidgetCard title="Распределение по статусам">
      {data.length === 0 ? (
        <p className="text-sm text-[#9AA1AE] py-8 text-center">Пока нет задач для отображения.</p>
      ) : (
        <div className="flex items-center gap-4">
          <div className="w-36 h-36 shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={data} dataKey="value" nameKey="name" innerRadius={38} outerRadius={62} paddingAngle={2}>
                  {data.map((d) => (
                    <Cell key={d.name} fill={d.color} stroke="none" />
                  ))}
                </Pie>
                <Tooltip formatter={(value, name) => [`${value}`, name]} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <ul className="space-y-1.5 flex-1">
            {data.map((d) => (
              <li key={d.name} className="flex items-center gap-2 text-sm">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }} />
                <span className="text-[#4B5563] flex-1">{d.name}</span>
                <span className="font-medium text-[#16181C]">{d.value}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </WidgetCard>
  );
}
