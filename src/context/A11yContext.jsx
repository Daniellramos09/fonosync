import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { A11yContext } from '../hooks/useA11y';
import { clearReadingHighlight, collectPageText, highlightWordAt, splitPageText } from '../utils/readingHighlight';
import {
  A11Y_STORAGE_KEY,
  BUTTON_OPTIONS,
  COLOR_MODE_OPTIONS,
  DEFAULT_SETTINGS,
  DEFAULT_VOICE,
  FONT_MAX,
  FONT_MIN,
  FONT_STEP,
  LEADING_OPTIONS,
  SPEECH_RATE_MAX,
  SPEECH_RATE_MIN,
  SPEECH_RATE_STEP,
  TEXT_OPTIONS,
  TRACKING_OPTIONS,
  VOICE_OPTIONS,
} from '../utils/constants';

const validRate = (value) => Number(value) >= SPEECH_RATE_MIN && Number(value) <= SPEECH_RATE_MAX;
const roundRate = (value) => Math.round(Number(value) / SPEECH_RATE_STEP) * SPEECH_RATE_STEP;

function loadPreferences() {
  const fallback = { settings: DEFAULT_SETTINGS, voice: DEFAULT_VOICE };

  try {
    const raw = JSON.parse(window.localStorage.getItem(A11Y_STORAGE_KEY));
    if (!raw || typeof raw !== 'object') return fallback;

    const settings = { ...DEFAULT_SETTINGS };

    const font = Number(raw.fontPercent);
    if (font >= FONT_MIN && font <= FONT_MAX) {
      settings.fontPercent = Math.round(font / FONT_STEP) * FONT_STEP;
    }

    ['highContrast', 'darkMode', 'reduceMotion', 'largeTargets'].forEach((key) => {
      settings[key] = raw[key] === true;
    });

    if (COLOR_MODE_OPTIONS.some((option) => option.value === raw.colorMode)) settings.colorMode = raw.colorMode;
    if ([...BUTTON_OPTIONS.light, ...BUTTON_OPTIONS.dark].some((option) => option.id === raw.buttonColor)) settings.buttonColor = raw.buttonColor;
    if ([...TEXT_OPTIONS.light, ...TEXT_OPTIONS.dark].some((option) => option.id === raw.textColor)) settings.textColor = raw.textColor;
    if (LEADING_OPTIONS.some((option) => option.value === raw.leading)) settings.leading = raw.leading;
    if (TRACKING_OPTIONS.some((option) => option.value === raw.tracking)) settings.tracking = raw.tracking;

    const voice = {
      gender: VOICE_OPTIONS.some((option) => option.value === raw.voiceGender) ? raw.voiceGender : DEFAULT_VOICE.gender,
      rate: validRate(raw.speechRate) ? roundRate(raw.speechRate) : DEFAULT_VOICE.rate,
    };

    return { settings, voice };
  } catch {
    return fallback;
  }
}

function setAttr(root, name, value) {
  if (value) root.setAttribute(name, value);
  else root.removeAttribute(name);
}

function setVar(root, name, value) {
  if (value) root.style.setProperty(name, value);
  else root.style.removeProperty(name);
}

function applyToDocument(settings) {
  const root = document.documentElement;

  root.style.fontSize = `${settings.fontPercent}%`;
  setAttr(root, 'data-theme', settings.darkMode && 'dark');
  setAttr(root, 'data-contrast', settings.highContrast && 'high');
  setAttr(root, 'data-motion', settings.reduceMotion && 'reduce');
  setAttr(root, 'data-targets', settings.largeTargets && 'large');

  const leading = settings.leading !== 'normal' ? settings.leading : null;
  setAttr(root, 'data-leading', leading);
  setVar(root, '--a11y-leading', leading);

  const tracking = settings.tracking !== 'normal' ? settings.tracking : null;
  setAttr(root, 'data-tracking', tracking);
  setVar(root, '--a11y-tracking', tracking);

  setAttr(root, 'data-color-vision', settings.colorMode !== 'default' && settings.colorMode);

  const theme = settings.darkMode ? 'dark' : 'light';
  const buttonHex = !settings.highContrast && BUTTON_OPTIONS[theme].find((option) => option.id === settings.buttonColor)?.hex;
  setAttr(root, 'data-a11y-button', buttonHex && settings.buttonColor);
  setVar(root, '--a11y-button', buttonHex);

  const textHex = !settings.highContrast && TEXT_OPTIONS[theme].find((option) => option.id === settings.textColor)?.hex;
  setAttr(root, 'data-a11y-text', textHex && settings.textColor);
  setVar(root, '--a11y-text', textHex);
}

/* ------------------------------------------------------------ leitura por voz */

// média de caracteres falados por segundo na velocidade 1x
const CHARS_PER_SECOND = 14;
// se a voz não começar nesse tempo, ela travou: tenta com outra
const START_TIMEOUT_MS = 5000;
// erros em que vale trocar de voz e tentar de novo
const RETRY_ERRORS = ['synthesis-failed', 'synthesis-unavailable', 'network', 'voice-unavailable', 'language-unavailable', 'audio-busy'];

const supportsSpeech = () => typeof window !== 'undefined' && 'speechSynthesis' in window;

function splitIntoChunks(text) {
  const cleaned = text.replace(/\s+/g, ' ').trim();
  const sentences = cleaned.match(/[^.!?]+[.!?]+(\s|$)|[^.!?]+$/g) || [cleaned];
  return sentences.map(s => s.trim()).filter(Boolean);
}

// nomes das vozes em português de Windows/Edge, macOS/iOS, Chrome e Android
const MALE_VOICE = /\b(male|masculin[oa]?|homem)\b|daniel|felipe|ricardo|ant[oô]nio|donato|f[aá]bio|humberto|j[uú]lio|leandro|nicolau|val[eé]rio|thiago|duarte|eddy|reed|rocko|grandpa|pt-br-x-ptd|pt-br-x-pte|pt-pt-x-jmn|pt-pt-x-pmj/i;
const FEMALE_VOICE = /female|feminin[oa]?|mulher|luciana|fernanda|maria|francisca|helena|helo[ií]sa|h[eé]lia|thalita|brenda|giovanna|leila|let[ií]cia|manuela|yara|elza|joana|catarina|raquel|google portugu[eê]s|\bflo\b|sandy|shelley|grandma|pt-br-x-afs|pt-br-x-pmj|pt-pt-x-sfs/i;
// sem voz do tipo pedido no aparelho, muda o tom da voz disponível para diferenciar
const FALLBACK_PITCH = { male: 0.55, female: 1.35 };

const isPortuguese = (voice) => /^pt([-_]|$)/i.test(voice.lang || '');
const isBrazilian = (voice) => /^pt[-_]br$/i.test(voice.lang || '');
const voiceKey = (voice) => voice.voiceURI || voice.name;

// vozes neurais (Edge) e do Google soam mais humanas, mas dependem de internet;
// por isso as vozes instaladas no aparelho vêm logo atrás e entram se a online falhar
function voiceScore(voice) {
  // português do Brasil sempre antes do de Portugal
  let score = isBrazilian(voice) ? 10 : 0;
  if (/natural|neural/i.test(voice.name)) score += 4;
  else if (/google/i.test(voice.name)) score += 2;
  if (voice.localService) score += 1;
  if (voice.default) score += 0.5;
  return score;
}

const matches = (pattern, voice) => pattern.test(voice.name) || pattern.test(voiceKey(voice));

function resolveVoice(voices, gender, failed = new Set()) {
  const usable = voices.filter((voice) => !failed.has(voiceKey(voice)));
  const portuguese = usable.filter(isPortuguese).sort((first, second) => voiceScore(second) - voiceScore(first));

  const wanted = gender === 'male' ? MALE_VOICE : FEMALE_VOICE;
  const other = gender === 'male' ? FEMALE_VOICE : MALE_VOICE;

  // 1. voz em português do tipo pedido
  const exact = portuguese.find((voice) => matches(wanted, voice) && !matches(other, voice));
  if (exact) return { voice: exact, pitch: 1, exact: true };

  // 2. voz em português sem gênero conhecido (ex.: Android): tom ajustado para o tipo pedido
  const unknown = portuguese.find((voice) => !matches(other, voice));
  // (essas vozes padrão costumam ser femininas, então só a masculina muda de tom)
  if (unknown) return { voice: unknown, pitch: gender === 'male' ? FALLBACK_PITCH.male : 1, exact: gender !== 'male' };

  // 3. só há voz do outro tipo: usa com o tom bem diferente para a troca ser perceptível
  // (sem voz em português nenhuma, o navegador escolhe pelo idioma pt-BR)
  return { voice: portuguese[0] || null, pitch: FALLBACK_PITCH[gender] ?? 1, exact: false };
}

export function A11yProvider({ children }) {
  const [initial] = useState(loadPreferences);

  const [settings, setSettings] = useState(initial.settings);
  const [saved, setSaved] = useState(initial.settings);
  const [saveStatus, setSaveStatus] = useState(null);

  const [voiceGender, setVoiceGender] = useState(initial.voice.gender);
  const [speechRate, setSpeechRate] = useState(initial.voice.rate);
  const [savedVoice, setSavedVoice] = useState(initial.voice);
  const [availableVoices, setAvailableVoices] = useState([]);

  const [playerStatus, setPlayerStatus] = useState('idle');
  const [playerOpen, setPlayerOpen] = useState(false);
  const [pageTitle, setPageTitle] = useState('');
  const [volume, setVolumeState] = useState(1);
  const [spokenChars, setSpokenChars] = useState(0);
  const [totalChars, setTotalChars] = useState(0);
  const [speechError, setSpeechError] = useState(null);

  const runRef = useRef(0);
  const chunkStartRef = useRef(0);
  const chunksRef = useRef([]);
  const startsRef = useRef([]);
  const pageRef = useRef(null);
  const indexRef = useRef(0);
  // a fala em andamento fica guardada: sem isso o Chrome pode descartá-la e cortar a leitura
  const utteranceRef = useRef(null);
  const watchdogRef = useRef(null);
  const failedVoicesRef = useRef(new Set());
  const liveRef = useRef({
    rate: speechRate,
    gender: voiceGender,
    voices: [],
    volume: 1,
  });

  useEffect(() => {
    liveRef.current = { rate: speechRate, gender: voiceGender, voices: availableVoices, volume };
  }, [speechRate, voiceGender, availableVoices, volume]);

  useLayoutEffect(() => {
    applyToDocument(settings);
  }, [settings]);

  const updateSettings = useCallback((patch) => {
    setSettings((current) => ({ ...current, ...patch }));
    setSaveStatus(null);
  }, []);

  const hasUnsavedChanges =
    Object.keys(settings).some((key) => settings[key] !== saved[key]) ||
    voiceGender !== savedVoice.gender ||
    speechRate !== savedVoice.rate;

  const savePreferences = () => {
    setSaved(settings);
    setSavedVoice({ gender: voiceGender, rate: speechRate });

    try {
      window.localStorage.setItem(A11Y_STORAGE_KEY, JSON.stringify({ ...settings, voiceGender, speechRate }));
      setSaveStatus('success');
    } catch {
      setSaveStatus('warning');
    }
  };

  const resetDefaults = () => {
    setSettings(DEFAULT_SETTINGS);
    setSaved(DEFAULT_SETTINGS);
    setSavedVoice(DEFAULT_VOICE);
    setVoiceGender(DEFAULT_VOICE.gender);
    setSpeechRate(DEFAULT_VOICE.rate);
    liveRef.current = { ...liveRef.current, gender: DEFAULT_VOICE.gender, rate: DEFAULT_VOICE.rate };

    try {
      window.localStorage.removeItem(A11Y_STORAGE_KEY);
    } catch {
      // sem armazenamento, nada para limpar
    }
    setSaveStatus('reset');
  };

  const clearWatchdog = () => {
    if (watchdogRef.current) clearTimeout(watchdogRef.current);
    watchdogRef.current = null;
  };

  useEffect(() => {
    if (!supportsSpeech()) return undefined;
    const synth = window.speechSynthesis;

    const updateVoices = () => {
      const voices = synth.getVoices() || [];
      setAvailableVoices(voices);
    };

    updateVoices();
    // alguns navegadores (Chrome no Android, Safari) carregam as vozes aos poucos
    if (synth.addEventListener) synth.addEventListener('voiceschanged', updateVoices);
    else synth.onvoiceschanged = updateVoices;
    const retry = setTimeout(updateVoices, 1000);

    const stopOnNavigate = () => {
      runRef.current += 1;
      clearWatchdog();
      synth.cancel();
      clearReadingHighlight();
      setPlayerStatus('idle');
      setPlayerOpen(false);
    };

    window.addEventListener('hashchange', stopOnNavigate);

    return () => {
      clearTimeout(retry);
      if (synth.removeEventListener) synth.removeEventListener('voiceschanged', updateVoices);
      else synth.onvoiceschanged = null;
      window.removeEventListener('hashchange', stopOnNavigate);
      clearWatchdog();
      synth.cancel();
      clearReadingHighlight();
    };
  }, []);

  // monta uma fala com a voz, velocidade e volume atuais
  const buildUtterance = (text) => {
    const live = liveRef.current;
    const voices = live.voices.length ? live.voices : window.speechSynthesis.getVoices() || [];
    const utterance = new SpeechSynthesisUtterance(text);
    const { voice, pitch } = resolveVoice(voices, live.gender, failedVoicesRef.current);
    if (voice) {
      utterance.voice = voice;
      utterance.lang = voice.lang;
    } else {
      utterance.lang = 'pt-BR';
    }
    utterance.pitch = pitch;
    utterance.rate = live.rate;
    utterance.volume = live.volume;
    return { utterance, voice };
  };

  /*
   * Fala imediatamente quando o sintetizador está livre. Isso é essencial no celular:
   * iPhone e Android só liberam o áudio se a fala começar dentro do próprio toque.
   * Só espera um instante quando precisa interromper uma fala anterior (o Chrome
   * engole a fala nova se ela vier colada ao cancel()).
   */
  const dispatch = (utterance, runId) => {
    const synth = window.speechSynthesis;
    const busy = synth.speaking || synth.pending;
    if (busy) synth.cancel();

    const go = () => {
      if (runRef.current !== runId) return;
      if (synth.paused) synth.resume();
      utteranceRef.current = utterance;
      synth.speak(utterance);
    };

    if (busy) setTimeout(go, 150);
    else go();
  };

  const charsBefore = (index) => chunksRef.current.slice(0, index).reduce((sum, chunk) => sum + chunk.length, 0);

  const failSpeech = (reason) => {
    clearWatchdog();
    clearReadingHighlight();
    setSpeechError(reason);
    setPlayerStatus('idle');
  };

  const speakChunk = (index) => {
    if (!supportsSpeech()) return;
    runRef.current += 1;
    const runId = runRef.current;
    clearWatchdog();

    if (index >= chunksRef.current.length) {
      window.speechSynthesis.cancel();
      clearReadingHighlight();
      setSpokenChars(0);
      setPlayerStatus('done');
      return;
    }

    const text = chunksRef.current[index];
    // trecho sem letras (ex.: "—") pode terminar sem som; não é falha da voz
    if (!/[\p{L}\p{N}]/u.test(text)) {
      speakChunk(index + 1);
      return;
    }

    const { utterance, voice } = buildUtterance(text);
    let started = false;

    // a voz escolhida travou ou falhou: marca e tenta a mesma frase com outra
    const retryWithAnotherVoice = () => {
      if (runRef.current !== runId) return;
      if (voice) {
        failedVoicesRef.current.add(voiceKey(voice));
        speakChunk(index);
      } else {
        failSpeech('unavailable');
      }
    };

    const page = pageRef.current;
    const start = startsRef.current[index];
    if (page) {
      highlightWordAt(page, start);
      utterance.onboundary = (event) => {
        if (runRef.current === runId && event.name === 'word') highlightWordAt(page, start + event.charIndex);
      };
    }

    utterance.onstart = () => {
      if (runRef.current !== runId) return;
      started = true;
      clearWatchdog();
      chunkStartRef.current = Date.now();
    };
    // o cancel() também dispara onend e onerror, então falas antigas são ignoradas
    utterance.onend = () => {
      if (runRef.current !== runId) return;
      // terminou sem nunca ter começado: a voz não funcionou
      if (!started && voice) {
        retryWithAnotherVoice();
        return;
      }
      speakChunk(index + 1);
    };
    utterance.onerror = (event) => {
      if (runRef.current !== runId || event.error === 'interrupted' || event.error === 'canceled') return;
      if (event.error === 'not-allowed') {
        failSpeech('blocked');
        return;
      }
      if (RETRY_ERRORS.includes(event.error) || !started) {
        retryWithAnotherVoice();
        return;
      }
      failSpeech('unavailable');
    };

    indexRef.current = index;
    chunkStartRef.current = 0;
    setSpokenChars(charsBefore(index));
    setSpeechError(null);
    setPlayerStatus('playing');

    dispatch(utterance, runId);

    watchdogRef.current = setTimeout(() => {
      if (runRef.current !== runId || started) return;
      // em alguns Android o onstart não dispara, mas a voz está saindo
      if (window.speechSynthesis.speaking && !voice) return;
      window.speechSynthesis.cancel();
      retryWithAnotherVoice();
    }, START_TIMEOUT_MS);
  };

  const startReading = (customText) => {
    if (!supportsSpeech()) {
      alert('Seu navegador não suporta leitura por síntese de voz.');
      return;
    }

    let chunks;
    if (typeof customText === 'string') {
      pageRef.current = null;
      chunks = splitIntoChunks(customText);
    } else {
      const page = collectPageText(document.querySelector('main') || document.body);
      const parts = splitPageText(page.text);
      pageRef.current = page;
      startsRef.current = parts.map((part) => part.start);
      chunks = parts.map((part) => part.text);
      const heading = document.querySelector('main h1') || document.querySelector('h1');
      setPageTitle(heading?.innerText.trim() || document.title);
      setPlayerOpen(true);
    }
    if (chunks.length === 0) return;

    chunksRef.current = chunks;
    setTotalChars(chunks.reduce((sum, chunk) => sum + chunk.length, 0));
    speakChunk(0);
  };

  function stopAudio() {
    runRef.current += 1;
    clearWatchdog();
    if (supportsSpeech()) window.speechSynthesis.cancel();
    clearReadingHighlight();
    setSpokenChars(0);
    setPlayerStatus('idle');
  }

  const closePlayer = () => {
    stopAudio();
    setSpeechError(null);
    setPlayerOpen(false);
  };

  const speakPageContent = (customText) => {
    if (playerOpen && typeof customText !== 'string') {
      closePlayer();
      return;
    }
    startReading(customText);
  };

  const playAudio = () => {
    if (playerStatus === 'paused') speakChunk(indexRef.current);
    else if (playerStatus !== 'playing') startReading();
  };

  // pausar para a frase atual; ao continuar, ela recomeça do início
  // (pause()/resume() nativos não funcionam no Android, por isso o cancel)
  const pauseAudio = () => {
    if (playerStatus !== 'playing') return;
    runRef.current += 1;
    clearWatchdog();
    window.speechSynthesis.cancel();
    setPlayerStatus('paused');
  };

  // fala um texto curto (palavras dos jogos, teste de voz), sem abrir o leitor
  const speakShort = (text, attempt = 0) => {
    if (!supportsSpeech() || !text) return;
    runRef.current += 1;
    const runId = runRef.current;
    clearWatchdog();
    clearReadingHighlight();
    if (playerStatus === 'playing') setPlayerStatus('idle');

    const { utterance, voice } = buildUtterance(text);
    let started = false;
    const retry = () => {
      if (runRef.current !== runId || !voice || attempt > 3) return;
      failedVoicesRef.current.add(voiceKey(voice));
      speakShort(text, attempt + 1);
    };
    utterance.onstart = () => {
      started = true;
      clearWatchdog();
    };
    utterance.onerror = (event) => {
      if (runRef.current !== runId || event.error === 'interrupted' || event.error === 'canceled') return;
      if (event.error === 'not-allowed') return;
      retry();
    };

    dispatch(utterance, runId);

    watchdogRef.current = setTimeout(() => {
      if (runRef.current !== runId || started || !voice) return;
      window.speechSynthesis.cancel();
      retry();
    }, START_TIMEOUT_MS);
  };

  const speakText = (text) => speakShort(text);
  const testVoice = () => speakShort('Olá! Esta é a voz que vai ler as páginas do FonoSync para você.');

  // tempo do player, estimado pela quantidade de texto
  useEffect(() => {
    if (playerStatus !== 'playing') return undefined;
    const timer = setInterval(() => {
      const index = indexRef.current;
      const chunk = chunksRef.current[index] || '';
      if (!chunkStartRef.current) return;
      const seconds = (Date.now() - chunkStartRef.current) / 1000;
      const said = Math.min(chunk.length, seconds * CHARS_PER_SECOND * liveRef.current.rate);
      setSpokenChars(charsBefore(index) + said);
    }, 250);
    return () => clearInterval(timer);
  }, [playerStatus]);

  // mudar voz, velocidade ou volume recomeça a frase atual com o novo valor
  const applyLive = (patch) => {
    liveRef.current = { ...liveRef.current, ...patch };
    if (playerStatus === 'playing') speakChunk(indexRef.current);
  };

  const setSpeed = (value) => {
    const rate = roundRate(Math.min(SPEECH_RATE_MAX, Math.max(SPEECH_RATE_MIN, Number(value))));
    setSpeechRate(rate);
    applyLive({ rate });
  };

  const setVolume = (value) => {
    setVolumeState(value);
    applyLive({ volume: value });
  };

  // trocar o tipo de voz: durante a leitura recomeça a frase com a nova voz;
  // fora dela, fala uma amostra curta para a pessoa ouvir a diferença na hora
  const changeVoiceGender = (gender) => {
    if (gender === liveRef.current.gender) return;
    setVoiceGender(gender);
    failedVoicesRef.current.clear();
    applyLive({ gender });
    if (playerStatus !== 'playing' && supportsSpeech()) {
      speakShort(gender === 'male' ? 'Voz masculina selecionada.' : 'Voz feminina selecionada.');
    }
  };

  const resolved = resolveVoice(availableVoices, voiceGender);
  const voiceInfo = {
    exact: resolved.exact,
    hasPortuguese: Boolean(resolved.voice),
    name: resolved.voice?.name ?? null,
  };

  return (
    <A11yContext.Provider
      value={{
        settings,
        updateSettings,
        hasUnsavedChanges,
        savePreferences,
        resetDefaults,
        saveStatus,
        voiceGender,
        setVoiceGender: changeVoiceGender,
        speechRate,
        setSpeechRate: setSpeed,
        speechSupported: supportsSpeech(),
        speechError,
        voiceInfo,
        isPlaying: playerStatus === 'playing',
        isPlayerOpen: playerOpen,
        playerStatus,
        pageTitle,
        volume,
        setVolume,
        elapsed: spokenChars / (CHARS_PER_SECOND * speechRate),
        duration: totalChars / (CHARS_PER_SECOND * speechRate),
        progress: totalChars ? spokenChars / totalChars : 0,
        speakPageContent,
        speakText,
        testVoice,
        playAudio,
        pauseAudio,
        stopAudio,
        restartAudio: () => startReading(),
        closePlayer,
        stopSpeaking: closePlayer,
      }}
    >
      {children}
    </A11yContext.Provider>
  );
}
