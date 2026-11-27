import { useState } from 'react';
import { ArrowRight, Check } from 'lucide-react';
import OndaSonora from '../../components/OndaSonora';
import { buttonClass } from '../../components/buttonStyles';
import { campo, rotulo } from '../../components/area/campos';
import { Capivara } from '../../components/Personagens';
import { FAIXAS, ORDEM_FAIXAS, faixaPorIdade, idadeEm } from '../../experiencia/faixas';

// Prévia visual de cada perfil: mostra o tom antes de escolher.
function Previa({ id }) {
  if (id === 'crianca') return <Capivara className="w-24" acenando />;
  if (id === 'adolescente')
    return (
      <span className="grid h-20 w-28 place-items-center rounded-[18px] bg-[linear-gradient(135deg,#0f1c2b,#2c6aa6)] text-[1.75rem] font-extrabold tracking-tight text-white">
        Aa
      </span>
    );
  if (id === 'adulto') return <OndaSonora className="h-14 w-28 text-azul-petroleo" />;
  return <span className="font-serif text-[3.25rem] font-semibold leading-none text-azul-petroleo">Aa</span>;
}

export function SeletorFaixa({ atual, onEscolher }) {
  return (
    <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4" role="radiogroup" aria-label="Experiência da área do paciente">
      {ORDEM_FAIXAS.map((id) => {
        const f = FAIXAS[id];
        const ativo = atual === id;
        return (
          <li key={id}>
            <button
              type="button"
              role="radio"
              aria-checked={ativo}
              onClick={() => onEscolher(id)}
              className={`group flex h-full w-full cursor-pointer flex-col items-start gap-3 rounded-[22px] rounded-bl-[6px] bg-surface p-5 text-left transition duration-200 hover:-translate-y-0.5 ${
                ativo ? 'ring-[3px] ring-azul' : 'ring-1 ring-line hover:ring-azul/40'
              }`}
            >
              <span className="flex h-24 w-full items-center justify-center rounded-[16px] bg-canvas">
                <Previa id={id} />
              </span>
              <span className="flex w-full items-center justify-between gap-2">
                <span className="text-[1.0625rem] font-bold text-ink">{f.rotulo}</span>
                {ativo && (
                  <span className="grid size-6 place-items-center rounded-full bg-azul text-on-azul">
                    <Check size={14} aria-hidden="true" />
                  </span>
                )}
              </span>
              <span className="-mt-2 text-[0.8125rem] font-semibold text-muted">{f.intervalo}</span>
              <span className="text-[0.875rem] leading-relaxed text-muted">{f.resumo}</span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}

// Primeira visita sem data de nascimento conhecida: pergunta uma vez.
export default function EscolhaExperiencia({ nome, onNascimento, onEscolher }) {
  const [data, setData] = useState('');
  const [hoje] = useState(() => new Date());
  const idade = idadeEm(data, hoje);
  const previa = faixaPorIdade(idade);

  return (
    <div className="space-y-6">
      <header className="surge">
        <h1 className="display text-[2.5rem] text-azul-petroleo sm:text-[3rem]">
          {nome ? `Olá, ${nome}!` : 'Olá!'} Vamos deixar o FonoSync do seu jeito.
        </h1>
        <p className="mt-2 max-w-[60ch] text-[1.0625rem] leading-relaxed text-muted">
          A área do paciente muda conforme a idade de quem faz o acompanhamento: uma criança de 5 anos, um adolescente, um
          adulto e uma pessoa de 70 anos precisam de telas diferentes. Você pode mudar isso depois em “Minha conta”.
        </p>
      </header>

      <form
        className="surge flex flex-wrap items-end gap-4 rounded-[26px] rounded-bl-[7px] bg-surface p-6 ring-1 ring-line"
        style={{ '--i': 1 }}
        onSubmit={(e) => {
          e.preventDefault();
          if (previa) onNascimento(data);
        }}
      >
        <div className="min-w-[14rem] flex-1">
          <label htmlFor="exp-nascimento" className={rotulo}>
            Data de nascimento de quem faz o acompanhamento
          </label>
          <input id="exp-nascimento" type="date" value={data} onChange={(e) => setData(e.target.value)} className={campo} />
        </div>
        <button type="submit" disabled={!previa} className={buttonClass('azul', 'lg')}>
          {previa ? `Continuar como ${FAIXAS[previa].rotulo.toLowerCase()}` : 'Continuar'} <ArrowRight size={18} aria-hidden="true" />
        </button>
      </form>

      <section className="surge space-y-3" style={{ '--i': 2 }} aria-labelledby="escolha-titulo">
        <h2 id="escolha-titulo" className="font-serif text-[1.375rem] font-semibold text-azul-petroleo">
          Ou escolha direto
        </h2>
        <SeletorFaixa atual={null} onEscolher={onEscolher} />
      </section>
    </div>
  );
}
