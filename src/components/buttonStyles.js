const variants = {
  primary:
    'border-primary bg-primary text-on-primary shadow-[0_1px_2px_rgba(20,34,44,0.12)] hover:bg-navy hover:border-navy active:translate-y-px',
  secondary:
    'border-navy/25 bg-surface text-navy hover:border-navy hover:bg-warm active:translate-y-px',
  tertiary:
    'border-transparent bg-transparent text-navy hover:bg-warm hover:text-primary',
  danger:
    'border-danger bg-danger text-on-primary hover:brightness-[0.88]',
};

const base =
  'inline-flex min-h-11 items-center justify-center gap-2.5 rounded-[10px] border px-5 py-2.5 text-[15px] font-semibold tracking-[-0.01em] transition-all duration-150 disabled:pointer-events-none disabled:border-line disabled:bg-mist disabled:text-navy disabled:opacity-55';

export function buttonClass(variant = 'primary') {
  return `${base} ${variants[variant] || variants.primary}`;
}
