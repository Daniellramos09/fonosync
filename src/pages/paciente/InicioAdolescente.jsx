import { useState } from 'react';
import { ArrowUpRight, Minus, Plus, Target } from 'lucide-react';
import OndaSonora from '../../components/OndaSonora';
import { buttonClass } from '../../components/buttonStyles';
import { diasAtivos, gravarPreferencia, lerPreferencia, porSemana, ultimos7Dias } from '../../experiencia/historico';
import { BotoesAcessibilidade } from './compartilhado';

function Anel({ valor, total }) {
  const r = 52;
  const c = 2 * Math.PI * r;
  const pct = total > 0 ? Math.min(valor / total, 1) : 0;
  return (
    <svg viewBox="0 0 128 128" className="anel-progresso size-36 -rotate-90" role="img" aria-label={`${valor} de ${total} na meta da semana`}>
      <circle cx="64" cy="64" r={r} fill="none" stroke="currentColor" strokeOpacity="0.14" strokeWidth="12" />
      <circle
        cx="64"
        cy="64"
        r={r}
        fill="none"
        stroke="url(#gradMeta)"
        strokeWidth="12"
        strokeLinecap="round"
        strokeDasharray={c}
        strokeDashoffset={c * (1 - pct)}
      />
      <defs>
        <linearGradient id="gradMeta" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#F4B7A3" />
          <stop offset="1" stopColor="#F5D887" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export default function InicioAdolescente({ faixa, nome, email, agora, historico, irPara, onA11y, onOuvir, ouvindo }) {
  const chaveMeta = `fonosync:meta-semanal:${email || 'anonimo'}`;
  const [meta, setMeta] = useState(() => lerPreferencia(chaveMeta, 3));
  const mudarMeta = (delta) => {
    const nova = Math.min(7, Math.max(1, meta + delta));
    setMeta(nova);
    gravarPreferencia(chaveMeta, nova);
  };

  const naSemana = ultimos7Dias(historico, agora).length;
  const ativos = diasAtivos(historico, agora);
  const semanas = porSemana(historico, agora);
  const maior = Math.max(1, ...semanas.map((s) => s.total));
  const falta = Math.max(0, meta - naSemana);

  return (
    <>
      {/* Abertura */}
      <section className="surge on-dark relative isolate overflow-hidden rounded-[30px] rounded-bl-[8px] bg-[#0f1c2b] text-white" aria-labelledby="jovem-titulo">
        <div className="absolute -right-16 -top-24 -z-10 size-96 rounded-full bg-[#2c6aa6]/55 blur-3xl" aria-hidden="true" />
        <div className="absolute -bottom-28 left-1/3 -z-10 size-72 rounded-full bg-[#F4B7A3]/25 blur-3xl" aria-hidden="true" />
        <OndaSonora className="absolute bottom-6 right-6 -z-10 h-20 w-64 text-white/[0.08]" />
        <div className="grid gap-8 p-6 sm:p-8 lg:grid-cols-[1.3fr_1fr] lg:p-10">
          <div className="flex flex-col justify-between gap-6">
            <div>
              <h1 id="jovem-titulo" className="font-sans text-[2.5rem] font-extrabold leading-[1.05] tracking-[-0.03em] sm:text-[3.25rem]">
                {faixa.textos.saudacao(nome)}
              </h1>
              <p className="mt-3 max-w-[40ch] text-[1.0625rem] leading-relaxed text-white/75">{faixa.textos.subtitulo}</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button type="button" onClick={() => irPara('atividades')} className={buttonClass('mel')}>
                Ver desafios <ArrowUpRight size={17} aria-hidden="true" />
              </button>
              <button type="button" onClick={onOuvir} aria-pressed={ouvindo} className={buttonClass('claro')}>
                {ouvindo ? 'Parar leitura' : 'Ouvir página'}
              </button>
            </div>
          </div>
          <dl className="grid grid-cols-2 gap-3 self-end">
            {[
              ['Concluídas', historico.length, 'no total'],
              ['Dias ativos', ativos, 'nos últimos 7 dias'],
            ].map(([rotulo, valor, legenda]) => (
              <div key={rotulo} className="rounded-[20px] rounded-bl-[5px] bg-white/[0.06] p-4 ring-1 ring-white/10">
                <dt className="text-[0.8125rem] font-semibold text-white/60">{rotulo}</dt>
                <dd className="mt-1 text-[2.5rem] font-extrabold leading-none tracking-tight">{valor}</dd>
                <dd className="mt-1 text-[0.78125rem] text-white/50">{legenda}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)]">
        {/* Meta pessoal */}
        <section className="surge rounded-[26px] rounded-bl-[7px] bg-surface p-6 ring-1 ring-line" style={{ '--i': 1 }} aria-labelledby="meta-titulo">
          <h2 id="meta-titulo" className="flex items-center gap-2 font-sans text-[1.25rem] font-extrabold tracking-tight text-ink">
            <Target size={20} className="text-coral-ink" aria-hidden="true" /> Sua meta da semana
          </h2>
          <div className="mt-4 flex items-center gap-5">
            <div className="relative grid place-items-center text-ink">
              <Anel valor={naSemana} total={meta} />
              <span className="absolute text-center">
                <span className="block text-[2rem] font-extrabold leading-none">{naSemana}</span>
                <span className="text-[0.8125rem] text-muted">de {meta}</span>
              </span>
            </div>
            <div className="space-y-3">
              <p className="text-[0.96875rem] font-semibold text-ink" aria-live="polite">
                {falta === 0 ? 'Meta batida. Mandou bem!' : `Faltam ${falta} para bater sua meta.`}
              </p>
              <div className="flex items-center gap-2" role="group" aria-label="Ajustar meta semanal">
                <button
                  type="button"
                  onClick={() => mudarMeta(-1)}
                  disabled={meta <= 1}
                  aria-label="Diminuir meta"
                  className="grid size-11 cursor-pointer place-items-center rounded-full bg-gelo text-ink transition hover:bg-azul hover:text-on-azul disabled:opacity-40"
                >
                  <Minus size={18} aria-hidden="true" />
                </button>
                <span className="min-w-20 text-center text-[0.875rem] font-semibold text-muted">{meta} por semana</span>
                <button
                  type="button"
                  onClick={() => mudarMeta(1)}
                  disabled={meta >= 7}
                  aria-label="Aumentar meta"
                  className="grid size-11 cursor-pointer place-items-center rounded-full bg-gelo text-ink transition hover:bg-azul hover:text-on-azul disabled:opacity-40"
                >
                  <Plus size={18} aria-hidden="true" />
                </button>
              </div>
              <p className="text-[0.78125rem] text-muted">Você define. Fica salva neste aparelho.</p>
            </div>
          </div>
        </section>

        {/* Evolução */}
        <section className="surge rounded-[26px] rounded-bl-[7px] bg-surface p-6 ring-1 ring-line" style={{ '--i': 2 }} aria-labelledby="evolucao-titulo">
          <h2 id="evolucao-titulo" className="font-sans text-[1.25rem] font-extrabold tracking-tight text-ink">
            Sua evolução
          </h2>
          <p className="mt-1 text-[0.875rem] text-muted">Atividades concluídas nas últimas 4 semanas.</p>
          <ol className="mt-5 flex h-36 items-end gap-3" aria-label="Atividades por semana">
            {semanas.map((s, i) => (
              <li key={i} className="flex h-full flex-1 flex-col items-center justify-end gap-2">
                <span className="text-[0.875rem] font-bold text-ink">{s.total}</span>
                <span
                  className={`barra-enche w-full rounded-t-[10px] rounded-b-[4px] ${s.atual ? 'bg-[linear-gradient(180deg,#4c9be8,#2c6aa6)]' : 'bg-gelo'}`}
                  style={{ height: `${Math.max(6, (s.total / maior) * 100)}%` }}
                />
                <span className={`text-[0.75rem] font-semibold ${s.atual ? 'text-azul' : 'text-muted'}`}>
                  {s.atual ? 'Esta semana' : `${3 - i} sem. atrás`}
                </span>
              </li>
            ))}
          </ol>
          {historico.length === 0 && (
            <p className="mt-4 rounded-[14px] rounded-bl-[4px] bg-canvas p-3 text-[0.875rem] text-muted">
              Seu gráfico ganha forma quando você concluir atividades.
            </p>
          )}
        </section>
      </div>

      <section className="surge flex flex-wrap items-center justify-between gap-4 rounded-[26px] rounded-bl-[7px] bg-surface p-6 ring-1 ring-line" style={{ '--i': 3 }}>
        <div>
          <h2 className="font-sans text-[1.25rem] font-extrabold tracking-tight text-ink">Do seu jeito</h2>
          <p className="mt-1 text-[0.9375rem] text-muted">Tamanho do texto, tema escuro, contraste e leitura em voz alta.</p>
        </div>
        <BotoesAcessibilidade onA11y={onA11y} onOuvir={onOuvir} ouvindo={ouvindo} />
      </section>
    </>
  );
}
