import { PersonStanding, Volume2 } from 'lucide-react';
import { buttonClass } from '../../components/buttonStyles';

// Palavra separada em sílabas com o ponto da marca (o ponto não é lido em voz alta).
export function Silabas({ texto }) {
  return texto.split('·').map((parte, i) => (
    <span key={i}>
      {i > 0 && (
        <span className="silaba-ponto" aria-hidden="true">
          ·
        </span>
      )}
      {parte}
    </span>
  ));
}

// Atalhos de acessibilidade presentes em todas as faixas etárias.
export function BotoesAcessibilidade({ onA11y, onOuvir, ouvindo, grande = false }) {
  const tamanho = grande ? 'lg' : 'md';
  return (
    <div className="flex flex-wrap gap-3">
      <button type="button" onClick={onA11y} className={buttonClass('azul', tamanho)}>
        <PersonStanding size={grande ? 22 : 17} aria-hidden="true" /> Letras, cores e contraste
      </button>
      <button type="button" onClick={onOuvir} aria-pressed={ouvindo} className={buttonClass('suave', tamanho)}>
        <Volume2 size={grande ? 22 : 17} aria-hidden="true" /> {ouvindo ? 'Parar leitura' : 'Ouvir página'}
      </button>
    </div>
  );
}

export function EstadoVazio({ titulo, children, ilustracao, className = '' }) {
  return (
    <div className={`flex flex-col items-center gap-3 rounded-[24px] rounded-bl-[7px] bg-surface p-8 text-center ring-1 ring-line ${className}`}>
      {ilustracao}
      <p className="font-serif text-[1.25rem] font-semibold text-azul-petroleo">{titulo}</p>
      <div className="max-w-[46ch] text-[0.9375rem] leading-relaxed text-muted">{children}</div>
    </div>
  );
}
