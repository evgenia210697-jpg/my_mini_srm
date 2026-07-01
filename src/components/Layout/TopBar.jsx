import { VIEWS } from '../../lib/constants';
import DataMenu from './DataMenu';

export default function TopBar({ view, onViewChange, onNewTask, tasks, onImport, onReset }) {
  return (
    <header className="sticky top-0 z-30 bg-[#F7F8FA]/95 backdrop-blur border-b border-[#EEF0F3]">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-4 flex flex-wrap items-center gap-3 justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#2D6BFF] text-white flex items-center justify-center font-heading font-semibold">O</div>
          <div>
            <h1 className="font-heading text-base font-semibold leading-tight text-[#16181C]">Мои задачи</h1>
            <p className="text-xs text-[#9AA1AE] leading-tight">Личная мини-CRM</p>
          </div>
        </div>

        <nav className="flex items-center gap-1 bg-white border border-[#EEF0F3] rounded-xl p-1">
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

        <div className="flex items-center gap-2">
          <DataMenu tasks={tasks} onImport={onImport} onReset={onReset} />
          <button
            onClick={onNewTask}
            className="px-4 py-2 rounded-lg text-sm font-medium text-white bg-[#2D6BFF] hover:bg-[#1E54DB] shadow-sm"
          >
            + Новая задача
          </button>
        </div>
      </div>
    </header>
  );
}
