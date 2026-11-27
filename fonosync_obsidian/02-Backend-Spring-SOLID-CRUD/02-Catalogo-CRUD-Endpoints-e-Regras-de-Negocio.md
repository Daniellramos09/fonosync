---
title: "02 · Catálogo Completo de CRUDs, Endpoints REST e Regras de Negócio"
tags:
  - fonosync
  - backend
  - crud
  - rest-api
  - endpoints
  - exception-handling
  - regras-de-negocio
  - spring-boot
created: 2026-11-27
updated: 2026-11-27
status: active
aliases:
  - "Catálogo CRUD FonoSync"
  - "Endpoints API FonoSync"
  - "GlobalExceptionHandler FonoSync"
---

# 📋 Catálogo Completo de CRUDs, Endpoints REST e Regras de Negócio

> [!NOTE] Navegação no Second Brain
> - **Índice Central:** [[00-FonoSync-Second-Brain-MOC|00 · MOC Índice Central]]
> - **Arquitetura & DER:** [[01-System-Design-e-Arquitetura-Geral|01 · System Design, Diagramas C4 e DER]]
> - **Engenharia & SOLID:** [[01-Principios-SOLID-e-Padroes-de-Projeto|01 · Princípios SOLID e Padrões de Projeto]]
> - **Infraestrutura & Segurança:** [[01-Cloud-Neon-OCI-Vercel-Seguranca-e-LGPD|01 · Multi-Cloud (Neon SP, OCI, Vercel), JWT, BCrypt e LGPD]]
> - **Qualidade & Testes:** [[01-Plano-de-QA-Auditoria-Impeccable-e-Testes|01 · Plano de QA 360º e Matriz de Testes]]

---

## 1. Visão Geral dos 10 Módulos da API FonoSync

A API REST do FonoSync está estruturada em **10 módulos funcionais** que cobrem todo o ciclo de vida do atendimento fonoaudiológico, desde a autenticação e triagem inicial até o prontuário eletrônico completo e armazenamento em nuvem:

1. **Autenticação (`Auth`)** — `/api/auth`
2. **Pacientes (`Patient`)** — `/api/paciente`
3. **Responsáveis Legais (`Guardian`)** — `/api/guardians`
4. **Fonoaudiólogos / Profissionais (`SpeechTherapist` / `Professional`)** — `/api/professionals`
5. **Anamnese Fonoaudiológica (`Anamnesis`)** — `/api/anamnesis`
6. **Avaliações Clínicas (`Evaluation`)** — `/api/evaluation`
7. **Diagnósticos e Plano Terapêutico (`Diagnostic`)** — `/api/diagnostic`
8. **Agenda e Agendamentos (`Appointment`)** — `/api/appointments`
9. **Sessões e Evolução Clínica (`Session`)** — `/api/session`
10. **Anexos e Laudos Cloud OCI (`Attachment`)** — `/api/attachments`

---

## 2. Catálogo Detalhado de Endpoints REST por Módulo

### 2.1 Módulo 1: Autenticação e Identidade (`AuthController` — `/api/auth`)

| Método HTTP | Rota Completa | Payload Request | Payload Response | Status Sucesso | Autorização / Roles |
| :---: | :--- | :--- | :--- | :---: | :--- |
| `POST` | `/api/auth/register` | `RegisterRequestDTO` (`@Valid`) | `TokenResponseDTO` | `201 Created` | Público (`permitAll`) |
| `POST` | `/api/auth/login` | `LoginRequestDTO` (`@Valid`) | `TokenResponseDTO` | `200 OK` | Público (`permitAll`) |

- **Regras Aplicadas:**
  - Verifica se `userRepository.existsByEmail(dto.email())` é verdadeiro; caso positivo, lança `ConflictException` (`409 Conflict`).
  - Criptografa a senha com `passwordEncoder.encode(dto.password())` (`BCrypt`) antes de salvar na tabela `usuario`.
  - Retorna imediatamente o token JWT válido por 24 horas para auto-login após o cadastro.

---

### 2.2 Módulo 2: Gestão de Pacientes (`PatientController` — `/api/paciente`)

| Método HTTP | Rota Completa | Payload Request | Payload Response | Status Sucesso | Autorização (`@PreAuthorize`) |
| :---: | :--- | :--- | :--- | :---: | :--- |
| `POST` | `/api/paciente/register` | `PatientRequestDTO` (`@Valid`) | `PatientResponseDTO` | `201 Created` | `ROLE_FONO`, `ROLE_ADMIN` |
| `GET` | `/api/paciente` | — | `List<PatientResponseDTO>` | `200 OK` | `ROLE_FONO`, `ROLE_ADMIN` |
| `GET` | `/api/paciente/{id}` | Path: `UUID id` | `PatientResponseDTO` | `200 OK` | `ROLE_FONO`, `ROLE_ADMIN` |
| `PUT` | `/api/paciente/update/{id}` | Path: `UUID id` + `PatientRequestDTO` (`@Valid`) | `PatientResponseDTO` | `200 OK` | `ROLE_FONO`, `ROLE_ADMIN` |
| `PATCH` | `/api/paciente/{id}/archive` | Path: `UUID id` | `PatientResponseDTO` | `200 OK` | `ROLE_FONO`, `ROLE_ADMIN` |
| `DELETE` | `/api/paciente/{id}/delete` | Path: `UUID id` | `Void` (Sem corpo) | `204 No Content` | Estrito: `ROLE_ADMIN` |

- **Regras Clínicas de `PatientService`:**
  1. **Obrigatoriedade de Responsável para Menores de 18 Anos (`validarResponsavelParaMenor`):** Calcula a idade exata com `Period.between(dateOfBirth, LocalDate.now()).getYears()`. Se `age < 18` e `guardian == null`, aborta a operação com `GuardianRequiredException` (`400 Bad Request`).
  2. **Unicidade de CPF na Criação e Atualização:** Na criação, valida `existsByCpfPatient(cpf)`; na atualização (`PUT`), valida `existsByCpfPatientAndIdNot(cpf, id)` para permitir que o próprio paciente mantenha seu CPF mas impeça colisão com terceiros (`CpfAlreadyExistsException` $\rightarrow$ `409 Conflict`).
  3. **Suporte a Pré-Cadastro Gamificado (`PatientStatusEnum`):** Suporta os estados `ATIVO`, `ARQUIVADO` (Soft Delete via `PATCH /{id}/archive`) e `PRE_CADASTRO`.

---

### 2.3 Módulo 3: Responsáveis Legais (`GuardianController` — `/api/guardians`)

| Método HTTP | Rota Completa | Payload Request | Payload Response | Status Sucesso | Autorização |
| :---: | :--- | :--- | :--- | :---: | :--- |
| `POST` | `/api/guardians` | `GuardianEntity` (`name`, `cpf`, `phoneNumber`, `relationship`) | `GuardianEntity` | `201 Created` | Autenticado (`JWT`) |
| `GET` | `/api/guardians` | — | `List<GuardianEntity>` | `200 OK` | Autenticado (`JWT`) |
| `GET` | `/api/guardians/{id}` | Path: `UUID id` | `GuardianEntity` | `200 OK` | Autenticado (`JWT`) |

- **Regras de `GuardianService`:**
  - Conciliação e prevenção de duplicidade de CPF via `guardianRepository.findByCpf(guardian.getCpf())`, lançando `ConflictException` (`409 Conflict`) caso já exista.

---

### 2.4 Módulo 4: Fonoaudiólogos (`ProfesisonalController` — `/api/professionals`)

| Método HTTP | Rota Completa | Payload Request | Payload Response | Status Sucesso | Autorização |
| :---: | :--- | :--- | :--- | :---: | :--- |
| `POST` | `/api/professionals/register` | `ProfessionalEntity` (`name`, `crfa`, `phone`, `specialty`) | `ProfessionalEntity` | `201 Created` | Autenticado (`@AuthenticationPrincipal`) |
| `GET` | `/api/professionals` | — | `List<ProfessionalEntity>` | `200 OK` | Autenticado (`JWT`) |

- **Regras de `ProfessionalService`:**
  - Vincula automaticamente o registro profissional (`crfa` único) ao `UserEntity` autenticado extraído do contexto JWT via `@AuthenticationPrincipal UserEntity currentUser`.

---

### 2.5 Módulo 5: Anamnese Fonoaudiológica (`AnamnesisController` — `/api/anamnesis`)

| Método HTTP | Rota Completa | Payload Request | Payload Response | Status Sucesso | Autorização |
| :---: | :--- | :--- | :--- | :---: | :--- |
| `POST` | `/api/anamnesis/register/{patientId}` | Path: `UUID patientId` + `AnamnesisEntity` | `AnamnesisEntity` | `201 Created` | Autenticado (`JWT`) |
| `GET` | `/api/anamnesis/{id}` | Path: `UUID id` | `AnamnesisEntity` | `200 OK` | Autenticado (`JWT`) |
| `GET` | `/api/anamnesis/patient/{patientId}` | Path: `UUID patientId` | `List<AnamnesisEntity>` | `200 OK` | Autenticado (`JWT`) |
| `PUT` | `/api/anamnesis/update/{id}` | Path: `UUID id` + `AnamnesisEntity` | `AnamnesisEntity` | `200 OK` | Autenticado (`JWT`) |
| `DELETE` | `/api/anamnesis/{id}/delete` | Path: `UUID id` | `Void` | `204 No Content` | Autenticado (`JWT`) |

- **Campos Clínicos Gerenciados:** Queixa principal (`mainComplaint`), histórico familiar (`familyHistory`), início dos sintomas (`symptomOnset`), desenvolvimento da linguagem (`languageDevelopment`) e observações adicionais (`additionalObservations`).

---

### 2.6 Módulo 6: Avaliações Clínicas (`EvaluationController` — `/api/evaluation`)

| Método HTTP | Rota Completa | Payload Request | Payload Response | Status Sucesso | Autorização |
| :---: | :--- | :--- | :--- | :---: | :--- |
| `POST` | `/api/evaluation/register/{patientId}` | Path: `UUID patientId` + `EvaluationEntity` | `EvaluationEntity` | `201 Created` | Autenticado (`JWT`) |
| `GET` | `/api/evaluation/{id}` | Path: `UUID id` | `EvaluationEntity` | `200 OK` | Autenticado (`JWT`) |
| `GET` | `/api/evaluation/patient/{patientId}` | Path: `UUID patientId` | `List<EvaluationEntity>` | `200 OK` | Autenticado (`JWT`) |
| `PUT` | `/api/evaluation/update/{id}` | Path: `UUID id` + `EvaluationEntity` | `EvaluationEntity` | `200 OK` | Autenticado (`JWT`) |
| `PATCH` | `/api/evaluation/{id}/conclude` | Path: `UUID id` | `EvaluationEntity` | `200 OK` | Autenticado (`JWT`) |
| `DELETE` | `/api/evaluation/{id}/delete` | Path: `UUID id` | `Void` | `204 No Content` | Autenticado (`JWT`) |

- **Regras de `EvaluationService`:**
  - Caso `dataAvaliacao` não seja informada na criação, preenche automaticamente com `LocalDate.now()`.
  - Inicializa `concluido = false` por padrão e disponibiliza o endpoint semântico `PATCH /api/evaluation/{id}/conclude` para selar a conclusão da avaliação.

---

### 2.7 Módulo 7: Diagnósticos e Conduta Terapêutica (`DiagnosticController` — `/api/diagnostic`)

| Método HTTP | Rota Completa | Payload Request | Payload Response | Status Sucesso | Autorização |
| :---: | :--- | :--- | :--- | :---: | :--- |
| `POST` | `/api/diagnostic/register/{patientId}` | Path: `UUID patientId` + `DiagnosticEntity` | `DiagnosticEntity` | `201 Created` | Autenticado (`JWT`) |
| `GET` | `/api/diagnostic/{id}` | Path: `UUID id` | `DiagnosticEntity` | `200 OK` | Autenticado (`JWT`) |
| `GET` | `/api/diagnostic/patient/{patientId}` | Path: `UUID patientId` | `List<DiagnosticEntity>` | `200 OK` | Autenticado (`JWT`) |
| `PUT` | `/api/diagnostic/update/{id}` | Path: `UUID id` + `DiagnosticEntity` | `DiagnosticEntity` | `200 OK` | Autenticado (`JWT`) |
| `DELETE` | `/api/diagnostic/{id}/delete` | Path: `UUID id` | `Void` | `204 No Content` | Autenticado (`JWT`) |

- **Campos Clínicos Gerenciados:** Parecer fonoaudiológico (`speechDiagnosis`), código `cid10`, área terapêutica (`therapeuticArea`), frequência recomendada de sessões (`sessionFrequency`), objetivo do tratamento (`treatmentGoal`) e conduta terapêutica (`treatmentPlan`).

---

### 2.8 Módulo 8: Agenda e Agendamentos (`AppointmentController` — `/api/appointments`)

| Método HTTP | Rota Completa | Payload Request | Payload Response | Status Sucesso | Autorização |
| :---: | :--- | :--- | :--- | :---: | :--- |
| `GET` | `/api/appointments` | — | `List<AppointmentEntity>` | `200 OK` | Autenticado (`JWT`) |
| `POST` | `/api/appointments` | `AppointmentEntity` (`appointmentDate`, `appointmentTime`, `durationMinutes`, `status`) | `AppointmentEntity` | `201 Created` | Autenticado (`JWT`) |
| `GET` | `/api/appointments/{id}` | Path: `UUID id` | `AppointmentEntity` | `200 OK` | Autenticado (`JWT`) |
| `PATCH` | `/api/appointments/{id}/status` | Path: `UUID id` + `{ "status": "StatusSessao" }` | `AppointmentEntity` | `200 OK` | Autenticado (`JWT`) |

- **Máquina de Estados (`StatusSessao`):**
  - `AGENDADO` $\rightarrow$ `REALIZADA` | `FALTA_JUSTIFICADA` | `FALTA_SEM_AVISO`.

---

### 2.9 Módulo 9: Sessões e Evolução Clínica (`SessionController` — `/api/session`)

| Método HTTP | Rota Completa | Payload Request | Payload Response | Status Sucesso | Autorização |
| :---: | :--- | :--- | :--- | :---: | :--- |
| `POST` | `/api/session/register/{appointmentId}` | Path: `UUID appointmentId` + `SessionEntity` | `SessionEntity` | `201 Created` | Autenticado (`JWT`) |
| `POST` | `/api/session/register/patient/{patientId}` | Path: `UUID patientId` + `SessionEntity` | `SessionEntity` | `201 Created` | Autenticado (`JWT`) |
| `GET` | `/api/session/patient/{patientId}` | Path: `UUID patientId` | `List<SessionEntity>` | `200 OK` | Autenticado (`JWT`) |
| `GET` | `/api/session/{id}` | Path: `UUID id` | `SessionEntity` | `200 OK` | Autenticado (`JWT`) |
| `GET` | `/api/session/appointment/{appointmentId}` | Path: `UUID appointmentId` | `SessionEntity` | `200 OK` | Autenticado (`JWT`) |
| `PUT` | `/api/session/update/{id}` | Path: `UUID id` + `SessionEntity` | `SessionEntity` | `200 OK` | Autenticado (`JWT`) |
| `DELETE` | `/api/session/{id}/delete` | Path: `UUID id` | `Void` | `204 No Content` | Autenticado (`JWT`) |

- **Regras Transacionais (`@Transactional`) de `SessionService`:**
  1. **Bloqueio de Sessão em Agendamento com Falta (`422 Unprocessable Entity`):** Se o agendamento estiver com status `FALTA_JUSTIFICADA` ou `FALTA_SEM_AVISO`, lança `BusinessRuleException`.
  2. **Relação 1:1 Estrita entre Agendamento e Sessão (`409 Conflict`):** Verifica `sessionRepository.existsByAgendamentoId(appointmentId)`; caso já exista sessão para aquele agendamento, lança `ConflictException`.
  3. **Sincronização Automática Agenda $\leftrightarrow$ Prontuário:**
     - Ao registrar uma sessão a partir de um agendamento (`register`), atualiza automaticamente o agendamento para `StatusSessao.REALIZADA`.
     - Ao registrar uma sessão diretamente pelo prontuário do paciente (`registerForPatient`), cria automaticamente um `AppointmentEntity` com duração padrão de `50 minutos` (`DURACAO_PADRAO_MINUTOS = 50`) e status `REALIZADA`, além de calcular o número sequencial da sessão (`numeroSessao`).
     - Ao excluir uma sessão (`delete`), reverte transacionalmente o status do agendamento vinculado para `StatusSessao.AGENDADO`.

---

### 2.10 Módulo 10: Anexos e Laudos em Nuvem (`AttachmentController` — `/api/attachments`)

| Método HTTP | Rota Completa | Payload Request | Payload Response | Status Sucesso | Autorização |
| :---: | :--- | :--- | :--- | :---: | :--- |
| `POST` | `/api/attachments/upload` | `multipart/form-data` (`patientId`, `file`, `description`) | `AttachmentEntity` | `201 Created` | Autenticado (`JWT`) |
| `GET` | `/api/attachments/patient/{patientId}` | Path: `UUID patientId` | `List<AttachmentEntity>` | `200 OK` | Autenticado (`JWT`) |
| `GET` | `/api/attachments/{id}/download` | Path: `UUID id` | `byte[]` (`Content-Disposition: inline`) | `200 OK` | Autenticado (`JWT`) |

---

## 3. Governança de Erros e `GlobalExceptionHandler`

Todas as exceções da API são interceptadas pelo `GlobalExceptionHandler` (`@RestControllerAdvice(basePackages = "br.com.fonosync.fonosyncapi")`) e pelo `RestAuthenticationEntryPoint`, retornando o contrato JSON padronizado `StandardError`:

```json
{
  "timestamp": "2026-11-27T14:30:00.123456",
  "status": 422,
  "error": "Regra de Negócio Violada",
  "message": "Não é possível registrar sessão para um agendamento com falta: 8f9d2a1b-...",
  "path": "/api/session/register/8f9d2a1b-...",
  "fieldErrors": null
}
```

### 3.1 Matriz Completa de Exceções Mapeadas (`400` a `502`)

| Código HTTP | Exceção Java Capturada | Título (`error`) no `StandardError` | Cenário Clínico / Técnico que Dispara |
| :---: | :--- | :--- | :--- |
| **`400 Bad Request`** | `GuardianRequiredException` | `"Responsável Obrigatório"` | Tentativa de cadastrar ou atualizar paciente menor de 18 anos (`age < 18`) sem `guardianId`. |
| **`400 Bad Request`** | `MethodArgumentNotValidException` | `"Erro de Validação de Dados"` | Falha nas anotações `@Valid` (`@NotBlank`, `@Email`, `@Size`, `@PastOrPresent`), populando a lista `fieldErrors`. |
| **`400 Bad Request`** | `HttpMessageNotReadableException` | `"Corpo da Requisição Inválido"` | JSON malformado, data inválida ou valor de Enum inexistente (ex: `sex: "OUTRO"`). |
| **`400 Bad Request`** | `MethodArgumentTypeMismatchException` | `"Parâmetro Inválido"` | UUID malformado na URL (ex: `/api/paciente/123-invalido`). |
| **`400 Bad Request`** | `MissingServletRequestParameterException` | `"Parâmetro Obrigatório Ausente"` | Ausência de parâmetro obrigatório como `patientId` ou `file` no upload multipart. |
| **`400 Bad Request`** | `IllegalArgumentException` | `"Regra de Negócio Violada"` | Argumentos ilegais repassados a métodos internos de domínio. |
| **`401 Unauthorized`** | `BadCredentialsException` | `"Credenciais Inválidas"` | E-mail inexistente ou senha que não confere no hash BCrypt durante `POST /api/auth/login`. |
| **`401 Unauthorized`** | `AuthenticationException` (`RestAuthenticationEntryPoint`) | `"Não Autorizado"` | Requisição a rota protegida sem header `Authorization: Bearer <token>`, ou com token JWT expirado/adulterado. |
| **`403 Forbidden`** | `AccessDeniedException` | `"Acesso Negado"` | Usuário autenticado sem a role exigida no `@PreAuthorize` (ex: `ROLE_FONO` tentando `DELETE /api/paciente/{id}/delete` exclusivo de `ROLE_ADMIN`). |
| **`404 Not Found`** | `PatientNotFoundException` | `"Paciente Não Encontrado"` | Busca, atualização, arquivamento ou upload de anexo para `patientId` inexistente. |
| **`404 Not Found`** | `ResourceNotFoundException` / `EntityNotFoundException` | `"Recurso Não Encontrado"` | Busca por ID inexistente de Responsável, Anamnese, Avaliação, Diagnóstico, Agendamento, Sessão ou Anexo. |
| **`404 Not Found`** | `NoResourceFoundException` | `"Rota Não Encontrada"` | Chamada a um endpoint HTTP inexistente na API. |
| **`405 Method Not Allowed`** | `HttpRequestMethodNotSupportedException` | `"Método Não Suportado"` | Uso de verbo HTTP incorreto para a rota (ex: `POST` em rota que só aceita `GET`). |
| **`409 Conflict`** | `CpfAlreadyExistsException` | `"CPF Já Cadastrado"` | Cadastro ou atualização de paciente com CPF já pertencente a outro paciente no banco. |
| **`409 Conflict`** | `ConflictException` | `"Conflito de Dados"` | E-mail já cadastrado no `/api/auth/register`, CPF de responsável duplicado, ou tentativa de criar uma 2ª sessão para o mesmo agendamento. |
| **`409 Conflict`** | `DataIntegrityViolationException` | `"Conflito de Integridade de Dados"` | Violação de constraint `UNIQUE` ou `FOREIGN KEY` diretamente no PostgreSQL (ex: `ON DELETE RESTRICT` de agendamento com sessão). |
| **`413 Payload Too Large`** | `MaxUploadSizeExceededException` | `"Arquivo Muito Grande"` | Upload de anexo clínico (áudio/PDF/imagem) que ultrapassa o limite máximo configurado no servidor. |
| **`422 Unprocessable Entity`** | `BusinessRuleException` | `"Regra de Negócio Violada"` | Violação semântica de fluxo clínico: tentar registrar evolução de sessão para um agendamento marcado como `FALTA_JUSTIFICADA` ou `FALTA_SEM_AVISO`. |
| **`502 Bad Gateway`** | `StorageException` | `"Falha no Armazenamento de Arquivos"` | Erro de comunicação, timeout ou falha de credencial no SDK da **Oracle Cloud Infrastructure (OCI Object Storage)**. |
| **`500 Internal Server Error`** | `Exception` (Fallback Geral) | `"Erro Interno do Servidor"` | Qualquer erro inesperado não mapeado; registra o *stack trace* completo no log do servidor (`log.error`) e oculta detalhes internos do cliente por segurança. |
