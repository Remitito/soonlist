"use client";

import React, { useState } from "react";
import LoginPopup from "./LoginPopup";
import { signOut } from "next-auth/react";
import { roboto } from "../fonts";
import Image from "next/image";
import { FaUser, FaSignOutAlt } from "react-icons/fa";

interface NavbarProps {
  loggedIn: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ loggedIn }) => {
  const [loginPopupIsOpen, setLoginPopupIsOpen] = useState(false);

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
            <button
              className="flex cursor-pointer items-center text-xs md:text-sm gap-2 bg-black/80 text-white px-4 py-2 rounded-lg shadow-md hover:bg-black transition duration-200"
              onClick={() => signOut()}
            >
              <FaSignOutAlt />
              Logout
            </button>
          ) : (
            <button
              className="flex items-center cursor-pointer gap-2 bg-black/80 text-white px-4 py-2 rounded-lg shadow-md hover:bg-black transition duration-200"
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
    </div>
  );
};

export default Navbar;
