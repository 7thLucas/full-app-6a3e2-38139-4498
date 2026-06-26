import { createLogger } from "~/lib/logger";

const logger = createLogger("EmailService");

/**
 * Email service stub.
 * Replace with a real SMTP/nodemailer implementation when email is configured.
 */
export const EmailService = {
  async sendPasswordReset(to: string, resetUrl: string): Promise<void> {
    logger.info(`[Email] Password reset for ${to}: ${resetUrl}`);
    // No-op until SMTP is configured
  },

  async sendVerificationCode(to: string, code: string): Promise<void> {
    logger.info(`[Email] Verification code for ${to}: ${code}`);
    // No-op until SMTP is configured
  },

  async sendEmail(to: string, subject: string, html: string): Promise<void> {
    logger.info(`[Email] Sending to ${to} — Subject: ${subject}`);
    // No-op until SMTP is configured
  },
};
