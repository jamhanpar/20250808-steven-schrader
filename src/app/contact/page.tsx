"use client";

import { useEffect } from "react";
import Loading from "../components/loading/Loading";
import { redirectToContact } from "../lib/redirect-utils";

export default function ContactPage() {
  useEffect(() => {
    // Redirect to home page with contact hash
    redirectToContact();
  }, []);

  return (
    <div className="flex items-center justify-center w-full h-full">
      <div className="text-center">
        <Loading size="lg" text={null} />
        <p className="text-sm text-white mt-6">
          If you&apos;re not redirected automatically,{" "}
          <button
            onClick={redirectToContact}
            className="underline text-blue-600 hover:text-blue-800 hover:cursor-pointer"
          >
            visit the home page
          </button>
        </p>
      </div>
    </div>
  );
}
