import { DndContext, MouseSensor, TouchSensor, useSensor, useSensors } from '@dnd-kit/core';
import KanbanColumn from './KanbanColumn';
import { STATUSES } from '../../lib/constants';

export default function KanbanView({ tasks, onOpenTask, onStatusChange }) {
  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 6 } }),
    // Delay (not distance) for touch, so a normal scroll gesture on a card
    // isn't hijacked as a drag — drag only starts after a short hold.
    useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 8 } })
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
      <div className="flex gap-3 sm:gap-4 overflow-x-auto pb-2 snap-x snap-mandatory sm:snap-none -mx-3 px-3 sm:mx-0 sm:px-0">
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
