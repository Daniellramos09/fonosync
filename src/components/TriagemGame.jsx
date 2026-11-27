import { useEffect, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Download,
  Info,
  PersonStanding,
  RotateCcw,
  Search,
  ThumbsDown,
  ThumbsUp,
  Volume2,
} from 'lucide-react';
import Logo from './Logo';
import { ATIVIDADES } from './atividades';
import { Capivara, Comemoracao, Sagui, Tucano } from './Personagens';
import { lerInicioTriagem, limparInicioTriagem } from '../utils/triagemInicio';
import A11yModal from './A11yModal';
import DataTable from './DataTable';
import Notice from './Notice';
import { buttonClass } from './buttonStyles';
import { useA11y } from '../hooks/useA11y';

// Banco de palavras para o Jogo Fonético (2 a 4 anos) com opções rápidas baseadas no MD
const phoneticWords = [
  {
    id: 'vaca',
    name: 'VACA',
    emoji: '🐄',
    phonemes: '/v/ + /a/ + /k/ + /a/',
    target: 'vaca',
    quickOptions: [
      { label: 'Vaca', value: 'vaca', isCorrect: true, note: 'Pronúncia correta do fonema /v/' },
      { label: 'Faca', value: 'faca', isCorrect: false, note: 'Troca de /v/ → /f/ (Ensurdecimento de fricativa)' },
      { label: 'Baca', value: 'baca', isCorrect: false, note: 'Troca de /v/ → /b/ (Oclusivização)' },
    ],
  },
  {
    id: 'cobra',
    name: 'COBRA',
    emoji: '🐍',
    phonemes: '/k/ + /o/ + /b/ + /r/ + /a/',
    target: 'cobra',
    quickOptions: [
      { label: 'Cobra', value: 'cobra', isCorrect: true, note: 'Pronúncia correta com encontro consonantal' },
      { label: 'Coba', value: 'coba', isCorrect: false, note: 'Omissão do /r/ em encontro consonantal' },
      { label: 'Corra', value: 'corra', isCorrect: false, note: 'Troca do /b/ medial' },
    ],
  },
  {
    id: 'flor',
    name: 'FLOR',
    emoji: '🌸',
    phonemes: '/f/ + /l/ + /o/ + /r/',
    target: 'flor',
    quickOptions: [
      { label: 'Flor', value: 'flor', isCorrect: true, note: 'Pronúncia correta' },
      { label: 'For', value: 'for', isCorrect: false, note: 'Redução de encontro consonantal /fl/ → /f/' },
      { label: 'Fror', value: 'fror', isCorrect: false, note: 'Troca de líquida /fl/ → /fr/' },
    ],
  },
  {
    id: 'trem',
    name: 'TREM',
    emoji: '🚂',
    phonemes: '/t/ + /r/ + /e/ + /m/',
    target: 'trem',
    quickOptions: [
      { label: 'Trem', value: 'trem', isCorrect: true, note: 'Pronúncia correta' },
      { label: 'Tem', value: 'tem', isCorrect: false, note: 'Redução do encontro /tr/' },
      { label: 'Crem', value: 'crem', isCorrect: false, note: 'Troca de /t/ → /k/' },
    ],
  },
  {
    id: 'pato',
    name: 'PATO',
    emoji: '🦆',
    phonemes: '/p/ + /a/ + /t/ + /u/',
    target: 'pato',
    quickOptions: [
      { label: 'Pato', value: 'pato', isCorrect: true, note: 'Pronúncia correta' },
      { label: 'Bato', value: 'bato', isCorrect: false, note: 'Troca de /p/ → /b/ (Sonorização de oclusiva)' },
      { label: 'Tato', value: 'tato', isCorrect: false, note: 'Troca de /p/ → /t/ (Anteriorização)' },
    ],
  },
];

// Banco de pares para o Jogo da Rima (4 a 5 anos) conforme especificação
const rimaPairs = [
  { w1: 'GATO', e1: '🐱', w2: 'PATO', e2: '🦆', rima: true },
  { w1: 'BOLA', e1: '⚽', w2: 'MOLA', e2: '🌀', rima: true },
  { w1: 'CASA', e1: '🏠', w2: 'PEIXE', e2: '🐟', rima: false },
  { w1: 'CARRO', e1: '🚗', w2: 'JARRO', e2: '🏺', rima: true },
  { w1: 'PATO', e1: '🦆', w2: 'ELEFANTE', e2: '🐘', rima: false },
];

// Perguntas dos Marcos de Desenvolvimento (0 a 2 anos)
const formQuestions = [
  { id: 1, category: 'Comunicação Verbal', question: 'A criança fala pelo menos 10 palavras reconhecíveis (ex.: mamãe, água, não, dá)?', options: [
    { value: 'sim', label: '✅ Sim, claramente' },
    { value: 'parcial', label: '⚠️ Algumas vezes' },
    { value: 'nao', label: '❌ Ainda não' },
  ]},
  { id: 2, category: 'Compreensão', question: 'A criança entende ordens simples sem gestos, como "pega a bola" ou "vem aqui"?', options: [
    { value: 'sim', label: '✅ Sim, sempre' },
    { value: 'parcial', label: '⚠️ Às vezes' },
    { value: 'nao', label: '❌ Raramente' },
  ]},
  { id: 3, category: 'Imitação Vocal', question: 'A criança imita sons ou palavras que o adulto fala, mesmo que com pronúncia diferente?', options: [
    { value: 'sim', label: '✅ Sim, com frequência' },
    { value: 'parcial', label: '⚠️ Raramente' },
    { value: 'nao', label: '❌ Não imita' },
  ]},
  { id: 4, category: 'Atenção Auditiva', question: 'A criança reage quando é chamada em tom normal (sem gritar)?', options: [
    { value: 'sim', label: '✅ Sempre reage' },
    { value: 'parcial', label: '⚠️ Às vezes ignora' },
    { value: 'nao', label: '❌ Quase não reage' },
  ]},
  { id: 5, category: 'Combinação de Palavras', question: 'A criança já junta duas palavras para formar frases simples (ex.: "quer água", "cadê mamãe")?', options: [
    { value: 'sim', label: '✅ Sim, com frequência' },
    { value: 'parcial', label: '⚠️ Começando agora' },
    { value: 'nao', label: '❌ Ainda não' },
  ]},
  { id: 6, category: 'Intenção Comunicativa', question: 'A criança aponta, gesticula ou usa outros recursos para pedir o que quer além de chorar?', options: [
    { value: 'sim', label: '✅ Sim, muito' },
    { value: 'parcial', label: '⚠️ Às vezes' },
    { value: 'nao', label: '❌ Quase nunca' },
  ]},
];

// Checklist Escolar (6+ anos)
const checklistItems = [
  'A criança evita falar em voz alta ou participar de atividades orais',
  'Troca sons que colegas da mesma faixa etária não trocam',
  'Tem dificuldade em rimar palavras ou identificar sons iniciais',
  'Apresenta gagueira ou travamentos frequentes na fala',
  'Demonstra dificuldade em seguir instruções verbais da aula',
  'Apresenta desempenho muito abaixo dos colegas na alfabetização',
];

export default function TriagemGame() {
  const [screenStack, setScreenStack] = useState(() => {
    const inicio = lerInicioTriagem();
    return inicio ? ['home', inicio] : ['home'];
  });

  useEffect(() => {
    limparInicioTriagem();
  }, []);

  // Etapa 2: Jogo Fonético (2-4 anos)
  const [phoneticIndex, setPhoneticIndex] = useState(0);
  const [customWordInput, setCustomWordInput] = useState('');
  const [isTypingCustom, setIsTypingCustom] = useState(false);
  const [phoneticAnswers, setPhoneticAnswers] = useState([]);
  const [phoneticFeedback, setPhoneticFeedback] = useState(null);

  // Etapa 3: Jogo da Rima (4-5 anos)
  const [rimaExampleFinished, setRimaExampleFinished] = useState(false);
  const [rimaIndex, setRimaIndex] = useState(0);
  const [rimaAnswers, setRimaAnswers] = useState([]);
  const [rimaFeedback, setRimaFeedback] = useState('');

  // Formulário 0-2 e Checklist 6+
  const [formAnswers, setFormAnswers] = useState({});
  const [checkListState, setCheckListState] = useState({});

  // Histórico persistido
  const [history, setHistory] = useState(() => {
    try {
      const stored = window.localStorage.getItem('fonosync:triagem_history');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Acessibilidade e Modal
  const [showA11y, setShowA11y] = useState(false);
  const { isPlayerOpen, speakPageContent, stopSpeaking, speakText } = useA11y();

  const activeScreen = screenStack[screenStack.length - 1];

  const showScreen = (screenId) => {
    setScreenStack((prev) => (prev[prev.length - 1] === screenId ? prev : [...prev, screenId]));
  };

  const goBack = () => {
    setScreenStack((prev) => (prev.length <= 1 ? ['home'] : prev.slice(0, -1)));
  };

  // Iniciar fluxo diretamente na atividade selecionada
  const handleSelectActivity = (activityId) => {
    if (activityId === 'form02') {
      showScreen('form02');
    } else if (activityId === 'game24') {
      setPhoneticIndex(0);
      setPhoneticAnswers([]);
      setPhoneticFeedback(null);
      setIsTypingCustom(false);
      setCustomWordInput('');
      showScreen('game24');
    } else if (activityId === 'rima45') {
      setRimaExampleFinished(false);
      setRimaIndex(0);
      setRimaAnswers([]);
      setRimaFeedback('');
      showScreen('rima45');
    } else if (activityId === 'check6') {
      showScreen('check6');
    }
  };

  // Jogo Fonético: registrar opção rápida ou digitação
  const handlePhoneticSelection = (option, didNotAnswer = false) => {
    const currentWord = phoneticWords[phoneticIndex];
    let record;

    if (didNotAnswer) {
      record = {
        word: currentWord.name,
        target: currentWord.target,
        spoken: 'Não respondeu',
        isCorrect: false,
        note: 'A criança não verbalizou (omissão total da resposta)',
      };
    } else if (typeof option === 'string') {
      // Texto digitado
      const cleaned = option.trim().toLowerCase();
      const isCorrect = cleaned === currentWord.target;
      record = {
        word: currentWord.name,
        target: currentWord.target,
        spoken: cleaned,
        isCorrect,
        note: isCorrect ? 'Pronúncia correta identificada' : `Produção registrada: "${cleaned}"`,
      };
    } else {
      record = {
        word: currentWord.name,
        target: currentWord.target,
        spoken: option.value,
        isCorrect: option.isCorrect,
        note: option.note,
      };
    }

    const nextAnswers = [...phoneticAnswers, record];
    setPhoneticAnswers(nextAnswers);
    setPhoneticFeedback(record);

    window.setTimeout(() => {
      setPhoneticFeedback(null);
      setIsTypingCustom(false);
      setCustomWordInput('');
      if (phoneticIndex + 1 >= phoneticWords.length) {
        finishPhoneticGame(nextAnswers);
      } else {
        setPhoneticIndex((prev) => prev + 1);
      }
    }, 1200);
  };

  const finishPhoneticGame = (answers) => {
    const trocas = answers.filter((a) => !a.isCorrect).length;
    let nivel = 'ESPERADO';
    if (trocas >= 3) nivel = 'ENCAMINHAR';
    else if (trocas >= 1) nivel = 'ATENCAO';

    const sessionRecord = {
      id: Date.now(),
      date: new Date().toLocaleDateString('pt-BR'),
      age: '2 a 4 anos',
      activity: 'Jogo Fonético',
      answers,
      score: `${answers.length - trocas}/${answers.length}`,
      nivel,
    };

    saveSessionResult(sessionRecord);
    showScreen('unified_result');
  };

  // Jogo da Rima: registrar resposta
  const handleRimaAnswer = (childSaidRimes) => {
    if (rimaFeedback) return;
    const currentPair = rimaPairs[rimaIndex];
    const isCorrect = childSaidRimes === currentPair.rima;

    const feedbackText = isCorrect
      ? `Resposta esperada. ${currentPair.w1} e ${currentPair.w2} ${currentPair.rima ? 'rimam' : 'não rimam'}.`
      : `Resposta registrada. ${currentPair.w1} e ${currentPair.w2} ${currentPair.rima ? 'rimam' : 'não rimam'}.`;

    setRimaFeedback(feedbackText);

    const record = {
      pair: `${currentPair.w1} e ${currentPair.w2}`,
      childSaidRimes,
      expectedRimes: currentPair.rima,
      isCorrect,
    };

    const nextAnswers = [...rimaAnswers, record];
    setRimaAnswers(nextAnswers);

    window.setTimeout(() => {
      setRimaFeedback('');
      if (rimaIndex + 1 >= rimaPairs.length) {
        finishRimaGame(nextAnswers);
      } else {
        setRimaIndex((prev) => prev + 1);
      }
    }, 1200);
  };

  const finishRimaGame = (answers) => {
    const acertos = answers.filter((a) => a.isCorrect).length;
    let nivel = 'ESPERADO';
    if (acertos <= 2) nivel = 'ENCAMINHAR';
    else if (acertos === 3) nivel = 'ATENCAO';

    const sessionRecord = {
      id: Date.now(),
      date: new Date().toLocaleDateString('pt-BR'),
      age: '4 a 5 anos',
      activity: 'Jogo da Rima',
      answers,
      score: `${acertos}/${answers.length}`,
      nivel,
    };

    saveSessionResult(sessionRecord);
    showScreen('unified_result');
  };

  const saveSessionResult = (record) => {
    setHistory((prev) => {
      const updated = [record, ...prev];
      try {
        window.localStorage.setItem('fonosync:triagem_history', JSON.stringify(updated));
      } catch (e) {
        console.error('Erro ao salvar histórico:', e);
      }
      return updated;
    });
  };

  // Download do relatório da triagem
  const downloadReportTxt = (rec) => {
    if (!rec) return;
    const lines = [
      'FONOSYNC — RESUMO DE RASTREIO FONOAUDIOLÓGICO',
      `Data: ${rec.date}`,
      `Faixa etária: ${rec.age}`,
      `Atividade: ${rec.activity}`,
      `Resultado: ${rec.nivel === 'ESPERADO' ? 'Dentro do esperado' : rec.nivel === 'ATENCAO' ? 'Pontos de Atenção' : 'Encaminhar para Avaliação'}`,
      `Desempenho: ${rec.score}`,
      '',
      'DETALHAMENTO:',
      ...rec.answers.map((a, i) => `${i + 1}. ${a.word || a.pair}: ${a.spoken || (a.childSaidRimes ? 'Rimam' : 'Não rimam')} — ${a.isCorrect ? 'Correto' : 'Troca/Dificuldade'}`),
      '',
      'ORIENTAÇÃO CLÍNICA:',
      'Este rastreio não é um diagnóstico. Ele apenas indica se vale a pena procurar um fonoaudiólogo para avaliação do desenvolvimento.',
    ];

    const blob = new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `rastreio-fonosync-${rec.id}.txt`;
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  const currentResult = history[0] || null;

  // ==========================================
  // TELA 1: HOME (ESCOLHA DA FAIXA ETÁRIA)
  // ==========================================
  const atividades = ATIVIDADES;

  const renderHomeScreen = () => (
    <div className="space-y-10">
      <div>
        <h1 className="display max-w-[16ch] text-[2.375rem] text-navy sm:text-[3rem]">
          Qual a idade da criança?
        </h1>
        <p className="mt-4 max-w-[56ch] text-[1.0625rem] leading-[1.6] text-muted">
          Atividades curtas, sem microfone e sem cadastro. Quem escuta a criança é você: escolha a
          faixa etária e siga as instruções na tela.
        </p>
      </div>

      <ul className="grid gap-4 sm:grid-cols-2">
        {atividades.map(({ Personagem, ...a }) => (
          <li key={a.id}>
            <button
              type="button"
              onClick={() => handleSelectActivity(a.id)}
              className={`group relative flex h-full w-full flex-col overflow-hidden rounded-[22px] rounded-bl-[5px] p-6 text-left text-on-pastel transition-transform duration-200 hover:-translate-y-0.5 ${a.campo}`}
            >
              <span className="flex items-start justify-between gap-4">
                <span>
                  <span className="display block text-[2.75rem]">{a.idade}</span>
                  <span className="text-[0.875rem] font-semibold opacity-75">anos</span>
                </span>
                <Personagem className="-mt-2 -mr-2 w-28 shrink-0 sm:w-32" animated={false} />
              </span>
              <span className="mt-4 block font-serif text-[1.5rem] leading-tight font-semibold">{a.titulo}</span>
              <span className="mt-1 block text-[0.875rem] font-semibold opacity-75">{a.quem}</span>
              <span className="mt-3 block max-w-[38ch] flex-1 text-[0.9375rem] leading-[1.55] opacity-85">{a.desc}</span>
              <span className="mt-5 inline-flex items-center gap-2 text-[0.9375rem] font-bold">
                Começar
                <ArrowRight size={17} aria-hidden="true" className="transition-transform group-hover:translate-x-1" />
              </span>
            </button>
          </li>
        ))}
      </ul>

      <p className="flex items-start gap-2 text-[0.875rem] leading-[1.55] text-muted">
        <Info size={17} aria-hidden="true" className="mt-0.5 shrink-0 text-primary" />
        O rastreio não é diagnóstico. Ele indica se vale a pena procurar um fonoaudiólogo para uma
        avaliação presencial.
      </p>
    </div>
  );

  // ==========================================
  // TELA 2: JOGO FONÉTICO (2 A 4 ANOS - BOTÕES RÁPIDOS)
  // ==========================================
  const renderGame24Screen = () => {
    const currentWord = phoneticWords[phoneticIndex];

    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <button type="button" onClick={goBack} className={buttonClass('tertiary')}>
            <ArrowLeft size={16} aria-hidden="true" /> Voltar
          </button>
          <div>
            <h2 className="font-serif text-2xl font-semibold text-navy">Jogo da Palavra · 2 a 4 anos</h2>
            <span className="text-sm text-muted">Trocas e simplificações na fala</span>
          </div>
        </div>

        <div className="overflow-hidden rounded-[22px] rounded-bl-[5px] border border-line bg-surface">
          <div className="on-dark flex items-center gap-4 bg-ocean px-6 py-5 text-white">
            <Tucano key={phoneticIndex} className={`w-20 shrink-0 ${phoneticFeedback?.isCorrect ? 'char-pula' : ''}`} galho={false} />
            <div>
              <h3 className="font-serif text-[1.375rem] font-semibold">Mostre a figura e pergunte: “O que é isso?”</h3>
              <p className="mt-1 text-[0.9375rem] text-white/85">Depois toque no que a criança falou. Não corrija, apenas registre.</p>
            </div>
          </div>

          <div className="p-8">
            <div className="mb-6 flex items-center justify-between gap-4 text-sm font-semibold text-muted">
              <span>Palavra {phoneticIndex + 1} de {phoneticWords.length}</span>
              <span className="flex gap-1" aria-hidden="true">
                {phoneticWords.map((w, i) => (
                  <span key={w.id} className={`h-1.5 w-6 rounded-full ${i <= phoneticIndex ? 'bg-primary' : 'bg-line'}`} />
                ))}
              </span>
            </div>

            {/* Imagem e Alvo */}
            <div className="mb-8 text-center">
              <div className="inline-block rounded-[26px] rounded-bl-[6px] bg-mel px-12 py-8 text-on-pastel">
                <div className="text-8xl" role="img" aria-label={currentWord.name.toLowerCase()}>{currentWord.emoji}</div>
                <div className="mt-3 font-serif text-4xl font-semibold">{currentWord.name}</div>
                <div className="mt-1 text-sm font-semibold opacity-75">Som-alvo: {currentWord.phonemes}</div>
              </div>
            </div>

            {/* Feedback da rodada */}
            {phoneticFeedback && (
              <div role="status" className={`mb-6 rounded-[14px] rounded-bl-[3px] p-4 text-center text-[0.9375rem] font-semibold text-on-pastel ${phoneticFeedback.isCorrect ? 'bg-salvia' : 'bg-coral/60'}`}>
                {phoneticFeedback.isCorrect ? 'Pronúncia esperada registrada.' : `Registrado: "${phoneticFeedback.spoken}" · ${phoneticFeedback.note}`}
              </div>
            )}

            {/* Botões Rápidos recomendados pela especificação */}
            {!isTypingCustom ? (
              <div className="space-y-4">
                <p className="text-center text-[0.9375rem] font-semibold text-ink">
                  O que a criança disse? Toque na opção mais próxima.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {currentWord.quickOptions.map((opt, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => handlePhoneticSelection(opt)}
                      className="rounded-[16px] rounded-bl-[4px] border-2 border-line bg-surface p-4 text-center text-lg font-bold text-ink transition-colors hover:border-primary hover:bg-salvia/40"
                    >
                      "{opt.label}"
                      <span className="block text-[0.6875rem] font-normal text-muted mt-1">{opt.note}</span>
                    </button>
                  ))}
                </div>

                <div className="flex flex-wrap justify-center gap-3 pt-4 border-t border-line">
                  <button
                    type="button"
                    onClick={() => handlePhoneticSelection(null, true)}
                    className={buttonClass('secondary')}
                  >
                    A criança não respondeu
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsTypingCustom(true)}
                    className={buttonClass('tertiary')}
                  >
                    Outra pronúncia... (Digitar)
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4 max-w-md mx-auto">
                <label htmlFor="pronuncia-digitada" className="block text-center text-[0.9375rem] font-semibold text-ink">
                  Digite exatamente como a criança pronunciou:
                </label>
                <div className="flex gap-2">
                  <input
                    id="pronuncia-digitada"
                    type="text"
                    value={customWordInput}
                    onChange={(e) => setCustomWordInput(e.target.value)}
                    placeholder="Ex.: faca, baca, tata..."
                    className="min-h-12 flex-1 rounded-[12px] rounded-bl-[3px] border-2 border-line bg-surface px-4 text-base font-bold focus:border-primary"
                  />
                  <button
                    type="button"
                    disabled={!customWordInput.trim()}
                    onClick={() => handlePhoneticSelection(customWordInput)}
                    className={buttonClass('primary')}
                  >
                    Confirmar
                  </button>
                </div>
                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => setIsTypingCustom(false)}
                    className="text-sm font-semibold text-primary underline-offset-4 hover:underline"
                  >
                    Voltar para as opções rápidas
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // ==========================================
  // TELA 4: JOGO DA RIMA (4 A 5 ANOS - COM EXEMPLO INICIAL)
  // ==========================================
  const renderRimaScreen = () => {
    // 1. Exemplo inicial explicativo sem pontuar conforme a especificação
    if (!rimaExampleFinished) {
      return (
        <div className="space-y-6 max-w-2xl mx-auto">
          <div className="flex items-center gap-4">
            <button type="button" onClick={goBack} className={buttonClass('tertiary')}>
              <ArrowLeft size={16} aria-hidden="true" /> Voltar
            </button>
            <h2 className="font-serif text-2xl font-semibold text-navy">Jogo da Rima · 4 a 5 anos</h2>
          </div>

          <div className="space-y-6 rounded-[22px] rounded-bl-[5px] border border-line bg-surface p-8 text-center">
            <Sagui className="mx-auto w-32" letra="r" />
            <h3 className="font-serif text-2xl font-semibold text-navy">Como funciona a brincadeira?</h3>
            <p className="text-base leading-relaxed text-muted">
              Vamos testar a percepção sonora da criança. Palavras rimam quando terminam com o mesmo som!
            </p>

            <div className="space-y-3 rounded-[18px] rounded-bl-[4px] bg-lavanda p-6 text-on-pastel">
              <span className="text-sm font-semibold opacity-80">Exemplo para treinar</span>
              <div className="flex items-center justify-center gap-6 font-serif text-3xl font-semibold">
                <span>GA<span className="text-coral-ink">TO</span></span>
                <span className="font-sans text-lg font-semibold opacity-70">e</span>
                <span>PA<span className="text-coral-ink">TO</span></span>
              </div>
              <p className="text-sm">
                Terminam com o mesmo som (<strong>-ATO</strong>), então <strong>SIM, elas rimam!</strong>
              </p>
            </div>

            <button
              type="button"
              onClick={() => setRimaExampleFinished(true)}
              className={`${buttonClass('primary', 'lg')} w-full`}
            >
              Entendi, começar as rodadas <ArrowRight size={18} aria-hidden="true" />
            </button>
          </div>
        </div>
      );
    }

    // 2. Rodadas valendo
    const currentPair = rimaPairs[rimaIndex];

    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <button type="button" onClick={goBack} className={buttonClass('tertiary')}>
            <ArrowLeft size={16} aria-hidden="true" /> Voltar
          </button>
          <h2 className="font-serif text-2xl font-semibold text-navy">Jogo da Rima</h2>
          <span className="text-sm font-semibold text-muted">Rodada {rimaIndex + 1} de {rimaPairs.length}</span>
        </div>

        <div className="overflow-hidden rounded-[22px] rounded-bl-[5px] border border-line bg-surface">
          <div className="on-dark flex items-center gap-4 bg-ocean px-6 py-5 text-white">
            <Tucano key={rimaIndex} className={`w-20 shrink-0 ${rimaFeedback ? 'char-pula' : ''}`} galho={false} />
            <div>
              <h3 className="font-serif text-[1.375rem] font-semibold">Essas palavras rimam?</h3>
              <p className="mt-1 text-[0.9375rem] text-white/85">Leia as duas em voz alta e pergunte o que a criança acha.</p>
            </div>
          </div>

          <div className="p-8">
            <div className="mb-8 flex flex-wrap items-center justify-center gap-5">
              <div className="min-w-[150px] flex-1 rounded-[22px] rounded-bl-[5px] bg-mel p-6 text-center text-on-pastel">
                <span className="mb-3 block text-6xl" role="img" aria-label={currentPair.w1.toLowerCase()}>{currentPair.e1}</span>
                <div className="font-serif text-3xl font-semibold">{currentPair.w1}</div>
              </div>
              <div className="font-serif text-2xl font-semibold text-muted">e</div>
              <div className="min-w-[150px] flex-1 rounded-[22px] rounded-bl-[5px] bg-lavanda p-6 text-center text-on-pastel">
                <span className="mb-3 block text-6xl" role="img" aria-label={currentPair.w2.toLowerCase()}>{currentPair.e2}</span>
                <div className="font-serif text-3xl font-semibold">{currentPair.w2}</div>
              </div>
            </div>

            <div className="mb-6 text-center">
              <p className="text-lg font-semibold text-ink">A criança respondeu que:</p>
              <div className="mt-5 flex flex-wrap justify-center gap-4">
                <button
                  type="button"
                  onClick={() => handleRimaAnswer(true)}
                  className={buttonClass('primary', 'lg')}
                >
                  <ThumbsUp size={18} aria-hidden="true" /> Sim, rimam
                </button>
                <button
                  type="button"
                  onClick={() => handleRimaAnswer(false)}
                  className={buttonClass('secondary', 'lg')}
                >
                  <ThumbsDown size={18} aria-hidden="true" /> Não rimam
                </button>
              </div>
            </div>

            {rimaFeedback && (
              <div role="status" className="rounded-[14px] rounded-bl-[3px] bg-salvia p-4 text-center text-[0.9375rem] font-semibold text-on-pastel">
                {rimaFeedback}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // ==========================================
  // TELA 5: RESULTADO UNIFICADO E ACOLHEDOR (SEÇÃO 7 DO MD)
  // ==========================================
  const renderUnifiedResultScreen = () => {
    if (!currentResult) {
      return (
        <div className="p-8 text-center">
          <p className="text-sm text-muted">Nenhum resultado de rastreio encontrado.</p>
          <button type="button" onClick={() => showScreen('home')} className="mt-4 text-sm font-bold text-primary">
            Voltar ao início
          </button>
        </div>
      );
    }

    const isEsperado = currentResult.nivel === 'ESPERADO';
    const isAtencao = currentResult.nivel === 'ATENCAO';

    return (
      <div className="mx-auto max-w-3xl space-y-6">
        <div className="flex items-center gap-4">
          <button type="button" onClick={() => showScreen('home')} className={buttonClass('tertiary')}>
            <ArrowLeft size={16} aria-hidden="true" /> Início
          </button>
          <h2 className="font-serif text-2xl font-semibold text-navy">Resultado do rastreio</h2>
        </div>

        <div className="overflow-hidden rounded-[22px] rounded-bl-[5px] border border-line bg-surface">
          {/* Cabeçalho por nível de atenção: cor e personagem, sem alarme */}
          <div className={`flex flex-col items-start gap-4 p-6 text-on-pastel sm:flex-row sm:items-end sm:justify-between ${isEsperado ? 'bg-salvia' : isAtencao ? 'bg-mel' : 'bg-coral'}`}>
            <div>
              <span className="text-sm font-semibold opacity-80">
                {currentResult.activity} · {currentResult.age}
              </span>
              <h3 className="mt-1 font-serif text-2xl font-semibold sm:text-3xl">
                {isEsperado ? 'Desenvolvimento dentro do esperado' : isAtencao ? 'Alguns pontos merecem atenção' : 'Vale conversar com um fonoaudiólogo'}
              </h3>
            </div>
            <Comemoracao>
              <Capivara acenando title="Capivara do FonoSync acenando" className="w-36 sm:w-40" />
            </Comemoracao>
          </div>

          <div className="p-6 md:p-8 space-y-6">
            {/* Texto Acolhedor conforme especificação */}
            <div className="space-y-3 text-base leading-relaxed text-ink">
              {isEsperado && (
                <p>
                  Para a faixa de <strong>{currentResult.age}</strong>, o desempenho ficou dentro do esperado. 
                  Continue conversando, lendo historinhas e brincando com cantigas no dia a dia. Se notar mudanças, você sempre pode fazer uma nova triagem.
                </p>
              )}
              {isAtencao && (
                <p>
                  Identificamos alguns pontos que merecem atenção para uma criança de <strong>{currentResult.age}</strong>. 
                  Isso nem sempre significa um problema; muitas vezes faz parte do ritmo próprio do desenvolvimento. 
                  Sugerimos observar nas próximas semanas e, se continuar, procurar um fonoaudiólogo para uma conversa tranquila.
                </p>
              )}
              {!isEsperado && !isAtencao && (
                <p>
                  Para uma criança de <strong>{currentResult.age}</strong>, alguns padrões observados indicam que seria muito benéfico conversar com um fonoaudiólogo. 
                  Procurar apoio cedo costuma facilitar muito o desenvolvimento da comunicação e a segurança da criança.
                </p>
              )}
            </div>

            {/* Aviso fixo obrigatório */}
            <p className="flex items-start gap-2 rounded-[14px] rounded-bl-[3px] bg-nevoa p-4 text-[0.875rem] font-semibold text-navy">
              <Info size={17} aria-hidden="true" className="mt-0.5 shrink-0 text-primary" />
              Este resultado não é um diagnóstico. Ele apenas indica se vale a pena procurar um fonoaudiólogo para avaliação.
            </p>

            {/* Detalhamento das rodadas */}
            {currentResult.answers && currentResult.answers.length > 0 && (
              <div className="space-y-3 pt-2">
                <h4 className="font-serif text-lg font-semibold text-navy">O que foi observado nesta atividade</h4>
                <div className="space-y-2">
                  {currentResult.answers.map((ans, idx) => (
                    <div key={idx} className="flex items-center justify-between gap-3 border-b border-line py-3 text-sm">
                      <div>
                        <strong className="text-navy">{ans.word || ans.pair}</strong>
                        <span className="text-muted block">{ans.spoken ? `Registrado: "${ans.spoken}"` : ans.childSaidRimes ? 'Criança disse que rima' : 'Criança disse que não rima'}</span>
                      </div>
                      <span className={`shrink-0 rounded-[8px] rounded-bl-[2px] px-2.5 py-1 text-xs font-bold text-on-pastel ${ans.isCorrect ? 'bg-salvia' : 'bg-mel'}`}>
                        {ans.isCorrect ? 'Dentro do padrão' : 'Atenção / Variação'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Ações */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-6 border-t border-line">
              <button
                type="button"
                onClick={() => showScreen('home')}
                className={buttonClass('secondary')}
              >
                <RotateCcw size={16} aria-hidden="true" /> Fazer outra atividade
              </button>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => downloadReportTxt(currentResult)}
                  className={buttonClass('tertiary')}
                >
                  <Download size={16} aria-hidden="true" /> Baixar relatório (TXT)
                </button>
                <a
                  href="#/profissional/pacientes"
                  className={buttonClass('primary')}
                >
                  <Search size={16} aria-hidden="true" /> Buscar fonoaudiólogo
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Formulário 0-2 anos (Marcos)
  const renderFormScreen = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button type="button" onClick={goBack} className={buttonClass('tertiary')}>
          <ArrowLeft size={16} aria-hidden="true" /> Voltar
        </button>
        <h2 className="font-serif text-2xl font-semibold text-navy">Marcos da comunicação · 0 a 2 anos</h2>
      </div>

      <div className="space-y-6 rounded-[22px] rounded-bl-[5px] border border-line bg-surface p-6 md:p-8">
        <div className="space-y-4">
          {formQuestions.map((item) => (
            <div key={item.id} role="group" aria-labelledby={`marco-${item.id}`} className="space-y-3 border-b border-line pb-5">
              <span className="text-sm font-semibold text-coral-ink">{item.category}</span>
              <p id={`marco-${item.id}`} className="text-base font-bold text-ink">{item.question}</p>
              <div className="flex flex-wrap gap-2">
                {item.options.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    aria-pressed={formAnswers[item.id] === opt.value}
                    onClick={() => setFormAnswers((prev) => ({ ...prev, [item.id]: opt.value }))}
                    className={`min-h-11 rounded-[10px] rounded-bl-[3px] border-[1.5px] px-4 text-sm font-bold transition-colors ${formAnswers[item.id] === opt.value ? 'border-primary bg-primary text-on-primary' : 'border-line bg-surface text-ink hover:border-primary/50'}`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={() => {
            const answersCount = Object.keys(formAnswers).length;
            if (answersCount < formQuestions.length) {
              alert('Por favor, responda todas as perguntas.');
              return;
            }
            const naos = Object.values(formAnswers).filter((v) => v === 'nao').length;
            const nivel = naos >= 2 ? 'ENCAMINHAR' : naos === 1 ? 'ATENCAO' : 'ESPERADO';
            saveSessionResult({
              id: Date.now(),
              date: new Date().toLocaleDateString('pt-BR'),
              age: '0 a 2 anos',
              activity: 'Formulário de Marcos',
              answers: formQuestions.map((q) => ({ word: q.category, spoken: formAnswers[q.id], isCorrect: formAnswers[q.id] === 'sim' })),
              score: `${formQuestions.length - naos}/${formQuestions.length}`,
              nivel,
            });
            showScreen('unified_result');
          }}
          className={`${buttonClass('primary', 'lg')} w-full`}
        >
          Ver o resultado <ArrowRight size={18} aria-hidden="true" />
        </button>
      </div>
    </div>
  );

  // Checklist 6+ anos (Professor)
  const renderCheckScreen = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button type="button" onClick={goBack} className={buttonClass('tertiary')}>
          <ArrowLeft size={16} aria-hidden="true" /> Voltar
        </button>
        <h2 className="font-serif text-2xl font-semibold text-navy">Checklist escolar · 6+ anos</h2>
      </div>

      <div className="space-y-6 rounded-[22px] rounded-bl-[5px] border border-line bg-surface p-6 md:p-8">
        <p className="text-[0.9375rem] text-muted">Marque os comportamentos observados nas últimas 3 semanas em sala:</p>
        <div className="space-y-3">
          {checklistItems.map((item, idx) => {
            const isChecked = !!checkListState[idx];
            return (
              <button
                key={idx}
                type="button"
                role="checkbox"
                aria-checked={isChecked}
                onClick={() => setCheckListState((prev) => ({ ...prev, [idx]: !prev[idx] }))}
                className={`flex w-full items-start gap-3 rounded-[14px] rounded-bl-[3px] border-[1.5px] p-4 text-left transition-colors ${isChecked ? 'border-primary bg-mel/50' : 'border-line bg-surface hover:border-primary/40'}`}
              >
                <span aria-hidden="true" className={`mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-[5px] border-[1.5px] ${isChecked ? 'border-primary bg-primary text-on-primary' : 'border-muted/60 bg-surface'}`}>
                  {isChecked && <Check size={13} strokeWidth={3} />}
                </span>
                <span className="text-[0.9375rem] font-semibold text-ink">{item}</span>
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={() => {
            const marked = Object.values(checkListState).filter(Boolean).length;
            const nivel = marked >= 3 ? 'ENCAMINHAR' : marked >= 1 ? 'ATENCAO' : 'ESPERADO';
            saveSessionResult({
              id: Date.now(),
              date: new Date().toLocaleDateString('pt-BR'),
              age: '6+ anos',
              activity: 'Checklist Escolar',
              answers: checklistItems.map((item, i) => ({ word: item, spoken: checkListState[i] ? 'Observado' : 'Não observado', isCorrect: !checkListState[i] })),
              score: `${checklistItems.length - marked}/${checklistItems.length}`,
              nivel,
            });
            showScreen('unified_result');
          }}
          className={`${buttonClass('primary', 'lg')} w-full`}
        >
          Ver o resultado <ArrowRight size={18} aria-hidden="true" />
        </button>
      </div>
    </div>
  );

  const abas = [
    { id: 'home', title: 'Início', badge: null },
    { id: 'form02', title: 'Marcos', badge: '0–2' },
    { id: 'game24', title: 'Jogo da Palavra', badge: '2–4' },
    { id: 'rima45', title: 'Jogo da Rima', badge: '4–5' },
    { id: 'check6', title: 'Checklist', badge: '6+' },
  ];

  return (
    <div className="min-h-screen bg-nevoa font-sans text-ink">
      <header className="on-dark bg-ocean-deep text-white">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-5 py-4 md:px-8">
          <a href="#/" aria-label="FonoSync, voltar à página inicial">
            <Logo tone="claro" />
          </a>
          <div className="flex flex-wrap items-center gap-2">
            <button type="button" onClick={() => setShowA11y(true)} className={buttonClass('claro')}>
              <PersonStanding size={17} aria-hidden="true" /> Acessibilidade
            </button>
            <button type="button" onClick={() => (isPlayerOpen ? stopSpeaking() : speakPageContent())} className={buttonClass('claro')}>
              <Volume2 size={17} aria-hidden="true" /> {isPlayerOpen ? 'Parar leitura' : 'Ouvir página'}
            </button>
          </div>
        </div>
        <nav className="mx-auto flex max-w-5xl gap-1 overflow-x-auto px-3 md:px-6" aria-label="Atividades por faixa etária">
          {abas.map((tab) => {
            const ativo = activeScreen === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                aria-current={ativo ? 'page' : undefined}
                onClick={() => {
                  if (tab.id === 'home') showScreen('home');
                  else handleSelectActivity(tab.id);
                }}
                className={`flex min-h-12 items-center gap-2 whitespace-nowrap border-b-[3px] px-3 text-[0.9375rem] font-semibold transition-colors ${ativo ? 'border-mel text-white' : 'border-transparent text-on-band-muted hover:text-white'}`}
              >
                {tab.title}
                {tab.badge && <span className={`rounded-[6px] rounded-bl-[2px] px-1.5 py-0.5 text-[0.6875rem] font-bold ${ativo ? 'bg-mel text-on-pastel' : 'bg-white/10'}`}>{tab.badge}</span>}
              </button>
            );
          })}
        </nav>
      </header>

      <main id="primary" className="mx-auto max-w-5xl px-5 py-8 md:px-8 md:py-12">
        {activeScreen === 'home' && renderHomeScreen()}
        {activeScreen === 'game24' && renderGame24Screen()}
        {activeScreen === 'rima45' && renderRimaScreen()}
        {activeScreen === 'form02' && renderFormScreen()}
        {activeScreen === 'check6' && renderCheckScreen()}
        {activeScreen === 'unified_result' && renderUnifiedResultScreen()}
      </main>

      <footer className="mx-auto max-w-5xl px-5 pb-10 text-[0.875rem] text-muted md:px-8">
        FonoSync · Rastreio fonoaudiológico. Não substitui a avaliação clínica profissional.
      </footer>

      <A11yModal isOpen={showA11y} onClose={() => setShowA11y(false)} />
    </div>
  );
}
