"use client";

import LoginPopup from "@/app/(components)/LoginPopup";
import React, { useState } from "react";

const ClientDashboard = () => {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <div>
      <LoginPopup isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </div>
  );
};

export default ClientDashboard;
