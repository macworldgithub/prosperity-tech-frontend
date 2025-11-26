"use client";

import React, { useState } from "react";
import { Mail, KeyRound, X, AlertCircle } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { LoginApi } from "@/app/api/auth";
import { AppDispatch, RootState } from "@/store/reduxStore";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { setEmail, setPin } from "@/reduxSlices/loginSlice";
import { FormInput } from "./FormInput";
import { Button } from "./Button";

export const Login = () => {
  const [showLogin, setShowLogin] = useState(true);
  const [error, setError] = useState("");

  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const { email, pin, loading } = useSelector(
    (state: RootState) => state.login
  );

  const handleLogin = async () => {
    setError("");

    if (!email || !pin) {
      setError("Please enter both email and PIN");
      return;
    }

    try {
      const result = await dispatch(LoginApi()).unwrap(); // ← .unwrap() se actual result/error milega

      setShowLogin(false);
      router.push("/");
    } catch (err: any) {
      setError(err.message || "Invalid email or PIN. Please try again.");
    }
  };

  const handleClose = () => {
    setShowLogin(false);
    router.push("/");
  };

  return (
    <AnimatePresence>
      {showLogin && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-md z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          <div className="fixed inset-0 z-30 from-[#16559] to-[#01a2ff] animate-gradient" />
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
          >
            <div className="relative bg-white/10 backdrop-blur-2xl border border-white/20 rounded-2xl p-8 w-full max-w-md shadow-2xl">
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 text-white/70 hover:text-white transition"
              >
                <X size={24} />
              </button>

              <h2 className="text-3xl font-bold text-white text-center mb-6">
                Login
              </h2>

              <div className="space-y-5">
                <FormInput
                  label="Email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => dispatch(setEmail(e.target.value))}
                  icon={<Mail size={18} color="black" />}
                />

                <FormInput
                  label="PIN"
                  type="password"
                  placeholder="Enter your PIN"
                  value={pin}
                  onChange={(e) => dispatch(setPin(e.target.value))}
                  icon={<KeyRound size={18} color="black" />}
                  maxLength={6}
                />

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-3 p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-100"
                  >
                    <AlertCircle size={20} />
                    <p className="text-sm font-medium">{error}</p>
                  </motion.div>
                )}

                <div className="text-center">
                  <button
                    onClick={() => router.push("/ForgotPass")}
                    className="text-sm text-white/80 hover:text-white underline underline-offset-2 transition"
                  >
                    Forgot PIN?
                  </button>
                </div>

                <Button
                  className="w-full text-lg py-6"
                  onClick={handleLogin}
                  disabled={loading || !email || !pin}
                  variant="outline"
                >
                  {loading ? "Logging in..." : "Login"}
                </Button>

                <Button
                  className="w-full"
                  onClick={handleClose}
                  variant="outline"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Login;
