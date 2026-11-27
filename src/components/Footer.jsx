import { useState } from 'react';
import A11yModal from './A11yModal';
import Logo from './Logo';
import Button from './Button';
import InfoDialog from './InfoDialog';
import Notice from './Notice';
import { INFO_PAGES } from '../utils/constants';

const fieldClass =
  'min-h-12 w-full rounded-[10px] rounded-bl-[3px] border-[1.5px] border-line bg-surface px-3.5 text-[16px] text-ink transition-colors hover:border-primary/40 focus:border-primary';

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
    'text-left text-[16px] text-white/80 underline-offset-[6px] transition-colors hover:text-white hover:underline';

  return (
    <footer className="on-dark bg-ocean-deep text-white">
      <div className="mx-auto max-w-[1320px] px-5 pt-20 pb-10 md:px-10">
        <div className="grid gap-14 border-b border-white/15 pb-16 lg:grid-cols-[1fr_auto] lg:items-end lg:gap-24">
          <div>
            <Logo tone="claro" markClassName="size-10" />
            <p className="display mt-10 max-w-[16ch] text-[40px] sm:text-[56px]">
              Cada criança encontra a sua voz no seu tempo.
            </p>
            <p className="mt-6 max-w-[52ch] text-[15px] leading-[1.6] text-white/72">
              Plataforma acadêmico-clínica para o acompanhamento fonoaudiológico entre consultório,
              família e escola. As atividades de rastreio não substituem a avaliação presencial.
            </p>
          </div>

          <nav aria-label="Rodapé" className="grid grid-cols-2 gap-10 sm:grid-cols-3 lg:gap-16">
            <div className="flex flex-col items-start gap-3">
              <p className="text-[13px] font-semibold text-on-band-muted">Plataforma</p>
              <a href="#/triagem" className={linkClass}>Rastreio fonológico</a>
              <a href="#/acesso" className={linkClass}>Área do profissional</a>
              <a href="#/acesso" className={linkClass}>Área da família</a>
            </div>
            <div className="flex flex-col items-start gap-3">
              <p className="text-[13px] font-semibold text-on-band-muted">Ética</p>
              <button type="button" onClick={() => setDialog('pesquisa')} className={linkClass}>
                Pesquisa e validação
              </button>
              <button type="button" onClick={() => setDialog('privacidade')} className={linkClass}>
                Privacidade e LGPD
              </button>
            </div>
            <div className="flex flex-col items-start gap-3">
              <p className="text-[13px] font-semibold text-on-band-muted">Suporte</p>
              <button type="button" onClick={() => setShowA11y(true)} className={linkClass}>
                Acessibilidade
              </button>
              <button type="button" onClick={() => setDialog('contato')} className={linkClass}>
                Contato acadêmico
              </button>
            </div>
          </nav>
        </div>

        <div className="flex flex-col items-start justify-between gap-3 pt-8 text-[14px] text-white/65 sm:flex-row sm:items-center">
          <p>© {new Date().getFullYear()} FonoSync · Projeto acadêmico-clínico (FATEC)</p>
          <p>Rastreio não é diagnóstico clínico</p>
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
