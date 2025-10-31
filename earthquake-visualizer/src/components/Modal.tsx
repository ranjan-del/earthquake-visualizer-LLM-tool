import { useEffect } from 'react';

type Props = {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
};

export default function Modal({ open, onClose, title, children }: Props) {
  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (open) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-2000 flex items-center justify-center">
      <div
        className="fixed inset-0 bg-black/30 transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        className="relative w-[min(92vw,680px)] bg-white rounded-xl shadow-2xl border z-[2100] max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className="p-4 border-b flex items-center justify-between">
          <h3 className="font-semibold text-lg">{title ?? "Details"}</h3>
          <button 
            onClick={onClose} 
            className="px-3 py-1 text-sm border rounded hover:bg-gray-50"
            aria-label="Close"
          >
            Close
          </button>
        </div>
        <div className="p-4 text-sm leading-6 overflow-y-auto flex-1">
          {children}
        </div>
      </div>
    </div>
  );
}