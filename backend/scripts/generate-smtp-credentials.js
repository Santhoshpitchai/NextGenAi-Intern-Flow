import nodemailer from "nodemailer";

async function main() {
  console.log("Generating Ethereal SMTP test credentials...");
  try {
    const account = await nodemailer.createTestAccount();
    console.log("\n====== ETHEREAL SMTP TEST CREDENTIALS GENERATED ======");
    console.log("Copy and paste the following lines into your backend/.env file:\n");
    console.log("SMTP_HOST=smtp.ethereal.email");
    console.log("SMTP_PORT=587");
    console.log(`SMTP_USER=${account.user}`);
    console.log(`SMTP_PASS=${account.pass}`);
    console.log("FROM_EMAIL=noreply@internflow.ai");
    console.log("\n======================================================");
    console.log(`To view sent emails, log in at: https://ethereal.email with:`);
    console.log(`Username: ${account.user}`);
    console.log(`Password: ${account.pass}`);
  } catch (error) {
    console.error("Failed to generate test credentials:", error);
  }
}

main();
