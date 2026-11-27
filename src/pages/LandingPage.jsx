import { useEffect, useState } from 'react';
import { 
  Users, 
  Building2, 
  School, 
  Stethoscope, 
  ChevronRight, 
  HeartHandshake, 
  ShieldCheck, 
  Sparkles, 
  Activity, 
  BrainCircuit, 
  FileSpreadsheet, 
  MessageSquareHeart,
  CalendarCheck,
  Award
} from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import PhoneticCard from '../components/PhoneticCard';
import Reveal from '../components/Reveal';
import { buttonClass } from '../components/buttonStyles';

export default function LandingPage() {
  const [activeAudience, setActiveAudience] = useState('individuos');

  useEffect(() => {
    document.title = 'FonoSync — Fonoaudiologia Digital Integrada';
  }, []);

  const audiences = [
    {
      id: 'individuos',
      title: 'Para Famílias & Indivíduos',
      tag: 'Cuidado Contínuo em Casa',
      icon: Users,
      desc: 'Acompanhamento do desenvolvimento infantil e de fala com jogos terapêuticos lúdicos, orientações claras e comunicação direta com o fonoaudiólogo.',
      features: [
        'Triagens lúdicas e jogos adaptados por faixa etária (2 a 8+ anos)',
        'Devolutiva acolhedora e orientações práticas para a família',
        'Histórico unificado de evolução sem perdas entre as consultas'
      ],
      ctaText: 'Fazer Triagem da Fala',
      ctaHref: '#/triagem'
    },
    {
      id: 'profissionais',
      title: 'Para Fonoaudiólogos & Clínicas',
      tag: 'Eficiência Clínica',
      icon: Stethoscope,
      desc: 'Prontuário eletrônico fonoaudiológico completo, protocolos fonéticos com cálculo de PCC-R, anamneses, agendamentos e emissão de relatórios clínicos.',
      features: [
        'Prontuário com CID-10, anexos de áudio/exames e evolução por sessão',
        'Cálculo automatizado de porcentagem de consoantes corretas (PCC-R)',
        'Prescrição de tarefas terapêuticas personalizadas para casa'
      ],
      ctaText: 'Acessar Área Clínica',
      ctaHref: '#/acesso'
    },
    {
      id: 'escolas',
      title: 'Para Escolas & Educadores',
      tag: 'Identificação Precoce',
      icon: School,
      desc: 'Rastreio escolar integrado para identificar sinais de trocas fonológicas, dislexia e atrasos de linguagem precocemente na sala de aula.',
      features: [
        'Checklists orientados para professores e equipes pedagógicas',
        'Encaminhamentos claros com fundamentação para os pais e especialistas',
        'Monitoramento de turmas com gráficos intuitivos de desenvolvimento'
      ],
      ctaText: 'Saber Mais para Escolas',
      ctaHref: '#demo-request'
    },
    {
      id: 'redes',
      title: 'Para Redes & Planos de Saúde',
      tag: 'Gestão Baseada em Evidências',
      icon: Building2,
      desc: 'Interoperabilidade de dados de saúde auditiva e vocal, indicadores de eficácia de intervenção e redução de custos com reabilitações tardias.',
      features: [
        'Conformidade com LGPD e diretrizes de residência de dados no Brasil',
        'Métricas de engajamento familiar e adesão ao tratamento (>85%)',
        'Relatórios consolidados de desfecho clínico e impacto populacional'
      ],
      ctaText: 'Solicitar Demonstração',
      ctaHref: '#demo-request'
    }
  ];

  const currentAudience = audiences.find(a => a.id === activeAudience) || audiences[0];

  return (
    <div className="min-h-screen bg-surface text-ink flex flex-col selection:bg-primary/20 selection:text-primary">
      <Header />

      <main id="primary" className="flex-1">
        
        {/* ==================== 1. HERO SECTION (Estilo Ovia Royal/Navy) ==================== */}
        <section className="relative overflow-hidden bg-gradient-to-b from-navy via-[#0d2a3f] to-band text-white py-16 lg:py-24">
          {/* Efeitos de iluminação de fundo */}
          <div className="absolute top-0 right-0 -mr-24 -mt-24 h-96 w-96 rounded-full bg-primary/20 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -ml-24 -mb-24 h-96 w-96 rounded-full bg-accent/15 blur-3xl pointer-events-none" />

          <div className="mx-auto max-w-7xl px-6 lg:px-12 relative z-10">
            <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-8">
              
              <div className="lg:col-span-7">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 text-on-band-muted text-xs font-semibold uppercase tracking-wider backdrop-blur-sm mb-6 border border-white/15">
                  <Sparkles size={14} className="text-accent" />
                  Saúde Fonoaudiológica Digital de Ponta a Ponta
                </div>

                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-white leading-[1.15] mb-6">
                  Cuidando do desenvolvimento da fala em cada etapa da vida.
                </h1>

                <p className="text-lg sm:text-xl text-on-band-muted max-w-2xl font-sans leading-relaxed mb-8">
                  Nossa plataforma une famílias, fonoaudiólogos e escolas com avaliações lúdicas inteligentes, 
                  prontuário clínico estruturado e apoio contínuo para transformar a jornada do cuidado.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
                  <a 
                    href="#/triagem" 
                    className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-accent hover:bg-accent/90 text-band font-bold text-base transition-all shadow-lg hover:shadow-accent/25 hover:-translate-y-0.5 active:translate-y-0"
                  >
                    <span>Iniciar Triagem Gratuita</span>
                    <ChevronRight size={18} />
                  </a>
                  <a 
                    href="#demo-request" 
                    className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-semibold text-base transition-all border border-white/20 backdrop-blur-sm hover:-translate-y-0.5"
                  >
                    <span>Agendar Demonstração</span>
                  </a>
                </div>

                {/* Micro-destaques abaixo do CTA */}
                <div className="mt-12 pt-8 border-t border-white/15 grid grid-cols-3 gap-4 text-left">
                  <div>
                    <div className="text-2xl font-bold text-white font-serif">100%</div>
                    <div className="text-xs text-on-band-muted font-medium">Digital &amp; Sem Papel</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-accent font-serif">PCC-R</div>
                    <div className="text-xs text-on-band-muted font-medium">Cálculo Fonético Automático</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white font-serif">LGPD</div>
                    <div className="text-xs text-on-band-muted font-medium">Privacidade e Segurança</div>
                  </div>
                </div>
              </div>

              {/* Card visual interativo (PhoneticCard / Preview) */}
              <div className="lg:col-span-5 flex justify-center">
                <div className="w-full max-w-md drop-shadow-[0_25px_35px_rgba(0,0,0,0.35)] transition-transform duration-500 hover:scale-[1.02]">
                  <PhoneticCard />
                </div>
              </div>

            </div>
          </div>
        </section>


        {/* ==================== 2. JOURNEY & AUDIENCE (Abas / Soluções por Perfil) ==================== */}
        <section className="py-20 bg-canvas border-b border-line">
          <div className="mx-auto max-w-7xl px-6 lg:px-12 text-center">
            
            <span className="text-sm font-bold tracking-widest text-primary uppercase block mb-3">
              Ecossistema FonoSync
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif text-navy font-bold max-w-3xl mx-auto mb-4">
              A única plataforma focada em <span className="text-primary italic">todas</span> as dimensões da terapia fonoaudiológica
            </h2>
            <p className="text-muted max-w-2xl mx-auto text-base sm:text-lg mb-12">
              Da triagem rápida em casa ou na escola até o acompanhamento clínico aprofundado, 
              criamos o elo que faltava entre o profissional e o paciente.
            </p>

            {/* Navegação por perfis (Tabs inspiradas no Ovia: Individuals, Health Plans, Employers, Health Systems) */}
            <div className="flex flex-wrap justify-center gap-2 mb-10 p-1.5 bg-surface border border-line rounded-2xl max-w-3xl mx-auto shadow-xs">
              {audiences.map((aud) => {
                const Icon = aud.icon;
                const isActive = aud.id === activeAudience;
                return (
                  <button
                    key={aud.id}
                    onClick={() => setActiveAudience(aud.id)}
                    className={`flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm transition-all ${
                      isActive 
                        ? 'bg-navy text-white shadow-md' 
                        : 'text-muted hover:text-ink hover:bg-mist'
                    }`}
                  >
                    <Icon size={18} />
                    <span>{aud.title.split('&')[0].trim()}</span>
                  </button>
                );
              })}
            </div>

            {/* Card Detalhado do Perfil Ativo */}
            <div className="bg-surface border border-line rounded-3xl p-8 sm:p-12 text-left shadow-lg max-w-4xl mx-auto transition-all">
              <div className="flex flex-col md:flex-row gap-8 items-start justify-between">
                <div className="space-y-4 max-w-xl">
                  <div className="inline-block px-3 py-1 rounded-md bg-mist text-primary text-xs font-bold uppercase tracking-wider">
                    {currentAudience.tag}
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-serif text-navy font-bold">
                    {currentAudience.title}
                  </h3>
                  <p className="text-ink/80 text-base leading-relaxed">
                    {currentAudience.desc}
                  </p>

                  <ul className="space-y-2.5 pt-2">
                    {currentAudience.features.map((feat, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-sm text-ink/90">
                        <ShieldCheck size={18} className="text-success shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex flex-col gap-4 w-full md:w-auto shrink-0 self-center md:self-end">
                  <a
                    href={currentAudience.ctaHref}
                    className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-primary hover:bg-navy text-white font-bold text-sm transition-all shadow-md hover:shadow-primary/20"
                  >
                    <span>{currentAudience.ctaText}</span>
                    <ChevronRight size={16} />
                  </a>
                  <a
                    href="#demo-request"
                    className="text-center text-xs font-semibold text-muted hover:text-primary transition-colors py-1"
                  >
                    Conhecer especificações técnicas &rarr;
                  </a>
                </div>
              </div>
            </div>

          </div>
        </section>


        {/* ==================== 3. IMPACT STATS (Faixa com Estatísticas) ==================== */}
        <section className="bg-band text-white py-16">
          <div className="mx-auto max-w-7xl px-6 lg:px-12">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="text-xs font-bold text-accent uppercase tracking-widest block mb-2">Impacto Real</span>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white">
                Evidência clínica e adesão comprovada
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-white/10">
              <div className="pt-6 md:pt-0 md:px-6">
                <div className="text-4xl sm:text-5xl font-serif font-bold text-white mb-2">92%</div>
                <p className="text-sm text-on-band-muted font-medium max-w-xs mx-auto">
                  Adesão das famílias aos exercícios e jogos terapêuticos entre as consultas
                </p>
              </div>

              <div className="pt-6 md:pt-0 md:px-6">
                <div className="text-4xl sm:text-5xl font-serif font-bold text-accent mb-2">5x Mais</div>
                <p className="text-sm text-on-band-muted font-medium max-w-xs mx-auto">
                  Rapidez na montagem do prontuário com identificação automatizada de trocas fonéticas
                </p>
              </div>

              <div className="pt-6 md:pt-0 md:px-6">
                <div className="text-4xl sm:text-5xl font-serif font-bold text-white mb-2">&lt; 5 min</div>
                <p className="text-sm text-on-band-muted font-medium max-w-xs mx-auto">
                  Tempo médio para uma triagem lúdica preliminar de consciência fonológica
                </p>
              </div>
            </div>
          </div>
        </section>


        {/* ==================== 4. CARDS DE DESTAQUES CLÍNICOS (Inspirado no Ovia) ==================== */}
        <section className="py-20 bg-surface">
          <div className="mx-auto max-w-7xl px-6 lg:px-12">
            
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="text-sm font-bold text-primary uppercase tracking-widest block mb-2">
                Rigor Fonoaudiológico
              </span>
              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-navy mb-4">
                Recursos desenhados por e para especialistas da linguagem
              </h2>
              <p className="text-muted text-base sm:text-lg">
                Combinamos experiência do usuário acolhedora com os critérios clínicos de fonoaudiologia mais recentes.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              
              {/* Card 1 */}
              <div className="bg-mist/60 border border-line rounded-3xl p-8 flex flex-col justify-between hover:shadow-md transition-shadow">
                <div>
                  <div className="h-12 w-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-6">
                    <Activity size={26} />
                  </div>
                  <h3 className="text-xl font-serif font-bold text-navy mb-3">
                    Protocolos Fonéticos &amp; PCC-R
                  </h3>
                  <p className="text-sm text-muted leading-relaxed mb-6">
                    Identificação de processos fonológicos (substituição, omissão e distorção) com cálculo de severidade automático para direcionar o plano terapêutico.
                  </p>
                </div>
                <div className="pt-4 border-t border-line/60 text-xs font-semibold text-primary flex items-center gap-1">
                  <span>Conforme parâmetros da SBFa</span>
                </div>
              </div>

              {/* Card 2 */}
              <div className="bg-mist/60 border border-line rounded-3xl p-8 flex flex-col justify-between hover:shadow-md transition-shadow">
                <div>
                  <div className="h-12 w-12 rounded-2xl bg-success/10 text-success flex items-center justify-center mb-6">
                    <BrainCircuit size={26} />
                  </div>
                  <h3 className="text-xl font-serif font-bold text-navy mb-3">
                    Jogos Adaptados por Idade
                  </h3>
                  <p className="text-sm text-muted leading-relaxed mb-6">
                    Atividades desenhadas para consciência fonológica, discriminação auditiva e rimas em etapas de 2 a 4 anos e 4 a 5+ anos, sem cansar a criança.
                  </p>
                </div>
                <div className="pt-4 border-t border-line/60 text-xs font-semibold text-success flex items-center gap-1">
                  <span>Interface sem publicidade e sem telas invasivas</span>
                </div>
              </div>

              {/* Card 3 */}
              <div className="bg-mist/60 border border-line rounded-3xl p-8 flex flex-col justify-between hover:shadow-md transition-shadow">
                <div>
                  <div className="h-12 w-12 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center mb-6">
                    <FileSpreadsheet size={26} />
                  </div>
                  <h3 className="text-xl font-serif font-bold text-navy mb-3">
                    Prontuário &amp; Histórico Seguro
                  </h3>
                  <p className="text-sm text-muted leading-relaxed mb-6">
                    Registro de anamnese, anexos de áudio de fala, evolução diária por sessão e agendamentos vinculados em um único lugar protegido por JWT.
                  </p>
                </div>
                <div className="pt-4 border-t border-line/60 text-xs font-semibold text-amber-700 flex items-center gap-1">
                  <span>Armazenamento em nuvem com criptografia TLS</span>
                </div>
              </div>

            </div>

          </div>
        </section>


        {/* ==================== 5. DEPOIMENTOS / TESTEMUNHOS (Ovia Testimonials) ==================== */}
        <section className="py-20 bg-canvas border-y border-line">
          <div className="mx-auto max-w-7xl px-6 lg:px-12">
            
            <div className="text-center max-w-2xl mx-auto mb-14">
              <span className="text-xs font-bold text-primary uppercase tracking-widest block mb-2">Comunidade FonoSync</span>
              <h2 className="text-3xl font-serif font-bold text-navy">
                O que dizem quem já utiliza o FonoSync
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              
              <div className="bg-surface p-8 rounded-3xl border border-line shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex gap-1 text-accent mb-4">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="text-lg">★</span>
                    ))}
                  </div>
                  <p className="text-ink/80 text-sm italic leading-relaxed mb-6">
                    “Antes eu gastava horas planilhando as trocas fonéticas de cada paciente. Com o cálculo de PCC-R integrado e os jogos de casa, as crianças adoram fazer as atividades e eu tenho dados precisos no retorno.”
                  </p>
                </div>
                <div>
                  <div className="font-bold text-navy text-sm">Dra. Camila Vasconcelos</div>
                  <div className="text-xs text-muted">Fonoaudióloga Clínica — CRFa 2-18490</div>
                </div>
              </div>

              <div className="bg-surface p-8 rounded-3xl border border-line shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex gap-1 text-accent mb-4">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="text-lg">★</span>
                    ))}
                  </div>
                  <p className="text-ink/80 text-sm italic leading-relaxed mb-6">
                    “Fiz a triagem em 3 minutos no celular com meu filho de 3 anos. O relatório foi super acolhedor e facilitou muito quando levei para a primeira consulta com a fono.”
                  </p>
                </div>
                <div>
                  <div className="font-bold text-navy text-sm">Mariana Silveira</div>
                  <div className="text-xs text-muted">Mãe do Theo (3 anos e 4 meses)</div>
                </div>
              </div>

              <div className="bg-surface p-8 rounded-3xl border border-line shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex gap-1 text-accent mb-4">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="text-lg">★</span>
                    ))}
                  </div>
                  <p className="text-ink/80 text-sm italic leading-relaxed mb-6">
                    “Na escola, as professoras conseguem aplicar os testes de rima e encaminhar com muito mais critério e fundamentação. Evitou tanto encaminhamentos desnecessários quanto atrasos no diagnóstico.”
                  </p>
                </div>
                <div>
                  <div className="font-bold text-navy text-sm">Profª Helena Duarte</div>
                  <div className="text-xs text-muted">Coordenadora Pedagógica — Colégio Horizonte</div>
                </div>
              </div>

            </div>

          </div>
        </section>


        {/* ==================== 6. CTA / CONTATO / DEMO (Estilo Ovia #demo-request) ==================== */}
        <section id="demo-request" className="py-20 bg-gradient-to-br from-mist via-surface to-canvas">
          <div className="mx-auto max-w-4xl px-6 lg:px-12 text-center">
            
            <div className="inline-flex p-3 rounded-2xl bg-primary/10 text-primary mb-6">
              <MessageSquareHeart size={32} />
            </div>

            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-navy mb-4">
              Interessado em levar o FonoSync para sua prática ou instituição?
            </h2>
            <p className="text-muted text-base sm:text-lg max-w-2xl mx-auto mb-10">
              Preencha os dados abaixo para receber uma demonstração personalizada da plataforma clínica ou iniciar sua triagem imediatamente.
            </p>

            <div className="bg-surface border border-line rounded-3xl p-8 sm:p-10 shadow-lg text-left max-w-xl mx-auto">
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  alert('Obrigado pelo interesse! Nossa equipe acadêmico-clínica entrará em contato em breve.');
                }}
                className="space-y-4"
              >
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-ink mb-1.5" htmlFor="nome">
                    Seu Nome Completo
                  </label>
                  <input 
                    id="nome" 
                    type="text" 
                    required 
                    placeholder="Ex: Dra. Ana Silva" 
                    className="w-full rounded-xl border border-line px-4 py-3 text-sm focus:border-primary focus:outline-hidden"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-ink mb-1.5" htmlFor="email">
                      E-mail Profissional
                    </label>
                    <input 
                      id="email" 
                      type="email" 
                      required 
                      placeholder="ana@clinica.com.br" 
                      className="w-full rounded-xl border border-line px-4 py-3 text-sm focus:border-primary focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-ink mb-1.5" htmlFor="tipo">
                      Perfil de Interesse
                    </label>
                    <select 
                      id="tipo"
                      className="w-full rounded-xl border border-line px-4 py-3 text-sm focus:border-primary focus:outline-hidden bg-surface"
                    >
                      <option>Fonoaudiólogo Clínico</option>
                      <option>Clínica / Multidisciplinar</option>
                      <option>Instituição de Ensino / Escola</option>
                      <option>Família / Responsável</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-ink mb-1.5" htmlFor="msg">
                    Como podemos ajudar? (Opcional)
                  </label>
                  <textarea 
                    id="msg" 
                    rows={3} 
                    placeholder="Conte sobre sua clínica, escola ou necessidade de acompanhamento..." 
                    className="w-full rounded-xl border border-line px-4 py-3 text-sm focus:border-primary focus:outline-hidden"
                  />
                </div>

                <button 
                  type="submit" 
                  className="w-full py-4 rounded-full bg-primary hover:bg-navy text-white font-bold text-sm transition-all shadow-md hover:shadow-primary/20 mt-2"
                >
                  Solicitar Demonstração / Contato
                </button>
              </form>
            </div>

            <div className="mt-8 flex justify-center items-center gap-6 text-xs text-muted">
              <span className="flex items-center gap-1.5">
                <ShieldCheck size={14} className="text-success" />
                Dados protegidos por sigilo profissional
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <Award size={14} className="text-primary" />
                Plataforma em conformidade com a LGPD
              </span>
            </div>

          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
