// Permite abrir o rastreio já na atividade da faixa etária escolhida
// (ex.: pelo seletor de idade da página inicial) sem criar novas rotas.
const KEY = 'fonosync:triagem_inicio';
const VALIDAS = ['form02', 'game24', 'rima45', 'check6'];

export function iniciarTriagem(atividade) {
  try {
    if (atividade && VALIDAS.includes(atividade)) {
      window.sessionStorage.setItem(KEY, atividade);
    } else {
      window.sessionStorage.removeItem(KEY);
    }
  } catch {
    /* armazenamento indisponível: abre no início do rastreio */
  }
}

// Só lê (seguro para inicializadores do React, que podem rodar duas vezes).
export function lerInicioTriagem() {
  try {
    const valor = window.sessionStorage.getItem(KEY);
    return VALIDAS.includes(valor) ? valor : null;
  } catch {
    return null;
  }
}

export function limparInicioTriagem() {
  try {
    window.sessionStorage.removeItem(KEY);
  } catch {
    /* nada a limpar */
  }
}
