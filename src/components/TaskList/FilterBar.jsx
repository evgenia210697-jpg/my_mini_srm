import MultiSelectFilter from './MultiSelectFilter';
import { STATUSES, PRIORITIES, TASK_TYPES } from '../../lib/constants';
import { SORT_FIELDS } from '../../lib/taskUtils';

export default function FilterBar({ filters, onFiltersChange, projects, sort, onSortChange }) {
  const set = (patch) => onFiltersChange({ ...filters, ...patch });

  return (
    <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-2 mb-4">
      <input
        value={filters.search}
        onChange={(e) => set({ search: e.target.value })}
        placeholder="Поиск задач…"
        className="w-full sm:w-56 border border-[#E5E7EB] rounded-lg px-3 py-2 sm:py-1.5 text-sm focus:outline-none focus:border-[#2D6BFF]"
      />

      <div className="flex items-center gap-2 overflow-x-auto sm:overflow-visible sm:flex-wrap -mx-3 px-3 sm:mx-0 sm:px-0">
        <MultiSelectFilter label="Статус" options={STATUSES} selected={filters.status} onChange={(v) => set({ status: v })} />
        <MultiSelectFilter label="Тип" options={TASK_TYPES} selected={filters.type} onChange={(v) => set({ type: v })} />
        <MultiSelectFilter label="Проект" options={projects} selected={filters.project} onChange={(v) => set({ project: v })} />
        <MultiSelectFilter label="Важность" options={PRIORITIES} selected={filters.priority} onChange={(v) => set({ priority: v })} />
      </div>

      <div className="flex items-center gap-2 sm:ml-auto">
        <select
          value={sort.field}
          onChange={(e) => onSortChange({ ...sort, field: e.target.value })}
          className="flex-1 sm:flex-none border border-[#E5E7EB] rounded-lg px-3 py-2 sm:py-1.5 text-sm bg-white focus:outline-none focus:border-[#2D6BFF]"
        >
          {Object.entries(SORT_FIELDS).map(([key, val]) => (
            <option key={key} value={key}>{val.label}</option>
          ))}
        </select>
        <button
          onClick={() => onSortChange({ ...sort, direction: sort.direction === 'asc' ? 'desc' : 'asc' })}
          className="w-10 h-10 sm:w-8 sm:h-8 shrink-0 flex items-center justify-center rounded-lg border border-[#E5E7EB] text-[#4B5563] hover:bg-[#F1F2F4]"
          title="Направление сортировки"
        >
          {sort.direction === 'asc' ? '↑' : '↓'}
        </button>
      </div>
    </div>
  );
}
