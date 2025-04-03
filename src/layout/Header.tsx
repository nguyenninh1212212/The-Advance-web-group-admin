import React from "react";
import { LayoutRouteProps } from "react-router-dom";
import { Link } from "react-router-dom";

import { useDispatch } from "react-redux";
import { setCategory } from "../redux/slices/categorySlice";
import { MdAdminPanelSettings } from "react-icons/md";

const Header: React.FC<LayoutRouteProps> = ({ children }) => {
  const dispatch = useDispatch();

  // Handle click outside to close the search results

  return (
    <div className="flex flex-row min-h-screen overflow-auto scrollbar-hide text-white">
      {/* Navbar cố định */}
      <header className="fixed  flex-col w-1/6 h-screen bg-gray-800 flex  z-50 border-r  pb-1 border-primary-200 justify-between">
        <div className=" w-full h-[70px] flex justify-center items-center p-3">
          {/* Logo */}
          <Link
            to="/"
            className="w-fit flex items-center text-white font-bold gap-2"
            onClick={() => dispatch(setCategory("Home"))}
          >
            <MdAdminPanelSettings className="text-5xl" />
            <p className="font-semibold font-sans md:text-3xl whitespace-nowrap">
              ADMIN-TBC
            </p>
          </Link>
        </div>
        <div className=" w-full h-full flex flex-col p-3"></div>
      </header>

      {/* Phần nội dung chính */}
      <main className="flex-grow pt-24 px-4 md:max-w-[1200px] overflow-hidden w-screen mx-auto h-auto">
        {children}
      </main>

      {/* Footer cố định */}
    </div>
  );
};

export default Header;
