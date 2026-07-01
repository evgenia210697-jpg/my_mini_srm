import { useRef, useState } from 'react';

const PANEL_WIDTH = 208;

export default function MultiSelectFilter({ label, options, selected, onChange }) {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState(null);
  const btnRef = useRef(null);

  const toggle = (value) => {
    onChange(selected.includes(value) ? selected.filter((v) => v !== value) : [...selected, value]);
  };

  const handleToggleOpen = () => {
    if (!open && btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect();
      const left = Math.min(rect.left, window.innerWidth - PANEL_WIDTH - 8);
      setPos({ top: rect.bottom + 4, left: Math.max(8, left) });
    }
    setOpen((v) => !v);
  };

  return (
    <div className="relative shrink-0">
      <button
        ref={btnRef}
        onClick={handleToggleOpen}
        className={`px-3 py-2 sm:py-1.5 rounded-lg text-sm border whitespace-nowrap ${selected.length ? 'border-[#2D6BFF] text-[#2D6BFF] bg-[#EEF2FF]' : 'border-[#E5E7EB] text-[#4B5563]'}`}
      >
        {label}{selected.length ? ` (${selected.length})` : ''} ▾
      </button>
      {open && pos && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div
            className="fixed z-50 bg-white border border-[#EEF0F3] rounded-xl shadow-lg py-2 max-h-64 overflow-y-auto"
            style={{ top: pos.top, left: pos.left, width: PANEL_WIDTH }}
          >
            {options.map((opt) => {
              const value = typeof opt === 'string' ? opt : opt.id;
              const optLabel = typeof opt === 'string' ? opt : opt.label;
              return (
                <label key={value} className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-[#F7F8FA] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selected.includes(value)}
                    onChange={() => toggle(value)}
                    className="accent-[#2D6BFF]"
                  />
                  {optLabel}
                </label>
              );
            })}
            {selected.length > 0 && (
              <button onClick={() => onChange([])} className="w-full text-left px-3 py-1.5 text-xs text-[#9AA1AE] hover:text-[#DC2626] mt-1 border-t border-[#EEF0F3] pt-2">
                Сбросить
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}
