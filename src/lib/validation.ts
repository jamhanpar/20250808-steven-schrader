import type { ContactFormData } from "../types/api";

/**
 * Validation error structure
 */
export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  sanitizedData?: ContactFormData;
}

/**
 * Sanitize HTML input to prevent XSS attacks
 */
export function sanitizeHtml(input: string): string {
  if (typeof input !== "string") return "";

  return input
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;");
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 254; // RFC 5322 limit
}

/**
 * Check for common spam indicators
 */
export function containsSpamIndicators(text: string): boolean {
  const spamPatterns = [
    /\b(viagra|cialis|casino|lottery|winner|congratulations)\b/i,
    /\b(click here|free money|earn \$|make money fast)\b/i,
    /\b(nigerian prince|inheritance|lottery winner)\b/i,
    /(http:\/\/|https:\/\/|www\.)/i, // URLs (simple check)
    /\b\d{10,}\b/, // Long numbers (potential phone/card numbers)
  ];

  return spamPatterns.some((pattern) => pattern.test(text));
}

/**
 * Validate individual fields
 */
export function validateField(field: string, value: string): ValidationError[] {
  const errors: ValidationError[] = [];

  switch (field) {
    case "name":
      if (!value || value.trim().length === 0) {
        errors.push({ field, message: "Name is required" });
      } else if (value.trim().length < 2) {
        errors.push({ field, message: "Name must be at least 2 characters" });
      } else if (value.trim().length > 100) {
        errors.push({
          field,
          message: "Name must be less than 100 characters",
        });
      } else if (!/^[a-zA-Z\s\-\.\']+$/.test(value.trim())) {
        errors.push({ field, message: "Name contains invalid characters" });
      } else if (containsSpamIndicators(value)) {
        errors.push({ field, message: "Name contains prohibited content" });
      }
      break;

    case "email":
      if (!value || value.trim().length === 0) {
        errors.push({ field, message: "Email is required" });
      } else if (!isValidEmail(value.trim())) {
        errors.push({ field, message: "Please enter a valid email address" });
      } else if (containsSpamIndicators(value)) {
        errors.push({ field, message: "Email contains prohibited content" });
      }
      break;

    case "subject":
      if (!value || value.trim().length === 0) {
        errors.push({ field, message: "Subject is required" });
      } else if (value.trim().length < 3) {
        errors.push({
          field,
          message: "Subject must be at least 3 characters",
        });
      } else if (value.trim().length > 200) {
        errors.push({
          field,
          message: "Subject must be less than 200 characters",
        });
      } else if (containsSpamIndicators(value)) {
        errors.push({ field, message: "Subject contains prohibited content" });
      }
      break;

    case "message":
      if (!value || value.trim().length === 0) {
        errors.push({ field, message: "Message is required" });
      } else if (value.trim().length < 10) {
        errors.push({
          field,
          message: "Message must be at least 10 characters",
        });
      } else if (value.trim().length > 5000) {
        errors.push({
          field,
          message: "Message must be less than 5000 characters",
        });
      } else if (containsSpamIndicators(value)) {
        errors.push({ field, message: "Message contains prohibited content" });
      }
      break;

    default:
      errors.push({ field, message: `Unknown field: ${field}` });
  }

  return errors;
}

/**
 * Comprehensive validation of contact form data
 */
export function validateContactForm(data: unknown): ValidationResult {
  // Type guard to ensure data has the expected structure
  if (!data || typeof data !== "object") {
    return {
      isValid: false,
      errors: [{ field: "form", message: "Invalid form data structure" }],
    };
  }

  const formData = data as Record<string, unknown>;
  const errors: ValidationError[] = [];

  // Check required fields exist
  const requiredFields = ["name", "email", "subject", "message"];
  for (const field of requiredFields) {
    if (!(field in formData)) {
      errors.push({ field, message: `${field} is required` });
    }
  }

  // Early return if structure is invalid
  if (errors.length > 0) {
    return { isValid: false, errors };
  }

  // Validate each field
  const fields = {
    name: String(formData.name || ""),
    email: String(formData.email || ""),
    subject: String(formData.subject || ""),
    message: String(formData.message || ""),
  };

  Object.entries(fields).forEach(([field, value]) => {
    const fieldErrors = validateField(field, value);
    errors.push(...fieldErrors);
  });

  // If validation passed, return sanitized data
  if (errors.length === 0) {
    const sanitizedData: ContactFormData = {
      name: sanitizeHtml(fields.name.trim()),
      email: fields.email.trim().toLowerCase(),
      subject: sanitizeHtml(fields.subject.trim()),
      message: sanitizeHtml(fields.message.trim()),
    };

    return {
      isValid: true,
      errors: [],
      sanitizedData,
    };
  }

  return {
    isValid: false,
    errors,
  };
}

/**
 * Additional security checks
 */
export function performSecurityChecks(data: ContactFormData): {
  passed: boolean;
  reason?: string;
} {
  // Check for excessive repetition (potential spam)
  const repeatPattern = /(.)\1{10,}/; // Same character repeated 10+ times
  if (repeatPattern.test(data.message) || repeatPattern.test(data.subject)) {
    return { passed: false, reason: "Excessive character repetition detected" };
  }

  // Check for excessive capitalization
  const capsRatio =
    (data.message.match(/[A-Z]/g) || []).length / data.message.length;
  if (capsRatio > 0.6 && data.message.length > 20) {
    return { passed: false, reason: "Excessive capitalization detected" };
  }

  // Check for common bot indicators
  const botIndicators = [
    /test\s*test\s*test/i,
    /asdf+/i,
    /qwerty+/i,
    /lorem ipsum/i,
    /hello world/i,
  ];

  for (const indicator of botIndicators) {
    if (indicator.test(data.message) || indicator.test(data.subject)) {
      return { passed: false, reason: "Bot-like content detected" };
    }
  }

  return { passed: true };
}

/**
 * Rate limiting for validation attempts (additional security layer)
 */
const validationAttempts = new Map<string, number[]>();

export function checkValidationRateLimit(ip: string): boolean {
  const now = Date.now();
  const windowMs = 60 * 1000; // 1 minute window
  const maxAttempts = 10; // Max 10 validation attempts per minute

  if (!validationAttempts.has(ip)) {
    validationAttempts.set(ip, []);
  }

  const attempts = validationAttempts.get(ip)!;

  // Remove old attempts
  const validAttempts = attempts.filter((time) => now - time < windowMs);

  if (validAttempts.length >= maxAttempts) {
    return false;
  }

  validAttempts.push(now);
  validationAttempts.set(ip, validAttempts);

  return true;
}
