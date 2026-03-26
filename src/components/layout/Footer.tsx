import React from "react";
import {
  FaFacebookF,
  FaTwitter,
  FaLinkedinIn,
  FaInstagram,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-[#215988] text-white py-12 px-6 sm:px-12 md:px-20">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between gap-12">
        {/* Column 1: Logo & Tagline */}
        <div className="flex flex-col items-start gap-4">
          <img
            src="/images/logo.png"
            alt="Prosperity Tech Logo"
            className="w-28 sm:w-36 object-contain"
          />
          <p className="text-sm sm:text-base text-white/80 max-w-xs">
            Empowering business communications with innovative solutions.
          </p>

          {/* Social Icons */}
          <div className="flex gap-4 mt-2">
            <a href="#" className="hover:text-[#2bb673] transition-colors">
              <FaFacebookF />
            </a>
            <a href="#" className="hover:text-[#2bb673] transition-colors">
              <FaTwitter />
            </a>
            <a href="#" className="hover:text-[#2bb673] transition-colors">
              <FaLinkedinIn />
            </a>
            <a href="#" className="hover:text-[#2bb673] transition-colors">
              <FaInstagram />
            </a>
          </div>
        </div>

        {/* Column 2: Quick Links */}
        {/* <div className="flex flex-col gap-3">
          <h3 className="font-semibold text-base sm:text-lg mb-3">Quick Links</h3>
          <ul className="flex flex-col gap-2 text-sm sm:text-base">
            <li>
              <a href="/" className="hover:text-[#2bb673] transition-colors">Home</a>
            </li>
            <li>
              <a href="/about" className="hover:text-[#2bb673] transition-colors">About</a>
            </li>
            <li>
              <a href="/services" className="hover:text-[#2bb673] transition-colors">Services</a>
            </li>
            <li>
              <a href="/support" className="hover:text-[#2bb673] transition-colors">Support</a>
            </li>
            <li>
              <a href="/partners" className="hover:text-[#2bb673] transition-colors">Partners</a>
            </li>
          </ul>
        </div> */}

        {/* Column 3: Contact Info */}
        {/* <div className="flex flex-col gap-2">
          <h3 className="font-semibold text-base sm:text-lg mb-3">Contact Us</h3>
          <p className="text-sm sm:text-base flex items-center gap-2">
            📞 <span>+0184185935</span>
          </p>
          <p className="text-sm sm:text-base flex items-center gap-2">
            ✉️ <span>prosperitytech@gmail.com</span>
          </p>
          <p className="text-sm sm:text-base mt-2 text-white/70">
            123 Prosperity Avenue, Business City
          </p>
        </div> */}
        <div className="flex flex-col gap-2">
          <h3 className="font-semibold text-base sm:text-lg mb-3">
            Contact Us
          </h3>
          <p className="text-sm sm:text-base flex items-center gap-2">
            📞 <span>08 8520 6215</span>
          </p>
          <p className="text-sm sm:text-base flex items-center gap-2">
            ✉️ <span>support@prosperitytech.solutions</span>
          </p>
          <p className="text-sm sm:text-base mt-2 text-white/70">
            Suite 2, 15 Adelaide Rd, Gawler South SA 5118
          </p>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="mt-10 border-t border-white/30 pt-6 text-center text-sm sm:text-base text-white/70">
        &copy; {new Date().getFullYear()} Prosperity Tech Solutions. All rights
        reserved.
      </div>
    </footer>
  );
};

export default Footer;
