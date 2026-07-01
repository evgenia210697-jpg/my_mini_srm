import { useRef, useState } from 'react';
import { downloadFile, tasksToCsv, csvToTasks } from '../../lib/csv';
import ConfirmDialog from '../common/ConfirmDialog';

export default function DataMenu({ tasks, onImport, onReset }) {
  const [open, setOpen] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);
  const fileInputRef = useRef(null);

  const exportCsv = () => {
    downloadFile(`tasks-${new Date().toISOString().slice(0, 10)}.csv`, tasksToCsv(tasks), 'text/csv;charset=utf-8');
    setOpen(false);
  };

  const exportJson = () => {
    downloadFile(`tasks-${new Date().toISOString().slice(0, 10)}.json`, JSON.stringify(tasks, null, 2), 'application/json');
    setOpen(false);
  };

  const triggerImport = () => {
    fileInputRef.current?.click();
  };

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const text = await file.text();
    try {
      const imported = file.name.endsWith('.csv') ? csvToTasks(text) : JSON.parse(text);
      if (Array.isArray(imported)) {
        onImport(imported, 'append');
      }
    } catch {
      alert('Не удалось прочитать файл. Проверьте формат.');
    }
    e.target.value = '';
    setOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="px-3 py-2 rounded-lg text-sm font-medium text-[#4B5563] border border-[#E5E7EB] hover:bg-[#F1F2F4]"
      >
        Данные ▾
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 mt-1 w-52 bg-white border border-[#EEF0F3] rounded-xl shadow-lg z-20 py-1">
            <button onClick={exportCsv} className="w-full text-left px-3 py-2 text-sm hover:bg-[#F7F8FA]">Экспорт в CSV</button>
            <button onClick={exportJson} className="w-full text-left px-3 py-2 text-sm hover:bg-[#F7F8FA]">Экспорт в JSON</button>
            <button onClick={triggerImport} className="w-full text-left px-3 py-2 text-sm hover:bg-[#F7F8FA]">Импорт JSON / CSV</button>
            <div className="my-1 border-t border-[#EEF0F3]" />
            <button
              onClick={() => { setConfirmReset(true); setOpen(false); }}
              className="w-full text-left px-3 py-2 text-sm text-[#DC2626] hover:bg-[#FEF2F2]"
            >
              Сбросить все данные
            </button>
          </div>
        </>
      )}
      <input ref={fileInputRef} type="file" accept=".json,.csv" className="hidden" onChange={handleFile} />
      <ConfirmDialog
        open={confirmReset}
        onClose={() => setConfirmReset(false)}
        onConfirm={onReset}
        title="Сбросить все данные?"
        message="Все задачи и проекты будут удалены без возможности восстановления. Рекомендуем сначала сделать экспорт."
        confirmLabel="Сбросить"
      />
    </div>
  );
}
