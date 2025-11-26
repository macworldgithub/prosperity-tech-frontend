"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Menu,
  X,
  Wifi,
  Loader2,
  AlertCircle,
  Phone,
  Key,
  CheckCircle,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import logo from "../../../public/images/logo.png";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/reduxStore";
import { logout } from "@/reduxSlices/loginSlice";
import { Button } from "../Button";
import { motion, AnimatePresence } from "framer-motion";
import { FormInput } from "../../components/FormInput";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showUsageModal, setShowUsageModal] = useState(false);
  const [showChangePin, setShowChangePin] = useState(false);

  const [usageLoading, setUsageLoading] = useState(false);
  const [usageError, setUsageError] = useState("");
  const [usageData, setUsageData] = useState<any>(null);

  // Change PIN States
  const [oldPin, setOldPin] = useState("");
  const [newPin, setNewPin] = useState("");
  const [pinLoading, setPinLoading] = useState(false);
  const [pinStatus, setPinStatus] = useState<"idle" | "success" | "error">(
    "idle"
  );
  const [pinMessage, setPinMessage] = useState("");

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

  // === NEW: Exact Mobile App Logic for Data Usage ===
  const getPlanDataFromAllowances = (allowances: any[]) => {
    if (!allowances || allowances.length === 0) return null;

    for (let item of allowances) {
      if (item.unitCode === "Data" && item.accountDesc?.includes("Plan")) {
        const match = item.accountDesc.match(/(\d+)GB/);
        if (match) {
          const totalGB = parseFloat(match[1]);
          const remainingBytes = item.creditValue || 0;
          const remainingGB = remainingBytes / 1024 ** 3;
          const usedGB = Math.max(0, totalGB - remainingGB);
          const percentageUsed = totalGB > 0 ? (usedGB / totalGB) * 100 : 0;

          return {
            totalGB,
            usedGB: usedGB.toFixed(1),
            remainingGB: remainingGB.toFixed(1),
            percentageUsed: Math.round(percentageUsed),
            accountDesc: item.accountDesc,
            expDate: item.expDate,
          };
        }
      }
    }
    return null;
  };

  const getTotalRemainingDataGB = (allowances: any[]) => {
    if (!allowances) return "0.00";
    const totalBytes = allowances
      .filter((i) => i.unitCode === "Data")
      .reduce((sum, i) => sum + (i.creditValue || 0), 0);
    return (totalBytes / 1024 ** 3).toFixed(2);
  };

  // Replace "SimplyBig Unlimited" → "Just Mobile"
  const getDisplayServiceName = (name: string) => {
    if (name === "SimplyBig Unlimited") {
      return "Just Mobile";
    }
    return name || "N/A";
  };

  // === Updated Check Usage Function (Exact App Logic) ===
  const checkUsage = async () => {
    if (!token) {
      setUsageError("Please login first.");
      return;
    }

    setUsageLoading(true);
    setUsageError("");
    setUsageData(null);

    try {
      // Teen APIs ek saath call kar rahe hain
      const [serviceRes, mobileBalanceRes, unbilledRes] = await Promise.all([
        fetch(
          `https://prosperity.omnisuiteai.com/api/v1/customers/${custNo}/services`,
          {
            headers: {
              accept: "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        ),
        fetch(
          `https://prosperity.omnisuiteai.com/api/v1/customers/${custNo}/balance/mobile?lineSeqNo=1`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        ),
        fetch(
          `https://prosperity.omnisuiteai.com/api/v1/customers/${custNo}/unbilled-summary`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        ),
      ]);

      const serviceData = await serviceRes.json();
      const mobileBalanceData = await mobileBalanceRes.json();
      const unbilledData = await unbilledRes.json();

      // Agar service nahi hai toh error
      if (
        !serviceRes.ok ||
        serviceData.status !== "success" ||
        !serviceData.data?.services?.serviceDetails?.length
      ) {
        setUsageError(
          "You don't have an active plan yet. Please choose a plan first!"
        );
        setUsageLoading(false);
        return;
      }

      const service = serviceData.data.services.serviceDetails[0];
      const queryItems = mobileBalanceData.data?.queryItems || [];

      // Data usage calculation (exact mobile app jaisa)
      const planData = getPlanDataFromAllowances(queryItems);
      const totalRemainingDataGB = getTotalRemainingDataGB(queryItems);

      // Yeh line sabse important hai → unbilled data set ho raha hai
      setUsageData({
        service,
        planData,
        totalRemainingDataGB,
        unbilled: unbilledData.data?.unbilledCallsSummary?.calls?.[0] || null,
        rawAllowances: queryItems,
      });
    } catch (err) {
      console.error("Check Usage Error:", err);
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

  // Change PIN Handler (unchanged)
  const handleChangePin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!oldPin || !newPin || oldPin === newPin) {
      setPinStatus("error");
      setPinMessage("Old and new PIN must be different");
      return;
    }

    setPinLoading(true);
    setPinStatus("idle");

    try {
      const res = await fetch(
        "https://prosperity.omnisuiteai.com/auth/change-pin",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ oldPin, newPin }),
        }
      );

      const data = await res.json();

      if (res.ok) {
        setPinStatus("success");
        setPinMessage("PIN changed successfully!");
        setTimeout(() => {
          setShowChangePin(false);
          setOldPin("");
          setNewPin("");
          setPinStatus("idle");
        }, 2000);
      } else {
        setPinStatus("error");
        setPinMessage(data.message || "Failed to change PIN");
      }
    } catch (err) {
      setPinStatus("error");
      setPinMessage("Network error. Try again.");
    } finally {
      setPinLoading(false);
    }
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
      <nav className="relative top-0 left-0 w-full z-60  from-[#1d5e8e] to-[#145374] shadow-lg p-5">
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
          {/* Right Side - Clean & Responsive */}
          <div className="flex items-center gap-4">
            {isLoggedIn && (
              <div className="hidden lg:flex items-center gap-3">
                <Button
                  variant="primary"
                  size="md"
                  onClick={handleCheckUsage}
                  className="bg-green-500 hover:bg-green-600 text-white flex items-center gap-2 whitespace-nowrap"
                >
                  Check Usage
                </Button>

                <Button
                  variant="primary"
                  size="md"
                  onClick={() => setShowChangePin(true)}
                  className="bg-green-500 hover:bg-green-700 text-white flex items-center gap-2 whitespace-nowrap"
                >
                  Change PIN
                </Button>
              </div>
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

            {isLoggedIn && (
              <>
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

                <Button
                  variant="primary"
                  size="lg"
                  onClick={() => {
                    setShowChangePin(true);
                    setMenuOpen(false);
                  }}
                  className="bg-green-500 hover:bg-green-700 w-full max-w-xs flex items-center justify-center gap-3"
                >
                  Change PIN
                </Button>
              </>
            )}

            {!isLoggedIn ? (
              <Button
                variant="gradient"
                size="lg"
                className="w-full max-w-xs"
                onClick={handleLogin}
              >
                Login
              </Button>
            ) : (
              <Button
                variant="outline"
                size="lg"
                className="w-full max-w-xs"
                onClick={handleLogout}
              >
                Logout
              </Button>
            )}
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {showUsageModal && (
          <motion.div
            className="inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowUsageModal(false)}
          >
            <motion.div
              className="bg-white rounded-3xl shadow-2xl p-8 max-w-2xl w-full max-h-[85vh] overflow-y-auto"
              initial={{ scale: 0.9, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 50 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
                  My Usage
                </h2>
                <button onClick={() => setShowUsageModal(false)}>
                  <X size={28} className="text-gray-500" />
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
                  <AlertCircle className="w-20 h-20 text-red-500 mx-auto mb-4" />
                  <p className="text-xl font-bold text-red-600">{usageError}</p>
                  {usageError.includes("plan") && (
                    <Button
                      variant="gradient"
                      className="mt-6"
                      onClick={() =>
                        router.push("/chat-window?fromBanner=true")
                      }
                    >
                      Choose a Plan Now
                    </Button>
                  )}
                </div>
              )}

              {usageData && (
                <div className="space-y-8">
                  <div className=" from-blue-50 to-indigo-50 rounded-3xl p-8 border-2 border-blue-200">
                    <h3 className="text-xl font-bold mb-4 text-indigo-800">
                      Current Plan
                    </h3>
                    <div className="space-y-3 text-gray-700">
                      <p>
                        <span className="font-semibold">Plan Name:</span>{" "}
                        {usageData.service.planName || "N/A"}
                      </p>
                      <p>
                        <span className="font-semibold">Service:</span>{" "}
                        {getDisplayServiceName(usageData.service.name)}
                      </p>
                      <p>
                        <span className="font-semibold">CSN:</span>{" "}
                        {usageData.service.csn || "N/A"}
                      </p>
                    </div>
                  </div>
                  <div className="from-emerald-50 to-green-50 rounded-3xl p-8 border-2 border-emerald-300">
                    <h3 className="text-2xl font-bold mb-6 text-gray-800">
                      Data Usage
                    </h3>

                    {usageData?.planData ? (
                      (() => {
                        const total = Number(usageData.planData.totalGB) || 0;

                        const usedBytes =
                          Number(usageData.planData.usedBytes) || 0;

                        const usedGB = usedBytes / (1024 * 1024 * 1024);

                        const percentageUsed =
                          total > 0 ? (usedGB / total) * 100 : 0;
                        const remaining = total - usedGB;

                        return (
                          <>
                            <p className="text-2xl font-bold text-gray-800 mb-4">
                              This Month: {usedGB.toFixed(2)} / {total} GB
                            </p>

                            <div className="w-full bg-gray-200 rounded-full h-6 overflow-hidden mb-4 relative">
                              <motion.div
                                className="h-full  from-green-500 to-emerald-600"
                                initial={{ width: 0 }}
                                animate={{ width: `${percentageUsed}%` }}
                                transition={{ duration: 1 }}
                              >
                                <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                              </motion.div>
                            </div>

                            <div className="flex justify-between text-lg">
                              <span className="text-gray-600">
                                <strong className="text-red-600">
                                  {percentageUsed.toFixed(0)}%
                                </strong>{" "}
                                used
                              </span>
                              <span className="text-gray-600">
                                <strong className="text-green-600">
                                  {remaining.toFixed(2)} GB
                                </strong>{" "}
                                remaining
                              </span>
                            </div>
                          </>
                        );
                      })()
                    ) : (
                      <>
                        <p className="text-xl font-semibold text-gray-800 mb-4">
                          Remaining Data: {usageData.totalRemainingDataGB} GB
                        </p>
                        <div className="w-full bg-gray-300 rounded-full h-6 mb-2">
                          <div
                            className="h-full bg-gray-400 rounded-full"
                            style={{ width: "8%" }}
                          />
                        </div>
                        <p className="text-sm text-gray-500">
                          No active data plan detected
                        </p>
                      </>
                    )}
                  </div>

                  {usageData.unbilled && (
                    <div className="bg-orange-50 rounded-3xl p-8 border-2 border-orange-300 text-center">
                      <p className="text-md md:text-xl text-gray-700 mb-2">
                        Current Unbilled Amount
                      </p>
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

      <AnimatePresence>
        {showChangePin && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => !pinLoading && setShowChangePin(false)}
          >
            <motion.div
              className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md border border-gray-600"
              initial={{ scale: 0.9, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 50 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold flex items-center gap-3 text-gray-800">
                  Change PIN
                </h2>
                <button
                  onClick={() => setShowChangePin(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleChangePin} className="space-y-6">
                <FormInput
                  label="Current PIN"
                  type="password"
                  value={oldPin}
                  onChange={(e) => setOldPin(e.target.value)}
                  placeholder="••••"
                  maxLength={6}
                  required
                />
                <FormInput
                  label="New PIN"
                  type="password"
                  value={newPin}
                  onChange={(e) => setNewPin(e.target.value)}
                  placeholder="••••"
                  maxLength={6}
                  required
                />

                {pinStatus !== "idle" && (
                  <div
                    className={`flex items-center gap-3 p-4 rounded-lg border ${
                      pinStatus === "success"
                        ? "bg-green-50 border-green-300 text-green-800"
                        : "bg-red-50 border-red-300 text-red-800"
                    }`}
                  >
                    {pinStatus === "success" ? (
                      <CheckCircle size={22} />
                    ) : (
                      <AlertCircle size={22} />
                    )}
                    <p className="font-medium">{pinMessage}</p>
                  </div>
                )}

                <div className="flex gap-4 pt-4">
                  <Button
                    type="submit"
                    className="flex-1 text-lg bg-green-400 hover:bg-green-900"
                    disabled={
                      pinLoading || !oldPin || !newPin || oldPin === newPin
                    }
                  >
                    {pinLoading ? "Changing..." : "Change PIN"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowChangePin(false)}
                    disabled={pinLoading}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
