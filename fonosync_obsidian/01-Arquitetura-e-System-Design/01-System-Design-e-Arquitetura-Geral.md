---
title: "01 · System Design, Diagramas C4 e Modelagem de Dados (DER)"
tags:
  - fonosync
  - arquitetura
  - system-design
  - c4-model
  - der
  - postgresql
  - spring-boot
  - java-21
created: 2026-11-27
updated: 2026-11-27
status: active
aliases:
  - "System Design FonoSync"
  - "Arquitetura Geral FonoSync"
  - "DER FonoSync"
---

# 🏛️ System Design, Diagramas C4 e Modelagem de Dados (DER)

> [!NOTE] Navegação no Second Brain
> - **Índice Central:** [[00-FonoSync-Second-Brain-MOC|00 · MOC Índice Central]]
> - **Princípios de Engenharia:** [[01-Principios-SOLID-e-Padroes-de-Projeto|01 · Princípios SOLID e Padrões de Projeto]]
> - **Contratos REST & CRUD:** [[02-Catalogo-CRUD-Endpoints-e-Regras-de-Negocio|02 · Catálogo CRUD, Endpoints e GlobalExceptionHandler]]
> - **Infraestrutura & Segurança:** [[01-Cloud-Neon-OCI-Vercel-Seguranca-e-LGPD|01 · Multi-Cloud (Neon SP, OCI, Vercel), JWT, BCrypt e LGPD]]
> - **Arquitetura Frontend:** [[01-Arquitetura-Frontend-React-Rotas-Estado|01 · Arquitetura Frontend React 19]]

---

## 1. Visão Geral do Ecossistema FonoSync

### 1.1 O Problema Clínico: Fragmentação Terapêutica
Na prática fonoaudiológica tradicional — especialmente no acompanhamento do desenvolvimento infantil (transtornos fonológicos, atrasos de linguagem, fluência e motricidade orofacial) — existe um **abismo de continuidade entre três pilares essenciais**:
1. **O Consultório Clínico:** Onde o fonoaudiólogo realiza a anamnese, avaliações formais, diagnóstico (CID-10), planejamento terapêutico e sessões semanais de 50 minutos.
2. **A Família (Ambiente Doméstico):** Onde ocorre a maior parte da estimulação diária, mas que frequentemente carece de orientação estruturada, instrumentos lúdicos adequados à faixa etária e acesso transparente à evolução da criança.
3. **A Escola (Ambiente Educacional):** Onde os sinais precoces de dificuldades fonológicas, de leitura/escrita ou de socialização se manifestam primeiro, mas raramente são comunicados de forma técnica e estruturada ao terapeuta.

Sem uma plataforma unificada, os dados clínicos ficam dispersos em prontuários de papel, planilhas isoladas, áudios de WhatsApp e laudos em PDF perdidos, prejudicando a **intervenção precoce** e a **adesão familiar ao tratamento**.

### 1.2 A Solução Integrada: Consultório — Família — Escola
O **FonoSync** resolve essa fragmentação por meio de uma arquitetura web moderna, acessível e segura que conecta:
- **Triagem Fonológica Gamificada & Acolhedora:** Instrumentos interativos por faixa etária (`0–2 anos`, `2–4 anos`, `4–5 anos`, `6+ anos`) que auxiliam famílias e educadores a identificar sinais de alerta sem gerar ansiedade, encaminhando a criança ao especialista com dados estruturados de pré-cadastro (`PRE_CADASTRO`).
- **Prontuário Eletrônico Longitudinal (EHR Fonoaudiológico):** Gestão integrada de Pacientes (`PatientEntity`), Responsáveis Legais (`GuardianEntity`), Anamneses (`AnamnesisEntity`), Avaliações Clínicas (`EvaluationEntity`), Diagnósticos com CID-10 (`DiagnosticEntity`), Agenda (`AppointmentEntity`) e Evoluções de Sessão (`SessionEntity`).
- **Repositório Clínico em Nuvem (Cloud Object Storage):** Armazenamento seguro de exames, gravações de áudio de fala, relatórios escolares e laudos em PDF via **Oracle Cloud Infrastructure (OCI Object Storage)**.

---

## 2. Modelagem Arquitetural C4 (Contexto, Containers e Componentes)

A arquitetura do FonoSync foi documentada seguindo o modelo **C4 (Context, Containers, Components, Code)** de Simon Brown, garantindo rastreabilidade desde a visão de negócio até as classes Java do Spring Boot.

### 2.1 Nível 1 — Diagrama de Contexto do Sistema (C4 Context)

```mermaid
flowchart TB
    subgraph Atores["👥 Atores do Ecossistema"]
        FONO["👩‍⚕️ Fonoaudiólogo(a)\n(CRFa Ativo / ROLE_FONO)"]
        FAMILIA["👨‍👩‍👧 Paciente / Responsável Legal\n(Família / ROLE_PACIENTE)"]
        ADMIN["🛡️ Administrador Clínico\n(Gestão / ROLE_ADMIN)"]
    end

    FONOSYNC["🏥 Plataforma FonoSync\n(Ecossistema Clínico e Triagem Gamificada)"]

    subgraph Externos["☁️ Serviços Cloud & Infraestrutura Externa"]
        NEON[("🐘 Neon Serverless PostgreSQL\n(Região aws-sa-east-1 São Paulo)")]
        OCI[("📦 Oracle Cloud Infrastructure\n(OCI Object Storage - Bucket de Laudos/Áudios)")]
        SPEECH["🔊 Web Speech API\n(Síntese de Voz Nativa A11y)"]
    end

    FONO -->|"Gerencia prontuários, agenda, sessões,\navaliações, diagnósticos e laudos"| FONOSYNC
    FAMILIA -->|"Realiza triagem fonológica gamificada,\nacompanha agenda e evolução"| FONOSYNC
    ADMIN -->|"Audita registros, permissões\ne conformidade clínica"| FONOSYNC

    FONOSYNC -->|"Persiste entidades relacionais\nvia JDBC / HikariCP (TLS)"| NEON
    FONOSYNC -->|"Armazena e recupera binários clínicos\nvia OCI Java SDK v3.30.0"| OCI
    FONOSYNC -->|"Leitura assistiva de tela e estímulos\nsonoros da triagem"| SPEECH
```

---

### 2.2 Nível 2 — Diagrama de Containers (C4 Container)

```mermaid
flowchart LR
    subgraph Cliente["🖥️ Navegador do Usuário (Client-Side)"]
        SPA["⚛️ FonoSync Web App (SPA)\nReact 19 + TypeScript + Vite\nTailwind CSS + Design System Impeccable\n(Hospedado na Vercel CDN)"]
    end

    subgraph Backend["⚙️ Camada de Aplicação (Server-Side)"]
        API["☕ FonoSync REST API\nJava 21 LTS + Spring Boot\nSpring Security 6 + JWT (Auth0)\nSpring Data JPA / Hibernate\nSpringDoc OpenAPI 3 (Swagger)"]
    end

    subgraph Dados["🗄️ Persistência Multi-Cloud"]
        PG[("🐘 Neon PostgreSQL 16\naws-sa-east-1 (São Paulo)\nDados Estruturados & Prontuário")]
        BUCKET[("☁️ Oracle OCI Object Storage\nBucket Clínico Privado\nAnexos PDF, Imagens e Áudios")]
    end

    SPA -->|"HTTPS REST / JSON\nHeader: Authorization Bearer <JWT>\nMultipart/Form-Data (Uploads)"| API
    API -->|"TCP/SSL (Port 5432)\nPooler JDBC / JPA Queries"| PG
    API -->|"HTTPS / OCI SDK REST\nPutObject / GetObject (Streams)"| BUCKET
```

---

### 2.3 Nível 3 — Diagrama de Componentes do Backend (C4 Component)

```mermaid
flowchart TB
    subgraph SecurityLayer["🔐 Camada de Segurança Transversal (security)"]
        FILTER["SecurityFilter\n(OncePerRequestFilter)"]
        TOKEN["TokenService\n(HMAC256 JWT Auth0)"]
        ENTRY["RestAuthenticationEntryPoint\n(Padronização 401 StandardError)"]
        SECCONFIG["SecurityConfig\n(RBAC + BCrypt + CORS)"]
    end

    subgraph ExceptionLayer["🛡️ Governança de Erros (infra.exception)"]
        GEH["GlobalExceptionHandler\n(@RestControllerAdvice)"]
        STDERR["StandardError / FieldError\n(Java Records Imutáveis)"]
    end

    subgraph Controllers["🌐 Camada de Apresentação REST (@RestController)"]
        AUTH_C["AuthController\n(/api/auth)"]
        PAT_C["PatientController\n(/api/paciente)"]
        GUARD_C["GuardianController\n(/api/guardians)"]
        PROF_C["ProfesisonalController\n(/api/professionals)"]
        ANAM_C["AnamnesisController\n(/api/anamnesis)"]
        EVAL_C["EvaluationController\n(/api/evaluation)"]
        DIAG_C["DiagnosticController\n(/api/diagnostic)"]
        APPT_C["AppointmentController\n(/api/appointments)"]
        SESS_C["SessionController\n(/api/session)"]
        ATT_C["AttachmentController\n(/api/attachments)"]
    end

    subgraph Services["🧠 Camada de Regras de Negócio (@Service)"]
        PAT_S["PatientService\n(Validação <18 anos e CPF)"]
        GUARD_S["GuardianService\n(Conciliação CPF Responsável)"]
        PROF_S["ProfessionalService\n(Vínculo CRFa + Usuário)"]
        ANAM_S["AnamnesisService"]
        EVAL_S["EvaluationService\n(Ciclo de Conclusão)"]
        DIAG_S["DiagnosticService"]
        APPT_S["AppointmentService\n(Máquina de StatusSessao)"]
        SESS_S["SessionService\n(@Transactional Agenda <-> Prontuário)"]
        ATT_S["AttachmentService"]
        OCI_S["OracleOciService\n(Integração SDK Oracle BMC)"]
    end

    subgraph Repositories["💾 Camada de Persistência (@Repository / JpaRepository)"]
        REPOS["UserRepository | PatientRepository | GuardianRepository\nProfessionalRepository | AnamnesisRepository | EvaluationRepository\nDiagnosticRepository | AppointmentRepository | SessionRepository | AttachmentRepository"]
    end

    FILTER --> TOKEN
    Controllers --> Services
    ATT_S --> OCI_S
    SESS_S --> APPT_S
    SESS_S --> PAT_S
    Services --> REPOS
    Services -.->|"Lança Exceções de Domínio"| GEH
    GEH --> STDERR
```

---

## 3. Arquitetura em Camadas do Backend

O backend do FonoSync (`br.com.fonosync.fonosyncapi`) adota uma **Arquitetura em Camadas Estrita (Layered Architecture)** combinada com organização modular por domínio clínico (*Package by Feature/Domain*).

| Camada | Responsabilidade Arquitetural | Artefatos Reais no Projeto |
| :--- | :--- | :--- |
| **1. Security & Filter Chain** | Interceptação HTTP stateless, validação de assinatura JWT (`HMAC256`), injeção de `UserDetails` no `SecurityContextHolder` e proteção RBAC (`@PreAuthorize`). | `SecurityConfig`, `SecurityFilter`, `TokenService`, `RestAuthenticationEntryPoint` |
| **2. Presentation (Controllers)** | Exposição das rotas RESTful, desserialização JSON, validação sintática via Jakarta Bean Validation (`@Valid`) e mapeamento de códigos HTTP (`200`, `201`, `204`). | `PatientController`, `AuthController`, `SessionController`, `AttachmentController`, etc. |
| **3. DTOs (Data Transfer Objects)** | Contratos imutáveis de entrada e saída implementados com **Java 21 Records**, protegendo entidades de *Mass Assignment* e ocultando dados sensíveis. | `PatientRequestDTO`, `PatientResponseDTO`, `LoginRequestDTO`, `RegisterRequestDTO`, `TokenResponseDTO`, `StandardError` |
| **4. Business / Domain (Services)** | Aplicação de invariantes clínicas (ex: obrigatoriedade de responsável para menor de 18 anos, proibição de sessão em agendamento com falta, sincronização transacional `@Transactional`). | `PatientService`, `SessionService`, `EvaluationService`, `AttachmentService`, etc. |
| **5. Cloud Integration Adapter** | Encapsulamento do SDK externo da Oracle Cloud (`com.oracle.bmc.objectstorage`), convertendo `MultipartFile` em streams binários e traduzindo falhas de rede em `StorageException`. | `OracleOciService` |
| **6. Persistence (Repositories)** | Abstração de acesso a dados via Spring Data JPA (`JpaRepository<T, UUID>`), utilizando *Derived Query Methods* otimizados. | `PatientRepository`, `SessionRepository`, `GuardianRepository`, `UserRepository`, etc. |
| **7. Domain Entities (ORM)** | Mapeamento Objeto-Relacional (JPA/Hibernate) para o PostgreSQL, utilizando chaves primárias `UUID` geradas nativamente. | `UserEntity`, `PatientEntity`, `GuardianEntity`, `ProfessionalEntity`, `SessionEntity`, etc. |
| **8. Cross-Cutting Exception Handling** | Captura centralizada de qualquer exceção lançada pelas camadas inferiores, convertendo-as no contrato JSON padronizado `StandardError`. | `GlobalExceptionHandler` (`@RestControllerAdvice`) |

---

## 4. Modelagem do Banco de Dados Relacional (DER)

### 4.1 Estratégia de Identidade: Superclasse / Base `UserEntity` (`usuario`) e Perfis Especializados
No FonoSync, a autenticação e autorização são centralizadas na entidade base **`UserEntity`** (tabela `usuario`), que implementa `UserDetails` do Spring Security e define as credenciais (`email`, `senha` com hash BCrypt) e o perfil de acesso (`PerfilEnum`: `ROLE_FONO`, `ROLE_PACIENTE`, `ROLE_ADMIN`).

A partir de `UserEntity`, o domínio clínico especializa os papéis através de associação unidirecional/bidirecional `1:1` com chave estrangeira única (`usuario_id UNIQUE`), combinando a flexibilidade de composição relacional com a hierarquia lógica de usuários do sistema:
- **Fonoaudiólogo (`ProfessionalEntity` / `SpeechTherapistEntity` — tabela `fonoaudiologo`):** Possui vínculo obrigatório (`NOT NULL UNIQUE`) com `UserEntity`, adicionando o registro profissional único **`crfa`**, `nome`, `telefone` e `especialidade`.
- **Paciente (`PatientEntity` — tabela `paciente`):** Possui vínculo opcional (`UNIQUE`) com `UserEntity` (permitindo tanto pacientes pré-cadastrados na triagem quanto pacientes com login ativo) e vínculo `@ManyToOne` com **`GuardianEntity`** (`responsavel_id`), que é **estritamente obrigatório para pacientes menores de 18 anos**.
- **Responsável Legal (`GuardianEntity` — tabela `responsavel`):** Representa o pai, mãe ou tutor legal com `cpf` único, `grau_parentesco` e lista de dependentes (`List<PatientEntity> dependents`), também podendo vincular-se a um `UserEntity` para acesso ao Portal da Família.

### 4.2 Diagrama Entidade-Relacionamento (DER Completo em Mermaid)

```mermaid
erDiagram
    USUARIO {
        UUID id PK "DEFAULT gen_random_uuid()"
        VARCHAR email UK "NOT NULL UNIQUE"
        VARCHAR senha "NOT NULL (BCrypt Hash)"
        VARCHAR perfil "NOT NULL (ROLE_FONO, ROLE_PACIENTE, ROLE_ADMIN)"
    }

    FONOAUDIOLOGO {
        UUID id PK "DEFAULT gen_random_uuid()"
        VARCHAR nome "NOT NULL"
        VARCHAR crfa UK "NOT NULL UNIQUE (Registro Conselho)"
        VARCHAR telefone "NOT NULL"
        VARCHAR especialidade "NOT NULL"
        UUID usuario_id FK,UK "NOT NULL UNIQUE -> usuario(id)"
    }

    RESPONSAVEL {
        UUID id PK "DEFAULT gen_random_uuid()"
        VARCHAR nome "NOT NULL"
        VARCHAR cpf UK "NOT NULL UNIQUE"
        VARCHAR telefone "NOT NULL"
        VARCHAR grau_parentesco "NOT NULL"
        UUID usuario_id FK,UK "NULLABLE UNIQUE -> usuario(id)"
    }

    PACIENTE {
        UUID id PK "DEFAULT gen_random_uuid()"
        VARCHAR nome_paciente "NOT NULL"
        DATE data_nascimento "NULLABLE (Valida < 18 anos)"
        VARCHAR cpf_paciente UK "NULLABLE UNIQUE"
        VARCHAR contato_paciente "NULLABLE"
        VARCHAR sexo "MASCULINO | FEMININO"
        VARCHAR cid_10 "Código CID-10 Principal"
        VARCHAR status_paciente "NOT NULL (ATIVO, ARQUIVADO, PRE_CADASTRO)"
        UUID usuario_id FK,UK "NULLABLE UNIQUE -> usuario(id)"
        UUID responsavel_id FK "Obrigatório se idade < 18 -> responsavel(id)"
    }

    ANAMNESE {
        UUID id PK "DEFAULT gen_random_uuid()"
        UUID paciente_id FK "NOT NULL -> paciente(id)"
        VARCHAR queixaprincipal "NOT NULL (300)"
        VARCHAR historicofamiliar "NOT NULL (200)"
        VARCHAR iniciosintoma "NOT NULL (200)"
        VARCHAR desenvolvimentolinguagem "NOT NULL (200)"
        VARCHAR observavaoadicionais "NOT NULL (200)"
    }

    AVALIACAO {
        UUID id PK "DEFAULT gen_random_uuid()"
        UUID paciente_id FK "NOT NULL -> paciente(id)"
        VARCHAR tipoavaliacao "NOT NULL"
        DATE dataavaliacao "NOT NULL"
        VARCHAR resultados "NOT NULL (500)"
        VARCHAR consultaproposta "Condutas Propostas"
        BOOLEAN concluido "NOT NULL (Default: false)"
    }

    DIAGNOSTICO {
        UUID id PK "DEFAULT gen_random_uuid()"
        UUID paciente_id FK "NOT NULL -> paciente(id)"
        TEXT diagnosticofonoaudiologico "NOT NULL"
        VARCHAR cid_10 "NOT NULL (4)"
        VARCHAR areaterapeutica "NOT NULL (20)"
        VARCHAR frequenciasessoes "NOT NULL (10)"
        VARCHAR objetivotratamento "NOT NULL (600)"
        VARCHAR condutaterapeutica "NOT NULL (600)"
    }

    AGENDAMENTO {
        UUID id PK "DEFAULT gen_random_uuid()"
        DATE data_agendamento "NOT NULL"
        TIME hora_agendamento "NOT NULL"
        INTEGER duracao "NOT NULL (Minutos, ex: 50)"
        VARCHAR situacao_agendamento "AGENDADO | REALIZADA | FALTA_JUSTIFICADA | FALTA_SEM_AVISO"
        UUID fonoaudiologo_id FK "-> fonoaudiologo(id)"
        UUID paciente_id FK "-> paciente(id)"
    }

    SESSAO {
        UUID id PK "DEFAULT gen_random_uuid()"
        UUID agendamento_id FK,UK "NOT NULL UNIQUE -> agendamento(id)"
        UUID paciente_id FK "-> paciente(id)"
        INTEGER numero_sessao "Sequencial do Paciente (1, 2, 3...)"
        DATE data_sessao "Data efetiva do atendimento"
        TEXT evolucao "NOT NULL (Evolução Clínica)"
        TEXT ponto_melhora "Pontos de Melhora Observados"
        VARCHAR tags "Ex: Fluência, Linguagem"
        TIMESTAMP data_registro "DEFAULT CURRENT_TIMESTAMP"
    }

    ANEXO {
        UUID id PK "DEFAULT gen_random_uuid()"
        UUID paciente_id FK "NOT NULL -> paciente(id)"
        VARCHAR nomearquivo "NOT NULL"
        TEXT descricao "Descrição clínica do documento"
        DATE dataanexo "NOT NULL (@PrePersist)"
        VARCHAR filekey "NOT NULL (UUID-filename no OCI Bucket)"
        VARCHAR tipoconteudo "MIME Type (application/pdf, audio/mpeg...)"
        BIGINT tamanhoarquivo "Tamanho em Bytes"
    }

    USUARIO ||--o| FONOAUDIOLOGO : "autentica (1:1)"
    USUARIO ||--o| RESPONSAVEL : "autentica (1:1)"
    USUARIO ||--o| PACIENTE : "autentica (1:1)"
    RESPONSAVEL ||--o{ PACIENTE : "tutela legalmente (1:N)"
    PACIENTE ||--o{ ANAMNESE : "possui histórico (1:N)"
    PACIENTE ||--o{ AVALIACAO : "submete-se a (1:N)"
    PACIENTE ||--o{ DIAGNOSTICO : "recebe (1:N)"
    PACIENTE ||--o{ ANEXO : "armazena arquivos (1:N)"
    PACIENTE ||--o{ SESSAO : "acompanhamento clínico (1:N)"
    FONOAUDIOLOGO ||--o{ AGENDAMENTO : "atende em (1:N)"
    PACIENTE ||--o{ AGENDAMENTO : "agenda (1:N)"
    AGENDAMENTO ||--o| SESSAO : "gera evolução clínica (1:1)"
```

> [!TIP] Prevenção de Loops Infinitos de Serialização e StackOverflowError
> Nas relações bidirecionais do JPA — como `GuardianEntity` $\leftrightarrow$ `PatientEntity` e `PatientEntity` $\leftrightarrow$ `AttachmentEntity` — o projeto utiliza explicitamente `@ToString.Exclude`, `@EqualsAndHashCode.Exclude` (do Lombok) e `@JsonIgnore` / `@JsonIgnoreProperties` (do Jackson) para evitar recursão infinita (`StackOverflowError`) durante logs ou serialização JSON.

---

## 5. Fluxos de Comunicação End-to-End (Frontend $\leftrightarrow$ Backend $\leftrightarrow$ Neon $\leftrightarrow$ OCI)

### 5.1 Fluxo 1: Autenticação Stateless e Cadastro de Paciente Menor de Idade
Este diagrama de sequência demonstra a validação de segurança (`SecurityFilter`) e a regra de negócio clínica que exige um `GuardianEntity` para pacientes menores de 18 anos.

```mermaid
sequenceDiagram
    autonumber
    actor Fono as 👩‍⚕️ Fonoaudiólogo (React SPA)
    participant Filter as 🔐 SecurityFilter / TokenService
    participant Ctrl as 🌐 PatientController
    participant Svc as 🧠 PatientService
    participant GuardRepo as 💾 GuardianRepository
    participant PatRepo as 💾 PatientRepository
    participant Neon as 🐘 Neon PostgreSQL (sa-east-1)

    Fono->>Filter: POST /api/paciente/register (Bearer JWT + PatientRequestDTO)
    Filter->>Filter: validateToken(jwt) via HMAC256
    Filter->>Neon: SELECT * FROM usuario WHERE email = ?
    Neon-->>Filter: UserEntity (ROLE_FONO)
    Filter->>Ctrl: Autenticado no SecurityContextHolder (@PreAuthorize OK)
    Ctrl->>Svc: register(PatientRequestDTO)
    
    alt CPF informado já existe no banco
        Svc->>PatRepo: existsByCpfPatient(cpf)
        PatRepo-->>Svc: true
        Svc-->>Fono: 409 Conflict (CpfAlreadyExistsException -> StandardError)
    end

    opt guardianId informado no DTO
        Svc->>GuardRepo: findById(guardianId)
        GuardRepo->>Neon: SELECT * FROM responsavel WHERE id = ?
        Neon-->>GuardRepo: GuardianEntity
    end

    Svc->>Svc: validarResponsavelParaMenor(dateOfBirth, guardian)
    
    alt Idade < 18 anos E guardian == null
        Svc-->>Fono: 400 Bad Request (GuardianRequiredException -> StandardError)
    else Dados válidos (Maior de 18 ou Menor com Responsável)
        Svc->>PatRepo: save(PatientEntity)
        PatRepo->>Neon: INSERT INTO paciente (...) VALUES (...)
        Neon-->>PatRepo: PatientEntity persistido (UUID)
        PatRepo-->>Svc: PatientEntity
        Svc-->>Ctrl: PatientEntity
        Ctrl-->>Fono: 201 Created (PatientResponseDTO)
    end
```

---

### 5.2 Fluxo 2: Upload e Download Híbrido de Anexos Clínicos (Neon PostgreSQL + Oracle OCI)
Para manter o banco relacional leve e performático no Neon PostgreSQL, **nenhum binário (`BLOB`/`BYTEA`) é salvo no banco de dados**. O arquivo físico vai para o bucket da **Oracle Cloud (OCI)**, enquanto os metadados e a chave única (`fileKey`) são gravados na tabela `anexo`.

```mermaid
sequenceDiagram
    autonumber
    actor Fono as 👩‍⚕️ Fonoaudiólogo (React SPA)
    participant AttCtrl as 🌐 AttachmentController
    participant AttSvc as 🧠 AttachmentService
    participant OciSvc as ☁️ OracleOciService
    participant OCI as 📦 Oracle Cloud Object Storage
    participant Neon as 🐘 Neon PostgreSQL (sa-east-1)

    Note over Fono,Neon: ETAPA A: Upload de Laudo / Áudio Clínico (Multipart)
    Fono->>AttCtrl: POST /api/attachments/upload (patientId, file, description)
    AttCtrl->>AttSvc: uploadAttachment(patientId, file, description)
    AttSvc->>Neon: SELECT * FROM paciente WHERE id = patientId
    Neon-->>AttSvc: PatientEntity válido
    AttSvc->>OciSvc: uploadFile(MultipartFile)
    OciSvc->>OciSvc: Gera fileKey = UUID.randomUUID() + "-" + originalFilename
    OciSvc->>OCI: PutObjectRequest (InputStream, Content-Type, Content-Length)
    
    alt Falha de Rede ou Permissão OCI
        OCI-->>OciSvc: BMC Exception
        OciSvc-->>Fono: 502 Bad Gateway (StorageException -> GlobalExceptionHandler)
    else Upload OCI Concluído
        OCI-->>OciSvc: 200 OK (Object Stored)
        OciSvc-->>AttSvc: Retorna fileKey
        AttSvc->>Neon: INSERT INTO anexo (paciente_id, nomearquivo, filekey, tipoconteudo, tamanhoarquivo, dataanexo)
        Neon-->>AttSvc: AttachmentEntity salvo
        AttSvc-->>AttCtrl: AttachmentEntity
        AttCtrl-->>Fono: 201 Created (JSON Metadados do Anexo)
    end

    Note over Fono,Neon: ETAPA B: Visualização Inline / Download do Anexo
    Fono->>AttCtrl: GET /api/attachments/{id}/download
    AttCtrl->>AttSvc: findById(id)
    AttSvc->>Neon: SELECT * FROM anexo WHERE id = ?
    Neon-->>AttSvc: AttachmentEntity (contendo fileKey e contentType)
    AttCtrl->>AttSvc: getAttachmentFile(attachment.getFileKey())
    AttSvc->>OciSvc: downloadFile(fileKey)
    OciSvc->>OCI: GetObjectRequest (namespace, bucket, fileKey)
    OCI-->>OciSvc: GetObjectResponse (InputStream -> byte[])
    OciSvc-->>AttCtrl: byte[] fileBytes
    AttCtrl-->>Fono: 200 OK (Content-Disposition: inline; Content-Type: original)
```
