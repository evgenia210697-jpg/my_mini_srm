import { useEffect } from 'react';

export default function Modal({ open, onClose, title, children, width = 'max-w-2xl' }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4 bg-black/40" onMouseDown={onClose}>
      <div
        className={`w-full ${width} max-h-[92vh] sm:max-h-[90vh] overflow-y-auto rounded-t-2xl sm:rounded-2xl bg-white shadow-xl`}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b border-[#EEF0F3] sticky top-0 bg-white rounded-t-2xl">
          <h2 className="font-heading text-base sm:text-lg font-semibold text-[#16181C]">{title}</h2>
          <button
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-[#F1F2F4] text-[#6B7280] text-lg"
            aria-label="Закрыть"
          >
            ×
          </button>
        </div>
        <div className="px-4 sm:px-6 py-4 sm:py-5">{children}</div>
      </div>
    </div>
  );
}
