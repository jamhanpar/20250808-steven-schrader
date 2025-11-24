# SMTP Email Implementation Guide

This guide shows how to implement SMTP-based email sending for contact forms. **Note: This requires a paid hosting plan on most providers like Render.com, Vercel, etc., as they block SMTP ports on free tiers.**

## 🚫 **Important: SMTP Limitations on Free Hosting**

### **Hosting Providers That Block SMTP (Free Tiers)**
- **Render.com** - Blocks ports 25, 587, 465 on free tier
- **Vercel** - Blocks SMTP on hobby tier
- **Netlify** - No SMTP support on free tier
- **Railway** - Blocks SMTP on free tier

### **SMTP Works On**
- **Paid hosting plans** ($7+ per month)
- **VPS providers** (DigitalOcean, Linode, AWS EC2)
- **Traditional hosting** (shared hosting, dedicated servers)

## 📧 **SMTP Implementation**

### **Step 1: Environment Variables**

Create these environment variables in your hosting provider:

```env
# SMTP Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-gmail@gmail.com
SMTP_PASS=your-16-character-app-password

# Alternative SMTP Providers
# Gmail SSL: SMTP_HOST=smtp.gmail.com, SMTP_PORT=465, SMTP_SECURE=true
# Outlook: SMTP_HOST=smtp-mail.outlook.com, SMTP_PORT=587, SMTP_SECURE=false
# Yahoo: SMTP_HOST=smtp.mail.yahoo.com, SMTP_PORT=587, SMTP_SECURE=false

# Recipient Configuration
RECIPIENT_EMAIL=your-email@gmail.com
RECIPIENT_NAME=Your Name

# Security
CONTACT_FORM_SECRET=your-random-32-char-secret
NODE_ENV=production
```

### **Step 2: Install Dependencies**

```bash
npm install nodemailer @types/nodemailer
```

### **Step 3: SMTP Email Service**

Create `src/lib/email-smtp.ts`:

\`\`\`typescript
import nodemailer from "nodemailer";
import type { ContactFormData } from "../types/api";

export interface EmailConfig {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
}

export interface EmailTemplateData extends ContactFormData {
  timestamp: string;
  userIP?: string;
  userAgent?: string;
}

class SMTPEmailService {
  private transporter: nodemailer.Transporter | null = null;
  private isConfigured = false;

  async initialize(): Promise<void> {
    try {
      const requiredVars = [
        "SMTP_HOST",
        "SMTP_PORT",
        "SMTP_USER",
        "SMTP_PASS",
        "RECIPIENT_EMAIL",
      ];
      const missingVars = requiredVars.filter(varName => !process.env[varName]);

      if (missingVars.length > 0) {
        throw new Error(\`Missing required environment variables: \${missingVars.join(", ")}\`);
      }

      const config: EmailConfig = {
        host: process.env.SMTP_HOST!,
        port: parseInt(process.env.SMTP_PORT!),
        secure: process.env.SMTP_SECURE === "true",
        auth: {
          user: process.env.SMTP_USER!,
          pass: process.env.SMTP_PASS!,
        },
      };

      // Production-specific options
      const transportConfig = {
        ...config,
        pool: true,
        maxConnections: 5,
        maxMessages: 100,
        rateLimit: 10,
        connectionTimeout: 30000,
        greetingTimeout: 30000,
        socketTimeout: 60000,
        requireTLS: process.env.NODE_ENV === 'production',
        tls: {
          rejectUnauthorized: process.env.NODE_ENV === 'production'
        }
      };

      this.transporter = nodemailer.createTransport(transportConfig);

      // Verify connection with timeout
      const verifyPromise = this.transporter.verify();
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('SMTP verification timeout')), 15000)
      );

      await Promise.race([verifyPromise, timeoutPromise]);
      this.isConfigured = true;

      console.log(\`📧 SMTP email service initialized successfully (\${process.env.NODE_ENV || 'development'} mode)\`);
    } catch (error) {
      console.error("❌ SMTP email service initialization failed:", error);
      
      if (process.env.NODE_ENV === 'production') {
        if (error instanceof Error && error.message.includes('ENOTFOUND')) {
          throw new Error('SMTP server not reachable. Check your SMTP_HOST setting.');
        } else if (error instanceof Error && error.message.includes('authentication')) {
          throw new Error('SMTP authentication failed. Check your SMTP_USER and SMTP_PASS.');
        } else if (error instanceof Error && error.message.includes('timeout')) {
          throw new Error('SMTP connection timeout. Your hosting provider may be blocking SMTP ports.');
        }
      }
      
      throw new Error("Failed to initialize SMTP email service");
    }
  }

  isReady(): boolean {
    return this.isConfigured && this.transporter !== null;
  }

  private generateEmailTemplate(data: EmailTemplateData): string {
    const { name, email, subject, message, timestamp, userIP, userAgent } = data;
    
    return \`
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>New Contact Form Submission</title>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #2563eb; color: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
    .field { margin-bottom: 15px; padding: 10px; background: #f8f9fa; border-left: 4px solid #2563eb; }
    .label { font-weight: bold; color: #1e40af; }
    .value { margin-top: 5px; }
    .message { background: white; padding: 15px; border: 1px solid #ddd; border-radius: 4px; white-space: pre-wrap; }
  </style>
</head>
<body>
  <div class="header">
    <h1>💌 New Contact Form Submission</h1>
    <p>Received: \${timestamp}</p>
  </div>
  
  <div class="field">
    <div class="label">👤 Name</div>
    <div class="value">\${name}</div>
  </div>
  
  <div class="field">
    <div class="label">✉️ Email</div>
    <div class="value"><a href="mailto:\${email}">\${email}</a></div>
  </div>
  
  <div class="field">
    <div class="label">📝 Subject</div>
    <div class="value">\${subject}</div>
  </div>
  
  <div class="field">
    <div class="label">💬 Message</div>
    <div class="message">\${message}</div>
  </div>
  
  \${userIP ? \`<p><small>IP: \${userIP}</small></p>\` : ''}
  \${userAgent ? \`<p><small>User Agent: \${userAgent}</small></p>\` : ''}
</body>
</html>\`;
  }

  async sendContactEmail(
    formData: ContactFormData,
    metadata: { userIP?: string; userAgent?: string } = {}
  ): Promise<{ success: boolean; messageId?: string; error?: string }> {
    try {
      if (!this.isReady()) {
        await this.initialize();
      }

      if (!this.transporter) {
        throw new Error("SMTP transporter not configured");
      }

      const timestamp = new Date().toLocaleString('en-US', {
        timeZone: 'America/New_York',
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });

      const templateData: EmailTemplateData = {
        ...formData,
        timestamp,
        userIP: metadata.userIP,
        userAgent: metadata.userAgent,
      };

      const mailOptions = {
        from: {
          name: \`\${formData.name} (via Contact Form)\`,
          address: process.env.SMTP_USER!,
        },
        to: {
          name: process.env.RECIPIENT_NAME || "Recipient",
          address: process.env.RECIPIENT_EMAIL!,
        },
        replyTo: {
          name: formData.name,
          address: formData.email,
        },
        subject: \`📧 \${formData.subject} (from \${formData.name} <\${formData.email}>)\`,
        html: this.generateEmailTemplate(templateData),
        headers: {
          "X-Contact-Form": "true",
          "X-Contact-IP": metadata.userIP || "unknown",
          "X-Contact-Time": new Date().toISOString(),
          "X-Original-Sender": formData.email,
        },
      };

      const info = await this.transporter.sendMail(mailOptions);
      
      console.log("✅ Contact email sent successfully via SMTP:", info.messageId);
      
      return {
        success: true,
        messageId: info.messageId,
      };
    } catch (error) {
      console.error("❌ Failed to send contact email via SMTP:", error);
      
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error occurred",
      };
    }
  }

  async testConnection(): Promise<{ success: boolean; error?: string }> {
    try {
      if (!this.isReady()) {
        await this.initialize();
      }

      if (!this.transporter) {
        throw new Error("SMTP transporter not configured");
      }

      await this.transporter.verify();
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error occurred",
      };
    }
  }
}

export const smtpEmailService = new SMTPEmailService();

export async function sendContactFormEmailSMTP(
  formData: ContactFormData,
  metadata?: { userIP?: string; userAgent?: string }
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  return smtpEmailService.sendContactEmail(formData, metadata);
}
\`\`\`

### **Step 4: Gmail Setup for SMTP**

#### **Enable 2-Factor Authentication**
1. Go to [Google Account Settings](https://myaccount.google.com/)
2. Click "Security" → "2-Step Verification"
3. Follow setup process

#### **Generate App Password**
1. In Google Account Settings → Security → "2-Step Verification"
2. Scroll down to "App passwords"
3. Click "Generate app password"
4. Choose "Mail" as the app type
5. Copy the 16-character password

#### **Environment Variables**
\`\`\`env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-gmail@gmail.com
SMTP_PASS=your-16-character-app-password
\`\`\`

### **Step 5: Alternative SMTP Providers**

#### **SendGrid SMTP**
\`\`\`env
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=SG.your-sendgrid-api-key
\`\`\`

#### **Mailgun SMTP**
\`\`\`env
SMTP_HOST=smtp.mailgun.org
SMTP_PORT=587
SMTP_USER=postmaster@your-domain.mailgun.org
SMTP_PASS=your-mailgun-password
\`\`\`

#### **Outlook/Hotmail SMTP**
\`\`\`env
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-outlook@hotmail.com
SMTP_PASS=your-outlook-password
\`\`\`

## 🧪 **Testing SMTP**

### **Test Connection**
\`\`\`bash
curl http://localhost:3000/api/diagnostic
\`\`\`

### **Test Contact Form**
\`\`\`bash
curl -X POST http://localhost:3000/api/contact \\
  -H "Content-Type: application/json" \\
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "subject": "SMTP Test",
    "message": "Testing SMTP implementation"
  }'
\`\`\`

## 🚨 **Common SMTP Issues**

### **Issue 1: Connection Timeout**
**Cause**: Hosting provider blocks SMTP ports  
**Solution**: Upgrade to paid plan or use API-based email service

### **Issue 2: Authentication Failed**
**Cause**: Wrong credentials or 2FA not enabled  
**Solution**: Verify app password and enable 2FA

### **Issue 3: TLS/SSL Errors**
**Cause**: Incorrect port/security settings  
**Solution**: Try different port combinations:
- Port 587 with SMTP_SECURE=false
- Port 465 with SMTP_SECURE=true

## 📊 **SMTP vs API Comparison**

| Aspect | SMTP | API (Mailgun/SendGrid) |
|--------|------|------------------------|
| **Free Hosting Support** | ❌ Blocked | ✅ Works |
| **Setup Complexity** | Medium | Easy |
| **Deliverability** | Depends on provider | High |
| **Rate Limiting** | Manual | Built-in |
| **Cost** | Free (Gmail) | Free tier available |
| **Reliability** | Medium | High |

## 🎯 **Recommendations**

1. **For production sites**: Use API-based services (Mailgun, SendGrid)
2. **For paid hosting**: SMTP works well with Gmail
3. **For development**: Either works fine
4. **For free hosting**: Must use API-based services

## 🔧 **Switching Between SMTP and API**

To switch from API to SMTP:
1. Update environment variables to SMTP format
2. Change import in contact API: \`import { sendContactFormEmail } from '../../../lib/email-smtp'\`
3. Update diagnostic route to check SMTP variables

Both implementations can coexist in your codebase for maximum flexibility!