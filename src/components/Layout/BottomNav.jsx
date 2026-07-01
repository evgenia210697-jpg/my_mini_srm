import { VIEWS } from '../../lib/constants';

const ICONS = {
  summary: '◧',
  list: '☰',
  kanban: '▥',
  calendar: '▦',
};

export default function BottomNav({ view, onViewChange }) {
  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-[#EEF0F3] flex"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      {VIEWS.map((v) => (
        <button
          key={v.id}
          onClick={() => onViewChange(v.id)}
          className={`flex-1 flex flex-col items-center justify-center gap-0.5 py-2 min-h-[56px] text-xs font-medium ${
            view === v.id ? 'text-[#2D6BFF]' : 'text-[#9AA1AE]'
          }`}
        >
          <span className="text-lg leading-none">{ICONS[v.id]}</span>
          {v.label}
        </button>
      ))}
    </nav>
  );
}
