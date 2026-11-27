import { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import A11yModal from '../components/A11yModal';
import AreaLayout from '../components/area/AreaLayout';
import {
  IconeAgenda,
  IconeAjustes,
  IconeInicio,
  IconePacientes,
  IconeProntuario,
  IconeRelatorios,
} from '../components/area/IconesFono';

import Patients from './professional/Patients';
import MedicalRecordPage from './professional/MedicalRecordPage';
import Overview from './professional/Home';
import Schedule from './professional/Schedule';
import Reports from './professional/Reports';
import SettingsPage from './professional/SettingsPage';
import { listPatients } from '../services/patientService';

const navItems = [
  { id: 'dashboard', label: 'Início', icon: IconeInicio },
  { id: 'pacientes', label: 'Pacientes', icon: IconePacientes },
  { id: 'prontuario', label: 'Prontuário', icon: IconeProntuario },
  { id: 'agenda', label: 'Agenda', icon: IconeAgenda },
  { id: 'relatorios', label: 'Relatórios', icon: IconeRelatorios },
  { id: 'configuracoes', label: 'Configurações', icon: IconeAjustes },
];

const pageInfo = {
  dashboard: { title: 'Painel do Profissional', subtitle: '' },
  pacientes: { title: 'Pacientes', subtitle: 'Cadastre, busque e abra os prontuários.' },
  prontuario: { title: 'Prontuário', subtitle: 'Acompanhe evolução, histórico de sessões, diagnóstico e exames.' },
  agenda: { title: 'Agenda de atendimentos', subtitle: 'Organize sessões presenciais e teleatendimentos.' },
  relatorios: { title: 'Relatórios e documentos', subtitle: 'Emita laudos, atestados e exportações acessíveis.' },
  configuracoes: { title: 'Configurações do consultório', subtitle: 'Gerencie seu perfil e credenciais profissionais.' },
};

function authenticatedName(session) {
  return session?.name || session?.nome || session?.fullName || session?.user?.name ||
    session?.professional?.name || session?.email || session?.user?.email || 'Profissional';
}

export default function ProfessionalDashboard({ section = 'dashboard', recordId }) {
  const activeSection = section;
  const [showA11y, setShowA11y] = useState(false);
  const { logout, session } = useAuth();
  const [patients, setPatients] = useState([]);
  const [patientsLoading, setPatientsLoading] = useState(true);
  const [patientsError, setPatientsError] = useState('');
  const [selectedProntuarioPatientId, setSelectedProntuarioPatientId] = useState(null);

  useEffect(() => {
    listPatients()
      .then(setPatients)
      .catch((error) => setPatientsError(error.message))
      .finally(() => setPatientsLoading(false));
  }, [activeSection]);

  const navigateTo = (newSection) => {
    window.location.assign(`#/profissional/${newSection}`);
  };

  const info = pageInfo[activeSection] ?? pageInfo.dashboard;
  const professionalName = authenticatedName(session);
  const professionalInitials = professionalName
    .replace(/^(dra?\.?)\s+/i, '')
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();
  const ativos = patients.filter((patient) => patient.patientStatus !== 'ARQUIVADO').length;

  return (
    <AreaLayout
      variante="profissional"
      rotulo="Área do profissional"
      itens={navItems}
      ativo={activeSection}
      onSelecionar={navigateTo}
      usuario={{
        nome: professionalName,
        papel: session?.crfa || 'Conta autenticada',
        iniciais: professionalInitials,
      }}
      onSair={logout}
      onA11y={() => setShowA11y(true)}
    >
      <div key={activeSection} className="space-y-6">
        {/* Agenda e Relatórios trazem o próprio título com ações */}
        {!['prontuario', 'dashboard', 'agenda', 'relatorios'].includes(activeSection) && (
          <header className="surge flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1 className="display text-[38px] text-azul-petroleo sm:text-[46px]">{info.title}</h1>
              <p className="mt-1 text-[15.5px] text-muted">{info.subtitle}</p>
            </div>
            <p className="inline-flex items-center gap-2.5 rounded-full bg-surface py-1.5 pl-1.5 pr-4 text-[13.5px] font-semibold text-ink ring-1 ring-line">
              <span className="grid min-w-8 place-items-center rounded-full bg-azul-petroleo px-2 py-1 font-serif text-[15px] text-on-azul">
                {patientsLoading || patientsError ? '—' : ativos}
              </span>
              pacientes ativos
            </p>
          </header>
        )}

        {activeSection === 'dashboard' && <Overview onNavigate={navigateTo} professionalName={professionalName} />}
        {activeSection === 'pacientes' && (
          <Patients
            onOpenProntuario={(patient) => {
              setSelectedProntuarioPatientId(patient.id);
              navigateTo(`prontuario/${patient.id}`);
            }}
          />
        )}
        {activeSection === 'prontuario' && (
          <MedicalRecordPage
            key={recordId || selectedProntuarioPatientId || 'primeiro'}
            patients={patients}
            selectedPatientId={recordId || selectedProntuarioPatientId}
            onSelectPatient={(patient) => setSelectedProntuarioPatientId(patient.id)}
            onNavigate={navigateTo}
          />
        )}
        {activeSection === 'agenda' && (
          <Schedule
            onNavigate={navigateTo}
            onSelectPatient={(patient) => setSelectedProntuarioPatientId(patient.id)}
          />
        )}
        {activeSection === 'relatorios' && <Reports onNavigate={navigateTo} />}
        {activeSection === 'configuracoes' && <SettingsPage />}
      </div>

      <A11yModal isOpen={showA11y} onClose={() => setShowA11y(false)} />
    </AreaLayout>
  );
}
