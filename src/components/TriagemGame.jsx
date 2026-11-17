import { useState } from 'react';
import {
  ArrowLeft,
  Download,
  RotateCcw,
  Search,
  Volume2,
} from 'lucide-react';
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
  const [screenStack, setScreenStack] = useState(['home']);

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
      ? `✅ Resposta correta! ${currentPair.w1} e ${currentPair.w2} ${currentPair.rima ? 'rimam' : 'não rimam'}.`
      : `❌ Resposta registrada. ${currentPair.w1} e ${currentPair.w2} ${currentPair.rima ? 'rimam' : 'não rimam'}.`;

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
  const renderHomeScreen = () => (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="font-serif text-3xl font-extrabold text-navy md:text-4xl">
          Rastreio Fonoaudiológico Precoce
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-base text-muted">
          Atividades lúdicas sem áudio para apoio a pais, familiares e educadores.
          Quem escuta a criança é você! Selecione a faixa etária para iniciar.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {[
          { id: 'form02', emoji: '👶', title: '0 – 2 anos', subtitle: 'Primeira Infância', game: '📋 Formulário de Marcos', desc: 'Verifica marcos de comunicação como balbucio, primeiras palavras e resposta a sons.' },
          { id: 'game24', emoji: '🐄', title: '2 – 4 anos', subtitle: 'Pré-Escolar Inicial', game: '🎮 Jogo Fonético', desc: 'Identifica trocas e simplificações comuns na fala através de opções rápidas ou digitação.' },
          { id: 'rima45', emoji: '🎵', title: '4 – 5 anos', subtitle: 'Pré-Escolar Avançado', game: '🎵 Jogo da Rima', desc: 'Avalia percepção de rimas e consciência fonológica com instruções narradas pelo adulto.' },
          { id: 'check6', emoji: '🏫', title: '6+ anos', subtitle: 'Ensino Fundamental', game: '✅ Checklist Escolar', desc: 'Observação de dificuldades persistentes na fala e no aprendizado em sala de aula.' },
        ].map((card, index) => (
          <div key={card.id} className="relative overflow-hidden rounded-[20px] border border-line bg-white p-6 text-center shadow-[0_8px_32px_rgba(0,0,0,0.13)] transition duration-200 hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(0,0,0,0.16)] flex flex-col justify-between">
            <div className="absolute inset-x-0 top-0 h-1.5" style={{ background: ['linear-gradient(90deg, #74b9ff, #0984e3)', 'linear-gradient(90deg, #fd79a8, #e84393)', 'linear-gradient(90deg, #55efc4, #00b894)', 'linear-gradient(90deg, #fdcb6e, #e17055)'][index] }} />
            <div>
              <span className="mb-4 block text-5xl">{card.emoji}</span>
              <div className="font-serif text-2xl font-extrabold text-navy">{card.title}</div>
              <div className="mt-1 text-sm font-semibold text-muted">{card.subtitle}</div>
              <div className="mt-4 rounded-xl bg-surface px-3 py-2 text-xs font-bold text-ink">{card.game}</div>
              <div className="mt-4 text-sm leading-relaxed text-muted">{card.desc}</div>
            </div>
            <button
              type="button"
              onClick={() => handleSelectActivity(card.id)}
              className="mt-6 w-full rounded-xl bg-[#0284C7] py-3 text-sm font-extrabold text-white transition hover:bg-sky-700 shadow-sm cursor-pointer"
            >
              Iniciar Atividade →
            </button>
          </div>
        ))}
      </div>
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
            <h2 className="font-serif text-2xl font-extrabold text-navy">Jogo Fonético (2 a 4 anos)</h2>
            <span className="text-xs text-muted">Triagem lúdica de trocas fonéticas</span>
          </div>
        </div>

        <div className="overflow-hidden rounded-[20px] border border-line bg-white shadow-[0_8px_32px_rgba(0,0,0,0.13)]">
          <div className="flex items-center gap-4 bg-gradient-to-r from-pink-500 to-rose-600 p-6 text-white">
            <div className="text-4xl">🎮</div>
            <div>
              <h3 className="font-serif text-2xl font-extrabold">Identificação de Trocas Fonéticas</h3>
              <p className="mt-1 text-sm text-white/90">
                Mostre a imagem para a criança e pergunte: <strong>"O que é isso?"</strong>. Registre abaixo o que ela falou.
              </p>
            </div>
          </div>

          <div className="p-8">
            <div className="mb-6 flex justify-between items-center text-xs font-bold text-muted">
              <span>Palavra {phoneticIndex + 1} de {phoneticWords.length}</span>
              <span className="rounded-full bg-pink-100 px-3 py-1 text-pink-700">Opções Rápidas sem Áudio</span>
            </div>

            {/* Imagem e Alvo */}
            <div className="mb-8 text-center">
              <div className="inline-block rounded-[24px] border-4 border-yellow-300 bg-gradient-to-br from-yellow-50 to-yellow-100 px-10 py-8 shadow-sm">
                <div className="text-8xl">{currentWord.emoji}</div>
                <div className="mt-3 font-serif text-3xl font-black text-navy">{currentWord.name}</div>
                <div className="mt-1 text-xs font-semibold text-muted">Som-alvo: {currentWord.phonemes}</div>
              </div>
            </div>

            {/* Feedback da rodada */}
            {phoneticFeedback && (
              <div className={`mb-6 p-4 rounded-xl text-center text-sm font-bold border ${phoneticFeedback.isCorrect ? 'bg-emerald-50 border-emerald-300 text-emerald-800' : 'bg-amber-50 border-amber-300 text-amber-800'}`}>
                {phoneticFeedback.isCorrect ? '✅ Pronúncia padrão registrada!' : `⚠️ Registrado: "${phoneticFeedback.spoken}" — ${phoneticFeedback.note}`}
              </div>
            )}

            {/* Botões Rápidos recomendados pela especificação */}
            {!isTypingCustom ? (
              <div className="space-y-4">
                <p className="text-sm font-bold text-slate-700 text-center">
                  O que a criança disse? (Toque na opção mais próxima):
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {currentWord.quickOptions.map((opt, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => handlePhoneticSelection(opt)}
                      className="rounded-2xl border-2 border-line bg-surface hover:border-pink-500 hover:bg-pink-50/50 p-4 text-center transition font-bold text-lg text-ink shadow-xs"
                    >
                      "{opt.label}"
                      <span className="block text-[11px] font-normal text-muted mt-1">{opt.note}</span>
                    </button>
                  ))}
                </div>

                <div className="flex flex-wrap justify-center gap-3 pt-4 border-t border-line">
                  <button
                    type="button"
                    onClick={() => handlePhoneticSelection(null, true)}
                    className="rounded-xl border border-slate-300 bg-slate-50 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100"
                  >
                    A criança não respondeu
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsTypingCustom(true)}
                    className="rounded-xl border border-pink-300 bg-pink-50 px-4 py-2 text-xs font-bold text-pink-700 hover:bg-pink-100"
                  >
                    Outra pronúncia... (Digitar)
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4 max-w-md mx-auto">
                <label className="block text-sm font-bold text-slate-700 text-center">
                  Digite exatamente como a criança pronunciou:
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={customWordInput}
                    onChange={(e) => setCustomWordInput(e.target.value)}
                    placeholder="Ex.: faca, baca, tata..."
                    className="flex-1 rounded-xl border-2 border-line px-4 py-3 text-base font-bold outline-none focus:border-pink-500"
                  />
                  <button
                    type="button"
                    disabled={!customWordInput.trim()}
                    onClick={() => handlePhoneticSelection(customWordInput)}
                    className="rounded-xl bg-pink-600 disabled:opacity-50 text-white px-5 py-3 font-bold text-sm"
                  >
                    Confirmar
                  </button>
                </div>
                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => setIsTypingCustom(false)}
                    className="text-xs font-bold text-muted hover:underline"
                  >
                    ← Voltar para opções rápidas
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
            <h2 className="font-serif text-2xl font-extrabold text-navy">Jogo da Rima (4 a 5 anos)</h2>
          </div>

          <div className="rounded-[20px] border border-line bg-white p-8 shadow-sm space-y-6 text-center">
            <div className="size-16 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-3xl mx-auto">
              🎵
            </div>
            <h3 className="font-serif text-2xl font-bold text-navy">Como funciona a brincadeira?</h3>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              Vamos testar a percepção sonora da criança. Palavras rimam quando terminam com o mesmo som!
            </p>

            <div className="rounded-2xl border-2 border-emerald-200 bg-emerald-50 p-6 space-y-3">
              <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-800">Exemplo para treinar</span>
              <div className="flex items-center justify-center gap-6 text-2xl font-black text-navy">
                <span>🐱 GATO</span>
                <span className="text-muted">e</span>
                <span>🦆 PATO</span>
              </div>
              <p className="text-xs text-emerald-900">
                Terminam com o mesmo som (<strong>-ATO</strong>), então <strong>SIM, elas rimam!</strong>
              </p>
            </div>

            <button
              type="button"
              onClick={() => setRimaExampleFinished(true)}
              className="w-full rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white py-3.5 text-base font-bold transition shadow-sm cursor-pointer"
            >
              Entendi! Começar as Rodadas →
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
          <h2 className="font-serif text-2xl font-extrabold text-navy">Jogo da Rima</h2>
          <span className="text-xs text-muted">Rodada {rimaIndex + 1} de {rimaPairs.length}</span>
        </div>

        <div className="overflow-hidden rounded-[20px] border border-line bg-white shadow-[0_8px_32px_rgba(0,0,0,0.13)]">
          <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-6 text-white text-center">
            <h3 className="font-serif text-2xl font-extrabold">Essas palavras rimam?</h3>
            <p className="mt-1 text-sm text-white/90">Leia em voz alta para a criança e pergunte o que ela acha:</p>
          </div>

          <div className="p-8">
            <div className="mb-8 flex flex-wrap items-center justify-center gap-5">
              <div className="min-w-[150px] flex-1 rounded-[20px] border-2 border-line bg-white p-6 text-center shadow-xs">
                <span className="mb-3 block text-6xl">{currentPair.e1}</span>
                <div className="font-serif text-3xl font-extrabold text-navy">{currentPair.w1}</div>
              </div>
              <div className="text-3xl font-black text-muted">VS</div>
              <div className="min-w-[150px] flex-1 rounded-[20px] border-2 border-line bg-white p-6 text-center shadow-xs">
                <span className="mb-3 block text-6xl">{currentPair.e2}</span>
                <div className="font-serif text-3xl font-extrabold text-navy">{currentPair.w2}</div>
              </div>
            </div>

            <div className="mb-6 text-center">
              <p className="text-xl font-bold text-ink">
                🎤 A criança respondeu que:
              </p>
              <div className="mt-5 flex flex-wrap justify-center gap-4">
                <button
                  type="button"
                  onClick={() => handleRimaAnswer(true)}
                  className="rounded-2xl bg-emerald-600 hover:bg-emerald-700 px-8 py-4 text-lg font-extrabold text-white shadow-sm transition"
                >
                  👍 SIM, rimam!
                </button>
                <button
                  type="button"
                  onClick={() => handleRimaAnswer(false)}
                  className="rounded-2xl bg-orange-600 hover:bg-orange-700 px-8 py-4 text-lg font-extrabold text-white shadow-sm transition"
                >
                  👎 NÃO rimam
                </button>
              </div>
            </div>

            {rimaFeedback && (
              <div className="rounded-xl border border-emerald-300 bg-emerald-50 p-4 text-center text-sm font-bold text-emerald-800">
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
          <button type="button" onClick={() => showScreen('home')} className="mt-4 text-sm font-bold text-[#0284C7]">
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
          <h2 className="font-serif text-2xl font-extrabold text-navy">Resultado do Rastreio</h2>
        </div>

        <div className="overflow-hidden rounded-[20px] border border-line bg-white shadow-sm">
          {/* Header por nível de atenção */}
          <div className={`p-6 text-white ${isEsperado ? 'bg-gradient-to-r from-emerald-500 to-teal-600' : isAtencao ? 'bg-gradient-to-r from-amber-500 to-orange-600' : 'bg-gradient-to-r from-rose-500 to-pink-600'}`}>
            <span className="text-xs font-bold uppercase tracking-wider text-white/90">
              {currentResult.activity} · {currentResult.age}
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl font-extrabold mt-1">
              {isEsperado ? 'Desenvolvimento Dentro do Esperado' : isAtencao ? 'Pontos que Merecem Atenção' : 'Recomendamos Conversar com Fonoaudiólogo'}
            </h3>
          </div>

          <div className="p-6 md:p-8 space-y-6">
            {/* Texto Acolhedor conforme especificação */}
            <div className="text-sm sm:text-base leading-relaxed text-slate-700 space-y-3">
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
            <div className="rounded-xl border border-sky-200 bg-sky-50 p-4 text-xs font-bold text-sky-900 text-center">
              ⚠️ Este resultado não é um diagnóstico. Ele apenas indica se vale a pena procurar um fonoaudiólogo para avaliação.
            </div>

            {/* Detalhamento das rodadas */}
            {currentResult.answers && currentResult.answers.length > 0 && (
              <div className="space-y-3 pt-2">
                <h4 className="font-serif text-base font-bold text-navy">O que foi observado nesta atividade:</h4>
                <div className="space-y-2">
                  {currentResult.answers.map((ans, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 rounded-xl border border-line bg-surface text-xs">
                      <div>
                        <strong className="text-navy">{ans.word || ans.pair}</strong>
                        <span className="text-muted block">{ans.spoken ? `Registrado: "${ans.spoken}"` : ans.childSaidRimes ? 'Criança disse que rima' : 'Criança disse que não rima'}</span>
                      </div>
                      <span className={`px-2.5 py-0.5 rounded-full font-bold ${ans.isCorrect ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
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
                <RotateCcw size={16} /> Fazer Outra Atividade
              </button>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => downloadReportTxt(currentResult)}
                  className={buttonClass('tertiary')}
                >
                  <Download size={16} /> Baixar Relatório (TXT)
                </button>
                <a
                  href="#/profissional/pacientes"
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#0284C7] hover:bg-sky-700 text-white font-bold text-xs shadow-xs transition"
                >
                  <Search size={14} /> Buscar Fonoaudiólogo
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
        <h2 className="font-serif text-2xl font-extrabold text-navy">Formulário de Marcos (0 a 2 anos)</h2>
      </div>

      <div className="rounded-[20px] border border-line bg-white p-6 md:p-8 space-y-6 shadow-sm">
        <div className="space-y-4">
          {formQuestions.map((item) => (
            <div key={item.id} className="p-4 rounded-xl border border-line bg-surface space-y-3">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#0284C7]">{item.category}</span>
              <p className="text-base font-bold text-ink">{item.question}</p>
              <div className="flex flex-wrap gap-2">
                {item.options.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setFormAnswers((prev) => ({ ...prev, [item.id]: opt.value }))}
                    className={`px-3 py-2 rounded-xl text-xs font-bold border transition ${formAnswers[item.id] === opt.value ? 'bg-[#0284C7] text-white border-[#0284C7]' : 'bg-white text-slate-700 border-line hover:border-slate-400'}`}
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
          className="w-full rounded-xl bg-[#0284C7] text-white font-bold py-3 hover:bg-sky-700 transition"
        >
          Finalizar Formulário e Ver Parecer →
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
        <h2 className="font-serif text-2xl font-extrabold text-navy">Checklist Escolar (6+ anos)</h2>
      </div>

      <div className="rounded-[20px] border border-line bg-white p-6 md:p-8 space-y-6 shadow-sm">
        <p className="text-xs text-muted">Marque os comportamentos observados nas últimas 3 semanas em sala:</p>
        <div className="space-y-3">
          {checklistItems.map((item, idx) => {
            const isChecked = !!checkListState[idx];
            return (
              <button
                key={idx}
                type="button"
                onClick={() => setCheckListState((prev) => ({ ...prev, [idx]: !prev[idx] }))}
                className={`w-full text-left p-4 rounded-xl border flex items-start gap-3 transition ${isChecked ? 'bg-amber-50 border-amber-300' : 'bg-surface border-line'}`}
              >
                <div className={`size-5 rounded border flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold ${isChecked ? 'bg-amber-500 text-white border-amber-500' : 'bg-white border-slate-300'}`}>
                  {isChecked ? '✓' : ''}
                </div>
                <span className="text-sm font-semibold text-slate-800">{item}</span>
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
          className="w-full rounded-xl bg-[#0284C7] text-white font-bold py-3 hover:bg-sky-700 transition"
        >
          Finalizar Checklist e Ver Parecer →
        </button>
      </div>
    </div>
  );

  return (
    <div className="mx-auto w-full max-w-5xl overflow-hidden rounded-2xl border border-line bg-canvas font-sans text-ink shadow-xl">
      <header className="flex flex-wrap items-center justify-between gap-4 border-b border-line bg-band px-6 py-4 text-white">
        <div className="flex items-center gap-3">
          <div className="flex size-12 items-center justify-center rounded-xl bg-white/10 text-2xl">🎙️</div>
          <div>
            <div className="font-serif text-2xl font-extrabold leading-none">FonoSync</div>
            <div className="text-[11px] font-medium uppercase tracking-[0.12em] text-white/80">Módulo de Rastreio Fonoaudiológico</div>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button type="button" onClick={() => setShowA11y(true)} className="flex min-h-11 items-center gap-2 rounded-md border border-white/30 px-3 text-xs font-bold text-white hover:bg-white/10">
            <span aria-hidden="true">♿</span> Acessibilidade
          </button>
          <button type="button" onClick={() => (isPlayerOpen ? stopSpeaking() : speakPageContent())} className="flex min-h-11 items-center gap-2 rounded-md border border-white/30 px-3 text-xs font-bold text-white hover:bg-white/10">
            <Volume2 size={16} aria-hidden="true" /> {isPlayerOpen ? 'Parar leitura' : 'Ouvir página'}
          </button>
        </div>
      </header>

      <nav className="flex gap-1 overflow-x-auto border-b-2 border-line bg-white px-6" aria-label="Navegação por faixa etária">
        {[
          { id: 'home', title: 'Início', badge: null },
          { id: 'form02', title: 'Marcos', badge: '0–2 anos' },
          { id: 'game24', title: 'Jogo Fonético', badge: '2–4 anos' },
          { id: 'rima45', title: 'Jogo da Rima', badge: '4–5 anos' },
          { id: 'check6', title: 'Checklist', badge: '6+ anos' },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => {
              if (tab.id === 'home') showScreen('home');
              else handleSelectActivity(tab.id);
            }}
            className={`flex items-center gap-2 whitespace-nowrap border-b-[3px] px-5 py-4 text-sm font-extrabold transition ${activeScreen === tab.id ? 'border-[#0284C7] text-[#0284C7]' : 'border-transparent text-muted hover:text-navy'}`}
          >
            <span>{tab.id === 'home' ? '🏠' : tab.id === 'form02' ? '👶' : tab.id === 'game24' ? '🎮' : tab.id === 'rima45' ? '🎵' : '🏫'}</span>
            {tab.title}
            {tab.badge && <span className={`rounded-full px-2 py-0.5 text-[10px] font-black ${activeScreen === tab.id ? 'bg-[#0284C7] text-white' : 'bg-surface text-muted'}`}>{tab.badge}</span>}
          </button>
        ))}
      </nav>

      <main className="bg-canvas p-4 md:p-8">
        {activeScreen === 'home' && renderHomeScreen()}
        {activeScreen === 'game24' && renderGame24Screen()}
        {activeScreen === 'rima45' && renderRimaScreen()}
        {activeScreen === 'form02' && renderFormScreen()}
        {activeScreen === 'check6' && renderCheckScreen()}
        {activeScreen === 'unified_result' && renderUnifiedResultScreen()}
      </main>

      <footer className="bg-band px-4 py-4 text-center text-xs font-semibold text-white/80">
        <strong className="text-white">FonoSync</strong> — Triagem e rastreio fonoaudiológico. Não substitui avaliação clínica profissional.
      </footer>

      <A11yModal isOpen={showA11y} onClose={() => setShowA11y(false)} />
    </div>
  );
}
