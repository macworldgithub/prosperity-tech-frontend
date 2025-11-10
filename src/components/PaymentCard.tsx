"use client";

import { useEffect } from "react";

interface PaymentCardProps {
  onTokenReceived: (token: string) => void;
}

export const PaymentCard = ({ onTokenReceived }: PaymentCardProps) => {
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
            alert("Failed to load credit card form");
            return;
          }
          trustedFrame = data.trustedFrame;
          submitBtn.disabled = false;
        }
      );

      form.onsubmit = (e) => {
        e.preventDefault();
        if (!trustedFrame) {
          alert("Frame not ready yet");
          return;
        }

        submitBtn.disabled = true;
        submitBtn.textContent = "Processing...";

        trustedFrame.submitForm(function (errors: any, data: any) {
          submitBtn.disabled = false;
          submitBtn.textContent = "Submit";
          if (errors) {
            alert("Error: " + (errors.message || "Unknown error"));
            return;
          }

          const token = data?.singleUseToken?.singleUseTokenId;
          alert("Token created: " + token);
          onTokenReceived(token);
        });
      };
    };

    loadQuickstream();
  }, []);

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
          disabled
          className="w-full bg-green-600 text-black py-2 rounded-lg"
        >
          Submit
        </button>
      </form>
    </div>
  );
};
