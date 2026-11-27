import { useEffect, useState } from 'react';
import {
  ArrowRight,
  Check,
  FileBadge,
  Laptop,
  Lock,
  ShieldCheck,
  Smartphone,
} from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import About from '../components/About';

// 9 Fotografias reais e contextualizadas do cuidado fonoaudiológico
import heroConsultorioImg from '../assets/images/care/consultorio-familia-atendimento.jpg';
import articulacaoImg from '../assets/images/care/terapia-fala-articulacao.jpg';
import espelhoAlfabetoImg from '../assets/images/care/terapia-espelho-alfabeto.jpg';
import silabasGirafaImg from '../assets/images/care/silabas-girafa-ludico.jpg';
import fonoPlanejamentoImg from '../assets/images/care/fonoaudiologa-planejamento.jpg';
import fonoLinguagemImg from '../assets/images/care/fonoaudiologa-linguagem.jpg';
import criancaQuadroImg from '../assets/images/care/crianca-quadro-fonemas.jpg';
import celebracaoImg from '../assets/images/care/celebracao-terapia-evolucao.jpg';
import leituraClinicaImg from '../assets/images/care/atividade-leitura-clinica.jpg';

const scrollToSection = (id) => (e) => {
  e.preventDefault();
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
};

const trustItems = [
  'Conformidade LGPD',
  'Prontuário com CID-10',
  'Rastreio sem cadastro prévio',
  'Criptografia TLS',
  'Acessibilidade & Leitura por Voz',
  'Diretrizes Éticas CFFa',
];

const agePills = [
  { id: '0-2', label: '0–2 anos', focus: 'Marcos iniciais & intenção comunicativa' },
  { id: '2-4', label: '2–4 anos', focus: 'Jogo da Palavra & processos fonológicos' },
  { id: '4-5', label: '4–5 anos', focus: 'Jogo da Rima & consciência fonológica' },
  { id: '6+', label: '6+ anos', focus: 'Checklist escolar & compreensão em sala' },
];

export default function LandingPage() {
  const [selectedAge, setSelectedAge] = useState('2-4');

  useEffect(() => {
    document.title = 'FonoSync — Cuidado Fonoaudiológico Integrado';
  }, []);

  const currentAgeFocus = agePills.find((p) => p.id === selectedAge) || agePills[1];

  return (
    <div className="min-h-screen bg-[#ffffff] text-[#1a1d20] flex flex-col font-sans">
      <Header />

      <main id="primary" className="flex-1">
        {/* ==================== SEÇÃO 1: HERO EDITORIAL ASSIMÉTRICO + TRUST STRIP ==================== */}
        <section className="bg-[#f6f5f3] pt-12 pb-10 lg:pt-18 lg:pb-14">
          <div className="mx-auto max-w-[1240px] px-6 md:px-10">
            <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-12">
              {/* Coluna Esquerda Editorial */}
              <div className="lg:col-span-6 space-y-6">
                <div className="inline-flex items-center gap-2 rounded-full bg-white px-3.5 py-1.5 text-xs font-medium text-ink shadow-2xs">
                  <span className="size-1.5 rounded-full bg-primary" aria-hidden="true" />
                  <span>Fonoaudiologia Clínica &amp; Familiar</span>
                </div>

                <h1 className="font-sans text-[44px] sm:text-[56px] lg:text-[62px] font-medium tracking-[-0.03em] leading-[1.08] text-[#1d1f22]">
                  O cuidado com a fala continua além do consultório.
                </h1>

                <p className="text-[18px] text-[#5e5e5e] leading-[1.55] max-w-xl">
                  O FonoSync conecta fonoaudiólogos, famílias e escolas em uma jornada clara: do
                  rastreio fonológico lúdico por faixa etária ao prontuário clínico e evolução de
                  cada sessão.
                </p>

                <div className="flex flex-wrap items-center gap-6 pt-3">
                  <a
                    href="#/triagem"
                    className="inline-flex min-h-12 items-center justify-center gap-2.5 rounded-full bg-primary px-6 py-3 text-[15px] font-medium text-on-primary transition-colors hover:bg-navy"
                  >
                    <span>Iniciar rastreio fonológico</span>
                    <ArrowRight size={17} aria-hidden="true" />
                  </a>
                  <a
                    href="#sobre"
                    onClick={scrollToSection('sobre')}
                    className="inline-flex items-center gap-1.5 text-[15px] font-medium text-[#1d1f22] transition-colors hover:text-primary"
                  >
                    <span>Conhecer a plataforma</span>
                    <ArrowRight size={16} aria-hidden="true" />
                  </a>
                </div>
              </div>

              {/* Coluna Direita: Fotografia Real + Micro-Card de UI Sobreposto */}
              <div className="lg:col-span-6">
                <div className="relative mx-auto max-w-xl lg:max-w-none">
                  <div className="overflow-hidden rounded-[24px] bg-white">
                    <img
                      src={heroConsultorioImg}
                      alt="Fonoaudióloga em atendimento clínico acolhedor com criança e mãe no consultório"
                      className="w-full h-[400px] sm:h-[520px] object-cover object-center"
                    />
                  </div>

                  {/* Micro-Card de UI Flutuante */}
                  <div className="bottom-5 left-5 right-5 sm:right-auto sm:w-82 mt-3 sm:mt-0 sm:absolute rounded-[18px] bg-white/95 backdrop-blur-md p-4 shadow-[0_16px_40px_rgba(0,0,0,0.1)]">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#f6f5f3] text-xs font-semibold text-primary">
                          ML
                        </span>
                        <div>
                          <p className="text-[13.5px] font-medium text-[#1d1f22] leading-tight">
                            Maria Luiza · Sessão 08
                          </p>
                          <p className="text-[12px] text-[#5e5e5e]">
                            Dra. Renata Lima · CRFa 2-19842
                          </p>
                        </div>
                      </div>
                      <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-medium text-emerald-800">
                        Evoluída
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Trust Strip (Barra Horizontal de Conformidade) */}
            <div className="mt-12 pt-8 border-t border-black/8">
              <ul className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3 text-[13px] font-medium text-[#4a4d52]">
                {trustItems.map((item) => (
                  <li key={item} className="inline-flex items-center gap-2">
                    <span className="flex size-4.5 items-center justify-center rounded-full bg-white text-primary shadow-2xs">
                      <Check size={11} strokeWidth={2.5} aria-hidden="true" />
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* ==================== SEÇÃO 2: BENTO GRID 3x2 EM #f6f5f3 SEM BORDAS PESADAS ==================== */}
        <section id="recursos" className="py-24 lg:py-28 bg-[#ffffff] scroll-mt-20">
          <div className="mx-auto max-w-[1240px] px-6 md:px-10">
            <div className="max-w-3xl mb-14 space-y-4">
              <h2 className="font-sans text-[36px] sm:text-[46px] font-medium tracking-[-0.03em] leading-[1.08] text-[#1d1f22]">
                Recursos além do consultório. Desenhados para a fonoaudiologia.
              </h2>
              <p className="text-[18px] text-[#5e5e5e] leading-[1.55] max-w-2xl">
                Cada módulo resolve uma etapa real do cuidado com a linguagem infantil, unindo rigor
                clínico para o profissional e simplicidade para a família.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {/* Card 1: Prontuário Centralizado */}
              <article className="rounded-[28px] bg-[#f6f5f3] p-8 flex flex-col justify-between min-h-[380px]">
                <div className="space-y-2.5">
                  <h3 className="font-sans text-[22px] font-medium tracking-[-0.02em] text-[#1d1f22]">
                    Prontuário Centralizado
                  </h3>
                  <p className="text-[15px] text-[#5e5e5e] leading-[1.55]">
                    Anamnese, diagnóstico CID-10, avaliações e vínculo obrigatório de responsável
                    legal reunidos por paciente.
                  </p>
                </div>

                <div className="mt-6 space-y-2 rounded-2xl bg-white p-4 shadow-2xs">
                  {[
                    { initials: 'ML', name: 'Maria Luiza F.', sub: '7 anos · CID F98.5', badge: 'Ativo', tone: 'bg-emerald-50 text-emerald-800' },
                    { initials: 'JP', name: 'João Pedro S.', sub: '4 anos · Fonema /r/', badge: 'Sessão hoje', tone: 'bg-sky-50 text-primary' },
                    { initials: 'AC', name: 'Ana Clara S.', sub: '3 anos · Linguagem', badge: 'Em avaliação', tone: 'bg-amber-50 text-amber-800' },
                  ].map((row) => (
                    <div
                      key={row.name}
                      className="flex items-center justify-between gap-2 rounded-xl bg-[#f6f5f3]/70 px-3 py-2.5"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-white text-[11px] font-semibold text-ink">
                          {row.initials}
                        </span>
                        <div className="min-w-0">
                          <p className="truncate text-[13px] font-medium text-[#1d1f22]">{row.name}</p>
                          <p className="truncate text-[11px] text-[#5e5e5e]">{row.sub}</p>
                        </div>
                      </div>
                      <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-medium ${row.tone}`}>
                        {row.badge}
                      </span>
                    </div>
                  ))}
                </div>
              </article>

              {/* Card 2: Conexão Clínica, Casa e Escola */}
              <article className="rounded-[28px] bg-[#f6f5f3] p-8 flex flex-col justify-between min-h-[380px]">
                <div className="space-y-2.5">
                  <h3 className="font-sans text-[22px] font-medium tracking-[-0.02em] text-[#1d1f22]">
                    Conexão Clínica, Casa e Escola
                  </h3>
                  <p className="text-[15px] text-[#5e5e5e] leading-[1.55]">
                    As orientações não se perdem no fim da sessão. Terapeuta, responsáveis e
                    educadores compartilham o mesmo plano.
                  </p>
                </div>

                <div className="mt-6 rounded-2xl bg-white p-5 shadow-2xs space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex-1 rounded-xl bg-[#f6f5f3] p-3 text-center">
                      <p className="text-[12px] font-medium text-[#1d1f22]">Consultório</p>
                      <p className="text-[10.5px] text-[#5e5e5e]">Plano &amp; Sessão</p>
                    </div>
                    <ArrowRight size={14} className="shrink-0 text-primary" aria-hidden="true" />
                    <div className="flex-1 rounded-xl bg-[#f6f5f3] p-3 text-center">
                      <p className="text-[12px] font-medium text-[#1d1f22]">Família</p>
                      <p className="text-[10.5px] text-[#5e5e5e]">Treino em casa</p>
                    </div>
                    <ArrowRight size={14} className="shrink-0 text-primary" aria-hidden="true" />
                    <div className="flex-1 rounded-xl bg-[#f6f5f3] p-3 text-center">
                      <p className="text-[12px] font-medium text-[#1d1f22]">Escola</p>
                      <p className="text-[10.5px] text-[#5e5e5e]">Observação</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between rounded-xl bg-[#f6f5f3]/60 px-3.5 py-2 text-[12px] text-[#5e5e5e]">
                    <span>Relatório interdisciplinar e familiar</span>
                    <span className="font-medium text-primary">Sincronizado</span>
                  </div>
                </div>
              </article>

              {/* Card 3: Acesso Simples à Triagem */}
              <article className="rounded-[28px] bg-[#f6f5f3] p-8 flex flex-col justify-between min-h-[380px]">
                <div className="space-y-2.5">
                  <h3 className="font-sans text-[22px] font-medium tracking-[-0.02em] text-[#1d1f22]">
                    Acesso Simples à Triagem
                  </h3>
                  <p className="text-[15px] text-[#5e5e5e] leading-[1.55]">
                    Direto pelo navegador no celular, tablet ou computador, sem exigir instalação de
                    aplicativos ou cadastro prévio.
                  </p>
                </div>

                <div className="mt-6 space-y-2.5">
                  <div className="rounded-2xl bg-white p-4 shadow-2xs flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="flex size-9 items-center justify-center rounded-xl bg-[#f6f5f3] text-primary">
                        <Smartphone size={17} aria-hidden="true" />
                      </span>
                      <div>
                        <p className="text-[13px] font-medium text-[#1d1f22]">Celular &amp; Tablet</p>
                        <p className="text-[11.5px] text-[#5e5e5e]">Para praticar junto com a criança</p>
                      </div>
                    </div>
                    <span className="text-[11px] font-medium text-emerald-700">Pronto</span>
                  </div>
                  <div className="rounded-2xl bg-white p-4 shadow-2xs flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="flex size-9 items-center justify-center rounded-xl bg-[#f6f5f3] text-primary">
                        <Laptop size={17} aria-hidden="true" />
                      </span>
                      <div>
                        <p className="text-[13px] font-medium text-[#1d1f22]">Navegador no Consultório</p>
                        <p className="text-[11.5px] text-[#5e5e5e]">fonosync.app/#/triagem</p>
                      </div>
                    </div>
                    <a href="#/triagem" className="text-[12px] font-medium text-primary hover:underline">
                      Abrir →
                    </a>
                  </div>
                </div>
              </article>

              {/* Card 4: 4 Faixas de Desenvolvimento */}
              <article className="rounded-[28px] bg-[#f6f5f3] p-8 flex flex-col justify-between min-h-[380px]">
                <div className="space-y-2.5">
                  <h3 className="font-sans text-[22px] font-medium tracking-[-0.02em] text-[#1d1f22]">
                    4 Faixas de Desenvolvimento
                  </h3>
                  <p className="text-[15px] text-[#5e5e5e] leading-[1.55]">
                    Atividades fonológicas calibradas para os marcos esperados em cada etapa da
                    infância.
                  </p>
                </div>

                <div className="mt-6 space-y-3">
                  <div className="flex flex-wrap gap-1.5">
                    {agePills.map((pill) => (
                      <button
                        key={pill.id}
                        type="button"
                        onClick={() => setSelectedAge(pill.id)}
                        className={`rounded-full px-3 py-1.5 text-[12px] font-medium transition-colors cursor-pointer ${
                          selectedAge === pill.id
                            ? 'bg-[#1d1f22] text-white'
                            : 'bg-white text-[#4a4d52] hover:bg-white/80'
                        }`}
                      >
                        {pill.label}
                      </button>
                    ))}
                  </div>
                  <div className="overflow-hidden rounded-2xl bg-white p-2.5 shadow-2xs">
                    <img
                      src={silabasGirafaImg}
                      alt="Criança montando sílabas da palavra girafa com cartões ilustrados"
                      className="h-28 w-full rounded-xl object-cover"
                    />
                    <p className="mt-2 px-1 text-[12px] font-medium text-[#1d1f22]">
                      {currentAgeFocus.label}: <span className="font-normal text-[#5e5e5e]">{currentAgeFocus.focus}</span>
                    </p>
                  </div>
                </div>
              </article>

              {/* Card 5: Histórico de Sessões e Anexos */}
              <article className="rounded-[28px] bg-[#f6f5f3] p-8 flex flex-col justify-between min-h-[380px]">
                <div className="space-y-2.5">
                  <h3 className="font-sans text-[22px] font-medium tracking-[-0.02em] text-[#1d1f22]">
                    Histórico de Sessões e Anexos
                  </h3>
                  <p className="text-[15px] text-[#5e5e5e] leading-[1.55]">
                    Linha do tempo cronológica de cada atendimento realizado, pontos de melhora e
                    exames complementares.
                  </p>
                </div>

                <div className="mt-6 rounded-2xl bg-white p-4 shadow-2xs space-y-2.5">
                  <div className="flex items-center justify-between border-b border-black/6 pb-2 text-[11px] font-medium text-[#5e5e5e]">
                    <span>Sessão &amp; Horário</span>
                    <span>Foco Clínico</span>
                    <span>Status</span>
                  </div>
                  {[
                    { sess: 'Sessão 08 · 09:00', focus: 'Fluência & Ritmo', status: 'Realizada' },
                    { sess: 'Sessão 07 · 14:30', focus: 'Encontro /tr/ e /fl/', status: 'Realizada' },
                    { sess: 'Exame Anexo · PDF', focus: 'Audiometria Infantil', status: 'Anexado' },
                  ].map((item) => (
                    <div key={item.sess} className="flex items-center justify-between text-[12.5px]">
                      <span className="font-medium text-[#1d1f22]">{item.sess}</span>
                      <span className="text-[#5e5e5e]">{item.focus}</span>
                      <span className="rounded-full bg-[#f6f5f3] px-2 py-0.5 text-[11px] font-medium text-ink">
                        {item.status}
                      </span>
                    </div>
                  ))}
                </div>
              </article>

              {/* Card 6: Privacidade & Ética Clínica */}
              <article className="rounded-[28px] bg-[#f6f5f3] p-8 flex flex-col justify-between min-h-[380px]">
                <div className="space-y-2.5">
                  <h3 className="font-sans text-[22px] font-medium tracking-[-0.02em] text-[#1d1f22]">
                    Privacidade &amp; Ética Clínica
                  </h3>
                  <p className="text-[15px] text-[#5e5e5e] leading-[1.55]">
                    Proteção estrita de menores sem coleta de CPF infantil e documentos assinados com
                    o registro CRFa do profissional.
                  </p>
                </div>

                <div className="mt-6 rounded-2xl bg-white p-5 shadow-2xs space-y-3">
                  <div className="flex items-center gap-3">
                    <span className="flex size-10 items-center justify-center rounded-xl bg-[#f6f5f3] text-primary">
                      <ShieldCheck size={19} aria-hidden="true" />
                    </span>
                    <div>
                      <p className="text-[13.5px] font-medium text-[#1d1f22]">
                        Proteção de Menores (LGPD)
                      </p>
                      <p className="text-[12px] text-[#5e5e5e]">
                        Vínculo obrigatório ao responsável legal
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 pt-2 border-t border-black/6">
                    <span className="flex size-10 items-center justify-center rounded-xl bg-[#f6f5f3] text-primary">
                      <FileBadge size={19} aria-hidden="true" />
                    </span>
                    <div>
                      <p className="text-[13.5px] font-medium text-[#1d1f22]">
                        Habilitação Profissional CRFa
                      </p>
                      <p className="text-[12px] text-[#5e5e5e]">
                        Laudos e atestados com identificação oficial
                      </p>
                    </div>
                  </div>
                </div>
              </article>
            </div>
          </div>
        </section>

        {/* ==================== SEÇÃO 3: LINHAS EDITORIAIS ZIGUE-ZAGUE COM CHECKLIST ✓ E FOTOGRAFIA REAL ==================== */}
        <section id="fluxo-clinico" className="bg-[#ffffff] py-8 scroll-mt-20">
          {/* Bloco A: Rastreio Fonológico e Jogos Lúdicos */}
          <div className="mx-auto max-w-[1080px] px-6 md:px-10 py-16">
            <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
              <div className="lg:col-span-6 space-y-6">
                <h2 className="font-sans text-[34px] sm:text-[40px] font-medium tracking-[-0.03em] leading-[1.1] text-[#1d1f22]">
                  Rastreio fonológico lúdico que respeita o ritmo da criança.
                </h2>
                <p className="text-[17px] text-[#5e5e5e] leading-[1.6]">
                  Quem escuta a criança é o adulto que convive com ela. Em atividades curtas de 5
                  rodadas sem microfone invasivo, a família registra as produções da fala com
                  naturalidade.
                </p>

                <ul className="space-y-3.5 pt-1">
                  {[
                    'Jogo da Palavra (2–4 anos) com processos fonológicos mapeados',
                    'Jogo da Rima (4–5 anos) com etapa de treino explicativo',
                    'Marcos Iniciais (0–2 anos) e Checklist Escolar (6+ anos)',
                    'Devolutiva ética imediata após 5 rodadas com relatório em TXT',
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-3 text-[15.5px] text-[#1d1f22]">
                      <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-[#f6f5f3] text-primary shadow-2xs">
                        <Check size={13} strokeWidth={2.5} aria-hidden="true" />
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                <div className="pt-2">
                  <a
                    href="#/triagem"
                    className="inline-flex items-center gap-1.5 text-[15px] font-medium text-primary hover:underline"
                  >
                    <span>Experimentar triagem</span>
                    <ArrowRight size={16} aria-hidden="true" />
                  </a>
                </div>
              </div>

              <div className="lg:col-span-6">
                <div className="relative">
                  <img
                    src={articulacaoImg}
                    alt="Fonoaudióloga demonstrando ponto articulatório no queixo com criança durante sessão"
                    className="w-full h-[380px] sm:h-[430px] object-cover rounded-[24px]"
                  />
                  {/* Card Branco de UI Sobreposto: Rodada do Jogo Fonético */}
                  <div className="bottom-4 left-4 right-4 sm:left-6 sm:right-6 mt-3 sm:mt-0 sm:absolute rounded-2xl bg-white/95 backdrop-blur-md p-4 shadow-[0_16px_40px_rgba(0,0,0,0.1)]">
                    <div className="flex items-center justify-between text-xs text-[#5e5e5e] mb-2">
                      <span className="font-medium text-[#1d1f22]">Rodada 1 de 5 · Jogo Fonético</span>
                      <span>Som-alvo: /v/ + /a/ + /k/ + /a/</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-center text-xs">
                      <div className="rounded-xl bg-emerald-50 px-2.5 py-2 font-medium text-emerald-900">
                        &ldquo;Vaca&rdquo; · Padrão
                      </div>
                      <div className="rounded-xl bg-[#f6f5f3] px-2.5 py-2 font-medium text-[#1d1f22]">
                        &ldquo;Faca&rdquo; · /v/ → /f/
                      </div>
                      <div className="rounded-xl bg-[#f6f5f3] px-2.5 py-2 font-medium text-[#1d1f22]">
                        &ldquo;Baca&rdquo; · /v/ → /b/
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bloco B: Fluxo Clínico Familiar ao Fonoaudiólogo (Ordem Invertida no Desktop) */}
          <div className="mx-auto max-w-[1080px] px-6 md:px-10 py-16">
            <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
              <div className="lg:col-span-6 order-2 lg:order-1">
                <div className="relative">
                  <img
                    src={espelhoAlfabetoImg}
                    alt="Fonoaudióloga trabalhando com espelho clínico e prancha de letras com criança"
                    className="w-full h-[380px] sm:h-[430px] object-cover object-top rounded-[24px]"
                  />
                  {/* Card Branco Sobreposto: Profissionais/Pacientes em Atendimento */}
                  <div className="bottom-4 left-4 right-4 sm:left-6 sm:right-6 mt-3 sm:mt-0 sm:absolute rounded-2xl bg-white/95 backdrop-blur-md p-4 shadow-[0_16px_40px_rgba(0,0,0,0.1)]">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-[13px] font-medium text-[#1d1f22]">
                          Prontuário Eletrônico · Consciência Fonológica
                        </p>
                        <p className="text-[11.5px] text-[#5e5e5e]">
                          CID-10 F80.0 · 2x por semana · Evolução sincronizada
                        </p>
                      </div>
                      <span className="rounded-full bg-[#f6f5f3] px-3 py-1 text-[11px] font-medium text-primary">
                        Prontuário Ativo
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-6 order-1 lg:order-2 space-y-6">
                <h2 className="font-sans text-[34px] sm:text-[40px] font-medium tracking-[-0.03em] leading-[1.1] text-[#1d1f22]">
                  Um fluxo clínico pensado para a rotina do fonoaudiólogo.
                </h2>
                <p className="text-[17px] text-[#5e5e5e] leading-[1.6]">
                  Da primeira entrevista com a família à emissão de relatórios interdisciplinares,
                  o prontuário organiza cada etapa sem burocracia desnecessária.
                </p>

                <ul className="space-y-3.5 pt-1">
                  {[
                    'Anamnese detalhada e histórico familiar estruturado',
                    'Avaliação clínica e Diagnóstico com sugestão CID-10',
                    'Registro de Sessão vinculada diretamente à Agenda',
                    'Anexos de exames em nuvem e atestados oficiais com CRFa',
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-3 text-[15.5px] text-[#1d1f22]">
                      <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-[#f6f5f3] text-primary shadow-2xs">
                        <Check size={13} strokeWidth={2.5} aria-hidden="true" />
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                <div className="pt-2">
                  <a
                    href="#/acesso"
                    className="inline-flex items-center gap-1.5 text-[15px] font-medium text-primary hover:underline"
                  >
                    <span>Acessar área do profissional</span>
                    <ArrowRight size={16} aria-hidden="true" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Bloco C: Engajamento da Família em Casa */}
          <div className="mx-auto max-w-[1080px] px-6 md:px-10 py-16">
            <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
              <div className="lg:col-span-6 space-y-6">
                <h2 className="font-sans text-[34px] sm:text-[40px] font-medium tracking-[-0.03em] leading-[1.1] text-[#1d1f22]">
                  Engajamento da família entre uma sessão e outra.
                </h2>
                <p className="text-[17px] text-[#5e5e5e] leading-[1.6]">
                  A constância transforma o tratamento fonoaudiológico. Quando os pais compreendem o
                  objetivo de cada exercício, a prática em casa acontece com leveza.
                </p>

                <ul className="space-y-3.5 pt-1">
                  {[
                    'Atividades prescritas pelo fonoaudiólogo por faixa etária',
                    'Acompanhamento claro de conquistas e pontos de melhora',
                    'Comunicação contínua entre consultório e rotina familiar',
                    'Ambiente acolhedor e sem sensação de prova para a criança',
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-3 text-[15.5px] text-[#1d1f22]">
                      <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-[#f6f5f3] text-primary shadow-2xs">
                        <Check size={13} strokeWidth={2.5} aria-hidden="true" />
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                <div className="pt-2">
                  <a
                    href="#/acesso"
                    className="inline-flex items-center gap-1.5 text-[15px] font-medium text-primary hover:underline"
                  >
                    <span>Conhecer área da família</span>
                    <ArrowRight size={16} aria-hidden="true" />
                  </a>
                </div>
              </div>

              <div className="lg:col-span-6">
                <div className="overflow-hidden rounded-[24px]">
                  <img
                    src={celebracaoImg}
                    alt="Terapeuta e criança comemorando conquista com toque de mãos"
                    className="w-full h-[380px] sm:h-[430px] object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ==================== SEÇÃO 4: BANNER FOTOGRÁFICO FULL-WIDTH COM GRADIENTE ESCURO NA BASE ==================== */}
        <section id="seguranca" className="py-10 px-6 md:px-10 scroll-mt-20">
          <div className="mx-auto max-w-[1240px]">
            <div className="relative overflow-hidden rounded-[28px] min-h-[480px] sm:min-h-[540px] flex items-end">
              <img
                src={fonoPlanejamentoImg}
                alt="Fonoaudióloga em seu consultório planejando atendimento clínico na mesa de trabalho"
                className="absolute inset-0 h-full w-full object-cover object-center"
              />
              <div
                className="absolute inset-0 bg-gradient-to-t from-[#11161b]/95 via-[#11161b]/55 to-transparent"
                aria-hidden="true"
              />

              <div className="relative z-10 mx-auto w-full max-w-3xl px-6 py-12 sm:py-16 text-center text-white space-y-5">
                <h2 className="font-sans text-[34px] sm:text-[46px] font-medium tracking-[-0.03em] leading-[1.08] text-white">
                  Seguro, privado e acessível por princípio.
                </h2>
                <p className="mx-auto max-w-2xl text-[17px] text-white/85 leading-[1.6]">
                  Construído em conformidade com a LGPD, diretrizes do Conselho de Fonoaudiologia e
                  controles nativos de acessibilidade.
                </p>

                <div className="pt-3 flex flex-wrap items-center justify-center gap-3">
                  {[
                    { icon: ShieldCheck, label: 'LGPD & Proteção de Menores' },
                    { icon: Lock, label: 'Autenticação JWT & RBAC' },
                    { icon: Check, label: 'Acessibilidade WCAG & Voz' },
                  ].map(({ icon: Icon, label }) => (
                    <span
                      key={label}
                      className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 backdrop-blur-md px-4 py-2 text-xs font-medium text-white"
                    >
                      <Icon size={14} aria-hidden="true" />
                      <span>{label}</span>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ==================== SEÇÃO 5: PRÉVIA INTERATIVA REAL DOS PAINÉIS (About.jsx) ==================== */}
        <About />

        {/* ==================== SEÇÃO 6: "CONSTRUÍDO NA PRÁTICA CLÍNICA." (MOSAICO EDITORIAL) ==================== */}
        <section id="beneficios" className="py-20 lg:py-24 bg-[#ffffff] scroll-mt-20">
          <div className="mx-auto max-w-[1240px] px-6 md:px-10">
            <div className="max-w-3xl mb-14 space-y-4">
              <h2 className="font-sans text-[36px] sm:text-[46px] font-medium tracking-[-0.03em] leading-[1.08] text-[#1d1f22]">
                Construído na prática clínica.
              </h2>
              <p className="text-[18px] text-[#5e5e5e] leading-[1.55]">
                Fundamentação fonoaudiológica, engenharia de software moderna e inclusão digital
                caminhando juntas.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              {/* Card Mosaico 1 */}
              <article className="rounded-[28px] bg-[#f6f5f3] p-8 flex flex-col justify-between gap-6">
                <div className="space-y-3">
                  <span className="inline-block rounded-full bg-white px-3 py-1 text-xs font-medium text-primary">
                    Pesquisa Acadêmico-Clínica · FATEC
                  </span>
                  <h3 className="font-sans text-[22px] font-medium tracking-[-0.02em] text-[#1d1f22] leading-snug">
                    Rigor científico aplicado à linguagem e fala.
                  </h3>
                  <p className="text-[15px] text-[#5e5e5e] leading-[1.6]">
                    Modelagem de dados e processos fonológicos alinhados à literatura clínica,
                    respeitando que todo rastreio é um apoio à avaliação presencial do fonoaudiólogo.
                  </p>
                </div>
                <img
                  src={fonoLinguagemImg}
                  alt="Fonoaudióloga consultando livro de mapas conceituais em fonoaudiologia e linguagem"
                  className="h-52 w-full rounded-[18px] object-cover"
                />
              </article>

              {/* Card Mosaico 2 */}
              <article className="rounded-[28px] bg-[#f6f5f3] p-8 flex flex-col justify-between gap-6">
                <div className="space-y-3">
                  <span className="inline-block rounded-full bg-white px-3 py-1 text-xs font-medium text-primary">
                    Experiência Lúdica &amp; Acolhedora
                  </span>
                  <h3 className="font-sans text-[22px] font-medium tracking-[-0.02em] text-[#1d1f22] leading-snug">
                    Motivação para a criança em cada etapa.
                  </h3>
                  <p className="text-[15px] text-[#5e5e5e] leading-[1.6]">
                    Interfaces calmas, sem estímulos visuais excessivos, com figuras reconhecíveis do
                    cotidiano infantil e feedback acolhedor para os responsáveis.
                  </p>
                </div>
                <img
                  src={criancaQuadroImg}
                  alt="Criança sorrindo enquanto interage com quadro pedagógico ao lado da terapeuta"
                  className="h-52 w-full rounded-[18px] object-cover"
                />
              </article>

              {/* Card Mosaico 3 */}
              <article className="rounded-[28px] bg-[#f6f5f3] p-8 flex flex-col justify-between gap-6">
                <div className="space-y-3">
                  <span className="inline-block rounded-full bg-white px-3 py-1 text-xs font-medium text-primary">
                    Inclusão Digital &amp; Educação
                  </span>
                  <h3 className="font-sans text-[22px] font-medium tracking-[-0.02em] text-[#1d1f22] leading-snug">
                    Acessibilidade nativa e ponte com a escola.
                  </h3>
                  <p className="text-[15px] text-[#5e5e5e] leading-[1.6]">
                    Leitura de página por síntese de voz com marca-texto em tempo real, modos para
                    daltonismo, alto contraste e checklist para educadores em sala de aula.
                  </p>
                </div>
                <img
                  src={leituraClinicaImg}
                  alt="Profissional acompanhando criança em atividade de leitura e reconhecimento de letras"
                  className="h-52 w-full rounded-[18px] object-cover"
                />
              </article>
            </div>
          </div>
        </section>

        {/* ==================== SEÇÃO 7: CTA FINAL MINIMALISTA EM FUNDO BRANCO ==================== */}
        <section className="bg-[#ffffff] py-24 border-t border-black/6">
          <div className="mx-auto max-w-[1240px] px-6 md:px-10 text-center space-y-7">
            <h2 className="font-sans text-4xl sm:text-5xl font-medium tracking-[-0.03em] text-[#1d1f22]">
              Comece o acompanhamento hoje
            </h2>
            <p className="mx-auto max-w-xl text-[17px] text-[#5e5e5e] leading-[1.6]">
              Inicie uma atividade de rastreio fonológico por faixa etária ou entre na área clínica
              do FonoSync.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-6 pt-2">
              <a
                href="#/triagem"
                className="inline-flex min-h-12 items-center justify-center gap-2.5 rounded-full bg-primary px-7 py-3 text-[15px] font-medium text-on-primary transition-colors hover:bg-navy"
              >
                <span>Iniciar rastreio fonológico</span>
                <ArrowRight size={17} aria-hidden="true" />
              </a>
              <a
                href="#/acesso"
                className="inline-flex items-center gap-1.5 text-[15px] font-medium text-[#1d1f22] transition-colors hover:text-primary"
              >
                <span>Acessar área clínica</span>
                <ArrowRight size={16} aria-hidden="true" />
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
