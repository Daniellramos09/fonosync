# FonoSync — Design System

Rebrand de 2026-11-27. Tokens vivem em `src/index.css` (`@theme`), com variações para modo escuro, alto contraste e daltonismo.

## Ideia central

A fala da criança como matéria do design: palavras separadas em sílabas (`pa·la·vra`, ponto em coral), fotografia real de atendimento em escala grande e quatro personagens da fauna brasileira que acompanham a jornada.

## Cor

| Token | Valor | Uso |
| --- | --- | --- |
| `ocean` / `primary` | #235B63 | Identidade, botões primários, faixas inteiras (rastreio) |
| `ocean-deep` | #17434A | Rodapé, menu móvel, cabeçalho da triagem |
| `nevoa` | #F3F8F6 | Fundo de seções calmas e da área de trabalho |
| `salvia` | #D6EAE4 | Campo de seção (acessibilidade), estado "dentro do esperado" |
| `coral` / `coral-ink` | #F4B7A3 / #A8492C | Campo "Famílias"; o ponto silábico e o cursor |
| `mel` | #F5D887 | CTA sobre foto/faixa escura, seleção de texto, convite final |
| `lavanda` | #D8D0EB | Campo da jornada, Jogo da Rima |
| `quente` / `surface` | #FFFCF7 | Fundo da página |
| `ink` | #283A43 | Texto principal |
| `muted` | #586B73 | Texto secundário (escurecido do #61747C do briefing para passar AA sobre névoa) |
| `on-pastel` | #283A43 | Texto sobre campos pastel; não inverte no modo escuro |

| `azul-petroleo` / `azul` / `azul-vivo` | #1D4E68 / #2C6AA6 / #4C9BE8 | Área de acesso: botões, foco e detalhes; vêm do gradiente da logo original |
| `azul-profundo` | #13304A | Fundo e sobreposição dos banners fotográficos |
| `gelo` / `creme` | #EAF3FB / #FFFAF2 | Campos preenchidos, seletor de perfil / fundo da área de acesso |

Regras: cada cor pastel **possui** uma seção ou um bloco inteiro; não espalhar como acento. No máximo um pastel por seção. Texto sobre pastel sempre `text-on-pastel`.

## Tipografia

- **Fraunces** (eixos `SOFT`, `WONK`) para títulos. Classe `.display` = SOFT 100, WONK 1, tracking −0,025em, entrelinha 1,02. Títulos de seção 40→60px; hero 50→88px.
- **Manrope** para texto, interface e formulários. Corpo 15–19px, entrelinha 1,55–1,65, largura 40–56ch.
- Componente `Silabas` (em `LandingPage.jsx`) separa palavras com `·` em coral; o ponto é `aria-hidden` e não é lido pelo leitor de voz.
- Sem sobretítulos (eyebrows) acima dos títulos.

## Forma

- Canto de **balão de fala**: raio moderado com um canto agudo (`rounded-[12px] rounded-bl-[3px]`). Vale para botões, chips, cartões de nota e painéis (painéis grandes: `rounded-[22–28px] rounded-bl-[5–6px]`).
- Fotos com recortes variados (um canto muito arredondado, `rounded-tr-[90px]`; fotos sobrepostas com borda da cor do fundo). Nunca todas no mesmo cartão.
- Listas editoriais com fios (`border-t`/`border-b`) no lugar de grades de cartões.

## Botões (`src/components/buttonStyles.js`)

`buttonClass(variant, size)` — variantes `primary`, `secondary` (contorno), `tertiary` (texto sublinhado), `danger`, `mel` (sobre foto/faixa), `claro` (vidro sobre escuro); tamanhos `md` e `lg`. Hover escurece o fundo; `active` desce 1px.

## Personagens (`src/components/Personagens.jsx`)

| Personagem | Papel | Onde |
| --- | --- | --- |
| Capivara | acolhe, comemora | Famílias, convite final, resultado da triagem (acenando + sílabas que sobem) |
| Tucano | fala, instrui | Ficha do hero, Fonoaudiólogos, cabeçalho dos jogos (pula quando a resposta esperada é registrada), tela de acesso |
| Tartaruga | ritmo, jornada | Trilha da jornada (anda com a rolagem), checklist 6+ |
| Sapinho | som | Banner da família na área de acesso (o papo enche e solta anéis sonoros) |
| Sagui | curiosidade | Escolas, Jogo da Rima (segura um bloquinho com letra) |

Animações em `index.css` (`char-olho`, `char-acena`, `char-bico`, `char-pula`, …). Todas desligam com `prefers-reduced-motion` e com "reduzir movimento" do painel A11y. Prop `animated={false}` para usos pequenos/repetidos.

## Movimento

Um momento por superfície: linhas do título do hero entrando, tartaruga andando com a rolagem (`animation-timeline: view()`, sem efeito em navegadores sem suporte), reação do tucano no jogo, comemoração no resultado.

## Fotografia

Natural, luz suave, adulto e criança em atividade real, sem pose para a câmera. Créditos em `src/assets/images/photos/CREDITOS.md`. As imagens de `care/` geradas por IA têm marca d'água no canto inferior direito; enquadrar para escondê-la ou substituir.

## Área de acesso (`src/pages/AccessArea.jsx`)

Formulário à esquerda, banner fotográfico à direita ocupando toda a altura (no celular o banner vira uma faixa no topo). O seletor "Sou profissional / Família ou paciente" troca o título, o banner (fotos cruzam com fade) e as opções de cadastro; "Entrar / Criar conta" troca o conteúdo sem mudar de rota. Usa a **logo original** (`ModeloA_Semnome.jpg`), a mesma do resto do sistema (`src/components/Logo.jsx`). Profissional: Tucano e nota de sessão flutuante, tom sóbrio. Família: Sapinho, sílabas flutuando, confetes discretos e a Capivara sentada na divisa entre formulário e foto.
