"use client";
import React, { useState } from "react";
import LoginPopup from "./LoginPopup";

const Navbar = () => {
  const [loginPopupIsOpen, setLoginPopupIsOpen] = useState(false);

  return (
    <div>
      {loginPopupIsOpen ? (
        <button onClick={() => setLoginPopupIsOpen(true)}>Logout</button>
      ) : (
        <button onClick={() => setLoginPopupIsOpen(true)}>Login</button>
      )}
      <LoginPopup
        loginPopupIsOpen={loginPopupIsOpen}
        onClose={() => setLoginPopupIsOpen(false)}
      />
    </div>
  );
};

export default Navbar;
