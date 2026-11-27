import { useState } from 'react';
import { ArrowRight, Check, PersonStanding, RefreshCw, Sparkles, Volume2 } from 'lucide-react';
import AreaLayout from '../components/area/AreaLayout';
import { IconeAtividades, IconeConta, IconeInicio } from '../components/area/IconesFono';
import A11yModal from '../components/A11yModal';
import { buttonClass } from '../components/buttonStyles';
import { Capivara, Sagui, Tartaruga, Tucano } from '../components/Personagens';
import { ATIVIDADES, atividadePorHistorico, lerHistoricoTriagem } from '../components/atividades';
import fotoCasa from '../assets/images/photos/tablet-casa.jpg';
import { useA11y } from '../hooks/useA11y';
import { useAuth } from '../hooks/useAuth';
import { iniciarTriagem } from '../utils/triagemInicio';

const navItems = [
  { id: 'inicio', label: 'Início', icon: IconeInicio, cor: '#F4B7A3' },
  { id: 'atividades', label: 'Atividades', icon: IconeAtividades, cor: '#D6EAE4' },
  { id: 'conta', label: 'Minha conta', icon: IconeConta, cor: '#F5D887' },
];

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

// Dicas de estimulação para fazer em casa (conteúdo fixo; uma por dia).
const DICAS = [
  'Leiam juntos por 10 minutos. Aponte a figura e espere a criança nomear antes de falar por ela.',
  'Na hora do banho, cante e pare antes da última palavra da música: deixe a criança completar.',
  'Repita o que a criança disse do jeito certo, sem corrigir: “É um gato!” ajuda mais que “não é tato”.',
  'Brinquem de rimas no caminho: pato, gato, sapato… quem acha mais uma?',
  'Conte o que você está fazendo enquanto cozinha. Palavras novas nascem no dia a dia.',
  'Batam palmas para cada pedaço das palavras: ba·na·na tem três palmas!',
  'Desliguem a TV na refeição e conversem sobre o dia. Escutar também é treino.',
];

function Silabas({ texto }) {
  return texto.split('·').map((parte, i) => (
    <span key={i}>
      {i > 0 && (
        <span className="silaba-ponto" aria-hidden="true">
          ·
        </span>
      )}
      {parte}
    </span>
  ));
}

function abrirAtividade(id) {
  iniciarTriagem(id);
  window.location.hash = '#/triagem';
}

function saudacaoPara(data) {
  const h = data.getHours();
  if (h < 12) return 'Bom dia';
  if (h < 18) return 'Boa tarde';
  return 'Boa noite';
}

/* ------------------------------------------------------------------ início */

function BoasVindas({ primeiroNome, agora, onAtividades, onOuvir }) {
  const dataLonga = agora.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' });
  return (
    <section
      className="surge on-dark relative isolate overflow-hidden rounded-[30px] rounded-bl-[8px] bg-azul-profundo text-white"
      aria-labelledby="boas-vindas-titulo"
    >
      <img
        src={fotoCasa}
        alt=""
        className="absolute inset-y-0 right-0 -z-10 hidden h-full w-[58%] object-cover object-[40%_center] md:block"
      />
      <div className="absolute inset-0 -z-10 hidden bg-[linear-gradient(90deg,#13304a_38%,rgba(19,48,74,0.75)_56%,rgba(19,48,74,0.05)_85%)] md:block" />
      <div className="absolute -bottom-20 -left-16 -z-10 size-64 rounded-full bg-azul/40 blur-2xl" aria-hidden="true" />

      <div className="relative flex min-h-[300px] flex-col justify-between gap-8 p-6 sm:p-8 md:max-w-[58%] lg:p-10">
        <div>
          <p className="text-[13px] font-semibold text-white/70 first-letter:uppercase">{dataLonga}</p>
          <h1 id="boas-vindas-titulo" className="display mt-2 text-[40px] sm:text-[52px]">
            {saudacaoPara(agora)}
            {primeiroNome ? `, ${primeiroNome}` : ''}!
          </h1>
          <p className="mt-3 max-w-[38ch] text-[16px] leading-relaxed text-white/85">
            Que bom ter vocês aqui. Escolham uma brincadeira de fala e façam juntos, no ritmo da criança.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button type="button" onClick={onAtividades} className={buttonClass('mel', 'lg')}>
            Escolher uma atividade <ArrowRight size={18} aria-hidden="true" />
          </button>
          <button type="button" onClick={onOuvir} className={buttonClass('claro')}>
            <Volume2 size={17} aria-hidden="true" /> Ouvir esta página
          </button>
        </div>
      </div>

      <div className="pointer-events-none absolute bottom-3 right-4 hidden md:block" aria-hidden="true">
        <span
          className="flutua absolute -left-24 -top-6 rounded-[14px] rounded-bl-[4px] bg-white px-3 py-1.5 font-serif text-[20px] font-semibold text-on-pastel shadow-lg"
          style={{ '--d': '6s' }}
        >
          <Silabas texto="pa·la·vra" />
        </span>
        <Tucano className="w-36 lg:w-44" />
      </div>
    </section>
  );
}

function DicaDoDia({ agora }) {
  const inicioAno = new Date(agora.getFullYear(), 0, 0);
  const diaDoAno = Math.floor((agora - inicioAno) / 86400000);
  const [indice, setIndice] = useState(diaDoAno % DICAS.length);
  return (
    <section
      className="surge relative flex flex-col overflow-hidden rounded-[30px] rounded-bl-[8px] bg-mel p-6 text-on-pastel sm:p-7"
      style={{ '--i': 1 }}
      aria-labelledby="dica-titulo"
    >
      <div className="flex items-start justify-between gap-3">
        <h2 id="dica-titulo" className="display text-[28px]">
          Dica para hoje
        </h2>
        <button
          type="button"
          onClick={() => setIndice((i) => (i + 1) % DICAS.length)}
          className="inline-flex min-h-10 shrink-0 cursor-pointer items-center gap-1.5 rounded-full bg-white/55 px-3.5 text-[13px] font-semibold transition hover:bg-white/80 active:scale-95"
        >
          <RefreshCw size={14} aria-hidden="true" /> Outra dica
        </button>
      </div>
      <p key={indice} className="auth-troca mt-3 max-w-[34ch] text-[17px] leading-relaxed" aria-live="polite">
        {DICAS[indice]}
      </p>
      <div className="mt-auto flex items-end justify-between pt-4">
        <p className="text-[12.5px] font-semibold opacity-75">
          Dica {indice + 1} de {DICAS.length}
        </p>
        <Sagui className="-mb-7 -mr-2 w-28" letra="b" />
      </div>
    </section>
  );
}

function PortasAtividades({ concluidas }) {
  return (
    <section className="surge space-y-4" style={{ '--i': 2 }} aria-labelledby="portas-titulo">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <h2 id="portas-titulo" className="display text-[30px] text-azul-petroleo">
          Atividades de fala
        </h2>
        <p className="text-[14px] text-muted">Cada faixa de idade tem a sua. Toque para começar.</p>
      </div>
      <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {ATIVIDADES.map(({ id, idade, titulo, quem, campo, Personagem, historico }) => {
          const vezes = concluidas[historico] ?? 0;
          return (
            <li key={id}>
              <button
                type="button"
                onClick={() => abrirAtividade(id)}
                className={`group relative flex h-full min-h-[210px] w-full cursor-pointer flex-col overflow-hidden rounded-[24px] rounded-bl-[6px] p-5 text-left text-on-pastel transition duration-300 hover:-translate-y-1 hover:shadow-[0_22px_40px_-24px_rgba(19,48,74,0.6)] active:translate-y-0 ${campo}`}
              >
                <span className="font-serif text-[34px] font-semibold leading-none">{idade}</span>
                <span className="text-[12.5px] font-semibold opacity-75">anos</span>
                <Personagem className="absolute -right-2 top-3 w-28 transition-transform duration-500 group-hover:-translate-y-1 group-hover:rotate-[-4deg]" />
                <span className="mt-auto pt-6">
                  <span className="block font-serif text-[20px] font-semibold leading-tight">{titulo}</span>
                  <span className="mt-0.5 block text-[13px] opacity-80">{quem}</span>
                </span>
                <span className="mt-3 flex items-center justify-between gap-2 text-[13.5px] font-bold">
                  <span className="inline-flex items-center gap-1.5">
                    Começar
                    <ArrowRight size={16} aria-hidden="true" className="transition-transform duration-200 group-hover:translate-x-1" />
                  </span>
                  {vezes > 0 && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-white/60 px-2 py-0.5 text-[12px]">
                      <Check size={13} aria-hidden="true" /> {vezes === 1 ? 'feita 1 vez' : `feita ${vezes} vezes`}
                    </span>
                  )}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

function Jornada({ historico, concluidas, onAtividades }) {
  const feitas = ATIVIDADES.filter((a) => concluidas[a.historico] > 0).length;
  const recentes = historico.slice(0, 4);
  const pct = (feitas / ATIVIDADES.length) * 100;
  return (
    <section className="surge grid gap-4 lg:grid-cols-[1.25fr_1fr]" style={{ '--i': 3 }} aria-labelledby="jornada-titulo">
      <div className="relative overflow-hidden rounded-[30px] rounded-bl-[8px] bg-lavanda p-6 text-on-pastel sm:p-7">
        <h2 id="jornada-titulo" className="display text-[30px]">
          A trilha de vocês
        </h2>
        <p className="mt-1 text-[14.5px] opacity-80">
          {feitas === 0
            ? 'A trilha começa na primeira atividade concluída.'
            : `${feitas} de ${ATIVIDADES.length} atividades já exploradas.`}
        </p>

        <div
          className="relative mx-1 mt-16 h-3 rounded-full bg-white/60"
          role="img"
          aria-label={`${feitas} de ${ATIVIDADES.length} atividades exploradas`}
        >
          {feitas > 0 && (
            <div className="barra-enche absolute inset-y-0 left-0 rounded-full bg-azul-petroleo" style={{ width: `${pct}%` }} />
          )}
          <div className="absolute inset-0 flex items-center justify-between">
            {[0, ...ATIVIDADES.map((_, i) => i + 1)].map((n) => (
              <span key={n} className={`size-4 rounded-full border-2 border-white ${n <= feitas && feitas > 0 ? 'bg-mel' : 'bg-white'}`} />
            ))}
          </div>
          <div
            className="absolute -top-[50px] w-20 transition-[left] duration-700"
            style={{ left: `calc(${pct}% - 2.5rem)` }}
            aria-hidden="true"
          >
            <Tartaruga className="w-full" andando={false} />
          </div>
        </div>

        {recentes.length > 0 ? (
          <ol className="mt-7 space-y-2">
            {recentes.map((registro) => {
              const atividade = atividadePorHistorico(registro.activity);
              const P = atividade?.Personagem;
              return (
                <li key={registro.id} className="flex items-center gap-3 rounded-[16px] rounded-bl-[4px] bg-white/55 p-2.5">
                  <span className={`grid size-11 shrink-0 place-items-center overflow-hidden rounded-full ${atividade?.campo ?? 'bg-white'}`}>
                    {P && <P className="w-10" animated={false} />}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[14.5px] font-bold">{atividade?.titulo ?? registro.activity}</span>
                    <span className="text-[12.5px] opacity-75">{registro.date}</span>
                  </span>
                  <Check size={18} className="mr-1 text-success" aria-label="Concluída" />
                </li>
              );
            })}
          </ol>
        ) : (
          <button type="button" onClick={onAtividades} className={`${buttonClass('azul')} mt-8`}>
            Fazer a primeira atividade <ArrowRight size={17} aria-hidden="true" />
          </button>
        )}
        <p className="mt-4 text-[12px] opacity-70">Registro salvo neste aparelho.</p>
      </div>

      <div className="rounded-[30px] rounded-bl-[8px] bg-surface p-6 ring-1 ring-line sm:p-7">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="display text-[30px] text-azul-petroleo">Álbum de figurinhas</h2>
            <p className="mt-1 text-[14px] text-muted">Cada atividade concluída cola um amigo no álbum.</p>
          </div>
          <Sparkles size={22} className="mt-2 shrink-0 text-coral-ink" aria-hidden="true" />
        </div>
        <ul className="mt-5 grid grid-cols-2 gap-3">
          {ATIVIDADES.map(({ id, nomePersonagem, Personagem, campo, historico, titulo }, i) => {
            const colada = concluidas[historico] > 0;
            return (
              <li
                key={id}
                className={`relative flex aspect-[5/4] flex-col items-center justify-center rounded-[20px] rounded-bl-[5px] p-2 text-center ${
                  colada ? `${campo} figurinha-cola` : 'border-2 border-dashed border-line bg-canvas'
                }`}
                style={colada ? { animationDelay: `${i * 90}ms` } : undefined}
              >
                <Personagem className={`w-[64%] ${colada ? '' : 'opacity-25 grayscale'}`} animated={colada} />
                <span className={`mt-1 text-[12.5px] font-bold leading-tight ${colada ? 'text-on-pastel' : 'text-muted'}`}>
                  {colada ? nomePersonagem : `Conclua: ${titulo}`}
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

function DoSeuJeito({ onA11y, onOuvir }) {
  return (
    <section
      className="surge relative overflow-hidden rounded-[30px] rounded-bl-[8px] bg-salvia p-6 text-on-pastel sm:p-8"
      style={{ '--i': 4 }}
      aria-labelledby="jeito-titulo"
    >
      <div className="grid items-center gap-6 md:grid-cols-[1fr_auto]">
        <div>
          <h2 id="jeito-titulo" className="display text-[30px]">
            Do jeito de cada um
          </h2>
          <p className="mt-2 max-w-[52ch] text-[15.5px] leading-relaxed opacity-85">
            Letras maiores, mais contraste, cores para daltonismo, menos movimento e leitura em voz alta. Ajuste uma vez e
            fica salvo.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <button type="button" onClick={onA11y} className={buttonClass('azul')}>
              <PersonStanding size={17} aria-hidden="true" /> Abrir acessibilidade
            </button>
            <button type="button" onClick={onOuvir} className={buttonClass('suave')}>
              <Volume2 size={17} aria-hidden="true" /> Ouvir página
            </button>
          </div>
        </div>
        <Capivara acenando className="mx-auto w-44 md:w-52" />
      </div>
    </section>
  );
}

/* -------------------------------------------------------------- atividades */

function Atividades({ concluidas }) {
  const [categoria, setCategoria] = useState('todas');
  const [selecionada, setSelecionada] = useState(ATIVIDADES[0].id);
  const lista = ATIVIDADES.filter((a) => categoria === 'todas' || a.tipo === categoria);
  const atual = ATIVIDADES.find((a) => a.id === selecionada) ?? ATIVIDADES[0];
  const P = atual.Personagem;

  return (
    <div className="space-y-6">
      <header className="surge">
        <h1 className="display text-[40px] text-azul-petroleo sm:text-[48px]">Atividades</h1>
        <p className="mt-1 text-[16px] text-muted">Rastreio lúdico por idade. Escolha uma para ver como funciona.</p>
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
              className={`inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full border-[1.5px] px-4 text-[14px] font-semibold transition duration-200 active:scale-95 ${
                ativo
                  ? 'border-azul-petroleo bg-azul-petroleo text-on-azul'
                  : 'border-line bg-surface text-ink hover:border-azul/40 hover:bg-gelo'
              }`}
            >
              {label}
              <span className={`rounded-full px-1.5 text-[12px] ${ativo ? 'bg-white/20' : 'bg-gelo text-muted'}`}>{total}</span>
            </button>
          );
        })}
      </div>

      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
        <ul className="grid gap-4 sm:grid-cols-2" aria-label="Lista de atividades">
          {lista.map((a, i) => {
            const ativo = a.id === selecionada;
            const vezes = concluidas[a.historico] ?? 0;
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
                      <span className="block font-serif text-[36px] font-semibold leading-none">{a.idade}</span>
                      <span className="text-[12.5px] font-semibold opacity-75">anos</span>
                    </span>
                    <span key={ativo ? 'pula' : 'parado'} className={`block ${ativo ? 'char-pula' : ''}`}>
                      <Personagem className="-mb-2 w-32 transition-transform duration-500 group-hover:rotate-[-4deg]" />
                    </span>
                  </span>
                  <span className="flex flex-1 flex-col p-5">
                    <span className="font-serif text-[21px] font-semibold leading-tight text-azul-petroleo">{a.titulo}</span>
                    <span className="mt-0.5 text-[13.5px] font-semibold text-muted">{a.quem}</span>
                    <span className="mt-3 flex-1 text-[14.5px] leading-relaxed text-ink/85">{a.desc}</span>
                    <span className="mt-4 flex flex-wrap items-center gap-2 text-[12.5px] font-bold">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-success/10 px-2.5 py-1 text-success">
                        <span className="size-1.5 rounded-full bg-success" aria-hidden="true" /> Disponível
                      </span>
                      {vezes > 0 && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-gelo px-2.5 py-1 text-azul">
                          <Check size={13} aria-hidden="true" /> {vezes === 1 ? 'Feita 1 vez' : `Feita ${vezes} vezes`}
                        </span>
                      )}
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
          <p className="mt-2 text-[13px] font-semibold text-white/65">
            {atual.idade} anos · {atual.quem}
          </p>
          <h2 id="atividade-escolhida" className="display mt-1 text-[32px]">
            {atual.titulo}
          </h2>
          <p className="mt-3 text-[15px] leading-relaxed text-white/85">{COMO_FUNCIONA[atual.tipo]}</p>
          <p className="mt-3 rounded-[14px] rounded-bl-[4px] bg-white/10 p-3 text-[13.5px] leading-relaxed text-white/85">
            Escolham um lugar calmo e sem televisão. O resultado é uma orientação: quem avalia é o fonoaudiólogo.
          </p>
          <button type="button" onClick={() => abrirAtividade(atual.id)} className={`${buttonClass('mel', 'lg')} mt-6 w-full`}>
            Começar agora <ArrowRight size={18} aria-hidden="true" />
          </button>
        </aside>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------- conta */

function Conta({ session, onA11y }) {
  const dados = [
    { rotulo: 'Nome', valor: session?.name },
    { rotulo: 'E-mail', valor: session?.email },
    { rotulo: 'Telefone', valor: session?.phone },
  ];
  return (
    <div className="space-y-6">
      <header className="surge">
        <h1 className="display text-[40px] text-azul-petroleo sm:text-[48px]">Minha conta</h1>
        <p className="mt-1 text-[16px] text-muted">Dados usados no seu acesso.</p>
      </header>
      <section
        className="surge grid overflow-hidden rounded-[30px] rounded-bl-[8px] bg-surface ring-1 ring-line md:grid-cols-[1fr_280px]"
        style={{ '--i': 1 }}
      >
        <dl className="grid content-start gap-5 p-6 sm:grid-cols-2 sm:p-8">
          {dados.map(({ rotulo, valor }) => (
            <div key={rotulo} className="border-b border-line pb-4">
              <dt className="text-[13px] font-semibold text-muted">{rotulo}</dt>
              <dd className="mt-1 break-all text-[17px] font-semibold text-ink">{valor || '—'}</dd>
            </div>
          ))}
        </dl>
        <div className="flex flex-col items-center justify-center gap-4 bg-coral/60 p-6 text-center text-on-pastel">
          <Capivara acenando className="w-40" />
          <button type="button" onClick={onA11y} className={buttonClass('suave')}>
            <PersonStanding size={17} aria-hidden="true" /> Preferências de acessibilidade
          </button>
        </div>
      </section>
    </div>
  );
}

/* ------------------------------------------------------------------ página */

export default function PatientDashboard() {
  const [activeTab, setActiveTab] = useState('inicio');
  const [showA11y, setShowA11y] = useState(false);
  const [agora] = useState(() => new Date());
  const [historico] = useState(lerHistoricoTriagem);
  const { session, logout } = useAuth();
  const { isPlayerOpen, speakPageContent, stopSpeaking } = useA11y();

  const name = session?.name || session?.email || '';
  const firstName = session?.name?.split(' ')[0];
  const concluidas = historico.reduce((acc, r) => ({ ...acc, [r.activity]: (acc[r.activity] ?? 0) + 1 }), {});
  const ouvir = () => (isPlayerOpen ? stopSpeaking() : speakPageContent());

  return (
    <AreaLayout
      variante="paciente"
      rotulo="Área do paciente"
      itens={navItems}
      ativo={activeTab}
      onSelecionar={setActiveTab}
      usuario={{ nome: name, papel: 'Paciente', iniciais: name.slice(0, 2).toUpperCase() }}
      onSair={logout}
      onA11y={() => setShowA11y(true)}
      onOuvir={ouvir}
      ouvindo={isPlayerOpen}
    >
      <div key={activeTab} className="space-y-6">
        {activeTab === 'inicio' && (
          <>
            <div className="grid gap-4 xl:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)]">
              <BoasVindas
                primeiroNome={firstName}
                agora={agora}
                onAtividades={() => setActiveTab('atividades')}
                onOuvir={ouvir}
              />
              <DicaDoDia agora={agora} />
            </div>
            <PortasAtividades concluidas={concluidas} />
            <Jornada historico={historico} concluidas={concluidas} onAtividades={() => setActiveTab('atividades')} />
            <DoSeuJeito onA11y={() => setShowA11y(true)} onOuvir={ouvir} />
          </>
        )}

        {activeTab === 'atividades' && <Atividades concluidas={concluidas} />}

        {activeTab === 'conta' && <Conta session={session} onA11y={() => setShowA11y(true)} />}
      </div>

      <A11yModal isOpen={showA11y} onClose={() => setShowA11y(false)} />
    </AreaLayout>
  );
}
