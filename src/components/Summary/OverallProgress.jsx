import WidgetCard from './WidgetCard';
import ProgressBar from '../common/ProgressBar';
import { getEffectiveProgress } from '../../lib/taskUtils';

export default function OverallProgress({ tasks }) {
  const active = tasks.filter((t) => t.status !== 'done');
  const avg = active.length
    ? Math.round(active.reduce((sum, t) => sum + getEffectiveProgress(t), 0) / active.length)
    : 0;
  const doneCount = tasks.filter((t) => t.status === 'done').length;

  return (
    <WidgetCard title="Общий прогресс">
      <div className="flex items-end justify-between mb-2">
        <span className="text-3xl font-semibold text-[#16181C]">{avg}%</span>
        <span className="text-xs text-[#9AA1AE]">{doneCount} из {tasks.length} готово</span>
      </div>
      <ProgressBar value={avg} />
      <p className="text-xs text-[#9AA1AE] mt-2">Средний прогресс по активным задачам ({active.length})</p>
    </WidgetCard>
  );
}
