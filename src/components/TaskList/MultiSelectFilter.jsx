import { useState } from 'react';

export default function MultiSelectFilter({ label, options, selected, onChange }) {
  const [open, setOpen] = useState(false);

  const toggle = (value) => {
    onChange(selected.includes(value) ? selected.filter((v) => v !== value) : [...selected, value]);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className={`px-3 py-1.5 rounded-lg text-sm border ${selected.length ? 'border-[#2D6BFF] text-[#2D6BFF] bg-[#EEF2FF]' : 'border-[#E5E7EB] text-[#4B5563]'}`}
      >
        {label}{selected.length ? ` (${selected.length})` : ''} ▾
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute left-0 mt-1 w-52 bg-white border border-[#EEF0F3] rounded-xl shadow-lg z-20 py-2 max-h-64 overflow-y-auto">
            {options.map((opt) => {
              const value = typeof opt === 'string' ? opt : opt.id;
              const optLabel = typeof opt === 'string' ? opt : opt.label;
              return (
                <label key={value} className="flex items-center gap-2 px-3 py-1.5 text-sm hover:bg-[#F7F8FA] cursor-pointer">
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
