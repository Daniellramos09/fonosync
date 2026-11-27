import { useEffect, useState } from 'react';
import { ArrowRight, ArrowUpRight, ClipboardList, UserPlus } from 'lucide-react';
import Notice from '../../components/Notice';
import OndaSonora from '../../components/OndaSonora';
import { buttonClass } from '../../components/buttonStyles';
import Avatar, { SeloStatus } from '../../components/area/Avatar';
import { IconeAgenda, IconePacientes, IconeProntuario, IconeRelatorios } from '../../components/area/IconesFono';
import { listPatients } from '../../services/patientService';
import { listEvaluations } from '../../services/recordService';
import { calculateAge, formatDateBR } from '../../utils/formatters';

const ATALHOS = [
  { id: 'pacientes', titulo: 'Novo paciente', desc: 'Cadastro e pré-cadastro', icon: IconePacientes },
  { id: 'prontuario', titulo: 'Prontuários', desc: 'Sessões, avaliações e anexos', icon: IconeProntuario },
  { id: 'agenda', titulo: 'Agenda', desc: 'Sessões do dia e da semana', icon: IconeAgenda },
  { id: 'relatorios', titulo: 'Relatórios', desc: 'Laudos e documentos', icon: IconeRelatorios },
];

function saudacao(data) {
  const h = data.getHours();
  if (h < 12) return 'Bom dia';
  if (h < 18) return 'Boa tarde';
  return 'Boa noite';
}

function Esqueleto({ className }) {
  return <span className={`esqueleto block rounded-[10px] ${className}`} aria-hidden="true" />;
}

// Distribuição dos pacientes por status: barra segmentada com legenda.
function Distribuicao({ grupos, total }) {
  return (
    <div>
      <div className="flex h-3 w-full gap-1 overflow-hidden rounded-full" role="img" aria-label={grupos.map((g) => `${g.valor} ${g.rotulo}`).join(', ')}>
        {total === 0 ? (
          <span className="h-full w-full rounded-full bg-white/15" />
        ) : (
          grupos
            .filter((g) => g.valor > 0)
            .map((g) => (
              <span key={g.rotulo} className={`barra-enche h-full rounded-full ${g.cor}`} style={{ width: `${(g.valor / total) * 100}%` }} />
            ))
        )}
      </div>
      <ul className="mt-4 grid grid-cols-3 gap-3">
        {grupos.map((g) => (
          <li key={g.rotulo}>
            <span className="flex items-center gap-1.5 text-[12.5px] font-semibold text-white/70">
              <span className={`size-2 rounded-full ${g.cor}`} aria-hidden="true" />
              {g.rotulo}
            </span>
            <span className="font-serif text-[30px] font-semibold leading-tight">{g.valor}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Home({ onNavigate, professionalName = '' }) {
  const [patients, setPatients] = useState([]);
  const [openEvaluations, setOpenEvaluations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [agora] = useState(() => new Date());

  useEffect(() => {
    listPatients()
      .then(async (list) => {
        setPatients(list);
        const active = list.filter((patient) => patient.patientStatus !== 'ARQUIVADO');
        const evaluations = await Promise.all(active.map((patient) => listEvaluations(patient.id)));
        setOpenEvaluations(
          evaluations
            .flat()
            .filter((evaluation) => !evaluation.concluido)
            .sort((a, b) => (b.dataAvaliacao ?? '').localeCompare(a.dataAvaliacao ?? '')),
        );
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const active = patients.filter((patient) => patient.patientStatus === 'ATIVO');
  const preRegistered = patients.filter((patient) => patient.patientStatus === 'PRE_CADASTRO');
  const archived = patients.filter((patient) => patient.patientStatus === 'ARQUIVADO');
  const recent = [...active, ...preRegistered].slice(-5).reverse();

  const primeiroNome = professionalName.includes('@') ? '' : professionalName.split(' ').slice(0, 2).join(' ');
  const dataLonga = agora.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' });

  return (
    <div className="flex flex-col gap-6">
      {/* Abertura: saudação, resumo e distribuição dos pacientes */}
      <section className="surge on-dark relative isolate overflow-hidden rounded-[30px] rounded-bl-[8px] bg-azul-profundo text-white">
        <div className="absolute -right-24 -top-24 -z-10 size-80 rounded-full bg-azul/35 blur-3xl" aria-hidden="true" />
        <OndaSonora className="absolute bottom-6 right-8 -z-10 hidden h-24 w-72 text-white/[0.06] lg:block" />
        <div className="grid gap-8 p-6 sm:p-8 lg:grid-cols-[1.2fr_1fr] lg:p-10">
          <div className="flex flex-col justify-between gap-6">
            <div>
              <p className="text-[13px] font-semibold text-white/65 first-letter:uppercase">{dataLonga}</p>
              <h1 className="display mt-2 text-[38px] sm:text-[48px]">
                {saudacao(agora)}
                {primeiroNome ? `, ${primeiroNome}` : ''}.
              </h1>
              <p className="mt-3 max-w-[44ch] text-[16px] leading-relaxed text-white/80" aria-live="polite">
                {loading
                  ? 'Carregando o resumo do consultório...'
                  : `${active.length} paciente(s) em acompanhamento e ${openEvaluations.length} avaliação(ões) em andamento.`}
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button type="button" onClick={() => onNavigate('pacientes')} className={buttonClass('mel')}>
                <UserPlus size={17} aria-hidden="true" /> Novo paciente
              </button>
              <button type="button" onClick={() => onNavigate('prontuario')} className={buttonClass('claro')}>
                <ClipboardList size={17} aria-hidden="true" /> Prontuários
              </button>
            </div>
          </div>

          <div className="rounded-[22px] rounded-bl-[6px] bg-white/[0.07] p-5 ring-1 ring-white/12">
            <p className="text-[13px] font-semibold text-white/70">Seus pacientes</p>
            {loading ? (
              <div className="mt-4 space-y-4">
                <Esqueleto className="h-3 w-full opacity-30" />
                <Esqueleto className="h-14 w-2/3 opacity-30" />
              </div>
            ) : (
              <div className="mt-3">
                <p className="mb-4 font-serif text-[18px]">
                  <span className="text-[44px] font-semibold leading-none">{patients.length}</span> no total
                </p>
                <Distribuicao
                  total={patients.length}
                  grupos={[
                    { rotulo: 'Ativos', valor: active.length, cor: 'bg-salvia' },
                    { rotulo: 'Pré-cadastro', valor: preRegistered.length, cor: 'bg-mel' },
                    { rotulo: 'Arquivados', valor: archived.length, cor: 'bg-white/35' },
                  ]}
                />
              </div>
            )}
          </div>
        </div>
      </section>

      {error && (
        <Notice tone="danger" title="Não foi possível carregar o resumo">
          {error}
        </Notice>
      )}

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
        {/* Avaliações em andamento */}
        <section className="surge rounded-[26px] rounded-bl-[7px] bg-surface p-5 ring-1 ring-line sm:p-6" style={{ '--i': 1 }}>
          <div className="flex items-center justify-between gap-3">
            <h2 className="flex items-center gap-2.5 font-serif text-[22px] font-semibold text-azul-petroleo">
              Avaliações em andamento
              {!loading && (
                <span className="grid min-w-7 place-items-center rounded-full bg-mel px-2 text-[13px] font-bold text-on-pastel">
                  {openEvaluations.length}
                </span>
              )}
            </h2>
          </div>

          {loading && (
            <div className="mt-5 space-y-3">
              {[0, 1, 2].map((i) => (
                <Esqueleto key={i} className="h-14 w-full" />
              ))}
            </div>
          )}
          {!loading && openEvaluations.length === 0 && (
            <p className="mt-5 rounded-[16px] rounded-bl-[4px] bg-canvas p-5 text-[14.5px] text-muted">
              Nenhuma avaliação em andamento. As avaliações abertas no prontuário aparecem aqui.
            </p>
          )}
          <ul className="mt-4 flex flex-col">
            {openEvaluations.slice(0, 5).map((evaluation) => (
              <li key={evaluation.id} className="border-t border-line first:border-0">
                <a
                  href={`#/profissional/prontuario/${evaluation.paciente?.id}`}
                  className="group -mx-2 flex items-center gap-3 rounded-[14px] px-2 py-3 transition hover:bg-gelo"
                >
                  <Avatar nome={evaluation.paciente?.name} />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[15px] font-bold text-ink">{evaluation.paciente?.name}</span>
                    <span className="block truncate text-[13.5px] text-muted">{evaluation.tipoAvaliacao}</span>
                  </span>
                  <span className="shrink-0 text-[13px] font-semibold text-muted">{formatDateBR(evaluation.dataAvaliacao)}</span>
                  <ArrowUpRight
                    size={18}
                    aria-hidden="true"
                    className="shrink-0 text-azul opacity-0 transition group-hover:translate-x-0.5 group-hover:opacity-100"
                  />
                </a>
              </li>
            ))}
          </ul>
        </section>

        {/* Atalhos */}
        <section className="surge" style={{ '--i': 2 }} aria-labelledby="atalhos-titulo">
          <h2 id="atalhos-titulo" className="mb-3 font-serif text-[22px] font-semibold text-azul-petroleo">
            Atalhos
          </h2>
          <ul className="grid grid-cols-2 gap-3">
            {ATALHOS.map(({ id, titulo, desc, icon: Icon }) => (
              <li key={id}>
                <button
                  type="button"
                  onClick={() => onNavigate(id)}
                  style={{ '--icone-acento': '#C2571F' }}
                  className="group flex h-full w-full cursor-pointer flex-col gap-3 rounded-[20px] rounded-bl-[5px] bg-surface p-4 text-left ring-1 ring-line transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_18px_34px_-24px_rgba(19,48,74,0.7)] hover:ring-azul/40 active:translate-y-0"
                >
                  <span className="grid size-10 place-items-center rounded-[12px] bg-gelo text-azul-petroleo transition-transform duration-300 group-hover:-rotate-6">
                    <Icon className="size-[22px]" />
                  </span>
                  <span>
                    <span className="flex items-center gap-1 text-[15px] font-bold text-ink">
                      {titulo}
                      <ArrowRight size={15} aria-hidden="true" className="text-azul transition-transform group-hover:translate-x-1" />
                    </span>
                    <span className="block text-[13px] text-muted">{desc}</span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </section>
      </div>

      {/* Acesso rápido aos prontuários */}
      <section className="surge" style={{ '--i': 3 }} aria-labelledby="recentes-titulo">
        <div className="mb-3 flex items-center justify-between gap-2">
          <h2 id="recentes-titulo" className="font-serif text-[22px] font-semibold text-azul-petroleo">
            Acesso rápido aos prontuários
          </h2>
          <button
            type="button"
            onClick={() => onNavigate('pacientes')}
            className="inline-flex cursor-pointer items-center gap-1 text-[14px] font-bold text-azul underline decoration-azul/30 underline-offset-4 hover:decoration-azul"
          >
            Ver todos
          </button>
        </div>
        {loading ? (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {[0, 1, 2, 3, 4].map((i) => (
              <Esqueleto key={i} className="h-28" />
            ))}
          </div>
        ) : recent.length === 0 ? (
          <p className="rounded-[20px] rounded-bl-[5px] bg-surface p-5 text-[14.5px] text-muted ring-1 ring-line">
            Nenhum paciente cadastrado.
          </p>
        ) : (
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {recent.map((patient) => {
              const age = calculateAge(patient.dateOfBirth);
              return (
                <li key={patient.id}>
                  <a
                    href={`#/profissional/prontuario/${patient.id}`}
                    className="group flex h-full flex-col gap-3 rounded-[20px] rounded-bl-[5px] bg-surface p-4 ring-1 ring-line transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_18px_34px_-24px_rgba(19,48,74,0.7)] hover:ring-azul/40"
                  >
                    <span className="flex items-center justify-between">
                      <Avatar nome={patient.name} className="size-11 text-[15px]" />
                      <ArrowUpRight size={18} aria-hidden="true" className="text-muted transition group-hover:text-azul" />
                    </span>
                    <span>
                      <span className="block truncate text-[15px] font-bold text-ink">{patient.name}</span>
                      <span className="text-[13px] text-muted">{age !== null && `${age} anos`}</span>
                    </span>
                    <span className="self-start">
                      <SeloStatus status={patient.patientStatus} />
                    </span>
                  </a>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}
