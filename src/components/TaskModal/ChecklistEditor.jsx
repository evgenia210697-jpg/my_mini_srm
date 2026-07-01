import { useState } from 'react';
import { v4 as uuid } from 'uuid';

export default function ChecklistEditor({ checklist, onChange }) {
  const [draft, setDraft] = useState('');

  const addItem = () => {
    const text = draft.trim();
    if (!text) return;
    onChange([...checklist, { id: uuid(), text, done: false }]);
    setDraft('');
  };

  const toggleItem = (id) => {
    onChange(checklist.map((c) => (c.id === id ? { ...c, done: !c.done } : c)));
  };

  const removeItem = (id) => {
    onChange(checklist.filter((c) => c.id !== id));
  };

  const updateText = (id, text) => {
    onChange(checklist.map((c) => (c.id === id ? { ...c, text } : c)));
  };

  return (
    <div className="space-y-2">
      {checklist.map((item) => (
        <div key={item.id} className="flex items-center gap-2 group">
          <input
            type="checkbox"
            checked={item.done}
            onChange={() => toggleItem(item.id)}
            className="w-4 h-4 accent-[#2D6BFF] shrink-0"
          />
          <input
            value={item.text}
            onChange={(e) => updateText(item.id, e.target.value)}
            className={`flex-1 text-sm bg-transparent border-b border-transparent focus:border-[#2D6BFF] focus:outline-none py-0.5 ${item.done ? 'line-through text-[#9AA1AE]' : 'text-[#16181C]'}`}
          />
          <button
            onClick={() => removeItem(item.id)}
            className="opacity-0 group-hover:opacity-100 text-[#9AA1AE] hover:text-[#DC2626] w-6 h-6 flex items-center justify-center shrink-0"
            aria-label="Удалить пункт"
          >
            ×
          </button>
        </div>
      ))}
      <div className="flex items-center gap-2">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              addItem();
            }
          }}
          placeholder="Добавить пункт чеклиста…"
          className="flex-1 text-sm border border-[#E5E7EB] rounded-lg px-3 py-1.5 focus:outline-none focus:border-[#2D6BFF]"
        />
        <button
          onClick={addItem}
          className="px-3 py-1.5 text-sm rounded-lg bg-[#EEF2FF] text-[#2D6BFF] font-medium hover:bg-[#DFE8FF]"
        >
          Добавить
        </button>
      </div>
    </div>
  );
}
