import { useMemo, useState } from 'react';
import Badge from '../common/Badge';
import ProgressBar from '../common/ProgressBar';
import { PRIORITY_MAP, STATUS_MAP } from '../../lib/constants';
import { getUrgency, isBurning, startOfDay, formatDate, getEffectiveProgress } from '../../lib/taskUtils';

const WEEKDAYS = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
const MONTHS = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];

function buildMonthGrid(year, month) {
  const first = new Date(year, month, 1);
  const startOffset = (first.getDay() + 6) % 7;
  const gridStart = new Date(year, month, 1 - startOffset);
  return Array.from({ length: 42 }, (_, i) => {
    const d = new Date(gridStart);
    d.setDate(gridStart.getDate() + i);
    return d;
  });
}

export default function CalendarView({ tasks, onOpenTask }) {
  const today = startOfDay(new Date());
  const [cursor, setCursor] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [selectedDay, setSelectedDay] = useState(today);

  const days = useMemo(() => buildMonthGrid(cursor.getFullYear(), cursor.getMonth()), [cursor]);

  const tasksByDay = useMemo(() => {
    const map = new Map();
    tasks.forEach((t) => {
      if (!t.deadline) return;
      const key = startOfDay(t.deadline).toDateString();
      if (!map.has(key)) map.set(key, []);
      map.get(key).push(t);
    });
    return map;
  }, [tasks]);

  const changeMonth = (delta) => {
    setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + delta, 1));
  };

  const selectedDayTasks = selectedDay ? tasksByDay.get(selectedDay.toDateString()) ?? [] : [];

  return (
    <div className="bg-white rounded-2xl border border-[#EEF0F3] shadow-sm p-3 sm:p-4">
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => changeMonth(-1)}
          className="w-9 h-9 sm:w-8 sm:h-8 rounded-lg border border-[#E5E7EB] hover:bg-[#F1F2F4]"
        >
          ‹
        </button>
        <h2 className="font-heading text-base font-semibold text-[#16181C]">
          {MONTHS[cursor.getMonth()]} {cursor.getFullYear()}
        </h2>
        <button
          onClick={() => changeMonth(1)}
          className="w-9 h-9 sm:w-8 sm:h-8 rounded-lg border border-[#E5E7EB] hover:bg-[#F1F2F4]"
        >
          ›
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-1">
        {WEEKDAYS.map((w) => (
          <div key={w} className="text-xs font-medium text-[#9AA1AE] text-center py-1">{w}</div>
        ))}
      </div>

      {/* Desktop: full grid with inline task chips */}
      <div className="hidden md:grid grid-cols-7 gap-1">
        {days.map((d) => {
          const inMonth = d.getMonth() === cursor.getMonth();
          const isToday = d.toDateString() === today.toDateString();
          const dayTasks = tasksByDay.get(d.toDateString()) ?? [];
          return (
            <div
              key={d.toISOString()}
              className={`min-h-[92px] rounded-lg p-1.5 border ${isToday ? 'border-[#2D6BFF]' : 'border-[#F1F2F4]'} ${inMonth ? 'bg-white' : 'bg-[#FAFBFC]'}`}
            >
              <p className={`text-xs mb-1 ${inMonth ? 'text-[#4B5563]' : 'text-[#D1D5DB]'} ${isToday ? 'font-semibold text-[#2D6BFF]' : ''}`}>
                {d.getDate()}
              </p>
              <div className="space-y-1">
                {dayTasks.slice(0, 3).map((t) => {
                  const priority = PRIORITY_MAP[t.priority];
                  const burning = isBurning(t) && t.status !== 'done';
                  return (
                    <button
                      key={t.id}
                      onClick={() => onOpenTask(t)}
                      title={t.title}
                      className={`w-full text-left text-[10px] leading-tight px-1.5 py-0.5 rounded truncate block ${burning ? 'pulse-urgent' : ''}`}
                      style={{ color: priority.color, backgroundColor: priority.bg }}
                    >
                      {t.title}
                    </button>
                  );
                })}
                {dayTasks.length > 3 && (
                  <p className="text-[10px] text-[#9AA1AE] px-1.5">+{dayTasks.length - 3} ещё</p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Mobile: compact grid with dots, tap a day to see its agenda below */}
      <div className="md:hidden grid grid-cols-7 gap-1">
        {days.map((d) => {
          const inMonth = d.getMonth() === cursor.getMonth();
          const isToday = d.toDateString() === today.toDateString();
          const isSelected = selectedDay && d.toDateString() === selectedDay.toDateString();
          const dayTasks = tasksByDay.get(d.toDateString()) ?? [];
          const hasBurning = dayTasks.some((t) => isBurning(t) && t.status !== 'done');
          return (
            <button
              key={d.toISOString()}
              onClick={() => setSelectedDay(d)}
              className={`h-12 rounded-lg flex flex-col items-center justify-center gap-0.5 ${
                isSelected ? 'bg-[#2D6BFF]' : isToday ? 'bg-[#EEF2FF]' : ''
              }`}
            >
              <span className={`text-xs ${isSelected ? 'text-white font-semibold' : inMonth ? 'text-[#16181C]' : 'text-[#D1D5DB]'}`}>
                {d.getDate()}
              </span>
              {dayTasks.length > 0 && (
                <span
                  className={`w-1.5 h-1.5 rounded-full ${hasBurning && !isSelected ? 'pulse-urgent' : ''}`}
                  style={{ backgroundColor: isSelected ? '#fff' : hasBurning ? '#DC2626' : '#2D6BFF' }}
                />
              )}
            </button>
          );
        })}
      </div>

      <div className="md:hidden mt-4 pt-4 border-t border-[#EEF0F3]">
        <p className="text-sm font-medium text-[#16181C] mb-2">
          {selectedDay ? formatDate(selectedDay) : 'Выберите день'}
        </p>
        {selectedDayTasks.length === 0 ? (
          <p className="text-sm text-[#9AA1AE] py-4 text-center">Нет задач с этим сроком.</p>
        ) : (
          <div className="space-y-2">
            {selectedDayTasks.map((t) => {
              const priority = PRIORITY_MAP[t.priority];
              const urgency = getUrgency(t);
              const burning = isBurning(t) && t.status !== 'done';
              return (
                <div
                  key={t.id}
                  onClick={() => onOpenTask(t)}
                  className="rounded-xl border border-[#EEF0F3] p-3 active:bg-[#F7F8FA]"
                >
                  <p className="text-sm font-medium text-[#16181C] leading-snug">{t.title}</p>
                  <p className="text-xs text-[#9AA1AE] mt-0.5">{t.project}</p>
                  <div className="flex items-center gap-1.5 flex-wrap mt-2">
                    <Badge label={priority.label} color={priority.color} bg={priority.bg} />
                    <Badge label={urgency.label} color={urgency.color} bg={urgency.bg} pulse={burning} />
                  </div>
                  <div className="mt-2">
                    <ProgressBar value={getEffectiveProgress(t)} size="sm" color={STATUS_MAP[t.status].color} />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
