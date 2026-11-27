import { useState } from 'react';
import { ArrowRight, Check, RefreshCw, Sparkles, Star, Volume2, X } from 'lucide-react';
import { buttonClass } from '../../components/buttonStyles';
import { Capivara, Comemoracao, Sagui, Tucano } from '../../components/Personagens';
import { ATIVIDADES } from '../../components/atividades';
import { abrirAtividade, gravarPreferencia, lerPreferencia } from '../../experiencia/historico';
import fotoCasa from '../../assets/images/photos/tablet-casa.jpg';
import { BotoesAcessibilidade, Silabas } from './compartilhado';

// Dicas de estimulação para quem cuida (conteúdo fixo; uma por dia).
const DICAS = [
  'Leiam juntos por 10 minutos. Aponte a figura e espere a criança nomear antes de falar por ela.',
  'Na hora do banho, cante e pare antes da última palavra da música: deixe a criança completar.',
  'Repita o que a criança disse do jeito certo, sem corrigir: “É um gato!” ajuda mais que “não é tato”.',
  'Brinquem de rimas no caminho: pato, gato, sapato… quem acha mais uma?',
  'Conte o que você está fazendo enquanto cozinha. Palavras novas nascem no dia a dia.',
  'Batam palmas para cada pedaço das palavras: ba·na·na tem três palmas!',
  'Desliguem a TV na refeição e conversem sobre o dia. Escutar também é treino.',
];

// Posições das estações no mapa (em % da cena), na ordem das idades.
const ESTACOES = [
  { x: 14, y: 70 },
  { x: 38, y: 47 },
  { x: 63, y: 66 },
  { x: 86, y: 36 },
];

function BoasVindas({ faixa, nome, onOuvir, ouvindo, onAtividades }) {
  return (
    <section
      className="surge on-dark relative isolate overflow-hidden rounded-[30px] rounded-bl-[8px] bg-azul-profundo text-white"
      aria-labelledby="boas-vindas-titulo"
    >
      <img src={fotoCasa} alt="" className="absolute inset-y-0 right-0 -z-10 hidden h-full w-[58%] object-cover object-[40%_center] md:block" />
      <div className="absolute inset-0 -z-10 hidden bg-[linear-gradient(90deg,#13304a_38%,rgba(19,48,74,0.75)_56%,rgba(19,48,74,0.05)_85%)] md:block" />
      <div className="absolute -bottom-20 -left-16 -z-10 size-64 rounded-full bg-azul/40 blur-2xl" aria-hidden="true" />

      <div className="relative flex min-h-[18rem] flex-col justify-between gap-8 p-6 sm:p-8 md:max-w-[58%] lg:p-10">
        <div>
          <h1 id="boas-vindas-titulo" className="display text-[2.75rem] sm:text-[3.5rem]">
            {faixa.textos.saudacao(nome)}
          </h1>
          <p className="mt-3 max-w-[30ch] text-[1.125rem] leading-relaxed text-white/85">{faixa.textos.subtitulo}</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button type="button" onClick={onAtividades} className={buttonClass('mel', 'lg')}>
            Ver brincadeiras <ArrowRight size={18} aria-hidden="true" />
          </button>
          <button type="button" onClick={onOuvir} aria-pressed={ouvindo} className={buttonClass('claro')}>
            <Volume2 size={17} aria-hidden="true" /> {ouvindo ? 'Parar' : 'Ouvir'}
          </button>
        </div>
      </div>

      <div className="pointer-events-none absolute bottom-3 right-4 hidden md:block" aria-hidden="true">
        <span
          className="flutua absolute -left-24 -top-6 rounded-[14px] rounded-bl-[4px] bg-white px-3 py-1.5 font-serif text-[1.25rem] font-semibold text-on-pastel shadow-lg"
          style={{ '--d': '6s' }}
        >
          <Silabas texto="pa·la·vra" />
        </span>
        <Tucano className="w-36 lg:w-44" />
      </div>
    </section>
  );
}

function ProximaAventura({ atividade, indicadaPelaIdade, feita, faixa }) {
  const P = atividade.Personagem;
  return (
    <section
      className={`surge relative flex flex-col overflow-hidden rounded-[30px] rounded-bl-[8px] p-6 text-on-pastel sm:p-7 ${atividade.campo}`}
      style={{ '--i': 1 }}
      aria-labelledby="proxima-titulo"
    >
      <p className="inline-flex items-center gap-1.5 self-start rounded-full bg-white/60 px-3 py-1 text-[0.8125rem] font-bold">
        <Star size={14} aria-hidden="true" /> {indicadaPelaIdade ? 'Indicada para a sua idade' : 'Próxima aventura'}
      </p>
      <h2 id="proxima-titulo" className="display mt-4 text-[2rem] leading-tight">
        {atividade.titulo}
      </h2>
      <p className="mt-1 text-[0.9375rem] opacity-80">{atividade.quem}</p>
      <P className="pointer-events-none mx-auto my-3 w-40 max-w-full sm:w-44" />
      <button type="button" onClick={() => abrirAtividade(atividade.id)} className={`${buttonClass('azul', 'lg')} mt-auto w-full`}>
        {feita ? 'Jogar de novo' : faixa.textos.ctaAtividade} <ArrowRight size={18} aria-hidden="true" />
      </button>
    </section>
  );
}

// Cenário ilustrado: cada estação é uma atividade; a estação se acende quando é concluída.
function MapaAventura({ concluidas, recomendada }) {
  const feitas = ATIVIDADES.filter((a) => concluidas[a.historico] > 0).length;
  return (
    <section className="surge overflow-hidden rounded-[30px] rounded-bl-[8px] bg-surface ring-1 ring-line" style={{ '--i': 2 }} aria-labelledby="mapa-titulo">
      <div className="flex flex-wrap items-end justify-between gap-2 px-6 pt-6 sm:px-7">
        <div>
          <h2 id="mapa-titulo" className="display text-[1.875rem] text-azul-petroleo">
            Mapa da aventura
          </h2>
          <p className="text-[0.9375rem] text-muted">
            {feitas === 0 ? 'Toque em um amigo para começar.' : `${feitas} de ${ATIVIDADES.length} lugares visitados.`}
          </p>
        </div>
        <ul className="flex gap-1.5" aria-label={`${feitas} de ${ATIVIDADES.length} lugares visitados`}>
          {ATIVIDADES.map((a) => (
            <li key={a.id} className={`size-3 rounded-full ${concluidas[a.historico] > 0 ? 'bg-success' : 'bg-line'}`} />
          ))}
        </ul>
      </div>

      <div className="relative mt-3 aspect-[800/380] min-h-[15rem] w-full">
        {/* Cenário */}
        <svg viewBox="0 0 800 380" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 size-full" aria-hidden="true">
          <defs>
            <linearGradient id="ceu" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#EAF3FB" />
              <stop offset="1" stopColor="#FFFAF2" />
            </linearGradient>
          </defs>
          <rect width="800" height="380" fill="url(#ceu)" />
          <circle cx="700" cy="70" r="34" fill="#F5D887" />
          <path d="M60 60c14-14 40-14 52 0 16-4 30 6 30 18H40c0-10 8-18 20-18z" fill="#fff" opacity="0.9" />
          <path d="M420 44c12-12 34-12 44 0 14-3 26 5 26 16h-86c0-9 6-16 16-16z" fill="#fff" opacity="0.9" />
          <path d="M0 230C120 170 230 200 330 190s200-70 300-60 170 40 170 40v210H0z" fill="#D6EAE4" />
          <path d="M0 290c140-40 260-10 400-20s260-50 400-30v140H0z" fill="#BFDCD2" />
          <path d="M520 380c10-50 60-80 130-90s150 20 150 20v70z" fill="#cfe3f5" />
          <path d="M540 380c14-30 50-52 100-58" stroke="#4C9BE8" strokeWidth="6" strokeLinecap="round" fill="none" opacity="0.35" />
          {[
            [250, 170, 1],
            [470, 150, 0.85],
            [760, 210, 1.1],
            [40, 220, 0.9],
          ].map(([x, y, e], i) => (
            <g key={i} transform={`translate(${x} ${y}) scale(${e})`}>
              <rect x="-4" y="0" width="8" height="26" rx="3" fill="#8E6A4A" />
              <circle cx="0" cy="-8" r="20" fill="#5E9C8F" />
              <circle cx="-10" cy="2" r="13" fill="#6DB86B" />
            </g>
          ))}
          <path
            d={`M ${ESTACOES.map((e) => `${e.x * 8} ${e.y * 3.8 + 30}`).join(' L ')}`}
            fill="none"
            stroke="#C9B88A"
            strokeWidth="10"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="2 18"
          />
        </svg>

        {/* Estações */}
        {ATIVIDADES.map((a, i) => {
          const feita = concluidas[a.historico] > 0;
          const indicada = a.id === recomendada;
          const P = a.Personagem;
          return (
            <button
              key={a.id}
              type="button"
              onClick={() => abrirAtividade(a.id)}
              className="group absolute flex w-[22%] max-w-[10.5rem] -translate-x-1/2 -translate-y-[85%] cursor-pointer flex-col items-center"
              style={{ left: `${ESTACOES[i].x}%`, top: `${ESTACOES[i].y}%` }}
              aria-label={`${a.titulo}${feita ? ', já visitado' : ''}${indicada ? ', indicada para você' : ''}`}
            >
              <span className="relative block w-full">
                {indicada && (
                  <svg viewBox="0 0 100 100" className="absolute inset-0 m-auto size-[110%] -translate-x-[5%] -translate-y-[2%]" aria-hidden="true">
                    <circle className="estacao-pulso" cx="50" cy="60" r="38" fill="#F5D887" />
                  </svg>
                )}
                <P
                  className={`relative w-full transition-transform duration-300 group-hover:-translate-y-1.5 group-hover:scale-105 ${
                    feita || indicada ? '' : 'opacity-60 saturate-50'
                  }`}
                  animated={feita || indicada}
                />
                {feita && (
                  <span className="absolute -right-1 top-0 grid size-7 place-items-center rounded-full bg-success text-white ring-2 ring-white">
                    <Check size={16} aria-hidden="true" />
                  </span>
                )}
              </span>
              <span
                className={`mt-1 whitespace-nowrap rounded-full px-2.5 py-1 text-[0.75rem] font-bold shadow-sm transition group-hover:-translate-y-0.5 sm:text-[0.8125rem] ${
                  indicada ? 'bg-azul-petroleo text-on-azul' : 'bg-white text-on-pastel'
                }`}
              >
                {a.titulo.split(' ').slice(0, 3).join(' ')}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}

function Album({ concluidas }) {
  return (
    <section className="surge rounded-[30px] rounded-bl-[8px] bg-lavanda p-6 text-on-pastel sm:p-7" style={{ '--i': 3 }} aria-labelledby="album-titulo">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 id="album-titulo" className="display text-[1.875rem]">
            Figurinhas
          </h2>
          <p className="mt-1 text-[0.9375rem] opacity-80">Cada brincadeira concluída cola um amigo.</p>
        </div>
        <Sparkles size={22} className="mt-2 shrink-0 text-coral-ink" aria-hidden="true" />
      </div>
      <ul className="mt-5 grid grid-cols-2 gap-3">
        {ATIVIDADES.map(({ id, nomePersonagem, Personagem, campo, historico, titulo }, i) => {
          const colada = concluidas[historico] > 0;
          return (
            <li
              key={id}
              className={`flex aspect-[5/4] flex-col items-center justify-center rounded-[20px] rounded-bl-[5px] p-2 text-center ${
                colada ? `${campo} figurinha-cola ring-4 ring-white/70` : 'border-2 border-dashed border-on-pastel/25 bg-white/40'
              }`}
              style={colada ? { animationDelay: `${i * 90}ms` } : undefined}
            >
              <Personagem className={`w-[62%] ${colada ? '' : 'opacity-25 grayscale'}`} animated={colada} />
              <span className="mt-1 text-[0.78125rem] font-bold leading-tight">{colada ? nomePersonagem : `Falta: ${titulo}`}</span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

// Aparece uma vez quando a criança volta de uma atividade concluída.
function NovaConquista({ registro, onFechar }) {
  const atividade = ATIVIDADES.find((a) => a.historico === registro.activity);
  if (!atividade) return null;
  const P = atividade.Personagem;
  return (
    <section
      role="status"
      className="auth-troca relative flex items-center gap-4 overflow-visible rounded-[26px] rounded-bl-[7px] bg-mel p-4 pr-14 text-on-pastel sm:p-5 sm:pr-16"
    >
      <Comemoracao>
        <span className={`grid size-20 place-items-center rounded-full ${atividade.campo}`}>
          <P className="w-16" />
        </span>
      </Comemoracao>
      <div>
        <p className="display text-[1.5rem] leading-tight">Figurinha nova: {atividade.nomePersonagem}!</p>
        <p className="text-[0.9375rem] opacity-85">Você concluiu {atividade.titulo}. Que orgulho!</p>
      </div>
      <button
        type="button"
        onClick={onFechar}
        aria-label="Fechar aviso"
        className="absolute right-3 top-3 grid size-10 cursor-pointer place-items-center rounded-full bg-white/50 transition hover:bg-white/80"
      >
        <X size={18} aria-hidden="true" />
      </button>
    </section>
  );
}

function ParaQuemCuida({ agora }) {
  const inicioAno = new Date(agora.getFullYear(), 0, 0);
  const diaDoAno = Math.floor((agora - inicioAno) / 86400000);
  const [indice, setIndice] = useState(diaDoAno % DICAS.length);
  return (
    <section className="surge relative overflow-hidden rounded-[30px] rounded-bl-[8px] bg-salvia p-6 text-on-pastel sm:p-7" style={{ '--i': 4 }} aria-labelledby="dica-titulo">
      <div className="flex items-start justify-between gap-3">
        <h2 id="dica-titulo" className="display text-[1.625rem]">
          Para quem cuida
        </h2>
        <button
          type="button"
          onClick={() => setIndice((i) => (i + 1) % DICAS.length)}
          className="inline-flex min-h-10 shrink-0 cursor-pointer items-center gap-1.5 rounded-full bg-white/55 px-3.5 text-[0.8125rem] font-semibold transition hover:bg-white/80 active:scale-95"
        >
          <RefreshCw size={14} aria-hidden="true" /> Outra dica
        </button>
      </div>
      <div className="mt-3 flex items-end gap-4">
        <p key={indice} className="auth-troca flex-1 text-[1.0625rem] leading-relaxed" aria-live="polite">
          {DICAS[indice]}
        </p>
        <Sagui className="-mb-8 w-24 shrink-0" letra="b" />
      </div>
    </section>
  );
}

export default function InicioCrianca({ faixa, nome, email, idade, agora, historico, concluidas, recomendada, irPara, onA11y, onOuvir, ouvindo }) {
  const chaveVista = `fonosync:conquista-vista:${email || 'anonimo'}`;
  const [vista, setVista] = useState(() => lerPreferencia(chaveVista, null));
  const ultimo = historico[0];
  const mostrarConquista = ultimo && ultimo.id !== vista;
  const fecharConquista = () => {
    gravarPreferencia(chaveVista, ultimo.id);
    setVista(ultimo.id);
  };

  const proxima =
    ATIVIDADES.find((a) => a.id === recomendada) ?? ATIVIDADES.find((a) => !(concluidas[a.historico] > 0)) ?? ATIVIDADES[0];

  return (
    <>
      {mostrarConquista && <NovaConquista registro={ultimo} onFechar={fecharConquista} />}
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)]">
        <BoasVindas faixa={faixa} nome={nome} onOuvir={onOuvir} ouvindo={ouvindo} onAtividades={() => irPara('atividades')} />
        <ProximaAventura
          atividade={proxima}
          indicadaPelaIdade={proxima.id === recomendada && idade !== null}
          feita={concluidas[proxima.historico] > 0}
          faixa={faixa}
        />
      </div>
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)]">
        <MapaAventura concluidas={concluidas} recomendada={recomendada} />
        <Album concluidas={concluidas} />
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <ParaQuemCuida agora={agora} />
        <section className="surge relative overflow-hidden rounded-[30px] rounded-bl-[8px] bg-coral/60 p-6 text-on-pastel sm:p-7 sm:pr-40" style={{ '--i': 5 }} aria-labelledby="jeito-titulo">
          <h2 id="jeito-titulo" className="display text-[1.625rem]">
            Do seu jeito
          </h2>
          <p className="mt-2 max-w-[34ch] text-[0.96875rem] leading-relaxed opacity-85">
            Letras maiores, cores, menos movimento e leitura em voz alta.
          </p>
          <div className="mt-4">
            <BotoesAcessibilidade onA11y={onA11y} onOuvir={onOuvir} ouvindo={ouvindo} />
          </div>
          <Capivara acenando className="pointer-events-none absolute -bottom-3 -right-3 hidden w-36 sm:block" />
        </section>
      </div>
    </>
  );
}
