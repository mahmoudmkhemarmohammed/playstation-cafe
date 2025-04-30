import { logOut } from "@store/auth/authSlice";
import { useAppDispatch } from "@store/hooks";
import { useEffect, useState } from "react";
import { HiHeart } from "react-icons/hi";
import { IoIosLogOut, IoMdClose } from "react-icons/io";
import { NavLink, useLocation } from "react-router-dom";
import { HiMiniBars3BottomLeft } from "react-icons/hi2";

const Header = () => {
  const [nav, setNav] = useState(false);
  const dispatch = useAppDispatch();

  const { pathname } = useLocation();

  useEffect(() => {
    setNav(false);
  }, [pathname]);

  return (
    <header className="bg-white shadow p-3.5 h-24 sticky top-0">
      <div className="container h-full flex justify-between items-center">
        <div className="logo">
          <NavLink to={"/home"}>
            <h1 className="text-xl font-bold flex flex-col-reverse items-center">
              VIP <HiHeart className="text-red-500" size={35} />
            </h1>
          </NavLink>
        </div>

        <ul
          className={`flex justify-between gap-3 text-xl max-lg:fixed max-lg:bg-white max-lg:w-full max-lg:h-full max-lg:justify-center max-lg:gap-20 ${
            nav ? "max-lg:-left-0" : "max-lg:-left-[100%]"
          } max-lg:top-24 max-lg:flex-col max-lg:items-center`}
        >
          <li>
            <NavLink to={"/home"}>الرئيسية</NavLink>
          </li>
          <li>
            <NavLink to={"/devices"}>الأجهزة</NavLink>
          </li>
          <li>
            <NavLink to={"/products"}>المنتجات</NavLink>
          </li>
          <li>
            <NavLink to={"/revenues"}>الإيرادات</NavLink>
          </li>
        </ul>
        {nav ? (
          <IoMdClose
            size={30}
            onClick={() => setNav(!nav)}
            className="hidden max-lg:block"
          />
        ) : (
          <HiMiniBars3BottomLeft
            size={30}
            onClick={() => setNav(!nav)}
            className="hidden max-lg:block"
          />
        )}
        <IoIosLogOut
          onClick={() => dispatch(logOut())}
          className="cursor-pointer"
          size={30}
        />
      </div>
    </header>
  );
};

export default Header;
