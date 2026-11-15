# FonoSync — Documentação da Prova Final de IHC (Interação Humano-Computador)

**Projeto:** FonoSync — Plataforma Digital Integrada de Gestão Fonoaudiológica e Triagem Lúdica Infantil  
**Disciplina:** Interação Humano-Computador (IHC) / Projeto Web (PW)  
**Data Limite de Entrega:** 16/11 às 18h00  
**Tempo de Apresentação:** 12 a 15 minutos  

---

## 1. Introdução ao Projeto

### 1.1 Contexto e Justificativa Clínica
Estudos fonoaudiológicos (ex.: *Cavalheiro et al., 2010; Rabelo et al., 2010*) apontam que alterações no desenvolvimento da fala e desvios fonológicos atingem **até 25% das crianças** em idade escolar. O diagnóstico tardio acarreta impactos severos na alfabetização, socialização e autoestima infantil. 

Paralelamente, fonoaudiólogos autônomos e clínicas multidisciplinares enfrentam severa fragmentação operacional: prontuários em papel ou planilhas despadronizadas, ausência de rastreamento longitudinal e ferramentas de triagem sem respaldo científico.

### 1.2 A Solução FonoSync
O **FonoSync** é um ecossistema digital com arquitetura centrada em duas personas com necessidades distintas:
1. **Profissional (Fonoaudiólogo):** Módulo Web responsivo de alta densidade informacional para gestão clínica, controle de prontuários (anamnese, diagnóstico, avaliações, anexos), agendamentos e emissão de relatórios/atestados.
2. **Criança & Família (Paciente):** Módulo Mobile/App gamificado, fundamentado no protocolo clínico **TERDAF** (validado com mais de 2.000 crianças e sensibilidade de 81,6%), com tarefas de nomeação rápida, discriminação fonológica, retorno sonoro positivo e linguagem empática.

---

## 2. Prototipação Web — Software em Execução (Prototipação Horizontal)

A plataforma Web está implementada com **React 19 + Tailwind CSS + Vite**, conectada a uma API REST em **Java 21 / Spring Boot 3** e banco relacional **PostgreSQL (NeonDB)**.

### 2.1 Cobertura da Prototipação Horizontal (Visão Holística)
A prototipação horizontal cobre todas as camadas funcionais do sistema:
* **Landing Page Institucional (`/#`):** Apresentação da proposta de valor, estatísticas clínicas, navegação com âncoras e acesso direto à experimentação de triagem.
* **Autenticação e Perfis Seguros (`/#/acesso`):** Fluxo unificado com RBAC (*Role-Based Access Control*) diferenciando perfis `ROLE_FONO` e `ROLE_PACIENTE`.
* **Painel do Profissional (`/#/profissional`):**
  * *Início:* Indicadores do dia, sessões pendentes e atalhos rápidos.
  * *Gestão de Pacientes:* Tabela paginada, filtros por faixa etária, cadastro com validação de menor de idade (LGPD) e edição.
  * *Prontuário Clínico Completo:* Navegação tabulada por Histórico de Sessões, Avaliações Clínicas, Diagnóstico & Conduta, Anamnese e Anexos/Exames com upload em nuvem.
  * *Agenda Clínica:* Gestão de consultas futuras com alteração de status (`AGENDADO`, `REALIZADA`, `FALTA_JUSTIFICADA`).
  * *Relatórios & Atestados:* Geração em tempo real de documentos com cabeçalho clínico oficial e exportação para impressão/PDF.
* **Painel da Família / Paciente (`/#/paciente`):** Visualização de consultas agendadas, orientações do fonoaudiólogo e trilha de atividades/jogos.

---

## 3. Prototipação App (Dispositivo Móvel)

A experiência mobile do FonoSync foi desenvolvida sob a abordagem **Mobile-First / PWA**, simulando perfeitamente a usabilidade de um aplicativo nativo em smartphones e tablets.

### 3.1 Módulo App de Triagem Infantil Gamificada (`/#/triagem`)
* **Fluxo Autônomo e Adaptativo:**
  * Seleção de Faixa Etária:
    * *2 a 4 anos:* Jogo da Palavra (nomeação de figuras lúdicas e reconhecimento de trocas fonológicas).
    * *4 a 5 anos:* Jogo da Rima (discriminação auditiva e consciência fonológica).
    * *6+ anos:* Checklist funcional escolar integrado.
* **Design Tátil Infantil:** Botões e cartões de resposta com áreas de toque ampliadas (mínimo de 56x56px, acima dos 44px recomendados pela Apple e Google), evitando frustração motora em crianças pequenas.
* **Barra de Progresso Lúdica:** Indicador visual animado que estimula a conclusão do jogo terapêutico sem sobrecarga de texto.
* **Exportação Acessível:** Conclusão da triagem com geração de resultado compreensível e download em texto acessível (`.txt`) direto no smartphone da família.

### 3.2 Painel Mobile do Fonoaudiólogo
* **Navegação Off-Canvas (Drawer):** Menu hambúrguer deslizante com trava de rolagem de fundo (*body lock*) e foco acessível.
* **Tabelas e Cards Adaptativos:** Conversão automática de tabelas com rolagem horizontal suave e quebra em cartões verticais em telas estreitas (< 768px).

---

## 4. Análise Crítica de IHC: Usabilidade, Comunicabilidade e Acessibilidade

### 4.1 Usabilidade (Heurísticas de Nielsen)
1. **Visibilidade do Estado do Sistema (Heurística 1):**
   * Implementação de **Skeleton Screens** pulsantes durante o carregamento assíncrono do prontuário médico.
   * Feedback visual imediato através do componente global de `Notice` (verde para sucesso, vermelho para alerta).
   * Botões com estado `disabled` e spinners de carregamento (*"Salvando..."*, *"Gravando..."*) que eliminam cliques duplos acidentais.
2. **Correspondência entre o Sistema e o Mundo Real (Heurística 2):**
   * Metáfora clara: **A Agenda é o futuro** (o que vai acontecer); **A Sessão é o passado/prontuário** (o registro de fatos ocorridos).
3. **Prevenção e Tratamento Orientativo de Erros (Heurísticas 5 e 9):**
   * Eliminação de erros opacos como *"Forbidden"*, substituídos por mensagens orientativas: *"Acesso não autorizado: sua conta não possui permissão de fonoaudiólogo para esta operação"*.
   * Tratamento de duplicidade de CPF ou conflito de dados com orientações claras de conferência.
4. **Reconhecimento em vez de Memorização (Heurística 6):**
   * **Autocomplete Clínico Guiado:** Inclusão de `datalist` nos campos de **CID-10** (ex.: *F80.0, F80.1, F98.5 Gagueira, R47.0 Afasia, R49.0 Voz*), **Áreas Terapêuticas** e **Periodicidade das Sessões**, diminuindo a digitação manual de códigos complexos.

### 4.2 Comunicabilidade (Engenharia Semiótica & UX Writing)
* **Eliminação de Estrangeirismos:** Tradução de jargões técnicos do desenvolvimento para a linguagem clínica natural (ex.: substituição de *"Tags Clínicas"* por *"Marcadores Clínicos / Focos da Sessão"*).
* **Duplo Tom de Voz:**
  * *Profissional:* Vocabulário estritamente técnico, terminologia fonoaudiológica oficial (CFFA) e alta densidade de dados.
  * *Família:* Acolhedor, sem patologização prematura, orientando a busca de auxílio clínico especializado sem gerar pânico.

### 4.3 Acessibilidade Diferenciada (Além daquela nativa do SO)
O FonoSync implementa um **Painel de Acessibilidade Flutuante Próprio (`AccessibilityPanel.jsx`)**, acionado por tecla de atalho ou botão persistente na interface:

* **Síntese de Voz Nativa da Web (Text-to-Speech Web Speech API):**
  * Leitura em voz alta de qualquer seção, com controle customizado de velocidade de fala ($0,75\times$ a $1,5\times$) e alternância de vozes em Português do Brasil.
* **Modos de Alto Contraste e Daltonismo:**
  * Modos selecionáveis: Alto Contraste, Modo Escuro (*Dark Mode*), Protanopia, Deuteranopia e Tritanopia.
* **Controle Tipográfico e Espaçamento:**
  * Aumento e diminuição de fonte em tempo real sem quebra de layout.
  * Ajuste de altura de linha (*leading*) e espaçamento entre letras (*tracking/kerning*), facilitando a leitura para usuários com dislexia ou baixa visão.
* **Modo Motor / Alvos Ampliados:**
  * Opção de *"Aumentar elementos interativos"*, elevando áreas de clique para além dos padrões usuais, auxiliando profissionais ou pacientes com tremores ou dificuldades de motricidade fina.
* **Redução de Movimento (*prefers-reduced-motion*):** Desativação de transições e animações para evitar tontura ou desconforto vestibular.

---

## 5. Roteiro Cronometrado para a Apresentação (12 a 15 Minutos)

| Minuto | Bloco | Conteúdo da Apresentação | O que mostrar na tela |
| :---: | :--- | :--- | :--- |
| **00:00 - 02:00** | **1. Introdução & Problema** | • Apresentação do grupo e propósito do FonoSync.<br>• Estatística clínica (25% das crianças têm alteração de fala).<br>• Justificativa científica (protocolo TERDAF). | Slide de introdução / Banner com a fundamentação científica e diagramas. |
| **02:00 - 05:00** | **2. Prototipação Web (Gestão Clínica)** | • Navegação no Painel do Fonoaudiólogo em execução.<br>• CRUD de Pacientes: listagem e cadastro com regra de menor (LGPD).<br>• Prontuário vivo: Anamnese, Diagnóstico com autocomplete CID-10 e Avaliações salvas no PostgreSQL NeonDB. | Software Web rodando (`localhost` ou link na nuvem). Mostrar o preenchimento e salvamento. |
| **05:00 - 08:00** | **3. Prototipação Mobile (App)** | • Demonstração no modo Responsivo / Celular.<br>• Menu hambúrguer com transição tátil.<br>• **Módulo de Triagem Gamificada Infantil (TERDAF):** tarefas por faixa etária, botões grandes e conclusão com emissão de resultado. | Inspecionar elemento no Chrome (emular iPhone/Android) executando `/#/triagem`. |
| **08:00 - 11:00** | **4. Acessibilidade (Além do SO)** | • Abrir o painel exclusivo de acessibilidade do FonoSync.<br>• Ativar Síntese de Voz (leitura dos elementos em áudio).<br>• Ativar Alto Contraste, Modos de Daltonismo e ampliação tipográfica. | Clicar no botão de Acessibilidade e testar a voz e contraste ao vivo. |
| **11:00 - 13:30** | **5. Usabilidade e Comunicabilidade (IHC)** | • Destacar as Heurísticas de Nielsen aplicadas (prevenção de erros orientativa, skeletons, semáforos de status).<br>• Diferença de tom de voz (família leiga vs fonoaudiólogo especialista).<br>• Metáfora da Agenda (futuro) vs Sessão (passado). | Telas de erro amigável, autocomplete e histórico de sessões. |
| **13:30 - 15:00** | **6. Conclusão & Perguntas** | • Próximos passos previstos na matriz curricular (criptografia AES-256 e nuvem OCI).<br>• Fechamento e agradecimento à banca avaliadora. | Tela inicial com créditos do grupo e abertura para arguição. |

---

## 6. Checklist Final de Entrega (Até 16/11 às 18h)
- [x] **Software Web executando:** Spring Boot na porta 8080 + React/Vite na porta 5173/5174 com dados persistidos no PostgreSQL NeonDB.
- [x] **Módulo Mobile implementado:** Triagem lúdica gamificada (`/#/triagem`) e dashboard com drawer móvel.
- [x] **Recursos de Acessibilidade além do SO:** Painel flutuante com Text-to-Speech nativo, modos de daltonismo, redimensionamento de fontes e alvos motores ampliados.
- [x] **Prototipação Horizontal Completa:** Fluxos de autenticação, pacientes, prontuário, relatórios e agenda integrados.
- [x] **Código versionado e atualizado no Git:** Repositório sincronizado no GitHub.
