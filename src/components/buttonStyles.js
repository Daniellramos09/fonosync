// Botões FonoSync: cantos moderados com um canto "de balão de fala" (inferior esquerdo).
const variants = {
  primary:
    'border-primary bg-primary text-on-primary hover:bg-[color-mix(in_oklab,var(--color-primary),black_22%)] hover:border-[color-mix(in_oklab,var(--color-primary),black_22%)] active:translate-y-px',
  secondary:
    'border-primary/35 bg-transparent text-navy hover:border-primary hover:bg-primary/6 active:translate-y-px',
  tertiary:
    'border-transparent bg-transparent text-navy underline decoration-primary/30 decoration-2 underline-offset-[6px] hover:decoration-coral-ink hover:text-primary',
  danger:
    'border-danger bg-danger text-on-primary hover:brightness-[0.9] active:translate-y-px',
  // Destaque sobre fotografias e faixas oceano
  mel:
    'border-mel bg-mel text-on-pastel hover:bg-[#f0cd6a] hover:border-[#f0cd6a] active:translate-y-px',
  claro:
    'border-white/45 bg-white/8 text-white backdrop-blur-sm hover:bg-white/16 hover:border-white/80 active:translate-y-px',
};

const base =
  'group/btn inline-flex min-h-11 items-center justify-center gap-2.5 rounded-[12px] rounded-bl-[3px] border-[1.5px] px-5 py-2.5 font-sans text-[15px] font-semibold tracking-[-0.005em] transition-[background-color,border-color,color,transform,text-decoration-color] duration-200 ease-out disabled:pointer-events-none disabled:border-line disabled:bg-mist disabled:text-navy disabled:opacity-55';

const sizes = {
  md: '',
  lg: 'min-h-14 px-7 text-[16px] whitespace-nowrap',
};

export function buttonClass(variant = 'primary', size = 'md') {
  return `${base} ${sizes[size] || ''} ${variants[variant] || variants.primary}`;
}
