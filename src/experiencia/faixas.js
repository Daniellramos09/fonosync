// Experiência por faixa etária: um só sistema, quatro perfis configuráveis.
// Cada perfil define tom de voz, densidade, movimento, personagens e gamificação.
// Os estilos visuais correspondentes vivem em index.css sob [data-faixa="…"].

export const FAIXAS = {
  crianca: {
    id: 'crianca',
    rotulo: 'Criança',
    intervalo: 'até 10 anos',
    resumo: 'Brincadeiras com personagens, mapa de aventura e figurinhas.',
    navegacao: 'paciente', // variante do AreaLayout
    mascote: true,
    personagens: true,
    gamificacao: 'aventura', // mapa + figurinhas + comemoração
    movimento: 'vivo',
    nav: { inicio: 'Início', atividades: 'Brincadeiras', conta: 'Eu' },
    textos: {
      saudacao: (nome) => (nome ? `Oi, ${nome}!` : 'Oi!'),
      subtitulo: 'Bora brincar com as palavras? Escolha uma aventura.',
      ctaAtividade: 'Vamos lá!',
    },
  },
  adolescente: {
    id: 'adolescente',
    rotulo: 'Adolescente',
    intervalo: '11 a 17 anos',
    resumo: 'Visual moderno, metas pessoais e evolução no seu ritmo.',
    navegacao: 'jovem',
    mascote: false,
    personagens: false,
    gamificacao: 'metas', // meta semanal + dias ativos
    movimento: 'sutil',
    nav: { inicio: 'Início', atividades: 'Desafios', conta: 'Perfil' },
    textos: {
      saudacao: (nome) => (nome ? `E aí, ${nome}.` : 'E aí.'),
      subtitulo: 'Seu espaço para treinar a fala no seu ritmo, com metas que você mesmo define.',
      ctaAtividade: 'Começar',
    },
  },
  adulto: {
    id: 'adulto',
    rotulo: 'Adulto',
    intervalo: '18 a 59 anos',
    resumo: 'Organizado e direto: acompanhamento, histórico e próximos passos.',
    navegacao: 'paciente',
    mascote: false,
    personagens: false,
    gamificacao: 'nenhuma',
    movimento: 'discreto',
    nav: { inicio: 'Início', atividades: 'Atividades', conta: 'Minha conta' },
    textos: {
      saudacao: (nome, periodo) => (nome ? `${periodo}, ${nome}.` : `${periodo}.`),
      subtitulo: 'Seu acompanhamento fonoaudiológico em um só lugar.',
      ctaAtividade: 'Abrir',
    },
  },
  idoso: {
    id: 'idoso',
    rotulo: '60 anos ou mais',
    intervalo: '60 anos ou mais',
    resumo: 'Letras maiores, botões amplos, poucas opções por tela e leitura em voz alta à mão.',
    navegacao: 'paciente',
    mascote: false,
    personagens: false,
    gamificacao: 'nenhuma',
    movimento: 'minimo',
    navInferior: true, // no celular, menu fixo embaixo e sempre visível
    nav: { inicio: 'Início', atividades: 'Atividades', conta: 'Minha conta' },
    textos: {
      saudacao: (nome, periodo) => (nome ? `${periodo}, ${nome}.` : `${periodo}.`),
      subtitulo: 'O que você quer fazer hoje?',
      ctaAtividade: 'Abrir atividade',
    },
  },
};

export const ORDEM_FAIXAS = ['crianca', 'adolescente', 'adulto', 'idoso'];

export function idadeEm(nascimento, hoje = new Date()) {
  if (!nascimento) return null;
  const n = new Date(`${String(nascimento).slice(0, 10)}T00:00:00`);
  if (Number.isNaN(n.getTime())) return null;
  let idade = hoje.getFullYear() - n.getFullYear();
  const antesDoAniversario =
    hoje.getMonth() < n.getMonth() || (hoje.getMonth() === n.getMonth() && hoje.getDate() < n.getDate());
  if (antesDoAniversario) idade -= 1;
  return idade >= 0 && idade < 130 ? idade : null;
}

export function faixaPorIdade(idade) {
  if (idade === null || idade === undefined) return null;
  if (idade <= 10) return 'crianca';
  if (idade <= 17) return 'adolescente';
  if (idade <= 59) return 'adulto';
  return 'idoso';
}

// Rastreio indicado para a idade exata da criança (mesmos cortes da triagem).
export function atividadeRecomendada(idade) {
  if (idade === null || idade === undefined || idade > 10) return null;
  if (idade < 2) return 'form02';
  if (idade < 4) return 'game24';
  if (idade < 6) return 'rima45';
  return 'check6';
}

export function periodoDoDia(data) {
  const h = data.getHours();
  if (h < 12) return 'Bom dia';
  if (h < 18) return 'Boa tarde';
  return 'Boa noite';
}
