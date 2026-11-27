import { useEffect, useId, useRef } from 'react';
import { X } from 'lucide-react';

// Janela modal das áreas internas: fecha com Esc, no X ou clicando fora.
export default function Modal({ titulo, onFechar, children, largura = 'max-w-lg' }) {
  const id = useId();
  const fecharRef = useRef(null);

  useEffect(() => {
    fecharRef.current?.focus();
    const onKey = (e) => e.key === 'Escape' && onFechar();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onFechar]);

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-0 sm:items-center sm:p-4">
      <button
        type="button"
        tabIndex={-1}
        aria-label="Fechar"
        onClick={onFechar}
        className="painel-fundo absolute inset-0 cursor-default bg-azul-profundo/50 backdrop-blur-sm"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={id}
        className={`auth-troca relative max-h-[92dvh] w-full overflow-y-auto rounded-t-[26px] bg-surface p-6 shadow-[0_40px_80px_-30px_rgba(11,30,48,0.7)] sm:rounded-[26px] sm:rounded-bl-[8px] ${largura}`}
      >
        <div className="mb-5 flex items-start justify-between gap-4">
          <h3 id={id} className="font-serif text-[1.5rem] font-semibold leading-tight text-azul-petroleo">
            {titulo}
          </h3>
          <button
            ref={fecharRef}
            type="button"
            onClick={onFechar}
            aria-label="Fechar janela"
            className="grid size-10 shrink-0 cursor-pointer place-items-center rounded-full text-muted transition hover:bg-gelo hover:text-ink"
          >
            <X size={19} aria-hidden="true" />
          </button>
        </div>
        <div className="space-y-4">{children}</div>
      </div>
    </div>
  );
}
