import { useState } from 'react';
import logoImg from '../assets/images/ModeloA_Semnome.jpg';
import A11yModal from './A11yModal';
import Button from './Button';
import InfoDialog from './InfoDialog';
import Notice from './Notice';
import { INFO_PAGES } from '../utils/constants';

const fieldClass =
  'min-h-11 w-full rounded-[10px] border border-black/10 bg-surface px-3.5 text-[15px] text-ink focus:border-primary focus:outline-hidden';

function ContactForm() {
  const [sent, setSent] = useState(false);

  if (sent) {
    return (
      <div role="status">
        <Notice tone="success" title="Mensagem recebida">
          Obrigado pelo contato. Responderemos em breve.
        </Notice>
      </div>
    );
  }

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        setSent(true);
      }}
      className="flex flex-col gap-3.5"
    >
      <div className="flex flex-col gap-1.5">
        <label htmlFor="contato-nome" className="text-sm font-medium text-ink">
          Nome
        </label>
        <input id="contato-nome" type="text" required className={fieldClass} />
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="contato-email" className="text-sm font-medium text-ink">
          E-mail
        </label>
        <input id="contato-email" type="email" required className={fieldClass} />
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="contato-mensagem" className="text-sm font-medium text-ink">
          Mensagem
        </label>
        <textarea id="contato-mensagem" rows={4} required className={`${fieldClass} py-2.5`} />
      </div>
      <div>
        <Button variant="primary" type="submit">
          Enviar mensagem
        </Button>
      </div>
    </form>
  );
}

export default function Footer() {
  const [dialog, setDialog] = useState(null);
  const [showA11y, setShowA11y] = useState(false);

  const info = dialog && dialog !== 'contato' ? INFO_PAGES[dialog] : null;
  const linkClass =
    'text-[15px] text-[#5e5e5e] transition-colors hover:text-ink text-left underline-offset-4 hover:underline';

  return (
    <footer className="border-t border-black/8 bg-[#f6f5f3] text-ink">
      <div className="mx-auto max-w-[1240px] px-6 py-20 md:px-10">
        <div className="flex flex-col justify-between gap-14 border-b border-black/8 pb-16 lg:flex-row lg:items-start">
          <div className="max-w-md space-y-4">
            <div className="flex items-center gap-3">
              <img
                src={logoImg}
                alt="FonoSync"
                className="h-10 w-10 rounded-[10px] border border-black/8 bg-white object-contain"
              />
              <div>
                <span className="font-sans text-xl font-medium tracking-[-0.03em] text-ink block leading-none">
                  FonoSync
                </span>
                <span className="mt-1 block text-xs font-medium text-[#5e5e5e]">
                  Cuidado Fonoaudiológico Integrado
                </span>
              </div>
            </div>
            <p className="text-[15px] leading-[1.6] text-[#5e5e5e]">
              Plataforma acadêmico-clínica desenvolvida para apoiar o acompanhamento fonoaudiológico
              contínuo entre consultório, família e ambiente escolar. As atividades de rastreio inicial
              não substituem a avaliação clínica presencial.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-12 sm:grid-cols-3">
            <div className="flex flex-col items-start gap-3">
              <span className="font-sans text-sm font-medium tracking-[-0.01em] text-ink">
                Plataforma
              </span>
              <a href="#/triagem" className={linkClass}>
                Rastreio Fonológico
              </a>
              <a href="#/acesso" className={linkClass}>
                Prontuário do Profissional
              </a>
              <a href="#/acesso" className={linkClass}>
                Ambiente da Família
              </a>
            </div>

            <div className="flex flex-col items-start gap-3">
              <span className="font-sans text-sm font-medium tracking-[-0.01em] text-ink">
                Diretrizes &amp; Ética
              </span>
              <button type="button" onClick={() => setDialog('pesquisa')} className={linkClass}>
                Pesquisa e validação
              </button>
              <button type="button" onClick={() => setDialog('privacidade')} className={linkClass}>
                Privacidade e LGPD
              </button>
            </div>

            <div className="flex flex-col items-start gap-3">
              <span className="font-sans text-sm font-medium tracking-[-0.01em] text-ink">
                Suporte &amp; Inclusão
              </span>
              <button type="button" onClick={() => setShowA11y(true)} className={linkClass}>
                Painel de acessibilidade
              </button>
              <button type="button" onClick={() => setDialog('contato')} className={linkClass}>
                Contato acadêmico
              </button>
            </div>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-[14px] text-[#5e5e5e]">
          <p>© {new Date().getFullYear()} FonoSync · Projeto Acadêmico-Clínico (FATEC).</p>
          <p className="text-xs text-[#5e5e5e]">
            Conformidade LGPD · Rastreio não configura diagnóstico clínico
          </p>
        </div>
      </div>

      <InfoDialog isOpen={Boolean(info)} onClose={() => setDialog(null)} title={info?.title ?? ''}>
        {info?.paragraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </InfoDialog>

      <InfoDialog
        isOpen={dialog === 'contato'}
        onClose={() => setDialog(null)}
        title="Contato acadêmico"
        footer={false}
      >
        <ContactForm />
      </InfoDialog>

      <A11yModal isOpen={showA11y} onClose={() => setShowA11y(false)} />
    </footer>
  );
}
