import { useEffect, useRef, useState } from 'react';
import {
  ArrowRight,
  Calendar,
  ChevronDown,
  FileText,
  Gamepad2,
  HeartHandshake,
  PersonStanding,
  School,
  ShieldCheck,
  Stethoscope,
  Users,
  Volume2,
} from 'lucide-react';
import logoImg from '../assets/images/ModeloA_Semnome.jpg';
import consultorioImg from '../assets/images/care/consultorio-familia-atendimento.jpg';
import articulacaoImg from '../assets/images/care/terapia-fala-articulacao.jpg';
import silabasImg from '../assets/images/care/silabas-girafa-ludico.jpg';
import A11yModal from './A11yModal';
import { useA11y } from '../hooks/useA11y';

const scrollToId = (id, onComplete) => (e) => {
  if (onComplete) onComplete();
  if (window.location.hash && window.location.hash !== '#/' && window.location.hash !== '') {
    return;
  }
  const el = document.getElementById(id);
  if (el) {
    e.preventDefault();
    el.scrollIntoView({ behavior: 'smooth' });
  }
};

const productItems = [
  {
    icon: FileText,
    title: 'Prontuário Clínico',
    desc: 'Anamnese, diagnóstico CID-10, plano terapêutico e histórico completo por paciente.',
    href: '#sobre',
    isSection: true,
  },
  {
    icon: Calendar,
    title: 'Agenda & Sessões',
    desc: 'Organização de consultas presenciais ou online com conversão direta em sessão evoluída.',
    href: '#fluxo-clinico',
    isSection: true,
  },
  {
    icon: ShieldCheck,
    title: 'Evolução & Anexos',
    desc: 'Linha do tempo documentada, upload de exames em nuvem e emissão de laudos com CRFa.',
    href: '#recursos',
    isSection: true,
  },
  {
    icon: HeartHandshake,
    title: 'Portal da Família',
    desc: 'Orientações domiciliares claras, treino entre consultas e acompanhamento de conquistas.',
    href: '#sobre',
    isSection: true,
  },
];

const audienceItems = [
  {
    icon: Stethoscope,
    title: 'Fonoaudiólogos',
    desc: 'Gestão clínica integrada, prontuário estruturado e relatórios interdisciplinares.',
    href: '#/acesso',
    isSection: false,
  },
  {
    icon: Users,
    title: 'Famílias e Crianças',
    desc: 'Continuidade terapêutica em casa e atividades lúdicas calibradas por idade.',
    href: '#/triagem',
    isSection: false,
  },
  {
    icon: School,
    title: 'Escolas e Educadores',
    desc: 'Observação estruturada em sala de aula para apoiar encaminhamentos precoces.',
    href: '#/triagem',
    isSection: false,
  },
  {
    icon: ShieldCheck,
    title: 'Redes de Saúde',
    desc: 'Padronização de registros, controle de acesso RBAC e proteção de dados sob a LGPD.',
    href: '#seguranca',
    isSection: true,
  },
];

const triagemItems = [
  {
    age: '0 – 2 anos',
    title: 'Marcos da Comunicação',
    desc: 'Observação guiada de reação a sons, contato visual, balbucio e primeiras palavras.',
    href: '#/triagem',
  },
  {
    age: '2 – 4 anos',
    title: 'Jogo da Palavra',
    desc: 'Nomeação de figuras para identificar trocas e processos fonológicos iniciais.',
    href: '#/triagem',
  },
  {
    age: '4 – 5 anos',
    title: 'Jogo da Rima',
    desc: 'Percepção sonora e consciência fonológica em 5 rodadas interativas.',
    href: '#/triagem',
  },
  {
    age: '6+ anos',
    title: 'Checklist Escolar',
    desc: 'Mapeamento funcional de fala, fluência, leitura e compreensão em sala.',
    href: '#/triagem',
  },
];

export default function Header() {
  const [showA11y, setShowA11y] = useState(false);
  const [openMenu, setOpenMenu] = useState(null); // 'produto' | 'publico' | 'rastreio' | null
  const navRef = useRef(null);
  const closeTimeoutRef = useRef(null);
  const { speakPageContent, isPlayerOpen } = useA11y();

  const handleMouseEnter = (menuId) => {
    if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
    setOpenMenu(menuId);
  };

  const handleMouseLeave = () => {
    closeTimeoutRef.current = setTimeout(() => {
      setOpenMenu(null);
    }, 140);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setOpenMenu(null);
    };
    const handleClickOutside = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) {
        setOpenMenu(null);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-black/6 bg-surface/95 px-5 py-3.5 backdrop-blur-md md:px-10">
        <div
          ref={navRef}
          className="relative mx-auto flex max-w-[1240px] items-center justify-between gap-4"
        >
          {/* Identidade Visual à Esquerda */}
          <a href="#/" className="flex items-center gap-2.5 group">
            <img
              src={logoImg}
              alt="FonoSync"
              className="h-9 w-9 rounded-[10px] border border-black/8 object-contain bg-white"
            />
            <span className="font-sans text-[19px] font-medium tracking-[-0.03em] text-ink leading-none">
              FonoSync
            </span>
          </a>

          {/* Navegação Central com Mega-Menus */}
          <nav aria-label="Principal" className="hidden lg:block">
            <ul className="flex items-center gap-1.5">
              {/* Dropdown 1: Produto */}
              <li
                onMouseEnter={() => handleMouseEnter('produto')}
                onMouseLeave={handleMouseLeave}
              >
                <button
                  type="button"
                  aria-expanded={openMenu === 'produto'}
                  onClick={() => setOpenMenu(openMenu === 'produto' ? null : 'produto')}
                  className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-[14px] font-medium transition-colors ${
                    openMenu === 'produto'
                      ? 'bg-[#f6f5f3] text-ink'
                      : 'text-ink/80 hover:bg-[#f6f5f3] hover:text-ink'
                  }`}
                >
                  <span>Produto</span>
                  <ChevronDown
                    size={14}
                    aria-hidden="true"
                    className={`transition-transform duration-150 ${
                      openMenu === 'produto' ? 'rotate-180' : ''
                    }`}
                  />
                </button>
              </li>

              {/* Dropdown 2: Para quem é */}
              <li
                onMouseEnter={() => handleMouseEnter('publico')}
                onMouseLeave={handleMouseLeave}
              >
                <button
                  type="button"
                  aria-expanded={openMenu === 'publico'}
                  onClick={() => setOpenMenu(openMenu === 'publico' ? null : 'publico')}
                  className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-[14px] font-medium transition-colors ${
                    openMenu === 'publico'
                      ? 'bg-[#f6f5f3] text-ink'
                      : 'text-ink/80 hover:bg-[#f6f5f3] hover:text-ink'
                  }`}
                >
                  <span>Para quem é</span>
                  <ChevronDown
                    size={14}
                    aria-hidden="true"
                    className={`transition-transform duration-150 ${
                      openMenu === 'publico' ? 'rotate-180' : ''
                    }`}
                  />
                </button>
              </li>

              {/* Dropdown 3: Rastreio Fonológico */}
              <li
                onMouseEnter={() => handleMouseEnter('rastreio')}
                onMouseLeave={handleMouseLeave}
              >
                <button
                  type="button"
                  aria-expanded={openMenu === 'rastreio'}
                  onClick={() => setOpenMenu(openMenu === 'rastreio' ? null : 'rastreio')}
                  className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-[14px] font-medium transition-colors ${
                    openMenu === 'rastreio'
                      ? 'bg-[#f6f5f3] text-ink'
                      : 'text-ink/80 hover:bg-[#f6f5f3] hover:text-ink'
                  }`}
                >
                  <span>Rastreio Fonológico</span>
                  <ChevronDown
                    size={14}
                    aria-hidden="true"
                    className={`transition-transform duration-150 ${
                      openMenu === 'rastreio' ? 'rotate-180' : ''
                    }`}
                  />
                </button>
              </li>

              {/* Link Direto: Sobre */}
              <li>
                <a
                  href="#sobre"
                  onClick={scrollToId('sobre', () => setOpenMenu(null))}
                  className="inline-flex items-center rounded-full px-4 py-2 text-[14px] font-medium text-ink/80 transition-colors hover:bg-[#f6f5f3] hover:text-ink"
                >
                  Sobre
                </a>
              </li>
            </ul>
          </nav>

          {/* Ações à Direita: Acessibilidade, Ouvir Página, Entrar e CTA */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowA11y(true)}
              className="inline-flex min-h-10 items-center gap-1.5 rounded-full bg-[#f6f5f3] px-3.5 py-2 text-[13px] font-medium text-ink transition-colors hover:bg-[#ebe9e4]"
              title="Opções de acessibilidade visual e motora"
            >
              <PersonStanding size={15} aria-hidden="true" />
              <span className="hidden sm:inline">Acessibilidade</span>
              <span className="sr-only sm:hidden">Acessibilidade</span>
            </button>

            <span className="hidden md:inline-flex">
              <button
                type="button"
                aria-pressed={isPlayerOpen}
                onClick={() => speakPageContent()}
                className={`inline-flex min-h-10 items-center gap-1.5 rounded-full px-3.5 py-2 text-[13px] font-medium transition-colors ${
                  isPlayerOpen
                    ? 'bg-primary text-on-primary'
                    : 'bg-[#f6f5f3] text-ink hover:bg-[#ebe9e4]'
                }`}
              >
                <Volume2 size={15} aria-hidden="true" />
                <span>Ouvir página</span>
              </button>
            </span>

            <a
              href="#/acesso"
              className="hidden sm:inline-flex min-h-10 items-center px-3.5 py-2 text-[14px] font-medium text-ink/85 transition-colors hover:text-primary"
            >
              Entrar
            </a>

            <a
              href="#/triagem"
              className="inline-flex min-h-10 items-center justify-center rounded-full bg-primary px-4.5 py-2 text-[14px] font-medium text-on-primary transition-colors hover:bg-navy"
            >
              Iniciar triagem
            </a>
          </div>

          {/* ==================== MEGA-MENU 1: PRODUTO ==================== */}
          {openMenu === 'produto' && (
            <div
              onMouseEnter={() => handleMouseEnter('produto')}
              onMouseLeave={handleMouseLeave}
              className="absolute top-[calc(100%+10px)] left-1/2 z-50 hidden w-[780px] -translate-x-1/2 rounded-2xl border border-black/6 bg-surface p-6 shadow-[0_20px_60px_rgba(0,0,0,0.08)] lg:grid lg:grid-cols-12 lg:gap-6"
            >
              <div className="col-span-8">
                <p className="mb-3 px-2.5 text-[11px] font-medium tracking-wider text-muted uppercase">
                  Arquitetura Clínica &amp; Acompanhamento
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {productItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <a
                        key={item.title}
                        href={item.href}
                        onClick={
                          item.isSection
                            ? scrollToId(item.href.replace('#', ''), () => setOpenMenu(null))
                            : () => setOpenMenu(null)
                        }
                        className="group flex items-start gap-3 rounded-xl p-3 transition-colors hover:bg-[#f6f5f3]"
                      >
                        <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg bg-[#f6f5f3] text-primary transition-colors group-hover:bg-white">
                          <Icon size={17} aria-hidden="true" />
                        </span>
                        <div>
                          <p className="font-sans text-[14px] font-medium text-ink">
                            {item.title}
                          </p>
                          <p className="mt-0.5 text-[12.5px] leading-snug text-muted">
                            {item.desc}
                          </p>
                        </div>
                      </a>
                    );
                  })}
                </div>
              </div>

              <div className="col-span-4 flex flex-col justify-between rounded-xl bg-[#f6f5f3] p-4">
                <div className="space-y-3">
                  <img
                    src={consultorioImg}
                    alt="Consultório fonoaudiológico em atendimento familiar"
                    className="h-32 w-full rounded-lg object-cover"
                  />
                  <div>
                    <p className="font-sans text-[14px] font-medium text-ink">
                      Consultório e casa conectados
                    </p>
                    <p className="mt-1 text-[12px] leading-relaxed text-muted">
                      Prontuário estruturado para o fonoaudiólogo e atividades guiadas para a família.
                    </p>
                  </div>
                </div>
                <a
                  href="#sobre"
                  onClick={scrollToId('sobre', () => setOpenMenu(null))}
                  className="mt-3 inline-flex items-center gap-1.5 text-[13px] font-medium text-primary hover:underline"
                >
                  <span>Explorar prévia dos painéis</span>
                  <ArrowRight size={14} aria-hidden="true" />
                </a>
              </div>
            </div>
          )}

          {/* ==================== MEGA-MENU 2: PARA QUEM É ==================== */}
          {openMenu === 'publico' && (
            <div
              onMouseEnter={() => handleMouseEnter('publico')}
              onMouseLeave={handleMouseLeave}
              className="absolute top-[calc(100%+10px)] left-1/2 z-50 hidden w-[780px] -translate-x-1/2 rounded-2xl border border-black/6 bg-surface p-6 shadow-[0_20px_60px_rgba(0,0,0,0.08)] lg:grid lg:grid-cols-12 lg:gap-6"
            >
              <div className="col-span-8">
                <p className="mb-3 px-2.5 text-[11px] font-medium tracking-wider text-muted uppercase">
                  Por Perfil de Cuidado
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {audienceItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <a
                        key={item.title}
                        href={item.href}
                        onClick={
                          item.isSection
                            ? scrollToId(item.href.replace('#', ''), () => setOpenMenu(null))
                            : () => setOpenMenu(null)
                        }
                        className="group flex items-start gap-3 rounded-xl p-3 transition-colors hover:bg-[#f6f5f3]"
                      >
                        <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg bg-[#f6f5f3] text-primary transition-colors group-hover:bg-white">
                          <Icon size={17} aria-hidden="true" />
                        </span>
                        <div>
                          <p className="font-sans text-[14px] font-medium text-ink">
                            {item.title}
                          </p>
                          <p className="mt-0.5 text-[12.5px] leading-snug text-muted">
                            {item.desc}
                          </p>
                        </div>
                      </a>
                    );
                  })}
                </div>
              </div>

              <div className="col-span-4 flex flex-col justify-between rounded-xl bg-[#f6f5f3] p-4">
                <div className="space-y-3">
                  <img
                    src={articulacaoImg}
                    alt="Fonoaudióloga demonstrando ponto articulatório com criança"
                    className="h-32 w-full rounded-lg object-cover"
                  />
                  <div>
                    <p className="font-sans text-[14px] font-medium text-ink">
                      Cuidado fonoaudiológico em rede
                    </p>
                    <p className="mt-1 text-[12px] leading-relaxed text-muted">
                      Fluxos desenhados para clínicas, famílias e educadores com ética e privacidade.
                    </p>
                  </div>
                </div>
                <a
                  href="#/acesso"
                  onClick={() => setOpenMenu(null)}
                  className="mt-3 inline-flex items-center gap-1.5 text-[13px] font-medium text-primary hover:underline"
                >
                  <span>Acessar área da plataforma</span>
                  <ArrowRight size={14} aria-hidden="true" />
                </a>
              </div>
            </div>
          )}

          {/* ==================== MEGA-MENU 3: RASTREIO FONOLÓGICO ==================== */}
          {openMenu === 'rastreio' && (
            <div
              onMouseEnter={() => handleMouseEnter('rastreio')}
              onMouseLeave={handleMouseLeave}
              className="absolute top-[calc(100%+10px)] left-1/2 z-50 hidden w-[780px] -translate-x-1/2 rounded-2xl border border-black/6 bg-surface p-6 shadow-[0_20px_60px_rgba(0,0,0,0.08)] lg:grid lg:grid-cols-12 lg:gap-6"
            >
              <div className="col-span-8">
                <p className="mb-3 px-2.5 text-[11px] font-medium tracking-wider text-muted uppercase">
                  Triagem Lúdica por Faixa Etária (5 Rodadas)
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {triagemItems.map((item) => (
                    <a
                      key={item.age}
                      href={item.href}
                      onClick={() => setOpenMenu(null)}
                      className="group flex items-start gap-3 rounded-xl p-3 transition-colors hover:bg-[#f6f5f3]"
                    >
                      <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg bg-[#f6f5f3] text-primary transition-colors group-hover:bg-white">
                        <Gamepad2 size={17} aria-hidden="true" />
                      </span>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-sans text-[14px] font-medium text-ink">
                            {item.title}
                          </p>
                          <span className="rounded-full bg-[#f6f5f3] px-2 py-0.5 text-[11px] font-medium text-primary group-hover:bg-white">
                            {item.age}
                          </span>
                        </div>
                        <p className="mt-0.5 text-[12.5px] leading-snug text-muted">
                          {item.desc}
                        </p>
                      </div>
                    </a>
                  ))}
                </div>
              </div>

              <div className="col-span-4 flex flex-col justify-between rounded-xl bg-[#f6f5f3] p-4">
                <div className="space-y-3">
                  <img
                    src={silabasImg}
                    alt="Criança montando sílabas com cartões ilustrados"
                    className="h-32 w-full rounded-lg object-cover"
                  />
                  <div>
                    <p className="font-sans text-[14px] font-medium text-ink">
                      Rastreio aberto sem cadastro
                    </p>
                    <p className="mt-1 text-[12px] leading-relaxed text-muted">
                      Devolutiva ética imediata ao final das 5 rodadas com relatório para o fonoaudiólogo.
                    </p>
                  </div>
                </div>
                <a
                  href="#/triagem"
                  onClick={() => setOpenMenu(null)}
                  className="mt-3 inline-flex items-center gap-1.5 text-[13px] font-medium text-primary hover:underline"
                >
                  <span>Abrir módulo de triagem</span>
                  <ArrowRight size={14} aria-hidden="true" />
                </a>
              </div>
            </div>
          )}
        </div>
      </header>

      <A11yModal isOpen={showA11y} onClose={() => setShowA11y(false)} />
    </>
  );
}
