import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import Badge from '../common/Badge';
import ProgressBar from '../common/ProgressBar';
import { PRIORITY_MAP, STATUS_MAP } from '../../lib/constants';
import { getUrgency, getEffectiveProgress, formatDateShort, isBurning } from '../../lib/taskUtils';

export default function KanbanCard({ task, onOpen }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id: task.id });
  const priority = PRIORITY_MAP[task.priority];
  const urgency = getUrgency(task);
  const progress = getEffectiveProgress(task);
  const burning = isBurning(task) && task.status !== 'done';

  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.4 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      onClick={() => onOpen(task)}
      className="bg-white rounded-xl border border-[#EEF0F3] p-3 shadow-sm hover:shadow-md cursor-grab active:cursor-grabbing space-y-2"
    >
      <p className="text-sm font-medium text-[#16181C] leading-snug">{task.title}</p>
      <p className="text-xs text-[#9AA1AE]">{task.project}</p>
      <div className="flex items-center gap-1.5 flex-wrap">
        <Badge label={priority.label} color={priority.color} bg={priority.bg} />
        {task.deadline && (
          <Badge label={`${formatDateShort(task.deadline)}`} color={urgency.color} bg={urgency.bg} pulse={burning} />
        )}
      </div>
      <ProgressBar value={progress} size="sm" color={STATUS_MAP[task.status].color} />
    </div>
  );
}
