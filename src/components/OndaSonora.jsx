// Barras de onda sonora, as mesmas da logo, respirando (classe .onda-barra em index.css).
export default function OndaSonora({ className, barras = [10, 20, 30, 42, 26, 46, 32, 20, 36, 22, 12] }) {
  return (
    <svg viewBox={`0 0 ${barras.length * 12} 50`} className={className} aria-hidden="true" focusable="false">
      {barras.map((h, i) => (
        <rect
          key={i}
          className="onda-barra"
          style={{ animationDelay: `${(i % 5) * 0.16}s` }}
          x={i * 12 + 3}
          y={25 - h / 2}
          width="6"
          height={h}
          rx="3"
          fill="currentColor"
        />
      ))}
    </svg>
  );
}
