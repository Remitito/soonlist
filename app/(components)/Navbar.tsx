"use client";

import React, { useState, useEffect, useRef } from "react";
import AccountManagement from "./ManageAccount";
import LoginPopup from "./LoginPopup";
import { signOut } from "next-auth/react";
import { roboto } from "../fonts";
import Image from "next/image";
import {
  FaUser,
  FaSignOutAlt,
  FaCog,
  FaChevronDown,
  FaTimes,
} from "react-icons/fa";

interface NavbarProps {
  loggedIn: boolean;
  email: string;
}

const Navbar: React.FC<NavbarProps> = ({ loggedIn, email }) => {
  const [loginPopupIsOpen, setLoginPopupIsOpen] = useState(false);
  const [manageIsOpen, setManageIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };

    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownOpen]);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <div
      className="w-full h-60 px-8 flex items-center justify-center relative bg-cover bg-center bg-[url('/backgroundMobile.webp')]
    md:bg-[url('/background.webp')]"
    >
      <div className="absolute inset-0 bg-black opacity-20 z-0" />

      <div className="relative h-full z-40 w-full flex justify-between items-center">
        <div className="flex flex-col items-center">
          <div className="flex flex-row text-center items-center gap-2">
            <h1
              className={`${roboto.className} text-white underline text-2xl sm:text-4xl md:text-5xl font-bold`}
            >
              DEADLINE DESK
            </h1>
            <Image
              alt="Deadline Desk Logo"
              src="/soonlist.png"
              className="md:flex hidden"
              height={60}
              width={60}
            />
          </div>
          <h2 className=" text-[14px] md:text-[20px] font-light text-gray-200 ">
            Only the reminders you need
          </h2>
          <Image
            alt="Deadline Desk Logo"
            src="/soonlist.png"
            className="mt-2 flex md:hidden"
            height={40}
            width={40}
          />
        </div>
        <div className="h-full flex md:items-start items-start mt-10  md:mt-20">
          {loggedIn ? (
            <div className="relative group" ref={dropdownRef}>
              <button
                className="flex cursor-pointer items-center text-xs md:text-sm gap-2 bg-black/80 text-white px-4 py-2 rounded-lg shadow-md hover:bg-black transition duration-200"
                onClick={toggleDropdown}
              >
                <FaUser />
                Account
                {dropdownOpen ? (
                  <FaTimes className="text-xs" />
                ) : (
                  <FaChevronDown className="text-xs" />
                )}
              </button>

              {/* Desktop: hover behavior, Mobile: click behavior */}
              <div
                className={`absolute right-0 mt-1 w-48 bg-black/90 backdrop-blur-sm text-white rounded-lg shadow-lg transition-all duration-200 z-50
                md:opacity-0 md:invisible md:group-hover:opacity-100 md:group-hover:visible
                ${
                  dropdownOpen
                    ? "opacity-100 visible"
                    : "opacity-0 invisible md:opacity-0 md:invisible"
                }
              `}
              >
                <div className="py-2">
                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      setManageIsOpen(true);
                    }}
                    className="flex w-full items-center gap-3 px-4 py-2 text-sm hover:bg-white/10 transition duration-150"
                  >
                    <FaCog />
                    Manage
                  </button>
                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      signOut();
                    }}
                    className="flex w-full items-center gap-3 px-4 py-2 text-sm hover:bg-white/10 transition duration-150"
                  >
                    <FaSignOutAlt />
                    Logout
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <button
              className="flex items-center cursor-pointer gap-2 bg-black/80 text-white px-4 py-2 rounded-lg shadow-md hover:bg-black transition duration-150"
              onClick={() => setLoginPopupIsOpen(true)}
            >
              <FaUser />
              Login
            </button>
          )}
        </div>
      </div>

      <LoginPopup
        loginPopupIsOpen={loginPopupIsOpen}
        onClose={() => setLoginPopupIsOpen(false)}
      />
      <AccountManagement
        isOpen={manageIsOpen}
        setManageIsOpen={setManageIsOpen}
        userEmail={email}
      />
    </div>
  );
};

export default Navbar;
