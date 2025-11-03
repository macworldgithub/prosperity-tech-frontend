"use client";

import { useState } from "react";

interface TokenCardProps {
  token: string;
  onSuccess: () => void;
}

export const TokenCard = ({ token, onSuccess }: TokenCardProps) => {
  const [inputToken, setInputToken] = useState(token);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(
        "https://bele.omnisuiteai.com/api/v1/payments/methods",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ custNo: "526691", paymentTokenId: inputToken }),
        }
      );

      const data = await response.json();
      if (!response.ok)
        throw new Error(data.message || "Failed to add payment method");

      alert("✅ Payment method added successfully!");
      onSuccess();
    } catch (error: any) {
      setMessage("❌ " + (error.message || "Something went wrong"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white/90 rounded-2xl p-3 w-full shadow-md">
      <h3 className="font-semibold mb-2 text-[#0E3B5C]">Enter Token</h3>
      <form onSubmit={handleSubmit} className="space-y-2">
        <input
          type="text"
          value={inputToken}
          onChange={(e) => setInputToken(e.target.value)}
          placeholder="Enter token"
          className="w-full border text-black border-gray-300 rounded-lg px-3 py-2"
        />
        <button
          type="submit"
          disabled={loading || !inputToken}
          className="w-full bg-green-600 text-black py-2 rounded-lg"
        >
          {loading ? "Submitting..." : "Submit Token"}
        </button>
      </form>
      {message && <p className="mt-2 text-sm text-red-500">{message}</p>}
    </div>
  );
};
