import nodemailer from "nodemailer";
import type { ContactFormData } from "../types/api";

/**
 * Email configuration interface
 */
export interface EmailConfig {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
}

/**
 * Email template data
 */
export interface EmailTemplateData extends ContactFormData {
  timestamp: string;
  userIP?: string;
  userAgent?: string;
}

/**
 * Email service class for handling secure email sending
 */
class EmailService {
  private transporter: nodemailer.Transporter | null = null;
  private isConfigured = false;

  /**
   * Initialize email service with configuration
   */
  async initialize(): Promise<void> {
    try {
      // Validate environment variables
      const requiredVars = [
        "SMTP_HOST",
        "SMTP_PORT",
        "SMTP_USER",
        "SMTP_PASS",
        "RECIPIENT_EMAIL",
      ];
      const missingVars = requiredVars.filter(
        (varName) => !process.env[varName]
      );

      if (missingVars.length > 0) {
        throw new Error(
          `Missing required environment variables: ${missingVars.join(", ")}`
        );
      }

      const config: EmailConfig = {
        host: process.env.SMTP_HOST!,
        port: parseInt(process.env.SMTP_PORT!),
        secure: process.env.SMTP_SECURE === "true", // true for 465, false for other ports
        auth: {
          user: process.env.SMTP_USER!,
          pass: process.env.SMTP_PASS!,
        },
      };

      // Add production-specific SMTP options
      const transportConfig = {
        ...config,
        // Production-specific options
        pool: true, // Use connection pooling
        maxConnections: 5, // Limit concurrent connections
        maxMessages: 100, // Limit messages per connection
        rateLimit: 10, // Messages per second
        // Render.com specific timeouts
        connectionTimeout: 30000, // 30 seconds
        greetingTimeout: 30000,
        socketTimeout: 60000,
        // Security options for production
        requireTLS: process.env.NODE_ENV === "production",
        tls: {
          rejectUnauthorized: process.env.NODE_ENV === "production",
        },
      };

      // Create transporter
      this.transporter = nodemailer.createTransport(transportConfig);

      // Verify connection (with timeout for production)
      const verifyPromise = this.transporter.verify();
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("SMTP verification timeout")), 15000)
      );

      await Promise.race([verifyPromise, timeoutPromise]);
      this.isConfigured = true;

      console.log(
        `📧 Email service initialized successfully (${
          process.env.NODE_ENV || "development"
        } mode)`
      );
    } catch (error) {
      console.error("❌ Email service initialization failed:", error);

      // In production, provide more specific error messages
      if (process.env.NODE_ENV === "production") {
        if (error instanceof Error && error.message.includes("ENOTFOUND")) {
          throw new Error(
            "SMTP server not reachable. Check your SMTP_HOST setting."
          );
        } else if (
          error instanceof Error &&
          error.message.includes("authentication")
        ) {
          throw new Error(
            "SMTP authentication failed. Check your SMTP_USER and SMTP_PASS."
          );
        } else if (
          error instanceof Error &&
          error.message.includes("timeout")
        ) {
          throw new Error(
            "SMTP connection timeout. This may be a network issue on Render.com."
          );
        }
      }

      throw new Error("Failed to initialize email service");
    }
  }

  /**
   * Check if email service is ready
   */
  isReady(): boolean {
    return this.isConfigured && this.transporter !== null;
  }

  /**
   * Generate HTML email template
   */
  private generateEmailTemplate(data: EmailTemplateData): string {
    const { name, email, subject, message, timestamp, userIP, userAgent } =
      data;

    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Contact Form Submission</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      background-color: #f5f5f5;
    }
    .container {
      background: white;
      padding: 30px;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }
    .header {
      background: #2563eb;
      color: white;
      padding: 20px;
      margin: -30px -30px 30px -30px;
      border-radius: 8px 8px 0 0;
    }
    .field {
      margin-bottom: 20px;
      padding: 15px;
      background: #f8fafc;
      border-left: 4px solid #2563eb;
      border-radius: 0 4px 4px 0;
    }
    .label {
      font-weight: bold;
      color: #1e40af;
      font-size: 14px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .value {
      margin-top: 5px;
      font-size: 16px;
      word-wrap: break-word;
    }
    .message {
      background: white;
      padding: 20px;
      border: 1px solid #e5e7eb;
      border-radius: 6px;
      white-space: pre-wrap;
      font-family: Georgia, serif;
      line-height: 1.7;
    }
    .footer {
      margin-top: 30px;
      padding-top: 20px;
      border-top: 1px solid #e5e7eb;
      font-size: 12px;
      color: #6b7280;
    }
    .security-info {
      background: #fef3c7;
      border: 1px solid #f59e0b;
      padding: 10px;
      border-radius: 4px;
      font-size: 12px;
      color: #92400e;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 style="margin: 0; font-size: 24px;">💌 New Contact Form Submission</h1>
      <p style="margin: 10px 0 0 0; opacity: 0.9;">Received: ${timestamp}</p>
    </div>

    <div class="field">
      <div class="label">👤 Name</div>
      <div class="value">${name}</div>
    </div>

    <div class="field">
      <div class="label">✉️ Email</div>
      <div class="value">
        <a href="mailto:${email}" style="color: #2563eb; text-decoration: none;">${email}</a>
      </div>
    </div>

    <div class="field">
      <div class="label">📝 Subject</div>
      <div class="value">${subject}</div>
    </div>

    <div class="field">
      <div class="label">💬 Message</div>
      <div class="message">${message}</div>
    </div>

    ${
      userIP || userAgent
        ? `
    <div class="security-info">
      <strong>🔒 Security Information:</strong><br>
      ${userIP ? `IP Address: ${userIP}<br>` : ""}
      ${userAgent ? `User Agent: ${userAgent}` : ""}
    </div>
    `
        : ""
    }

    <div class="footer">
      <p>
        <strong>Quick Actions:</strong><br>
        • Reply directly to this email to respond to ${name}<br>
        • Email sent via secure contact form on your website<br>
        • This is an automated message - do not reply to this sender address
      </p>
    </div>
  </div>
</body>
</html>`;
  }

  /**
   * Generate plain text version of email
   */
  private generatePlainTextEmail(data: EmailTemplateData): string {
    const { name, email, subject, message, timestamp, userIP, userAgent } =
      data;

    return `
NEW CONTACT FORM SUBMISSION

Received: ${timestamp}

Name: ${name}
Email: ${email}
Subject: ${subject}

Message:
${message}

${
  userIP || userAgent
    ? `
Security Information:
${userIP ? `IP Address: ${userIP}` : ""}
${userAgent ? `User Agent: ${userAgent}` : ""}
`
    : ""
}

---
Quick Actions:
• Reply directly to this email to respond to ${name}
• Email sent via secure contact form on your website
• This is an automated message
    `.trim();
  }

  /**
   * Send contact form email
   */
  async sendContactEmail(
    formData: ContactFormData,
    metadata: {
      userIP?: string;
      userAgent?: string;
    } = {}
  ): Promise<{ success: boolean; messageId?: string; error?: string }> {
    try {
      if (!this.isReady()) {
        await this.initialize();
      }

      if (!this.transporter) {
        throw new Error("Email transporter not configured");
      }

      const timestamp = new Date().toLocaleString("en-US", {
        timeZone: "America/New_York", // Adjust to your timezone
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });

      const templateData: EmailTemplateData = {
        ...formData,
        timestamp,
        userIP: metadata.userIP,
        userAgent: metadata.userAgent,
      };

      const mailOptions = {
        from: {
          name: `${formData.name} (via Contact Form)`,
          address: process.env.SMTP_USER!,
        },
        to: {
          name: process.env.RECIPIENT_NAME || "James Park",
          address: process.env.RECIPIENT_EMAIL!,
        },
        replyTo: {
          name: formData.name,
          address: formData.email,
        },
        subject: `📧 ${formData.subject} (from ${formData.name} <${formData.email}>)`,
        html: this.generateEmailTemplate(templateData),
        text: this.generatePlainTextEmail(templateData),
        headers: {
          "X-Contact-Form": "true",
          "X-Contact-IP": metadata.userIP || "unknown",
          "X-Contact-Time": new Date().toISOString(),
          "X-Original-Sender": formData.email,
        },
      };

      const info = await this.transporter.sendMail(mailOptions);

      console.log("✅ Contact email sent successfully:", info.messageId);

      return {
        success: true,
        messageId: info.messageId,
      };
    } catch (error) {
      console.error("❌ Failed to send contact email:", error);

      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      };
    }
  }

  /**
   * Test email configuration (for development/debugging)
   */
  async testConnection(): Promise<{ success: boolean; error?: string }> {
    try {
      if (!this.isReady()) {
        await this.initialize();
      }

      if (!this.transporter) {
        throw new Error("Email transporter not configured");
      }

      await this.transporter.verify();
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      };
    }
  }

  /**
   * Close the email service connection
   */
  async close(): Promise<void> {
    if (this.transporter) {
      this.transporter.close();
      this.transporter = null;
      this.isConfigured = false;
    }
  }
}

// Singleton instance
export const emailService = new EmailService();

// Helper function for easy access
export async function sendContactFormEmail(
  formData: ContactFormData,
  metadata?: { userIP?: string; userAgent?: string }
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  return emailService.sendContactEmail(formData, metadata);
}
