import { useEffect, useState } from 'react';
import { ChevronRight, Filter, FolderArchive, Pencil, Save, Search, ShieldCheck, UserPlus, X } from 'lucide-react';
import Notice from '../../components/Notice';
import { buttonClass } from '../../components/buttonStyles';
import Avatar, { SeloStatus } from '../../components/area/Avatar';
import Modal from '../../components/area/Modal';
import { campo, rotulo } from '../../components/area/campos';
import { createGuardian, createPatient, listPatients, updatePatient } from '../../services/patientService';
import { formatCPF } from '../../utils/formatters';

const STATUS = {
  ATIVO: { label: 'Em acompanhamento', type: 'acompanhamento' },
  PRE_CADASTRO: { label: 'Pré-cadastro', type: 'pre-cadastro' },
  ARQUIVADO: { label: 'Arquivado', type: 'arquivado' },
};

const emptyForm = {
  name: '',
  dateOfBirth: '',
  phone: '',
  cpf: '',
  sex: '',
  cid10: '',
  guardianName: '',
  guardianCpf: '',
  guardianPhone: '',
  guardianRelationship: '',
};

function ageFrom(dateOfBirth) {
  if (!dateOfBirth) return null;
  const birth = new Date(`${dateOfBirth}T00:00:00`);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const beforeBirthday =
    today.getMonth() < birth.getMonth() || (today.getMonth() === birth.getMonth() && today.getDate() < birth.getDate());
  return beforeBirthday ? age - 1 : age;
}

function toRow(patient) {
  const status = STATUS[patient.patientStatus] ?? STATUS.ATIVO;
  return {
    ...patient,
    age: ageFrom(patient.dateOfBirth),
    phone: patient.contactPatient,
    status: status.label,
    statusType: status.type,
    archived: patient.patientStatus === 'ARQUIVADO',
  };
}

export default function Patients({ onOpenProntuario }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('todos'); // 'todos', 'acompanhamento', 'pre-cadastro', 'arquivados'

  const [showNewPatientModal, setShowNewPatientModal] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [editingPatient, setEditingPatient] = useState(null);
  const [notice, setNotice] = useState(null);

  const [filterAgeGroup, setFilterAgeGroup] = useState('todos');

  const [form, setForm] = useState(emptyForm);
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);

  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  useEffect(() => {
    listPatients()
      .then((list) => setPatients(list.map(toRow)))
      .catch((error) => setLoadError(error.message))
      .finally(() => setLoading(false));
  }, []);

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value });
  const formAge = ageFrom(form.dateOfBirth);
  const needsGuardian = formAge !== null && formAge < 18 && !editingPatient?.guardianId;

  const showNotice = (tone, text) => {
    setNotice({ tone, text });
    if (tone === 'success') setTimeout(() => setNotice(null), 4000);
  };

  const filteredPatients = patients.filter((patient) => {
    const term = searchTerm.toLowerCase();
    const matchesSearch = patient.name.toLowerCase().includes(term) || (patient.phone ?? '').includes(term);

    if (activeTab === 'arquivados') {
      return matchesSearch && patient.archived;
    }

    if (patient.archived) return false;

    if (activeTab === 'acompanhamento' && patient.statusType !== 'acompanhamento') return false;
    if (activeTab === 'pre-cadastro' && patient.statusType !== 'pre-cadastro') return false;

    if (filterAgeGroup === 'crianca' && (patient.age === null || patient.age >= 8)) return false;
    if (filterAgeGroup === 'pre-adolescente' && (patient.age === null || patient.age < 8 || patient.age > 12)) return false;

    return matchesSearch;
  });

  const handleOpenRecord = (patient) => onOpenProntuario(patient);

  const replacePatient = (updated) => {
    const row = toRow(updated);
    setPatients((current) => current.map((p) => (p.id === row.id ? row : p)));
    return row;
  };

  const openNewPatient = () => {
    setEditingPatient(null);
    setForm(emptyForm);
    setShowNewPatientModal(true);
  };

  const openEditPatient = (patient) => {
    setEditingPatient(patient);
    setForm({
      ...emptyForm,
      name: patient.name,
      dateOfBirth: patient.dateOfBirth ?? '',
      phone: patient.contactPatient ?? '',
      cpf: patient.cpfPatient ?? '',
      sex: patient.sex ?? '',
      cid10: patient.cid10 ?? '',
    });
    setShowNewPatientModal(true);
  };

  const closeNewPatient = () => {
    setShowNewPatientModal(false);
    setEditingPatient(null);
    setForm(emptyForm);
    setFormError('');
  };

  const handleSavePatient = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;

    setSaving(true);
    setFormError('');
    try {
      let guardianId = editingPatient?.guardianId ?? null;
      if (needsGuardian) {
        const guardian = await createGuardian({
          name: form.guardianName,
          cpf: form.guardianCpf,
          phoneNumber: form.guardianPhone,
          relationship: form.guardianRelationship,
        });
        guardianId = guardian.id;
      }

      const isMinorPatient = formAge !== null && formAge < 18;
      const data = {
        name: form.name.trim(),
        dateOfBirth: form.dateOfBirth || null,
        cpfPatient: isMinorPatient ? null : (form.cpf ? form.cpf.trim() : null),
        contactPatient: form.phone || null,
        sex: form.sex ? form.sex.toUpperCase() : null,
        cid10: form.cid10 ? form.cid10.trim() : null,
        guardianId,
      };

      if (editingPatient) {
        const payload = {
          ...data,
          patientStatus: editingPatient.patientStatus || 'ATIVO',
        };
        const updated = await updatePatient(editingPatient.id, payload);
        replacePatient(updated);
        showNotice('success', 'Dados do paciente atualizados com sucesso!');
      } else {
        const created = await createPatient(data);
        setPatients([toRow(created), ...patients]);
        showNotice('success', 'Paciente cadastrado com sucesso! Prontuário gerado.');
      }
      closeNewPatient();
    } catch (error) {
      setFormError(error.message);
    } finally {
      setSaving(false);
    }
  };

  const archivedPatientsCount = patients.filter(p => p.archived).length;
  const contagem = {
    todos: patients.filter((p) => !p.archived).length,
    acompanhamento: patients.filter((p) => !p.archived && p.statusType === 'acompanhamento').length,
    'pre-cadastro': patients.filter((p) => !p.archived && p.statusType === 'pre-cadastro').length,
  };
  const abas = [
    { id: 'todos', rotulo: 'Todos ativos' },
    { id: 'acompanhamento', rotulo: 'Em acompanhamento', ponto: 'bg-success' },
    { id: 'pre-cadastro', rotulo: 'Pré-cadastro', ponto: 'bg-warning' },
  ];
  const rotuloFaixa = { crianca: 'Até 7 anos', 'pre-adolescente': '8 a 12 anos' }[filterAgeGroup];

  return (
    <div className="space-y-5 font-sans">
      <div role="status">
        {notice && (
          <div className="auth-troca">
            <Notice tone={notice.tone} title={notice.text} />
          </div>
        )}
      </div>

      {/* Busca e ações */}
      <div className="surge flex flex-col gap-3 md:flex-row md:items-center" style={{ '--i': 1 }}>
        <label className="group/busca relative flex-1">
          <span className="sr-only">Buscar por nome ou telefone</span>
          <Search
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted transition group-focus-within/busca:text-azul"
            size={19}
            aria-hidden="true"
          />
          <input
            type="search"
            placeholder="Buscar por nome ou telefone"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`${campo} min-h-[52px] pl-12 text-[15.5px]`}
          />
        </label>
        <div className="flex shrink-0 gap-2">
          <button type="button" onClick={() => setShowFilterModal(true)} className={buttonClass('suave')}>
            <Filter size={16} aria-hidden="true" /> Filtros
            {filterAgeGroup !== 'todos' && <span className="size-2 rounded-full bg-coral-ink" aria-label="(filtro ativo)" />}
          </button>
          <button type="button" onClick={openNewPatient} className={buttonClass('azul')}>
            <UserPlus size={16} aria-hidden="true" /> Novo cadastro
          </button>
        </div>
      </div>

      {/* Situação do acompanhamento */}
      <div className="surge flex flex-wrap items-center justify-between gap-3" style={{ '--i': 2 }}>
        <div role="group" aria-label="Filtrar por situação" className="flex flex-wrap gap-2">
          {abas.map(({ id, rotulo, ponto }) => {
            const ativo = activeTab === id;
            return (
              <button
                key={id}
                type="button"
                aria-pressed={ativo}
                onClick={() => setActiveTab(id)}
                className={`inline-flex min-h-10 cursor-pointer items-center gap-2 rounded-full border-[1.5px] px-3.5 text-[13.5px] font-semibold transition active:scale-95 ${
                  ativo ? 'border-azul-petroleo bg-azul-petroleo text-on-azul' : 'border-line bg-surface text-ink hover:border-azul/40 hover:bg-gelo'
                }`}
              >
                {ponto && <span className={`size-2 rounded-full ${ponto}`} aria-hidden="true" />}
                {rotulo}
                <span className={`rounded-full px-1.5 text-[12px] ${ativo ? 'bg-white/20' : 'bg-gelo text-muted'}`}>
                  {loading ? '–' : contagem[id]}
                </span>
              </button>
            );
          })}
          {rotuloFaixa && (
            <button
              type="button"
              onClick={() => setFilterAgeGroup('todos')}
              className="inline-flex min-h-10 cursor-pointer items-center gap-1.5 rounded-full bg-coral/50 px-3.5 text-[13.5px] font-semibold text-on-pastel transition hover:bg-coral"
            >
              {rotuloFaixa}
              <X size={14} aria-hidden="true" />
              <span className="sr-only">Remover filtro de idade</span>
            </button>
          )}
        </div>

        <button
          type="button"
          aria-pressed={activeTab === 'arquivados'}
          onClick={() => setActiveTab(activeTab === 'arquivados' ? 'todos' : 'arquivados')}
          className={`inline-flex min-h-10 cursor-pointer items-center gap-2 rounded-full border-[1.5px] px-3.5 text-[13.5px] font-semibold transition ${
            activeTab === 'arquivados'
              ? 'border-ink bg-ink text-surface'
              : 'border-dashed border-line text-muted hover:border-ink/40 hover:text-ink'
          }`}
        >
          <FolderArchive size={15} aria-hidden="true" /> Arquivados ({archivedPatientsCount})
        </button>
      </div>

      <div className="surge overflow-hidden rounded-[24px] rounded-bl-[7px] bg-surface ring-1 ring-line" style={{ '--i': 3 }}>
        {/* Celular: lista em cartões */}
        <ul className="divide-y divide-line md:hidden">
          {loading ? (
            [0, 1, 2].map((i) => (
              <li key={i} className="flex items-center gap-3 p-4">
                <span className="esqueleto size-11 rounded-full" />
                <span className="flex-1 space-y-2">
                  <span className="esqueleto block h-3.5 w-2/3 rounded" />
                  <span className="esqueleto block h-3 w-1/3 rounded" />
                </span>
              </li>
            ))
          ) : filteredPatients.length > 0 ? (
            filteredPatients.map((patient) => (
              <li key={patient.id} className="space-y-3 p-4">
                <div className="flex items-center gap-3">
                  <Avatar nome={patient.name} apagado={patient.archived} className="size-11 text-[15px]" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[15px] font-bold text-ink">{patient.name}</p>
                    <p className="text-[13px] text-muted">
                      {patient.age !== null ? `${patient.age} anos` : 'Idade não informada'}
                      {patient.cid10 && ` · CID ${patient.cid10}`}
                    </p>
                  </div>
                  <SeloStatus status={patient.patientStatus} />
                </div>
                <div className="flex items-center justify-end gap-2">
                  <button type="button" onClick={() => openEditPatient(patient)} className={`${buttonClass('suave')} min-h-10 px-3.5 text-[13.5px]`}>
                    <Pencil size={14} aria-hidden="true" /> Editar
                  </button>
                  <button type="button" onClick={() => handleOpenRecord(patient)} className={`${buttonClass('azul')} min-h-10 px-3.5 text-[13.5px]`}>
                    {patient.archived ? 'Ver prontuário' : 'Abrir prontuário'} <ChevronRight size={15} aria-hidden="true" />
                  </button>
                </div>
              </li>
            ))
          ) : (
            <li className={`p-8 text-center text-[14px] ${loadError ? 'font-bold text-danger' : 'text-muted'}`}>
              {loadError || 'Nenhum paciente encontrado nesta categoria.'}
            </li>
          )}
        </ul>

        {/* Desktop: tabela */}
        <div className="hidden overflow-x-auto md:block">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-line text-[12.5px] font-semibold text-muted">
                <th className="px-6 py-3.5 font-semibold">Paciente</th>
                <th className="px-4 py-3.5 font-semibold">Idade</th>
                <th className="px-4 py-3.5 font-semibold">CID-10</th>
                <th className="px-4 py-3.5 font-semibold">Situação</th>
                <th className="px-6 py-3.5 text-right font-semibold">
                  <span className="sr-only">Ações</span>
                </th>
              </tr>
            </thead>
            <tbody className="text-[14.5px] text-ink">
              {loading ? (
                [0, 1, 2, 3].map((i) => (
                  <tr key={i} className="border-b border-line last:border-0">
                    <td className="px-6 py-4" colSpan={5}>
                      <span className="flex items-center gap-3">
                        <span className="esqueleto size-10 rounded-full" />
                        <span className="esqueleto block h-3.5 w-48 rounded" />
                      </span>
                    </td>
                  </tr>
                ))
              ) : filteredPatients.length > 0 ? (
                filteredPatients.map((patient) => (
                  <tr
                    key={patient.id}
                    onClick={() => handleOpenRecord(patient)}
                    className={`group cursor-pointer border-b border-line transition-colors last:border-0 hover:bg-gelo/60 ${
                      patient.archived ? 'text-muted' : ''
                    }`}
                  >
                    <td className="px-6 py-3.5">
                      <span className="flex items-center gap-3">
                        <Avatar nome={patient.name} apagado={patient.archived} />
                        <span className="min-w-0">
                          <span className="block font-bold transition-colors group-hover:text-azul">{patient.name}</span>
                          {patient.phone && <span className="block text-[13px] text-muted">{patient.phone}</span>}
                        </span>
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-muted">{patient.age !== null && `${patient.age} anos`}</td>
                    <td className="px-4 py-3.5">
                      {patient.cid10 ? (
                        <span className="rounded-[8px] bg-gelo px-2 py-1 font-mono text-[12.5px] font-semibold text-azul-petroleo">
                          {patient.cid10}
                        </span>
                      ) : (
                        <span className="text-muted">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3.5">
                      <SeloStatus status={patient.patientStatus} />
                    </td>
                    <td className="px-6 py-3.5 text-right">
                      <span className="inline-flex items-center gap-1">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            openEditPatient(patient);
                          }}
                          className="inline-flex min-h-9 cursor-pointer items-center gap-1.5 rounded-[10px] px-3 text-[13.5px] font-semibold text-muted transition hover:bg-surface hover:text-azul"
                        >
                          <Pencil size={14} aria-hidden="true" /> Editar
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenRecord(patient);
                          }}
                          className="inline-flex min-h-9 cursor-pointer items-center gap-1 rounded-[10px] rounded-bl-[3px] bg-gelo px-3 text-[13.5px] font-bold text-azul-petroleo transition group-hover:bg-azul-petroleo group-hover:text-on-azul"
                        >
                          {patient.archived ? 'Restaurar / Ver' : 'Abrir prontuário'}
                          <ChevronRight size={15} aria-hidden="true" className="transition-transform group-hover:translate-x-0.5" />
                        </button>
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className={`px-6 py-10 text-center ${loadError ? 'font-bold text-danger' : 'text-muted'}`}>
                    {loadError || 'Nenhum paciente encontrado nesta categoria.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showFilterModal && (
        <Modal titulo="Filtrar pacientes" onFechar={() => setShowFilterModal(false)} largura="max-w-sm">
          <div>
            <label htmlFor="filtro-faixa" className={rotulo}>
              Faixa etária
            </label>
            <select id="filtro-faixa" value={filterAgeGroup} onChange={(e) => setFilterAgeGroup(e.target.value)} className={campo}>
              <option value="todos">Todas as idades</option>
              <option value="crianca">Até 7 anos (Crianças)</option>
              <option value="pre-adolescente">8 a 12 anos</option>
            </select>
          </div>
          <div className="flex gap-2 border-t border-line pt-4">
            <button
              type="button"
              onClick={() => {
                setFilterAgeGroup('todos');
                setShowFilterModal(false);
              }}
              className={`${buttonClass('suave')} flex-1`}
            >
              Limpar filtros
            </button>
            <button type="button" onClick={() => setShowFilterModal(false)} className={`${buttonClass('azul')} flex-1`}>
              Aplicar filtro
            </button>
          </div>
        </Modal>
      )}

      {showNewPatientModal && (
        <Modal titulo={editingPatient ? 'Editar paciente' : 'Cadastrar novo paciente'} onFechar={closeNewPatient}>
          <form onSubmit={handleSavePatient} className="space-y-4">
            <div>
              <label htmlFor="pac-nome" className={rotulo}>
                Nome completo do paciente *
              </label>
              <input
                id="pac-nome"
                type="text"
                required
                placeholder="Ex: Carlos Eduardo Lima"
                value={form.name}
                onChange={update('name')}
                className={campo}
              />
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label htmlFor="pac-nasc" className={rotulo}>
                  Data de nascimento *
                </label>
                <input id="pac-nasc" type="date" required value={form.dateOfBirth} onChange={update('dateOfBirth')} className={campo} />
              </div>
              <div>
                <label htmlFor="pac-tel" className={rotulo}>
                  Telefone / contato
                </label>
                <input
                  id="pac-tel"
                  type="text"
                  placeholder="(11) 99999-9999"
                  value={form.phone}
                  onChange={update('phone')}
                  className={campo}
                />
              </div>
              {formAge !== null && formAge < 18 ? (
                <p className="flex items-start gap-2 rounded-[12px] rounded-bl-[3px] bg-salvia/70 p-3 text-[13px] leading-snug text-on-pastel sm:col-span-2">
                  <ShieldCheck size={16} aria-hidden="true" className="mt-0.5 shrink-0 text-success" />
                  <span>
                    <strong>Proteção de menores (LGPD):</strong> por segurança e privacidade da criança, não solicitamos CPF
                    do menor de idade. Apenas o responsável legal possui CPF registrado.
                  </span>
                </p>
              ) : (
                <div>
                  <label htmlFor="pac-cpf" className={rotulo}>
                    CPF do paciente adulto
                  </label>
                  <input
                    id="pac-cpf"
                    type="text"
                    placeholder="000.000.000-00"
                    value={form.cpf}
                    onChange={(e) => setForm({ ...form, cpf: formatCPF(e.target.value) })}
                    className={campo}
                  />
                </div>
              )}
              <div>
                <label htmlFor="pac-sexo" className={rotulo}>
                  Sexo
                </label>
                <select id="pac-sexo" value={form.sex} onChange={update('sex')} className={campo}>
                  <option value="">Não informado</option>
                  <option value="FEMININO">Feminino</option>
                  <option value="MASCULINO">Masculino</option>
                </select>
              </div>
              <div>
                <label htmlFor="pac-cid" className={rotulo}>
                  CID-10 (sugestão clínica)
                </label>
                <input
                  id="pac-cid"
                  type="text"
                  list="cid10-sugestoes"
                  placeholder="Ex.: F80.0, F80.1, R47.0..."
                  value={form.cid10}
                  onChange={update('cid10')}
                  className={campo}
                />
                <datalist id="cid10-sugestoes">
                  <option value="F80.0">F80.0 - Transtorno específico da articulação da fala</option>
                  <option value="F80.1">F80.1 - Transtorno expressivo da linguagem</option>
                  <option value="F80.2">F80.2 - Transtorno receptivo da linguagem</option>
                  <option value="F80.8">F80.8 - Outros transtornos do desenvolvimento da fala</option>
                  <option value="F80.9">F80.9 - Transtorno não especificado do desenvolvimento</option>
                  <option value="F98.5">F98.5 - Gagueira (Tartamudez)</option>
                  <option value="R47.0">R47.0 - Disfasia e Afasia</option>
                  <option value="R49.0">R49.0 - Disfonia (Alteração vocal)</option>
                  <option value="H90">H90 - Perda de audição por transtorno de condução/neurossensorial</option>
                </datalist>
              </div>
            </div>

            {needsGuardian && (
              <fieldset className="space-y-3 rounded-[16px] rounded-bl-[5px] bg-gelo/70 p-4">
                <legend className="float-left mb-1 w-full text-[14px] font-bold text-azul-petroleo">
                  Responsável (menor de 18 anos)
                </legend>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div>
                    <label htmlFor="resp-nome" className={rotulo}>
                      Nome *
                    </label>
                    <input id="resp-nome" type="text" required value={form.guardianName} onChange={update('guardianName')} className={campo} />
                  </div>
                  <div>
                    <label htmlFor="resp-cpf" className={rotulo}>
                      CPF *
                    </label>
                    <input id="resp-cpf" type="text" required value={form.guardianCpf} onChange={update('guardianCpf')} className={campo} />
                  </div>
                  <div>
                    <label htmlFor="resp-tel" className={rotulo}>
                      Telefone *
                    </label>
                    <input id="resp-tel" type="text" required value={form.guardianPhone} onChange={update('guardianPhone')} className={campo} />
                  </div>
                  <div>
                    <label htmlFor="resp-parentesco" className={rotulo}>
                      Parentesco *
                    </label>
                    <input
                      id="resp-parentesco"
                      type="text"
                      required
                      placeholder="Mãe, pai, avó..."
                      value={form.guardianRelationship}
                      onChange={update('guardianRelationship')}
                      className={campo}
                    />
                  </div>
                </div>
              </fieldset>
            )}

            {formError && (
              <p role="alert" className="rounded-[12px] rounded-bl-[3px] bg-danger/10 p-3 text-[13.5px] font-bold text-danger">
                {formError}
              </p>
            )}

            <div className="flex gap-2 border-t border-line pt-4">
              <button type="button" onClick={closeNewPatient} className={`${buttonClass('suave')} flex-1`}>
                Cancelar
              </button>
              <button type="submit" disabled={saving} className={`${buttonClass('azul')} flex-1`}>
                {saving ? (
                  <span className="size-4 animate-spin rounded-full border-2 border-white/40 border-t-white" aria-hidden="true" />
                ) : (
                  <Save size={16} aria-hidden="true" />
                )}
                {saving ? 'Salvando...' : editingPatient ? 'Salvar alterações' : 'Salvar prontuário'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
