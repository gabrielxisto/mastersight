export const permissions = {
  departments: {
    name: "Departamentos",
    list: [
      {
        name: "Visualizar",
        id: "viewDepartments",
      },
      {
        name: "Criar",
        id: "createDepartments",
      },
      {
        name: "Deletar",
        id: "deleteDepartments",
      },
      {
        name: "Editar",
        id: "editDepartments",
      },
    ],
  },
  roles: {
    name: "Cargos",
    list: [
      {
        name: "Visualizar",
        id: "viewRoles",
      },
      {
        name: "Criar",
        id: "createRoles",
      },
      {
        name: "Deletar",
        id: "deleteRoles",
      },
      {
        name: "Editar",
        id: "editRoles",
      },
    ],
  },
  team: {
    name: "Equipe",
    list: [
      {
        name: "Visualizar",
        id: "viewUsers",
      },
      {
        name: "Adicionar",
        id: "addUsers",
      },
      {
        name: "Remover",
        id: "removeUsers",
      },
      {
        name: "Editar",
        id: "editUsers",
      },
    ],
  },
  settings: {
    name: "Configurações",
    list: [
      {
        name: "Visualizar",
        id: "viewSettings",
      },
      {
        name: "Editar informações",
        id: "changeCompanyInfos",
      },
      {
        name: "Editar aparência",
        id: "changeCompanyAppearance",
      }
    ],
  },
};

export const defaultPermissions = {
  "manager": [
    "viewDepartments",
    "createDepartments",
    "deleteDepartments",
    "editDepartments",
    "viewRoles",
    "createRoles",
    "deleteRoles",
    "editRoles",
    "viewUsers",
    "addUsers",
    "removeUsers",
    "editUsers",
    "viewSettings",
  ],
  "employee": [],
};

export const permissionsTypes = [
  { id: "manager", name: "Gestor" },
  { id: "employee", name: "Usuário Padrão" },
];
