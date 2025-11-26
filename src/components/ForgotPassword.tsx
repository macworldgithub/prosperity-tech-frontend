"use client";

import React, { useState } from "react";
import { Mail, X, CheckCircle, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/Button";
import { FormInput } from "@/components/FormInput";
import { motion } from "framer-motion";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      setStatus("error");
      setMessage("Please enter a valid email address");
      return;
    }

    setLoading(true);
    setStatus("idle");
    setMessage("");

    try {
      const res = await fetch(
        "https://prosperity.omnisuiteai.com/auth/forgot-pin",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            accept: "*/*",
          },
          body: JSON.stringify({
            identifier: email.trim(),
          }),
        }
      );

      const data = await res.json();

      // Agar backend error deta hai (jaise user not found)
      if (!res.ok) {
        setStatus("error");
        setMessage(data.message || "This email is not registered");
        return;
      }

      // Agar success hai, lekin message mein kuch suspicious hai (optional extra check)
      if (data.message && typeof data.message === "string") {
        const msg = data.message.toLowerCase();

        // Agar backend galat message deta hai jaise "user not found" but status 200
        if (
          msg.includes("not found") ||
          msg.includes("exist") ||
          msg.includes("invalid")
        ) {
          setStatus("error");
          setMessage("This email is not registered with us");
        } else {
          setStatus("success");
          setMessage("New PIN sent to your email!");
        }
      } else {
        // Default success (most likely real user)
        setStatus("success");
        setMessage("New PIN sent to your email!");
      }
    } catch (err) {
      setStatus("error");
      setMessage("Network error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Blur Background */}
      <motion.div
        className="fixed inset-0 bg-black/50 backdrop-blur-md z-40"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      />

      {/* Gradient Background */}
      <div className="fixed inset-0 z-30 from-[#16559] to-[#01a2ff] animate-gradient" />

      {/* Modal */}
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <div className="relative bg-white/10 backdrop-blur-2xl border border-white/20 rounded-2xl p-8 w-full max-w-md shadow-2xl">
          <button
            onClick={() => router.push("/")}
            className="absolute top-4 right-4 text-white/70 hover:text-white transition"
          >
            <X size={24} />
          </button>

          <h2 className="text-3xl font-bold text-white text-center mb-3">
            Forgot PIN
          </h2>
          <p className="text-white/70 text-center text-sm mb-8">
            Enter your registered email to receive a new PIN
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <FormInput
              label="Email Address"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setStatus("idle"); // Clear error on typing
              }}
              icon={<Mail size={18} color="white" />}
              required
            />

            {/* Success / Error Alert */}
            {status !== "idle" && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex items-center gap-3 p-4 rounded-lg border text-sm font-medium ${
                  status === "success"
                    ? "bg-green-500/20 border-green-500/50 text-green-100"
                    : "bg-red-500/20 border-red-500/50 text-red-100"
                }`}
              >
                {status === "success" ? (
                  <CheckCircle size={20} />
                ) : (
                  <AlertCircle size={20} />
                )}
                <span>{message}</span>
              </motion.div>
            )}

            <Button
              type="submit"
              className="w-full text-lg py-6 text-gray-800"
              disabled={loading || !email}
              variant="outline"
            >
              {loading ? "Sending..." : "Send New PIN"}
            </Button>

            <Button
              type="button"
              onClick={() => router.push("/login")}
              variant="ghost"
              className="w-full"
            >
              Back to Login
            </Button>
          </form>
        </div>
      </motion.div>
    </>
  );
}
