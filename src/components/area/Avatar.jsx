// Avatar com iniciais e uma cor pastel estável por nome (mesma pessoa, mesma cor em todas as telas).
// Pastéis fixos: o texto sobre eles (on-pastel) não inverte no modo escuro.
const CORES = ['bg-coral', 'bg-salvia', 'bg-mel', 'bg-lavanda', 'bg-[#cfe3f5]'];

function corPara(nome = '') {
  let soma = 0;
  for (const ch of nome) soma = (soma * 33 + ch.charCodeAt(0) * 7) % 1009;
  return CORES[soma % CORES.length];
}

function iniciais(nome = '') {
  return nome
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0])
    .join('')
    .toUpperCase();
}

export default function Avatar({ nome, className = 'size-10 text-[14px]', apagado = false }) {
  return (
    <span
      aria-hidden="true"
      className={`grid shrink-0 place-items-center rounded-full font-serif font-semibold text-on-pastel ${
        apagado ? 'bg-canvas text-muted ring-1 ring-line' : corPara(nome)
      } ${className}`}
    >
      {iniciais(nome)}
    </span>
  );
}

const STATUS_PACIENTE = {
  ATIVO: { rotulo: 'Em acompanhamento', ponto: 'bg-success', texto: 'text-success', fundo: 'bg-success/10' },
  PRE_CADASTRO: { rotulo: 'Pré-cadastro', ponto: 'bg-warning', texto: 'text-warning', fundo: 'bg-warning/10' },
  ARQUIVADO: { rotulo: 'Arquivado', ponto: 'bg-muted', texto: 'text-muted', fundo: 'bg-canvas' },
};

export function SeloStatus({ status }) {
  const s = STATUS_PACIENTE[status] ?? STATUS_PACIENTE.ATIVO;
  return (
    <span className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-[12.5px] font-bold ${s.fundo} ${s.texto}`}>
      <span className={`size-1.5 rounded-full ${s.ponto}`} aria-hidden="true" />
      {s.rotulo}
    </span>
  );
}
