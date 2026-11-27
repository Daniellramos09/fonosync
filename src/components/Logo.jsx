// Logo original do FonoSync: escudo com ondas sonoras (arquivo preservado sem alterações).
// O símbolo fica num círculo branco para funcionar sobre fundos claros e escuros.
import logoImg from '../assets/images/ModeloA_Semnome.jpg';

export function LogoMark({ className = 'size-9' }) {
  return (
    <span
      className={`inline-grid shrink-0 place-items-center overflow-hidden rounded-full bg-white shadow-[0_6px_16px_-10px_rgba(19,48,74,0.6)] ring-1 ring-black/5 ${className}`}
    >
      <img src={logoImg} alt="" className="size-full scale-[1.12] object-cover" />
    </span>
  );
}

export default function Logo({ tone = 'ocean', className = '', markClassName = 'size-9', showName = true, nameClassName = '' }) {
  const texto = tone === 'claro' ? 'text-white' : 'text-navy';
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <LogoMark className={markClassName} />
      {showName ? (
        <span className={`font-serif text-[21px] font-semibold leading-none tracking-[-0.02em] ${texto} ${nameClassName}`}>
          FonoSync
        </span>
      ) : (
        <span className="sr-only">FonoSync</span>
      )}
    </span>
  );
}
