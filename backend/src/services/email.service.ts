import nodemailer from "nodemailer";
import { env } from "../config/env.js";

const isMockMode = !env.SMTP_USER || !env.SMTP_PASS;

const transporter = isMockMode
  ? null
  : nodemailer.createTransport({
      host: "74.125.24.108", // smtp.gmail.com IPv4 — avoids IPv6 on Render free tier
      port: 587,
      secure: false,
      auth: {
        user: env.SMTP_USER,
        pass: env.SMTP_PASS,
      },
      tls: { rejectUnauthorized: false },
    });

function printMockEmail(to: string, subject: string, url: string) {
  console.log(`\n${"=".repeat(60)}`);
  console.log(`📧 MOCK EMAIL`);
  console.log(`To: ${to}`);
  console.log(`Subject: ${subject}`);
  console.log(`URL: ${url}`);
  console.log(`${"=".repeat(60)}\n`);
}

function buildHtml(body: string, buttonText: string, url: string): string {
  return `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px;">
      <h2 style="color: #3b82f6;">InternFlow AI</h2>
      <hr style="border-top: 1px solid #e2e8f0;" />
      <p style="color: #334155; font-size: 16px;">${body}</p>
      <div style="text-align: center; margin: 32px 0;">
        <a href="${url}" style="background-color: #3b82f6; color: #fff; padding: 12px 24px; font-weight: bold; text-decoration: none; border-radius: 8px;">${buttonText}</a>
      </div>
      <p style="color: #64748b; font-size: 14px;">If the button doesn't work: <a href="${url}">${url}</a></p>
    </div>
  `;
}

export async function sendVerificationEmail(email: string, token: string): Promise<void> {
  const frontendUrl = env.CORS_ORIGIN.split(",")[0].trim();
  const url = `${frontendUrl}/verify-email?token=${token}`;
  const subject = "Verify your InternFlow AI Account";

  if (isMockMode) {
    printMockEmail(email, subject, url);
    return;
  }

  await transporter!.sendMail({
    from: `"InternFlow AI" <${env.SMTP_USER}>`,
    to: email,
    subject,
    html: buildHtml("Welcome to InternFlow AI! Please verify your email to activate your account.", "Verify Email", url),
    text: `Verify your email: ${url}`,
  });
}

export async function sendPasswordResetEmail(email: string, token: string): Promise<void> {
  const frontendUrl = env.CORS_ORIGIN.split(",")[0].trim();
  const url = `${frontendUrl}/reset-password?token=${token}`;
  const subject = "Reset your InternFlow AI Password";

  if (isMockMode) {
    printMockEmail(email, subject, url);
    return;
  }

  await transporter!.sendMail({
    from: `"InternFlow AI" <${env.SMTP_USER}>`,
    to: email,
    subject,
    html: buildHtml("You requested to reset your InternFlow AI password.", "Reset Password", url),
    text: `Reset your password: ${url}`,
  });
}
