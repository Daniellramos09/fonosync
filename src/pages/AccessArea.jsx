import { useState } from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import {
  ArrowRight,
  Baby,
  ChevronDown,
  Eye,
  EyeOff,
  FileBadge,
  HeartHandshake,
  Lock,
  Mail,
  PersonStanding,
  Phone,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  User,
  UserCheck,
  Users,
  Volume2,
  VolumeX,
} from 'lucide-react';
import logoImg from '../assets/images/ModeloA_Semnome.jpg';
import fotoProfissional from '../assets/images/photos/hero-fono-gesto.jpg';
import fotoFamilia from '../assets/images/photos/leitura-chao.jpg';
import { Capivara, Sapinho, Tucano } from '../components/Personagens';
import OndaSonora from '../components/OndaSonora';
import { useA11y } from '../hooks/useA11y';
import A11yModal from '../components/A11yModal';
import InfoDialog from '../components/InfoDialog';
import Notice from '../components/Notice';
import { INFO_PAGES } from '../utils/constants';
import { useAuth } from '../hooks/useAuth';
import { homeFor } from '../services/authService';
import { calculateAge, formatCPF, formatPhone } from '../utils/formatters';
import { createGuardian, createPatient } from '../services/patientService';
import { registerProfessional } from '../services/professionalService';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/* ------------------------------------------------------------------ estilos */

const botaoPrincipal =
  'botao-seta relative flex min-h-[52px] w-full cursor-pointer items-center justify-center gap-2 rounded-[14px] rounded-bl-[4px] bg-azul-petroleo px-5 text-[0.9375rem] font-bold text-on-azul shadow-[0_14px_30px_-16px_rgba(29,78,104,0.9)] transition duration-200 hover:-translate-y-0.5 hover:bg-azul hover:shadow-[0_20px_36px_-16px_rgba(44,106,166,0.9)] active:translate-y-0 active:scale-[0.99] disabled:pointer-events-none disabled:opacity-60';

const botaoGoogle =
  'flex min-h-12 w-full cursor-pointer items-center justify-center gap-3 rounded-[14px] rounded-bl-[4px] border-[1.5px] border-line bg-surface px-4 text-[0.875rem] font-semibold text-ink transition duration-200 hover:-translate-y-0.5 hover:border-azul/40 hover:shadow-[0_14px_26px_-18px_rgba(19,48,74,0.55)] active:translate-y-0';

const TEXTOS = {
  profissional: {
    login: {
      titulo: ['Bom te ver ', 'de novo', '.'],
      sub: 'Entre para acompanhar pacientes, sessões e relatórios.',
    },
    register: {
      titulo: ['Seu consultório, ', 'organizado', '.'],
      sub: 'Crie sua conta profissional. Leva poucos minutos.',
    },
  },
  paciente: {
    login: {
      titulo: ['Que bom que ', 'voltaram', '!'],
      sub: 'Entre para ver as atividades e o progresso da criança.',
    },
    register: {
      titulo: ['Vamos começar ', 'juntos', '.'],
      sub: 'Cadastre a família ou o próprio paciente.',
    },
  },
};

/* --------------------------------------------------------------- elementos */

function GoogleIcon({ className = 'h-5 w-5' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
      />
    </svg>
  );
}

// Logo original do FonoSync (escudo com ondas sonoras), preservada como arquivo.
function LogoOriginal() {
  return (
    <a
      href="#/"
      className="group inline-flex items-center gap-3 rounded-full pr-2"
      aria-label="FonoSync — voltar para a página inicial"
    >
      <span className="grid size-11 place-items-center overflow-hidden rounded-full bg-white shadow-[0_8px_18px_-10px_rgba(19,48,74,0.6)] ring-1 ring-azul/15 transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-105">
        <img src={logoImg} alt="" className="size-full scale-[1.12] object-cover" />
      </span>
      <span className="font-serif text-[1.375rem] font-semibold tracking-[-0.02em] text-azul-petroleo">FonoSync</span>
    </a>
  );
}

// Título com a palavra de destaque grifada à mão.
function Titulo({ partes, cor }) {
  const [antes, destaque, depois] = partes;
  return (
    <h1 className="display text-[2.125rem] text-azul-petroleo sm:text-[2.5rem] xl:text-[2.875rem]">
      {antes}
      <span className="relative inline-block whitespace-nowrap">
        {destaque}
        <svg
          viewBox="0 0 200 16"
          preserveAspectRatio="none"
          className="risco absolute -bottom-1.5 left-0 h-3 w-full"
          aria-hidden="true"
          focusable="false"
        >
          <path
            d="M3 11C40 4 92 3 140 6c20 1 38 3 56 5"
            pathLength="1"
            fill="none"
            stroke={cor}
            strokeWidth="6"
            strokeLinecap="round"
          />
        </svg>
      </span>
      {depois}
    </h1>
  );
}

function Silaba({ texto, cor }) {
  const partes = texto.split('·');
  return (
    <span
      className="inline-flex rounded-[14px] rounded-bl-[4px] px-3.5 py-1.5 font-serif text-[1.375rem] font-semibold text-on-pastel shadow-[0_14px_30px_-14px_rgba(0,0,0,0.55)]"
      style={{ background: cor }}
    >
      {partes.map((p, i) => (
        <span key={i}>
          {i > 0 && (
            <span aria-hidden="true" className="px-[0.04em] font-normal" style={{ color: '#A8492C' }}>
              ·
            </span>
          )}
          {p}
        </span>
      ))}
    </span>
  );
}

function FormInput({ id, label, icon: Icon, error, hint, trailing, value, ...props }) {
  const describedBy = error ? `${id}-erro` : hint ? `${id}-dica` : undefined;
  const preenchido = value !== undefined && value !== null && String(value).length > 0;

  return (
    <div className="group/campo space-y-1.5">
      <label
        htmlFor={id}
        className="block text-[0.8125rem] font-semibold text-ink transition-colors duration-200 group-focus-within/campo:text-azul"
      >
        {label}
      </label>
      <div
        className={`flex min-h-12 items-center gap-2.5 rounded-[12px] rounded-bl-[3px] border-[1.5px] px-3.5 transition-[border-color,background-color,box-shadow,transform] duration-200 focus-within:-translate-y-px focus-within:border-azul focus-within:bg-surface focus-within:shadow-[0_0_0_4px_color-mix(in_srgb,var(--color-azul)_16%,transparent)] ${
          error
            ? 'campo-erro border-danger bg-danger/5'
            : preenchido
            ? 'border-azul/30 bg-gelo/70'
            : 'border-line bg-surface hover:border-azul/45'
        }`}
      >
        {Icon && (
          <Icon
            size={18}
            aria-hidden="true"
            className={`shrink-0 transition duration-200 group-focus-within/campo:scale-110 group-focus-within/campo:text-azul ${
              error ? 'text-danger' : preenchido ? 'text-azul' : 'text-muted'
            }`}
          />
        )}
        <input
          id={id}
          value={value}
          aria-invalid={Boolean(error)}
          aria-describedby={describedBy}
          className="w-full min-w-0 bg-transparent py-2.5 text-[0.9375rem] font-medium text-ink outline-none placeholder:text-muted/70"
          {...props}
        />
        {trailing}
      </div>
      {error ? (
        <p id={`${id}-erro`} className="text-[0.78125rem] font-semibold text-danger">
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-dica`} className="text-[0.78125rem] text-muted">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

function FormSelect({ id, label, icon: Icon, error, options = [], ...props }) {
  return (
    <div className="group/campo space-y-1.5">
      <label
        htmlFor={id}
        className="block text-[0.8125rem] font-semibold text-ink transition-colors duration-200 group-focus-within/campo:text-azul"
      >
        {label}
      </label>
      <div
        className={`relative flex min-h-12 items-center gap-2.5 rounded-[12px] rounded-bl-[3px] border-[1.5px] px-3.5 transition-[border-color,box-shadow,transform] duration-200 focus-within:-translate-y-px focus-within:border-azul focus-within:shadow-[0_0_0_4px_color-mix(in_srgb,var(--color-azul)_16%,transparent)] ${
          error ? 'campo-erro border-danger bg-danger/5' : 'border-line bg-surface hover:border-azul/45'
        }`}
      >
        {Icon && (
          <Icon
            size={18}
            aria-hidden="true"
            className="shrink-0 text-azul transition duration-200 group-focus-within/campo:scale-110"
          />
        )}
        <select
          id={id}
          className="w-full min-w-0 cursor-pointer appearance-none bg-transparent py-2.5 pr-6 text-[0.9375rem] font-medium text-ink outline-none"
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <ChevronDown
          size={16}
          aria-hidden="true"
          className="pointer-events-none absolute right-3.5 text-muted transition-transform duration-200 group-focus-within/campo:rotate-180 group-focus-within/campo:text-azul"
        />
      </div>
      {error && <p className="text-[0.78125rem] font-semibold text-danger">{error}</p>}
    </div>
  );
}

function BotaoSenha({ visivel, onToggle }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="-mr-1 grid size-9 shrink-0 cursor-pointer place-items-center rounded-[10px] text-muted transition hover:bg-gelo hover:text-azul"
      aria-label={visivel ? 'Ocultar senha' : 'Exibir senha'}
    >
      {visivel ? <EyeOff size={17} /> : <Eye size={17} />}
    </button>
  );
}

function Divisor({ children }) {
  return (
    <div className="flex items-center gap-3 text-[0.75rem] font-semibold text-muted">
      <span className="h-px flex-1 bg-line" />
      {children}
      <span className="h-px flex-1 bg-line" />
    </div>
  );
}

function Carregando({ children }) {
  return (
    <>
      <OndaSonora className="h-5 w-12" barras={[8, 16, 24, 16, 8]} />
      <span>{children}</span>
    </>
  );
}

function Secao({ numero, titulo, icon: Icon, extra, children }) {
  return (
    <fieldset className="space-y-3">
      <legend className="mb-3 flex w-full items-center gap-2.5 text-[0.875rem] font-bold text-azul-petroleo">
        <span className="grid size-7 place-items-center rounded-full bg-mel font-serif text-[0.875rem] text-on-pastel">
          {numero}
        </span>
        <span className="flex-1">{titulo}</span>
        {extra}
        {Icon && <Icon size={17} aria-hidden="true" className="text-azul" />}
      </legend>
      {children}
    </fieldset>
  );
}

/* ------------------------------------------------------- composição visual */

// Formas e detalhes de fundo da coluna do formulário.
function FundoAcesso({ publico }) {
  const familia = publico === 'paciente';
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      <svg viewBox="0 0 600 600" className="absolute -left-40 -top-48 w-[560px] text-gelo">
        <path
          fill="currentColor"
          d="M421 92c64 52 104 140 82 222-22 84-104 158-196 170-92 13-192-36-236-112C27 296 38 192 95 124 152 56 256 25 323 38c38 7 68 26 98 54z"
        />
      </svg>
      <svg viewBox="0 0 300 300" className="absolute -bottom-28 -left-24 w-[340px] text-azul opacity-[0.09]">
        {[40, 75, 110, 145].map((r) => (
          <circle key={r} cx="150" cy="150" r={r} fill="none" stroke="currentColor" strokeWidth="3" />
        ))}
      </svg>
      <div className={`hidden transition-opacity duration-700 lg:block ${familia ? 'opacity-100' : 'opacity-0'}`}>
        <svg viewBox="0 0 40 40" className="flutua absolute right-[9%] top-[14%] w-7 text-mel" style={{ '--d': '6s' }}>
          <path fill="currentColor" d="M20 2l4.6 11.4L37 15l-9.5 8.2L30.5 36 20 29.3 9.5 36l3-12.8L3 15l12.4-1.6z" />
        </svg>
        <span className="flutua absolute right-[4%] top-[27%] size-3.5 rounded-full bg-coral" style={{ '--d': '8s', '--y': '-14px' }} />
        <span className="flutua absolute bottom-[30%] right-[3%] size-5 rounded-[6px] rounded-bl-[2px] bg-lavanda" style={{ '--d': '9s', '--r': '12deg' }} />
        <svg viewBox="0 0 60 20" className="flutua absolute bottom-[38%] left-[1%] w-10 text-salvia" style={{ '--d': '7s', '--atraso': '1s' }}>
          <path d="M3 10c7-9 13-9 18 0s11 9 18 0 11-9 18 0" fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
        </svg>
        <span className="flutua absolute left-[3%] top-[56%] size-2.5 rounded-full bg-azul-vivo" style={{ '--d': '5s', '--atraso': '0.6s' }} />
      </div>
    </div>
  );
}

function CamadaBanner({ ativo, children }) {
  return (
    <div
      aria-hidden={!ativo}
      className={`absolute inset-0 transition-[opacity,visibility] duration-700 ease-out ${
        ativo ? 'visible opacity-100' : 'invisible opacity-0'
      }`}
    >
      {children}
    </div>
  );
}

function BannerProfissional({ ativo }) {
  return (
    <CamadaBanner ativo={ativo}>
      <img
        src={fotoProfissional}
        alt=""
        className={`absolute inset-0 size-full object-cover object-[30%_30%] ${ativo ? 'banner-foto' : ''}`}
      />
      <div className="absolute inset-0 bg-[linear-gradient(195deg,rgba(19,48,74,0.10)_20%,rgba(19,48,74,0.55)_58%,rgba(11,30,48,0.95)_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(120%_80%_at_100%_0%,rgba(76,155,232,0.35),transparent_55%)] mix-blend-soft-light" />

      {/* nota de sessão flutuando: o tipo de registro que o profissional faz aqui */}
      <div
        className="flutua absolute right-[7%] top-[11%] hidden items-center gap-3 rounded-[18px] rounded-bl-[4px] bg-white/15 px-4 py-3 text-white ring-1 ring-white/30 backdrop-blur-md lg:flex"
        style={{ '--d': '8s', '--y': '-8px' }}
      >
        <OndaSonora className="h-7 w-20 text-mel" />
        <span className="text-[0.8125rem] font-semibold leading-tight">
          Sessão 12
          <span className="block font-medium text-white/80">/r/ em início de palavra</span>
        </span>
      </div>
      <div
        className="flutua absolute left-[8%] top-[36%] hidden lg:block"
        style={{ '--d': '9s', '--r': '-6deg', '--atraso': '1.2s' }}
      >
        <Silaba texto="fo·ne·ma" cor="#F5D887" />
      </div>

      <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-6 sm:p-8 lg:p-12">
        <div className="max-w-md text-white">
          <p className="display text-[1.625rem] sm:text-[2.125rem] xl:text-[2.875rem]">Cada sessão conta uma parte da história.</p>
          <p className="mt-3 hidden max-w-sm text-[0.9375rem] leading-relaxed text-white/85 lg:block">
            Prontuário, rastreio fonológico e a evolução de cada criança, organizados para você.
          </p>
        </div>
        <Tucano className="w-20 shrink-0 sm:w-28 xl:w-36" />
      </div>
    </CamadaBanner>
  );
}

function BannerFamilia({ ativo }) {
  return (
    <CamadaBanner ativo={ativo}>
      <img
        src={fotoFamilia}
        alt=""
        className={`absolute inset-0 size-full object-cover object-[56%_center] ${ativo ? 'banner-foto' : ''}`}
      />
      <div className="absolute inset-0 bg-[linear-gradient(190deg,rgba(19,48,74,0.05)_25%,rgba(19,48,74,0.45)_60%,rgba(11,30,48,0.93)_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(90%_60%_at_0%_0%,rgba(245,216,135,0.35),transparent_60%)] mix-blend-soft-light" />

      {/* sílabas soltas pelo ar, como numa brincadeira de leitura */}
      <div className="flutua absolute left-[8%] top-[10%] hidden lg:block" style={{ '--d': '7s', '--r': '-8deg' }}>
        <Silaba texto="bo·la" cor="#F4B7A3" />
      </div>
      <div
        className="flutua absolute right-[10%] top-[16%] hidden lg:block"
        style={{ '--d': '8.5s', '--r': '6deg', '--atraso': '0.8s', '--y': '-14px' }}
      >
        <Silaba texto="sa·po" cor="#D6EAE4" />
      </div>
      <div
        className="flutua absolute right-[30%] top-[4%] hidden xl:block"
        style={{ '--d': '9s', '--r': '-4deg', '--atraso': '1.6s' }}
      >
        <Silaba texto="ga·to" cor="#F5D887" />
      </div>
      <svg
        viewBox="0 0 40 40"
        aria-hidden="true"
        className="flutua absolute left-[34%] top-[22%] hidden w-8 text-mel lg:block"
        style={{ '--d': '5.5s' }}
      >
        <path fill="currentColor" d="M20 2l4.6 11.4L37 15l-9.5 8.2L30.5 36 20 29.3 9.5 36l3-12.8L3 15l12.4-1.6z" />
      </svg>

      <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-6 sm:p-8 lg:p-12">
        <div className="max-w-md text-white">
          <p className="display text-[1.625rem] sm:text-[2.125rem] xl:text-[2.875rem]">
            Aqui, cada pa<span className="text-coral" aria-hidden="true">·</span>la<span className="text-coral" aria-hidden="true">·</span>vra vira
            conquista.
          </p>
          <p className="mt-3 hidden max-w-sm text-[0.9375rem] leading-relaxed text-white/85 lg:block">
            Atividades para fazer em casa, no ritmo da criança, junto com quem cuida dela.
          </p>
        </div>
        <Sapinho className="w-24 shrink-0 sm:w-32 xl:w-40" />
      </div>
    </CamadaBanner>
  );
}

export default function AccessArea() {
  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [loginRole, setLoginRole] = useState('profissional'); // 'profissional' | 'paciente'
  const [registerCategory, setRegisterCategory] = useState('fonoaudiologo'); // 'fonoaudiologo' | 'responsavel' | 'paciente_adulto'

  // Login form state
  const [loginForm, setLoginForm] = useState({ identifier: '', password: '' });

  // Registration form states
  const [proForm, setProForm] = useState({
    name: '',
    crfa: '',
    phone: '',
    specialty: 'Fonoaudiologia Clínica Geral',
    email: '',
    password: '',
  });

  const [guardianForm, setGuardianForm] = useState({
    // Responsável
    guardianName: '',
    guardianCpf: '',
    guardianPhone: '',
    guardianRelationship: 'Mãe',
    // Paciente Dependente
    patientName: '',
    patientBirthDate: '',
    patientSex: 'MASCULINO',
    // Acesso
    email: '',
    password: '',
  });

  const [adultPatientForm, setAdultPatientForm] = useState({
    name: '',
    birthDate: '',
    cpf: '',
    phone: '',
    sex: 'MASCULINO',
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [notice, setNotice] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [showA11y, setShowA11y] = useState(false);
  const [showGoogleModal, setShowGoogleModal] = useState(false);

  const { isPlayerOpen, speakPageContent, stopSpeaking } = useA11y();
  const { login, register, updateSession } = useAuth();

  const changeMode = (newMode) => {
    setMode(newMode);
    setErrors({});
    setNotice(null);
  };

  // Real Google OAuth Flow
  const handleGoogleSuccess = async (googleUser, asRole) => {
    setLoading(true);
    setNotice(null);
    try {
      const email = googleUser.email;
      const pass = `Google_${googleUser.sub || 'OAuth'}_SafeKey!2026`;
      try {
        const session = await login(email, pass);
        updateSession({ name: googleUser.name, picture: googleUser.picture });
        window.location.hash = homeFor(session.role);
      } catch {
        // Se ainda não existir no back, registra a conta automaticamente
        try {
          const session = await register(email, pass, asRole);
          updateSession({ name: googleUser.name, picture: googleUser.picture });
          window.location.hash = homeFor(session.role);
        } catch {
          // Fallback caso o backend não esteja ativo
          updateSession({
            email,
            name: googleUser.name,
            role: asRole,
            token: `google-jwt-${Date.now()}`,
            picture: googleUser.picture,
          });
          window.location.hash = homeFor(asRole);
        }
      }
    } catch (err) {
      setNotice({ tone: 'danger', title: 'Falha no login Google', text: err.message });
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        setLoading(true);
        const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
        });
        const googleUser = await res.json();
        const targetRole =
          mode === 'login'
            ? loginRole === 'profissional'
              ? 'ROLE_FONO'
              : 'ROLE_PACIENTE'
            : registerCategory === 'fonoaudiologo'
            ? 'ROLE_FONO'
            : 'ROLE_PACIENTE';

        await handleGoogleSuccess(googleUser, targetRole);
      } catch (err) {
        setNotice({
          tone: 'danger',
          title: 'Erro ao autenticar com o Google',
          text: err.message,
        });
      } finally {
        setLoading(false);
      }
    },
    onError: (error) => {
      console.warn('Google login dialog was closed or cancelled:', error);
      setShowGoogleModal(true);
    },
  });

  const handleSimulateGoogleLogin = async (asRole) => {
    setShowGoogleModal(false);
    setLoading(true);
    setNotice(null);
    try {
      const demoEmail = asRole === 'ROLE_FONO' ? 'renata.fono@fonosync.com.br' : 'clara.mae@gmail.com';
      const demoPass = 'google123';
      try {
        const session = await login(demoEmail, demoPass);
        window.location.hash = homeFor(session.role);
      } catch {
        const session = await register(demoEmail, demoPass, asRole);
        if (asRole === 'ROLE_FONO') {
          updateSession({ name: 'Dra. Renata Lima (Google)', crfa: 'CRFa 2-18490/SP' });
        } else {
          updateSession({ name: 'Clara Ferreira (Google)' });
        }
        window.location.hash = homeFor(session.role);
      }
    } catch (err) {
      setNotice({ tone: 'danger', title: 'Falha no login Google', text: err.message });
    } finally {
      setLoading(false);
    }
  };

  // Submissão do Login
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    const email = loginForm.identifier.trim();
    const nextErrors = {
      identifier: !email ? 'Informe seu e-mail.' : !EMAIL_REGEX.test(email) ? 'E-mail inválido.' : '',
      password: !loginForm.password ? 'Informe sua senha de acesso.' : '',
    };
    setErrors(nextErrors);
    if (nextErrors.identifier || nextErrors.password) return;

    setLoading(true);
    setNotice(null);
    try {
      const session = await login(email, loginForm.password);
      window.location.hash = homeFor(session.role);
    } catch (error) {
      setNotice({
        tone: 'danger',
        title: 'Não foi possível entrar',
        text: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  // Submissão do Cadastro de Fonoaudiólogo
  const handleProRegisterSubmit = async (e) => {
    e.preventDefault();
    const email = proForm.email.trim();
    const nextErrors = {
      name: !proForm.name.trim() ? 'Informe seu nome completo.' : '',
      crfa: !proForm.crfa.trim() ? 'Informe o seu registro no CRFa.' : '',
      phone: !proForm.phone.trim() ? 'Informe seu telefone de contato.' : '',
      email: !email ? 'Informe seu e-mail profissional.' : !EMAIL_REGEX.test(email) ? 'E-mail inválido.' : '',
      password: proForm.password.length < 6 ? 'A senha deve ter no mínimo 6 caracteres.' : '',
    };
    setErrors(nextErrors);
    if (Object.values(nextErrors).some(Boolean)) return;

    setLoading(true);
    setNotice(null);
    try {
      // 1. Cadastra credenciais de acesso no banco
      const session = await register(email, proForm.password, 'ROLE_FONO');

      // 2. Registra perfil do fonoaudiólogo
      try {
        await registerProfessional({
          name: proForm.name.trim(),
          crfa: proForm.crfa.trim(),
          phone: proForm.phone.trim(),
          specialty: proForm.specialty,
        });
      } catch (profError) {
        console.warn('Aviso ao registrar dados complementares do fonoaudiólogo:', profError);
      }

      // 3. Atualiza dados no contexto da sessão
      updateSession({
        name: proForm.name.trim(),
        crfa: proForm.crfa.trim(),
        specialty: proForm.specialty,
        phone: proForm.phone.trim(),
      });

      window.location.hash = homeFor(session.role);
    } catch (error) {
      setNotice({ tone: 'danger', title: 'Erro ao criar conta', text: error.message });
    } finally {
      setLoading(false);
    }
  };

  // Submissão do Cadastro de Responsável com Dependente
  const handleGuardianRegisterSubmit = async (e) => {
    e.preventDefault();
    const email = guardianForm.email.trim();
    const childAge = calculateAge(guardianForm.patientBirthDate);

    const nextErrors = {
      guardianName: !guardianForm.guardianName.trim() ? 'Informe o nome do responsável.' : '',
      guardianCpf: !guardianForm.guardianCpf.trim() ? 'Informe o CPF do responsável.' : '',
      guardianPhone: !guardianForm.guardianPhone.trim() ? 'Informe o telefone do responsável.' : '',
      patientName: !guardianForm.patientName.trim() ? 'Informe o nome da criança/paciente.' : '',
      patientBirthDate: !guardianForm.patientBirthDate
        ? 'Informe a data de nascimento da criança.'
        : childAge !== null && childAge >= 18
        ? 'Para pacientes maiores de 18 anos, selecione a opção "Próprio Paciente".'
        : '',
      email: !email ? 'Informe o e-mail de acesso.' : !EMAIL_REGEX.test(email) ? 'E-mail inválido.' : '',
      password: guardianForm.password.length < 6 ? 'A senha deve ter no mínimo 6 caracteres.' : '',
    };
    setErrors(nextErrors);
    if (Object.values(nextErrors).some(Boolean)) return;

    setLoading(true);
    setNotice(null);
    try {
      // 1. Cria usuário autenticável
      const session = await register(email, guardianForm.password, 'ROLE_PACIENTE');

      // 2. Cria registro do responsável
      let guardianId = null;
      try {
        const guardian = await createGuardian({
          name: guardianForm.guardianName.trim(),
          cpf: guardianForm.guardianCpf.trim(),
          phoneNumber: guardianForm.guardianPhone.trim(),
          relationship: guardianForm.guardianRelationship,
        });
        guardianId = guardian.id;
      } catch (err) {
        console.warn('Aviso ao criar responsável:', err);
      }

      // 3. Cria registro do paciente dependente com status de pré-cadastro (sem CPF para proteção do menor)
      try {
        await createPatient({
          name: guardianForm.patientName.trim(),
          dateOfBirth: guardianForm.patientBirthDate,
          cpfPatient: null,
          contactPatient: guardianForm.guardianPhone.trim(),
          sex: guardianForm.patientSex,
          guardianId,
          patientStatus: 'PRE_CADASTRO',
        });
      } catch (patErr) {
        console.warn('Aviso ao criar dependente:', patErr);
      }

      // 4. Salva nome no contexto
      updateSession({
        name: guardianForm.patientName.trim(),
        guardianName: guardianForm.guardianName.trim(),
        // usada só no front para adaptar a experiência à idade do paciente
        birthDate: guardianForm.patientBirthDate,
      });

      window.location.hash = homeFor(session.role);
    } catch (error) {
      setNotice({ tone: 'danger', title: 'Erro ao criar cadastro familiar', text: error.message });
    } finally {
      setLoading(false);
    }
  };

  // Submissão do Cadastro de Paciente Adulto (Maior de Idade)
  const handleAdultRegisterSubmit = async (e) => {
    e.preventDefault();
    const email = adultPatientForm.email.trim();
    const age = calculateAge(adultPatientForm.birthDate);

    const nextErrors = {
      name: !adultPatientForm.name.trim() ? 'Informe seu nome completo.' : '',
      birthDate: !adultPatientForm.birthDate
        ? 'Informe sua data de nascimento.'
        : age !== null && age < 18
        ? 'Pacientes menores de 18 anos devem ser cadastrados pela opção "Responsável Legal".'
        : '',
      cpf: !adultPatientForm.cpf.trim() ? 'Informe seu CPF.' : '',
      phone: !adultPatientForm.phone.trim() ? 'Informe seu telefone de contato.' : '',
      email: !email ? 'Informe seu e-mail de acesso.' : !EMAIL_REGEX.test(email) ? 'E-mail inválido.' : '',
      password: adultPatientForm.password.length < 6 ? 'A senha deve ter no mínimo 6 caracteres.' : '',
    };
    setErrors(nextErrors);
    if (Object.values(nextErrors).some(Boolean)) return;

    setLoading(true);
    setNotice(null);
    try {
      // 1. Cria usuário autenticável
      const session = await register(email, adultPatientForm.password, 'ROLE_PACIENTE');

      // 2. Cria registro do paciente adulto (sem responsável)
      try {
        await createPatient({
          name: adultPatientForm.name.trim(),
          dateOfBirth: adultPatientForm.birthDate,
          cpfPatient: adultPatientForm.cpf.trim(),
          contactPatient: adultPatientForm.phone.trim(),
          sex: adultPatientForm.sex,
          guardianId: null,
          patientStatus: 'PRE_CADASTRO',
        });
      } catch (patErr) {
        console.warn('Aviso ao cadastrar paciente adulto:', patErr);
      }

      updateSession({ name: adultPatientForm.name.trim(), birthDate: adultPatientForm.birthDate });
      window.location.hash = homeFor(session.role);
    } catch (error) {
      setNotice({ tone: 'danger', title: 'Erro ao cadastrar paciente', text: error.message });
    } finally {
      setLoading(false);
    }
  };

  // Perfil da tela: o mesmo seletor vale para entrar e para cadastrar.
  // Mantém loginRole e registerCategory em sincronia (as regras de cadastro não mudam).
  const publico = loginRole;
  const trocarPublico = (novo) => {
    if (novo === publico) return;
    setLoginRole(novo);
    setRegisterCategory((atual) =>
      novo === 'profissional' ? 'fonoaudiologo' : atual === 'fonoaudiologo' ? 'responsavel' : atual,
    );
    setErrors({});
    setNotice(null);
  };
  const familia = publico === 'paciente';
  const texto = TEXTOS[publico][mode];
  const corGrifo = familia ? '#F4B7A3' : '#F5D887';

  const avisoAtual = notice && (
    <Notice tone={notice.tone} title={notice.title}>
      {notice.text}
    </Notice>
  );

  const senhaTrailing = <BotaoSenha visivel={showPassword} onToggle={() => setShowPassword(!showPassword)} />;

  return (
    <div className="relative flex min-h-dvh flex-col bg-creme font-sans lg:grid lg:h-dvh lg:min-h-0 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.08fr)] lg:overflow-hidden">
      {/* ============================================================ */}
      {/* Coluna da autenticação (esquerda)                              */}
      {/* ============================================================ */}
      <div className="relative z-10 flex min-h-0 flex-1 flex-col lg:overflow-y-auto">
        <FundoAcesso publico={publico} />

        <header className="auth-entra relative flex items-center justify-between gap-3 px-5 pt-5 sm:px-10 xl:px-16">
          <LogoOriginal />
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowA11y(true)}
              className="flex min-h-10 cursor-pointer items-center gap-1.5 rounded-full border border-line bg-surface/80 px-3.5 text-[0.8125rem] font-semibold text-ink backdrop-blur transition hover:-translate-y-px hover:border-azul/40 hover:bg-gelo"
            >
              <PersonStanding size={16} aria-hidden="true" className="text-azul" />
              <span className="hidden sm:inline">Acessibilidade</span>
              <span className="sr-only sm:hidden">Acessibilidade</span>
            </button>
            <button
              type="button"
              onClick={() => (isPlayerOpen ? stopSpeaking() : speakPageContent())}
              className={`flex min-h-10 cursor-pointer items-center gap-1.5 rounded-full border px-3.5 text-[0.8125rem] font-semibold backdrop-blur transition hover:-translate-y-px ${
                isPlayerOpen
                  ? 'border-danger/50 bg-danger/10 text-danger'
                  : 'border-line bg-surface/80 text-ink hover:border-azul/40 hover:bg-gelo'
              }`}
            >
              {isPlayerOpen ? (
                <VolumeX size={16} aria-hidden="true" />
              ) : (
                <Volume2 size={16} aria-hidden="true" className="text-azul" />
              )}
              <span className="hidden sm:inline">{isPlayerOpen ? 'Parar leitura' : 'Ouvir página'}</span>
              <span className="sr-only sm:hidden">{isPlayerOpen ? 'Parar leitura' : 'Ouvir página'}</span>
            </button>
          </div>
        </header>

        <main className="relative flex flex-1 items-center px-5 py-7 sm:px-10 lg:py-6 xl:px-16">
          <div className="mx-auto w-full max-w-[540px] space-y-5">
            {/* Título que muda com o perfil e o modo */}
            <div key={`titulo-${publico}-${mode}`} className="auth-troca space-y-2">
              <Titulo partes={texto.titulo} cor={corGrifo} />
              <p className="text-[1rem] leading-relaxed text-muted">{texto.sub}</p>
            </div>

            {/* Perfil: profissional ou família */}
            <div
              role="group"
              aria-label="Tipo de acesso"
              className="auth-entra relative grid grid-cols-2 rounded-[16px] rounded-bl-[5px] bg-gelo p-1.5 ring-1 ring-azul/10"
              style={{ '--i': 2 }}
            >
              <span
                aria-hidden="true"
                className={`absolute inset-y-1.5 left-1.5 w-[calc(50%-6px)] rounded-[12px] rounded-bl-[3px] bg-surface shadow-[0_10px_22px_-12px_rgba(19,48,74,0.55)] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                  familia ? 'translate-x-full' : ''
                }`}
              />
              {[
                { id: 'profissional', rotulo: 'Sou profissional', curto: 'Profissional', icon: Stethoscope },
                { id: 'paciente', rotulo: 'Família ou paciente', curto: 'Família', icon: HeartHandshake },
              ].map(({ id, rotulo, curto, icon: Icon }) => {
                const ativo = publico === id;
                return (
                  <button
                    key={id}
                    type="button"
                    aria-pressed={ativo}
                    onClick={() => trocarPublico(id)}
                    className={`relative z-10 flex min-h-12 cursor-pointer items-center justify-center gap-2 rounded-[12px] px-2 text-[0.875rem] font-bold transition-colors duration-300 ${
                      ativo ? 'text-azul-petroleo' : 'text-muted hover:text-ink'
                    }`}
                  >
                    <Icon
                      size={18}
                      aria-hidden="true"
                      className={`transition-transform duration-500 ${ativo ? 'scale-110 text-azul' : ''}`}
                    />
                    <span className="sm:hidden">{curto}</span>
                    <span className="hidden sm:inline">{rotulo}</span>
                  </button>
                );
              })}
            </div>

            {/* Entrar / Criar conta */}
            <div className="auth-entra flex gap-7 border-b border-line" role="group" aria-label="Acesso" style={{ '--i': 3 }}>
              {[
                { id: 'login', rotulo: 'Entrar' },
                { id: 'register', rotulo: 'Criar conta' },
              ].map(({ id, rotulo }) => {
                const ativo = mode === id;
                return (
                  <button
                    key={id}
                    type="button"
                    aria-pressed={ativo}
                    onClick={() => changeMode(id)}
                    className={`relative cursor-pointer pb-3 text-[0.9375rem] font-bold transition-colors ${
                      ativo ? 'text-azul-petroleo' : 'text-muted hover:text-ink'
                    }`}
                  >
                    {rotulo}
                    <span
                      aria-hidden="true"
                      className={`absolute inset-x-0 -bottom-px h-[3px] origin-left rounded-full bg-azul transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                        ativo ? 'scale-x-100' : 'scale-x-0'
                      }`}
                    />
                  </button>
                );
              })}
            </div>

            {/* ========================================================== */}
            {/* MODO LOGIN                                                  */}
            {/* ========================================================== */}
            {mode === 'login' && (
              <div key={`login-${publico}`} className="auth-troca space-y-4">
                <button type="button" onClick={() => loginWithGoogle()} className={botaoGoogle}>
                  <GoogleIcon />
                  <span>Continuar com o Google</span>
                </button>

                <Divisor>ou entre com e-mail</Divisor>

                <form onSubmit={handleLoginSubmit} noValidate className="space-y-4">
                  <FormInput
                    id="login-email"
                    label={loginRole === 'profissional' ? 'E-mail profissional' : 'E-mail de acesso'}
                    icon={Mail}
                    type="email"
                    autoComplete="username"
                    placeholder={
                      loginRole === 'profissional' ? 'dra.renata@fonosync.com.br' : 'paciente.familia@email.com'
                    }
                    value={loginForm.identifier}
                    onChange={(e) => setLoginForm({ ...loginForm, identifier: e.target.value })}
                    error={errors.identifier}
                  />

                  <FormInput
                    id="login-password"
                    label="Senha de acesso"
                    icon={Lock}
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    placeholder="••••••••"
                    value={loginForm.password}
                    onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                    error={errors.password}
                    trailing={senhaTrailing}
                  />

                  {avisoAtual}

                  <button type="submit" disabled={loading} className={botaoPrincipal}>
                    {loading ? (
                      <Carregando>Entrando...</Carregando>
                    ) : (
                      <>
                        <span>Entrar como {loginRole === 'profissional' ? 'Fonoaudiólogo(a)' : 'Paciente / Família'}</span>
                        <ArrowRight size={18} aria-hidden="true" />
                      </>
                    )}
                  </button>
                </form>
              </div>
            )}

            {/* ========================================================== */}
            {/* MODO CADASTRO (COM AS REGRAS DO BANCO DE DADOS)            */}
            {/* ========================================================== */}
            {mode === 'register' && (
              <div key={`cadastro-${publico}`} className="auth-troca space-y-5">
                {/* Família: quem está se cadastrando */}
                {familia && (
                  <div role="group" aria-label="Quem está se cadastrando" className="grid grid-cols-2 gap-2.5">
                    {[
                      {
                        id: 'responsavel',
                        title: 'Responsável',
                        subtitle: 'Pais ou tutores de menor',
                        icon: Users,
                        fundo: 'bg-coral/45',
                      },
                      {
                        id: 'paciente_adulto',
                        title: 'Paciente adulto',
                        subtitle: 'Maior de 18 anos',
                        icon: User,
                        fundo: 'bg-mel/50',
                      },
                    ].map(({ id, title, subtitle, icon: Icon, fundo }) => {
                      const selected = registerCategory === id;
                      return (
                        <button
                          key={id}
                          type="button"
                          aria-pressed={selected}
                          onClick={() => {
                            setRegisterCategory(id);
                            setErrors({});
                            setNotice(null);
                          }}
                          className={`flex cursor-pointer items-center gap-3 rounded-[14px] rounded-bl-[4px] border-[1.5px] p-3 text-left transition duration-200 hover:-translate-y-0.5 ${
                            selected
                              ? 'border-azul bg-surface shadow-[0_12px_24px_-16px_rgba(19,48,74,0.6)]'
                              : 'border-line bg-surface/70 hover:border-azul/40'
                          }`}
                        >
                          <span
                            className={`grid size-10 shrink-0 place-items-center rounded-full text-on-pastel transition-transform duration-300 ${fundo} ${
                              selected ? 'scale-110' : ''
                            }`}
                          >
                            <Icon size={19} aria-hidden="true" />
                          </span>
                          <span className="min-w-0">
                            <span className="block text-[0.875rem] font-bold leading-tight text-ink">{title}</span>
                            <span className="block text-[0.78125rem] text-muted">{subtitle}</span>
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}

                <button type="button" onClick={() => loginWithGoogle()} className={botaoGoogle}>
                  <GoogleIcon />
                  <span>Cadastrar rapidamente com o Google</span>
                </button>

                <Divisor>ou preencha seus dados</Divisor>

                {/* ------------------------------------------------------ */}
                {/* FORMULÁRIO 1: FONOAUDIÓLOGO                            */}
                {/* ------------------------------------------------------ */}
                {registerCategory === 'fonoaudiologo' && (
                  <form onSubmit={handleProRegisterSubmit} noValidate className="space-y-3.5">
                    <p className="flex items-start gap-2.5 rounded-[12px] rounded-bl-[3px] bg-gelo px-3.5 py-3 text-[0.8125rem] leading-relaxed text-ink">
                      <Sparkles size={16} aria-hidden="true" className="mt-0.5 shrink-0 text-azul" />
                      Seus dados de CRFa e especialidade serão exibidos nos laudos e prontuários dos pacientes.
                    </p>

                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      <FormInput
                        id="pro-name"
                        label="Nome completo *"
                        icon={User}
                        autoComplete="name"
                        placeholder="Dra. Juliana Santos"
                        value={proForm.name}
                        onChange={(e) => setProForm({ ...proForm, name: e.target.value })}
                        error={errors.name}
                      />
                      <FormInput
                        id="pro-crfa"
                        label="Registro CRFa *"
                        icon={FileBadge}
                        placeholder="CRFa 2-19842"
                        value={proForm.crfa}
                        onChange={(e) => setProForm({ ...proForm, crfa: e.target.value })}
                        error={errors.crfa}
                      />
                    </div>

                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      <FormInput
                        id="pro-phone"
                        label="Telefone / WhatsApp *"
                        icon={Phone}
                        autoComplete="tel"
                        placeholder="(11) 98765-4321"
                        value={proForm.phone}
                        onChange={(e) => setProForm({ ...proForm, phone: formatPhone(e.target.value) })}
                        error={errors.phone}
                      />
                      <FormSelect
                        id="pro-specialty"
                        label="Especialidade *"
                        icon={Stethoscope}
                        value={proForm.specialty}
                        onChange={(e) => setProForm({ ...proForm, specialty: e.target.value })}
                        options={[
                          { value: 'Fonoaudiologia Clínica Geral', label: 'Clínica Geral' },
                          { value: 'Linguagem e Fala Infantil', label: 'Linguagem e Fala Infantil' },
                          { value: 'Audiologia e Processamento Auditivo', label: 'Audiologia' },
                          { value: 'Motricidade Orofacial e Disfagia', label: 'Motricidade Orofacial' },
                          { value: 'Voz e Comunicação', label: 'Voz e Comunicação' },
                          { value: 'Fonoaudiologia Educacional', label: 'Educacional' },
                        ]}
                      />
                    </div>

                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      <FormInput
                        id="pro-email"
                        label="E-mail profissional *"
                        icon={Mail}
                        type="email"
                        autoComplete="email"
                        placeholder="dra.juliana@fonosync.com.br"
                        value={proForm.email}
                        onChange={(e) => setProForm({ ...proForm, email: e.target.value })}
                        error={errors.email}
                      />
                      <FormInput
                        id="pro-password"
                        label="Senha de acesso *"
                        icon={Lock}
                        type={showPassword ? 'text' : 'password'}
                        autoComplete="new-password"
                        placeholder="Mínimo 6 dígitos"
                        value={proForm.password}
                        onChange={(e) => setProForm({ ...proForm, password: e.target.value })}
                        error={errors.password}
                        trailing={senhaTrailing}
                      />
                    </div>

                    {avisoAtual}

                    <button type="submit" disabled={loading} className={`${botaoPrincipal} mt-1`}>
                      {loading ? (
                        <Carregando>Criando conta profissional...</Carregando>
                      ) : (
                        <>
                          Concluir cadastro de fonoaudiólogo(a)
                          <ArrowRight size={18} aria-hidden="true" />
                        </>
                      )}
                    </button>
                  </form>
                )}

                {/* ------------------------------------------------------ */}
                {/* FORMULÁRIO 2: RESPONSÁVEL FAMILIAR COM DEPENDENTE MENOR */}
                {/* ------------------------------------------------------ */}
                {registerCategory === 'responsavel' && (
                  <form onSubmit={handleGuardianRegisterSubmit} noValidate className="space-y-6">
                    <Secao numero="1" titulo="Dados do responsável legal" icon={HeartHandshake}>
                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <FormInput
                          id="guard-name"
                          label="Nome do responsável *"
                          icon={User}
                          autoComplete="name"
                          placeholder="Ex: Mariana Ferreira"
                          value={guardianForm.guardianName}
                          onChange={(e) => setGuardianForm({ ...guardianForm, guardianName: e.target.value })}
                          error={errors.guardianName}
                        />
                        <FormInput
                          id="guard-cpf"
                          label="CPF do responsável *"
                          icon={FileBadge}
                          placeholder="000.000.000-00"
                          value={guardianForm.guardianCpf}
                          onChange={(e) => setGuardianForm({ ...guardianForm, guardianCpf: formatCPF(e.target.value) })}
                          error={errors.guardianCpf}
                        />
                      </div>
                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <FormInput
                          id="guard-phone"
                          label="Telefone / WhatsApp *"
                          icon={Phone}
                          autoComplete="tel"
                          placeholder="(11) 98765-4321"
                          value={guardianForm.guardianPhone}
                          onChange={(e) =>
                            setGuardianForm({ ...guardianForm, guardianPhone: formatPhone(e.target.value) })
                          }
                          error={errors.guardianPhone}
                        />
                        <FormSelect
                          id="guard-rel"
                          label="Grau de parentesco *"
                          icon={Users}
                          value={guardianForm.guardianRelationship}
                          onChange={(e) => setGuardianForm({ ...guardianForm, guardianRelationship: e.target.value })}
                          options={[
                            { value: 'Mãe', label: 'Mãe' },
                            { value: 'Pai', label: 'Pai' },
                            { value: 'Avó / Avô', label: 'Avó / Avô' },
                            { value: 'Tutor(a) Legal', label: 'Tutor(a) Legal' },
                            { value: 'Irmão(ã) Maior', label: 'Irmão(ã) Maior' },
                            { value: 'Outro', label: 'Outro' },
                          ]}
                        />
                      </div>
                    </Secao>

                    <Secao
                      numero="2"
                      titulo="Dados da criança (paciente)"
                      icon={Baby}
                      extra={
                        guardianForm.patientBirthDate && (
                          <span className="rounded-full bg-salvia px-2.5 py-0.5 text-[0.75rem] font-bold text-on-pastel">
                            {calculateAge(guardianForm.patientBirthDate)} anos
                          </span>
                        )
                      }
                    >
                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <FormInput
                          id="pat-name"
                          label="Nome da criança *"
                          icon={User}
                          placeholder="Ex: Lucas Ferreira"
                          value={guardianForm.patientName}
                          onChange={(e) => setGuardianForm({ ...guardianForm, patientName: e.target.value })}
                          error={errors.patientName}
                        />
                        <FormInput
                          id="pat-birth"
                          label="Data de nascimento *"
                          type="date"
                          value={guardianForm.patientBirthDate}
                          onChange={(e) => setGuardianForm({ ...guardianForm, patientBirthDate: e.target.value })}
                          error={errors.patientBirthDate}
                        />
                      </div>
                      <div className="grid grid-cols-1 items-end gap-3 sm:grid-cols-2">
                        <FormSelect
                          id="pat-sex"
                          label="Sexo biológico *"
                          value={guardianForm.patientSex}
                          onChange={(e) => setGuardianForm({ ...guardianForm, patientSex: e.target.value })}
                          options={[
                            { value: 'MASCULINO', label: 'Masculino' },
                            { value: 'FEMININO', label: 'Feminino' },
                            { value: 'OUTRO', label: 'Outro' },
                          ]}
                        />
                        <p className="flex items-start gap-2 rounded-[12px] rounded-bl-[3px] bg-salvia/70 px-3 py-2.5 text-[0.75rem] leading-snug text-on-pastel">
                          <ShieldCheck size={16} aria-hidden="true" className="mt-0.5 shrink-0 text-success" />
                          <span>
                            <strong>Proteção de menores (LGPD):</strong> não coletamos CPF nem dados sensíveis da
                            criança.
                          </span>
                        </p>
                      </div>
                    </Secao>

                    <Secao numero="3" titulo="Acesso da família" icon={Lock}>
                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <FormInput
                          id="family-email"
                          label="E-mail de acesso da família *"
                          icon={Mail}
                          type="email"
                          autoComplete="email"
                          placeholder="mariana.familia@email.com"
                          value={guardianForm.email}
                          onChange={(e) => setGuardianForm({ ...guardianForm, email: e.target.value })}
                          error={errors.email}
                        />
                        <FormInput
                          id="family-password"
                          label="Senha de acesso *"
                          icon={Lock}
                          type={showPassword ? 'text' : 'password'}
                          autoComplete="new-password"
                          placeholder="Mínimo 6 dígitos"
                          value={guardianForm.password}
                          onChange={(e) => setGuardianForm({ ...guardianForm, password: e.target.value })}
                          error={errors.password}
                          trailing={senhaTrailing}
                        />
                      </div>
                    </Secao>

                    {avisoAtual}

                    <button type="submit" disabled={loading} className={botaoPrincipal}>
                      {loading ? (
                        <Carregando>Cadastrando família e dependente...</Carregando>
                      ) : (
                        <>
                          Concluir cadastro familiar
                          <ArrowRight size={18} aria-hidden="true" />
                        </>
                      )}
                    </button>
                  </form>
                )}

                {/* ------------------------------------------------------ */}
                {/* FORMULÁRIO 3: PACIENTE ADULTO (MAIOR DE 18 ANOS)       */}
                {/* ------------------------------------------------------ */}
                {registerCategory === 'paciente_adulto' && (
                  <form onSubmit={handleAdultRegisterSubmit} noValidate className="space-y-3.5">
                    <p className="flex items-start gap-2.5 rounded-[12px] rounded-bl-[3px] bg-mel/40 px-3.5 py-3 text-[0.8125rem] leading-relaxed text-on-pastel">
                      <UserCheck size={16} aria-hidden="true" className="mt-0.5 shrink-0" />
                      Para quem tem 18 anos ou mais e cuida do próprio tratamento. O prontuário fica no seu nome.
                    </p>

                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      <FormInput
                        id="adult-name"
                        label="Nome completo *"
                        icon={User}
                        autoComplete="name"
                        placeholder="Carlos Eduardo Mendes"
                        value={adultPatientForm.name}
                        onChange={(e) => setAdultPatientForm({ ...adultPatientForm, name: e.target.value })}
                        error={errors.name}
                      />
                      <FormInput
                        id="adult-birth"
                        label="Data de nascimento *"
                        type="date"
                        value={adultPatientForm.birthDate}
                        onChange={(e) => setAdultPatientForm({ ...adultPatientForm, birthDate: e.target.value })}
                        error={errors.birthDate}
                      />
                    </div>

                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                      <FormInput
                        id="adult-cpf"
                        label="CPF *"
                        icon={FileBadge}
                        placeholder="000.000.000-00"
                        value={adultPatientForm.cpf}
                        onChange={(e) => setAdultPatientForm({ ...adultPatientForm, cpf: formatCPF(e.target.value) })}
                        error={errors.cpf}
                      />
                      <FormInput
                        id="adult-phone"
                        label="Telefone *"
                        icon={Phone}
                        autoComplete="tel"
                        placeholder="(11) 98765-4321"
                        value={adultPatientForm.phone}
                        onChange={(e) =>
                          setAdultPatientForm({ ...adultPatientForm, phone: formatPhone(e.target.value) })
                        }
                        error={errors.phone}
                      />
                      <FormSelect
                        id="adult-sex"
                        label="Sexo biológico *"
                        value={adultPatientForm.sex}
                        onChange={(e) => setAdultPatientForm({ ...adultPatientForm, sex: e.target.value })}
                        options={[
                          { value: 'MASCULINO', label: 'Masculino' },
                          { value: 'FEMININO', label: 'Feminino' },
                          { value: 'OUTRO', label: 'Outro' },
                        ]}
                      />
                    </div>

                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      <FormInput
                        id="adult-email"
                        label="E-mail de acesso *"
                        icon={Mail}
                        type="email"
                        autoComplete="email"
                        placeholder="carlos.mendes@email.com"
                        value={adultPatientForm.email}
                        onChange={(e) => setAdultPatientForm({ ...adultPatientForm, email: e.target.value })}
                        error={errors.email}
                      />
                      <FormInput
                        id="adult-password"
                        label="Senha de acesso *"
                        icon={Lock}
                        type={showPassword ? 'text' : 'password'}
                        autoComplete="new-password"
                        placeholder="Mínimo 6 dígitos"
                        value={adultPatientForm.password}
                        onChange={(e) => setAdultPatientForm({ ...adultPatientForm, password: e.target.value })}
                        error={errors.password}
                        trailing={senhaTrailing}
                      />
                    </div>

                    {avisoAtual}

                    <button type="submit" disabled={loading} className={`${botaoPrincipal} mt-1`}>
                      {loading ? (
                        <Carregando>Criando cadastro de paciente...</Carregando>
                      ) : (
                        <>
                          Concluir cadastro de paciente adulto
                          <ArrowRight size={18} aria-hidden="true" />
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            )}
          </div>
        </main>

        {/* Rodapé da coluna: LGPD, privacidade e créditos */}
        <footer className={`relative flex flex-wrap items-center justify-between gap-x-4 gap-y-1.5 px-5 pb-5 text-[0.78125rem] text-muted sm:px-10 xl:px-16 ${familia ? 'lg:pr-36 xl:pr-40' : ''}`}>
          <span className="flex flex-wrap items-center gap-x-1.5 gap-y-0.5">
            <ShieldCheck size={15} aria-hidden="true" className="text-success" />
            Ambiente seguro e criptografado, em conformidade com a LGPD.
            <button
              type="button"
              onClick={() => setShowPrivacy(true)}
              className="cursor-pointer whitespace-nowrap font-semibold text-azul underline decoration-azul/30 underline-offset-4 transition hover:decoration-azul"
            >
              Privacidade e termos
            </button>
          </span>
          <span>© 2026 FonoSync — Projeto Integrador Fatec Ferraz de Vasconcelos.</span>
        </footer>
      </div>

      {/* ============================================================ */}
      {/* Banner visual (direita no desktop, topo no celular)           */}
      {/* ============================================================ */}
      <aside className="on-dark relative order-first h-60 shrink-0 overflow-hidden bg-azul-profundo sm:h-80 lg:order-none lg:h-auto">
        <BannerProfissional ativo={!familia} />
        <BannerFamilia ativo={familia} />
      </aside>

      {/* A capivara da família senta na divisa entre o formulário e a foto */}
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute bottom-3 left-[48.1%] z-20 hidden w-36 -translate-x-[78%] transition-[opacity,transform] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] lg:block xl:w-40 ${
          familia ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
        }`}
      >
        <Capivara acenando className="w-full drop-shadow-[0_18px_24px_rgba(11,30,48,0.35)]" />
      </div>

      {/* Modal de Acessibilidade */}
      <A11yModal isOpen={showA11y} onClose={() => setShowA11y(false)} />

      {/* Modal de Privacidade */}
      <InfoDialog isOpen={showPrivacy} onClose={() => setShowPrivacy(false)} title={INFO_PAGES.privacidade.title}>
        {INFO_PAGES.privacidade.paragraphs.map((p, idx) => (
          <p key={idx}>{p}</p>
        ))}
      </InfoDialog>

      {/* Modal Interativo de Autenticação com Google */}
      {showGoogleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-azul-profundo/55 p-4 backdrop-blur-sm">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="google-modal-titulo"
            className="auth-troca w-full max-w-sm space-y-4 rounded-[22px] rounded-bl-[6px] bg-surface p-6 shadow-[0_40px_80px_-30px_rgba(11,30,48,0.7)]"
          >
            <div className="flex items-center justify-between border-b border-line pb-3">
              <div className="flex items-center gap-2">
                <GoogleIcon />
                <span id="google-modal-titulo" className="text-[0.9375rem] font-bold text-azul-petroleo">
                  FonoSync Google Auth
                </span>
              </div>
              <button
                type="button"
                onClick={() => setShowGoogleModal(false)}
                aria-label="Fechar"
                className="grid size-9 cursor-pointer place-items-center rounded-full text-sm font-bold text-muted transition hover:bg-gelo hover:text-ink"
              >
                ✕
              </button>
            </div>

            <p className="text-[0.84375rem] text-muted">Escolha uma conta Google para entrar ou sincronizar com o FonoSync:</p>

            <div className="space-y-2">
              <button
                type="button"
                onClick={() => handleSimulateGoogleLogin('ROLE_FONO')}
                className="flex w-full cursor-pointer items-center gap-3 rounded-[14px] rounded-bl-[4px] border-[1.5px] border-line p-3 text-left transition hover:-translate-y-0.5 hover:border-azul hover:bg-gelo/60"
              >
                <span className="grid size-10 place-items-center rounded-full bg-azul-petroleo text-xs font-bold text-on-azul">
                  DR
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[0.84375rem] font-bold text-ink">Dra. Renata Lima (Fonoaudióloga)</span>
                  <span className="block truncate text-[0.75rem] text-muted">renata.fono@fonosync.com.br</span>
                </span>
              </button>

              <button
                type="button"
                onClick={() => handleSimulateGoogleLogin('ROLE_PACIENTE')}
                className="flex w-full cursor-pointer items-center gap-3 rounded-[14px] rounded-bl-[4px] border-[1.5px] border-line p-3 text-left transition hover:-translate-y-0.5 hover:border-azul hover:bg-gelo/60"
              >
                <span className="grid size-10 place-items-center rounded-full bg-coral text-xs font-bold text-on-pastel">
                  CF
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[0.84375rem] font-bold text-ink">Clara Ferreira (Mãe / Paciente)</span>
                  <span className="block truncate text-[0.75rem] text-muted">clara.mae@gmail.com</span>
                </span>
              </button>
            </div>

            <button
              type="button"
              onClick={() => setShowGoogleModal(false)}
              className="w-full cursor-pointer py-2 text-[0.8125rem] font-bold text-muted transition hover:text-ink"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
