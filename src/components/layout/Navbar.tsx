// "use client";
// import React, { useEffect, useState } from "react";
// import Image from "next/image";
// import Link from "next/link";
// import { Menu, X } from "lucide-react";
// import { usePathname, useRouter } from "next/navigation";
// import logo from "../../../public/images/logo.png";
// import { useDispatch, useSelector } from "react-redux";
// import { AppDispatch, RootState } from "@/store/reduxStore";
// import { logout } from "@/reduxSlices/loginSlice";
// import { Button } from "../Button";

// const Navbar = () => {
//   const [menuOpen, setMenuOpen] = useState(false);
//   const [showDeleteModal, setShowDeleteModal] = useState(false);
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const pathname = usePathname();
//   const router = useRouter();
//   const dispatch = useDispatch<AppDispatch>();
//   const { access_token } = useSelector((state: RootState) => state.login);

//   useEffect(() => {
//     setIsLoggedIn(!!access_token || !!localStorage.getItem("access_token"));
//   }, [access_token]);

//   useEffect(() => {
//     const handleStorage = () => {
//       setIsLoggedIn(!!localStorage.getItem("access_token"));
//     };
//     window.addEventListener("storage", handleStorage);
//     return () => window.removeEventListener("storage", handleStorage);
//   }, []);

//   const handleLogin = () => router.push("/login");

//   const handleLogout = () => {
//     localStorage.removeItem("persist:flywing-kiwi-root");
//     localStorage.removeItem("access_token");
//     dispatch(logout());
//     setIsLoggedIn(false);
//     router.push("/login");
//   };

//   const navLinks = [
//     { name: "Home", href: "/" },
//     { name: "About", href: "/about" },
//     { name: "Services", href: "/services" },
//     { name: "Support", href: "/support" },
//     { name: "Partners", href: "/partners" },
//   ];

//   return (
//     <nav className="relative top-0 left-0 w-full z-60 bg-linear-to-r from-[#1d5e8e] to-[#145374] shadow-lg transition-all duration-300 p-5">
//       <div className="max-w-7xl mx-auto flex items-center justify-between px-6 sm:px-10 py-4 relative">
//         {/* Desktop Links */}
//         <div className="hidden lg:flex items-center space-x-8">
//           {navLinks.map((link) => (
//             <Link
//               key={link.href}
//               href={link.href}
//               className={`text-white text-sm font-semibold tracking-wide transition-colors duration-300 relative ${
//                 pathname === link.href
//                   ? "text-green-300"
//                   : "hover:text-green-300"
//               }`}
//             >
//               {link.name}
//               <span
//                 className={`absolute left-0 -bottom-1 h-0.5 w-full bg-green-300 transition-all duration-300 ${
//                   pathname === link.href
//                     ? "scale-x-100"
//                     : "scale-x-0 hover:scale-x-100"
//                 }`}
//               ></span>
//             </Link>
//           ))}
//         </div>

//         {/* Logo */}
//         <div className="absolute left-1/2 transform -translate-x-1/2">
//           <Link href="/">
//             <Image
//               src={logo}
//               alt="Prosperity Logo"
//               width={90}
//               height={90}
//               priority
//               className="object-contain"
//             />
//           </Link>
//         </div>
//         {!isLoggedIn ? (
//           <Button variant="outline" size="md" onClick={handleLogin}>
//             Login
//           </Button>
//         ) : (
//           <Button variant="outline" size="md" onClick={handleLogout}>
//             Logout
//           </Button>
//         )}

//         {/* Mobile Menu Button */}
//         <div className="lg:hidden z-50">
//           <button
//             onClick={() => setMenuOpen(!menuOpen)}
//             className="text-white p-2 rounded-md hover:bg-white/20 transition"
//           >
//             {menuOpen ? <X size={28} /> : <Menu size={28} />}
//           </button>
//         </div>

//         {/* Mobile Menu */}
//         <div
//           className={`lg:hidden fixed top-0 left-0 w-full h-screen bg-[#1d5e8e]/95 backdrop-blur-sm flex flex-col items-center justify-center space-y-8 transform transition-transform duration-300 ${
//             menuOpen ? "translate-y-0" : "-translate-y-full"
//           }`}
//         >
//           {navLinks.map((link) => (
//             <Link
//               key={link.href}
//               href={link.href}
//               onClick={() => setMenuOpen(false)}
//               className={`text-white text-2xl font-semibold transition-colors duration-300 ${
//                 pathname === link.href
//                   ? "text-green-300"
//                   : "hover:text-green-300"
//               }`}
//             >
//               {link.name}
//             </Link>
//           ))}
//           {!isLoggedIn ? (
//             <Button
//               variant="gradient"
//               size="md"
//               className="w-full mt-2"
//               onClick={handleLogin}
//             >
//               Login
//             </Button>
//           ) : (
//             <Button
//               variant="outline"
//               size="md"
//               className="w-full mt-2"
//               onClick={handleLogout}
//             >
//               Logout
//             </Button>
//           )}
//         </div>
//       </div>
//     </nav>
//   );
// };

// export default Navbar;
"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X, Wifi, Loader2, AlertCircle, Phone } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import logo from "../../../public/images/logo.png";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/reduxStore";
import { logout } from "@/reduxSlices/loginSlice";
import { Button } from "../Button";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showUsageModal, setShowUsageModal] = useState(false);
  const [usageLoading, setUsageLoading] = useState(false);
  const [usageError, setUsageError] = useState("");
  const [usageData, setUsageData] = useState<any>(null);

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { access_token } = useSelector((state: RootState) => state.login);

  const token = access_token || localStorage.getItem("access_token");
  const custNo = localStorage.getItem("custNo") || "528031";

  useEffect(() => {
    setIsLoggedIn(!!token);
  }, [token]);

  // FlyingKiwi jaisa exact Check Usage with 3 APIs
  const checkUsage = async () => {
    if (!token) {
      setUsageError("Please login first.");
      return;
    }
    setUsageLoading(true);
    setUsageError("");
    setUsageData(null);

    try {
      const serviceRes = await fetch(
        `https://bele.omnisuiteai.com/api/v1/customers/${custNo}/services`,
        {
          headers: {
            accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const serviceData = await serviceRes.json();

      if (!serviceRes.ok || serviceData.status !== "success" || !serviceData.data?.services?.serviceDetails?.length) {
        setUsageError("You don't have an active plan yet. Please choose a plan first!");
        setUsageLoading(false);
        return;
      }

      const service = serviceData.data.services.serviceDetails[0];

      const [allowanceRes, unbilledRes] = await Promise.all([
        fetch(
          `https://bele.omnisuiteai.com/api/v1/customers/${custNo}/balance/mobile?lineSeqNo=${service.lineSeqNo}`,
          { headers: { Authorization: `Bearer ${token}` } }
        ),
        fetch(
          `https://bele.omnisuiteai.com/api/v1/customers/${custNo}/unbilled-summary`,
          { headers: { Authorization: `Bearer ${token}` } }
        ),
      ]);

      const allowanceData = await allowanceRes.json();
      const unbilledData = await unbilledRes.json();

      setUsageData({
        service,
        allowances: allowanceData.data?.queryItems || [],
        unbilled: unbilledData.data?.unbilledCallsSummary?.calls[0] || null,
      });
    } catch (err) {
      setUsageError("Failed to load usage. Please try again.");
    } finally {
      setUsageLoading(false);
    }
  };

  const handleCheckUsage = () => {
    setShowUsageModal(true);
    checkUsage();
  };

  const handleLogin = () => router.push("/login");

  const handleLogout = () => {
    localStorage.clear();
    dispatch(logout());
    setIsLoggedIn(false);
    router.push("/login");
  };

  const formatBytes = (bytes: number) => {
    if (!bytes) return "0 GB";
    return (bytes / (1024 * 1024 * 1024)).toFixed(2) + " GB";
  };

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Services", href: "/services" },
    { name: "Support", href: "/support" },
    { name: "Partners", href: "/partners" },
  ];

  return (
    <>
      <nav className="relative top-0 left-0 w-full z-60 bg-gradient-to-r from-[#1d5e8e] to-[#145374] shadow-lg p-5">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 sm:px-10 py-4 relative">

          {/* Desktop Links */}
          <div className="hidden lg:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-white text-sm font-semibold tracking-wide transition-colors duration-300 relative ${
                  pathname === link.href ? "text-green-300" : "hover:text-green-300"
                }`}
              >
                {link.name}
                <span className={`absolute left-0 -bottom-1 h-0.5 w-full bg-green-300 transition-all duration-300 ${
                  pathname === link.href ? "scale-x-100" : "scale-x-0 hover:scale-x-100"
                }`}></span>
              </Link>
            ))}
          </div>

          {/* Logo - Center */}
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

          {/* Right Side: Check Usage + Login/Logout */}
          <div className="flex items-center gap-4">
            {/* Check Usage Button - Shows before Login */}
            {isLoggedIn && (
              <Button
                variant="primary"
                size="md"
                onClick={handleCheckUsage}
                className="bg-green-500 hover:bg-green-600 text-white hidden sm:flex items-center gap-2"
              >
                Check Usage
              </Button>
            )}

            {!isLoggedIn ? (
              <Button variant="outline" size="md" onClick={handleLogin}>
                Login
              </Button>
            ) : (
              <Button variant="outline" size="md" onClick={handleLogout}>
                Logout
              </Button>
            )}
          </div>

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
          <div className={`lg:hidden fixed top-0 left-0 w-full h-screen bg-[#1d5e8e]/95 backdrop-blur-sm flex flex-col items-center justify-center space-y-8 transform transition-transform duration-300 ${
            menuOpen ? "translate-y-0" : "-translate-y-full"
          }`}>
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className={`text-white text-2xl font-semibold transition-colors duration-300 ${
                  pathname === link.href ? "text-green-300" : "hover:text-green-300"
                }`}
              >
                {link.name}
              </Link>
            ))}

            {isLoggedIn && (
              <Button
                variant="primary"
                size="lg"
                onClick={() => {
                  handleCheckUsage();
                  setMenuOpen(false);
                }}
                className="bg-green-500 hover:bg-green-600 w-full max-w-xs"
              >
                Check Usage
              </Button>
            )}

            {!isLoggedIn ? (
              <Button variant="gradient" size="lg" className="w-full max-w-xs" onClick={handleLogin}>
                Login
              </Button>
            ) : (
              <Button variant="outline" size="lg" className="w-full max-w-xs" onClick={handleLogout}>
                Logout
              </Button>
            )}
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {showUsageModal && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 mt-44 mb-24 lg:mb-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowUsageModal(false)}
          >
            <motion.div
              className="bg-white rounded-3xl shadow-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              initial={{ scale: 0.9, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl md:text-3xl font-bold flex items-center gap-3 text-gray-800">
                  <Wifi className="text-green-600" /> My Usage
                </h2>
                <button onClick={() => setShowUsageModal(false)} className="text-gray-500 hover:text-gray-700">
                  <X size={28} />
                </button>
              </div>

              {usageLoading && (
                <div className="text-center py-16">
                  <Loader2 className="w-16 h-16 animate-spin text-green-600 mx-auto mb-4" />
                  <p className="text-lg">Loading your usage...</p>
                </div>
              )}

              {usageError && !usageData && (
                <div className="text-center py-16 bg-red-50 rounded-3xl border-2 border-red-200">
                  <AlertCircle className="w-20hhh-20 text-red-500 mx-auto mb-4" />
                  <p className="text-xl font-bold text-red-800">{usageError}</p>
                  {usageError.includes("plan") && (
                    <Button variant="gradient" className="mt-6" onClick={() => router.push("/chat-window?fromBanner=true")}>
                      Choose a Plan Now
                    </Button>
                  )}
                </div>
              )}

              {usageData && (
                <div className="space-y-8">
                  <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-3xl p-8 border-2 border-indigo-200 text-gray-500">
                    <div className="flex items-center gap-4">
                      <Phone className="text-indigo-600" size={32} />
                      <div>
                        <h3 className="text-lg md:text-2xl font-bold text-indigo-800">{usageData.service.planName}</h3>
                        <p className="text-gray-700">{usageData.service.name}</p>
                        <p className="text-md md:text-lg font-semibold mt-2">{usageData.service.csn}</p>
                      </div>
                    </div>
                  </div>

                  {/* Data Usage */}
                  <div>
                    <h3 className="text-2xl font-bold mb-6 flex items-center gap-3 text-black">
                      <Wifi className="text-green-600" size={32} /> Data Usage
                    </h3>
                    {usageData.allowances
                      .filter((a: any) => a.unitCode === "Data" && a.creditValue > 0 && (a.accountDesc || "").toLowerCase().includes("plan"))
                      .map((item: any, i: number) => {
                        const match = item.accountDesc.match(/(\d+)GB/);
                        const totalGB = match ? parseFloat(match[1]) : 0;
                        const remainingGB = parseFloat(formatBytes(item.creditValue).replace(" GB", ""));
                        const usedGB = totalGB - remainingGB;

                        return (
                          <div key={i} className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-3xl p-8 border-2 border-green-300 mb-6 shadow-lg">
                            <p className="text-md md:text-xl font-bold text-gray-800 mb-4">
                              {item.accountDesc.replace("post-paid plan", "").trim()}
                            </p>
                            <div className="flex justify-between items-baseline mb-4">
                              <span className="text-sm md:text-2xl lg:text-4xl font-extrabold text-green-700">{remainingGB.toFixed(2)} GB</span>
                              <span className="text-xs md:text-2xl lg:text-3xl text-gray-600">/ {totalGB.toFixed(2)} GB</span>
                            </div>
                            <div className="w-full bg-gray-300 rounded-full h-3 overflow-hidden mb-4">
                              <div
                                className="h-full from-green-600 to-emerald-600 relative overflow-hidden"
                                style={{ width: `${(remainingGB / totalGB) * 100}%` }}
                              >
                                <div className="absolute inset-0 bg-white opacity-20 animate-pulse"></div>
                              </div>
                            </div>
                            <div className="flex justify-between text-xs md:text-sm lg:text-md text-black">
                              <span>Used: <strong className="text-red-600">{usedGB.toFixed(2)} GB</strong></span>
                              <span>Expires: <strong>{item.expDate ? new Date(item.expDate).toLocaleDateString("en-AU") : "Never"}</strong></span>
                            </div>
                          </div>
                        );
                      })}
                  </div>

                  {usageData.unbilled && (
                    <div className="bg-orange-50 rounded-3xl p-8 border-2 border-orange-300 text-center">
                      <p className="text-md md:text-xl text-gray-700 mb-2">Current Unbilled Amount</p>
                      <p className="text-md md:text-2xl font-bold text-orange-600">
                        ${parseFloat(usageData.unbilled.totalCharge).toFixed(2)}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;