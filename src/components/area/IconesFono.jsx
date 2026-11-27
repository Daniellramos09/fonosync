// Ícones próprios das áreas internas: traço arredondado de 1,8 e um detalhe
// preenchido (o "ponto" da marca) que herda a cor de --icone-acento.
function Base({ children, className = 'size-5' }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {children}
    </svg>
  );
}

const acento = { fill: 'var(--icone-acento, currentColor)', stroke: 'none' };

export function IconeInicio(props) {
  return (
    <Base {...props}>
      <path d="M4 10.5 12 4l8 6.5V19a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 19z" />
      <path d="M9.5 20.5v-5a2.5 2.5 0 0 1 5 0v5" />
      <circle cx="12" cy="10.2" r="1.4" style={acento} />
    </Base>
  );
}

export function IconePacientes(props) {
  return (
    <Base {...props}>
      <circle cx="9" cy="8" r="3.2" />
      <path d="M3.5 19.5c.6-3.3 2.8-5.2 5.5-5.2s4.9 1.9 5.5 5.2" />
      <path d="M15.5 5.2a3 3 0 0 1 0 5.6M17.2 14.6c1.8.6 3 2.3 3.3 4.9" />
      <circle cx="19.2" cy="6.6" r="1.5" style={acento} />
    </Base>
  );
}

export function IconeProntuario(props) {
  return (
    <Base {...props}>
      <path d="M5 4.5A1.5 1.5 0 0 1 6.5 3h8l4.5 4.5v12a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 5 19.5z" />
      <path d="M14.5 3v4.5H19" />
      <path d="M8.5 15v-2M11 16.5v-5M13.5 15.5v-3M16 14.6v-1.2" />
      <circle cx="8.5" cy="9" r="1.3" style={acento} />
    </Base>
  );
}

export function IconeAgenda(props) {
  return (
    <Base {...props}>
      <rect x="3.5" y="5" width="17" height="15.5" rx="2.5" />
      <path d="M3.5 10h17M8 3v4M16 3v4" />
      <circle cx="15.5" cy="15" r="1.7" style={acento} />
    </Base>
  );
}

export function IconeRelatorios(props) {
  return (
    <Base {...props}>
      <path d="M6.5 3h8L19 7.5v12a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 5 19.5v-15A1.5 1.5 0 0 1 6.5 3z" />
      <path d="M8.5 12.5h7M8.5 16h4.5" />
      <path d="M14.5 3v4.5H19" />
      <circle cx="9" cy="8.6" r="1.3" style={acento} />
    </Base>
  );
}

export function IconeAjustes(props) {
  return (
    <Base {...props}>
      <path d="M4 7h9M17 7h3M4 17h3M11 17h9" />
      <circle cx="15" cy="7" r="2.2" />
      <circle cx="9" cy="17" r="2.2" />
      <circle cx="15" cy="7" r="0.9" style={acento} />
    </Base>
  );
}

export function IconeAtividades(props) {
  return (
    <Base {...props}>
      <path d="M5 6.5A2.5 2.5 0 0 1 7.5 4h9A2.5 2.5 0 0 1 19 6.5v6a2.5 2.5 0 0 1-2.5 2.5H11l-4.5 4v-4A2.5 2.5 0 0 1 5 12.5z" />
      <circle cx="9" cy="9.5" r="1.2" style={acento} />
      <circle cx="12" cy="9.5" r="1.2" style={acento} />
      <circle cx="15" cy="9.5" r="1.2" style={acento} />
    </Base>
  );
}

export function IconeConta(props) {
  return (
    <Base {...props}>
      <circle cx="12" cy="8.5" r="3.8" />
      <path d="M4.5 20c1-3.6 3.9-5.6 7.5-5.6s6.5 2 7.5 5.6" />
      <circle cx="18.6" cy="5.4" r="1.6" style={acento} />
    </Base>
  );
}
