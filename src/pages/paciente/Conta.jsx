import { useState } from 'react';
import { RotateCcw } from 'lucide-react';
import { buttonClass } from '../../components/buttonStyles';
import { campo, rotulo } from '../../components/area/campos';
import { FAIXAS, faixaPorIdade, idadeEm } from '../../experiencia/faixas';
import { SeletorFaixa } from './EscolhaExperiencia';
import { BotoesAcessibilidade } from './compartilhado';

const ORIGENS = {
  cadastro: 'Escolhida automaticamente pela data de nascimento do cadastro.',
  informada: 'Escolhida automaticamente pela data de nascimento informada aqui.',
  escolhida: 'Escolhida por você.',
};

export default function Conta({ session, faixa, experiencia, onA11y, onOuvir, ouvindo }) {
  const [data, setData] = useState(experiencia.nascimento ?? '');
  const [hoje] = useState(() => new Date());
  const previa = faixaPorIdade(idadeEm(data, hoje));
  const jovem = faixa.id === 'adolescente';
  const titulo = jovem
    ? 'font-sans text-[2.5rem] font-extrabold tracking-[-0.03em] text-ink sm:text-[3rem]'
    : 'display text-[2.5rem] text-azul-petroleo sm:text-[3rem]';
  const h2 = jovem ? 'font-sans text-[1.25rem] font-extrabold tracking-tight text-ink' : 'font-serif text-[1.5rem] font-semibold text-azul-petroleo';

  const dados = [
    { rotulo: 'Nome', valor: session?.name },
    { rotulo: 'E-mail', valor: session?.email },
    { rotulo: 'Telefone', valor: session?.phone },
  ];

  return (
    <div className="space-y-6">
      <header className="surge">
        <h1 className={titulo}>{faixa.nav.conta}</h1>
        <p className="mt-1 text-[1.0625rem] text-muted">Dados do acesso e o jeito desta área.</p>
      </header>

      <section className="surge rounded-[26px] rounded-bl-[7px] bg-surface p-6 ring-1 ring-line sm:p-7" style={{ '--i': 1 }}>
        <dl className="grid gap-5 sm:grid-cols-3">
          {dados.map(({ rotulo: r, valor }) => (
            <div key={r}>
              <dt className="text-[0.8125rem] font-semibold text-muted">{r}</dt>
              <dd className="mt-1 break-all text-[1.0625rem] font-semibold text-ink">{valor || '—'}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="surge space-y-4 rounded-[26px] rounded-bl-[7px] bg-surface p-6 ring-1 ring-line sm:p-7" style={{ '--i': 2 }} aria-labelledby="exp-titulo">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 id="exp-titulo" className={h2}>
              Experiência: {faixa.rotulo.toLowerCase()}
            </h2>
            <p className="mt-1 text-[0.9375rem] text-muted">{ORIGENS[experiencia.origem]}</p>
          </div>
          {experiencia.origem === 'escolhida' && experiencia.automatica && (
            <button type="button" onClick={experiencia.usarAutomatica} className={buttonClass('suave')}>
              <RotateCcw size={16} aria-hidden="true" /> Voltar para {FAIXAS[experiencia.automatica].rotulo.toLowerCase()} (pela idade)
            </button>
          )}
        </div>

        <SeletorFaixa atual={faixa.id} onEscolher={experiencia.escolherFaixa} />

        {experiencia.origem !== 'cadastro' && (
          <form
            className="flex flex-wrap items-end gap-3 border-t border-line pt-4"
            onSubmit={(e) => {
              e.preventDefault();
              if (previa) experiencia.salvarNascimento(data);
            }}
          >
            <div className="min-w-[14rem] flex-1">
              <label htmlFor="conta-nascimento" className={rotulo}>
                Data de nascimento de quem faz o acompanhamento
              </label>
              <input id="conta-nascimento" type="date" value={data} onChange={(e) => setData(e.target.value)} className={campo} />
            </div>
            <button type="submit" disabled={!previa} className={buttonClass('azul')}>
              Usar a idade para escolher
            </button>
          </form>
        )}
        <p className="text-[0.8125rem] text-muted">
          A experiência fica salva neste aparelho e não altera seus dados clínicos. Os ajustes de acessibilidade valem por cima
          de qualquer experiência.
        </p>
      </section>

      <section className="surge flex flex-wrap items-center justify-between gap-4 rounded-[26px] rounded-bl-[7px] bg-surface p-6 ring-1 ring-line sm:p-7" style={{ '--i': 3 }}>
        <div>
          <h2 className={h2}>Acessibilidade</h2>
          <p className="mt-1 text-[0.9375rem] text-muted">Texto, contraste, cores, movimento e voz da leitura.</p>
        </div>
        <BotoesAcessibilidade onA11y={onA11y} onOuvir={onOuvir} ouvindo={ouvindo} />
      </section>
    </div>
  );
}
