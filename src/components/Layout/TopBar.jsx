import { VIEWS } from '../../lib/constants';
import DataMenu from './DataMenu';

export default function TopBar({ view, onViewChange, onNewTask, tasks, onImport, onReset, onLogout }) {
  return (
    <header className="sticky top-0 z-30 bg-[#F7F8FA]/95 backdrop-blur border-b border-[#EEF0F3]">
      <div className="max-w-[1400px] mx-auto px-3 sm:px-6 py-3 sm:py-4 flex items-center gap-2 sm:gap-3 justify-between">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-[#2D6BFF] text-white flex items-center justify-center font-heading font-semibold shrink-0">O</div>
          <div className="min-w-0">
            <h1 className="font-heading text-sm sm:text-base font-semibold leading-tight text-[#16181C] truncate">Мои задачи</h1>
            <p className="hidden sm:block text-xs text-[#9AA1AE] leading-tight">Личная мини-CRM</p>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-1 bg-white border border-[#EEF0F3] rounded-xl p-1">
          {VIEWS.map((v) => (
            <button
              key={v.id}
              onClick={() => onViewChange(v.id)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                view === v.id ? 'bg-[#2D6BFF] text-white' : 'text-[#4B5563] hover:bg-[#F1F2F4]'
              }`}
            >
              {v.label}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <div className="hidden sm:block">
            <DataMenu tasks={tasks} onImport={onImport} onReset={onReset} />
          </div>
          <button
            onClick={onNewTask}
            aria-label="Новая задача"
            className="flex items-center justify-center gap-1.5 px-3 sm:px-4 h-10 sm:h-9 rounded-lg text-sm font-medium text-white bg-[#2D6BFF] hover:bg-[#1E54DB] shadow-sm"
          >
            <span className="text-base leading-none">+</span>
            <span className="hidden sm:inline">Новая задача</span>
          </button>
          <button
            onClick={onLogout}
            title="Выйти"
            aria-label="Выйти"
            className="hidden sm:flex w-9 h-9 items-center justify-center rounded-lg text-[#9AA1AE] border border-[#E5E7EB] hover:bg-[#F1F2F4] hover:text-[#DC2626]"
          >
            ⏻
          </button>
        </div>
      </div>

      <div className="flex sm:hidden items-center justify-between gap-2 px-3 pb-2">
        <DataMenu tasks={tasks} onImport={onImport} onReset={onReset} />
        <button
          onClick={onLogout}
          className="flex items-center gap-1.5 px-3 h-9 rounded-lg text-sm font-medium text-[#9AA1AE] border border-[#E5E7EB] hover:bg-[#F1F2F4] hover:text-[#DC2626]"
        >
          ⏻ Выйти
        </button>
      </div>
    </header>
  );
}
