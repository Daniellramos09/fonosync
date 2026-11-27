// Personagens autorais do FonoSync, inspirados na fauna brasileira.
// Cada um tem um papel na jornada:
//   Capivara — acolhe (boas-vindas, conclusão)
//   Tucano   — fala (instruções, espera, voz)
//   Tartaruga — ritmo (progresso, jornada no tempo)
//   Sagui    — curiosidade (brincadeira, descoberta)
//   Sapinho  — som (o papo enche e solta ondas sonoras)
// Animações são classes CSS em index.css e respeitam "reduzir movimento".

const INK = '#283A43';
const OLHO_BRILHO = '#FFFCF7';
const BOCHECHA = '#F4B7A3';

function svgProps({ title, className, viewBox, animated }) {
  return {
    viewBox,
    className: `${className ?? ''} ${animated ? '' : 'char-estatico'}`.trim(),
    xmlns: 'http://www.w3.org/2000/svg',
    ...(title ? { role: 'img', 'aria-label': title } : { 'aria-hidden': true, focusable: 'false' }),
  };
}

function Olho({ cx, cy, rx = 5, ry = 6, cor = INK }) {
  return (
    <g className="char-olho">
      <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill={cor} />
      <circle cx={cx + rx * 0.35} cy={cy - ry * 0.4} r={Math.max(1.4, rx * 0.34)} fill={OLHO_BRILHO} />
    </g>
  );
}

/* ---------------------------------------------------------------- Capivara */
export function Capivara({ title, className, animated = true, acenando = false }) {
  const pelo = '#B07A4F';
  const peloEscuro = '#93623D';
  const peloClaro = '#CB966B';
  return (
    <svg {...svgProps({ title, className, viewBox: '0 0 220 180', animated })}>
      <ellipse cx="112" cy="170" rx="74" ry="6" fill={INK} opacity="0.12" />
      <g className="char-respira">
        {/* corpo */}
        <path d="M38 148C28 108 46 70 96 62c46-7 82 18 84 58 1 26-12 42-40 42H70c-18 0-28-4-32-14z" fill={pelo} />
        <ellipse cx="72" cy="150" rx="24" ry="14" fill={peloEscuro} />
        <ellipse cx="122" cy="130" rx="32" ry="26" fill={peloClaro} />
        {/* pata da frente */}
        <path d="M140 118v38a8 8 0 0 0 16 0v-40z" fill={peloEscuro} />
        {/* cabeça */}
        <path d="M121 30c30-8 69 0 75 32 4 22-8 36-28 38h-30c-20 0-30-14-30-34 0-18 3-32 13-36z" fill={pelo} />
        <ellipse cx="128" cy="35" rx="11" ry="9" fill={peloEscuro} />
        <ellipse cx="128" cy="36" rx="5.5" ry="4.5" fill="#6E4A31" />
        <path d="M168 52c18-2 30 8 29 22-1 16-13 24-27 24-10 0-14-8-14-20 0-16 4-24 12-26z" fill={peloEscuro} />
        <ellipse cx="187" cy="66" rx="7" ry="5" fill="#4A3428" />
        <path d="M172 86c4 4 10 4 14 0" stroke="#4A3428" strokeWidth="2.6" strokeLinecap="round" fill="none" />
        <ellipse cx="156" cy="80" rx="8" ry="5" fill={BOCHECHA} opacity="0.75" />
        <Olho cx={148} cy={57} />
        {/* broto na cabeça */}
        <path d="M146 30c-2-10 4-18 14-20-1 10-6 17-14 20z" fill="#5E9C8F" />
        <path d="M146 31c-1-6-4-10-9-12" stroke="#3F7A70" strokeWidth="2" strokeLinecap="round" fill="none" />
        {/* patinha da frente que acena, na frente do peito */}
        {acenando && (
          <g className="char-acena">
            <path d="M150 124c14-6 28-14 40-26" stroke={peloEscuro} strokeWidth="14" strokeLinecap="round" fill="none" />
            <ellipse cx="194" cy="94" rx="9" ry="8" fill={peloEscuro} />
            <path d="M190 88v-5M195 87v-5M200 89l2-4" stroke={peloEscuro} strokeWidth="4" strokeLinecap="round" />
          </g>
        )}
      </g>
    </svg>
  );
}

/* ------------------------------------------------------------------ Tucano */
export function Tucano({ title, className, animated = true, galho = true }) {
  const preto = '#22302F';
  return (
    <svg {...svgProps({ title, className, viewBox: '0 0 210 200', animated })}>
      {galho && (
        <>
          <path d="M14 170c50-6 120-8 182-4" stroke="#8E6A4A" strokeWidth="9" strokeLinecap="round" fill="none" />
          <path d="M40 168c-6-12-2-22 10-26 2 12-2 21-10 26z" fill="#5E9C8F" />
        </>
      )}
      <path d="M72 138 52 190l22-2 14-42z" fill="#18211F" />
      <g className="char-respira">
        <path d="M60 110c0-40 25-60 48-58 24 2 34 26 32 58-2 30-20 52-42 52s-38-22-38-52z" fill={preto} />
        <path d="M108 60c20 2 30 20 28 40-10 8-24 6-32-4-6-12-4-28 4-36z" fill="#FFF1C9" />
        <path d="M98 158c8 0 16-2 22-8l-4 10z" fill="#E4572E" />
        <path d="M70 100c8-14 30-10 34 12 2 20-12 36-26 34-10-16-12-34-8-46z" fill="#141C1B" />
        <circle cx="117" cy="74" r="11" fill="#7FB8D9" />
        <Olho cx={118} cy={74} rx={4.6} ry={5} />
        <g className="char-bico">
          <path d="M122 64c28-10 64-2 76 22-14-2-48-2-74 2z" fill="#F2A33A" />
          <path d="M124 88c26-2 58 0 72 2-16 10-46 12-70 6z" fill="#E8892B" />
          <path d="M186 80c6 2 10 6 12 8h-12z" fill={preto} />
          <path d="M130 70c16-4 32-3 44 2" stroke="#F7C46E" strokeWidth="3" strokeLinecap="round" fill="none" />
        </g>
      </g>
      <path d="M90 162v10M106 162v10" stroke="#E8892B" strokeWidth="5" strokeLinecap="round" />
    </svg>
  );
}

/* --------------------------------------------------------------- Tartaruga */
export function Tartaruga({ title, className, animated = true, andando = true }) {
  const pele = '#C9B88A';
  const peleEscura = '#B3A274';
  return (
    <svg {...svgProps({ title, className, viewBox: '0 0 230 140', animated })}>
      <ellipse cx="114" cy="132" rx="84" ry="5" fill={INK} opacity="0.12" />
      <path d="M38 96 18 104l22 4z" fill={peleEscura} />
      {/* patas */}
      <g className={andando ? 'char-pata-b' : undefined}>
        <rect x="52" y="94" width="20" height="32" rx="9" fill={peleEscura} />
      </g>
      <g className={andando ? 'char-pata-a' : undefined}>
        <rect x="84" y="96" width="20" height="30" rx="9" fill={pele} />
      </g>
      <g className={andando ? 'char-pata-a' : undefined}>
        <rect x="132" y="94" width="20" height="32" rx="9" fill={peleEscura} />
      </g>
      <g className={andando ? 'char-pata-b' : undefined}>
        <rect x="160" y="96" width="20" height="30" rx="9" fill={pele} />
      </g>
      <g className="char-respira">
        {/* pescoço e cabeça */}
        <path d="M172 90c8-14 18-20 30-20l6 24c-12 2-24 4-36-4z" fill={pele} />
        <ellipse cx="204" cy="76" rx="21" ry="18" fill={pele} />
        <Olho cx={210} cy={70} rx={4.4} ry={5.2} />
        <path d="M206 84c4 3 9 3 13 0" stroke="#7D6C46" strokeWidth="2.4" strokeLinecap="round" fill="none" />
        <ellipse cx="198" cy="82" rx="6" ry="4" fill={BOCHECHA} opacity="0.8" />
        {/* casco */}
        <path d="M38 98c2-46 40-72 78-72s70 26 70 72z" fill="#3F7A70" />
        <path d="M98 40h36l14 24-14 24H98L84 64z" fill="#5E9C8F" />
        <path d="M58 70c6-14 14-22 24-28l2 22-12 24H50c1-6 4-12 8-18z" fill="#5E9C8F" />
        <path d="M150 42c12 6 22 16 26 28 2 6 3 12 3 18h-17l-12-24z" fill="#5E9C8F" />
        <path d="M32 92h158a6 6 0 0 1 0 12H32a6 6 0 0 1 0-12z" fill="#2E5E56" />
        <circle cx="116" cy="64" r="5" fill="#F5D887" />
      </g>
    </svg>
  );
}

/* ------------------------------------------------------------------- Sagui */
export function Sagui({ title, className, animated = true, letra = 'a' }) {
  const pelo = '#8C8178';
  const peloEscuro = '#6B5E55';
  const tufo = '#FFF6EA';
  return (
    <svg {...svgProps({ title, className, viewBox: '0 0 200 200', animated })}>
      <ellipse cx="100" cy="190" rx="52" ry="5" fill={INK} opacity="0.12" />
      <g className="char-cauda">
        <path d="M124 160c46 10 64-28 48-56-12-20-34-14-28 4" stroke={peloEscuro} strokeWidth="13" strokeLinecap="round" fill="none" />
        <path d="M124 160c46 10 64-28 48-56-12-20-34-14-28 4" stroke="#B5A99D" strokeWidth="13" strokeLinecap="round" strokeDasharray="7 9" fill="none" />
      </g>
      <g className="char-respira">
        <path d="M68 182c-8-34 6-66 32-66s40 32 32 66z" fill={pelo} />
        <ellipse cx="100" cy="160" rx="20" ry="22" fill="#B9AEA3" />
        {/* tufos brancos das orelhas */}
        <path d="M66 72c-22-14-32 6-22 18-10 8 4 20 20 12z" fill={tufo} />
        <path d="M134 72c22-14 32 6 22 18 10 8-4 20-20 12z" fill={tufo} />
        <circle cx="100" cy="84" r="36" fill={peloEscuro} />
        <ellipse cx="100" cy="92" rx="23" ry="21" fill="#3E3532" />
        <ellipse cx="100" cy="62" rx="7" ry="4.5" fill={tufo} />
        <g className="char-olho">
          <circle cx="90" cy="88" r="6.5" fill="#F5D887" />
          <circle cx="110" cy="88" r="6.5" fill="#F5D887" />
          <circle cx="91" cy="89" r="3.4" fill="#1E1816" />
          <circle cx="111" cy="89" r="3.4" fill="#1E1816" />
          <circle cx="92.4" cy="87" r="1.4" fill={tufo} />
          <circle cx="112.4" cy="87" r="1.4" fill={tufo} />
        </g>
        <path d="M95 102c3 3 7 3 10 0" stroke="#E9DCC9" strokeWidth="2.2" strokeLinecap="round" fill="none" />
        {/* bloquinho de letra */}
        <g>
          <rect x="80" y="128" width="40" height="36" rx="7" fill="#F4B7A3" />
          <rect x="80" y="128" width="40" height="8" rx="4" fill="#E9A48D" />
          <text x="100" y="158" textAnchor="middle" fontFamily="Fraunces, Georgia, serif" fontSize="24" fontWeight="700" fill={INK}>
            {letra}
          </text>
          <ellipse cx="78" cy="146" rx="8" ry="7" fill={peloEscuro} />
          <ellipse cx="122" cy="146" rx="8" ry="7" fill={peloEscuro} />
        </g>
      </g>
    </svg>
  );
}

/* ----------------------------------------------------------------- Sapinho */
// O papo enche e solta anéis de som: o personagem da voz em voz alta.
export function Sapinho({ title, className, animated = true, coaxando = true }) {
  const verde = '#6DB86B';
  const verdeEscuro = '#4E9A57';
  const barriga = '#E4F3C8';
  return (
    <svg {...svgProps({ title, className, viewBox: '0 0 210 170', animated })}>
      <ellipse cx="96" cy="162" rx="70" ry="6" fill={INK} opacity="0.12" />
      {coaxando && (
        <g fill="none" stroke="#4C9BE8" strokeWidth="4" strokeLinecap="round">
          <path className="char-anel" d="M164 92c8 8 8 22 0 30" />
          <path className="char-anel" style={{ animationDelay: '0.5s' }} d="M178 84c13 13 13 33 0 46" />
          <path className="char-anel" style={{ animationDelay: '1s' }} d="M192 76c18 18 18 44 0 62" />
        </g>
      )}
      {/* patas de trás */}
      <path d="M30 150c-10-24 4-46 26-44 10 20 6 38-6 50H34z" fill={verdeEscuro} />
      <path d="M162 150c10-24-4-46-26-44-10 20-6 38 6 50h16z" fill={verdeEscuro} />
      <g className="char-respira">
        {/* corpo */}
        <path d="M36 120c0-40 26-66 60-66s60 26 60 66c0 26-24 38-60 38s-60-12-60-38z" fill={verde} />
        <ellipse cx="96" cy="128" rx="38" ry="26" fill={barriga} />
        {/* papo que enche */}
        <ellipse className="char-papo" cx="96" cy="108" rx="20" ry="11" fill="#F4D6A0" opacity="0.95" />
        {/* olhos em cima da cabeça */}
        <circle cx="66" cy="56" r="22" fill={verde} />
        <circle cx="126" cy="56" r="22" fill={verde} />
        <circle cx="66" cy="54" r="14" fill="#FFFCF7" />
        <circle cx="126" cy="54" r="14" fill="#FFFCF7" />
        <Olho cx={69} cy={55} rx={6.5} ry={7.5} />
        <Olho cx={129} cy={55} rx={6.5} ry={7.5} />
        {/* sorriso e bochechas */}
        <path d="M70 92c14 10 38 10 52 0" stroke="#2F5F37" strokeWidth="3.2" strokeLinecap="round" fill="none" />
        <ellipse cx="56" cy="90" rx="9" ry="5.5" fill={BOCHECHA} opacity="0.85" />
        <ellipse cx="136" cy="90" rx="9" ry="5.5" fill={BOCHECHA} opacity="0.85" />
        {/* pintinhas */}
        <circle cx="50" cy="118" r="4" fill={verdeEscuro} />
        <circle cx="142" cy="114" r="5" fill={verdeEscuro} />
        <circle cx="132" cy="132" r="3" fill={verdeEscuro} />
        {/* mãozinhas */}
        <path d="M64 150c-4-8 0-16 8-16s10 10 6 16z" fill={verdeEscuro} />
        <path d="M128 150c4-8 0-16-8-16s-10 10-6 16z" fill={verdeEscuro} />
      </g>
    </svg>
  );
}

/* --------------------------------------------- Comemoração (fim de atividade) */
const pecas = [
  { cor: '#F4B7A3', dx: '-70px', dy: '-80px', rot: '220deg', t: 'ca' },
  { cor: '#F5D887', dx: '60px', dy: '-96px', rot: '-160deg', t: 'pi' },
  { cor: '#D8D0EB', dx: '-34px', dy: '-118px', rot: '140deg', t: 'va' },
  { cor: '#D6EAE4', dx: '88px', dy: '-60px', rot: '200deg', t: 'ra' },
  { cor: '#F4B7A3', dx: '-96px', dy: '-36px', rot: '-120deg', t: 'ta' },
  { cor: '#F5D887', dx: '24px', dy: '-130px', rot: '90deg', t: 'ru' },
];

export function Comemoracao({ children }) {
  return (
    <div className="relative inline-block">
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-1/3 flex justify-center">
        {pecas.map((p, i) => (
          <span
            key={i}
            className="confete absolute rounded-[6px] rounded-bl-[2px] px-1.5 py-0.5 font-serif text-sm font-semibold text-on-pastel"
            style={{ background: p.cor, '--dx': p.dx, '--dy': p.dy, '--rot': p.rot, animationDelay: `${i * 70}ms` }}
          >
            {p.t}
          </span>
        ))}
      </div>
      {children}
    </div>
  );
}
