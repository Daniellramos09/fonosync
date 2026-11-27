import { useState } from 'react';
import AreaLayout from '../components/area/AreaLayout';
import { IconeAtividades, IconeConta, IconeInicio } from '../components/area/IconesFono';
import A11yModal from '../components/A11yModal';
import { lerHistoricoTriagem } from '../components/atividades';
import { atividadeRecomendada } from '../experiencia/faixas';
import { contarPorAtividade } from '../experiencia/historico';
import { useExperiencia } from '../experiencia/useExperiencia';
import { useA11y } from '../hooks/useA11y';
import { useAuth } from '../hooks/useAuth';
import Atividades from './paciente/Atividades';
import Conta from './paciente/Conta';
import EscolhaExperiencia from './paciente/EscolhaExperiencia';
import InicioAdolescente from './paciente/InicioAdolescente';
import InicioAdulto from './paciente/InicioAdulto';
import InicioCrianca from './paciente/InicioCrianca';
import InicioIdoso from './paciente/InicioIdoso';

const INICIOS = {
  crianca: InicioCrianca,
  adolescente: InicioAdolescente,
  adulto: InicioAdulto,
  idoso: InicioIdoso,
};

// Cores pastel por item só nas experiências claras (criança, adulto, 60+).
const CORES_NAV = { inicio: '#F4B7A3', atividades: '#D6EAE4', conta: '#F5D887' };
const ICONES_NAV = { inicio: IconeInicio, atividades: IconeAtividades, conta: IconeConta };

export default function PatientDashboard() {
  const [activeTab, setActiveTab] = useState('inicio');
  const [showA11y, setShowA11y] = useState(false);
  const [agora] = useState(() => new Date());
  const [historico] = useState(lerHistoricoTriagem);
  const { session, logout } = useAuth();
  const { isPlayerOpen, speakPageContent, stopSpeaking } = useA11y();
  const experiencia = useExperiencia();
  const { faixa, idade } = experiencia;

  const name = session?.name || session?.email || '';
  const firstName = session?.name?.split(' ')[0];
  const concluidas = contarPorAtividade(historico);
  const recomendada = atividadeRecomendada(idade);
  const ouvir = () => (isPlayerOpen ? stopSpeaking() : speakPageContent());
  const abrirA11y = () => setShowA11y(true);

  const rotulosNav = faixa?.nav ?? { inicio: 'Início', atividades: 'Atividades', conta: 'Minha conta' };
  const itens = ['inicio', 'atividades', 'conta'].map((id) => ({
    id,
    label: rotulosNav[id],
    icon: ICONES_NAV[id],
    cor: faixa?.navegacao === 'jovem' ? undefined : CORES_NAV[id],
  }));

  const Inicio = faixa ? INICIOS[faixa.id] : null;
  const props = {
    faixa,
    nome: firstName,
    email: session?.email,
    idade,
    agora,
    historico,
    concluidas,
    recomendada,
    irPara: setActiveTab,
    onA11y: abrirA11y,
    onOuvir: ouvir,
    ouvindo: isPlayerOpen,
  };

  return (
    <AreaLayout
      variante={faixa?.navegacao ?? 'paciente'}
      faixa={faixa?.id}
      mascote={faixa ? faixa.mascote : false}
      navInferior={Boolean(faixa?.navInferior)}
      rotulo="Área do paciente"
      itens={itens}
      ativo={activeTab}
      onSelecionar={setActiveTab}
      usuario={{ nome: name, papel: faixa ? `Paciente · ${faixa.rotulo.toLowerCase()}` : 'Paciente', iniciais: name.slice(0, 2).toUpperCase() }}
      onSair={logout}
      onA11y={abrirA11y}
      onOuvir={ouvir}
      ouvindo={isPlayerOpen}
    >
      <div key={`${faixa?.id ?? 'escolha'}-${activeTab}`} className="space-y-6">
        {!faixa && (
          <EscolhaExperiencia nome={firstName} onNascimento={experiencia.salvarNascimento} onEscolher={experiencia.escolherFaixa} />
        )}

        {faixa && activeTab === 'inicio' && <Inicio {...props} />}
        {faixa && activeTab === 'atividades' && <Atividades faixa={faixa} concluidas={concluidas} recomendada={recomendada} />}
        {faixa && activeTab === 'conta' && (
          <Conta session={session} faixa={faixa} experiencia={experiencia} onA11y={abrirA11y} onOuvir={ouvir} ouvindo={isPlayerOpen} />
        )}
      </div>

      <A11yModal isOpen={showA11y} onClose={() => setShowA11y(false)} />
    </AreaLayout>
  );
}
