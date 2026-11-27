// Catálogo único das atividades de rastreio, usado pela triagem e pela área do paciente.
// `faixas` diz para quais perfis (src/experiencia/faixas.js) a atividade é indicada; novas
// atividades para adolescentes, adultos e 60+ entram aqui e aparecem automaticamente.
// `historico` é o nome que a triagem grava em localStorage ao concluir a atividade.
import { Capivara, Sagui, Tartaruga, Tucano } from './Personagens';

export const ATIVIDADES = [
  {
    id: 'form02',
    idade: '0–2',
    titulo: 'Marcos da comunicação',
    quem: 'Para pais e cuidadores',
    desc: 'Balbucio, primeiras palavras e resposta a sons, em perguntas de sim ou não.',
    campo: 'bg-coral',
    cor: '#F4B7A3',
    tipo: 'perguntas',
    faixas: ['crianca'], // perfis para os quais a atividade é indicada
    historico: 'Formulário de Marcos',
    nomePersonagem: 'Capivara',
    Personagem: Capivara,
  },
  {
    id: 'game24',
    idade: '2–4',
    titulo: 'Jogo da Palavra',
    quem: 'A criança nomeia figuras',
    desc: 'Você toca no que ouviu. Trocas como vaca → faca ficam registradas.',
    campo: 'bg-salvia',
    cor: '#D6EAE4',
    tipo: 'jogos',
    faixas: ['crianca'], // perfis para os quais a atividade é indicada
    historico: 'Jogo Fonético',
    nomePersonagem: 'Tucano',
    Personagem: Tucano,
  },
  {
    id: 'rima45',
    idade: '4–5',
    titulo: 'Jogo da Rima',
    quem: 'Começa com um exemplo',
    desc: 'Gato e pato rimam? Rodadas curtas de consciência fonológica.',
    campo: 'bg-lavanda',
    cor: '#D8D0EB',
    tipo: 'jogos',
    faixas: ['crianca'], // perfis para os quais a atividade é indicada
    historico: 'Jogo da Rima',
    nomePersonagem: 'Sagui',
    Personagem: Sagui,
  },
  {
    id: 'check6',
    idade: '6+',
    titulo: 'Checklist escolar',
    quem: 'Para professores',
    desc: 'O que foi observado em sala nas últimas semanas: fala, leitura e compreensão.',
    campo: 'bg-mel',
    cor: '#F5D887',
    tipo: 'escola',
    faixas: ['crianca'], // perfis para os quais a atividade é indicada
    historico: 'Checklist Escolar',
    nomePersonagem: 'Tartaruga',
    Personagem: Tartaruga,
  },
];

const HISTORICO_KEY = 'fonosync:triagem_history';

// Atividades concluídas neste aparelho (gravadas pela própria triagem).
export function lerHistoricoTriagem() {
  try {
    const lista = JSON.parse(window.localStorage.getItem(HISTORICO_KEY));
    return Array.isArray(lista) ? lista : [];
  } catch {
    return [];
  }
}

export function atividadePorHistorico(nome) {
  return ATIVIDADES.find((a) => a.historico === nome) ?? null;
}
