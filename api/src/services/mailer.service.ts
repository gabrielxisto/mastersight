
import nodemailer from "nodemailer";

const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;
const FROM_EMAIL = '"MasterSight" <noreply@mastersight.com>';

if (!SMTP_USER || !SMTP_PASS) {
  throw new Error("SMTP_USER and SMTP_PASS must be set in environment variables.");
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
  token 
}: { 
  email: string, 
  name: string, 
  token: string 
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
}