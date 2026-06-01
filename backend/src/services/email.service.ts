import { Resend } from "resend";
import nodemailer from "nodemailer";
import { env } from "../config/env.js";

// Use Resend if API key is set, otherwise fall back to SMTP or mock
const resendApiKey = process.env.RESEND_API_KEY;
const resend = resendApiKey ? new Resend(resendApiKey) : null;

const smtpReady = !!(env.SMTP_USER && env.SMTP_PASS);
const isMockMode = !resend && !smtpReady;

let smtpTransporter: nodemailer.Transporter | null = null;

if (smtpReady && !resend) {
  smtpTransporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    family: 4, // Force IPv4 — Render free tier blocks IPv6
    auth: {
      user: env.SMTP_USER,
      pass: env.SMTP_PASS,
    },
    tls: { rejectUnauthorized: false },
  });
}

function printMockEmail(to: string, subject: string, actionUrl: string, bodyText: string) {
  const border = "═".repeat(80);
  console.log(`
${border}
║ ${"📧  SYSTEM EMAIL SENT (DEVELOPMENT MOCK MODE)".padEnd(76)} ║
${border}
║ To:      ${to.padEnd(68)} ║
║ Subject: ${subject.padEnd(68)} ║
║ From:    ${env.FROM_EMAIL.padEnd(68)} ║
${border}
║                                                                              ║
║   ${bodyText.padEnd(72)}   ║
║                                                                              ║
║   Please click the following URL to proceed:                                 ║
║   ${actionUrl.substring(0, 72).padEnd(72)}   ║
║                                                                              ║
${border}
  `);
  console.log("FULL URL:", actionUrl);
}

function buildHtml(title: string, body: string, buttonText: string, url: string): string {
  return `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
      <div style="text-align: center; margin-bottom: 24px;">
        <h2 style="color: #3b82f6; font-size: 24px; margin: 0;">InternFlow AI</h2>
        <p style="color: #64748b; font-size: 14px; margin: 4px 0 0 0;">AI-Powered Internship Management</p>
      </div>
      <hr style="border: 0; border-top: 1px solid #e2e8f0; margin-bottom: 24px;" />
      <p style="color: #334155; font-size: 16px; line-height: 24px;">${body}</p>
      <div style="text-align: center; margin: 32px 0;">
        <a href="${url}" style="background-color: #3b82f6; color: #ffffff; padding: 12px 24px; font-weight: bold; font-size: 16px; text-decoration: none; border-radius: 8px; display: inline-block;">${buttonText}</a>
      </div>
      <p style="color: #64748b; font-size: 14px;">If the button doesn't work, copy this link: <a href="${url}">${url}</a></p>
    </div>
  `;
}

async function sendEmail(to: string, subject: string, html: string, text: string): Promise<void> {
  if (resend) {
    const { error } = await resend.emails.send({
      from: `InternFlow AI <onboarding@resend.dev>`,
      to,
      subject,
      html,
      text,
    });
    if (error) throw new Error(error.message);
    return;
  }

  if (smtpTransporter) {
    await smtpTransporter.sendMail({
      from: `"InternFlow AI" <${env.FROM_EMAIL}>`,
      to,
      subject,
      html,
      text,
    });
    return;
  }

  // Mock mode — log to console
  console.log(`[MOCK EMAIL] To: ${to} | Subject: ${subject}\n${text}`);
}

export async function sendVerificationEmail(email: string, token: string): Promise<void> {
  const frontendUrl = env.CORS_ORIGIN.split(",")[0].trim();
  const verificationUrl = `${frontendUrl}/verify-email?token=${token}`;
  const subject = "Verify your InternFlow AI Account";
  const bodyText = "Welcome to InternFlow AI! Please verify your email to activate your account.";

  if (isMockMode) {
    printMockEmail(email, subject, verificationUrl, bodyText);
    return;
  }

  const html = buildHtml(
    subject,
    "Welcome to InternFlow AI! Click the button below to verify your email address.",
    "Verify Email Address",
    verificationUrl,
  );

  await sendEmail(email, subject, html, `${bodyText}\n\nVerify here: ${verificationUrl}`);
}

export async function sendPasswordResetEmail(email: string, token: string): Promise<void> {
  const frontendUrl = env.CORS_ORIGIN.split(",")[0].trim();
  const resetUrl = `${frontendUrl}/reset-password?token=${token}`;
  const subject = "Reset your InternFlow AI Password";
  const bodyText = "You requested to reset your password. Use the link below to set a new password.";

  if (isMockMode) {
    printMockEmail(email, subject, resetUrl, bodyText);
    return;
  }

  const html = buildHtml(
    subject,
    "You requested to reset your InternFlow AI password. Click the button below.",
    "Reset Password",
    resetUrl,
  );

  await sendEmail(email, subject, html, `${bodyText}\n\nReset here: ${resetUrl}`);
}
