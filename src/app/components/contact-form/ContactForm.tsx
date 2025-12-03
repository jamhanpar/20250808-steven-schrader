"use client";

import { useState, FormEvent } from "react";
import { motion } from "framer-motion";
import clsx from "clsx";
import "./ContactForm.css";

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface ContactFormProps {
  onSubmit?: (data: ContactFormData) => void | Promise<void>;
  onClose?: () => void;
  className?: string;
}

export default function ContactForm({
  onSubmit,
  onClose,
  className = "",
}: ContactFormProps) {
  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    email: "",
    subject: "Message from my website",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error message when user starts typing again
    if (submitStatus === "error" && errorMessage) {
      setErrorMessage("");
      setSubmitStatus("idle");
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus("idle");
    setErrorMessage("");

    try {
      if (onSubmit) {
        await onSubmit(formData);
      }

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setSubmitStatus("success");

      // Reset form after success
      setTimeout(() => {
        setFormData({
          name: "",
          email: "",
          subject: "Message from my website",
          message: "",
        });
        setSubmitStatus("idle");
        setErrorMessage("");
        if (onClose) {
          onClose();
        }
      }, 2000);
    } catch (error) {
      console.error("Error submitting form:", error);
      setSubmitStatus("error");

      // Extract error message from the error object
      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else if (typeof error === "string") {
        setErrorMessage(error);
      } else {
        setErrorMessage(
          "Something went wrong. Please try again or email me directly."
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid =
    formData.name && formData.email && formData.subject && formData.message;

  return (
    <motion.div
      className={clsx("contact-form", className)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="contact-form__header">
        <h2 className="contact-form__title">Get in touch</h2>
        <p className="contact-form__description">
          Have a question? I&apos;d love to hear from you.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="contact-form__form">
        <div className="contact-form__row">
          <div className="contact-form__field">
            <label htmlFor="name" className="contact-form__label">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="contact-form__input"
              placeholder="Your full name"
              required
            />
          </div>

          <div className="contact-form__field">
            <label htmlFor="email" className="contact-form__label">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="contact-form__input"
              placeholder="Your email address"
              required
            />
          </div>
        </div>

        {/* <div className="contact-form__field">
          <label htmlFor="subject" className="contact-form__label">
            Subject
          </label>
          <input
            type="text"
            id="subject"
            name="subject"
            value={formData.subject}
            onChange={handleInputChange}
            className="contact-form__input"
            placeholder="What's this about?"
            required
          />
        </div> */}

        <div className="contact-form__field">
          <label htmlFor="message" className="contact-form__label">
            Message
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleInputChange}
            className="contact-form__textarea"
            placeholder="Tell me more..."
            rows={6}
            required
          />
        </div>

        {/* Error Message */}
        {submitStatus === "error" && (
          <motion.div
            className="contact-form__error"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {errorMessage ||
              "Something went wrong. Please try again or email me directly."}
          </motion.div>
        )}

        <div className="contact-form__actions">
          <button
            type="submit"
            disabled={!isFormValid || isSubmitting}
            className={clsx("contact-form__submit", {
              "contact-form__submit--loading": isSubmitting,
              "contact-form__submit--success": submitStatus === "success",
              "contact-form__submit--error": submitStatus === "error",
            })}
          >
            {isSubmitting && (
              <motion.div
                className="contact-form__spinner"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
            )}

            {submitStatus === "success" && (
              <svg
                className="contact-form__icon"
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
              >
                <path
                  d="M16.25 6.25L8.125 14.375L3.75 10"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}

            <span>
              {isSubmitting
                ? "Sending..."
                : submitStatus === "success"
                ? "Message Sent!"
                : submitStatus === "error"
                ? "Try Again"
                : "Send Message"}
            </span>
          </button>
        </div>

        {submitStatus === "success" && (
          <motion.div
            className="contact-form__success"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            Thank you! I&apos;ll get back to you as soon as possible.
          </motion.div>
        )}
      </form>
    </motion.div>
  );
}
