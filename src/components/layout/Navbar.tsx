"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import logo from "../../../public/images/logo.png";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/reduxStore";
import { logout } from "@/reduxSlices/loginSlice";
import { Button } from "../Button";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { access_token } = useSelector((state: RootState) => state.login);

  useEffect(() => {
    setIsLoggedIn(!!access_token || !!localStorage.getItem("access_token"));
  }, [access_token]);

  useEffect(() => {
    const handleStorage = () => {
      setIsLoggedIn(!!localStorage.getItem("access_token"));
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const handleLogin = () => router.push("/login");

  const handleLogout = () => {
    localStorage.removeItem("persist:flywing-kiwi-root");
    localStorage.removeItem("access_token");
    dispatch(logout());
    setIsLoggedIn(false);
    router.push("/login");
  };

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Services", href: "/services" },
    { name: "Support", href: "/support" },
    { name: "Partners", href: "/partners" },
  ];

  return (
    <nav className="relative top-0 left-0 w-full z-60 bg-linear-to-r from-[#1d5e8e] to-[#145374] shadow-lg transition-all duration-300 p-5">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 sm:px-10 py-4 relative">
        {/* Desktop Links */}
        <div className="hidden lg:flex items-center space-x-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-white text-sm font-semibold tracking-wide transition-colors duration-300 relative ${
                pathname === link.href
                  ? "text-green-300"
                  : "hover:text-green-300"
              }`}
            >
              {link.name}
              <span
                className={`absolute left-0 -bottom-1 h-0.5 w-full bg-green-300 transition-all duration-300 ${
                  pathname === link.href
                    ? "scale-x-100"
                    : "scale-x-0 hover:scale-x-100"
                }`}
              ></span>
            </Link>
          ))}
        </div>

        {/* Logo */}
        <div className="absolute left-1/2 transform -translate-x-1/2">
          <Link href="/">
            <Image
              src={logo}
              alt="Prosperity Logo"
              width={90}
              height={90}
              priority
              className="object-contain"
            />
          </Link>
        </div>
        {!isLoggedIn ? (
          <Button variant="outline" size="md" onClick={handleLogin}>
            Login
          </Button>
        ) : (
          <Button variant="outline" size="md" onClick={handleLogout}>
            Logout
          </Button>
        )}

        {/* Mobile Menu Button */}
        <div className="lg:hidden z-50">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-white p-2 rounded-md hover:bg-white/20 transition"
          >
            {menuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile Menu */}
        <div
          className={`lg:hidden fixed top-0 left-0 w-full h-screen bg-[#1d5e8e]/95 backdrop-blur-sm flex flex-col items-center justify-center space-y-8 transform transition-transform duration-300 ${
            menuOpen ? "translate-y-0" : "-translate-y-full"
          }`}
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className={`text-white text-2xl font-semibold transition-colors duration-300 ${
                pathname === link.href
                  ? "text-green-300"
                  : "hover:text-green-300"
              }`}
            >
              {link.name}
            </Link>
          ))}
          {!isLoggedIn ? (
            <Button
              variant="gradient"
              size="md"
              className="w-full mt-2"
              onClick={handleLogin}
            >
              Login
            </Button>
          ) : (
            <Button
              variant="outline"
              size="md"
              className="w-full mt-2"
              onClick={handleLogout}
            >
              Logout
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
