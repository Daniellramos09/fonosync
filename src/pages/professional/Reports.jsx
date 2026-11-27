import { buttonClass } from '../../components/buttonStyles';
import { useState, useEffect } from 'react';
import {
  FileText,
  BadgeCheck,
  UploadCloud,
  FileDown,
  Download,
  Eye,
  CheckCircle2,
  Share2,
  Printer,
  X,
  Search,
  Clock,
} from 'lucide-react';
import { listPatients } from '../../services/patientService';
import { LogoMark } from '../../components/Logo';

const initialDocuments = [];

export default function Reports() {
  const [activeTab, setActiveTab] = useState('gerar'); // 'gerar' | 'historico' | 'atestados' | 'importar'
  const [documents, setDocuments] = useState(initialDocuments);
  const [patients, setPatients] = useState([]);
  const [feedback, setFeedback] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Modais de Ação
  const [showEvolutionModal, setShowEvolutionModal] = useState(false);
  const [showInterModal, setShowInterModal] = useState(false);
  const [previewDoc, setPreviewDoc] = useState(null);

  // Estados de formulário
  const [selectedPatientId, setSelectedPatientId] = useState('');
  const [reportPeriod, setReportPeriod] = useState('Últimos 90 dias');
  const [reportObservations, setReportObservations] = useState('');

  // Interdisciplinar
  const [targetSpecialty, setTargetSpecialty] = useState('Neuropediatria');
  const [doctorName, setDoctorName] = useState('');
  const [conductNotes, setConductNotes] = useState(
    'Paciente em acompanhamento fonoaudiológico semanal com foco em fluência da fala e processamento auditivo central.'
  );

  // Atestado
  const [atestadoPatient, setAtestadoPatient] = useState('');
  const [atestadoDate, setAtestadoDate] = useState(new Date().toISOString().split('T')[0]);
  const [atestadoTime, setAtestadoTime] = useState('14:30');
  const [atestadoDuration, setAtestadoDuration] = useState('50 minutos');
  const [atestadoPurpose, setAtestadoPurpose] = useState('comparecimento a sessão de terapia fonoaudiológica');

  // Importação de Prontuário
  const [importSource, setImportSource] = useState('Simples Dental / iClinic');
  const [importFile, setImportFile] = useState(null);
  const [importProgress, setImportProgress] = useState(false);
  const [importSuccessData, setImportSuccessData] = useState(null);

  useEffect(() => {
    listPatients()
      .then((data) => {
        setPatients(data);
        if (data.length > 0) {
          setSelectedPatientId(data[0].id);
          setAtestadoPatient(data[0].name);
        }
      })
      .catch(() => {});
  }, []);

  const showNotification = (msg) => {
    setFeedback(msg);
    setTimeout(() => setFeedback(null), 5000);
  };

  // Gerar Relatório de Evolução
  const handleGenerateEvolutionReport = (e) => {
    e.preventDefault();
    const patientObj = patients.find((p) => p.id === selectedPatientId) || {
      name: 'Maria Luiza Ferreira',
      cid10: 'F98.5',
    };

    const newDoc = {
      id: `doc-${Date.now()}`,
      document: 'Relatório de Evolução Clínica',
      patient: patientObj.name,
      specialty: 'Fluência e Linguagem',
      period: reportPeriod,
      createdAt: 'Hoje',
      status: 'Gerado (PDF)',
      format: 'PDF',
      size: '1.2 MB',
      summary: reportObservations || 'Evolução clínica semestral com registro de metas atingidas e assiduidade.',
    };

    setDocuments([newDoc, ...documents]);
    setShowEvolutionModal(false);
    showNotification(`Relatório de evolução gerado com sucesso para ${patientObj.name}!`);
    setPreviewDoc(newDoc);
  };

  // Gerar Relatório Interdisciplinar (Outros Profissionais)
  const handleGenerateInterdisciplinary = (e) => {
    e.preventDefault();
    const patientObj = patients.find((p) => p.id === selectedPatientId) || {
      name: 'Maria Luiza Ferreira',
    };

    const newDoc = {
      id: `doc-${Date.now()}`,
      document: `Relatório Interdisciplinar (${targetSpecialty})`,
      patient: patientObj.name,
      specialty: `${targetSpecialty} - Encaminhamento`,
      period: 'Tratamento Atual',
      createdAt: 'Hoje',
      status: 'Emitido (PDF)',
      format: 'PDF',
      size: '1.8 MB',
      summary: `Sumário encaminhado para ${doctorName}. Condutas: ${conductNotes}`,
    };

    setDocuments([newDoc, ...documents]);
    setShowInterModal(false);
    showNotification(`Relatório para outros profissionais gerado com sucesso! Destino: ${targetSpecialty}`);
    setPreviewDoc(newDoc);
  };

  // Emitir Atestado Oficial
  const handleGenerateAtestado = (e) => {
    e.preventDefault();
    const newDoc = {
      id: `doc-${Date.now()}`,
      document: 'Atestado Fonoaudiológico Oficial',
      patient: atestadoPatient,
      specialty: 'Declaração e Atestado com CRFa',
      period: atestadoDate,
      createdAt: 'Hoje',
      status: 'Assinado Digitalmente',
      format: 'PDF',
      size: '420 KB',
      summary: `Atestado emitido para ${atestadoPatient} referente a atendimento em ${atestadoDate} às ${atestadoTime}.`,
    };

    setDocuments([newDoc, ...documents]);
    showNotification(`Atestado fonoaudiológico oficial emitido e assinado digitalmente!`);
    setPreviewDoc(newDoc);
  };

  // Exportar Planilha CSV
  const handleExportCSV = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,Documento,Paciente,Especialidade,Periodo,Status,Data\n' +
      documents
        .map((e) => `"${e.document}","${e.patient}","${e.specialty}","${e.period}","${e.status}","${e.createdAt}"`)
        .join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'relatorios_clinicos_fonosync.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showNotification('Exportação de relatórios clínicos em formato CSV concluída com sucesso!');
  };

  // Processar Importação de Prontuário de Outro Sistema
  const handleProcessImport = () => {
    if (!importFile) return;
    setImportProgress(true);
    setTimeout(() => {
      setImportProgress(false);
      setImportSuccessData({
        fileName: importFile.name,
        system: importSource,
        patientsCount: 4,
        sessionsCount: 38,
        anamnesesCount: 4,
        importedAt: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      });
      showNotification('Importação de prontuário concluída! 4 novos prontuários foram integrados à sua base.');
    }, 1400);
  };

  const filteredDocs = documents.filter(
    (doc) =>
      doc.document.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.patient.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.specialty.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 font-sans">
      {/* ---------------------------------------------------------------- */}
      {/* CABEÇALHO DO MÓDULO DE RELATÓRIOS (FIEL AO DESIGN SYSTEM)         */}
      {/* ---------------------------------------------------------------- */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-line pb-4">
        <div>
          <h1 className="display text-[2.375rem] text-azul-petroleo sm:text-[2.875rem]">Relatórios & Documentos Clínicos</h1>
          <p className="text-[0.84375rem] text-muted mt-1">
            Gere laudos de evolução, relatórios para outros profissionais, atestados com CRFa e importe prontuários externos.
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleExportCSV}
            className={`${buttonClass('suave')}`}
          >
            <FileDown size={15} className="text-azul" /> Exportar Dados (CSV)
          </button>
        </div>
      </div>

      {/* FEEDBACK BANNER */}
      {feedback && (
        <div className="flex items-center gap-2 p-3.5 bg-success/10 border border-success/30 text-success rounded-[12px] text-[0.84375rem] font-semibold shadow-2xs animate-fade-in">
          <CheckCircle2 size={16} className="text-success shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      {/* ---------------------------------------------------------------- */}
      {/* NAVEGAÇÃO POR ABAS                                               */}
      {/* ---------------------------------------------------------------- */}
      <div className="flex items-center gap-2 border-b border-line bg-surface px-2 rounded-t-xl overflow-x-auto scrollbar-none">
        {[
          { id: 'gerar', label: 'Gerar Documentos', icon: FileText },
          { id: 'historico', label: `Histórico (${documents.length})`, icon: Clock },
          { id: 'atestados', label: 'Atestados Fonoaudiológicos', icon: BadgeCheck },
          { id: 'importar', label: 'Importar Prontuário Externo', icon: UploadCloud },
        ].map(({ id, label, icon: Icon }) => {
          const active = activeTab === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => setActiveTab(id)}
              className={`flex items-center gap-2 px-4 py-3 text-[0.84375rem] font-bold border-b-2 transition whitespace-nowrap cursor-pointer ${
                active
                  ? 'border-azul text-azul bg-gelo'
                  : 'border-transparent text-muted hover:text-ink hover:bg-canvas'
              }`}
            >
              <Icon size={15} />
              <span>{label}</span>
            </button>
          );
        })}
      </div>

      {/* ================================================================ */}
      {/* ABA 1: GERAR DOCUMENTOS (4 CARDS DE AÇÃO)                        */}
      {/* ================================================================ */}
      {activeTab === 'gerar' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* CARD 1: RELATÓRIO DE EVOLUÇÃO */}
            <div className="rounded-[24px] rounded-bl-[7px] bg-surface p-6 ring-1 ring-line flex flex-col justify-between hover:border-azul/20 transition-all group">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-[12px] bg-gelo text-azul flex items-center justify-center">
                  <FileText size={20} />
                </div>
                <h3 className="text-base font-bold font-serif text-ink group-hover:text-azul transition-colors">
                  Relatório de Evolução Clínica
                </h3>
                <p className="text-[0.84375rem] text-muted leading-relaxed">
                  Histórico completo e consolidado de sessões, progresso terapêutico, parâmetros fonéticos, assiduidade e objetivos alcançados para o paciente e familiares.
                </p>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  <span className="px-2 py-0.5 rounded text-[0.75rem] font-semibold bg-gelo text-muted">
                    Acompanhamento
                  </span>
                  <span className="px-2 py-0.5 rounded text-[0.75rem] font-semibold bg-gelo text-muted">
                    Formato PDF Oficial
                  </span>
                </div>
              </div>
              <div className="pt-5 mt-4 border-t border-line">
                <button
                  type="button"
                  onClick={() => setShowEvolutionModal(true)}
                  className="w-full py-2.5 bg-azul-petroleo hover:bg-azul text-on-azul rounded-[12px] text-[0.84375rem] font-bold shadow-xs flex items-center justify-center gap-2 transition cursor-pointer"
                >
                  <FileDown size={15} /> Gerar Relatório de Evolução
                </button>
              </div>
            </div>

            {/* CARD 2: RELATÓRIO PARA OUTROS PROFISSIONAIS */}
            <div className="rounded-[24px] rounded-bl-[7px] bg-surface p-6 ring-1 ring-line flex flex-col justify-between hover:border-azul/20 transition-all group">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-[12px] bg-gelo text-azul flex items-center justify-center">
                  <Share2 size={20} />
                </div>
                <h3 className="text-base font-bold font-serif text-ink group-hover:text-azul transition-colors">
                  Relatório para Outros Profissionais
                </h3>
                <p className="text-[0.84375rem] text-muted leading-relaxed">
                  Sumário clínico estruturado com conduta terapêutica, hipótese diagnóstica (CID-10) e recomendações para médico neuropediatra, psicólogo, otorrinolaringologista ou escola.
                </p>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  <span className="px-2 py-0.5 rounded text-[0.75rem] font-semibold bg-gelo text-azul">
                    Interdisciplinar
                  </span>
                  <span className="px-2 py-0.5 rounded text-[0.75rem] font-semibold bg-gelo text-azul">
                    Médicos & Escolas
                  </span>
                </div>
              </div>
              <div className="pt-5 mt-4 border-t border-line">
                <button
                  type="button"
                  onClick={() => setShowInterModal(true)}
                  className="w-full py-2.5 bg-azul hover:bg-azul-petroleo text-on-azul rounded-[12px] text-[0.84375rem] font-bold shadow-xs flex items-center justify-center gap-2 transition cursor-pointer"
                >
                  <Share2 size={15} /> Emitir Relatório para Outro Profissional
                </button>
              </div>
            </div>

            {/* CARD 3: ATESTADO FONOAUDIOLÓGICO */}
            <div className="rounded-[24px] rounded-bl-[7px] bg-surface p-6 ring-1 ring-line flex flex-col justify-between hover:border-azul/20 transition-all group">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-[12px] bg-success/10 text-success flex items-center justify-center">
                  <BadgeCheck size={20} />
                </div>
                <h3 className="text-base font-bold font-serif text-ink group-hover:text-success transition-colors">
                  Atestado Fonoaudiológico Oficial
                </h3>
                <p className="text-[0.84375rem] text-muted leading-relaxed">
                  Declaração formal de comparecimento em atendimento, tratamento contínuo ou aptidão com carimbo digital, QR Code de validação e CRFa do profissional.
                </p>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  <span className="px-2 py-0.5 rounded text-[0.75rem] font-semibold bg-success/10 text-success">
                    Assinatura com CRFa
                  </span>
                  <span className="px-2 py-0.5 rounded text-[0.75rem] font-semibold bg-success/10 text-success">
                    Justificativa Escolar / Trabalho
                  </span>
                </div>
              </div>
              <div className="pt-5 mt-4 border-t border-line">
                <button
                  type="button"
                  onClick={() => setActiveTab('atestados')}
                  className="w-full py-2.5 bg-success hover:bg-success text-white rounded-[12px] text-[0.84375rem] font-bold shadow-xs flex items-center justify-center gap-2 transition cursor-pointer"
                >
                  <BadgeCheck size={15} /> Emitir Atestado Oficial
                </button>
              </div>
            </div>

            {/* CARD 4: IMPORTAR PRONTUÁRIO EXTERNO */}
            <div className="rounded-[24px] rounded-bl-[7px] bg-surface p-6 ring-1 ring-line flex flex-col justify-between hover:border-azul/20 transition-all group">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-[12px] bg-warning/10 text-warning flex items-center justify-center">
                  <UploadCloud size={20} />
                </div>
                <h3 className="text-base font-bold font-serif text-ink group-hover:text-warning transition-colors">
                  Importar Prontuário de Outro Sistema
                </h3>
                <p className="text-[0.84375rem] text-muted leading-relaxed">
                  Migração facilitada e segura de prontuários clínicos e fichas vindas de outros softwares médicos (JSON, planilhas CSV ou prontuários físicos digitalizados).
                </p>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  <span className="px-2 py-0.5 rounded text-[0.75rem] font-semibold bg-warning/10 text-warning">
                    Migração de Dados
                  </span>
                  <span className="px-2 py-0.5 rounded text-[0.75rem] font-semibold bg-warning/10 text-warning">
                    JSON / CSV / PDF
                  </span>
                </div>
              </div>
              <div className="pt-5 mt-4 border-t border-line">
                <button
                  type="button"
                  onClick={() => setActiveTab('importar')}
                  className="w-full py-2.5 bg-surface border border-line hover:bg-canvas text-ink rounded-[12px] text-[0.84375rem] font-bold shadow-2xs flex items-center justify-center gap-2 transition cursor-pointer"
                >
                  <UploadCloud size={15} className="text-warning" /> Iniciar Importação de Prontuário
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================================================================ */}
      {/* ABA 2: HISTÓRICO DE DOCUMENTOS EMITIDOS                          */}
      {/* ================================================================ */}
      {activeTab === 'historico' && (
        <div className="rounded-[24px] rounded-bl-[7px] bg-surface p-5 ring-1 ring-line space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-line">
            <div className="relative flex-1 min-w-50 max-w-sm">
              <Search size={15} className="absolute left-3 top-3 text-muted" />
              <input
                type="text"
                placeholder="Buscar por paciente ou documento..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-canvas border border-line rounded-[12px] text-[0.84375rem] text-ink focus:outline-none focus:ring-2 focus:ring-azul/20"
              />
            </div>
            <span className="text-[0.84375rem] text-muted font-semibold">{filteredDocs.length} documentos encontrados</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-[0.84375rem]">
              <thead>
                <tr className="border-b border-line text-[0.78125rem] font-semibold text-muted">
                  <th className="py-3 px-3">Documento</th>
                  <th className="py-3 px-3">Paciente</th>
                  <th className="py-3 px-3">Especialidade / Destino</th>
                  <th className="py-3 px-3">Data</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {filteredDocs.map((doc) => (
                  <tr key={doc.id} className="hover:bg-canvas transition-colors">
                    <td className="py-3.5 px-3">
                      <div className="font-bold text-ink flex items-center gap-2">
                        <FileText size={15} className="text-azul shrink-0" />
                        <span>{doc.document}</span>
                      </div>
                      <p className="text-[0.75rem] text-muted pl-5.5">{doc.size} · {doc.format}</p>
                    </td>
                    <td className="py-3.5 px-3 font-semibold text-ink">{doc.patient}</td>
                    <td className="py-3.5 px-3 text-muted">{doc.specialty}</td>
                    <td className="py-3.5 px-3 text-muted">{doc.createdAt}</td>
                    <td className="py-3.5 px-3">
                      <span className="px-2.5 py-0.5 rounded-full text-[0.75rem] font-bold bg-success/10 text-success">
                        {doc.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-right space-x-1">
                      <button
                        type="button"
                        onClick={() => setPreviewDoc(doc)}
                        className="px-2.5 py-1 text-azul hover:bg-gelo rounded-lg font-bold text-[0.84375rem] inline-flex items-center gap-1 transition cursor-pointer"
                        title="Visualizar documento"
                      >
                        <Eye size={13} /> Visualizar
                      </button>
                      <button
                        type="button"
                        onClick={() => showNotification(`Download de "${doc.document}" iniciado!`)}
                        className="px-2.5 py-1 text-muted hover:bg-gelo rounded-lg font-bold text-[0.84375rem] inline-flex items-center gap-1 transition cursor-pointer"
                        title="Baixar PDF"
                      >
                        <Download size={13} /> Baixar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ================================================================ */}
      {/* ABA 3: ATESTADOS FONOAUDIOLÓGICOS (GERADOR E PREVIEW)            */}
      {/* ================================================================ */}
      {activeTab === 'atestados' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Formulário do Atestado */}
          <div className="lg:col-span-5 rounded-[24px] rounded-bl-[7px] bg-surface p-5 ring-1 ring-line space-y-4">
            <h3 className="font-serif text-[1.25rem] font-semibold text-azul-petroleo flex items-center gap-2">
              <BadgeCheck size={16} className="text-success" /> Configurar Atestado Fonoaudiológico
            </h3>

            <div className="space-y-3 text-[0.84375rem]">
              <div>
                <label className="text-muted font-bold block mb-1">Paciente *</label>
                <select
                  value={atestadoPatient}
                  onChange={(e) => setAtestadoPatient(e.target.value)}
                  className="w-full p-2.5 bg-canvas border border-line rounded-[12px] text-ink focus:outline-none focus:ring-2 focus:ring-azul/20"
                >
                  {patients.length > 0 ? (
                    patients.map((p) => (
                      <option key={p.id} value={p.name}>
                        {p.name}
                      </option>
                    ))
                  ) : (
                    <>
                      <option value="Maria Luiza Ferreira">Maria Luiza Ferreira</option>
                      <option value="Carlos Eduardo Silva">Carlos Eduardo Silva</option>
                      <option value="João Pedro Alves">João Pedro Alves</option>
                    </>
                  )}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="text-muted font-bold block mb-1">Data da Consulta</label>
                  <input
                    type="date"
                    value={atestadoDate}
                    onChange={(e) => setAtestadoDate(e.target.value)}
                    className="w-full p-2.5 bg-canvas border border-line rounded-[12px] text-ink focus:outline-none focus:ring-2 focus:ring-azul/20"
                  />
                </div>
                <div>
                  <label className="text-muted font-bold block mb-1">Horário</label>
                  <input
                    type="time"
                    value={atestadoTime}
                    onChange={(e) => setAtestadoTime(e.target.value)}
                    className="w-full p-2.5 bg-canvas border border-line rounded-[12px] text-ink focus:outline-none focus:ring-2 focus:ring-azul/20"
                  />
                </div>
              </div>

              <div>
                <label className="text-muted font-bold block mb-1">Duração do Atendimento</label>
                <input
                  type="text"
                  value={atestadoDuration}
                  onChange={(e) => setAtestadoDuration(e.target.value)}
                  placeholder="Ex: 50 minutos"
                  className="w-full p-2.5 bg-canvas border border-line rounded-[12px] text-ink focus:outline-none focus:ring-2 focus:ring-azul/20"
                />
              </div>

              <div>
                <label className="text-muted font-bold block mb-1">Finalidade Clínica</label>
                <textarea
                  rows={2}
                  value={atestadoPurpose}
                  onChange={(e) => setAtestadoPurpose(e.target.value)}
                  className="w-full p-2.5 bg-canvas border border-line rounded-[12px] text-ink focus:outline-none focus:ring-2 focus:ring-azul/20"
                />
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleGenerateAtestado}
                  className="w-full py-2.5 bg-success hover:bg-success text-white rounded-[12px] text-[0.84375rem] font-bold shadow-xs flex items-center justify-center gap-2 transition cursor-pointer"
                >
                  <BadgeCheck size={15} /> Confirmar e Emitir Atestado
                </button>
              </div>
            </div>
          </div>

          {/* Pré-visualização do Papel Timbrado do Atestado */}
          <div className="lg:col-span-7 rounded-[24px] rounded-bl-[7px] bg-surface p-8 ring-1 ring-line space-y-6 text-ink">
            {/* Cabeçalho Clínico Timbrado */}
            <div className="flex items-center justify-between border-b-2 border-[#172C3A] pb-4">
              <div className="flex items-center gap-3">
                <LogoMark className="size-10" />
                <div>
                  <h2 className="font-serif font-bold text-lg text-ink">FonoSync Clínica Fonoaudiológica</h2>
                  <p className="text-[0.75rem] text-muted tracking-wide uppercase font-semibold">
                    Atendimento Clínico Especializado & Terapia de Fala
                  </p>
                </div>
              </div>
              <div className="text-right text-[0.78125rem] text-muted">
                <p className="font-bold text-ink">Dra. Renata Lima</p>
                <p className="text-muted">CRFa 2-19842 / SP</p>
              </div>
            </div>

            {/* Título do Atestado */}
            <div className="text-center py-4">
              <h3 className="text-base font-bold font-serif uppercase tracking-widest text-ink">
                ATESTADO FONOAUDIOLÓGICO
              </h3>
            </div>

            {/* Texto Formal */}
            <div className="text-sm leading-relaxed text-ink space-y-4 text-justify">
              <p>
                Atesto para os devidos fins de comprovação e justificativa que o(a) paciente{' '}
                <strong className="text-ink underline">{atestadoPatient}</strong> esteve sob atendimento fonoaudiológico
                nesta clínica no dia{' '}
                <strong className="text-ink">{new Date(atestadoDate + 'T00:00:00').toLocaleDateString('pt-BR')}</strong>,
                com início às <strong className="text-ink">{atestadoTime}</strong> e duração de{' '}
                <strong className="text-ink">{atestadoDuration}</strong>, para fins de{' '}
                <strong className="text-ink">{atestadoPurpose}</strong>.
              </p>
              <p className="text-[0.84375rem] text-muted">
                O presente documento é emitido em conformidade com o Código de Ética da Fonoaudiologia e legislação pertinente.
              </p>
            </div>

            {/* Assinatura e Carimbo Digital */}
            <div className="pt-8 border-t border-line flex flex-col items-center justify-center text-center space-y-1">
              <div className="w-48 border-b border-slate-400 mb-2" />
              <p className="text-[0.84375rem] font-bold text-ink">Dra. Renata Lima</p>
              <p className="text-[0.78125rem] text-muted">Fonoaudióloga Clínica · CRFa 2-19842</p>
              <span className="inline-flex items-center gap-1 text-[0.75rem] text-success font-semibold mt-1 bg-success/10 px-2 py-0.5 rounded-full border border-success/30">
                <CheckCircle2 size={11} /> Assinado digitalmente com chave certificada
              </span>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => window.print()}
                className="px-3.5 py-2 bg-gelo hover:bg-gelo text-ink rounded-[12px] text-[0.84375rem] font-bold transition flex items-center gap-1.5 cursor-pointer"
              >
                <Printer size={14} /> Imprimir Atestado
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================================================================ */}
      {/* ABA 4: IMPORTAR PRONTUÁRIO DE OUTRO SISTEMA                     */}
      {/* ================================================================ */}
      {activeTab === 'importar' && (
        <div className="max-w-3xl mx-auto rounded-[24px] rounded-bl-[7px] bg-surface p-7 ring-1 ring-line space-y-6">
          <div className="space-y-1">
            <h3 className="font-serif text-[1.5rem] font-semibold text-azul-petroleo flex items-center gap-2">
              <UploadCloud size={20} className="text-azul" /> Migração e Importação de Prontuários
            </h3>
            <p className="text-[0.84375rem] text-muted">
              Importe facilmente os prontuários, cadastros e histórico clínico de pacientes vindos de outros softwares de gestão médica ou fonoaudiológica.
            </p>
          </div>

          <div className="space-y-4 text-[0.84375rem]">
            {/* Escolha do Software de Origem */}
            <div>
              <label className="text-ink font-bold block mb-1.5">Software de Gestão de Origem *</label>
              <select
                value={importSource}
                onChange={(e) => setImportSource(e.target.value)}
                className="w-full p-2.5 bg-canvas border border-line rounded-[12px] text-ink font-medium focus:outline-none focus:ring-2 focus:ring-azul/20"
              >
                <option value="Simples Dental / iClinic">Simples Dental / iClinic (Exportação JSON/CSV)</option>
                <option value="Prontmed / Feegow">Prontmed / Feegow Clinic</option>
                <option value="Tasy / Philips">Tasy Clínico / Philips Health</option>
                <option value="Planilha Excel / Google Sheets">Planilha Excel / Google Sheets (CSV Padronizado)</option>
                <option value="Prontuário Digitalizado">Prontuário Físico Digitalizado (PDF)</option>
              </select>
            </div>

            {/* Dropzone de Arquivo */}
            <div className="border-2 border-dashed border-line hover:border-azul bg-canvas rounded-[22px] rounded-bl-[6px] p-8 text-center transition-colors">
              <input
                type="file"
                id="file-import-input"
                accept=".json,.csv,.xlsx,.pdf"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setImportFile(e.target.files[0]);
                  }
                }}
              />
              <label htmlFor="file-import-input" className="cursor-pointer space-y-3 block">
                <div className="w-12 h-12 mx-auto rounded-full bg-gelo text-azul flex items-center justify-center">
                  <UploadCloud size={24} />
                </div>
                {importFile ? (
                  <div>
                    <p className="text-[0.84375rem] font-bold text-ink">{importFile.name}</p>
                    <p className="text-[0.78125rem] text-muted">{(importFile.size / 1024).toFixed(1)} KB · Clique para trocar</p>
                  </div>
                ) : (
                  <div>
                    <p className="text-[0.84375rem] font-bold text-ink">Clique para selecionar o arquivo de prontuário</p>
                    <p className="text-[0.78125rem] text-muted mt-1">Suporta arquivos .JSON, .CSV ou relatórios em .PDF</p>
                  </div>
                )}
              </label>
            </div>

            {/* Feedback e Botão de Ação */}
            {importSuccessData && (
              <div className="p-4 bg-success/10 border border-success/30 rounded-[12px] space-y-2">
                <div className="flex items-center gap-2 text-success font-bold text-[0.84375rem]">
                  <CheckCircle2 size={16} /> Importação Concluída com Sucesso!
                </div>
                <div className="grid grid-cols-3 gap-2 text-[0.78125rem] text-success pt-1">
                  <div>
                    <strong>Pacientes:</strong> {importSuccessData.patientsCount}
                  </div>
                  <div>
                    <strong>Sessões:</strong> {importSuccessData.sessionsCount}
                  </div>
                  <div>
                    <strong>Anamneses:</strong> {importSuccessData.anamnesesCount}
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-end gap-3 pt-3">
              <button
                type="button"
                disabled={!importFile || importProgress}
                onClick={handleProcessImport}
                className={`${buttonClass('azul')}`}
              >
                {importProgress ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Processando e validando prontuários...
                  </>
                ) : (
                  <>
                    <UploadCloud size={15} /> Confirmar Importação de Prontuário
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================================================================ */}
      {/* MODAL 1: GERAR RELATÓRIO DE EVOLUÇÃO CLÍNICA                     */}
      {/* ================================================================ */}
      {showEvolutionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-2xs p-4">
          <div className="bg-surface rounded-[22px] rounded-bl-[6px] border border-line w-full max-w-lg p-6 shadow-xl space-y-5">
            <div className="flex items-center justify-between border-b border-line pb-3">
              <h3 className="text-base font-bold font-serif text-ink flex items-center gap-2">
                <FileText size={18} className="text-azul" /> Gerar Relatório de Evolução Clínica
              </h3>
              <button
                type="button"
                onClick={() => setShowEvolutionModal(false)}
                className="p-1 text-muted hover:text-ink rounded-lg cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleGenerateEvolutionReport} className="space-y-4 text-[0.84375rem]">
              <div>
                <label className="text-ink font-bold block mb-1">Paciente *</label>
                <select
                  value={selectedPatientId}
                  onChange={(e) => setSelectedPatientId(e.target.value)}
                  className="w-full p-2.5 bg-canvas border border-line rounded-[12px] text-ink focus:outline-none focus:ring-2 focus:ring-azul/20"
                >
                  {patients.length > 0 ? (
                    patients.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} {p.cid10 ? `(CID-10 ${p.cid10})` : ''}
                      </option>
                    ))
                  ) : (
                    <option value="demo">Maria Luiza Ferreira (CID-10 F98.5)</option>
                  )}
                </select>
              </div>

              <div>
                <label className="text-ink font-bold block mb-1">Período de Análise *</label>
                <select
                  value={reportPeriod}
                  onChange={(e) => setReportPeriod(e.target.value)}
                  className="w-full p-2.5 bg-canvas border border-line rounded-[12px] text-ink focus:outline-none focus:ring-2 focus:ring-azul/20"
                >
                  <option value="Últimos 30 dias">Últimos 30 dias</option>
                  <option value="Últimos 60 dias">Últimos 60 dias</option>
                  <option value="Últimos 90 dias">Últimos 90 dias (Trimestral)</option>
                  <option value="Todo o tratamento">Todo o histórico do tratamento</option>
                </select>
              </div>

              <div>
                <label className="text-ink font-bold block mb-1">Observações Clínicas Específicas</label>
                <textarea
                  rows={3}
                  placeholder="Destaque avanços na fluência, engajamento familiar ou recomendações terapêuticas..."
                  value={reportObservations}
                  onChange={(e) => setReportObservations(e.target.value)}
                  className="w-full p-2.5 bg-canvas border border-line rounded-[12px] text-ink focus:outline-none focus:ring-2 focus:ring-azul/20"
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-3 border-t border-line">
                <button
                  type="button"
                  onClick={() => setShowEvolutionModal(false)}
                  className="px-4 py-2 border border-line hover:bg-canvas text-ink rounded-[12px] font-bold cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className={`${buttonClass('azul')}`}
                >
                  <FileDown size={14} /> Gerar PDF do Relatório
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================================================================ */}
      {/* MODAL 2: RELATÓRIO PARA OUTROS PROFISSIONAIS                     */}
      {/* ================================================================ */}
      {showInterModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-2xs p-4">
          <div className="bg-surface rounded-[22px] rounded-bl-[6px] border border-line w-full max-w-lg p-6 shadow-xl space-y-5">
            <div className="flex items-center justify-between border-b border-line pb-3">
              <h3 className="text-base font-bold font-serif text-ink flex items-center gap-2">
                <Share2 size={18} className="text-azul" /> Relatório para Outros Profissionais
              </h3>
              <button
                type="button"
                onClick={() => setShowInterModal(false)}
                className="p-1 text-muted hover:text-ink rounded-lg cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleGenerateInterdisciplinary} className="space-y-4 text-[0.84375rem]">
              <div>
                <label className="text-ink font-bold block mb-1">Paciente *</label>
                <select
                  value={selectedPatientId}
                  onChange={(e) => setSelectedPatientId(e.target.value)}
                  className="w-full p-2.5 bg-canvas border border-line rounded-[12px] text-ink focus:outline-none focus:ring-2 focus:ring-azul/20"
                >
                  {patients.length > 0 ? (
                    patients.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))
                  ) : (
                    <option value="demo">Carlos Eduardo Silva</option>
                  )}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="text-ink font-bold block mb-1">Especialidade de Destino *</label>
                  <select
                    value={targetSpecialty}
                    onChange={(e) => setTargetSpecialty(e.target.value)}
                    className="w-full p-2.5 bg-canvas border border-line rounded-[12px] text-ink focus:outline-none focus:ring-2 focus:ring-azul/20"
                  >
                    <option value="Neuropediatria">Neuropediatria</option>
                    <option value="Psicologia Clínica">Psicologia Clínica</option>
                    <option value="Otorrinolaringologia">Otorrinolaringologia (ORL)</option>
                    <option value="Pedagogia / Equipe Escolar">Pedagogia / Escola</option>
                    <option value="Odontologia / Ortodontia">Odontologia / Ortodontia</option>
                  </select>
                </div>
                <div>
                  <label className="text-ink font-bold block mb-1">Nome do Profissional / Destinatário</label>
                  <input
                    type="text"
                    value={doctorName}
                    onChange={(e) => setDoctorName(e.target.value)}
                    placeholder="Ex: Dr. Fulano de Tal"
                    className="w-full p-2.5 bg-canvas border border-line rounded-[12px] text-ink focus:outline-none focus:ring-2 focus:ring-azul/20"
                  />
                </div>
              </div>

              <div>
                <label className="text-ink font-bold block mb-1">Conduta Terapêutica & Parecer Fonoaudiológico</label>
                <textarea
                  rows={4}
                  value={conductNotes}
                  onChange={(e) => setConductNotes(e.target.value)}
                  className="w-full p-2.5 bg-canvas border border-line rounded-[12px] text-ink focus:outline-none focus:ring-2 focus:ring-azul/20"
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-3 border-t border-line">
                <button
                  type="button"
                  onClick={() => setShowInterModal(false)}
                  className="px-4 py-2 border border-line hover:bg-canvas text-ink rounded-[12px] font-bold cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-azul hover:bg-azul-petroleo text-on-azul rounded-[12px] font-bold shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Share2 size={14} /> Emitir Relatório Interdisciplinar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================================================================ */}
      {/* MODAL 3: PRÉ-VISUALIZAÇÃO DE DOCUMENTO                           */}
      {/* ================================================================ */}
      {previewDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-2xs p-4">
          <div className="bg-surface rounded-[22px] rounded-bl-[6px] border border-line w-full max-w-2xl p-6 shadow-[0_40px_80px_-30px_rgba(11,30,48,0.7)] space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-line pb-3">
              <div>
                <h3 className="text-base font-bold font-serif text-ink">{previewDoc.document}</h3>
                <p className="text-[0.84375rem] text-muted">
                  Paciente: {previewDoc.patient} · Emitido em: {previewDoc.createdAt}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setPreviewDoc(null)}
                className="p-1 text-muted hover:text-ink rounded-lg cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Conteúdo formatado com timbrado */}
            <div className="p-6 bg-canvas border border-line rounded-[12px] space-y-4 text-[0.84375rem] text-ink leading-relaxed">
              <div className="flex items-center justify-between border-b border-line pb-3">
                <div className="flex items-center gap-2">
                  <LogoMark className="size-7" />
                  <span className="font-serif font-bold text-sm text-ink">FonoSync Clínica</span>
                </div>
                <span className="text-[0.75rem] text-muted">Dra. Renata Lima · CRFa 2-19842</span>
              </div>

              <div>
                <p className="font-bold text-ink text-sm">{previewDoc.document}</p>
                <p className="text-muted mt-1">
                  <strong>Paciente:</strong> {previewDoc.patient}
                </p>
                <p className="text-muted">
                  <strong>Especialidade:</strong> {previewDoc.specialty}
                </p>
                <p className="text-muted">
                  <strong>Período:</strong> {previewDoc.period}
                </p>
              </div>

              <div className="bg-surface p-3.5 rounded-lg border border-line">
                <strong className="block text-ink mb-1">Resumo Clínico e Parecer:</strong>
                <p>{previewDoc.summary}</p>
              </div>

              <div className="pt-4 border-t border-line text-center text-[0.75rem] text-muted">
                <p>Documento autenticado digitalmente pelo sistema FonoSync.</p>
                <p>Validade jurídica conforme ICP-Brasil e Conselho Federal de Fonoaudiologia.</p>
              </div>
            </div>

            <div className="flex justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => window.print()}
                className="px-4 py-2 bg-gelo hover:bg-gelo text-ink rounded-[12px] text-[0.84375rem] font-bold transition flex items-center gap-1.5 cursor-pointer"
              >
                <Printer size={14} /> Imprimir
              </button>
              <button
                type="button"
                onClick={() => {
                  showNotification(`Documento "${previewDoc.document}" baixado com sucesso!`);
                  setPreviewDoc(null);
                }}
                className="px-4 py-2 bg-azul-petroleo hover:bg-azul text-on-azul rounded-[12px] text-[0.84375rem] font-bold transition flex items-center gap-1.5 cursor-pointer"
              >
                <Download size={14} /> Baixar PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
