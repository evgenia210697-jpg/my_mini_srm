import MultiSelectFilter from './MultiSelectFilter';
import { STATUSES, PRIORITIES, TASK_TYPES } from '../../lib/constants';
import { SORT_FIELDS } from '../../lib/taskUtils';

export default function FilterBar({ filters, onFiltersChange, projects, sort, onSortChange }) {
  const set = (patch) => onFiltersChange({ ...filters, ...patch });

  return (
    <div className="flex flex-wrap items-center gap-2 mb-4">
      <input
        value={filters.search}
        onChange={(e) => set({ search: e.target.value })}
        placeholder="Поиск задач…"
        className="w-56 border border-[#E5E7EB] rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-[#2D6BFF]"
      />
      <MultiSelectFilter label="Статус" options={STATUSES} selected={filters.status} onChange={(v) => set({ status: v })} />
      <MultiSelectFilter label="Тип" options={TASK_TYPES} selected={filters.type} onChange={(v) => set({ type: v })} />
      <MultiSelectFilter label="Проект" options={projects} selected={filters.project} onChange={(v) => set({ project: v })} />
      <MultiSelectFilter label="Важность" options={PRIORITIES} selected={filters.priority} onChange={(v) => set({ priority: v })} />

      <div className="ml-auto flex items-center gap-2">
        <select
          value={sort.field}
          onChange={(e) => onSortChange({ ...sort, field: e.target.value })}
          className="border border-[#E5E7EB] rounded-lg px-3 py-1.5 text-sm bg-white focus:outline-none focus:border-[#2D6BFF]"
        >
          {Object.entries(SORT_FIELDS).map(([key, val]) => (
            <option key={key} value={key}>{val.label}</option>
          ))}
        </select>
        <button
          onClick={() => onSortChange({ ...sort, direction: sort.direction === 'asc' ? 'desc' : 'asc' })}
          className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#E5E7EB] text-[#4B5563] hover:bg-[#F1F2F4]"
          title="Направление сортировки"
        >
          {sort.direction === 'asc' ? '↑' : '↓'}
        </button>
      </div>
    </div>
  );
}
