import nodemailer from "nodemailer";

const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;
const FROM_EMAIL = '"MasterSight" <noreply@mastersight.com>';

if (!SMTP_USER || !SMTP_PASS) {
  throw new Error(
    "SMTP_USER and SMTP_PASS must be set in environment variables.",
  );
}

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASS,
  },
});

export const sendResetPasswordEmail = ({
  email,
  name,
  token,
}: {
  email: string;
  name: string;
  token: string;
}) => {
  const link = `${process.env.FRONTEND_ENDPOINT}/auth/reset?token=${token}`;

  return transporter.sendMail({
    from: FROM_EMAIL,
    to: email,
    subject: "Redefinição de senha da conta do MasterSight",
    html: `
        <h1>Olá, ${name}!</h1>
        <p>Você solicitou a redefinição de sua senha, clique abaixo para prosseguir.</p>
        <p><a href="${link}">Redefinir senha (Não compartilhe este link)</a></p>
        <p>ATENÇÃO: Este link expira em 1 hora.</p>
      `,
  });
};

export const sendCreatedUserEmail = ({
  email,
  name,
  password,
}: {
  email: string;
  name: string;
  password: string;
}) => {
  const link = `${process.env.FRONTEND_ENDPOINT}/auth/`;

  return transporter.sendMail({
    from: FROM_EMAIL,
    to: email,
    subject: "Conta criada com sucesso no MasterSight",
    html: `
      <h1>Olá, ${name}!</h1>
      <p>Sua conta foi criada com sucesso.</p>
      <p>Você pode fazer login usando as seguintes credenciais:</p>
      <ul>
        <li>Email: ${email}</li>
        <li>Senha: ${password}</li>
      </ul>
      <p>Recomendamos que você altere sua senha após o primeiro acesso.</p>
      <p><a href="${link}">Fazer login</a></p>
    `,
  });
};

export const sendInviteUserEmail = ({
  email,
  name,
  inviter,
  company,
}: {
  email: string;
  name: string;
  inviter: string;
  company: string;
}) => {
  const link = `${process.env.FRONTEND_ENDPOINT}/dashboard/invites/`;

  return transporter.sendMail({
    from: FROM_EMAIL,
    to: email,
    subject: "Convite recebido no MasterSight",
    html: `
      <h1>Olá, ${name}!</h1>
      <p>Você foi convidado por ${inviter} para se juntar à empresa ${company}.</p>
      <p>Clique no botão abaixo para visualizar o convite.</p>
      <p><a href="${link}">Visualizar convite</a></p>
    `,
  });
};