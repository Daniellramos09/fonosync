// Leituras do histórico que a triagem grava neste aparelho (datas em dd/mm/aaaa).
import { iniciarTriagem } from '../utils/triagemInicio';

export function abrirAtividade(id) {
  iniciarTriagem(id);
  window.location.hash = '#/triagem';
}

export function dataDoRegistro(registro) {
  const [d, m, a] = String(registro?.date ?? '').split('/').map(Number);
  if (!d || !m || !a) return null;
  return new Date(a, m - 1, d);
}

export function contarPorAtividade(historico) {
  return historico.reduce((acc, r) => ({ ...acc, [r.activity]: (acc[r.activity] ?? 0) + 1 }), {});
}

const DIA = 86400000;
const inicioDoDia = (data) => new Date(data.getFullYear(), data.getMonth(), data.getDate());

// Registros dos últimos 7 dias (inclui hoje).
export function ultimos7Dias(historico, hoje) {
  const limite = inicioDoDia(hoje).getTime() - 6 * DIA;
  return historico.filter((r) => (dataDoRegistro(r)?.getTime() ?? 0) >= limite);
}

export function diasAtivos(historico, hoje) {
  return new Set(ultimos7Dias(historico, hoje).map((r) => r.date)).size;
}

// Contagem por semana, da mais antiga para a atual (4 semanas).
export function porSemana(historico, hoje, semanas = 4) {
  const fim = inicioDoDia(hoje).getTime() + DIA;
  return Array.from({ length: semanas }, (_, i) => {
    const ate = fim - (semanas - 1 - i) * 7 * DIA;
    const de = ate - 7 * DIA;
    const total = historico.filter((r) => {
      const t = dataDoRegistro(r)?.getTime();
      return t !== undefined && t >= de && t < ate;
    }).length;
    return { total, atual: i === semanas - 1 };
  });
}

// Preferências simples por conta, guardadas neste aparelho.
export function lerPreferencia(chave, padrao) {
  try {
    const v = JSON.parse(window.localStorage.getItem(chave));
    return v ?? padrao;
  } catch {
    return padrao;
  }
}

export function gravarPreferencia(chave, valor) {
  try {
    window.localStorage.setItem(chave, JSON.stringify(valor));
  } catch {
    /* sem armazenamento: vale só nesta visita */
  }
}
