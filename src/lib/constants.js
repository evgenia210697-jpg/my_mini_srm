export const STATUSES = [
  { id: 'not_started', label: 'Не начато', color: '#9AA1AE', bg: '#EEF0F3' },
  { id: 'in_progress', label: 'В работе', color: '#2D6BFF', bg: '#E8EFFF' },
  { id: 'in_review', label: 'На согласовании', color: '#B7791F', bg: '#FDF3DD' },
  { id: 'done', label: 'Готово', color: '#1E9E5A', bg: '#E5F7ED' },
  { id: 'postponed', label: 'Отложено', color: '#7C6FBE', bg: '#EFECFB' },
  { id: 'blocked', label: 'Заблокировано', color: '#C4392B', bg: '#FBE9E7' },
];

export const STATUS_MAP = Object.fromEntries(STATUSES.map((s) => [s.id, s]));

export const KANBAN_STATUSES = ['not_started', 'in_progress', 'in_review', 'done'];
export const SIDE_STATUSES = ['postponed', 'blocked'];

export const PRIORITIES = [
  { id: 'high', label: 'Высокий', weight: 3, color: '#C4392B', bg: '#FBE9E7' },
  { id: 'medium', label: 'Средний', weight: 2, color: '#B7791F', bg: '#FDF3DD' },
  { id: 'low', label: 'Низкий', weight: 1, color: '#3B7DD8', bg: '#E8F0FE' },
];

export const PRIORITY_MAP = Object.fromEntries(PRIORITIES.map((p) => [p.id, p]));

export const URGENCY_LEVELS = {
  overdue: { id: 'overdue', label: 'Просрочено', weight: 5, color: '#B91C1C', bg: '#FEE2E2' },
  critical: { id: 'critical', label: 'Критично', weight: 4, color: '#DC2626', bg: '#FEE2E2' },
  high: { id: 'high', label: 'Высокая', weight: 3, color: '#EA580C', bg: '#FFEDD5' },
  medium: { id: 'medium', label: 'Средняя', weight: 2, color: '#D97706', bg: '#FEF3C7' },
  low: { id: 'low', label: 'Низкая', weight: 1, color: '#65A30D', bg: '#ECFCCB' },
  none: { id: 'none', label: '—', weight: 0, color: '#9AA1AE', bg: '#EEF0F3' },
};

export const TASK_TYPES = ['Дизайн', 'Контент', 'Документы', 'Согласование'];

export const DEFAULT_PROJECTS = [
  'Сайт Oniks',
  'Сертификация',
  'Портфолио',
  'Фин-курс',
];

export const VIEWS = [
  { id: 'summary', label: 'Сводка' },
  { id: 'list', label: 'Список' },
  { id: 'kanban', label: 'Канбан' },
  { id: 'calendar', label: 'Календарь' },
];

export const BRAND = {
  accent: '#2D6BFF',
  bg: '#F7F8FA',
  card: '#FFFFFF',
  text: '#16181C',
};
