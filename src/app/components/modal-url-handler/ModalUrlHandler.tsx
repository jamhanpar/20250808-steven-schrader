"use client";

import { useEffect } from "react";
import { useContactModal } from "../contact-modal-provider/ContactModalProvider";

export function ModalUrlHandler() {
  const { openContactModal } = useContactModal();

  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === "#contact") {
        openContactModal();
        // Clean up the hash
        window.history.replaceState(
          null,
          "",
          window.location.pathname + window.location.search
        );
      }
    };

    // Check on mount
    if (window.location.hash === "#contact") {
      openContactModal();
      // Clean up the hash
      window.history.replaceState(
        null,
        "",
        window.location.pathname + window.location.search
      );
    }

    // Listen for hash changes
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, [openContactModal]);

  return null; // This component doesn't render anything
}
