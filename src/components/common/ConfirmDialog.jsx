import Modal from './Modal';

export default function ConfirmDialog({ open, onClose, onConfirm, title, message, confirmLabel = 'Удалить', danger = true }) {
  return (
    <Modal open={open} onClose={onClose} title={title} width="max-w-sm">
      <p className="text-sm text-[#4B5563] mb-5">{message}</p>
      <div className="flex justify-end gap-2">
        <button
          onClick={onClose}
          className="px-4 py-2 rounded-lg text-sm font-medium text-[#4B5563] hover:bg-[#F1F2F4]"
        >
          Отмена
        </button>
        <button
          onClick={() => {
            onConfirm();
            onClose();
          }}
          className={`px-4 py-2 rounded-lg text-sm font-medium text-white ${danger ? 'bg-[#DC2626] hover:bg-[#B91C1C]' : 'bg-[#2D6BFF] hover:bg-[#1E54DB]'}`}
        >
          {confirmLabel}
        </button>
      </div>
    </Modal>
  );
}
