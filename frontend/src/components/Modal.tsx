import { useEffect, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

type Props = {
  open: boolean;
  title: string;
  description?: string;
  onClose: () => void;
  children: ReactNode;
  wide?: boolean;
};

export function Modal({
  open,
  title,
  description,
  onClose,
  children,
  wide = false,
}: Props) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-end justify-center p-3 sm:items-center sm:p-6">
      <button
        type="button"
        aria-label="Fechar"
        className="absolute inset-0 bg-black/55 backdrop-blur-[2px]"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className={`relative z-10 max-h-[90vh] w-full overflow-y-auto rounded-2xl border border-white/10 bg-white p-5 shadow-[0_24px_80px_rgba(0,0,0,0.35)] sm:p-6 ${
          wide ? 'max-w-3xl' : 'max-w-lg'
        }`}
      >
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <h3 id="modal-title" className="text-lg font-semibold text-black">
              {title}
            </h3>
            {description && (
              <p className="mt-1 text-sm text-neutral-500">{description}</p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-neutral-400 transition hover:bg-neutral-100 hover:text-neutral-700"
            aria-label="Fechar modal"
          >
            <X size={18} />
          </button>
        </div>
        {children}
      </div>
    </div>,
    document.body,
  );
}
