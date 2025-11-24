"use client";

import React, { createContext, useContext } from "react";
import { useModal } from "../../hooks/useModal";
import Modal from "../modal/Modal";
import ContactForm from "../contact-form/ContactForm";
import ChatButton from "../chat-button/ChatButton";
import type {
  ContactFormData,
  ContactApiResponse,
  ContactApiError,
} from "../../../types/api";

interface ContactModalContextType {
  openContactModal: () => void;
}

const ContactModalContext = createContext<ContactModalContextType | undefined>(
  undefined
);

export const useContactModal = () => {
  const context = useContext(ContactModalContext);
  if (!context) {
    throw new Error("useContactModal must be used within ContactModalProvider");
  }
  return context;
};

interface ContactModalProviderProps {
  children?: React.ReactNode;
}

export default function ContactModalProvider({
  children,
}: ContactModalProviderProps) {
  const [modalState, modalControls] = useModal();

  /**
   * Submit contact form data to API
   */
  const submitContactForm = async (data: ContactFormData): Promise<void> => {
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        // Try to parse error response
        let errorMessage = "Failed to send message. Please try again.";

        try {
          const errorData: ContactApiError = await response.json();
          errorMessage = errorData.message || errorMessage;

          // Handle specific error cases
          if (errorData.code === "RATE_LIMIT_EXCEEDED") {
            errorMessage = errorData.message;
          } else if (errorData.code === "VALIDATION_ERROR") {
            errorMessage = "Please check your form data and try again.";
          }
        } catch {
          // If we can't parse the error, use a generic message
          if (response.status === 429) {
            errorMessage =
              "Too many requests. Please wait a moment and try again.";
          } else if (response.status === 500) {
            errorMessage = "Server error. Please try again later.";
          }
        }

        throw new Error(errorMessage);
      }

      // Success - parse response
      const result: ContactApiResponse = await response.json();

      if (!result.success) {
        throw new Error(result.message || "Unknown error occurred");
      }

      // Success case - the ContactForm component will handle success UI
      console.log("✅ Contact form submitted successfully");
    } catch (error) {
      console.error("❌ Contact form submission error:", error);

      // Re-throw the error so ContactForm can handle it
      throw error;
    }
  };

  const openContactModal = () => {
    modalControls.openModal({
      title: "",
      content: (
        <ContactForm
          onSubmit={submitContactForm}
          onClose={modalControls.closeModal}
        />
      ),
      onClose: () => {
        console.log("Contact modal closed");
      },
    });
  };

  const handleChatButtonClick = () => {
    openContactModal();
  };

  const handleModalClose = () => {
    modalControls.closeModal();
  };

  return (
    <ContactModalContext.Provider value={{ openContactModal }}>
      {children}

      {/* Chat Button */}
      <ChatButton onClick={handleChatButtonClick} />

      {/* Modal */}
      <Modal
        isOpen={modalState.isOpen}
        title={modalState.title}
        onClose={handleModalClose}
        size="md"
        showCloseButton={true}
        closeOnOverlayClick={true}
        closeOnEscape={true}
      >
        {modalState.content}
      </Modal>
    </ContactModalContext.Provider>
  );
}
