import { useMemo, useState } from 'react';
import Badge from '../common/Badge';
import { PRIORITY_MAP } from '../../lib/constants';
import { getUrgency, isBurning, startOfDay } from '../../lib/taskUtils';

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

  return (
    <div className="bg-white rounded-2xl border border-[#EEF0F3] shadow-sm p-4">
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1))}
          className="w-8 h-8 rounded-lg border border-[#E5E7EB] hover:bg-[#F1F2F4]"
        >
          ‹
        </button>
        <h2 className="font-heading text-base font-semibold text-[#16181C]">
          {MONTHS[cursor.getMonth()]} {cursor.getFullYear()}
        </h2>
        <button
          onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1))}
          className="w-8 h-8 rounded-lg border border-[#E5E7EB] hover:bg-[#F1F2F4]"
        >
          ›
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-1">
        {WEEKDAYS.map((w) => (
          <div key={w} className="text-xs font-medium text-[#9AA1AE] text-center py-1">{w}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
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
    </div>
  );
}
