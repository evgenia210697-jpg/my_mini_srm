import { DndContext, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import KanbanColumn from './KanbanColumn';
import { STATUSES } from '../../lib/constants';

export default function KanbanView({ tasks, onOpenTask, onStatusChange }) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over) return;
    const task = tasks.find((t) => t.id === active.id);
    if (task && task.status !== over.id) {
      onStatusChange(active.id, over.id);
    }
  };

  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
      <div className="flex gap-4 overflow-x-auto pb-2">
        {STATUSES.map((status) => (
          <KanbanColumn
            key={status.id}
            status={status}
            tasks={tasks.filter((t) => t.status === status.id)}
            onOpen={onOpenTask}
          />
        ))}
      </div>
    </DndContext>
  );
}
