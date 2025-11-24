import type { ContactFormData } from "../types/api";

/**
 * Mailgun configuration interface
 */
export interface MailgunConfig {
  apiKey: string;
  domain: string;
  fromEmail: string;
  fromName: string;
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
 * Mailgun API response interface
 */
interface MailgunResponse {
  id: string;
  message: string;
}

/**
 * Email service class for handling secure email sending via Mailgun API
 */
class MailgunEmailService {
  private config: MailgunConfig | null = null;
  private isConfigured = false;

  /**
   * Initialize email service with Mailgun configuration
   */
  async initialize(): Promise<void> {
    try {
      // Validate environment variables
      const requiredVars = [
        "MAILGUN_API_KEY",
        "MAILGUN_DOMAIN",
        "MAILGUN_FROM_EMAIL",
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

      this.config = {
        apiKey: process.env.MAILGUN_API_KEY!,
        domain: process.env.MAILGUN_DOMAIN!,
        fromEmail: process.env.MAILGUN_FROM_EMAIL!,
        fromName: process.env.MAILGUN_FROM_NAME || "Contact Form",
      };

      // Test API key format (should start with 'key-' for Mailgun)
      if (!this.config.apiKey.startsWith("key-")) {
        console.warn('⚠️ Mailgun API key should start with "key-"');
      }

      this.isConfigured = true;
      console.log(
        `📧 Mailgun email service initialized successfully (${
          process.env.NODE_ENV || "development"
        } mode)`
      );
    } catch (error) {
      console.error("❌ Email service initialization failed:", error);

      // In production, provide more specific error messages
      if (process.env.NODE_ENV === "production") {
        if (
          error instanceof Error &&
          error.message.includes("Missing required environment variables")
        ) {
          throw new Error(
            "Email service not configured. Check environment variables."
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
    return this.isConfigured && this.config !== null;
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
        • This message was sent via Mailgun API
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
• This message was sent via Mailgun API
    `.trim();
  }

  /**
   * Send email via Mailgun API
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

      if (!this.config) {
        throw new Error("Mailgun service not configured");
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

      // Prepare form data for Mailgun API
      const mailgunData = new FormData();
      mailgunData.append(
        "from",
        `${formData.name} (via ${this.config.fromName}) <${this.config.fromEmail}>`
      );
      mailgunData.append(
        "to",
        `${process.env.RECIPIENT_NAME || "James Park"} <${process.env
          .RECIPIENT_EMAIL!}>`
      );
      mailgunData.append("h:Reply-To", `${formData.name} <${formData.email}>`);
      mailgunData.append(
        "subject",
        `📧 ${formData.subject} (from ${formData.name} <${formData.email}>)`
      );
      mailgunData.append("html", this.generateEmailTemplate(templateData));
      mailgunData.append("text", this.generatePlainTextEmail(templateData));

      // Add custom headers
      mailgunData.append("h:X-Contact-Form", "true");
      mailgunData.append("h:X-Contact-IP", metadata.userIP || "unknown");
      mailgunData.append("h:X-Contact-Time", new Date().toISOString());
      mailgunData.append("h:X-Original-Sender", formData.email);

      // Make API call to Mailgun
      const response = await fetch(
        `https://api.mailgun.net/v3/${this.config.domain}/messages`,
        {
          method: "POST",
          headers: {
            Authorization: `Basic ${Buffer.from(
              `api:${this.config.apiKey}`
            ).toString("base64")}`,
          },
          body: mailgunData,
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error("❌ Mailgun API error:", response.status, errorText);

        if (response.status === 401) {
          throw new Error("Mailgun authentication failed. Check your API key.");
        } else if (response.status === 400) {
          throw new Error(
            "Invalid email data. Check your Mailgun domain and from email."
          );
        } else {
          throw new Error(`Mailgun API error: ${response.status}`);
        }
      }

      const result: MailgunResponse = await response.json();

      console.log("✅ Contact email sent successfully via Mailgun:", result.id);

      return {
        success: true,
        messageId: result.id,
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
   * Test Mailgun API connection (for development/debugging)
   */
  async testConnection(): Promise<{ success: boolean; error?: string }> {
    try {
      if (!this.isReady()) {
        await this.initialize();
      }

      if (!this.config) {
        throw new Error("Mailgun service not configured");
      }

      // Test with Mailgun domain info endpoint
      const response = await fetch(
        `https://api.mailgun.net/v3/domains/${this.config.domain}`,
        {
          method: "GET",
          headers: {
            Authorization: `Basic ${Buffer.from(
              `api:${this.config.apiKey}`
            ).toString("base64")}`,
          },
        }
      );

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Mailgun authentication failed. Check your API key.");
        } else if (response.status === 404) {
          throw new Error(
            "Mailgun domain not found. Check your domain configuration."
          );
        } else {
          throw new Error(`Mailgun API error: ${response.status}`);
        }
      }

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      };
    }
  }
}

// Singleton instance
export const emailService = new MailgunEmailService();

// Helper function for easy access
export async function sendContactFormEmail(
  formData: ContactFormData,
  metadata?: { userIP?: string; userAgent?: string }
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  return emailService.sendContactEmail(formData, metadata);
}
