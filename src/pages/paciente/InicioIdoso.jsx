import { ChevronRight, ClipboardList, PersonStanding, Volume2, VolumeX } from 'lucide-react';
import { ATIVIDADES } from '../../components/atividades';
import { periodoDoDia } from '../../experiencia/faixas';
import fotoCuidado from '../../assets/images/photos/idosa-cuidado.jpg';
import fotoTerapia from '../../assets/images/photos/idoso-terapia-mesa.jpg';

// Poucas opções por tela, texto grande, ações sempre visíveis e com rótulo por extenso.
function AcaoGrande({ icon: Icon, titulo, desc, onClick, destaque = false, pressionado }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={pressionado}
      className={`group flex min-h-[5.5rem] w-full cursor-pointer items-center gap-4 rounded-[22px] rounded-bl-[6px] border-2 px-5 py-4 text-left transition duration-150 active:scale-[0.99] ${
        destaque
          ? 'border-azul-petroleo bg-azul-petroleo text-on-azul hover:bg-azul'
          : 'border-line bg-surface text-ink hover:border-azul-petroleo'
      }`}
    >
      <span className={`grid size-14 shrink-0 place-items-center rounded-full ${destaque ? 'bg-white/15' : 'bg-gelo text-azul-petroleo'}`}>
        <Icon size={28} aria-hidden="true" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[1.3125rem] font-bold leading-snug">{titulo}</span>
        <span className={`block text-[1rem] ${destaque ? 'text-on-azul/85' : 'text-muted'}`}>{desc}</span>
      </span>
      <ChevronRight size={28} aria-hidden="true" className="shrink-0" />
    </button>
  );
}

export default function InicioIdoso({ faixa, nome, agora, historico, irPara, onA11y, onOuvir, ouvindo }) {
  return (
    <>
      <section className="grid overflow-hidden rounded-[30px] rounded-bl-[8px] bg-surface ring-1 ring-line md:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]" aria-labelledby="idoso-titulo">
        <div className="flex flex-col justify-center p-6 sm:p-9">
          <h1 id="idoso-titulo" className="font-serif text-[2.5rem] font-semibold leading-tight text-azul-petroleo sm:text-[3rem]">
            {faixa.textos.saudacao(nome, periodoDoDia(agora))}
          </h1>
          <p className="mt-3 text-[1.375rem] leading-relaxed text-ink">{faixa.textos.subtitulo}</p>
        </div>
        <div className="relative h-64 md:h-auto md:min-h-[21rem]">
          <img
            src={fotoCuidado}
            alt="Senhora sorrindo enquanto uma profissional segura sua mão com carinho"
            className="absolute inset-0 size-full object-cover object-[50%_28%]"
          />
        </div>
      </section>

      <section aria-label="Ações principais" className="grid gap-3">
        <AcaoGrande icon={ClipboardList} titulo="Ver atividades" desc="Veja o que está disponível para você." onClick={() => irPara('atividades')} destaque />
        <AcaoGrande
          icon={ouvindo ? VolumeX : Volume2}
          titulo={ouvindo ? 'Parar a leitura' : 'Ouvir esta página'}
          desc="O texto da tela é lido em voz alta."
          onClick={onOuvir}
          pressionado={ouvindo}
        />
        <AcaoGrande icon={PersonStanding} titulo="Letras maiores e cores" desc="Aumente o texto, o contraste e os botões." onClick={onA11y} />
      </section>

      <div className="grid gap-4 lg:grid-cols-2">
        <section className="rounded-[26px] rounded-bl-[7px] bg-surface p-6 ring-1 ring-line sm:p-7" aria-labelledby="ultimas-titulo">
          <h2 id="ultimas-titulo" className="font-serif text-[1.75rem] font-semibold text-azul-petroleo">
            Suas últimas atividades
          </h2>
          {historico.length === 0 ? (
            <p className="mt-3 text-[1.125rem] leading-relaxed text-muted">
              Você ainda não concluiu atividades por aqui. Quando concluir, elas aparecem nesta lista com a data.
            </p>
          ) : (
            <ul className="mt-3 divide-y divide-line">
              {historico.slice(0, 4).map((r) => {
                const a = ATIVIDADES.find((x) => x.historico === r.activity);
                return (
                  <li key={r.id} className="flex items-center justify-between gap-3 py-3 text-[1.125rem]">
                    <span className="font-semibold text-ink">{a?.titulo ?? r.activity}</span>
                    <span className="text-muted">{r.date}</span>
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        <section className="overflow-hidden rounded-[26px] rounded-bl-[7px] bg-salvia text-on-pastel" aria-labelledby="consultorio-titulo">
          <img src={fotoTerapia} alt="Fonoaudióloga conversando com um senhor durante a sessão, com cartões de palavras na mesa" className="h-48 w-full object-cover object-[50%_40%]" />
          <div className="p-6 sm:p-7">
            <h2 id="consultorio-titulo" className="font-serif text-[1.75rem] font-semibold">
              Seu acompanhamento
            </h2>
            <p className="mt-2 text-[1.125rem] leading-relaxed">
              As sessões continuam com o seu fonoaudiólogo. Aqui você encontra as atividades e deixa a tela do seu jeito.
            </p>
            <p className="mt-3 text-[1rem] opacity-80">Dica: toque em “Ouvir” no topo de qualquer tela.</p>
          </div>
        </section>
      </div>
    </>
  );
}
