---
title: "03 · Relatório de Auditoria de QA (Claude Code) & Correções de Hardening"
tags:
  - fonosync
  - qa
  - seguranca
  - auditoria
  - backend
  - rbac
  - lgpd
created: 2026-11-27
updated: 2026-11-27
status: resolved
---

# 🛡️ Relatório de Auditoria de QA & Hardening de Segurança (`fonosync-api`)

> [!IMPORTANT] Sinergia Multiagente (Claude Code + Antigravity Coordenador + `backend-specialist`)
> Este documento registra os achados da auditoria de caixa-preta e caixa-branca executada em cluster PostgreSQL 18 isolado (`fonosync_qa` e `fonosync_orm`) pelo **Claude Code**, bem como as **correções definitivas** implementadas pelo time de agentes na `fonosync-api`.
> Relacionado a: [[00-FonoSync-Second-Brain-MOC]] · [[02-Catalogo-CRUD-Endpoints-e-Regras-de-Negocio]] · [[01-Cloud-Neon-OCI-Vercel-Seguranca-e-LGPD]] · [[01-Plano-de-QA-Auditoria-Impeccable-e-Testes]]

---

## 🚨 1. Vulnerabilidades Críticas (C1–C3) — 100% Corrigidas

| ID | Problema Detectado na Auditoria | Causa Raiz | Correção Implementada | Status |
| :--- | :--- | :--- | :--- | :--- |
| **C1** | **Autorregistro como `ROLE_ADMIN`** (`A09`: `POST /api/auth/register` aceitava `{"role":"ROLE_ADMIN"}` e devolvia token capaz de apagar pacientes). | `AuthController.register` copiava `dto.role()` diretamente sem filtrar perfis privilegiados. | `AuthController.register` agora lança `AccessDeniedException` (`403 Forbidden`) se `dto.role() == PerfilEnum.ROLE_ADMIN`. | ✅ Resolvido |
| **C2** | **Mass Assignment em `POST /api/guardians` + Vazamento de Hash BCrypt** (`E1–E3`: envio de `usuario:{email, password, role:"ROLE_ADMIN"}` criava um ADMIN no banco via `CascadeType.ALL` e retornava o hash `"$2a$10$..."`). | `GuardianEntity` expunha `@OneToOne(cascade = CascadeType.ALL) private UserEntity usuario` e `UserEntity.password` não tinha restrição de serialização. | 1. Removido `CascadeType.ALL` de `GuardianEntity.usuario` e adicionado `@JsonProperty(access = READ_ONLY)`.<br>2. `GuardianService.save` força `setUsuario(null)` e `setId(null)`.<br>3. `UserEntity.password` anotado com `@JsonProperty(access = WRITE_ONLY)`. | ✅ Resolvido |
| **C3** | **Autorização RBAC ausente fora de `/api/paciente`** (`SE13`, `AP05`, `Z04/Z05`: um token `ROLE_PACIENTE` conseguia ler sessões de terceiros, criar agendamentos e listar responsáveis). | Apenas `PatientController` possuía `@PreAuthorize("hasAnyRole('FONO', 'ADMIN')")`. | Adicionado `@PreAuthorize("hasAnyRole('FONO', 'ADMIN')")` em `GuardianController`, `ProfesisonalController`, `AppointmentController`, `SessionController`, `AnamnesisController`, `DiagnosticController`, `EvaluationController` e `AttachmentController`. | ✅ Resolvido |

---

## ⚠️ 2. Problemas de Severidade Alta (A1–A4, A11) — 100% Corrigidos

| ID | Problema Detectado | Causa Raiz | Correção Implementada | Status |
| :--- | :--- | :--- | :--- | :--- |
| **A1** | **`POST /api/professionals/register` sempre retornava `500`** (`InvalidDataAccessApiUsageException: Detached entity passed to persist: UserEntity`). | `ProfessionalEntity.usuario` usava `CascadeType.ALL` sobre o `UserEntity` vindo do `@AuthenticationPrincipal` (detached). | Removido `CascadeType.ALL` de `ProfessionalEntity.usuario`. `ProfessionalService` agora é `@Transactional`, recarrega o `UserEntity` gerenciado via `userRepository.findById()` e valida duplicidade de `crfa` e `usuario` (`409 Conflict`). | ✅ Resolvido |
| **A2 / A3** | **Divergência entre `bb.sql`, Entidades JPA e `ddl-auto: update`** (tamanhos de `VARCHAR`, colunas `NOT NULL` falhando em `POST`/`PUT` parcial e `cid_10` com `VARCHAR(4)`). | Entidades não declaravam `columnDefinition = "TEXT"` ou `length` explícito, e `bb.sql` exigia `NOT NULL` em campos secundários. | Entidades (`Anamnesis`, `Diagnostic`, `Evaluation`) e `bb.sql` alinhados com `TEXT` e tamanhos consistentes; Services aplicam default `""` para campos secundários nulos. | ✅ Resolvido |
| **A4** | **Agendamento sem vínculo com paciente/profissional** (`SE01`: sessão criada por `/register/{appointmentId}` ficava com `paciente_id = NULL`). | `AppointmentEntity` não possuía os campos `patient` e `professional`. | Adicionados `@ManyToOne` para `patient` (`paciente_id`) e `professional` (`fonoaudiologo_id`) em `AppointmentEntity`. `SessionService` propaga automaticamente o paciente entre agendamento e sessão. | ✅ Resolvido |
| **A11** | **Senha > 72 bytes no BCrypt** retornava erro interno genérico. | Falta de limite máximo no DTO de registro. | Adicionado `@Size(min = 6, max = 72)` em `RegisterRequestDTO.password`. | ✅ Resolvido |

---

## 🔧 3. Problemas de Severidade Média e Baixa (M1–M10, Z06/Z07, AT04) — 100% Corrigidos

- **M1 (Bean Validation ausente nos módulos clínicos):** Adicionados `@Valid`, `@NotBlank`, `@NotNull`, `@Positive` e `@Size` em `GuardianEntity`, `ProfessionalEntity`, `AppointmentEntity`, `SessionEntity`, `AnamnesisEntity`, `DiagnosticEntity` e `EvaluationEntity`.
- **M2 (`DataIntegrityViolationException` retornando `409` para string longa ou campo nulo):** `GlobalExceptionHandler` agora inspeciona a mensagem do driver PostgreSQL e retorna `400 Bad Request` (`"Tamanho de Campo Excedido"` ou `"Campo Obrigatório Ausente"`), reservando `409 Conflict` para duplicidade e integridade referencial.
- **M3 (`HttpMediaTypeNotSupportedException` retornando `500`):** Adicionado `@ExceptionHandler(HttpMediaTypeNotSupportedException.class)` retornando `415 Unsupported Media Type` no padrão `StandardError`.
- **M4 (E-mail Case-Sensitive permitindo `FONO@` e `fono@`):** `UserEntity` e `AuthController` convertem e-mails para `trim().toLowerCase()` e consultam `findByEmailIgnoreCase` / `existsByEmailIgnoreCase`.
- **M5 (CPF vazio `""` gerando `409` no segundo paciente e aceitando `"abc"`):** `PatientService` e `GuardianService` convertem CPF vazio/branco para `null`, removem pontuação e validam estritamente 11 dígitos numéricos (`\\d{11}`), lançando `400 Bad Request` caso inválido.
- **M6 (Condição de corrida em `numero_sessao`):** `SessionRepository` agora utiliza query JPQL `SELECT COALESCE(MAX(s.numeroSessao), 0) FROM SessionEntity s WHERE s.paciente.id = :patientId` dentro da transação.
- **M7 (`PUT` parcial apagando campos):** `AnamnesisService`, `DiagnosticService` e `EvaluationService` agora preservam o valor anterior caso um campo opcional não seja enviado (`null`) na atualização.
- **M9 (Exclusão física de paciente dependendo do schema):** `PatientEntity` mapeia `anamneses`, `evaluations`, `diagnostics`, `sessions`, `appointments` e `attachments` com `cascade = CascadeType.ALL, orphanRemoval = true`, e `bb.sql` foi padronizado com `ON DELETE CASCADE`.
- **M10 (Expiração JWT com offset fixo `-03:00`):** `TokenService` agora usa `Instant.now().plus(Duration.ofHours(24))` em UTC.
- **Z06 / Z07 (`404` e `405` de rota inexistente fora do `StandardError`):** Removido `basePackages` restritivo de `@RestControllerAdvice` no `GlobalExceptionHandler`.
- **AT04 (`GET /api/attachments/patient/{inexistente}` retornando `200 []`):** `AttachmentService.findByPatient` agora verifica `patientRepository.existsById(patientId)` e lança `PatientNotFoundException` (`404 Not Found`), além de sanitizar o `Content-Disposition` no download.
