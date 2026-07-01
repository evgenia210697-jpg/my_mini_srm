import { PRIORITY_MAP, URGENCY_LEVELS } from './constants';

const DAY_MS = 24 * 60 * 60 * 1000;

export function startOfDay(date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

export function daysUntil(dateStr) {
  if (!dateStr) return null;
  const today = startOfDay(new Date());
  const target = startOfDay(dateStr);
  return Math.round((target - today) / DAY_MS);
}

export function getUrgency(task) {
  if (!task.deadline || task.status === 'done') return URGENCY_LEVELS.none;
  const days = daysUntil(task.deadline);
  if (days < 0) return URGENCY_LEVELS.overdue;
  if (days <= 1) return URGENCY_LEVELS.critical;
  if (days <= 3) return URGENCY_LEVELS.high;
  if (days <= 7) return URGENCY_LEVELS.medium;
  return URGENCY_LEVELS.low;
}

export function isBurning(task) {
  const u = getUrgency(task);
  return u.id === 'overdue' || u.id === 'critical';
}

export function getSmartScore(task) {
  const priorityWeight = PRIORITY_MAP[task.priority]?.weight ?? 0;
  const urgencyWeight = getUrgency(task).weight;
  return priorityWeight * 10 + urgencyWeight;
}

export function computeChecklistProgress(checklist) {
  if (!checklist || checklist.length === 0) return null;
  const done = checklist.filter((c) => c.done).length;
  return Math.round((done / checklist.length) * 100);
}

export function getEffectiveProgress(task) {
  if (task.status === 'done') return 100;
  if (task.progressMode === 'auto') {
    const auto = computeChecklistProgress(task.checklist);
    return auto ?? task.progress ?? 0;
  }
  return task.progress ?? 0;
}

export function formatDate(dateStr) {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  return d.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

export function formatDateShort(dateStr) {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  return d.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit' });
}

export function deadlineLabel(task) {
  if (!task.deadline) return null;
  const days = daysUntil(task.deadline);
  if (task.status === 'done') return null;
  if (days < 0) return `Просрочено на ${Math.abs(days)} дн.`;
  if (days === 0) return 'Срок сегодня';
  if (days === 1) return 'Срок завтра';
  return `${days} дн. до срока`;
}

export const SORT_FIELDS = {
  deadline: {
    label: 'По сроку',
    compare: (a, b) => {
      const da = a.deadline ? new Date(a.deadline).getTime() : Infinity;
      const db = b.deadline ? new Date(b.deadline).getTime() : Infinity;
      return da - db;
    },
  },
  priority: {
    label: 'По важности',
    compare: (a, b) => (PRIORITY_MAP[a.priority]?.weight ?? 0) - (PRIORITY_MAP[b.priority]?.weight ?? 0),
  },
  urgency: {
    label: 'По срочности',
    compare: (a, b) => getUrgency(a).weight - getUrgency(b).weight,
  },
  progress: {
    label: 'По прогрессу',
    compare: (a, b) => getEffectiveProgress(a) - getEffectiveProgress(b),
  },
  smart: {
    label: 'Важное и горящее',
    compare: (a, b) => getSmartScore(a) - getSmartScore(b),
  },
  title: {
    label: 'По названию',
    compare: (a, b) => a.title.localeCompare(b.title, 'ru'),
  },
};

export function sortTasks(tasks, field, direction = 'asc') {
  const sorter = SORT_FIELDS[field] ?? SORT_FIELDS.smart;
  const sorted = [...tasks].sort(sorter.compare);
  return direction === 'desc' ? sorted.reverse() : sorted;
}

export function getWeekStart(date) {
  const d = startOfDay(date);
  const day = (d.getDay() + 6) % 7; // Monday = 0
  d.setDate(d.getDate() - day);
  return d;
}

export function getWeeklyLoad(tasks, weeksCount = 6) {
  const firstWeek = getWeekStart(new Date());
  const weeks = Array.from({ length: weeksCount }, (_, i) => {
    const start = new Date(firstWeek);
    start.setDate(start.getDate() + i * 7);
    const end = new Date(start);
    end.setDate(end.getDate() + 6);
    return { start, end, count: 0, hours: 0 };
  });

  tasks.forEach((t) => {
    if (!t.deadline || t.status === 'done') return;
    const d = startOfDay(t.deadline).getTime();
    const week = weeks.find((w) => d >= w.start.getTime() && d <= w.end.getTime());
    if (week) {
      week.count += 1;
      week.hours += t.effortEstimate ?? 0;
    }
  });

  return weeks.map((w) => ({
    label: `${w.start.getDate()}.${String(w.start.getMonth() + 1).padStart(2, '0')}`,
    count: w.count,
    hours: w.hours,
  }));
}

export function filterTasks(tasks, filters) {
  return tasks.filter((t) => {
    if (filters.status?.length && !filters.status.includes(t.status)) return false;
    if (filters.type?.length && !filters.type.includes(t.type)) return false;
    if (filters.project?.length && !filters.project.includes(t.project)) return false;
    if (filters.priority?.length && !filters.priority.includes(t.priority)) return false;
    if (filters.search) {
      const q = filters.search.toLowerCase();
      const hay = `${t.title} ${t.notes ?? ''} ${(t.tags ?? []).join(' ')}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });
}
