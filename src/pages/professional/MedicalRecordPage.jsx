import { useEffect, useState } from 'react';
import {
  AlertCircle,
  Archive,
  CheckCircle,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Clock,
  FileCheck2,
  FileEdit,
  FileText,
  Mic,
  Paperclip,
  Pencil,
  Plus,
  RotateCcw,
  Save,
  Stethoscope,
  Trash2,
  UploadCloud,
  X,
} from 'lucide-react';
import OndaSonora from '../../components/OndaSonora';
import { buttonClass } from '../../components/buttonStyles';
import Avatar from '../../components/area/Avatar';
import { campo } from '../../components/area/campos';
import { Tucano } from '../../components/Personagens';
import { getGuardianById } from '../../services/guardianService';
import { archivePatient, deletePatient, updatePatient } from '../../services/patientService';
import {
  createAnamnesis,
  getAnamnesesByPatient,
  updateAnamnesis,
} from '../../services/anamnesisService';
import {
  createDiagnostic,
  getDiagnosticsByPatient,
  updateDiagnostic,
} from '../../services/diagnosticService';
import {
  createEvaluation,
  getEvaluationsByPatient,
} from '../../services/evaluationService';
import {
  getAttachmentDownloadUrl,
  getAttachmentsByPatient,
  uploadAttachment,
} from '../../services/attachmentService';
import { calculateAge, formatBytes, formatDateBR, formatPhone } from '../../utils/formatters';

// Campos clínicos: leitura confortável quando bloqueados, foco azul na edição.
const campoClinico = `${campo} leading-relaxed disabled:cursor-default disabled:border-transparent disabled:bg-canvas disabled:text-ink`;

export default function MedicalRecordPage({
  patients = [],
  selectedPatientId,
  onSelectPatient,
  onNavigate,
}) {
  // Paciente Ativo
  const activePatientId = selectedPatientId || patients[0]?.id || null;

  // Tab ativa: 'historico' | 'avaliacoes' | 'diagnostico' | 'anamnese' | 'anexos'
  const [activeTab, setActiveTab] = useState('historico');

  // Paciente atual selecionado
  const patient = patients.find((p) => p.id === activePatientId) || patients[0] || null;

  // Responsável (carregado via API)
  const [guardian, setGuardian] = useState(null);

  // Anamnese
  const [anamneses, setAnamneses] = useState([]);
  const [loadingAnamnese, setLoadingAnamnese] = useState(true);
  const [isEditingAnamnese, setIsEditingAnamnese] = useState(false);
  const [anamneseForm, setAnamneseForm] = useState({
    mainComplaint: '',
    familyHistory: '',
    symptomOnset: '',
    languageDevelopment: '',
    additionalObservations: '',
  });

  // Diagnóstico
  const [diagnostics, setDiagnostics] = useState([]);
  const [loadingDiag, setLoadingDiag] = useState(true);
  const [isEditingDiag, setIsEditingDiag] = useState(false);
  const [diagForm, setDiagForm] = useState({
    speechDiagnosis: '',
    cid10: '',
    therapeuticArea: 'Linguagem',
    sessionFrequency: '2x por semana · 50 min',
    treatmentGoal: '',
    treatmentPlan: '',
  });

  // Avaliações
  const [evaluations, setEvaluations] = useState([]);
  const [loadingEval, setLoadingEval] = useState(true);
  const [showNewEvalModal, setShowNewEvalModal] = useState(false);
  const [viewEvalDetail, setViewEvalDetail] = useState(null);
  const [evalForm, setEvalForm] = useState({
    tipoAvaliacao: 'Avaliação de Fluência',
    dataAvaliacao: new Date().toISOString().split('T')[0],
    resultados: '',
    condutasPropostas: '',
    concluido: true,
  });

  // Anexos
  const [attachments, setAttachments] = useState([]);
  const [loadingAtt, setLoadingAtt] = useState(true);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadDesc, setUploadDesc] = useState('');
  const [uploading, setUploading] = useState(false);

  // Histórico de Sessões / Evoluções Clínicas
  const getStoredSessions = (patientId) => {
    if (!patientId) return [];
    try {
      const raw = localStorage.getItem(`fonosync:sessions:${patientId}`);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  };

  const saveStoredSessions = (patientId, list) => {
    if (!patientId) return;
    try {
      localStorage.setItem(`fonosync:sessions:${patientId}`, JSON.stringify(list));
    } catch (e) {
      console.error('Erro ao salvar sessões no storage:', e);
    }
  };

  const [sessions, setSessions] = useState([]);
  const [showNewSessionModal, setShowNewSessionModal] = useState(false);
  const [sessionForm, setSessionForm] = useState({
    sessionNumber: 1,
    date: new Date().toISOString().split('T')[0],
    evolution: '',
    improvementPoint: '',
    tags: '',
  });

  // Feedback notice
  const [notice, setNotice] = useState(null);
  const [savingAction, setSavingAction] = useState(false);

  const showFeedback = (tone, message) => {
    setNotice({ tone, message });
    setTimeout(() => setNotice(null), 4000);
  };

  // Carrega os dados quando o paciente ativo muda
  useEffect(() => {
    if (!patient) return;

    // 0. Carrega Sessões do paciente (persistência local enquanto módulo de agenda/sessão é concluído no backend)
    const storedSessions = getStoredSessions(patient.id);
    setSessions(storedSessions);
    setSessionForm((prev) => ({
      ...prev,
      sessionNumber: storedSessions.length + 1,
    }));

    // 1. Carrega dados do Responsável se menor ou se tiver guardianId
    if (patient.guardianId) {
      getGuardianById(patient.guardianId)
        .then((data) => setGuardian(data))
        .catch(() => setGuardian(null));
    }

    // 2. Carrega Anamneses
    getAnamnesesByPatient(patient.id)
      .then((data) => {
        const list = Array.isArray(data) ? data : [];
        setAnamneses(list);
        if (list.length > 0) {
          setAnamneseForm({
            mainComplaint: list[0].mainComplaint || '',
            familyHistory: list[0].familyHistory || '',
            symptomOnset: list[0].symptomOnset || '',
            languageDevelopment: list[0].languageDevelopment || '',
            additionalObservations: list[0].additionalObservations || '',
          });
        } else {
          setAnamneseForm({
            mainComplaint: '',
            familyHistory: '',
            symptomOnset: '',
            languageDevelopment: '',
            additionalObservations: '',
          });
        }
      })
      .catch(() => setAnamneses([]))
      .finally(() => setLoadingAnamnese(false));

    // 3. Carrega Diagnóstico
    getDiagnosticsByPatient(patient.id)
      .then((data) => {
        const list = Array.isArray(data) ? data : [];
        setDiagnostics(list);
        if (list.length > 0) {
          setDiagForm({
            speechDiagnosis: list[0].speechDiagnosis || '',
            cid10: list[0].cid10 || patient.cid10 || '',
            therapeuticArea: list[0].therapeuticArea || '',
            sessionFrequency: list[0].sessionFrequency || '',
            treatmentGoal: list[0].treatmentGoal || '',
            treatmentPlan: list[0].treatmentPlan || '',
          });
        } else {
          setDiagForm({
            speechDiagnosis: '',
            cid10: patient.cid10 || '',
            therapeuticArea: '',
            sessionFrequency: '',
            treatmentGoal: '',
            treatmentPlan: '',
          });
        }
      })
      .catch(() => setDiagnostics([]))
      .finally(() => setLoadingDiag(false));

    // 4. Carrega Avaliações
    getEvaluationsByPatient(patient.id)
      .then((data) => {
        const list = Array.isArray(data) ? data : [];
        setEvaluations(list);
      })
      .catch(() => setEvaluations([]))
      .finally(() => setLoadingEval(false));

    // 5. Carrega Anexos
    getAttachmentsByPatient(patient.id)
      .then((data) => {
        const list = Array.isArray(data) ? data : [];
        setAttachments(list);
      })
      .catch(() => setAttachments([]))
      .finally(() => setLoadingAtt(false));
  }, [patient]);

  if (!patient) {
    return (
      <div className="p-8 text-center bg-surface rounded-[22px] rounded-bl-[6px] border border-line">
        <p className="text-sm font-bold text-ink">Nenhum paciente selecionado.</p>
      </div>
    );
  }

  const age = calculateAge(patient.dateOfBirth);
  const isMinor = age !== null && age < 18;
  const sessionsCount = sessions.length;
  const totalAttachmentBytes = attachments.reduce((acc, att) => acc + (att.fileSize || 0), 0);

  // Manipuladores de Ações
  const handlePatientSelectChange = (e) => {
    const newId = e.target.value;
    window.location.hash = `#/profissional/prontuario/${newId}`;
    if (onSelectPatient) {
      const p = patients.find((item) => item.id === newId);
      if (p) onSelectPatient(p);
    }
  };

  // Salvar Diagnóstico
  const handleSaveDiagnostic = async (e) => {
    e.preventDefault();
    setSavingAction(true);
    try {
      if (diagnostics.length > 0 && diagnostics[0].id) {
        await updateDiagnostic(diagnostics[0].id, diagForm);
      } else {
        await createDiagnostic(patient.id, diagForm);
      }
      showFeedback('success', 'Diagnóstico fonoaudiológico salvo com sucesso!');
      setIsEditingDiag(false);
    } catch (err) {
      showFeedback('danger', err.message || 'Erro ao salvar diagnóstico.');
    } finally {
      setSavingAction(false);
    }
  };

  // Salvar Anamnese
  const handleSaveAnamnese = async (e) => {
    e.preventDefault();
    setSavingAction(true);
    try {
      if (anamneses.length > 0 && anamneses[0].id) {
        await updateAnamnesis(anamneses[0].id, anamneseForm);
      } else {
        await createAnamnesis(patient.id, anamneseForm);
      }
      showFeedback('success', 'Anamnese atualizada com sucesso no prontuário!');
      setIsEditingAnamnese(false);
    } catch (err) {
      showFeedback('danger', err.message || 'Erro ao salvar anamnese.');
    } finally {
      setSavingAction(false);
    }
  };

  // Criar Nova Avaliação
  const handleSaveNewEvaluation = async (e) => {
    e.preventDefault();
    if (!evalForm.resultados.trim()) {
      showFeedback('danger', 'Informe os resultados observados.');
      return;
    }
    setSavingAction(true);
    try {
      const created = await createEvaluation(patient.id, evalForm);
      setEvaluations([created, ...evaluations]);
      showFeedback('success', 'Nova avaliação adicionada com sucesso!');
      setShowNewEvalModal(false);
      setEvalForm({
        tipoAvaliacao: 'Avaliação de Fluência',
        dataAvaliacao: new Date().toISOString().split('T')[0],
        resultados: '',
        condutasPropostas: '',
        concluido: true,
      });
    } catch (err) {
      showFeedback('danger', err.message || 'Erro ao salvar avaliação.');
    } finally {
      setSavingAction(false);
    }
  };

  // Upload de Anexo
  const handleUploadAttachmentSubmit = async (e) => {
    e.preventDefault();
    if (!uploadFile) {
      showFeedback('danger', 'Selecione um arquivo.');
      return;
    }
    setUploading(true);
    try {
      const saved = await uploadAttachment(patient.id, uploadFile, uploadDesc);
      setAttachments([saved, ...attachments]);
      showFeedback('success', 'Arquivo anexado com sucesso ao prontuário!');
      setShowUploadModal(false);
      setUploadFile(null);
      setUploadDesc('');
    } catch (err) {
      showFeedback('danger', err.message || 'Erro ao enviar o arquivo.');
    } finally {
      setUploading(false);
    }
  };

  // Nova Sessão no Histórico
  const handleSaveNewSession = (e) => {
    e.preventDefault();
    if (!sessionForm.evolution.trim()) {
      showFeedback('danger', 'Descreva a evolução da sessão.');
      return;
    }
    const tagArray = sessionForm.tags
      ? sessionForm.tags.split(',').map((t) => t.trim()).filter(Boolean)
      : ['Sessão Clínica'];

    const sessNum = Number(sessionForm.sessionNumber) || sessions.length + 1;
    const existingIndex = sessions.findIndex((s) => s.sessionNumber === sessNum);

    let nextSessions;
    if (existingIndex >= 0) {
      const updated = [...sessions];
      updated[existingIndex] = {
        ...updated[existingIndex],
        date: sessionForm.date,
        status: 'Realizada',
        evolution: sessionForm.evolution,
        improvementPoint: sessionForm.improvementPoint,
        tags: tagArray,
      };
      nextSessions = updated;
    } else {
      const newSess = {
        id: `sess-${Date.now()}`,
        date: sessionForm.date,
        sessionNumber: sessNum,
        status: 'Realizada',
        evolution: sessionForm.evolution,
        improvementPoint: sessionForm.improvementPoint,
        tags: tagArray,
      };
      nextSessions = [newSess, ...sessions];
    }

    setSessions(nextSessions);
    saveStoredSessions(patient.id, nextSessions);

    showFeedback('success', `Sessão ${sessNum} registrada como realizada com sucesso!`);
    setShowNewSessionModal(false);
    setSessionForm({
      sessionNumber: nextSessions.length + 1,
      date: new Date().toISOString().split('T')[0],
      evolution: '',
      improvementPoint: '',
      tags: '',
    });
  };

  const isArchived = patient?.patientStatus === 'ARQUIVADO';

  const handleToggleArchive = async () => {
    try {
      if (isArchived) {
        const { id, name, dateOfBirth, cpfPatient, contactPatient, sex, cid10, guardianId } = patient;
        await updatePatient(id, { name, dateOfBirth, cpfPatient, contactPatient, sex, cid10, guardianId, patientStatus: 'ATIVO' });
        patient.patientStatus = 'ATIVO';
        showFeedback('success', `${patient.name} foi restaurado para os pacientes ativos.`);
      } else {
        await archivePatient(patient.id);
        patient.patientStatus = 'ARQUIVADO';
        showFeedback('success', `Prontuário de ${patient.name} arquivado com sucesso.`);
      }
    } catch (err) {
      showFeedback('danger', err.message || 'Erro ao alterar status de arquivamento.');
    }
  };

  const handleDeletePatient = async () => {
    if (!window.confirm(`Tem certeza que deseja excluir permanentemente o paciente ${patient.name}? Essa ação não pode ser desfeita.`)) {
      return;
    }
    try {
      await deletePatient(patient.id);
      alert(`Paciente ${patient.name} excluído com sucesso.`);
      if (onNavigate) onNavigate('pacientes');
    } catch (err) {
      showFeedback('danger', err.message || 'Erro ao excluir paciente.');
    }
  };

  const statusInfo = {
    ATIVO: { rotulo: 'Em acompanhamento', ponto: 'bg-salvia' },
    PRE_CADASTRO: { rotulo: 'Pré-cadastro', ponto: 'bg-mel' },
    ARQUIVADO: { rotulo: 'Arquivado', ponto: 'bg-white/50' },
  }[patient.patientStatus] ?? { rotulo: 'Em acompanhamento', ponto: 'bg-salvia' };
  const sexoTexto =
    patient.sex === 'FEMININO' ? 'Feminino' : patient.sex === 'MASCULINO' ? 'Masculino' : 'Sexo não informado';
  const cidAtual = diagForm.cid10 || patient.cid10;
  const objetivo = diagForm.treatmentGoal.split('\n')[0];
  const abas = [
    { id: 'historico', label: 'Histórico', icon: Clock, total: sessionsCount },
    { id: 'avaliacoes', label: 'Avaliações', icon: Stethoscope, total: evaluations.length },
    { id: 'diagnostico', label: 'Diagnóstico', icon: FileCheck2 },
    { id: 'anamnese', label: 'Anamnese', icon: FileText },
    { id: 'anexos', label: 'Anexos', icon: Paperclip, total: attachments.length },
  ];
  const abrirNovaSessao = () => setShowNewSessionModal(true);

  return (
    <div className="space-y-6 font-sans">
      {/* ============================================================== */}
      {/* CAPA: PACIENTE, SITUAÇÃO E AÇÕES DO PRONTUÁRIO                  */}
      {/* ============================================================== */}
      <section className="surge on-dark relative isolate overflow-hidden rounded-[30px] rounded-bl-[8px] bg-azul-profundo text-white">
        <div className="absolute -right-20 -top-28 -z-10 size-80 rounded-full bg-azul/35 blur-3xl" aria-hidden="true" />
        <OndaSonora className="absolute -bottom-2 right-6 -z-10 hidden h-24 w-80 text-white/[0.06] lg:block" />

        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 px-6 py-3 sm:px-8">
          <p className="text-[0.8125rem] font-semibold text-white/65">
            Prontuário · {sessionsCount} sessões registradas
          </p>
          <label className="relative flex items-center gap-2 text-[0.8125rem] font-semibold text-white/70">
            Paciente
            <select
              value={activePatientId}
              onChange={handlePatientSelectChange}
              aria-label="Selecionar Paciente para Prontuário"
              className="min-h-10 cursor-pointer appearance-none rounded-full bg-white/10 py-2 pl-4 pr-9 text-[0.875rem] font-semibold text-white outline-none ring-1 ring-white/20 transition hover:bg-white/15 focus:ring-2 focus:ring-mel [&>option]:text-ink"
            >
              {patients.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} {calculateAge(p.dateOfBirth) !== null ? `(${calculateAge(p.dateOfBirth)} anos)` : ''}
                </option>
              ))}
            </select>
            <ChevronDown size={16} className="pointer-events-none absolute right-3 text-white/70" aria-hidden="true" />
          </label>
        </div>

        <div className="grid items-end gap-6 p-6 sm:p-8 lg:grid-cols-[1fr_auto]">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
            <Avatar nome={patient.name} apagado={isArchived} className="size-20 text-[1.625rem] ring-4 ring-white/10" />
            <div className="min-w-0">
              <h1 className="display text-[2.125rem] sm:text-[2.625rem]">{patient.name}</h1>
              <p className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-[0.90625rem] text-white/80">
                <span>{age !== null ? `${age} anos` : 'Idade não informada'}</span>
                <span aria-hidden="true">·</span>
                <span>{sexoTexto}</span>
                {cidAtual && (
                  <span className="rounded-[8px] bg-white/12 px-2 py-0.5 font-mono text-[0.78125rem] font-semibold text-mel">
                    CID {cidAtual}
                  </span>
                )}
              </p>
              <p className="mt-3 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-[0.8125rem] font-bold">
                <span className={`size-2 rounded-full ${statusInfo.ponto}`} aria-hidden="true" />
                {statusInfo.rotulo}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 lg:justify-end">
            <button type="button" onClick={abrirNovaSessao} className={buttonClass('mel')}>
              <Plus size={17} aria-hidden="true" /> Registrar sessão
            </button>
            <button
              type="button"
              onClick={handleToggleArchive}
              className={buttonClass('claro')}
              title={isArchived ? 'Restaurar paciente para ativos' : 'Arquivar prontuário do paciente'}
            >
              {isArchived ? <RotateCcw size={16} aria-hidden="true" /> : <Archive size={16} aria-hidden="true" />}
              {isArchived ? 'Restaurar' : 'Arquivar'}
            </button>
            <button
              type="button"
              onClick={handleDeletePatient}
              className={`${buttonClass('claro')} hover:border-[#f08a82]! hover:bg-[#f08a82]/20!`}
              title="Excluir paciente permanentemente"
            >
              <Trash2 size={16} aria-hidden="true" /> Excluir
            </button>
          </div>
        </div>
      </section>

      {/* FEEDBACK NOTICE */}
      <div role="status">
        {notice && (
          <div
            className={`auth-troca flex items-center gap-2.5 rounded-[14px] rounded-bl-[4px] px-4 py-3 text-[0.875rem] font-bold ${
              notice.tone === 'success' ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger'
            }`}
          >
            {notice.tone === 'success' ? <CheckCircle2 size={18} aria-hidden="true" /> : <AlertCircle size={18} aria-hidden="true" />}
            <span>{notice.message}</span>
          </div>
        )}
      </div>

      {/* ============================================================== */}
      {/* GRID PRINCIPAL: FICHA (ESQUERDA) + CONTEÚDO CLÍNICO (DIREITA)   */}
      {/* ============================================================== */}
      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[300px_minmax(0,1fr)] xl:grid-cols-[320px_minmax(0,1fr)]">
        <div className="space-y-4 lg:sticky lg:top-6">
          {/* Ficha cadastral */}
          <section className="surge rounded-[24px] rounded-bl-[7px] bg-surface p-5 ring-1 ring-line" style={{ '--i': 1 }}>
            <h2 className="font-serif text-[1.1875rem] font-semibold text-azul-petroleo">Ficha</h2>
            <dl className="mt-3 text-[0.875rem]">
              {[
                ['Nascimento', formatDateBR(patient.dateOfBirth)],
                ['Responsável', guardian?.name || (isMinor ? '' : 'Próprio paciente')],
                ['Telefone', formatPhone(patient.contactPatient || guardian?.phoneNumber)],
                ['Sessões', `${sessionsCount} realizadas`],
              ].map(([rotuloDado, valor]) => (
                <div key={rotuloDado} className="flex items-baseline justify-between gap-3 border-b border-line py-2.5 last:border-0">
                  <dt className="text-muted">{rotuloDado}</dt>
                  <dd className="text-right font-semibold text-ink">{valor || '—'}</dd>
                </div>
              ))}
            </dl>
          </section>

          {/* Objetivo terapêutico */}
          <section className="surge rounded-[24px] rounded-bl-[7px] bg-mel/70 p-5 text-on-pastel" style={{ '--i': 2 }}>
            <h2 className="font-serif text-[1.1875rem] font-semibold">Objetivo terapêutico</h2>
            {objetivo ? (
              <p className="mt-2 text-[0.90625rem] leading-relaxed">{objetivo}</p>
            ) : (
              <p className="mt-2 text-[0.875rem] leading-relaxed opacity-80">Ainda não definido no plano terapêutico.</p>
            )}
          </section>

          {/* Ações do prontuário */}
          <nav aria-label="Ações do prontuário" className="surge overflow-hidden rounded-[24px] rounded-bl-[7px] bg-surface ring-1 ring-line" style={{ '--i': 3 }}>
            {[
              {
                rotuloAcao: 'Editar plano terapêutico',
                icon: FileEdit,
                onClick: () => {
                  setActiveTab('diagnostico');
                  setIsEditingDiag(true);
                },
              },
              {
                rotuloAcao: `Ver exames e anexos (${attachments.length})`,
                icon: Paperclip,
                onClick: () => {
                  setActiveTab('anexos');
                  const el = document.getElementById('prontuario-tabs-anchor');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                },
              },
              {
                rotuloAcao: 'Gerar relatório PDF',
                icon: FileText,
                onClick: () => {
                  if (onNavigate) onNavigate('relatorios');
                },
              },
            ].map(({ rotuloAcao, icon: Icon, onClick }) => (
              <button
                key={rotuloAcao}
                type="button"
                onClick={onClick}
                className="group flex min-h-[52px] w-full cursor-pointer items-center gap-3 border-b border-line px-4 text-left text-[0.90625rem] font-semibold text-ink transition last:border-0 hover:bg-gelo"
              >
                <span className="grid size-8 place-items-center rounded-[10px] bg-gelo text-azul transition group-hover:bg-surface">
                  <Icon size={16} aria-hidden="true" />
                </span>
                <span className="flex-1">{rotuloAcao}</span>
                <ChevronRight size={17} aria-hidden="true" className="text-muted transition group-hover:translate-x-0.5 group-hover:text-azul" />
              </button>
            ))}
          </nav>
        </div>

        {/* ------------------------------------------------------------ */}
        {/* COLUNA DIREITA: ABAS E CONTEÚDOS CLÍNICOS                     */}
        {/* ------------------------------------------------------------ */}
        <div id="prontuario-tabs-anchor" className="min-w-0 space-y-4">
          <div
            role="tablist"
            aria-label="Seções do prontuário"
            className="surge flex gap-1 overflow-x-auto rounded-[18px] rounded-bl-[5px] bg-surface p-1.5 ring-1 ring-line"
            style={{ '--i': 2 }}
          >
            {abas.map(({ id, label, icon: Icon, total }) => {
              const active = activeTab === id;
              return (
                <button
                  key={id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setActiveTab(id)}
                  className={`flex min-h-11 shrink-0 cursor-pointer items-center gap-2 whitespace-nowrap rounded-[13px] rounded-bl-[4px] px-4 text-[0.875rem] font-semibold transition duration-200 ${
                    active ? 'bg-azul-petroleo text-on-azul shadow-[0_10px_20px_-14px_rgba(29,78,104,0.9)]' : 'text-muted hover:bg-gelo hover:text-ink'
                  }`}
                >
                  <Icon size={16} aria-hidden="true" />
                  {label}
                  {total !== undefined && (
                    <span className={`rounded-full px-1.5 text-[0.75rem] ${active ? 'bg-white/20' : 'bg-gelo'}`}>{total}</span>
                  )}
                </button>
              );
            })}
          </div>

          {(loadingAnamnese || loadingDiag || loadingEval || loadingAtt) && (
            <div className="space-y-3 rounded-[24px] rounded-bl-[7px] bg-surface p-6 ring-1 ring-line" aria-label="Carregando prontuário">
              <span className="esqueleto block h-5 w-48 rounded-[8px]" />
              <span className="esqueleto block h-3.5 w-full rounded-[6px]" />
              <span className="esqueleto block h-3.5 w-5/6 rounded-[6px]" />
              <span className="esqueleto block h-3.5 w-2/3 rounded-[6px]" />
            </div>
          )}

          {/* ========================================================== */}
          {/* ABA 1: HISTÓRICO (LINHA DO TEMPO DE SESSÕES)                */}
          {/* ========================================================== */}
          {activeTab === 'historico' && (
            <div key="historico" className="auth-troca space-y-4">
              {sessions.length === 0 ? (
                <div className="flex flex-col items-center gap-3 rounded-[24px] rounded-bl-[7px] bg-surface p-8 text-center ring-1 ring-line">
                  <Tucano className="w-24" />
                  <p className="font-serif text-[1.25rem] font-semibold text-azul-petroleo">Nenhuma sessão registrada ainda</p>
                  <p className="max-w-[40ch] text-[0.875rem] text-muted">
                    Registre a primeira sessão para começar a linha do tempo de evolução deste paciente.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setSessionForm({
                        sessionNumber: 1,
                        date: new Date().toISOString().split('T')[0],
                        evolution: '',
                        improvementPoint: '',
                        tags: '',
                      });
                      setShowNewSessionModal(true);
                    }}
                    className={`${buttonClass('azul')} mt-2`}
                  >
                    <Plus size={16} aria-hidden="true" /> Registrar primeira sessão
                  </button>
                </div>
              ) : (
                <div className="rounded-[24px] rounded-bl-[7px] bg-surface p-5 ring-1 ring-line sm:p-6">
                  <div className="mb-5 flex items-center justify-between gap-3">
                    <h2 className="font-serif text-[1.25rem] font-semibold text-azul-petroleo">Evolução das sessões</h2>
                    <button type="button" onClick={abrirNovaSessao} className={`${buttonClass('suave')} min-h-10 px-3.5 text-[0.84375rem]`}>
                      <Plus size={15} aria-hidden="true" /> Nova sessão
                    </button>
                  </div>
                  <ol className="relative space-y-6 before:absolute before:bottom-2 before:left-[7px] before:top-2 before:w-0.5 before:rounded-full before:bg-line">
                    {sessions.map((sess, idx) => {
                      const isRealizada = sess.status === 'Realizada';
                      return (
                        <li key={sess.id || idx} className="relative pl-9">
                          <span
                            className={`absolute left-0 top-1 size-4 rounded-full ring-4 ring-surface ${
                              isRealizada ? 'bg-azul' : 'border-2 border-muted bg-surface'
                            }`}
                            aria-hidden="true"
                          />
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <p className="text-[0.9375rem] font-bold text-ink">
                              Sessão {sess.sessionNumber}
                              <span className="ml-2 font-semibold text-muted">{formatDateBR(sess.date)}</span>
                            </p>
                            <span
                              className={`rounded-full px-2.5 py-0.5 text-[0.75rem] font-bold ${
                                isRealizada ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'
                              }`}
                            >
                              {sess.status}
                            </span>
                          </div>

                          {isRealizada ? (
                            <div className="mt-2 space-y-2.5 text-[0.90625rem] leading-relaxed">
                              <p className="text-ink">
                                <strong className="font-semibold text-muted">Evolução: </strong>
                                {sess.evolution}
                              </p>
                              {sess.improvementPoint && (
                                <p className="rounded-[12px] rounded-bl-[3px] bg-mel/35 px-3 py-2 text-on-pastel">
                                  <strong className="font-semibold">Ponto de melhora: </strong>
                                  {sess.improvementPoint}
                                </p>
                              )}
                              {sess.tags && sess.tags.length > 0 && (
                                <div className="flex flex-wrap gap-1.5 pt-0.5">
                                  {sess.tags.map((tag, tIdx) => (
                                    <span key={tIdx} className="rounded-full bg-gelo px-2.5 py-0.5 text-[0.78125rem] font-semibold text-azul-petroleo">
                                      {tag}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                          ) : (
                            <div className="mt-2 space-y-3 text-[0.875rem]">
                              <p className="italic text-muted">
                                Sessão agendada na clínica. Realize o atendimento para registrar a evolução clínica e os pontos de
                                melhora.
                              </p>
                              <button
                                type="button"
                                onClick={() => {
                                  setSessionForm({
                                    sessionNumber: sess.sessionNumber,
                                    date: sess.date || new Date().toISOString().split('T')[0],
                                    evolution: '',
                                    improvementPoint: '',
                                    tags: 'Fluência, Linguagem, Respiração',
                                  });
                                  setShowNewSessionModal(true);
                                }}
                                className={buttonClass('azul')}
                              >
                                <CheckCircle size={15} aria-hidden="true" /> Realizar atendimento (registrar evolução)
                              </button>
                            </div>
                          )}
                        </li>
                      );
                    })}
                  </ol>
                </div>
              )}
            </div>
          )}

          {/* ========================================================== */}
          {/* ABA 2: AVALIAÇÕES (TABELA CLÍNICA)                         */}
          {/* ========================================================== */}
          {activeTab === 'avaliacoes' && (
            <div className="rounded-[24px] rounded-bl-[7px] bg-surface p-5 ring-1 ring-line space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-line">
                <h3 className="font-serif text-[1.25rem] font-semibold text-azul-petroleo">
                  Avaliações Registradas
                </h3>
                <button
                  type="button"
                  onClick={() => setShowNewEvalModal(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-azul-petroleo hover:bg-azul text-on-azul rounded-[12px] text-[0.84375rem] font-bold shadow-2xs transition cursor-pointer"
                >
                  <Plus size={14} /> Nova Avaliação
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-[0.84375rem]">
                  <thead>
                    <tr className="border-b border-line text-[0.78125rem] font-semibold text-muted">
                      <th className="py-2.5">Data</th>
                      <th className="py-2.5">Tipo</th>
                      <th className="py-2.5">Resultado</th>
                      <th className="py-2.5">Responsável</th>
                      <th className="py-2.5 text-right">Ação</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-line">
                    {evaluations.map((ev) => (
                      <tr key={ev.id} className="hover:bg-canvas transition">
                        <td className="py-3 font-medium text-ink">{formatDateBR(ev.dataAvaliacao)}</td>
                        <td className="py-3 font-semibold text-ink">{ev.tipoAvaliacao}</td>
                        <td className="py-3">
                          <span className="px-2.5 py-0.5 rounded-md text-[0.75rem] font-bold bg-warning/10 text-warning">
                            {ev.resultados}
                          </span>
                        </td>
                        <td className="py-3 text-muted">{ev.responsavelNome}</td>
                        <td className="py-3 text-right">
                          <button
                            type="button"
                            onClick={() => setViewEvalDetail(ev)}
                            className="px-2.5 py-1 rounded-lg border border-line hover:bg-gelo font-bold text-ink text-[0.78125rem] transition cursor-pointer"
                          >
                            Ver
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ========================================================== */}
          {/* ABA 3: DIAGNÓSTICO & PLANO TERAPÊUTICO                     */}
          {/* ========================================================== */}
          {activeTab === 'diagnostico' && (
            <div className="rounded-[24px] rounded-bl-[7px] bg-surface p-6 ring-1 ring-line space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-line">
                <h3 className="font-serif text-[1.25rem] font-semibold text-azul-petroleo">
                  Diagnóstico & Plano Terapêutico
                </h3>
                <button
                  type="button"
                  onClick={() => setIsEditingDiag(!isEditingDiag)}
                  className="px-3 py-1.5 rounded-[12px] border border-line bg-surface hover:bg-canvas text-[0.84375rem] font-bold text-ink flex items-center gap-1.5 transition cursor-pointer shadow-2xs"
                >
                  <Pencil size={13} /> {isEditingDiag ? 'Cancelar' : 'Editar'}
                </button>
              </div>

              <form onSubmit={handleSaveDiagnostic} className="space-y-4 text-[0.84375rem]">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2 space-y-1">
                    <label className="mb-1.5 block text-[0.8125rem] font-semibold text-muted">Diagnóstico fonoaudiológico</label>
                    <input
                      type="text"
                      disabled={!isEditingDiag}
                      value={diagForm.speechDiagnosis}
                      onChange={(e) => setDiagForm({ ...diagForm, speechDiagnosis: e.target.value })}
                      className={campoClinico}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="mb-1.5 block text-[0.8125rem] font-semibold text-muted">CID-10 (Sugestão Clínica)</label>
                    <input
                      type="text"
                      list="cid10-prontuario-sugestoes"
                      placeholder="Ex: F80.0, F80.1, F98.5..."
                      disabled={!isEditingDiag}
                      value={diagForm.cid10}
                      onChange={(e) => setDiagForm({ ...diagForm, cid10: e.target.value })}
                      className={campoClinico}
                    />
                    <datalist id="cid10-prontuario-sugestoes">
                      <option value="F80.0">F80.0 - Transtorno específico da articulação da fala</option>
                      <option value="F80.1">F80.1 - Transtorno expressivo da linguagem</option>
                      <option value="F80.2">F80.2 - Transtorno receptivo da linguagem</option>
                      <option value="F80.8">F80.8 - Outros transtornos do desenvolvimento da fala</option>
                      <option value="F80.9">F80.9 - Transtorno não especificado do desenvolvimento</option>
                      <option value="F98.5">F98.5 - Gagueira (Tartamudez)</option>
                      <option value="R47.0">R47.0 - Disfasia e Afasia</option>
                      <option value="R49.0">R49.0 - Disfonia (Alteração vocal)</option>
                      <option value="H90">H90 - Perda auditiva por condução/neurossensorial</option>
                    </datalist>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="mb-1.5 block text-[0.8125rem] font-semibold text-muted">Área Terapêutica</label>
                    <input
                      type="text"
                      list="areas-terapeuticas-sugestoes"
                      placeholder="Ex: Linguagem, Voz, Motricidade Orofacial..."
                      disabled={!isEditingDiag}
                      value={diagForm.therapeuticArea}
                      onChange={(e) => setDiagForm({ ...diagForm, therapeuticArea: e.target.value })}
                      className={campoClinico}
                    />
                    <datalist id="areas-terapeuticas-sugestoes">
                      <option value="Linguagem">Linguagem (Desenvolvimento infantil, fala e escrita)</option>
                      <option value="Voz">Voz (Disfonias, reabilitação vocal)</option>
                      <option value="Motricidade Orofacial">Motricidade Orofacial (Mastigação, deglutição, respiração)</option>
                      <option value="Audiologia">Audiologia (Processamento auditivo, reabilitação)</option>
                      <option value="Disfagia">Disfagia (Dificuldade de deglutição)</option>
                      <option value="Fluência">Fluência (Gagueira e taquifemia)</option>
                    </datalist>
                  </div>
                  <div className="space-y-1">
                    <label className="mb-1.5 block text-[0.8125rem] font-semibold text-muted">Periodicidade / Frequência das Sessões</label>
                    <input
                      type="text"
                      list="frequencia-sessoes-sugestoes"
                      placeholder="Ex: 2x por semana · 50 min"
                      disabled={!isEditingDiag}
                      value={diagForm.sessionFrequency}
                      onChange={(e) => setDiagForm({ ...diagForm, sessionFrequency: e.target.value })}
                      className={campoClinico}
                    />
                    <datalist id="frequencia-sessoes-sugestoes">
                      <option value="1x por semana · 45 min">1x por semana · 45 min</option>
                      <option value="2x por semana · 50 min">2x por semana · 50 min</option>
                      <option value="3x por semana · 40 min">3x por semana · 40 min</option>
                      <option value="Quinzenal · 50 min">Quinzenal · 50 min</option>
                      <option value="Monitoramento Mensal">Monitoramento Mensal</option>
                    </datalist>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="mb-1.5 block text-[0.8125rem] font-semibold text-muted">Objetivos do tratamento</label>
                  <textarea
                    rows={4}
                    disabled={!isEditingDiag}
                    value={diagForm.treatmentGoal}
                    onChange={(e) => setDiagForm({ ...diagForm, treatmentGoal: e.target.value })}
                    className={campoClinico}
                  />
                </div>

                <div className="space-y-1">
                  <label className="mb-1.5 block text-[0.8125rem] font-semibold text-muted">Condutas terapêuticas</label>
                  <textarea
                    rows={3}
                    disabled={!isEditingDiag}
                    value={diagForm.treatmentPlan}
                    onChange={(e) => setDiagForm({ ...diagForm, treatmentPlan: e.target.value })}
                    className={campoClinico}
                  />
                </div>

                {isEditingDiag && (
                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsEditingDiag(false)}
                      className="px-4 py-2 rounded-[12px] border border-line font-bold text-muted hover:bg-gelo"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={savingAction}
                      className={`${buttonClass('azul')}`}
                    >
                      <Save size={14} /> Salvar Diagnóstico
                    </button>
                  </div>
                )}
              </form>
            </div>
          )}

          {/* ========================================================== */}
          {/* ABA 4: ANAMNESE FONOAUDIOLÓGICA                            */}
          {/* ========================================================== */}
          {activeTab === 'anamnese' && (
            <div className="rounded-[24px] rounded-bl-[7px] bg-surface p-6 ring-1 ring-line space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-line">
                <h3 className="font-serif text-[1.25rem] font-semibold text-azul-petroleo">
                  Anamnese Fonoaudiológica
                </h3>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setIsEditingAnamnese(!isEditingAnamnese)}
                    className="px-3 py-1.5 rounded-[12px] border border-line bg-surface hover:bg-canvas text-[0.84375rem] font-bold text-ink flex items-center gap-1.5 transition cursor-pointer shadow-2xs"
                  >
                    <Pencil size={13} /> {isEditingAnamnese ? 'Cancelar' : 'Editar'}
                  </button>
                </div>
              </div>

              <form onSubmit={handleSaveAnamnese} className="space-y-4 text-[0.84375rem]">
                <div className="space-y-1">
                  <label className="mb-1.5 block text-[0.8125rem] font-semibold text-muted">
                    Queixa principal relatada pela família
                  </label>
                  <textarea
                    rows={3}
                    disabled={!isEditingAnamnese}
                    value={anamneseForm.mainComplaint}
                    onChange={(e) => setAnamneseForm({ ...anamneseForm, mainComplaint: e.target.value })}
                    className={campoClinico}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="mb-1.5 block text-[0.8125rem] font-semibold text-muted">
                      Histórico familiar de disfluência
                    </label>
                    <input
                      type="text"
                      disabled={!isEditingAnamnese}
                      value={anamneseForm.familyHistory}
                      onChange={(e) => setAnamneseForm({ ...anamneseForm, familyHistory: e.target.value })}
                      className={campoClinico}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="mb-1.5 block text-[0.8125rem] font-semibold text-muted">Início dos sintomas</label>
                    <input
                      type="text"
                      disabled={!isEditingAnamnese}
                      value={anamneseForm.symptomOnset}
                      onChange={(e) => setAnamneseForm({ ...anamneseForm, symptomOnset: e.target.value })}
                      className={campoClinico}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="mb-1.5 block text-[0.8125rem] font-semibold text-muted">
                      Desenvolvimento da linguagem
                    </label>
                    <input
                      type="text"
                      disabled={!isEditingAnamnese}
                      value={anamneseForm.languageDevelopment}
                      onChange={(e) =>
                        setAnamneseForm({ ...anamneseForm, languageDevelopment: e.target.value })
                      }
                      className={campoClinico}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="mb-1.5 block text-[0.8125rem] font-semibold text-muted">Tratamentos anteriores</label>
                    <input
                      type="text"
                      disabled={!isEditingAnamnese}
                      defaultValue="Nenhum"
                      className={campoClinico}
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="mb-1.5 block text-[0.8125rem] font-semibold text-muted">Observações adicionais</label>
                  <textarea
                    rows={3}
                    disabled={!isEditingAnamnese}
                    value={anamneseForm.additionalObservations}
                    onChange={(e) =>
                      setAnamneseForm({ ...anamneseForm, additionalObservations: e.target.value })
                    }
                    className={campoClinico}
                  />
                </div>

                {isEditingAnamnese && (
                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsEditingAnamnese(false)}
                      className="px-4 py-2 rounded-[12px] border border-line font-bold text-muted hover:bg-gelo"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={savingAction}
                      className={`${buttonClass('azul')}`}
                    >
                      <Save size={14} /> Salvar Anamnese
                    </button>
                  </div>
                )}
              </form>
            </div>
          )}

          {/* ========================================================== */}
          {/* ABA 5: ANEXOS (DOCUMENTOS, ÁUDIOS E EXAMES)               */}
          {/* ========================================================== */}
          {activeTab === 'anexos' && (
            <div className="rounded-[24px] rounded-bl-[7px] bg-surface p-5 ring-1 ring-line space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-line">
                <span className="text-[0.84375rem] font-bold text-muted">
                  {attachments.length} arquivos · {formatBytes(totalAttachmentBytes)}
                </span>
                <button
                  type="button"
                  onClick={() => setShowUploadModal(true)}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 bg-azul-petroleo hover:bg-azul text-on-azul rounded-[12px] text-[0.84375rem] font-bold shadow-2xs transition cursor-pointer"
                >
                  <UploadCloud size={14} /> Enviar arquivo
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-[0.84375rem]">
                  <thead>
                    <tr className="border-b border-line text-[0.78125rem] font-semibold text-muted">
                      <th className="py-2.5">Arquivo</th>
                      <th className="py-2.5">Tipo</th>
                      <th className="py-2.5">Data</th>
                      <th className="py-2.5">Tamanho</th>
                      <th className="py-2.5 text-right">Ação</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-line">
                    {attachments.map((att) => {
                      const isAudio =
                        att.fileName.endsWith('.mp3') ||
                        att.fileName.endsWith('.wav') ||
                        (att.tipoConteudo && att.tipoConteudo.includes('audio'));
                      const isPdf =
                        att.fileName.endsWith('.pdf') ||
                        (att.tipoConteudo && att.tipoConteudo.includes('pdf'));

                      const typeLabel = isAudio ? 'Áudio' : isPdf ? 'Documento' : 'Exame';
                      const badgeClass = isAudio
                        ? 'bg-lavanda text-on-pastel'
                        : isPdf
                        ? 'bg-gelo text-azul'
                        : 'bg-success/10 text-success';

                      return (
                        <tr key={att.id} className="hover:bg-canvas transition">
                          <td className="py-3 font-semibold text-ink flex items-center gap-2">
                            {isAudio ? (
                              <Mic size={15} className="text-on-pastel shrink-0" />
                            ) : isPdf ? (
                              <FileText size={15} className="text-azul shrink-0" />
                            ) : (
                              <Paperclip size={15} className="text-success shrink-0" />
                            )}
                            <span className="truncate max-w-[200px] sm:max-w-xs">{att.fileName}</span>
                          </td>
                          <td className="py-3">
                            <span className={`px-2.5 py-0.5 rounded-md text-[0.75rem] font-bold ${badgeClass}`}>
                              {typeLabel}
                            </span>
                          </td>
                          <td className="py-3 text-muted">{formatDateBR(att.attachmentDate)}</td>
                          <td className="py-3 text-muted font-mono text-[0.78125rem]">
                            {formatBytes(att.fileSize)}
                          </td>
                          <td className="py-3 text-right">
                            <a
                              href={getAttachmentDownloadUrl(att.id)}
                              target="_blank"
                              rel="noreferrer"
                              className="px-2.5 py-1 rounded-lg border border-line hover:bg-gelo font-bold text-ink text-[0.78125rem] transition inline-flex items-center gap-1"
                            >
                              Baixar
                            </a>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ============================================================== */}
      {/* MODAL: REGISTRAR NOVA SESSÃO NO HISTÓRICO                       */}
      {/* ============================================================== */}
      {showNewSessionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-azul-profundo/50 backdrop-blur-sm p-4">
          <div className="auth-troca w-full max-w-lg max-h-[92dvh] overflow-y-auto rounded-[26px] rounded-bl-[8px] bg-surface p-6 shadow-[0_40px_80px_-30px_rgba(11,30,48,0.7)] space-y-4 text-ink">
            <div className="flex items-center justify-between border-b border-line pb-3">
              <h3 className="font-serif text-[1.5rem] font-semibold text-azul-petroleo">
                Registrar Evolução de Sessão
              </h3>
              <button
                type="button"
                onClick={() => setShowNewSessionModal(false)}
                className="text-muted hover:text-ink p-1"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveNewSession} className="space-y-3.5 text-[0.84375rem]">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="mb-1.5 block text-[0.8125rem] font-semibold text-muted">Número da Sessão</label>
                  <input
                    type="number"
                    required
                    value={sessionForm.sessionNumber}
                    onChange={(e) => setSessionForm({ ...sessionForm, sessionNumber: e.target.value })}
                    className={campoClinico}
                  />
                </div>
                <div className="space-y-1">
                  <label className="mb-1.5 block text-[0.8125rem] font-semibold text-muted">Data da Sessão</label>
                  <input
                    type="date"
                    required
                    value={sessionForm.date}
                    onChange={(e) => setSessionForm({ ...sessionForm, date: e.target.value })}
                    className={campoClinico}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="mb-1.5 block text-[0.8125rem] font-semibold text-muted">Evolução Clínica *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Descreva o desempenho do paciente, exercícios realizados e resposta clínica..."
                  value={sessionForm.evolution}
                  onChange={(e) => setSessionForm({ ...sessionForm, evolution: e.target.value })}
                  className={campoClinico}
                />
              </div>

              <div className="space-y-1">
                <label className="mb-1.5 block text-[0.8125rem] font-semibold text-muted">Ponto de Melhora / Tarefa de Casa</label>
                <textarea
                  rows={2}
                  placeholder="Orientações para a família ou pontos a focar na próxima sessão..."
                  value={sessionForm.improvementPoint}
                  onChange={(e) => setSessionForm({ ...sessionForm, improvementPoint: e.target.value })}
                  className={campoClinico}
                />
              </div>

              <div className="space-y-1">
                <label className="mb-1.5 block text-[0.8125rem] font-semibold text-muted">Marcadores Clínicos / Focos da Sessão (separados por vírgula)</label>
                <input
                  type="text"
                  placeholder="Ex: Fonologia, Fluência, Articulação, Leitura guiada"
                  value={sessionForm.tags}
                  onChange={(e) => setSessionForm({ ...sessionForm, tags: e.target.value })}
                  className={campoClinico}
                />
              </div>

              <div className="flex gap-2 pt-2 border-t border-line">
                <button
                  type="button"
                  onClick={() => setShowNewSessionModal(false)}
                  className="flex-1 py-2 rounded-[12px] border border-line font-bold text-muted hover:bg-gelo"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className={`${buttonClass('azul')} flex-1`}
                >
                  Registrar Sessão
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL: NOVA AVALIAÇÃO                                          */}
      {/* ============================================================== */}
      {showNewEvalModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-azul-profundo/50 backdrop-blur-sm p-4">
          <div className="auth-troca w-full max-w-md max-h-[92dvh] overflow-y-auto rounded-[26px] rounded-bl-[8px] bg-surface p-6 shadow-[0_40px_80px_-30px_rgba(11,30,48,0.7)] space-y-4 text-ink">
            <div className="flex items-center justify-between border-b border-line pb-3">
              <h3 className="font-serif text-[1.5rem] font-semibold text-azul-petroleo">Nova Avaliação Clínica</h3>
              <button
                type="button"
                onClick={() => setShowNewEvalModal(false)}
                className="text-muted hover:text-ink p-1"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveNewEvaluation} className="space-y-3.5 text-[0.84375rem]">
              <div className="space-y-1">
                <label className="mb-1.5 block text-[0.8125rem] font-semibold text-muted">Tipo de Avaliação *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Avaliação de Fluência, Audiometria, Linguagem..."
                  value={evalForm.tipoAvaliacao}
                  onChange={(e) => setEvalForm({ ...evalForm, tipoAvaliacao: e.target.value })}
                  className={campoClinico}
                />
              </div>

              <div className="space-y-1">
                <label className="mb-1.5 block text-[0.8125rem] font-semibold text-muted">Data da Avaliação *</label>
                <input
                  type="date"
                  required
                  value={evalForm.dataAvaliacao}
                  onChange={(e) => setEvalForm({ ...evalForm, dataAvaliacao: e.target.value })}
                  className={campoClinico}
                />
              </div>

              <div className="space-y-1">
                <label className="mb-1.5 block text-[0.8125rem] font-semibold text-muted">Resultado Observado *</label>
                <textarea
                  rows={2}
                  required
                  placeholder="Ex: Disfluência moderada com bloqueios em fonemas oclusivos..."
                  value={evalForm.resultados}
                  onChange={(e) => setEvalForm({ ...evalForm, resultados: e.target.value })}
                  className={campoClinico}
                />
              </div>

              <div className="space-y-1">
                <label className="mb-1.5 block text-[0.8125rem] font-semibold text-muted">Conduta Proposta</label>
                <textarea
                  rows={2}
                  placeholder="Ex: Início de intervenção terapêutica semanal focada em controle de velocidade..."
                  value={evalForm.condutasPropostas}
                  onChange={(e) => setEvalForm({ ...evalForm, condutasPropostas: e.target.value })}
                  className={campoClinico}
                />
              </div>

              <div className="flex gap-2 pt-2 border-t border-line">
                <button
                  type="button"
                  onClick={() => setShowNewEvalModal(false)}
                  className="flex-1 py-2 rounded-[12px] border border-line font-bold text-muted hover:bg-gelo"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={savingAction}
                  className={`${buttonClass('azul')} flex-1`}
                >
                  {savingAction ? 'Gravando...' : 'Salvar Avaliação'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL: VER DETALHE DA AVALIAÇÃO                                */}
      {/* ============================================================== */}
      {viewEvalDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-azul-profundo/50 backdrop-blur-sm p-4">
          <div className="auth-troca w-full max-w-md max-h-[92dvh] overflow-y-auto rounded-[26px] rounded-bl-[8px] bg-surface p-6 shadow-[0_40px_80px_-30px_rgba(11,30,48,0.7)] space-y-4 text-ink">
            <div className="flex items-center justify-between border-b border-line pb-3">
              <h3 className="font-serif text-[1.5rem] font-semibold text-azul-petroleo">
                {viewEvalDetail.tipoAvaliacao}
              </h3>
              <button
                type="button"
                onClick={() => setViewEvalDetail(null)}
                className="text-muted hover:text-ink p-1"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3 text-[0.84375rem]">
              <div className="flex justify-between py-1 border-b border-line">
                <span className="text-muted font-medium">Data:</span>
                <span className="font-bold text-ink">{formatDateBR(viewEvalDetail.dataAvaliacao)}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-line">
                <span className="text-muted font-medium">Responsável:</span>
                <span className="font-bold text-ink">
                  {viewEvalDetail.responsavelNome}
                </span>
              </div>
              <div>
                <span className="text-muted font-medium block mb-1">Resultado:</span>
                <p className="p-2.5 rounded-lg bg-warning/10 border border-warning/30 text-warning font-semibold">
                  {viewEvalDetail.resultados}
                </p>
              </div>
              {viewEvalDetail.condutasPropostas && (
                <div>
                  <span className="text-muted font-medium block mb-1">Conduta Proposta:</span>
                  <p className="p-2.5 rounded-lg bg-canvas border border-line text-ink">
                    {viewEvalDetail.condutasPropostas}
                  </p>
                </div>
              )}
            </div>

            <div className="pt-2 border-t border-line text-right">
              <button
                type="button"
                onClick={() => setViewEvalDetail(null)}
                className="px-4 py-2 bg-azul-petroleo text-on-azul rounded-[12px] font-bold text-[0.84375rem]"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL: ENVIAR ARQUIVO ANEXO                                    */}
      {/* ============================================================== */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-azul-profundo/50 backdrop-blur-sm p-4">
          <div className="auth-troca w-full max-w-md max-h-[92dvh] overflow-y-auto rounded-[26px] rounded-bl-[8px] bg-surface p-6 shadow-[0_40px_80px_-30px_rgba(11,30,48,0.7)] space-y-4 text-ink">
            <div className="flex items-center justify-between border-b border-line pb-3">
              <h3 className="font-serif text-[1.5rem] font-semibold text-azul-petroleo">Enviar Novo Arquivo Anexo</h3>
              <button
                type="button"
                onClick={() => setShowUploadModal(false)}
                className="text-muted hover:text-ink p-1"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleUploadAttachmentSubmit} className="space-y-3.5 text-[0.84375rem]">
              <div className="space-y-1">
                <label className="mb-1.5 block text-[0.8125rem] font-semibold text-muted">Selecione o arquivo *</label>
                <input
                  type="file"
                  required
                  accept=".pdf,.mp3,.wav,.ogg,.jpg,.jpeg,.png"
                  onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                  className="w-full text-[0.84375rem] p-2 rounded-lg border border-line bg-surface file:mr-3 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-[0.84375rem] file:font-bold file:bg-gelo file:text-azul hover:file:bg-azul/20 cursor-pointer"
                />
                <p className="text-[0.75rem] text-muted">
                  Formatos aceitos: Documentos (PDF), Áudios (MP3, WAV) e Exames (JPG, PNG).
                </p>
              </div>

              <div className="space-y-1">
                <label className="mb-1.5 block text-[0.8125rem] font-semibold text-muted">Descrição do Arquivo</label>
                <input
                  type="text"
                  placeholder="Ex: Audiometria, Gravação da primeira sessão..."
                  value={uploadDesc}
                  onChange={(e) => setUploadDesc(e.target.value)}
                  className={campoClinico}
                />
              </div>

              <div className="flex gap-2 pt-2 border-t border-line">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="flex-1 py-2 rounded-[12px] border border-line font-bold text-muted hover:bg-gelo"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className={`${buttonClass('azul')} flex-1`}
                >
                  {uploading ? (
                    'Enviando...'
                  ) : (
                    <>
                      <UploadCloud size={14} /> Fazer Upload
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
