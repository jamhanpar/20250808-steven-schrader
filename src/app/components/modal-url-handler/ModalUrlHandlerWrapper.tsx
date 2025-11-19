"use client";

import { Suspense } from "react";
import { ModalUrlHandler } from "./ModalUrlHandler";

export function ModalUrlHandlerWrapper() {
  return (
    <Suspense fallback={null}>
      <ModalUrlHandler />
    </Suspense>
  );
}
