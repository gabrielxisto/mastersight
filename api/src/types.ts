export type Admin = {
    id: number;
    email: string;
    name: string;
    password: string;
    master: boolean;
    createdAt: Date;
}

export type User = {
    id: number;
    email: string;
    name: string;
    password: string | null;
    cpf: string;
    image: string;
    createdAt: Date
}

export type UserData = {
    id: number;
    companyId: number;
    userId: number;
    role: number;
    department: number;
    permissions: {[key: string]: string[]};
    createdAt: Date;
    lastAccess: Date | null;
}

export type Department = {
    id: number;
    companyId: number;
    name: string;
    description: string;
    salary: number;
    createdAt: Date;
}

export type Role = {
    id: number;
    companyId: number;
    departmentId: number;
    name: string;
    salary: number;
    createdAt: Date;
}