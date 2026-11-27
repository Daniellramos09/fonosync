# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- **Fonoaudiólogos** em clínica ou consultório: organizam pacientes, agenda, prontuário (anamnese, diagnóstico CID-10, avaliações, sessões, anexos) e relatórios.
- **Famílias / responsáveis legais** de crianças de 0 a 6+ anos: fazem o rastreio fonológico lúdico com a criança, acompanham orientações e evolução pela área do paciente.
- **Crianças**: participam das atividades de rastreio (Jogo da Palavra, Jogo da Rima, marcos iniciais) sempre acompanhadas por um adulto.
- **Escolas e educadores**: usam o checklist escolar (6+ anos) para apoiar encaminhamentos. *(inferido do produto atual)*

## Product Purpose

Conectar fonoaudiólogo, família e escola em torno do desenvolvimento da fala e da linguagem da criança: rastreio lúdico por faixa etária sem cadastro prévio, prontuário clínico completo e continuidade do cuidado em casa. O rastreio é apoio, nunca substitui a avaliação presencial do fonoaudiólogo.

## Positioning

Rastreio fonológico real por faixa etária (processos fonológicos mapeados, rodadas curtas, devolutiva ética) ligado ao mesmo prontuário que o fonoaudiólogo usa na clínica — o elo entre a brincadeira em casa e o registro clínico.

## Operating Context

SPA React 19 + Vite + Tailwind 4, roteamento por hash (`#/`, `#/triagem`, `#/acesso`, `#/profissional/...`, `#/paciente`). Backend Spring (repositório `fonosync-api`) com JWT, OAuth Google e RBAC. Uso em celular, tablet e computador do consultório.

## Capabilities and Constraints

- Triagem: 0–2 anos (marcos), 2–4 (Jogo da Palavra), 4–5 (Jogo da Rima), 6+ (checklist escolar); 5 rodadas; relatório em TXT.
- Prontuário: anamnese, diagnóstico com CID-10, avaliações, sessões ligadas à agenda, anexos, responsável legal obrigatório.
- Acessibilidade nativa: leitura de página por voz com marca-texto, modo escuro, alto contraste, modos de daltonismo, fonte/espaçamento, alvos grandes, redução de movimento.
- LGPD: sem CPF infantil; documentos com CRFa.
- Não alterar backend, API, banco ou autenticação a partir do frontend.

## Brand Commitments

- Nome: **FonoSync**. Logo original (escudo com ondas sonoras em degradê, `ModeloA_Semnome.jpg`) mantida em todo o sistema; o wordmark "Fono·Sync" foi descartado a pedido do usuário (2026-11-27).
- Personagens autorais inspirados na fauna brasileira (capivara, tucano, tartaruga, sagui) fazem parte da identidade lúdica, usados com intenção — não como decoração.
- Paleta, tipografia (Fraunces + Manrope) e referência visual (HU Health) fixadas pelo usuário no briefing de rebrand de 2026-11-27.

## Evidence on Hand

- Fotografias: `src/assets/images/care/` (9, algumas geradas por IA, ~735px) e `src/assets/images/photos/` (Unsplash License, créditos em `CREDITOS.md`).
- Não existem depoimentos, números de usuários, clientes, prêmios ou certificações verificadas: não inventar. Nomes de pacientes em demonstrações são fictícios e devem ser lidos como exemplo.

## Product Principles

1. A criança nunca sente que está fazendo uma prova.
2. Clareza clínica primeiro: o profissional confia porque entende o que vê.
3. A família é parte do cuidado, não espectadora.
4. Acessibilidade é recurso do produto, não ajuste posterior.
5. Nada de números ou provas inventados.

## Accessibility & Inclusion

WCAG AA como piso; navegação completa por teclado; respeitar `prefers-reduced-motion` e a preferência de movimento do painel A11y; todos os temas (escuro, alto contraste, daltonismo) devem continuar funcionando.
