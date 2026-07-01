import { STATUSES } from '../../lib/constants';

export default function Counters({ tasks }) {
  const total = tasks.length;
  const byStatus = STATUSES.map((s) => ({
    ...s,
    count: tasks.filter((t) => t.status === s.id).length,
  }));

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
      <div className="bg-white rounded-2xl border border-[#EEF0F3] p-4 shadow-sm">
        <p className="text-2xl font-semibold text-[#16181C]">{total}</p>
        <p className="text-xs text-[#9AA1AE] mt-0.5">Всего задач</p>
      </div>
      {byStatus.map((s) => (
        <div key={s.id} className="bg-white rounded-2xl border border-[#EEF0F3] p-4 shadow-sm">
          <p className="text-2xl font-semibold" style={{ color: s.color }}>{s.count}</p>
          <p className="text-xs text-[#9AA1AE] mt-0.5">{s.label}</p>
        </div>
      ))}
    </div>
  );
}
