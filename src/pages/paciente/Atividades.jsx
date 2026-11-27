import { useState } from 'react';
import { ArrowRight, Check, Star } from 'lucide-react';
import { buttonClass } from '../../components/buttonStyles';
import { ATIVIDADES } from '../../components/atividades';
import { abrirAtividade } from '../../experiencia/historico';
import { EstadoVazio } from './compartilhado';
import OndaSonora from '../../components/OndaSonora';

const CATEGORIAS = [
  { id: 'todas', label: 'Todas' },
  { id: 'perguntas', label: 'Perguntas para a família' },
  { id: 'jogos', label: 'Jogos com a criança' },
  { id: 'escola', label: 'Na escola' },
];

const COMO_FUNCIONA = {
  perguntas: 'Vocês respondem sim ou não sobre o que a criança já faz no dia a dia. Não precisa de microfone.',
  jogos: 'A criança vê a figura e fala; um adulto ao lado toca no que ouviu. Rodadas curtas, sem pressa.',
  escola: 'O professor marca o que observou em sala nas últimas semanas. Leva poucos minutos.',
};

function Feita({ vezes, className = '' }) {
  if (!vezes) return null;
  return (
    <span className={`inline-flex items-center gap-1 rounded-full bg-success/10 px-2.5 py-1 text-[0.78125rem] font-bold text-success ${className}`}>
      <Check size={13} aria-hidden="true" /> {vezes === 1 ? 'Feita 1 vez' : `Feita ${vezes} vezes`}
    </span>
  );
}

/* ----------------------------------------------- crianças: brincadeiras ilustradas */

function AtividadesCrianca({ concluidas, recomendada }) {
  const [categoria, setCategoria] = useState('todas');
  const [selecionada, setSelecionada] = useState(recomendada ?? ATIVIDADES[0].id);
  const lista = ATIVIDADES.filter((a) => categoria === 'todas' || a.tipo === categoria);
  const atual = ATIVIDADES.find((a) => a.id === selecionada) ?? ATIVIDADES[0];
  const P = atual.Personagem;

  return (
    <div className="space-y-6">
      <header className="surge">
        <h1 className="display text-[2.5rem] text-azul-petroleo sm:text-[3rem]">Brincadeiras</h1>
        <p className="mt-1 text-[1.0625rem] text-muted">Escolha um amigo para brincar.</p>
      </header>

      <div role="group" aria-label="Filtrar por tipo" className="surge flex flex-wrap gap-2" style={{ '--i': 1 }}>
        {CATEGORIAS.map(({ id, label }) => {
          const total = id === 'todas' ? ATIVIDADES.length : ATIVIDADES.filter((a) => a.tipo === id).length;
          const ativo = categoria === id;
          return (
            <button
              key={id}
              type="button"
              aria-pressed={ativo}
              onClick={() => setCategoria(id)}
              className={`inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full border-[1.5px] px-4 text-[0.875rem] font-semibold transition duration-200 active:scale-95 ${
                ativo ? 'border-azul-petroleo bg-azul-petroleo text-on-azul' : 'border-line bg-surface text-ink hover:border-azul/40 hover:bg-gelo'
              }`}
            >
              {label}
              <span className={`rounded-full px-1.5 text-[0.75rem] ${ativo ? 'bg-white/20' : 'bg-gelo text-muted'}`}>{total}</span>
            </button>
          );
        })}
      </div>

      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
        <ul className="grid gap-4 sm:grid-cols-2" aria-label="Lista de brincadeiras">
          {lista.map((a, i) => {
            const ativo = a.id === selecionada;
            const Personagem = a.Personagem;
            return (
              <li key={a.id} className="surge" style={{ '--i': i + 2 }}>
                <button
                  type="button"
                  aria-pressed={ativo}
                  onClick={() => setSelecionada(a.id)}
                  className={`group flex h-full w-full cursor-pointer flex-col overflow-hidden rounded-[26px] rounded-bl-[7px] bg-surface text-left transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_44px_-28px_rgba(19,48,74,0.7)] ${
                    ativo ? 'ring-[3px] ring-azul' : 'ring-1 ring-line'
                  }`}
                >
                  <span className={`relative flex h-40 items-end justify-between overflow-hidden p-4 text-on-pastel ${a.campo}`}>
                    <span>
                      <span className="block font-serif text-[2.25rem] font-semibold leading-none">{a.idade}</span>
                      <span className="text-[0.78125rem] font-semibold opacity-75">anos</span>
                    </span>
                    {a.id === recomendada && (
                      <span className="absolute left-4 top-4 inline-flex items-center gap-1 rounded-full bg-white/70 px-2.5 py-1 text-[0.75rem] font-bold">
                        <Star size={12} aria-hidden="true" /> Para você
                      </span>
                    )}
                    <span key={ativo ? 'pula' : 'parado'} className={`block ${ativo ? 'char-pula' : ''}`}>
                      <Personagem className="-mb-2 w-32 transition-transform duration-500 group-hover:rotate-[-4deg]" />
                    </span>
                  </span>
                  <span className="flex flex-1 flex-col p-5">
                    <span className="font-serif text-[1.3125rem] font-semibold leading-tight text-azul-petroleo">{a.titulo}</span>
                    <span className="mt-0.5 text-[0.84375rem] font-semibold text-muted">{a.quem}</span>
                    <span className="mt-3 flex-1 text-[0.90625rem] leading-relaxed text-ink/85">{a.desc}</span>
                    <span className="mt-4 flex flex-wrap gap-2">
                      <Feita vezes={concluidas[a.historico]} />
                    </span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>

        <aside
          key={atual.id}
          className="auth-troca on-dark relative overflow-hidden rounded-[28px] rounded-bl-[8px] bg-azul-profundo p-6 text-white lg:sticky lg:top-6"
          aria-live="polite"
          aria-labelledby="atividade-escolhida"
        >
          <div className={`absolute -right-12 -top-12 size-52 rounded-full ${atual.campo}`} aria-hidden="true" />
          <P className="relative ml-auto w-36" />
          <p className="mt-2 text-[0.8125rem] font-semibold text-white/65">
            {atual.idade} anos · {atual.quem}
          </p>
          <h2 id="atividade-escolhida" className="display mt-1 text-[2rem]">
            {atual.titulo}
          </h2>
          <p className="mt-3 text-[0.9375rem] leading-relaxed text-white/85">{COMO_FUNCIONA[atual.tipo]}</p>
          <p className="mt-3 rounded-[14px] rounded-bl-[4px] bg-white/10 p-3 text-[0.84375rem] leading-relaxed text-white/85">
            Escolham um lugar calmo e sem televisão. O resultado é uma orientação: quem avalia é o fonoaudiólogo.
          </p>
          <button type="button" onClick={() => abrirAtividade(atual.id)} className={`${buttonClass('mel', 'lg')} mt-6 w-full`}>
            Vamos lá! <ArrowRight size={18} aria-hidden="true" />
          </button>
        </aside>
      </div>
    </div>
  );
}

/* --------------------------------- adolescentes, adultos e 60+: lista objetiva */

function LinhaRastreio({ a, vezes, faixa }) {
  const idoso = faixa.id === 'idoso';
  const jovem = faixa.id === 'adolescente';
  return (
    <li className="border-t border-line first:border-0">
      <div className={`flex flex-wrap items-center gap-4 ${idoso ? 'py-5' : 'py-4'}`}>
        <span
          className={`grid shrink-0 place-items-center rounded-[14px] font-bold text-on-pastel ${a.campo} ${
            idoso ? 'size-16 text-[1.25rem]' : 'size-12 text-[1rem]'
          } ${jovem ? 'font-sans font-extrabold' : 'font-serif'}`}
        >
          {a.idade}
        </span>
        <div className="min-w-[12rem] flex-1">
          <p className={`font-semibold text-ink ${idoso ? 'text-[1.3125rem]' : 'text-[1.0625rem]'}`}>{a.titulo}</p>
          <p className={`text-muted ${idoso ? 'text-[1.0625rem]' : 'text-[0.875rem]'}`}>
            {a.quem} · {a.idade} anos
          </p>
        </div>
        <Feita vezes={vezes} />
        <button type="button" onClick={() => abrirAtividade(a.id)} className={buttonClass(idoso ? 'azul' : 'suave', idoso ? 'lg' : 'md')}>
          {faixa.textos.ctaAtividade} <ArrowRight size={17} aria-hidden="true" />
        </button>
      </div>
    </li>
  );
}

function AtividadesGeral({ faixa, concluidas }) {
  const paraVoce = ATIVIDADES.filter((a) => a.faixas.includes(faixa.id));
  const familia = ATIVIDADES.filter((a) => !a.faixas.includes(faixa.id));
  const jovem = faixa.id === 'adolescente';
  const idoso = faixa.id === 'idoso';
  const titulo = jovem
    ? 'font-sans text-[2.5rem] font-extrabold tracking-[-0.03em] text-ink sm:text-[3rem]'
    : 'display text-[2.5rem] text-azul-petroleo sm:text-[3rem]';
  const subtitulo = jovem ? 'font-sans text-[1.25rem] font-extrabold tracking-tight text-ink' : 'font-serif text-[1.5rem] font-semibold text-azul-petroleo';

  return (
    <div className="space-y-6">
      <header className="surge">
        <h1 className={titulo}>{faixa.nav.atividades}</h1>
        <p className={`mt-1 text-muted ${idoso ? 'text-[1.25rem]' : 'text-[1.0625rem]'}`}>
          {jovem ? 'O que está liberado para você agora.' : 'O que está disponível nesta área.'}
        </p>
      </header>

      <section className="surge space-y-3" style={{ '--i': 1 }} aria-labelledby="para-voce">
        <h2 id="para-voce" className={subtitulo}>
          {jovem ? 'Seus desafios' : 'Para você'}
        </h2>
        {paraVoce.length > 0 ? (
          <ul className="rounded-[24px] rounded-bl-[7px] bg-surface px-5 ring-1 ring-line">
            {paraVoce.map((a) => (
              <LinhaRastreio key={a.id} a={a} vezes={concluidas[a.historico]} faixa={faixa} />
            ))}
          </ul>
        ) : (
          <EstadoVazio
            titulo={jovem ? 'Seus desafios chegam por aqui' : 'Suas atividades chegam por aqui'}
            ilustracao={<OndaSonora className="h-12 w-32 text-azul/40" />}
          >
            Quando o seu fonoaudiólogo indicar exercícios para fazer entre as sessões, eles aparecem nesta seção, com o seu
            progresso.
          </EstadoVazio>
        )}
      </section>

      <section className="surge space-y-3" style={{ '--i': 2 }} aria-labelledby="familia-titulo">
        <div>
          <h2 id="familia-titulo" className={subtitulo}>
            Rastreio para crianças da família
          </h2>
          <p className={`mt-1 text-muted ${idoso ? 'text-[1.125rem]' : 'text-[0.9375rem]'}`}>
            Atividades curtas para acompanhar a fala de uma criança de até 10 anos, feitas junto com ela.
          </p>
        </div>
        <ul className="rounded-[24px] rounded-bl-[7px] bg-surface px-5 ring-1 ring-line">
          {familia.map((a) => (
            <LinhaRastreio key={a.id} a={a} vezes={concluidas[a.historico]} faixa={faixa} />
          ))}
        </ul>
      </section>
    </div>
  );
}

export default function Atividades({ faixa, concluidas, recomendada }) {
  if (faixa.id === 'crianca') return <AtividadesCrianca concluidas={concluidas} recomendada={recomendada} />;
  return <AtividadesGeral faixa={faixa} concluidas={concluidas} />;
}
