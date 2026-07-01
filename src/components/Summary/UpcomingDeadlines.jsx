import WidgetCard from './WidgetCard';
import Badge from '../common/Badge';
import { getUrgency, formatDate, deadlineLabel } from '../../lib/taskUtils';
import { PRIORITY_MAP } from '../../lib/constants';

export default function UpcomingDeadlines({ tasks, onOpenTask }) {
  const upcoming = tasks
    .filter((t) => t.deadline && t.status !== 'done')
    .sort((a, b) => new Date(a.deadline) - new Date(b.deadline))
    .slice(0, 5);

  return (
    <WidgetCard title="Ближайшие дедлайны">
      {upcoming.length === 0 ? (
        <p className="text-sm text-[#9AA1AE] py-4 text-center">Нет активных дедлайнов — можно выдохнуть.</p>
      ) : (
        <ul className="divide-y divide-[#F1F2F4]">
          {upcoming.map((t) => {
            const urgency = getUrgency(t);
            const burning = urgency.id === 'overdue' || urgency.id === 'critical';
            return (
              <li
                key={t.id}
                onClick={() => onOpenTask(t)}
                className="py-2.5 flex items-center gap-3 cursor-pointer hover:bg-[#F7F8FA] rounded-lg px-2 -mx-2"
              >
                <div className={`w-2 h-2 rounded-full shrink-0 ${burning ? 'pulse-urgent' : ''}`} style={{ backgroundColor: urgency.color }} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[#16181C] truncate">{t.title}</p>
                  <p className="text-xs text-[#9AA1AE]">{t.project} · {formatDate(t.deadline)} · {deadlineLabel(t)}</p>
                </div>
                <Badge label={PRIORITY_MAP[t.priority]?.label} color={PRIORITY_MAP[t.priority]?.color} bg={PRIORITY_MAP[t.priority]?.bg} />
              </li>
            );
          })}
        </ul>
      )}
    </WidgetCard>
  );
}
