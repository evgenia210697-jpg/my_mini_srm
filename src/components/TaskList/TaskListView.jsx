import { useMemo, useState } from 'react';
import FilterBar from './FilterBar';
import TaskTable from './TaskTable';
import TaskCardList from './TaskCardList';
import { filterTasks, sortTasks } from '../../lib/taskUtils';

const emptyFilters = { status: [], type: [], project: [], priority: [], search: '' };

export default function TaskListView({ tasks, projects, onOpenTask, onStatusChange }) {
  const [filters, setFilters] = useState(emptyFilters);
  const [sort, setSort] = useState({ field: 'smart', direction: 'desc' });

  const visibleTasks = useMemo(() => {
    const filtered = filterTasks(tasks, filters);
    return sortTasks(filtered, sort.field, sort.direction);
  }, [tasks, filters, sort]);

  return (
    <div>
      <FilterBar filters={filters} onFiltersChange={setFilters} projects={projects} sort={sort} onSortChange={setSort} />
      <p className="text-xs text-[#9AA1AE] mb-2">{visibleTasks.length} из {tasks.length} задач</p>
      <div className="hidden md:block">
        <TaskTable tasks={visibleTasks} onOpenTask={onOpenTask} onStatusChange={onStatusChange} />
      </div>
      <div className="md:hidden">
        <TaskCardList tasks={visibleTasks} onOpenTask={onOpenTask} onStatusChange={onStatusChange} />
      </div>
    </div>
  );
}
