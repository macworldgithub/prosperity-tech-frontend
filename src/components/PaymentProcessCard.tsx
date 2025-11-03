"use client";

import { useState } from "react";

interface PaymentProcessCardProps {
  onClose: () => void;
}

export const PaymentProcessCard = ({ onClose }: PaymentProcessCardProps) => {
  const [formData, setFormData] = useState({
    custNo: "526691",
    amount: "",
    paymentId: "",
    email: "",
    comment: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(
        "https://bele.omnisuiteai.com/api/v1/payments/process",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Payment failed");

      alert("✅ Payment processed successfully!");
      onClose();
    } catch (error: any) {
      setMessage("❌ " + (error.message || "Something went wrong"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white/90 rounded-2xl p-3 w-full shadow-md">
      <h3 className="font-semibold mb-2 text-[#0E3B5C]">Process Payment</h3>
      <form onSubmit={handleSubmit} className="space-y-2 text-black">
        <input
          name="custNo"
          value={formData.custNo}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-lg px-3 py-2"
          placeholder="Customer Number"
        />
        <input
          name="amount"
          type="number"
          value={formData.amount}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-lg px-3 py-2"
          placeholder="Amount"
        />
        <input
          name="paymentId"
          value={formData.paymentId}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-lg px-3 py-2"
          placeholder="Payment ID"
        />
        <input
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-lg px-3 py-2"
          placeholder="Email"
        />
        <input
          name="comment"
          value={formData.comment}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-lg px-3 py-2"
          placeholder="Comment"
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 text-black py-2 rounded-lg"
        >
          {loading ? "Processing..." : "Submit Payment"}
        </button>
      </form>
      {message && <p className="mt-2 text-sm text-red-500">{message}</p>}
    </div>
  );
};
