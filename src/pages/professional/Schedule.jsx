import { buttonClass } from '../../components/buttonStyles';
import { useState, useEffect } from 'react';
import {
  CalendarPlus,
  CheckCircle,
  FileText,
  Video,
  MapPin,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  X,
  Stethoscope,
} from 'lucide-react';
import { listPatients } from '../../services/patientService';
import { Tartaruga } from '../../components/Personagens';

const today = new Date();
const todayIso = [today.getFullYear(), String(today.getMonth() + 1).padStart(2, '0'), String(today.getDate()).padStart(2, '0')].join('-');
const todayLabel = today.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

const initialAppointments = [];

export default function Schedule({ onNavigate, onSelectPatient }) {
  const [view, setView] = useState('Hoje'); // 'Hoje' | 'Semana' | 'Lista'
  const [appointments, setAppointments] = useState(initialAppointments);
  const [patients, setPatients] = useState([]);
  const [feedback, setFeedback] = useState(null);

  // Modais
  const [showNewModal, setShowNewModal] = useState(false);
  const [sessionModalAppt, setSessionModalAppt] = useState(null);

  // Formulário de Nova Sessão (Realizar Atendimento)
  const [sessionForm, setSessionForm] = useState({
    evolucao: '',
    ponto_melhora: '',
    tags: 'Fluência, Linguagem',
  });

  // Formulário de Novo Agendamento
  const [newAgendamento, setNewAgendamento] = useState({
    patientName: '',
    patientId: '',
    date: todayIso,
    time: '11:00',
    duration: 45,
    therapyType: 'Terapia de Linguagem',
    modality: 'Presencial',
  });

  useEffect(() => {
    listPatients()
      .then((data) => {
        setPatients(data);
        if (data.length > 0) {
          setNewAgendamento((prev) => ({
            ...prev,
            patientName: data[0].name,
            patientId: data[0].id,
          }));
        }
      })
      .catch(() => {});
  }, []);

  const showNotification = (msg) => {
    setFeedback(msg);
    setTimeout(() => setFeedback(null), 5000);
  };

  // Abrir Modal de Realizar Atendimento (Agendamento -> Sessão)
  const handleOpenPerformSession = (appt) => {
    setSessionModalAppt(appt);
    setSessionForm({
      evolucao: `Atendimento fonoaudiológico focado em ${appt.therapyType.toLowerCase()}. Paciente colaborativo(a) durante as atividades propostas.`,
      ponto_melhora: 'Dar continuidade aos exercícios propostos para fixação em ambiente doméstico.',
      tags: appt.therapyType.includes('Fluência')
        ? 'Fluência, Velocidade da Fala'
        : appt.therapyType.includes('Disfagia')
        ? 'Deglutição, Motricidade'
        : 'Linguagem, Articulação',
    });
  };

  // Concluir Atendimento (Transforma Agendamento em Sessão Concluída)
  const handleCompleteSession = (e) => {
    e.preventDefault();
    if (!sessionModalAppt) return;

    const updated = appointments.map((appt) => {
      if (appt.id === sessionModalAppt.id) {
        return {
          ...appt,
          status: 'Realizada',
          sessionDone: {
            evolucao: sessionForm.evolucao,
            ponto_melhora: sessionForm.ponto_melhora,
            dataRegistro: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
            tags: sessionForm.tags.split(',').map((t) => t.trim()).filter(Boolean),
          },
        };
      }
      return appt;
    });

    setAppointments(updated);
    showNotification(
      `Atendimento de ${sessionModalAppt.patientName} concluído com sucesso! Sessão registrada no prontuário.`
    );
    setSessionModalAppt(null);
  };

  // Criar Novo Agendamento
  const handleCreateAgendamento = (e) => {
    e.preventDefault();
    if (!newAgendamento.patientName.trim()) return;

    const newAppt = {
      id: `ag-${Date.now()}`,
      patientId: newAgendamento.patientId || `p-${Date.now()}`,
      patientName: newAgendamento.patientName,
      patientAge: 8,
      date: newAgendamento.date,
      time: newAgendamento.time,
      duration: Number(newAgendamento.duration) || 45,
      therapyType: newAgendamento.therapyType,
      modality: newAgendamento.modality,
      status: 'Confirmada',
      sessionDone: null,
    };

    setAppointments([newAppt, ...appointments]);
    setShowNewModal(false);
    showNotification(`Agendamento de ${newAgendamento.patientName} marcado para às ${newAgendamento.time}!`);
  };

  // Navegar direto para o Prontuário do Paciente
  const handleGoToProntuario = (appt) => {
    if (onSelectPatient) {
      onSelectPatient({ id: appt.patientId, name: appt.patientName });
    }
    if (onNavigate) {
      onNavigate('prontuario');
    } else {
      window.location.assign('#/profissional/prontuario');
    }
  };

  const todayAppts = appointments.filter((a) => a.date === todayIso);

  return (
    <div className="space-y-6 font-sans">
      {/* ---------------------------------------------------------------- */}
      {/* CABEÇALHO DA AGENDA COM UI/UX ELEVADA                            */}
      {/* ---------------------------------------------------------------- */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-line pb-4">
        <div>
          <h1 className="display text-[38px] text-azul-petroleo sm:text-[46px]">Agenda de Atendimentos</h1>
          <p className="text-[13.5px] text-muted mt-1">
            Organize suas sessões, realize atendimentos clínicos e alimente automaticamente o prontuário.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Seletor de Visão */}
          <div className="flex items-center bg-gelo p-1 rounded-[12px] text-[13.5px] font-bold text-muted">
            {['Hoje', 'Semana', 'Lista'].map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => setView(v)}
                className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                  view === v ? 'bg-surface text-azul shadow-2xs' : 'hover:text-ink'
                }`}
              >
                {v}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setShowNewModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2.5 bg-azul-petroleo hover:bg-azul text-on-azul rounded-[12px] text-[13.5px] font-bold shadow-xs transition cursor-pointer"
          >
            <CalendarPlus size={15} /> Novo Agendamento
          </button>
        </div>
      </div>

      {/* FEEDBACK BANNER */}
      {feedback && (
        <div className="flex items-center gap-2 p-3.5 bg-success/10 border border-success/30 text-success rounded-[12px] text-[13.5px] font-semibold shadow-2xs animate-fade-in">
          <CheckCircle2 size={16} className="text-success shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      {/* ---------------------------------------------------------------- */}
      {/* NAVEGAÇÃO DE DIAS (BARRA CRONOLÓGICA)                             */}
      {/* ---------------------------------------------------------------- */}
      <div className="flex items-center justify-between bg-surface border border-line p-3.5 rounded-[22px] rounded-bl-[6px] shadow-xs">
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="p-1.5 text-muted hover:text-ink hover:bg-gelo rounded-lg transition cursor-pointer"
          >
            <ChevronLeft size={16} />
          </button>
          <span className="text-[13.5px] font-bold font-serif text-ink">
            <span className="first-letter:uppercase inline-block">{todayLabel}</span>
          </span>
          <span className="px-2 py-0.5 rounded-md text-[12px] font-bold bg-gelo text-azul">Hoje</span>
          <button
            type="button"
            className="p-1.5 text-muted hover:text-ink hover:bg-gelo rounded-lg transition cursor-pointer"
          >
            <ChevronRight size={16} />
          </button>
        </div>

        <div className="flex items-center gap-3 text-[13.5px] text-muted">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-success" /> Confirmada
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-azul-petroleo" /> Realizada
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-400" /> Agendada
          </span>
        </div>
      </div>

      {/* ================================================================ */}
      {/* VISÃO: HOJE (CARDS DETALHADOS COM ATENDIMENTO DIRETO)            */}
      {/* ================================================================ */}
      {view === 'Hoje' && (
        <div className="space-y-3.5">
          {todayAppts.length === 0 && (
            <div className="flex flex-col items-center gap-3 rounded-[24px] rounded-bl-[7px] bg-surface px-6 py-10 text-center ring-1 ring-line">
              <Tartaruga className="w-32" andando={false} />
              <p className="font-serif text-[22px] font-semibold text-azul-petroleo">Nenhum atendimento para hoje</p>
              <p className="max-w-[42ch] text-[14.5px] text-muted">
                Use “Novo agendamento” para marcar uma sessão. Ao realizar o atendimento, a evolução vai direto para o prontuário.
              </p>
              <button type="button" onClick={() => setShowNewModal(true)} className={`${buttonClass('azul')} mt-1`}>
                <CalendarPlus size={16} aria-hidden="true" /> Novo agendamento
              </button>
            </div>
          )}
          {todayAppts.map((appt) => {
            const isRealizada = appt.status === 'Realizada';
            return (
              <div
                key={appt.id}
                className={`bg-surface rounded-[22px] rounded-bl-[6px] border p-4.5 shadow-xs transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                  isRealizada ? 'border-success/30 bg-success/10' : 'border-line hover:border-azul/20'
                }`}
              >
                {/* Lado Esquerdo: Horário e Dados do Paciente */}
                <div className="flex items-start md:items-center gap-4">
                  {/* Badge de Horário */}
                  <div className="w-20 shrink-0 text-center py-2 px-1 bg-canvas border border-line rounded-[12px]">
                    <span className="block text-sm font-bold text-ink font-serif">{appt.time}</span>
                    <span className="text-[12px] text-muted">{appt.duration} min</span>
                  </div>

                  {/* Avatar Circular com Iniciais */}
                  <div className="w-10 h-10 rounded-full bg-gelo text-azul font-bold text-[13.5px] flex items-center justify-center shrink-0 border border-azul/20">
                    {appt.patientName.slice(0, 2).toUpperCase()}
                  </div>

                  {/* Detalhes do Atendimento */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-ink hover:text-azul cursor-pointer" onClick={() => handleGoToProntuario(appt)}>
                        {appt.patientName}
                      </h3>
                      <span className="text-[13.5px] text-muted">· {appt.patientAge} anos</span>
                      <span
                        className={`px-2 py-0.5 rounded-md text-[12px] font-bold ${
                          isRealizada
                            ? 'bg-success/10 text-success'
                            : appt.status === 'Confirmada'
                            ? 'bg-gelo text-azul'
                            : 'bg-gelo text-ink'
                        }`}
                      >
                        {appt.status}
                      </span>
                    </div>

                    <p className="text-[13.5px] text-muted flex items-center gap-2">
                      <span>{appt.therapyType}</span>
                      <span className="text-muted">•</span>
                      <span className="flex items-center gap-1 text-[12.5px] text-muted">
                        {appt.modality === 'Presencial' ? <MapPin size={11} /> : <Video size={11} />}
                        {appt.modality}
                      </span>
                    </p>

                    {/* Se já realizada, exibe prévia da evolução gravada */}
                    {isRealizada && appt.sessionDone && (
                      <div className="mt-2 text-[12.5px] text-success bg-success/10 p-2 rounded-lg border border-emerald-100">
                        <strong>Evolução registrada:</strong> {appt.sessionDone.evolucao}
                      </div>
                    )}
                  </div>
                </div>

                {/* Lado Direito: Ações Clínicas */}
                <div className="flex items-center gap-2 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-line">
                  {isRealizada ? (
                    <button
                      type="button"
                      onClick={() => handleGoToProntuario(appt)}
                      className="px-3.5 py-2 bg-success hover:bg-success text-white rounded-[12px] text-[13.5px] font-bold shadow-2xs flex items-center gap-1.5 transition cursor-pointer"
                    >
                      <CheckCircle size={14} /> Ver no Prontuário
                    </button>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={() => handleOpenPerformSession(appt)}
                        className="px-3.5 py-2 bg-azul-petroleo hover:bg-azul text-on-azul rounded-[12px] text-[13.5px] font-bold shadow-xs flex items-center gap-1.5 transition cursor-pointer"
                      >
                        <Stethoscope size={14} /> Realizar Atendimento
                      </button>
                      <button
                        type="button"
                        onClick={() => handleGoToProntuario(appt)}
                        className="px-3 py-2 bg-surface border border-line hover:bg-canvas text-ink rounded-[12px] text-[13.5px] font-bold transition flex items-center gap-1 cursor-pointer"
                        title="Ver prontuário do paciente"
                      >
                        <FileText size={13} className="text-azul" /> Prontuário
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ================================================================ */}
      {/* VISÃO: SEMANA (COLUNAS DE DIAS)                                  */}
      {/* ================================================================ */}
      {view === 'Semana' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 items-start">
          {[
            { day: 'Seg 17', label: 'Segunda', count: 0 },
            { day: 'Ter 18', label: 'Terça', count: 1 },
            { day: 'Qua 19', label: 'Quarta (Hoje)', count: todayAppts.length, isToday: true },
            { day: 'Qui 20', label: 'Quinta', count: 2 },
            { day: 'Sex 21', label: 'Sexta', count: 0 },
          ].map((col) => (
            <div
              key={col.day}
              className={`bg-surface rounded-[22px] rounded-bl-[6px] border p-4 shadow-xs space-y-3 min-h-80 ${
                col.isToday ? 'border-azul ring-1 ring-azul/30' : 'border-line'
              }`}
            >
              <div className="flex items-center justify-between pb-2 border-b border-line">
                <span className="text-[13.5px] font-bold font-serif text-ink">{col.label}</span>
                <span className="text-[12px] font-bold px-1.5 py-0.5 rounded bg-gelo text-muted">
                  {col.day}
                </span>
              </div>

              {col.isToday ? (
                <div className="space-y-2">
                  {todayAppts.map((appt) => (
                    <div
                      key={appt.id}
                      onClick={() => handleOpenPerformSession(appt)}
                      className="p-2.5 rounded-[12px] border border-line bg-canvas hover:bg-gelo hover:border-azul/20 transition-all cursor-pointer text-[13.5px] space-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-ink">{appt.time}</span>
                        <span
                          className={`text-[9px] font-bold px-1 rounded ${
                            appt.status === 'Realizada' ? 'bg-success/10 text-success' : 'bg-gelo text-azul'
                          }`}
                        >
                          {appt.status}
                        </span>
                      </div>
                      <p className="font-semibold text-ink truncate">{appt.patientName}</p>
                      <p className="text-[12px] text-muted truncate">{appt.therapyType}</p>
                    </div>
                  ))}
                </div>
              ) : col.day === 'Qui 20' ? (
                <div className="space-y-2">
                  <div className="p-2.5 rounded-[12px] border border-line bg-canvas text-[13.5px] space-y-1">
                    <span className="font-bold text-ink">09:30</span>
                    <p className="font-semibold text-ink">Valentina Souza</p>
                    <p className="text-[12px] text-muted">Desenvolvimento Linguístico</p>
                  </div>
                  <div className="p-2.5 rounded-[12px] border border-line bg-canvas text-[13.5px] space-y-1">
                    <span className="font-bold text-ink">14:00</span>
                    <p className="font-semibold text-ink">Lucas Gabriel Lima</p>
                    <p className="text-[12px] text-muted">Consciência Fonológica</p>
                  </div>
                </div>
              ) : (
                <p className="text-[13.5px] text-muted italic text-center py-8">Nenhum atendimento</p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* ================================================================ */}
      {/* VISÃO: LISTA GERAL                                               */}
      {/* ================================================================ */}
      {view === 'Lista' && (
        <div className="rounded-[24px] rounded-bl-[7px] bg-surface p-5 ring-1 ring-line">
          <table className="w-full text-left text-[13.5px]">
            <thead>
              <tr className="border-b border-line text-[12.5px] font-semibold text-muted">
                <th className="py-2.5 px-3">Data & Horário</th>
                <th className="py-2.5 px-3">Paciente</th>
                <th className="py-2.5 px-3">Terapia</th>
                <th className="py-2.5 px-3">Modalidade</th>
                <th className="py-2.5 px-3">Situação</th>
                <th className="py-2.5 px-3 text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {appointments.map((appt) => (
                <tr key={appt.id} className="hover:bg-canvas transition-colors">
                  <td className="py-3 px-3 font-bold text-ink">
                    {appt.date} às {appt.time}
                  </td>
                  <td className="py-3 px-3 font-semibold text-ink">{appt.patientName}</td>
                  <td className="py-3 px-3 text-muted">{appt.therapyType}</td>
                  <td className="py-3 px-3 text-muted">{appt.modality}</td>
                  <td className="py-3 px-3">
                    <span
                      className={`px-2 py-0.5 rounded-md text-[12px] font-bold ${
                        appt.status === 'Realizada'
                          ? 'bg-success/10 text-success'
                          : 'bg-gelo text-azul'
                      }`}
                    >
                      {appt.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <button
                      type="button"
                      onClick={() => handleGoToProntuario(appt)}
                      className="text-azul hover:underline font-bold text-[13.5px] cursor-pointer"
                    >
                      Prontuário
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ================================================================ */}
      {/* MODAL: REALIZAR ATENDIMENTO (AGENDAMENTO -> SESSÃO CLÍNICA)      */}
      {/* ================================================================ */}
      {sessionModalAppt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-2xs p-4">
          <div className="bg-surface rounded-[22px] rounded-bl-[6px] border border-line w-full max-w-xl p-6 shadow-xl space-y-5 animate-scale-in">
            <div className="flex items-center justify-between border-b border-line pb-3">
              <div>
                <h3 className="text-base font-bold font-serif text-ink flex items-center gap-2">
                  <Stethoscope size={18} className="text-azul" /> Realizar Atendimento & Registrar Sessão
                </h3>
                <p className="text-[13.5px] text-muted mt-0.5">
                  Paciente: <strong className="text-ink">{sessionModalAppt.patientName}</strong> · Horário:{' '}
                  {sessionModalAppt.time} ({sessionModalAppt.duration} min)
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSessionModalAppt(null)}
                className="p-1 text-muted hover:text-ink rounded-lg cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCompleteSession} className="space-y-4 text-[13.5px]">
              <div>
                <label className="text-ink font-bold block mb-1">
                  Evolução Clínica do Atendimento (Tabela: sessao.evolucao) *
                </label>
                <textarea
                  required
                  rows={4}
                  value={sessionForm.evolucao}
                  onChange={(e) => setSessionForm({ ...sessionForm, evolucao: e.target.value })}
                  placeholder="Descreva o que foi trabalhado, adesão do paciente e progresso..."
                  className="w-full p-2.5 bg-canvas border border-line rounded-[12px] text-ink focus:outline-none focus:ring-2 focus:ring-azul/20"
                />
              </div>

              <div>
                <label className="text-ink font-bold block mb-1">
                  Pontos de Melhora / Orientações Domiciliares (Tabela: sessao.ponto_melhora)
                </label>
                <textarea
                  rows={2}
                  value={sessionForm.ponto_melhora}
                  onChange={(e) => setSessionForm({ ...sessionForm, ponto_melhora: e.target.value })}
                  placeholder="Orientações para os pais ou foco da próxima sessão..."
                  className="w-full p-2.5 bg-canvas border border-line rounded-[12px] text-ink focus:outline-none focus:ring-2 focus:ring-azul/20"
                />
              </div>

              <div>
                <label className="text-ink font-bold block mb-1">Tags e Parâmetros Clínicos</label>
                <input
                  type="text"
                  value={sessionForm.tags}
                  onChange={(e) => setSessionForm({ ...sessionForm, tags: e.target.value })}
                  placeholder="Ex: Fluência, Respiração, Leitura"
                  className="w-full p-2.5 bg-canvas border border-line rounded-[12px] text-ink focus:outline-none focus:ring-2 focus:ring-azul/20"
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-3 border-t border-line">
                <button
                  type="button"
                  onClick={() => setSessionModalAppt(null)}
                  className="px-4 py-2 border border-line hover:bg-canvas text-ink rounded-[12px] font-bold cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-success hover:bg-success text-white rounded-[12px] font-bold shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <CheckCircle size={14} /> Concluir Atendimento e Salvar no Prontuário
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================================================================ */}
      {/* MODAL: NOVO AGENDAMENTO                                          */}
      {/* ================================================================ */}
      {showNewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-2xs p-4">
          <div className="bg-surface rounded-[22px] rounded-bl-[6px] border border-line w-full max-w-md p-6 shadow-xl space-y-5 animate-scale-in">
            <div className="flex items-center justify-between border-b border-line pb-3">
              <h3 className="text-base font-bold font-serif text-ink flex items-center gap-2">
                <CalendarPlus size={18} className="text-azul" /> Novo Agendamento de Consulta
              </h3>
              <button
                type="button"
                onClick={() => setShowNewModal(false)}
                className="p-1 text-muted hover:text-ink rounded-lg cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateAgendamento} className="space-y-3.5 text-[13.5px]">
              <div>
                <label className="text-ink font-bold block mb-1">Paciente *</label>
                {patients.length > 0 ? (
                  <select
                    value={newAgendamento.patientId}
                    onChange={(e) => {
                      const selected = patients.find((p) => p.id === e.target.value);
                      setNewAgendamento({
                        ...newAgendamento,
                        patientId: e.target.value,
                        patientName: selected ? selected.name : '',
                      });
                    }}
                    className="w-full p-2.5 bg-canvas border border-line rounded-[12px] text-ink focus:outline-none focus:ring-2 focus:ring-azul/20"
                  >
                    {patients.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    required
                    placeholder="Nome completo do paciente"
                    value={newAgendamento.patientName}
                    onChange={(e) => setNewAgendamento({ ...newAgendamento, patientName: e.target.value })}
                    className="w-full p-2.5 bg-canvas border border-line rounded-[12px] text-ink focus:outline-none focus:ring-2 focus:ring-azul/20"
                  />
                )}
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="text-ink font-bold block mb-1">Data *</label>
                  <input
                    type="date"
                    required
                    value={newAgendamento.date}
                    onChange={(e) => setNewAgendamento({ ...newAgendamento, date: e.target.value })}
                    className="w-full p-2.5 bg-canvas border border-line rounded-[12px] text-ink focus:outline-none focus:ring-2 focus:ring-azul/20"
                  />
                </div>
                <div>
                  <label className="text-ink font-bold block mb-1">Horário *</label>
                  <input
                    type="time"
                    required
                    value={newAgendamento.time}
                    onChange={(e) => setNewAgendamento({ ...newAgendamento, time: e.target.value })}
                    className="w-full p-2.5 bg-canvas border border-line rounded-[12px] text-ink focus:outline-none focus:ring-2 focus:ring-azul/20"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="text-ink font-bold block mb-1">Duração</label>
                  <select
                    value={newAgendamento.duration}
                    onChange={(e) => setNewAgendamento({ ...newAgendamento, duration: Number(e.target.value) })}
                    className="w-full p-2.5 bg-canvas border border-line rounded-[12px] text-ink focus:outline-none focus:ring-2 focus:ring-azul/20"
                  >
                    <option value={30}>30 minutos</option>
                    <option value={45}>45 minutos</option>
                    <option value={50}>50 minutos</option>
                    <option value={60}>60 minutos (1h)</option>
                  </select>
                </div>
                <div>
                  <label className="text-ink font-bold block mb-1">Modalidade</label>
                  <select
                    value={newAgendamento.modality}
                    onChange={(e) => setNewAgendamento({ ...newAgendamento, modality: e.target.value })}
                    className="w-full p-2.5 bg-canvas border border-line rounded-[12px] text-ink focus:outline-none focus:ring-2 focus:ring-azul/20"
                  >
                    <option value="Presencial">Presencial (Clínica)</option>
                    <option value="Teleatendimento">Teleatendimento (Online)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-ink font-bold block mb-1">Tipo de Terapia / Foco</label>
                <input
                  type="text"
                  value={newAgendamento.therapyType}
                  onChange={(e) => setNewAgendamento({ ...newAgendamento, therapyType: e.target.value })}
                  placeholder="Ex: Terapia de Linguagem, Fluência, Motricidade..."
                  className="w-full p-2.5 bg-canvas border border-line rounded-[12px] text-ink focus:outline-none focus:ring-2 focus:ring-azul/20"
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-3 border-t border-line">
                <button
                  type="button"
                  onClick={() => setShowNewModal(false)}
                  className="px-4 py-2 border border-line hover:bg-canvas text-ink rounded-[12px] font-bold cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className={`${buttonClass('azul')}`}
                >
                  <CalendarPlus size={14} /> Confirmar Agendamento
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
