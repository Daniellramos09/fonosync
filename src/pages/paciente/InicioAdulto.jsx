import { ArrowRight, Check, ClipboardList, PersonStanding, UserRound, Volume2 } from 'lucide-react';
import OndaSonora from '../../components/OndaSonora';
import { ATIVIDADES } from '../../components/atividades';
import { periodoDoDia } from '../../experiencia/faixas';
import { EstadoVazio } from './compartilhado';

export default function InicioAdulto({ faixa, nome, agora, historico, irPara, onA11y, onOuvir, ouvindo }) {
  const dataLonga = agora.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' });
  const passos = [
    {
      titulo: 'Ajuste a tela para você',
      desc: 'Tamanho do texto, contraste, tema escuro e voz da leitura.',
      icon: PersonStanding,
      acao: onA11y,
    },
    {
      titulo: ouvindo ? 'Parar a leitura' : 'Ouça qualquer página',
      desc: 'A leitura em voz alta destaca cada palavra enquanto lê.',
      icon: Volume2,
      acao: onOuvir,
    },
    { titulo: 'Conheça as atividades', desc: 'O que já está disponível e o que vem do seu fonoaudiólogo.', icon: ClipboardList, acao: () => irPara('atividades') },
    { titulo: 'Confira seus dados', desc: 'Nome, contato e a experiência desta área.', icon: UserRound, acao: () => irPara('conta') },
  ];

  return (
    <>
      <header className="surge relative isolate overflow-hidden rounded-[30px] rounded-bl-[8px] bg-surface p-6 ring-1 ring-line sm:p-8 lg:p-10">
        <div className="absolute -right-24 -top-24 -z-10 size-80 rounded-full bg-gelo blur-2xl" aria-hidden="true" />
        <OndaSonora className="absolute bottom-6 right-8 -z-10 hidden h-16 w-56 text-azul/15 md:block" />
        <p className="text-[0.875rem] font-semibold text-muted first-letter:uppercase">{dataLonga}</p>
        <h1 className="display mt-2 text-[2.5rem] text-azul-petroleo sm:text-[3.25rem]">
          {faixa.textos.saudacao(nome, periodoDoDia(agora))}
        </h1>
        <p className="mt-2 max-w-[48ch] text-[1.0625rem] leading-relaxed text-muted">{faixa.textos.subtitulo}</p>
      </header>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)]">
        <section className="surge rounded-[26px] rounded-bl-[7px] bg-surface p-6 ring-1 ring-line sm:p-7" style={{ '--i': 1 }} aria-labelledby="acomp-titulo">
          <h2 id="acomp-titulo" className="font-serif text-[1.5rem] font-semibold text-azul-petroleo">
            Seu acompanhamento
          </h2>
          {historico.length === 0 ? (
            <EstadoVazio titulo="Nada registrado por aqui ainda" className="mt-4 bg-canvas ring-0">
              As atividades que você concluir nesta área aparecem aqui, com data. As sessões e avaliações ficam com o seu
              fonoaudiólogo.
            </EstadoVazio>
          ) : (
            <ol className="relative mt-5 space-y-4 before:absolute before:bottom-2 before:left-[7px] before:top-2 before:w-0.5 before:bg-line">
              {historico.slice(0, 6).map((r) => {
                const a = ATIVIDADES.find((x) => x.historico === r.activity);
                return (
                  <li key={r.id} className="relative pl-8">
                    <span className="absolute left-0 top-1.5 size-4 rounded-full bg-success ring-4 ring-surface" aria-hidden="true" />
                    <p className="text-[1rem] font-semibold text-ink">{a?.titulo ?? r.activity}</p>
                    <p className="text-[0.875rem] text-muted">Concluída em {r.date}</p>
                  </li>
                );
              })}
            </ol>
          )}
        </section>

        <section className="surge rounded-[26px] rounded-bl-[7px] bg-surface p-6 ring-1 ring-line sm:p-7" style={{ '--i': 2 }} aria-labelledby="passos-titulo">
          <h2 id="passos-titulo" className="font-serif text-[1.5rem] font-semibold text-azul-petroleo">
            Para começar bem
          </h2>
          <ul className="mt-4">
            {passos.map(({ titulo, desc, icon: Icon, acao }) => (
              <li key={titulo} className="border-t border-line first:border-0">
                <button type="button" onClick={acao} className="group -mx-2 flex w-[calc(100%+1rem)] cursor-pointer items-center gap-3 rounded-[14px] px-2 py-3.5 text-left transition hover:bg-gelo">
                  <span className="grid size-10 shrink-0 place-items-center rounded-[12px] bg-gelo text-azul transition group-hover:bg-surface">
                    <Icon size={19} aria-hidden="true" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[0.96875rem] font-semibold text-ink">{titulo}</span>
                    <span className="block text-[0.84375rem] text-muted">{desc}</span>
                  </span>
                  <ArrowRight size={17} aria-hidden="true" className="shrink-0 text-muted transition group-hover:translate-x-0.5 group-hover:text-azul" />
                </button>
              </li>
            ))}
          </ul>
          <p className="mt-4 flex items-center gap-2 text-[0.8125rem] text-muted">
            <Check size={15} className="text-success" aria-hidden="true" /> Suas preferências ficam salvas neste aparelho.
          </p>
        </section>
      </div>
    </>
  );
}
