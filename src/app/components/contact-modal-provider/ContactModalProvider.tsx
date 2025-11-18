"use client";

import { useModal } from "../../hooks/useModal";
import Modal from "../modal/Modal";
import ContactForm from "../contact-form/ContactForm";
import ChatButton from "../chat-button/ChatButton";

interface ContactModalProviderProps {
  children?: React.ReactNode;
}

export default function ContactModalProvider({
  children,
}: ContactModalProviderProps) {
  const [modalState, modalControls] = useModal();

  const handleChatButtonClick = () => {
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

  const handleModalClose = () => {
    modalControls.closeModal();
  };

  return (
    <>
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
    </>
  );
}
