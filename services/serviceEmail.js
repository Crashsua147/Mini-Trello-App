import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

export const SendEmail = async (to, content) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.MAILER_USER,
      pass: process.env.MAILER_PASS
    }
  });

  const mailOptions = {
    from: process.env.MAILER_USER,
    to,
    subject: 'Get Login Code Trello App',
    text: content
  };

  await transporter.sendMail(mailOptions);
};
