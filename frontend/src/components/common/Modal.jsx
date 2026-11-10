import { useEffect } from 'react';
import { X } from 'lucide-react';

export default function Modal({ title, children, close }) {
  useEffect(() => {
    const f = (e) => {
      if (e.key === 'Escape') close();
    };
    window.addEventListener('keydown', f);
    const old = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', f);
      document.body.style.overflow = old;
    };
  }, [close]);
  return (
    <div className="modal-backdrop" onClick={close}>
      <section
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="modal"
        onClick={(e) => e.stopPropagation()}
      >
        <header>
          <h2>{title}</h2>
          <button autoFocus className="icon-button" aria-label="Fechar" onClick={close}>
            <X size={20} />
          </button>
        </header>
        {children}
      </section>
    </div>
  );
}
