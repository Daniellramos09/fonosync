// Marca FonoSync: balão de fala com três sílabas (o ponto central em coral)
// e o nome separado como se separam as sílabas: Fono·Sync.
export function LogoMark({ className = 'size-9', tone = 'ocean' }) {
  const fundo = tone === 'claro' ? '#FFFCF7' : 'var(--color-ocean)';
  const balao = tone === 'claro' ? 'var(--color-ocean)' : '#FFFCF7';
  const ponto = tone === 'claro' ? '#FFFCF7' : 'var(--color-ocean)';
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true" focusable="false">
      <rect width="64" height="64" rx="16" fill={fundo} />
      <path
        d="M16 16h28a9 9 0 0 1 9 9v12a9 9 0 0 1-9 9H28l-11 8 2-8h-3a9 9 0 0 1-9-9V25a9 9 0 0 1 9-9z"
        fill={balao}
      />
      <circle cx="22" cy="31" r="3.2" fill={ponto} />
      <circle cx="32" cy="31" r="3.2" fill="#F4B7A3" />
      <circle cx="42" cy="31" r="3.2" fill={ponto} />
    </svg>
  );
}

export default function Logo({ tone = 'ocean', className = '', markClassName = 'size-9', showName = true }) {
  const texto = tone === 'claro' ? 'text-white' : 'text-navy';
  const ponto = tone === 'claro' ? 'text-coral' : 'text-coral-ink';
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <LogoMark className={markClassName} tone={tone} />
      {showName && (
        <span
          className={`font-serif text-[21px] font-semibold leading-none tracking-[-0.02em] ${texto}`}
          style={{ fontVariationSettings: '"SOFT" 100, "WONK" 0' }}
        >
          Fono<span className={ponto} aria-hidden="true">·</span>Sync
        </span>
      )}
    </span>
  );
}
