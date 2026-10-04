"use client";

import React, { useState, useEffect } from "react";
import DemoModal from "./DemoModal";

export default function GlobalDemoModalWrapper() {
  const [isOpen, setIsOpen] = useState(false);
  const [defaultRole, setDefaultRole] = useState("PG / Hostel Owner");

  useEffect(() => {
    const handleOpen = (e: any) => {
      if (e.detail?.role) {
        setDefaultRole(e.detail.role);
      }
      setIsOpen(true);
    };

    window.addEventListener("open-demo-modal", handleOpen);
    return () => window.removeEventListener("open-demo-modal", handleOpen);
  }, []);

  return (
    <DemoModal
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      defaultRole={defaultRole}
    />
  );
}
