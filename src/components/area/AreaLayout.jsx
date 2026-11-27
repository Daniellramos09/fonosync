import { useEffect, useRef, useState } from 'react';
import { LogOut, Menu, PersonStanding, Volume2, VolumeX, X } from 'lucide-react';
import Logo from '../Logo';
import OndaSonora from '../OndaSonora';
import { Capivara } from '../Personagens';

// Estrutura comum das áreas internas: navegação lateral flutuante no desktop,
// barra superior + gaveta no celular. Duas variantes com identidades próprias:
//   profissional — azul profundo, sóbria, ícones com ponto mel
//   paciente     — clara, cada item com sua cor, capivara acenando no rodapé

const VARIANTES = {
  profissional: {
    painel: 'bg-azul-profundo text-white on-dark',
    rotulo: 'text-white/60',
    item: 'text-white/78 hover:bg-white/8 hover:text-white',
    itemAtivo: 'bg-white text-azul-profundo shadow-[0_10px_24px_-14px_rgba(0,0,0,0.7)]',
    acento: '#F5D887',
    acentoAtivo: '#C2571F',
    caixaIcone: 'bg-white/8',
    caixaIconeAtivo: 'bg-[#e3eef9]',
    rodape: 'border-white/12',
    botao: 'border-white/20 text-white hover:bg-white/10',
    cartao: 'bg-white/8',
    papel: 'text-white/60',
    sair: 'text-white/70 hover:bg-white/10 hover:text-white',
    topo: 'bg-azul-profundo text-white on-dark',
    logo: 'claro',
  },
  paciente: {
    painel: 'bg-surface text-ink ring-1 ring-line',
    rotulo: 'text-muted',
    item: 'text-ink/80 hover:bg-gelo hover:text-ink',
    itemAtivo: 'bg-gelo text-azul-petroleo shadow-[inset_0_0_0_1.5px_color-mix(in_srgb,var(--color-azul)_30%,transparent)]',
    acento: '#A8492C',
    acentoAtivo: '#A8492C',
    caixaIcone: '',
    caixaIconeAtivo: '',
    rodape: 'border-line',
    botao: 'border-line text-ink hover:border-azul/40 hover:bg-gelo',
    cartao: 'bg-creme ring-1 ring-line',
    papel: 'text-muted',
    sair: 'text-muted hover:bg-gelo hover:text-ink',
    topo: 'bg-surface text-ink border-b border-line',
    logo: 'ocean',
  },
};

function ConteudoNav({ v, variante, rotulo, itens, ativo, onSelecionar, usuario, onSair, onA11y, onOuvir, ouvindo }) {
  const paciente = variante === 'paciente';
  return (
    <div className="flex h-full flex-col">
      <div className="px-2 pb-6 pt-1">
        <a href="#/" aria-label="FonoSync — página inicial" className="inline-flex">
          <Logo tone={v.logo} />
        </a>
        <p className={`mt-2 pl-[46px] text-[12px] font-semibold ${v.rotulo}`}>{rotulo}</p>
      </div>

      <nav aria-label={rotulo} className="flex flex-col gap-1">
        {itens.map(({ id, label, icon: Icon, cor }) => {
          const selecionado = ativo === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => onSelecionar(id)}
              aria-current={selecionado ? 'page' : undefined}
              style={{ '--icone-acento': selecionado ? v.acentoAtivo : v.acento }}
              className={`group flex min-h-12 w-full cursor-pointer items-center gap-3 rounded-[14px] rounded-bl-[4px] px-2 text-left text-[14.5px] font-semibold transition duration-200 active:scale-[0.98] ${
                selecionado ? v.itemAtivo : v.item
              }`}
            >
              <span
                className={`grid size-9 shrink-0 place-items-center rounded-[11px] transition-transform duration-300 group-hover:-rotate-6 ${
                  selecionado ? `${v.caixaIconeAtivo} scale-105` : v.caixaIcone
                }`}
                style={paciente ? { background: cor } : undefined}
              >
                <Icon className={`size-5 ${paciente ? 'text-on-pastel' : ''}`} />
              </span>
              {label}
            </button>
          );
        })}
      </nav>

      <div className="flex-1" />

      {paciente ? (
        <div aria-hidden="true" className="relative mx-auto mb-1 mt-6 w-full max-w-[200px]">
          <span className="absolute -top-2 right-0 rounded-[12px] rounded-bl-[3px] bg-mel px-2.5 py-1 font-serif text-[14px] font-semibold text-on-pastel shadow-sm">
            Oi<span aria-hidden="true" style={{ color: '#A8492C' }}>·</span>oi!
          </span>
          <Capivara acenando className="w-[150px]" />
        </div>
      ) : (
        <OndaSonora className="mx-2 mb-4 mt-6 h-8 w-28 text-white/20" />
      )}

      <div className={`space-y-3 border-t pt-4 ${v.rodape}`}>
        <div className="grid grid-cols-1 gap-2">
          <button
            type="button"
            onClick={onA11y}
            className={`flex min-h-10 cursor-pointer items-center justify-center gap-1.5 rounded-[12px] rounded-bl-[3px] border px-2 text-[12.5px] font-semibold transition ${v.botao}`}
          >
            <PersonStanding size={15} aria-hidden="true" /> Acessibilidade
          </button>
          <button
            type="button"
            onClick={onOuvir}
            aria-pressed={ouvindo}
            className={`flex min-h-10 cursor-pointer items-center justify-center gap-1.5 rounded-[12px] rounded-bl-[3px] border px-2 text-[12.5px] font-semibold transition ${v.botao}`}
          >
            {ouvindo ? <VolumeX size={15} aria-hidden="true" /> : <Volume2 size={15} aria-hidden="true" />}
            Ouvir página
          </button>
        </div>

        <div className={`flex items-center gap-3 rounded-[16px] rounded-bl-[5px] p-2.5 ${v.cartao}`}>
          <span
            className={`grid size-10 shrink-0 place-items-center rounded-full font-serif text-[14px] font-bold ${
              paciente ? 'bg-coral text-on-pastel' : 'bg-mel text-on-pastel'
            }`}
          >
            {usuario.iniciais}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[13.5px] font-bold">{usuario.nome}</p>
            <p className={`truncate text-[12px] ${v.papel}`}>{usuario.papel}</p>
          </div>
          <button
            type="button"
            onClick={onSair}
            aria-label="Sair para a página inicial"
            title="Sair"
            className={`grid size-9 cursor-pointer place-items-center rounded-full transition ${v.sair}`}
          >
            <LogOut size={17} aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AreaLayout({ variante = 'profissional', children, onSelecionar, ...props }) {
  const v = VARIANTES[variante];
  const [aberto, setAberto] = useState(false);
  const fecharRef = useRef(null);

  useEffect(() => {
    if (!aberto) return undefined;
    fecharRef.current?.focus();
    const onKey = (e) => e.key === 'Escape' && setAberto(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [aberto]);

  const selecionar = (id) => {
    setAberto(false);
    onSelecionar(id);
  };

  const conteudo = <ConteudoNav v={v} variante={variante} onSelecionar={selecionar} {...props} />;
  const fundo = variante === 'paciente' ? 'bg-creme' : 'bg-canvas';

  return (
    <div className={`min-h-dvh font-sans md:flex ${fundo}`}>
      {/* Barra superior no celular */}
      <div className={`sticky top-0 z-30 flex items-center justify-between px-4 py-3 md:hidden ${v.topo}`}>
        <Logo tone={v.logo} markClassName="size-8" />
        <button
          type="button"
          onClick={() => setAberto(true)}
          aria-label="Abrir menu de navegação"
          aria-expanded={aberto}
          className={`grid size-10 cursor-pointer place-items-center rounded-[12px] border transition ${v.botao}`}
        >
          <Menu size={20} aria-hidden="true" />
        </button>
      </div>

      {/* Gaveta no celular */}
      {aberto && (
        <div className="fixed inset-0 z-50 md:hidden" role="dialog" aria-modal="true" aria-label="Menu de navegação">
          <button
            type="button"
            aria-label="Fechar menu"
            tabIndex={-1}
            onClick={() => setAberto(false)}
            className="painel-fundo absolute inset-0 bg-azul-profundo/45 backdrop-blur-sm"
          />
          <div className={`painel-gaveta absolute inset-y-0 left-0 w-[86%] max-w-[320px] overflow-y-auto p-4 ${v.painel}`}>
            <button
              ref={fecharRef}
              type="button"
              onClick={() => setAberto(false)}
              aria-label="Fechar menu de navegação"
              className={`absolute right-3 top-3 grid size-10 cursor-pointer place-items-center rounded-full border ${v.botao}`}
            >
              <X size={18} aria-hidden="true" />
            </button>
            {conteudo}
          </div>
        </div>
      )}

      {/* Navegação lateral flutuante no desktop */}
      <aside className="hidden shrink-0 md:block md:w-[272px] md:p-3 md:pr-0">
        <div
          className={`sticky top-3 h-[calc(100dvh-1.5rem)] overflow-y-auto rounded-[26px] rounded-bl-[8px] p-4 ${v.painel}`}
        >
          {conteudo}
        </div>
      </aside>

      <main className="min-w-0 flex-1 px-4 py-6 sm:px-6 md:px-8 md:py-8">
        <div className="mx-auto w-full max-w-[1240px]">{children}</div>
      </main>
    </div>
  );
}
