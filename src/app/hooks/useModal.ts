"use client";

import { useState, useCallback, ReactNode } from "react";

export interface ModalState {
  isOpen: boolean;
  title?: string;
  content?: ReactNode;
  onClose?: () => void;
}

export interface ModalControls {
  openModal: (config: Omit<ModalState, "isOpen">) => void;
  closeModal: () => void;
  updateContent: (content: ReactNode) => void;
  updateTitle: (title: string) => void;
}

export const useModal = (): [ModalState, ModalControls] => {
  const [modalState, setModalState] = useState<ModalState>({
    isOpen: false,
    title: "",
    content: null,
    onClose: undefined,
  });

  const openModal = useCallback((config: Omit<ModalState, "isOpen">) => {
    setModalState({
      isOpen: true,
      ...config,
    });
  }, []);

  const closeModal = useCallback(() => {
    setModalState((prev) => {
      // Call the custom onClose callback if provided
      if (prev.onClose) {
        prev.onClose();
      }

      return {
        ...prev,
        isOpen: false,
      };
    });
  }, []);

  const updateContent = useCallback((content: ReactNode) => {
    setModalState((prev) => ({
      ...prev,
      content,
    }));
  }, []);

  const updateTitle = useCallback((title: string) => {
    setModalState((prev) => ({
      ...prev,
      title,
    }));
  }, []);

  const controls: ModalControls = {
    openModal,
    closeModal,
    updateContent,
    updateTitle,
  };

  return [modalState, controls];
};
