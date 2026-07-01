import { useDroppable } from '@dnd-kit/core';
import KanbanCard from './KanbanCard';

export default function KanbanColumn({ status, tasks, onOpen }) {
  const { setNodeRef, isOver } = useDroppable({ id: status.id });

  return (
    <div className="flex flex-col w-72 shrink-0">
      <div className="flex items-center gap-2 mb-2 px-1">
        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: status.color }} />
        <h3 className="text-sm font-semibold text-[#16181C]">{status.label}</h3>
        <span className="text-xs text-[#9AA1AE] ml-auto">{tasks.length}</span>
      </div>
      <div
        ref={setNodeRef}
        className={`flex-1 rounded-2xl p-2 space-y-2 min-h-[120px] transition-colors ${isOver ? 'bg-[#EEF2FF]' : 'bg-[#F1F2F4]/60'}`}
      >
        {tasks.map((t) => (
          <KanbanCard key={t.id} task={t} onOpen={onOpen} />
        ))}
        {tasks.length === 0 && (
          <p className="text-xs text-[#B9BEC9] text-center py-6">Пусто</p>
        )}
      </div>
    </div>
  );
}
