export const messages: { [key: string]: Record<string, string> } = {
  error: {
    "passwords-do-not-match": "As senhas não coincidem.",
    "cpf-already-registered": "Este CPF já está registrado.",
    "email-already-registered": "Este email já está registrado.",
    "weak-password":
      "A senha é muito fraca. Use pelo menos 8 caracteres, incluindo letras maiúsculas, minúsculas, números e símbolos.",
    "invalid-email": "O email fornecido não é válido.",
    "invalid-cpf": "O CPF fornecido não é válido.",
    "user-not-exists": "Usuário não existente no sistema.",
    "invalid-credentials": "A senha está incorreta.",
  },
  success: {
    "department-created": "Departamento criado com sucesso!",
    "department-deleted": "Departamento deletado com sucesso!",
    "department-updated": "Departamento editado com sucesso!",
    "role-created": "Cargo criado com sucesso!",
    "role-deleted": "Cargo deletado com sucesso!",
    "role-updated": "Cargo editado com sucesso!",
    "company-infos-updated": "Informações da empresa editadas com sucesso!",
    "company-appearance-updated": "Aparência da empresa editada com sucesso!",
    "user-updated": "Conta editada com sucesso!",
    "password-updated": "Senha alterada com sucesso!",
    "user-created-and-added": "Usuário criado e adicionado à empresa com sucesso!",
    "user-invited": "Convite enviado com sucesso!",
    "user-deleted": "Usuário removido da empresa com sucesso!",
    "user-edited": "Usuário editado com sucesso!",
  },
};

export const titles: { path: string; title: string[] }[] = [
  {
    path: "/dashboard",
    title: ["Empresas"],
  },
  {
    path: "/dashboard/invites",
    title: ["Convites"],
  },
  {
    path: "/dashboard/docs",
    title: ["Documentação"],
  },
  {
    path: "/dashboard/profile",
    title: ["Conta"],
  },
  {
    path: "/company/profile",
    title: ["Conta"],
  },
  {
    path: "/company/settings",
    title: ["Configurações"],
  },
  {
    path: "/company/archive/departments",
    title: ["Departamentos", "Arquivo"],
  },
  {
    path: "/company/archive/roles",
    title: ["Cargos", "Arquivo"],
  },
  {
    path: "/company/archive/benefits",
    title: ["Benefícios", "Arquivo"],
  },
  {
    path: "/company/archive/rewards",
    title: ["Premiações", "Arquivo"],
  },
  {
    path: "/company/archive/performance",
    title: ["Desempenho", "Arquivo"],
  },
  {
    path: "/company/archive/manuals",
    title: ["Manuais", "Arquivo"],
  },
  {
    path: "/company/archive/communication",
    title: ["Comunicação", "Arquivo"],
  },
  {
    path: "/company/team",
    title: ["Cadastro Geral", "Equipe"],
  },
  {
    path: "/company/team/feedbacks",
    title: ["Feedbacks", "Equipe"],
  },
  {
    path: "/company/team/evaluations",
    title: ["Aba de Avaliações", "Equipe"],
  },
];
