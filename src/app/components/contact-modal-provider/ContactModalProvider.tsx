"use client";

import React, { createContext, useContext } from "react";
import { useModal } from "../../hooks/useModal";
import Modal from "../modal/Modal";
import ContactForm from "../contact-form/ContactForm";
import ChatButton from "../chat-button/ChatButton";

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

  const openContactModal = () => {
    modalControls.openModal({
      title: "",
      content: (
        <ContactForm
          onSubmit={async (data) => {
            console.log("Contact form submitted:", data);
            // Here you would typically send the data to your backend
            // Example: await fetch('/api/contact', { method: 'POST', body: JSON.stringify(data) })
          }}
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
