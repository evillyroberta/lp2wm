import nodemailer from 'nodemailer';
import mailConfig from '../config/mail.js';

async function createNewUser(to) {
  try {
    const config = await mailConfig();

    const transporter = nodemailer.createTransport(config);

    const info = await transporter.sendMail({
      from: 'noreply@email.com',
      to,
      subject: 'Conta criada no WM!',
      text: `Conta criada com sucesso.`,
      html: `<h1>Conta criada com sucesso.</h1><p>✨</p>`,
    });

    if (process.env.NODE_ENV === 'development') {
      console.log(`Email enviado: ${nodemailer.getTestMessageUrl(info)}`);
    }
  } catch (err) {
    throw new Error(err);
  }
}

async function nvlogin(to) {
  try {
    const config = await mailConfig();

    const transporter = nodemailer.createTransport(config);

    const info = await transporter.sendMail({
      from: 'noreply@email.com',
      to,
      subject: 'Novo login detectado no WM!',
      text: `Olá! Um novo login foi realizado em sua conta.`,
      html: `<h1>Novo login realizado com sucesso!</h1><p>Se não foi você, entre em contato com o suporte imediatamente.</p>`,
    });

    if (process.env.NODE_ENV === 'development') {
      console.log(`Email enviado: ${nodemailer.getTestMessageUrl(info)}`);
    }
  } catch (err) {
    throw new Error(err);
  }
}

export default { createNewUser, nvlogin };
