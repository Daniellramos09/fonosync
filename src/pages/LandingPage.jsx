import { useEffect, useRef, useState } from 'react';
import { ArrowRight, ArrowUpRight, PersonStanding } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import About from '../components/About';
import A11yModal from '../components/A11yModal';
import { Capivara, Sagui, Tartaruga, Tucano } from '../components/Personagens';
import { buttonClass } from '../components/buttonStyles';
import { iniciarTriagem } from '../utils/triagemInicio';

import heroImg from '../assets/images/photos/hero-fono-gesto.jpg';
import brincarImg from '../assets/images/photos/brincar-clinica.jpg';
import leituraChaoImg from '../assets/images/photos/leitura-chao.jpg';
import blocosImg from '../assets/images/photos/blocos-familia.jpg';
import tabletImg from '../assets/images/photos/tablet-casa.jpg';
import silabasImg from '../assets/images/care/silabas-girafa-ludico.jpg';
import articulacaoImg from '../assets/images/care/terapia-fala-articulacao.jpg';
import leituraClinicaImg from '../assets/images/care/atividade-leitura-clinica.jpg';

/* Separação silábica: "en·con·trar" — o ponto é desenho, não é lido em voz alta. */
function Silabas({ children }) {
  const partes = String(children).split('·');
  return partes.map((parte, i) => (
    <span key={i}>
      {parte}
      {i < partes.length - 1 && (
        <span className="silaba-ponto" aria-hidden="true">
          ·
        </span>
      )}
    </span>
  ));
}

const faixas = [
  {
    idade: '0–2',
    atividade: 'form02',
    nome: 'Marcos da comunicação',
    texto: 'Reação a sons, balbucio, contato visual e primeiras palavras, em perguntas simples para quem convive com o bebê.',
  },
  {
    idade: '2–4',
    atividade: 'game24',
    nome: 'Jogo da Palavra',
    texto: 'A criança nomeia figuras do dia a dia e o adulto registra o que ouviu. Trocas como vaca → faca ficam mapeadas.',
  },
  {
    idade: '4–5',
    atividade: 'rima45',
    nome: 'Jogo da Rima',
    texto: 'Gato e pato rimam? Começa com um exemplo de treino e segue em rodadas curtas de consciência fonológica.',
  },
  {
    idade: '6+',
    atividade: 'check6',
    nome: 'Checklist escolar',
    texto: 'Professores marcam o que observam em sala: fala, fluência, leitura e compreensão nas últimas semanas.',
  },
];

const jornada = [
  { titulo: 'Rastreio em casa', texto: 'Atividade curta, escolhida pela idade, feita com um adulto.' },
  { titulo: 'Devolutiva acolhedora', texto: 'Resultado em linguagem simples, sem rótulos e sem susto.' },
  { titulo: 'Consulta', texto: 'Quando faz sentido, a família procura um fonoaudiólogo.' },
  { titulo: 'Anamnese e avaliação', texto: 'Histórico, avaliação e hipótese diagnóstica no prontuário.' },
  { titulo: 'Sessões e orientações', texto: 'Cada sessão registrada e o treino de casa combinado.' },
  { titulo: 'Evolução', texto: 'Conquistas e pontos de atenção visíveis para todos.' },
];

const publicos = [
  {
    id: 'familias',
    nome: 'Famílias',
    resumo: 'Para começar em casa e acompanhar entre as sessões.',
    campo: 'bg-coral',
    titulo: 'Você percebe primeiro. O FonoSync ajuda a entender o que percebeu.',
    texto:
      'O rastreio é feito com você ao lado da criança, sem cadastro. Se o fonoaudiólogo já acompanha a família, a área do paciente mostra próximas consultas, treinos da semana e conquistas.',
    foto: leituraChaoImg,
    fotoAlt: 'Mãe e criança deitadas no chão da sala lendo um livro juntas',
    acao: { label: 'Começar o rastreio', href: '#/triagem', onClick: () => iniciarTriagem() },
    nota: { titulo: 'Treino da semana', linhas: ['Ler junto 10 minutos por dia', 'Apontar figuras e esperar a criança nomear'] },
    Personagem: Capivara,
  },
  {
    id: 'fono',
    nome: 'Fonoaudiólogos',
    resumo: 'Prontuário, agenda e relatórios no mesmo lugar.',
    campo: 'bg-salvia',
    titulo: 'O prontuário acompanha o raciocínio clínico, não o contrário.',
    texto:
      'Anamnese, diagnóstico com CID-10, avaliações, sessões ligadas à agenda, anexos e relatórios. O responsável legal fica vinculado ao paciente e os documentos levam o seu CRFa.',
    foto: brincarImg,
    fotoAlt: 'Terapeuta sentado no chão brincando de empilhar copos coloridos com uma criança pequena',
    acao: { label: 'Entrar na plataforma', href: '#/acesso' },
    nota: { titulo: 'Exemplo · Sessão 06', linhas: ['Ana C., 4 anos · F80.0', 'Encontro consonantal /fl/ em evolução'] },
    Personagem: Tucano,
  },
  {
    id: 'escolas',
    nome: 'Escolas',
    resumo: 'Observação em sala que vira encaminhamento cuidadoso.',
    campo: 'bg-mel',
    titulo: 'Quem passa a manhã com a criança também tem algo a dizer.',
    texto:
      'O checklist escolar organiza o que o professor observa em sala: trocas na fala, fluência, leitura e compreensão. O resultado orienta a conversa com a família, sem diagnóstico.',
    foto: leituraClinicaImg,
    fotoAlt: 'Profissional acompanhando criança em atividade de leitura e reconhecimento de letras',
    acao: { label: 'Abrir o checklist escolar', href: '#/triagem', onClick: () => iniciarTriagem('check6') },
    nota: { titulo: 'Observado nas últimas semanas', linhas: ['Troca sons ao ler em voz alta', 'Evita falar em grupo'] },
    Personagem: Sagui,
  },
];

/* ---------------------------------------------------------------- Hero */
function Hero() {
  return (
    <section className="on-dark relative flex min-h-[max(100svh,680px)] flex-col justify-end overflow-hidden bg-ocean-deep text-white lg:min-h-[max(100svh,760px)]">
      <img
        src={heroImg}
        alt=""
        fetchPriority="high"
        className="absolute inset-0 h-full w-full object-cover object-[38%_center] lg:object-[center_30%]"
      />
      <div
        aria-hidden="true"
        className="hero-veu absolute inset-0"
      />

      <div className="relative mx-auto w-full max-w-[1320px] px-5 pt-28 pb-[max(2.5rem,env(safe-area-inset-bottom))] sm:pt-32 md:px-10 lg:pb-16">
        <h1 className="display max-w-[11ch] text-[clamp(2.375rem,10.5vw,3.125rem)] text-white sm:text-[4.125rem] lg:max-w-none lg:text-[5rem] xl:text-[5.5rem]">
          <span className="hero-linha">
            <span>Toda criança tem uma voz</span>
          </span>
          <span className="hero-linha">
            <span>
              para <em className="font-normal italic">
                <Silabas>en·con·trar</Silabas>
              </em>
              .
            </span>
          </span>
        </h1>

        <div className="mt-6 max-w-[560px] sm:mt-8">
          <p className="max-w-[46ch] text-[1.0625rem] leading-[1.6] text-white/92 md:text-[1.1875rem]">
            Rastreio fonológico lúdico por idade, prontuário clínico completo e a família
            acompanhando cada passo. O FonoSync liga o consultório, a casa e a escola.
          </p>
          <div className="mt-7 flex flex-col gap-3 min-[440px]:flex-row min-[440px]:flex-wrap min-[440px]:items-center">
            <a href="#/triagem" onClick={() => iniciarTriagem()} className={buttonClass('mel', 'lg')}>
              Começar o rastreio
              <ArrowRight size={18} aria-hidden="true" className="transition-transform group-hover/btn:translate-x-0.5" />
            </a>
            <a href="#/acesso" className={buttonClass('claro', 'lg')}>
              Sou fonoaudiólogo(a)
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------- Para quem é */
function ParaQuem() {
  const [ativo, setAtivo] = useState('familias');
  const tabsRef = useRef([]);
  const atual = publicos.find((p) => p.id === ativo);
  const { Personagem } = atual;

  const onKeyDown = (e, index) => {
    const delta = e.key === 'ArrowDown' || e.key === 'ArrowRight' ? 1 : e.key === 'ArrowUp' || e.key === 'ArrowLeft' ? -1 : 0;
    if (!delta) return;
    e.preventDefault();
    const next = (index + delta + publicos.length) % publicos.length;
    setAtivo(publicos[next].id);
    tabsRef.current[next]?.focus();
  };

  return (
    <section id="para-quem" className="scroll-mt-24 bg-quente px-5 py-20 md:px-10 lg:py-28">
      <div className="mx-auto grid max-w-[1320px] gap-12 lg:grid-cols-[minmax(0,440px)_1fr] lg:gap-16">
        <div className="flex flex-col">
          <h2 className="display text-[clamp(2rem,9vw,2.5rem)] text-navy sm:text-[3.25rem] lg:text-[3.75rem]">
            Três lugares onde a fala acontece.
          </h2>
          <p className="mt-5 max-w-[40ch] text-[1.0625rem] leading-[1.6] text-muted">
            Casa, consultório e escola enxergam a mesma criança por ângulos diferentes. Escolha o
            seu.
          </p>

          <div role="tablist" aria-label="Para quem é o FonoSync" aria-orientation="vertical" className="mt-10 border-t border-line">
            {publicos.map((p, i) => {
              const selecionado = ativo === p.id;
              return (
                <button
                  key={p.id}
                  ref={(el) => (tabsRef.current[i] = el)}
                  type="button"
                  role="tab"
                  id={`aba-${p.id}`}
                  aria-selected={selecionado}
                  aria-controls="painel-publico"
                  tabIndex={selecionado ? 0 : -1}
                  onClick={() => setAtivo(p.id)}
                  onKeyDown={(e) => onKeyDown(e, i)}
                  className="group relative flex w-full items-center justify-between gap-4 border-b border-line py-5 text-left"
                >
                  <span>
                    <span
                      className={`block font-serif text-[1.875rem] leading-tight font-semibold transition-colors sm:text-[2.125rem] ${
                        selecionado ? 'text-navy' : 'text-navy/45 group-hover:text-navy/80'
                      }`}
                    >
                      {p.nome}
                    </span>
                    <span className={`mt-1 block text-[0.9375rem] ${selecionado ? 'text-muted' : 'text-muted/80'}`}>{p.resumo}</span>
                  </span>
                  <ArrowRight
                    size={24}
                    aria-hidden="true"
                    className={`shrink-0 transition-all ${selecionado ? 'text-coral-ink' : 'text-navy/30 group-hover:translate-x-1'}`}
                  />
                  {selecionado && <span aria-hidden="true" className="absolute -bottom-px left-0 h-[3px] w-2/3 bg-primary" />}
                </button>
              );
            })}
          </div>
        </div>

        <div
          id="painel-publico"
          role="tabpanel"
          aria-labelledby={`aba-${atual.id}`}
          className={`relative grid overflow-hidden rounded-[28px] rounded-bl-[6px] p-5 text-on-pastel transition-colors duration-500 sm:p-8 lg:min-h-[640px] lg:grid-cols-[1fr_1.05fr] lg:gap-8 lg:p-10 ${atual.campo}`}
        >
          <div className="relative z-10 flex flex-col justify-between gap-8 lg:py-2">
            <div>
              <h3 className="font-serif text-[1.875rem] leading-[1.1] font-semibold tracking-[-0.015em] sm:text-[2.25rem]">
                {atual.titulo}
              </h3>
              <p className="mt-5 max-w-[44ch] text-[1rem] leading-[1.65] text-on-pastel/85">{atual.texto}</p>
            </div>
            <div className="flex flex-wrap items-end justify-between gap-4">
              <a href={atual.acao.href} onClick={atual.acao.onClick} className={`${buttonClass('primary', 'lg')} max-sm:w-full max-sm:whitespace-normal`}>
                {atual.acao.label}
                <ArrowRight size={18} aria-hidden="true" />
              </a>
              <Personagem className="ml-auto w-24 shrink-0 sm:w-36 lg:hidden" />
            </div>
          </div>

          <div className="relative mt-8 lg:mt-0">
            <img
              key={atual.id}
              src={atual.foto}
              alt={atual.fotoAlt}
              loading="lazy"
              className="h-[240px] w-full rounded-[20px] rounded-tr-[70px] object-cover min-[400px]:h-[300px] sm:h-[380px] sm:rounded-tr-[90px] lg:h-full"
            />
            <div className="absolute right-3 -bottom-4 left-3 rounded-[14px] rounded-bl-[3px] bg-quente p-4 text-ink shadow-[0_18px_40px_-18px_color-mix(in_srgb,var(--color-ocean-deep)_45%,transparent)] sm:right-auto sm:left-[-28px] sm:w-[280px] lg:bottom-10">
              <p className="text-[0.8125rem] font-semibold text-muted">{atual.nota.titulo}</p>
              <ul className="mt-2 space-y-1.5">
                {atual.nota.linhas.map((linha) => (
                  <li key={linha} className="flex gap-2 text-[0.90625rem] leading-snug font-semibold text-navy">
                    <span aria-hidden="true" className="mt-[7px] size-1.5 shrink-0 rounded-full bg-coral-ink" />
                    {linha}
                  </li>
                ))}
              </ul>
            </div>
            <Personagem className="absolute -top-4 right-0 hidden w-36 drop-shadow-[0_8px_10px_rgba(40,58,67,0.18)] lg:block" />
          </div>
        </div>
      </div>
    </section>
  );
}

/* --------------------------------------------------------------- Rastreio */
function Rastreio() {
  return (
    <section id="rastreio" className="on-dark scroll-mt-24 bg-ocean px-5 py-20 text-white md:px-10 lg:py-32">
      <div className="mx-auto grid max-w-[1320px] items-center gap-14 lg:grid-cols-[minmax(0,560px)_1fr] lg:gap-20">
        <div className="relative pb-10 lg:pb-0">
          <img
            src={silabasImg}
            alt="Criança montando a palavra girafa com cartões de sílabas sobre a mesa"
            loading="lazy"
            className="aspect-[4/5] w-full rounded-[28px] rounded-br-[6px] object-cover object-top"
          />
          <img
            src={articulacaoImg}
            alt="Fonoaudióloga e criança tocando o queixo para sentir o som durante a sessão"
            loading="lazy"
            className="absolute -right-3 -bottom-2 w-[52%] rounded-[18px] rounded-tl-[4px] border-[6px] border-ocean object-cover shadow-[0_24px_48px_-16px_rgba(0,0,0,0.45)] md:-right-8 lg:-bottom-10"
          />
          <p
            aria-hidden="true"
            className="absolute top-6 -left-2 rounded-[12px] rounded-bl-[3px] bg-mel px-4 py-2 font-serif text-[1.625rem] font-semibold text-on-pastel shadow-lg md:-left-6"
          >
            gi<span className="text-coral-ink">·</span>ra<span className="text-coral-ink">·</span>fa
          </p>
        </div>

        <div>
          <h2 className="display text-[clamp(2rem,9vw,2.5rem)] sm:text-[3.25rem] lg:text-[3.75rem]">
            Parece brincadeira.
            <span className="block text-mel">É rastreio de verdade.</span>
          </h2>
          <p className="mt-6 max-w-[52ch] text-[1.0625rem] leading-[1.65] text-white/85">
            Quem escuta a criança é o adulto que convive com ela. Cada faixa etária tem uma atividade
            curta, com processos fonológicos mapeados e uma devolutiva clara no final, que você pode
            baixar e levar ao fonoaudiólogo.
          </p>

          <ul className="mt-10 border-t border-white/18">
            {faixas.map((f) => (
              <li key={f.idade} className="border-b border-white/18">
                <a
                  href="#/triagem"
                  onClick={() => iniciarTriagem(f.atividade)}
                  className="group grid grid-cols-[60px_1fr_auto] items-start gap-3 py-5 min-[400px]:grid-cols-[72px_1fr_auto] min-[400px]:gap-4 sm:grid-cols-[96px_1fr_auto]"
                >
                  <span className="display text-[1.875rem] text-mel min-[400px]:text-[2.125rem] sm:text-[2.625rem]">{f.idade}</span>
                  <span>
                    <span className="block text-[1.125rem] font-bold">{f.nome}</span>
                    <span className="mt-1 block text-[0.9375rem] leading-[1.55] text-white/75">{f.texto}</span>
                  </span>
                  <ArrowUpRight
                    size={22}
                    aria-hidden="true"
                    className="mt-2 text-white/50 transition-[color,transform] group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-mel"
                  />
                  <span className="sr-only">(abrir atividade de {f.idade} anos)</span>
                </a>
              </li>
            ))}
          </ul>
          <p className="mt-6 max-w-[56ch] text-[0.875rem] leading-[1.6] text-white/70">
            O rastreio não é diagnóstico. Ele indica se vale a pena procurar um fonoaudiólogo para uma
            avaliação presencial.
          </p>
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- Jornada */
function Jornada() {
  return (
    <section id="jornada" className="scroll-mt-24 overflow-hidden bg-lavanda px-5 py-20 text-on-pastel md:px-10 lg:py-28">
      <div className="mx-auto max-w-[1320px]">
        <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
          <h2 className="display max-w-[14ch] text-[clamp(2rem,9vw,2.5rem)] sm:text-[3.25rem] lg:text-[4rem]">
            Um caminho no ritmo da criança.
          </h2>
          <p className="max-w-[40ch] text-[1.0625rem] leading-[1.6] text-on-pastel/80">
            Do primeiro rastreio à evolução registrada, cada etapa fica no mesmo lugar, para a família e
            para o fonoaudiólogo.
          </p>
        </div>

        {/* Trilha: a tartaruga caminha conforme a página rola */}
        <div className="relative mt-16 hidden lg:block" aria-hidden="true">
          <div className="h-28">
            <div className="trilha-tartaruga absolute bottom-[-6px] left-0 w-32">
              <Tartaruga />
            </div>
          </div>
          <div className="border-t-[3px] border-dashed border-on-pastel/30" />
        </div>

        <ol className="mt-10 grid gap-x-6 gap-y-8 sm:grid-cols-2 lg:mt-0 lg:grid-cols-6">
          {jornada.map((etapa, i) => (
            <li key={etapa.titulo} className="relative lg:pt-8">
              <span aria-hidden="true" className="absolute -top-[9px] left-0 hidden size-4 rounded-full border-[3px] border-lavanda bg-ocean lg:block" />
              <p className="font-serif text-[0.9375rem] font-semibold text-on-pastel/60">Etapa {i + 1}</p>
              <h3 className="mt-1 font-serif text-[1.375rem] leading-tight font-semibold">{etapa.titulo}</h3>
              <p className="mt-2 text-[0.9375rem] leading-[1.55] text-on-pastel/80">{etapa.texto}</p>
            </li>
          ))}
        </ol>
        <Tartaruga className="mt-10 w-36 lg:hidden" />
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- Famílias */
function Familias() {
  return (
    <section id="familias" className="scroll-mt-24 bg-nevoa">
      <div className="mx-auto grid max-w-[1440px] lg:grid-cols-[1fr_1fr]">
        <div className="flex flex-col justify-center px-5 py-20 md:px-10 lg:py-28 lg:pr-16 lg:pl-[max(2.5rem,calc((100vw-1320px)/2))]">
          <h2 className="display max-w-[13ch] text-[clamp(2rem,9vw,2.5rem)] text-navy sm:text-[3.25rem] lg:text-[3.75rem]">
            A terapia continua na mesa da cozinha.
          </h2>
          <p className="mt-6 max-w-[48ch] text-[1.0625rem] leading-[1.65] text-muted">
            Uma sessão por semana é pouco tempo perto de tudo o que a criança fala em casa. Quando a
            família entende o objetivo de cada exercício, o treino vira parte da rotina, sem cara de
            tarefa.
          </p>
          <dl className="mt-10 grid gap-x-10 gap-y-6 sm:grid-cols-2">
            {[
              ['Orientações claras', 'O que treinar, por quanto tempo e por quê, escrito pelo fonoaudiólogo.'],
              ['Próximas consultas', 'Data, horário e se é presencial ou online.'],
              ['Conquistas', 'Selos por constância, para a criança ver o próprio progresso.'],
              ['Histórico do rastreio', 'Os resultados ficam salvos e podem ser baixados.'],
            ].map(([t, d]) => (
              <div key={t} className="border-t-2 border-primary/25 pt-3">
                <dt className="font-serif text-[1.25rem] font-semibold text-navy">{t}</dt>
                <dd className="mt-1.5 text-[0.9375rem] leading-[1.55] text-muted">{d}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-10">
            <a href="#/acesso" className={buttonClass('secondary', 'lg')}>
              Entrar na área da família
            </a>
          </div>
        </div>

        <div className="relative min-h-[420px] sm:min-h-[520px] lg:min-h-[760px]">
          <img
            src={blocosImg}
            alt="Adulto e criança montando uma torre de blocos de madeira desenhados à mão"
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover object-[center_40%]"
          />
          <img
            src={tabletImg}
            alt="Mãe e filha deitadas na cama usando um tablet juntas"
            loading="lazy"
            className="absolute bottom-8 left-5 w-[46%] max-w-[300px] rounded-[18px] rounded-bl-[4px] border-[6px] border-nevoa object-cover shadow-[0_24px_48px_-18px_rgba(0,0,0,0.5)] md:left-8 lg:-left-16"
          />
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------- Acessibilidade e cuidado */
function Cuidado() {
  const [showA11y, setShowA11y] = useState(false);

  const grupos = [
    {
      titulo: 'Acessível para quem usa',
      itens: [
        'Leitura da página em voz alta, com a palavra marcada enquanto é lida',
        'Modo escuro, alto contraste e modos para daltonismo',
        'Tamanho de fonte, espaçamento e áreas de toque maiores',
        'Navegação completa pelo teclado e animações que respeitam o seu sistema',
      ],
    },
    {
      titulo: 'Cuidadoso com os dados',
      itens: [
        'Feito seguindo a LGPD: nada de CPF da criança',
        'Todo paciente vinculado a um responsável legal',
        'Acesso por perfil: cada um vê só o que é seu',
        'Documentos clínicos identificados com o CRFa do profissional',
      ],
    },
  ];

  return (
    <section id="cuidado" className="scroll-mt-24 bg-salvia px-5 py-20 text-on-pastel md:px-10 lg:py-28">
      <div className="mx-auto grid max-w-[1320px] gap-14 lg:grid-cols-[minmax(0,460px)_1fr] lg:gap-20">
        <div>
          <h2 className="display text-[clamp(2rem,9vw,2.5rem)] sm:text-[3.25rem]">Acessível e privado desde a primeira linha.</h2>
          <p className="mt-5 max-w-[42ch] text-[1.0625rem] leading-[1.6] text-on-pastel/80">
            Famílias, crianças e profissionais diferentes usam a mesma plataforma. Os ajustes estão a um
            toque, em qualquer tela.
          </p>
          <div className="mt-8 flex flex-col gap-3 min-[440px]:flex-row min-[440px]:flex-wrap">
            <button type="button" onClick={() => setShowA11y(true)} className={buttonClass('primary', 'lg')}>
              <PersonStanding size={18} aria-hidden="true" /> Ajustar acessibilidade
            </button>
          </div>
        </div>

        <div className="grid gap-10 sm:grid-cols-2">
          {grupos.map((g) => (
            <div key={g.titulo}>
              <h3 className="font-serif text-[1.5rem] font-semibold">{g.titulo}</h3>
              <ul className="mt-4 border-t border-on-pastel/20">
                {g.itens.map((item) => (
                  <li key={item} className="border-b border-on-pastel/20 py-3.5 text-[0.96875rem] leading-[1.5]">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <A11yModal isOpen={showA11y} onClose={() => setShowA11y(false)} />
    </section>
  );
}

/* ---------------------------------------------------------------- Convite */
function Convite() {
  return (
    <section className="relative overflow-hidden bg-mel px-5 pt-20 text-on-pastel md:px-10 lg:pt-24">
      <div className="mx-auto grid max-w-[1320px] items-end gap-6 lg:grid-cols-[1fr_auto]">
        <div className="pb-16 lg:pb-24">
          <h2 className="display max-w-[14ch] text-[clamp(2.25rem,10vw,2.75rem)] sm:text-[3.75rem] lg:text-[4.75rem]">
            Vamos ouvir o que ela tem a <Silabas>di·zer</Silabas>?
          </h2>
          <p className="mt-6 max-w-[46ch] text-[1.0625rem] leading-[1.6] text-on-pastel/80">
            Escolha a idade e comece uma atividade agora, ou entre na área clínica do FonoSync.
          </p>
          <div className="mt-8 flex flex-col gap-3 min-[440px]:flex-row min-[440px]:flex-wrap">
            <a href="#/triagem" onClick={() => iniciarTriagem()} className={buttonClass('primary', 'lg')}>
              Começar o rastreio
              <ArrowRight size={18} aria-hidden="true" />
            </a>
            <a href="#/acesso" className={buttonClass('secondary', 'lg')}>
              Entrar na plataforma
            </a>
          </div>
        </div>
        <Capivara acenando title="Capivara do FonoSync acenando" className="mx-auto w-52 sm:w-80 lg:w-[400px]" />
      </div>
    </section>
  );
}

export default function LandingPage() {
  useEffect(() => {
    document.title = 'FonoSync — Cada criança encontra a sua voz';
    // Paleta temporária baseada na logo atual (tokens em index.css, bloco [data-marca="logo"])
    const root = document.documentElement;
    root.dataset.marca = 'logo';
    return () => {
      delete root.dataset.marca;
    };
  }, []);

  return (
    <div className="flex min-h-screen flex-col overflow-x-clip bg-quente font-sans text-ink">
      <Header />
      <main id="primary" className="flex-1">
        <Hero />
        <ParaQuem />
        <Rastreio />
        <Jornada />
        <About />
        <Familias />
        <Cuidado />
        <Convite />
      </main>
      <Footer />
    </div>
  );
}
