import nodemailer from "nodemailer";
import { env } from "../config/env.js";

// Helper to determine if we should run in mock mode
const isMockMode = !env.SMTP_USER || !env.SMTP_PASS;

let transporter: nodemailer.Transporter | null = null;

if (!isMockMode) {
  const isGmail = env.SMTP_HOST.toLowerCase().includes("gmail");
  
  transporter = nodemailer.createTransport(
    isGmail
      ? {
          service: "gmail",
          auth: {
            user: env.SMTP_USER,
            pass: env.SMTP_PASS,
          },
        }
      : {
          host: env.SMTP_HOST,
          port: env.SMTP_PORT,
          secure: env.SMTP_PORT === 465,
          auth: {
            user: env.SMTP_USER,
            pass: env.SMTP_PASS,
          },
        }
  );
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
║   ${actionUrl.padEnd(72)}   ║
║                                                                              ║
${border}
  `);
}

export async function sendVerificationEmail(email: string, token: string): Promise<void> {
  const verificationUrl = `${env.CORS_ORIGIN.split(",")[0]}/verify-email?token=${token}`;
  const subject = "Verify your InternFlow AI Account";
  const bodyText = "Welcome to InternFlow AI! Please verify your email to activate your account.";

  if (isMockMode) {
    printMockEmail(email, subject, verificationUrl, bodyText);
    return;
  }

  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
      <div style="text-align: center; margin-bottom: 24px;">
        <h2 style="color: #3b82f6; font-size: 24px; margin: 0;">InternFlow AI</h2>
        <p style="color: #64748b; font-size: 14px; margin: 4px 0 0 0;">AI-Powered Internship Management</p>
      </div>
      <hr style="border: 0; border-top: 1px solid #e2e8f0; margin-bottom: 24px;" />
      <p style="color: #334155; font-size: 16px; line-height: 24px;">Hello,</p>
      <p style="color: #334155; font-size: 16px; line-height: 24px;">Welcome to InternFlow AI! We are excited to have you on board. Before you can log in, you need to verify your email address.</p>
      <div style="text-align: center; margin: 32px 0;">
        <a href="${verificationUrl}" style="background-color: #3b82f6; color: #ffffff; padding: 12px 24px; font-weight: bold; font-size: 16px; text-decoration: none; border-radius: 8px; display: inline-block; box-shadow: 0 4px 6px -1px rgba(59, 130, 246, 0.2);">Verify Email Address</a>
      </div>
      <p style="color: #64748b; font-size: 14px; line-height: 20px;">If the button above does not work, copy and paste this link into your browser:</p>
      <p style="color: #3b82f6; font-size: 14px; word-break: break-all; margin: 8px 0;"><a href="${verificationUrl}">${verificationUrl}</a></p>
      <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
      <p style="color: #94a3b8; font-size: 12px; line-height: 18px; text-align: center;">This link is valid for 24 hours. If you did not create an account, you can safely ignore this email.</p>
    </div>
  `;

  await transporter!.sendMail({
    from: `"${env.FROM_EMAIL.split("@")[0]}" <${env.FROM_EMAIL}>`,
    to: email,
    subject,
    text: `${bodyText}\n\nVerify your email here: ${verificationUrl}`,
    html,
  });
}

export async function sendPasswordResetEmail(email: string, token: string): Promise<void> {
  const resetUrl = `${env.CORS_ORIGIN.split(",")[0]}/reset-password?token=${token}`;
  const subject = "Reset your InternFlow AI Password";
  const bodyText = "You requested to reset your password. Use the link below to set a new password.";

  if (isMockMode) {
    printMockEmail(email, subject, resetUrl, bodyText);
    return;
  }

  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
      <div style="text-align: center; margin-bottom: 24px;">
        <h2 style="color: #3b82f6; font-size: 24px; margin: 0;">InternFlow AI</h2>
        <p style="color: #64748b; font-size: 14px; margin: 4px 0 0 0;">AI-Powered Internship Management</p>
      </div>
      <hr style="border: 0; border-top: 1px solid #e2e8f0; margin-bottom: 24px;" />
      <p style="color: #334155; font-size: 16px; line-height: 24px;">Hello,</p>
      <p style="color: #334155; font-size: 16px; line-height: 24px;">You requested to reset your password for your InternFlow AI account. Click the button below to choose a new password.</p>
      <div style="text-align: center; margin: 32px 0;">
        <a href="${resetUrl}" style="background-color: #3b82f6; color: #ffffff; padding: 12px 24px; font-weight: bold; font-size: 16px; text-decoration: none; border-radius: 8px; display: inline-block; box-shadow: 0 4px 6px -1px rgba(59, 130, 246, 0.2);">Reset Password</a>
      </div>
      <p style="color: #64748b; font-size: 14px; line-height: 20px;">If the button above does not work, copy and paste this link into your browser:</p>
      <p style="color: #3b82f6; font-size: 14px; word-break: break-all; margin: 8px 0;"><a href="${resetUrl}">${resetUrl}</a></p>
      <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
      <p style="color: #94a3b8; font-size: 12px; line-height: 18px; text-align: center;">This link is valid for 15 minutes. If you did not request a password reset, you can safely ignore this email.</p>
    </div>
  `;

  await transporter!.sendMail({
    from: `"${env.FROM_EMAIL.split("@")[0]}" <${env.FROM_EMAIL}>`,
    to: email,
    subject,
    text: `${bodyText}\n\nReset your password here: ${resetUrl}`,
    html,
  });
}
