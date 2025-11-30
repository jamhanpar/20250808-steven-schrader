export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface ContactApiResponse {
  success: boolean;
  message: string;
  rateLimitInfo?: {
    remainingRequests: number;
    resetTime: number;
  };
}

export interface ContactApiError {
  success: false;
  message: string;
  code:
    | "VALIDATION_ERROR"
    | "RATE_LIMIT_EXCEEDED"
    | "EMAIL_FAILED"
    | "INTERNAL_ERROR";
  details?: Record<string, unknown>;
}
