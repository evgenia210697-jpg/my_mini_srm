import Badge from '../common/Badge';
import ProgressBar from '../common/ProgressBar';
import { STATUS_MAP, PRIORITY_MAP } from '../../lib/constants';
import { getUrgency, getEffectiveProgress, formatDateShort, isBurning } from '../../lib/taskUtils';

export default function TaskCardList({ tasks, onOpenTask, onStatusChange }) {
  if (tasks.length === 0) {
    return <p className="text-sm text-[#9AA1AE] text-center py-12">Нет задач под текущие фильтры.</p>;
  }

  return (
    <div className="space-y-2.5">
      {tasks.map((t) => {
        const status = STATUS_MAP[t.status];
        const priority = PRIORITY_MAP[t.priority];
        const urgency = getUrgency(t);
        const progress = getEffectiveProgress(t);
        const burning = isBurning(t) && t.status !== 'done';

        return (
          <div
            key={t.id}
            onClick={() => onOpenTask(t)}
            className="bg-white rounded-2xl border border-[#EEF0F3] shadow-sm p-4 active:bg-[#F7F8FA]"
          >
            <div className="flex items-start justify-between gap-2">
              <p className="text-sm font-medium text-[#16181C] leading-snug">{t.title}</p>
              {t.deadline && (
                <span className="shrink-0 text-xs font-medium text-[#4B5563] whitespace-nowrap">{formatDateShort(t.deadline)}</span>
              )}
            </div>
            <p className="text-xs text-[#9AA1AE] mt-0.5">{t.project}</p>

            <div className="flex items-center gap-1.5 flex-wrap mt-2.5">
              <Badge label={priority.label} color={priority.color} bg={priority.bg} />
              <Badge label={urgency.label} color={urgency.color} bg={urgency.bg} pulse={burning} />
            </div>

            <div className="flex items-center gap-2 mt-3">
              <ProgressBar value={progress} size="sm" color={status.color} />
              <span className="text-xs text-[#9AA1AE] shrink-0">{progress}%</span>
            </div>

            <div className="mt-3" onClick={(e) => e.stopPropagation()}>
              <select
                value={t.status}
                onChange={(e) => onStatusChange(t.id, e.target.value)}
                className="w-full text-sm font-medium rounded-lg px-3 py-2 border-none focus:outline-none"
                style={{ color: status.color, backgroundColor: status.bg }}
              >
                {Object.values(STATUS_MAP).map((s) => (
                  <option key={s.id} value={s.id}>{s.label}</option>
                ))}
              </select>
            </div>
          </div>
        );
      })}
    </div>
  );
}
