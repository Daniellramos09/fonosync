import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, ChevronDown, Menu, PersonStanding, Volume2, X } from 'lucide-react';
import consultorioImg from '../assets/images/care/consultorio-familia-atendimento.jpg';
import brincarImg from '../assets/images/photos/brincar-clinica.jpg';
import silabasImg from '../assets/images/care/silabas-girafa-ludico.jpg';
import A11yModal from './A11yModal';
import Logo from './Logo';
import { buttonClass } from './buttonStyles';
import { useA11y } from '../hooks/useA11y';
import { iniciarTriagem } from '../utils/triagemInicio';

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

const menus = [
  {
    id: 'produto',
    label: 'Produto',
    foto: consultorioImg,
    fotoAlt: 'Fonoaudióloga em atendimento com criança e mãe no consultório',
    destaque: 'Consultório e casa no mesmo plano',
    items: [
      { title: 'Prontuário clínico', desc: 'Anamnese, diagnóstico CID-10, avaliações e histórico por paciente.', section: 'sobre' },
      { title: 'Agenda e sessões', desc: 'Consultas presenciais ou online que viram sessão registrada.', section: 'sobre' },
      { title: 'Jornada terapêutica', desc: 'Do rastreio à evolução, passo a passo.', section: 'jornada' },
      { title: 'Área da família', desc: 'Orientações para casa, próximas consultas e conquistas.', section: 'familias' },
    ],
  },
  {
    id: 'publico',
    label: 'Para quem é',
    foto: brincarImg,
    fotoAlt: 'Terapeuta brincando de empilhar copos com uma criança pequena',
    destaque: 'Cada perfil com o que precisa',
    items: [
      { title: 'Famílias', desc: 'Rastreio em casa e acompanhamento entre as sessões.', section: 'para-quem' },
      { title: 'Fonoaudiólogos', desc: 'Prontuário estruturado, agenda e relatórios.', section: 'para-quem' },
      { title: 'Escolas', desc: 'Checklist em sala para apoiar encaminhamentos.', section: 'para-quem' },
      { title: 'Acessibilidade', desc: 'Leitura por voz, alto contraste e modos de cor.', section: 'cuidado' },
    ],
  },
  {
    id: 'rastreio',
    label: 'Rastreio',
    foto: silabasImg,
    fotoAlt: 'Criança montando a palavra girafa com cartões de sílabas',
    destaque: 'Atividades curtas, sem cadastro',
    faixas: [
      { idade: '0–2', title: 'Marcos da comunicação', atividade: 'form02' },
      { idade: '2–4', title: 'Jogo da Palavra', atividade: 'game24' },
      { idade: '4–5', title: 'Jogo da Rima', atividade: 'rima45' },
      { idade: '6+', title: 'Checklist escolar', atividade: 'check6' },
    ],
  },
];

export default function Header() {
  const [showA11y, setShowA11y] = useState(false);
  const [openMenu, setOpenMenu] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [solid, setSolid] = useState(false);
  const navRef = useRef(null);
  const closeTimeoutRef = useRef(null);
  const { speakPageContent, isPlayerOpen } = useA11y();

  // Sobre a foto do hero o cabeçalho é vidro escuro; depois vira faixa clara.
  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > window.innerHeight * 0.72);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setOpenMenu(null);
        setMobileOpen(false);
      }
    };
    const handleClickOutside = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) setOpenMenu(null);
    };
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  const handleMouseEnter = (menuId) => {
    if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
    setOpenMenu(menuId);
  };
  const handleMouseLeave = () => {
    closeTimeoutRef.current = setTimeout(() => setOpenMenu(null), 160);
  };

  const close = () => setOpenMenu(null);
  const dark = !solid && !openMenu;
  const active = menus.find((m) => m.id === openMenu);

  const navItemClass = (isOpen) =>
    `inline-flex min-h-10 items-center gap-1.5 rounded-[10px] rounded-bl-[3px] px-3.5 text-[15px] font-semibold transition-colors ${
      dark
        ? 'text-white hover:bg-white/12'
        : `text-navy ${isOpen ? 'bg-salvia' : 'hover:bg-salvia/60'}`
    }`;

  const chipClass = dark
    ? 'border-white/30 text-white hover:bg-white/12'
    : 'border-primary/25 text-navy hover:bg-salvia/60';

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-40 px-3 pt-3 md:px-5">
        <div
          ref={navRef}
          className={`relative mx-auto flex h-16 max-w-[1320px] items-center justify-between gap-3 rounded-[14px] px-3 transition-[background-color,box-shadow,color] duration-300 md:px-5 ${
            dark
              ? 'on-dark bg-[#0f2a2f]/50 text-white backdrop-blur-xl'
              : 'bg-quente/95 text-navy shadow-[0_12px_32px_-14px_rgba(23,67,74,0.3)] backdrop-blur-xl'
          }`}
        >
          <a href="#/" aria-label="FonoSync, página inicial" className="shrink-0">
            <Logo tone={dark ? 'claro' : 'ocean'} markClassName="size-9" />
          </a>

          <nav aria-label="Principal" className="hidden lg:block">
            <ul className="flex items-center gap-1">
              {menus.map((menu) => (
                <li key={menu.id} onMouseEnter={() => handleMouseEnter(menu.id)} onMouseLeave={handleMouseLeave}>
                  <button
                    type="button"
                    aria-expanded={openMenu === menu.id}
                    onClick={() => setOpenMenu(openMenu === menu.id ? null : menu.id)}
                    className={navItemClass(openMenu === menu.id)}
                  >
                    {menu.label}
                    <ChevronDown
                      size={15}
                      aria-hidden="true"
                      className={`transition-transform duration-200 ${openMenu === menu.id ? 'rotate-180' : ''}`}
                    />
                  </button>
                </li>
              ))}
              <li>
                <a href="#sobre" onClick={scrollToId('sobre', close)} className={navItemClass(false)}>
                  A plataforma
                </a>
              </li>
            </ul>
          </nav>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setShowA11y(true)}
              className={`inline-flex size-10 items-center justify-center rounded-[10px] rounded-bl-[3px] border transition-colors xl:w-auto xl:gap-2 xl:px-3 ${chipClass}`}
              title="Acessibilidade"
            >
              <PersonStanding size={17} aria-hidden="true" />
              <span className="sr-only xl:not-sr-only xl:text-[14px] xl:font-semibold">Acessibilidade</span>
            </button>
            <button
              type="button"
              aria-pressed={isPlayerOpen}
              onClick={() => speakPageContent()}
              className={`hidden size-10 items-center justify-center rounded-[10px] rounded-bl-[3px] border transition-colors md:inline-flex ${
                isPlayerOpen ? 'border-mel bg-mel text-on-pastel' : chipClass
              }`}
              title="Ouvir página"
            >
              <Volume2 size={17} aria-hidden="true" />
              <span className="sr-only">Ouvir página</span>
            </button>
            <a
              href="#/acesso"
              className={`hidden min-h-10 items-center px-3 text-[15px] font-semibold underline-offset-[6px] hover:underline sm:inline-flex ${
                dark ? 'text-white' : 'text-navy'
              }`}
            >
              Entrar
            </a>
            <a
              href="#/triagem"
              onClick={() => iniciarTriagem()}
              className={`${buttonClass(dark ? 'mel' : 'primary')} hidden min-h-10 py-2 md:inline-flex`}
            >
              Começar o rastreio
            </a>
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              aria-expanded={mobileOpen}
              aria-controls="menu-movel"
              className={`inline-flex size-10 items-center justify-center rounded-[10px] rounded-bl-[3px] border lg:hidden ${chipClass}`}
            >
              <Menu size={20} aria-hidden="true" />
              <span className="sr-only">Abrir menu</span>
            </button>
          </div>

          {active && (
            <div
              onMouseEnter={() => handleMouseEnter(active.id)}
              onMouseLeave={handleMouseLeave}
              className="absolute top-[calc(100%+10px)] left-1/2 z-50 hidden w-[820px] -translate-x-1/2 grid-cols-[1fr_250px] gap-6 rounded-[18px] rounded-tl-[4px] bg-quente p-6 text-ink shadow-[0_30px_70px_-20px_rgba(23,67,74,0.35)] lg:grid"
            >
              {active.faixas ? (
                <ul className="grid grid-cols-2 gap-x-6">
                  {active.faixas.map((f) => (
                    <li key={f.idade} className="border-b border-line">
                      <a
                        href="#/triagem"
                        onClick={() => {
                          iniciarTriagem(f.atividade);
                          close();
                        }}
                        className="group flex items-center gap-4 py-4"
                      >
                        <span className="display w-[4.5rem] shrink-0 text-[34px] text-primary">{f.idade}</span>
                        <span>
                          <span className="block text-[15px] font-bold text-navy group-hover:text-primary">{f.title}</span>
                          <span className="text-[13px] text-muted">anos · abrir atividade</span>
                        </span>
                      </a>
                    </li>
                  ))}
                </ul>
              ) : (
                <ul className="grid grid-cols-2 content-start gap-x-6">
                  {active.items.map((item) => (
                    <li key={item.title}>
                      <a
                        href={`#${item.section}`}
                        onClick={scrollToId(item.section, close)}
                        className="group block border-b border-line py-4"
                      >
                        <span className="flex items-center gap-1.5 font-serif text-[19px] font-semibold text-navy group-hover:text-primary">
                          {item.title}
                          <ArrowUpRight size={15} aria-hidden="true" className="opacity-0 transition-opacity group-hover:opacity-100" />
                        </span>
                        <span className="mt-1 block text-[13.5px] leading-snug text-muted">{item.desc}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              )}
              <figure className="relative overflow-hidden rounded-[14px] rounded-br-[4px]">
                <img src={active.foto} alt={active.fotoAlt} className="h-full min-h-48 w-full object-cover" />
                <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/65 to-transparent p-3 pt-12 font-serif text-[17px] leading-tight text-white">
                  {active.destaque}
                </figcaption>
              </figure>
            </div>
          )}
        </div>
      </header>

      {mobileOpen && (
        <div
          id="menu-movel"
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
          className="on-dark fixed inset-0 z-50 flex flex-col overflow-y-auto bg-ocean-deep px-5 pt-5 pb-8 text-white lg:hidden"
        >
          <div className="flex items-center justify-between">
            <Logo tone="claro" />
            <button
              type="button"
              autoFocus
              onClick={() => setMobileOpen(false)}
              className="inline-flex size-11 items-center justify-center rounded-[10px] rounded-bl-[3px] border border-white/25"
            >
              <X size={22} aria-hidden="true" />
              <span className="sr-only">Fechar menu</span>
            </button>
          </div>
          <nav aria-label="Principal (celular)" className="mt-10 flex-1">
            <p className="text-[14px] font-semibold text-on-band-muted">Rastreio por idade</p>
            <ul className="mt-3 grid grid-cols-2 gap-2">
              {menus[2].faixas.map((f) => (
                <li key={f.idade}>
                  <a
                    href="#/triagem"
                    onClick={() => {
                      iniciarTriagem(f.atividade);
                      setMobileOpen(false);
                    }}
                    className="block rounded-[12px] rounded-bl-[3px] bg-white/8 p-3"
                  >
                    <span className="display block text-[30px] text-mel">{f.idade}</span>
                    <span className="text-[14px] font-semibold">{f.title}</span>
                  </a>
                </li>
              ))}
            </ul>
            <ul className="mt-8 border-t border-white/15">
              {[
                ['Para quem é', 'para-quem'],
                ['Como funciona', 'jornada'],
                ['A plataforma', 'sobre'],
                ['Para famílias', 'familias'],
              ].map(([label, id]) => (
                <li key={id} className="border-b border-white/15">
                  <a
                    href={`#${id}`}
                    onClick={scrollToId(id, () => setMobileOpen(false))}
                    className="flex min-h-14 items-center justify-between font-serif text-[24px]"
                  >
                    {label}
                    <ArrowUpRight size={20} aria-hidden="true" className="text-mel" />
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div className="mt-8 grid gap-3">
            <a href="#/acesso" className={`${buttonClass('claro', 'lg')} w-full`}>
              Entrar na plataforma
            </a>
            <button
              type="button"
              onClick={() => {
                setMobileOpen(false);
                speakPageContent();
              }}
              className={`${buttonClass('claro', 'lg')} w-full`}
            >
              <Volume2 size={18} aria-hidden="true" /> Ouvir página
            </button>
          </div>
        </div>
      )}

      <A11yModal isOpen={showA11y} onClose={() => setShowA11y(false)} />
    </>
  );
}
