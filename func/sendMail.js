import nodemailer from "nodemailer";

export async function sendEmail({ receiver, subject, text }) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL,
      pass: process.env.GMAIL_PASS,
    },
  });

  try {
    const info = await transporter.sendMail({
      from: process.env.GMAIL,
      to: receiver,
      subject: subject,
      text: text,
    });
    return { success: true, message: "Email sent" };
  } catch (error) {
    return { success: false, message: "Failed to send email", error: error.message };
  }
}