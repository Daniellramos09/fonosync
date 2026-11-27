import { useCallback, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { FAIXAS, faixaPorIdade, idadeEm } from './faixas';

// Decide a experiência do paciente:
//   1. escolha manual da pessoa (sempre vence, pode ser desfeita);
//   2. data de nascimento do cadastro (guardada na sessão ao criar a conta);
//   3. data de nascimento informada na própria área do paciente.
// Fica salvo por conta (e-mail) neste aparelho; o backend não é alterado.

const chave = (email) => `fonosync:experiencia:${email || 'anonimo'}`;

function ler(email) {
  try {
    const v = JSON.parse(window.localStorage.getItem(chave(email)));
    return v && typeof v === 'object' ? v : {};
  } catch {
    return {};
  }
}

export function useExperiencia() {
  const { session } = useAuth();
  const email = session?.email;
  const [prefs, setPrefs] = useState(() => ler(email));
  const [hoje] = useState(() => new Date());

  const gravar = useCallback(
    (proximo) => {
      setPrefs(proximo);
      try {
        window.localStorage.setItem(chave(email), JSON.stringify(proximo));
      } catch {
        /* sem armazenamento: vale só nesta visita */
      }
    },
    [email],
  );

  const nascimento = session?.birthDate || prefs.nascimento || null;
  const idade = idadeEm(nascimento, hoje);
  const automatica = faixaPorIdade(idade);
  const id = prefs.faixaEscolhida && FAIXAS[prefs.faixaEscolhida] ? prefs.faixaEscolhida : automatica;

  let origem = null;
  if (prefs.faixaEscolhida) origem = 'escolhida';
  else if (session?.birthDate) origem = 'cadastro';
  else if (prefs.nascimento) origem = 'informada';

  return {
    faixa: id ? FAIXAS[id] : null,
    idade,
    nascimento,
    origem,
    automatica,
    salvarNascimento: (data) => gravar({ ...prefs, nascimento: data, faixaEscolhida: undefined }),
    escolherFaixa: (faixaId) => gravar({ ...prefs, faixaEscolhida: faixaId }),
    usarAutomatica: () => gravar({ ...prefs, faixaEscolhida: undefined }),
  };
}
