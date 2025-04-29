import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { AiOutlineMenu, AiOutlineShoppingCart } from "react-icons/ai";
import { BsChevronDown } from "react-icons/bs";
import logo from "../../assets/Logo/Logo-Full-Light.png";
import { NavbarLinks } from "../../data/navbar-links";
import { apiConnector } from "../../services/apiconnector";
import { categories } from "../../services/apis";
import { ACCOUNT_TYPE } from "../../utils/constants";
import ProfileDropdown from "../core/Auth/ProfileDropDown";
import ProgressBar from "./progressbar";

function Navbar() {
  const { token } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.profile);
  const { totalItems } = useSelector((state) => state.cart);
  const location = useLocation();
  const [subLinks, setSubLinks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        const res = await apiConnector("GET", categories.CATEGORIES_API);
        setSubLinks(res.data.data);
      } catch (error) {
        console.log("Could not fetch Categories.", error);
      }
      setLoading(false);
    };
    fetchCategories();
  }, []);

  const matchRoute = (route) => location.pathname === route;
  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);
  const closeMobileMenu = () => setMobileMenuOpen(false);
  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);
  const handleMouseEnter = () => setDropdownOpen(true);
  const handleMouseLeave = () => setDropdownOpen(false);

  return (
    <div className="navbarContainer sticky top-0 left-0 z-50">
      <div className="flex items-center justify-center bg-black">
        <div className="flex flex-col md:flex-row w-full max-w-maxContent items-center justify-between px-4 py-2">
          {/* Logo Section */}
          <div className="flex items-center justify-between w-full md:w-auto">
            <Link to="/" onClick={closeMobileMenu}>
              <img src={logo} alt="Logo" width={170} height={32} loading="lazy" />
            </Link>
            <button
              className="block md:hidden text-2xl text-white focus:outline-none"
              onClick={toggleMobileMenu}
            >
              {mobileMenuOpen ? "✖" : <AiOutlineMenu />}
            </button>
          </div>

          {/* Navbar Links */}
          <nav className={`${mobileMenuOpen ? "block" : "hidden"} md:block mt-4 md:mt-0`}>
            <ul className="flex flex-col md:flex-row w-full max-w-maxContent items-center justify-between px-4 py-2 gap-y-4 md:gap-y-0 md:gap-x-14">
              {NavbarLinks.map(({ title, path }, index) => (
                <li
                  key={index}
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                  className="mb-2 md:mb-0 transition duration-300 ease-in-out transform hover:text-gray-300 hover:scale-105 relative after:content-[''] after:absolute after:w-0 after:h-0.5 after:bg-gray-300 after:bottom-0 after:left-0 after:transition-all after:duration-700 after:ease-in-out hover:after:w-full"
                >
                  {title === "Catalog" ? (
                    <div
                      className={`group relative flex cursor-pointer items-center gap-1 ${
                        matchRoute("/catalog/:catalogName")
                          ? "text-gray-200"
                          : "text-white"
                      }`}
                      onClick={toggleDropdown}
                    >
                      <p>{title}</p>
                      <BsChevronDown />
                      {dropdownOpen && (
                        <div className="visible absolute left-[50%] top-[50%] z-[1000] flex w-[200px] translate-x-[-50%] translate-y-[3em] flex-col rounded-lg bg-white p-4 text-black opacity-100 transition-all duration-150 group-hover:translate-y-[1.65em] lg:w-[300px]">
                          <div className="absolute left-[50%] top-0 -z-10 h-6 w-6 translate-x-[80%] translate-y-[-40%] rotate-45 select-none rounded bg-white"></div>
                          {loading ? (
                            <p className="text-center">Loading...</p>
                          ) : subLinks.length ? (
                            subLinks
                              .filter((subLink) => subLink?.courses?.length > 0)
                              .map((subLink, i) => (
                                <Link
                                  to={`/catalog/${subLink.name.split(" ").join("-").toLowerCase()}`}
                                  className="rounded-lg bg-transparent py-4 pl-4 hover:bg-gray-200"
                                  key={i}
                                  onClick={toggleDropdown}
                                >
                                  <p>{subLink.name}</p>
                                </Link>
                              ))
                          ) : (
                            <p className="text-center">No Courses Found</p>
                          )}
                        </div>
                      )}
                    </div>
                  ) : (
                    <Link to={path} onClick={closeMobileMenu}>
                      <p
                        className={`${
                          matchRoute(path) ? "text-gray-200" : "text-white"
                        } hover:text-gray-300`}
                      >
                        {title}
                      </p>
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </nav>

          {/* Right Side (Login/Signup/Profile/Cart) */}
          <div className={`${mobileMenuOpen ? "block" : "hidden"} md:block mt-2 md:mt-0`}>
            <div className="flex flex-col items-center md:flex-row md:items-center justify-center md:justify-start gap-y-4 md:gap-y-0 gap-x-8">
              {user && user.accountType !== ACCOUNT_TYPE.INSTRUCTOR && (
                <Link to="/dashboard/cart" className="relative" onClick={closeMobileMenu}>
                  <AiOutlineShoppingCart className="text-2xl text-white" />
                  {totalItems > 0 && (
                    <span className="absolute -bottom-2 -right-2 grid h-5 w-5 place-items-center overflow-hidden rounded-full bg-gray-700 text-center text-xs font-bold text-white">
                      {totalItems}
                    </span>
                  )}
                </Link>
              )}
              {!token && (
                <div className="flex flex-col md:flex-row items-center md:items-start gap-y-4 md:gap-y-0 md:gap-x-4">
                  <Link to="/login" onClick={closeMobileMenu}>
                    <button className="rounded-md px-4 py-2 w-[90px] bg-white text-black hover:bg-gray-300">
                      Log In
                    </button>
                  </Link>
                  <Link to="/signup" onClick={closeMobileMenu}>
                    <button className="rounded-md px-4 py-2 w-[90px] bg-white text-black hover:bg-gray-300">
                      Sign Up
                    </button>
                  </Link>
                </div>
              )}
              {token && <ProfileDropdown />}
            </div>
          </div>
        </div>
      </div>
      <ProgressBar />
    </div>
  );
}

export default Navbar;
