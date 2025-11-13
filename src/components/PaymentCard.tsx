"use client";
import { useEffect, useState } from "react";

interface PaymentCardProps {
  custNo: string;
  planName: string;
  onPaymentProcessed: (paymentId: string) => void; // returns paymentId for process card
}

export const PaymentCard = ({
  custNo,
  planName,
  onPaymentProcessed,
}: PaymentCardProps) => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const loadQuickstream = () => {
      if (typeof window === "undefined") return;

      const existingScript = document.getElementById("quickstream-js");
      if (!existingScript) {
        const script = document.createElement("script");
        script.src =
          "https://api.quickstream.westpac.com.au/rest/v1/quickstream-api-1.0.min.js";
        script.id = "quickstream-js";
        script.async = true;
        script.onload = initQuickstream;
        document.body.appendChild(script);
      } else {
        initQuickstream();
      }
    };

    const initQuickstream = () => {
      if (!window.QuickstreamAPI) return;

      const container = document.getElementById("creditCardContainer");
      if (container) container.innerHTML = "";

      window.QuickstreamAPI.init({
        publishableApiKey:
          "TIAB_PUB_sawvcp2cgmdfiyehcysqpe6qh6ajk4pbhgasz3t9tetu7t3r9p767ygsmmxm",
      });

      let trustedFrame: any = null;
      const submitBtn = document.getElementById(
        "submitBtn"
      ) as HTMLButtonElement;
      const form = document.getElementById("payment-form") as HTMLFormElement;

      window.QuickstreamAPI.creditCards.createTrustedFrame(
        {
          config: { supplierBusinessCode: "TIABREST" },
          iframe: {
            width: "100%",
            height: "350px",
            scrolling: "no",
            style: { border: "none", background: "#fff", borderRadius: "12px" },
          },
          fieldStyles: {
            base: {
              fontSize: "18px",
              padding: "10px 12px",
              color: "#111",
              fontFamily: "Inter, sans-serif",
              "::placeholder": { color: "#9ca3af" },
            },
            focus: { color: "#000", borderColor: "#007BFF" },
            invalid: { color: "#EF4444", borderColor: "#EF4444" },
          },
        },
        function (errors, data) {
          if (errors) {
            setMessage("Failed to load credit card form");
            return;
          }
          trustedFrame = data.trustedFrame;
          submitBtn.disabled = false;
        }
      );

      form.onsubmit = async (e) => {
        e.preventDefault();
        if (!trustedFrame) return;

        setLoading(true);
        submitBtn.disabled = true;
        submitBtn.textContent = "Processing...";

        trustedFrame.submitForm(async (errors: any, data: any) => {
          submitBtn.disabled = false;
          submitBtn.textContent = "Submit";

          if (errors) {
            setMessage(errors.message || "Error submitting card");
            setLoading(false);
            return;
          }

          try {
            const token = data?.singleUseToken?.singleUseTokenId;
            if (!token) throw new Error("No token returned");

            // Immediately call backend to save payment method
            const response = await fetch(
              "https://prosperity.omnisuiteai.com/api/v1/payments/methods",
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ custNo, paymentTokenId: token }),
              }
            );

            const result = await response.json();
            if (!response.ok)
              throw new Error(result.message || "Payment method failed");

            // Call parent callback with paymentId to show PaymentProcessCard
            onPaymentProcessed(result.data.paymentId);
          } catch (err: any) {
            setMessage("❌ " + (err.message || "Something went wrong"));
          } finally {
            setLoading(false);
          }
        });
      };
    };

    loadQuickstream();
  }, [custNo, planName, onPaymentProcessed]);

  return (
    <div className="bg-white/90 rounded-2xl p-3 w-full shadow-md">
      <h3 className="font-semibold mb-2 text-[#0E3B5C]">Enter Card Details</h3>
      <form id="payment-form">
        <div
          id="creditCardContainer"
          data-quickstream-api="creditCardContainer"
          className="w-full h-[350px] mb-3 bg-gray-100 rounded-lg"
        />
        <button
          type="submit"
          id="submitBtn"
          disabled={loading}
          className="w-full bg-green-600 text-white py-2 rounded-lg"
        >
          {loading ? "Processing..." : "Submit"}
        </button>
      </form>
      {message && <p className="mt-2 text-sm text-red-500">{message}</p>}
    </div>
  );
};
