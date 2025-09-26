export type PaymentPopup = {
    id: "pix" | "card",
    orderId: number,
    qrcode?: string,
    code?: string
}

export type Permissions = {
    [key: string]: string | {
        [key: string]: boolean;
    }
}

export type Company = {
    id: number;
    name: string;
    cnpj: string;
    image: string;
    color: string;
    departmens: Department[];
    role: Role[];
    lastAccess?: number;
};

export type Department = {
    id: number;
    name: string;
    company: number;
    salary: number;
    roles: number;
    users: number;
}

export type Role = {
  id: number;
  name: string;
  company: number;
  department: number;
  salary: number;
}

export type User = {
  id: string;
  name: string;
  image: string;
  email: string;
  cpf: string;
  birthday: Date;
  admin?: boolean;
  description?: string;
};