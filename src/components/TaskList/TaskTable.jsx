import Badge from '../common/Badge';
import ProgressBar from '../common/ProgressBar';
import { STATUS_MAP, PRIORITY_MAP } from '../../lib/constants';
import { getUrgency, getEffectiveProgress, formatDateShort, isBurning } from '../../lib/taskUtils';

export default function TaskTable({ tasks, onOpenTask, onStatusChange }) {
  if (tasks.length === 0) {
    return <p className="text-sm text-[#9AA1AE] text-center py-12">Нет задач под текущие фильтры.</p>;
  }

  return (
    <div className="bg-white rounded-2xl border border-[#EEF0F3] shadow-sm overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-xs text-[#9AA1AE] border-b border-[#EEF0F3]">
            <th className="px-4 py-3 font-medium">Задача</th>
            <th className="px-4 py-3 font-medium">Проект</th>
            <th className="px-4 py-3 font-medium">Статус</th>
            <th className="px-4 py-3 font-medium">Важность</th>
            <th className="px-4 py-3 font-medium">Срочность</th>
            <th className="px-4 py-3 font-medium">Срок</th>
            <th className="px-4 py-3 font-medium w-36">Прогресс</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((t) => {
            const status = STATUS_MAP[t.status];
            const priority = PRIORITY_MAP[t.priority];
            const urgency = getUrgency(t);
            const progress = getEffectiveProgress(t);
            const burning = isBurning(t) && t.status !== 'done';
            return (
              <tr
                key={t.id}
                onClick={() => onOpenTask(t)}
                className="border-b border-[#F5F6F8] last:border-0 hover:bg-[#F7F8FA] cursor-pointer"
              >
                <td className="px-4 py-3">
                  <p className="font-medium text-[#16181C]">{t.title}</p>
                  {t.tags?.length > 0 && (
                    <p className="text-xs text-[#9AA1AE] mt-0.5">{t.tags.map((tg) => `#${tg}`).join(' ')}</p>
                  )}
                </td>
                <td className="px-4 py-3 text-[#4B5563]">{t.project}</td>
                <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                  <select
                    value={t.status}
                    onChange={(e) => onStatusChange(t.id, e.target.value)}
                    className="text-xs font-medium rounded-full px-2 py-1 border-none focus:outline-none cursor-pointer"
                    style={{ color: status.color, backgroundColor: status.bg }}
                  >
                    {Object.values(STATUS_MAP).map((s) => (
                      <option key={s.id} value={s.id}>{s.label}</option>
                    ))}
                  </select>
                </td>
                <td className="px-4 py-3">
                  <Badge label={priority.label} color={priority.color} bg={priority.bg} />
                </td>
                <td className="px-4 py-3">
                  <Badge label={urgency.label} color={urgency.color} bg={urgency.bg} pulse={burning} />
                </td>
                <td className="px-4 py-3 text-[#4B5563] whitespace-nowrap">{formatDateShort(t.deadline)}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <ProgressBar value={progress} size="sm" color={status.color} />
                    <span className="text-xs text-[#9AA1AE] w-8 text-right">{progress}%</span>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
