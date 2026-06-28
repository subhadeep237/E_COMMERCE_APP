import dotenv from "dotenv";
dotenv.config();

import { sendTestEmail } from "./services/emailService.js";

const test = async () => {
  console.log("📧 Sending test email...");
  console.log("From:", process.env.EMAIL_USER);

  // Send test email to YOURSELF
  const result = await sendTestEmail(process.env.EMAIL_USER);

  if (result.success) {
    console.log("\n🎉 SUCCESS! Check your inbox!");
    console.log("Message ID:", result.messageId);
  } else {
    console.log("\n❌ FAILED!");
    console.log("Error:", result.error);
  }

  process.exit(0);
};

test();