const nodemailer = require("nodemailer");

const sendEmail = async(Options) => {
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      tls: { rejectUnauthorized: false },
    });
    const mailOpts = {
        from:'Crud System',
        to: options.email,
        subject:options.subject,
        text:options.message,
    }
    await transporter.sendMail(mailOpts);
};
module.exports = sendEmail;
