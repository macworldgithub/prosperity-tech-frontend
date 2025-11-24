"use client";
import React, { useState, useEffect } from "react";
import { PaymentCard } from "./PaymentCard";
import { useRouter, useSearchParams } from "next/navigation";

interface Plan {
  _id: string;
  planNo: number;
  planName: string;
  price: number;
  network: string;
  isActive: boolean;
}

const ChatWindow = () => {
  const [chat, setChat] = useState<
    { id: number; type: "user" | "bot"; text: string; time: string }[]
  >([]);
  const router = useRouter();
  const searchParams = useSearchParams();

  const [plans, setPlans] = useState<any[]>([]); // for storing plans
  const [showPlans, setShowPlans] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [showDetailsForm, setShowDetailsForm] = useState(false);
  const [showNumberButtons, setShowNumberButtons] = useState(false);
  const [numberOptions, setNumberOptions] = useState<string[]>([]);
  const [showPayment, setShowPayment] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [selectedSim, setSelectedSim] = useState<string | null>(null);
  const [custNo, setCustNo] = useState<string | null>(null);
  const [showSimTypeSelection, setShowSimTypeSelection] = useState(false);
  const [simType, setSimType] = useState<"esim" | "physical" | null>(null);
  const [simNumber, setSimNumber] = useState("");
  const [showSimNumberInput, setShowSimNumberInput] = useState(false);
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    const fromBanner = searchParams.get("fromBanner");
    if (fromBanner) {
      setChat([
        {
          id: 1,
          type: "bot",
          text: "Let me help you switch to an E-sim. Please fill the form below.",
          time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ]);
      setShowDetailsForm(true);
    }
  }, [searchParams]);

  useEffect(() => {
    const loadPlans = async () => {
      try {
        const res = await fetch(
          "https://prosperity.omnisuiteai.com/api/v1/plans"
        );
        const data = await res.json();
        const list: Plan[] = data.data || [];
        setPlans(list);

        // Preselect plan from URL
        const planParam = searchParams.get("plan");
        if (planParam) {
          const match = list.find((p) => p.planName === planParam);
          if (match) {
            setSelectedPlan(match);
            setShowDetailsForm(true);
          }
        }
      } catch (e) {
        console.error("Failed loading plans:", e);
      }
    };

    loadPlans();
  }, [searchParams]);

  const [formData, setFormData] = useState({
    firstName: "",
    surname: "",
    email: "",
    phone: "",
    dob: "",
    address: "",
    suburb: "",
    state: "",
    postcode: "",
    pin: "",
  });
  const [formErrors, setFormErrors] = useState<any>({});

  const validateForm = () => {
    const errors: any = {};
    let ok = true;

    const requiredFields: (keyof typeof formData)[] = [
      "firstName",
      "surname",
      "email",
      "phone",
      "dob",
      "address",
      "suburb",
      "state",
      "postcode",
      "pin",
    ];

    for (let field of requiredFields) {
      if (!formData[field].trim()) {
        errors[field] = "Required";
        ok = false;
      }
    }
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Invalid email";
      ok = false;
    }
    if (formData.phone && !/^04\d{8}$/.test(formData.phone)) {
      errors.phone = "Invalid AU mobile";
      ok = false;
    }
    if (formData.postcode && !/^\d{4}$/.test(formData.postcode)) {
      errors.postcode = "Postcode must be 4 digits";
      ok = false;
    }

    if (formData.pin && !/^\d{4}$/.test(formData.pin)) {
      errors.pin = "PIN must be 4 digits";
      ok = false;
    }

    setFormErrors(errors);
    return ok;
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.name as keyof typeof formData;
    const { value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFormErrors((prev: any) => ({ ...prev, [name]: "" }));
  };

  const handleFormSubmit = (e: any) => {
    e.preventDefault();
    if (!validateForm()) return;

    setUserEmail(formData.email);
    localStorage.setItem("userEmail", formData.email);

    const formatted = Object.entries(formData)
      .map(([k, v]) => `${k}: ${v}`)
      .join(", ");

    setShowDetailsForm(false);
    handleSend(formatted);
  };

  const callAPI = async (text: string) => {
    const payload = sessionId
      ? { query: text, session_id: sessionId, brand: "flying-kiwi" }
      : { query: text, brand: "flying-kiwi" };

    try {
      const res = await fetch("/api", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) return null;
      const data = await res.json();

      if (!sessionId && data.session_id) setSessionId(data.session_id);
      if (data.custNo) setCustNo(data.custNo);

      return data;
    } catch (e) {
      console.error("API error:", e);
      return null;
    }
  };

  const handleSend = async (text: string) => {
    if (!text.trim() || loading) return;

    const userMsg = {
      id: chat.length + 1,
      type: "user" as const,
      text,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setChat((prev) => [...prev, userMsg]);
    setMessage("");
    setLoading(true);
    await new Promise((res) => setTimeout(res, 50));

    const data = await callAPI(text);
    setLoading(false);

    if (!data) {
      return setChat((prev) => [
        ...prev,
        {
          id: prev.length + 1,
          type: "bot",
          text: "Oops! Something went wrong.",
          time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ]);
    }

    const botText = data.message || data.response || "";

    if (
      botText.toLowerCase().includes("first name") ||
      botText.toLowerCase().includes("surname")
    ) {
      setShowDetailsForm(true);
    }

    const matches = botText.match(/04\d{8}/g);
    if (matches?.length === 5) {
      setNumberOptions(matches);
      setShowNumberButtons(true);
      return;
    }
    setChat((prev) => [
      ...prev,
      {
        id: prev.length + 1,
        type: "bot",
        text: botText,
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      },
    ]);
  };

  const handleNumberSelect = async (num: string) => {
    setSelectedSim(num);
    setShowNumberButtons(false);

    setChat((prev) => [
      ...prev,
      {
        id: prev.length + 1,
        type: "user",
        text: `You selected this number: ${num}`,
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      },
    ]);

    setLoading(true);
    await new Promise((r) => setTimeout(r, 50));
    await callAPI(num);
    setLoading(false);

    setChat((prev) => [
      ...prev,
      {
        id: prev.length + 1,
        type: "bot",
        text: selectedPlan
          ? "Perfect! Let's continue with payment."
          : "Choose one of the plans below:",
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      },
    ]);

    if (selectedPlan) {
      setShowSimTypeSelection(true);
    } else {
      setShowPlans(true);
    }
  };

  const handlePlanSelect = (plan: Plan) => {
    setSelectedPlan(plan);
    localStorage.setItem("planPrice", String(plan.price));

    setShowPlans(false);

    setChat((prev) => [
      ...prev,
      {
        id: prev.length + 1,
        type: "user",
        text: `You selected this plan: ${plan.planName}`,
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      },
    ]);

    setShowSimTypeSelection(true); // Show SIM type selection next
  };

  const handleSimTypeSelect = (type: "esim" | "physical") => {
    setSimType(type);
    setShowSimTypeSelection(false);
    if (type === "esim") {
      setShowPayment(true);
    } else {
      setShowSimNumberInput(true);
    }
  };

  const handleSimNumberContinue = () => {
    if (simNumber.trim().length !== 13) {
      alert("SIM number must be exactly 13 digits.");
      return;
    }
    localStorage.setItem("physicalSimNumber", simNumber.trim());
    setShowSimNumberInput(false);
    setShowPayment(true);
  };

  const handleActivateOrder = async () => {
    try {
      const body = {
        number: selectedSim,
        cust: {
          custNo,
          suburb: formData.suburb,
          postcode: formData.postcode,
          address: formData.address,
          email: formData.email,
        },
        planNo: String(selectedPlan?.planNo),
        simNo:
          simType === "physical"
            ? localStorage.getItem("physicalSimNumber") || ""
            : "",
      };

      console.log("Activation payload:", body);

      const res = await fetch(
        "https://prosperity.omnisuiteai.com/api/v1/orders/activate",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error("Activation failed");
      const receiptNumber = data?.data?.orderId || "";

      const activationMessage = `Great news... your eSIM has been created with prosperity-tech.

Here is your receipt number: ${receiptNumber}.
Take a copy of it now, but you will also be getting an email of it.

Step 3 is installing the eSIM on your phone.
You will receive a QR Code in the next 5 to 10 minutes via email from: donotreply@mobileservicesolutions.com.au

Make sure to check your junk mail if it hasn't arrived in the next 5 to 10 minutes.`;

      setChat((prev) => [
        ...prev,
        {
          id: prev.length + 1,
          type: "bot",
          text: activationMessage,
          time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ]);
    } catch (err) {
      handleSend("Activation failed. Please try again.");
    }
  };

  const sendMessage = () => {
    handleSend(message);
  };

  return (
    <>
      {/* Background with image */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 bg-cover bg-center"
        style={{
          backgroundImage: "url('/images/bg.png')",
        }}
      />

      {/* Chat Modal */}
      <div className="fixed inset-0 flex items-center justify-center z-50 p-2 sm:p-4 md:p-0 overflow-y-auto">
        <div className="w-full sm:w-[50%] h-[80vh] sm:h-[75vh] md:max-h-[600px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden">
          {/* Header */}
          <div className="flex justify-between items-center p-2 sm:p-3 bg-[#215988] rounded-t-2xl">
            <div className="flex items-center gap-1 sm:gap-2">
              <div className="relative w-8 h-8 sm:w-12 sm:h-12">
                <img
                  src="/images/logo.png"
                  alt="Prosperity Tech Logo"
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
            <button
              onClick={() => router.push("/")}
              className="text-white text-lg sm:text-xl font-bold hover:text-gray-200 transition-colors"
            >
              ×
            </button>
          </div>

          <div className="h-0.5 sm:h-1 w-full bg-gradient-to-r from-[#215988] via-[#2bb673] to-[#215988]" />

          {/* Chat Body */}
          <div className="flex-1 flex flex-col bg-gradient-to-b from-[#33a748] via-[#257773] to-[#1e608c] p-2 sm:p-4 md:p-6 overflow-y-auto rounded-b-2xl ring-1 ring-white/20 shadow-[inset_0_8px_24px_rgba(0,0,0,0.25)]">
            <div className="text-center mb-2 sm:mb-4 md:mb-6 mt-2 sm:mt-4 md:mt-8">
              <div className="mx-auto mb-1 sm:mb-2 w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20">
                <img
                  src="/images/logo.png"
                  alt="Prosperity Tech Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <h2 className="text-white font-bold text-sm sm:text-base md:text-lg mb-0.5 sm:mb-1">
                How can I help you today?
              </h2>
            </div>

            {selectedPlan && (
              <div className="mb-4 bg-white/20 border border-white/30 text-white text-center text-sm sm:text-base px-3 py-2 rounded-md shadow-md">
                You selected <strong>{selectedPlan.planName}</strong> — $
                {selectedPlan.price}. Let’s continue with your setup.
              </div>
            )}

            {/* Chat Messages */}
            {chat.map((msg) => (
              <div
                key={msg.id}
                className={`flex items-start gap-2 sm:gap-3 mb-3 sm:mb-4 md:mb-6 ${
                  msg.type === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {msg.type === "bot" && (
                  <div className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 bg-yellow-400 rounded-full flex-shrink-0 flex items-center justify-center overflow-hidden">
                    <img
                      src="/images/bot.png"
                      alt="Bot Avatar"
                      className="w-full h-full rounded-full object-cover"
                    />
                  </div>
                )}

                <div
                  className={`${
                    msg.type === "user"
                      ? "bg-white text-[#0E3B5C]"
                      : "bg-white text-[#0E3B5C]"
                  } rounded-2xl px-3 py-1.5 sm:px-4 sm:py-2 md:px-6 md:py-2 shadow-md max-w-[90%] sm:max-w-[80%] md:max-w-[70%]`}
                >
                  <p className="text-xs sm:text-xs md:text-sm leading-relaxed break-words">
                    {msg.text}
                  </p>
                </div>
              </div>
            ))}

            {/* Loading indicator */}
            {loading && (
              <div className="flex items-start gap-2 sm:gap-3 mb-3 sm:mb-4 md:mb-6">
                <div className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 bg-yellow-400 rounded-full flex items-center justify-center overflow-hidden">
                  <img
                    src="/images/bot.png"
                    alt="Loading Avatar"
                    className="w-full h-full rounded-full object-cover"
                  />
                </div>
                <div className="bg-white rounded-2xl px-3 py-1.5 sm:px-4 sm:py-2 md:px-6 md:py-2 shadow-md max-w-[90%] sm:max-w-[80%] md:max-w-[70%]">
                  <p className="text-[#0E3B5C] text-xs sm:text-xs md:text-sm leading-relaxed">
                    Typing...
                  </p>
                </div>
              </div>
            )}

            {/* Input Bar */}
            <div className="mt-auto">
              {showDetailsForm ? (
                <form
                  onSubmit={handleFormSubmit}
                  className="bg-white/10 backdrop-blur-sm p-3 sm:p-4 rounded-lg border border-white/30 overflow-y-auto max-h-[40vh] sm:max-h-[50vh]"
                >
                  <div className="grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-2">
                    <div>
                      <input
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleFormChange}
                        placeholder="First Name"
                        className="w-full p-1.5 sm:p-2 rounded bg-transparent text-white border border-white/50 text-xs sm:text-sm"
                        required
                      />
                      {formErrors.firstName && (
                        <p className="text-red-300 text-xs mt-0.5 sm:mt-1">
                          {formErrors.firstName}
                        </p>
                      )}
                    </div>
                    <div>
                      <input
                        name="surname"
                        value={formData.surname}
                        onChange={handleFormChange}
                        placeholder="Surname"
                        className="w-full p-1.5 sm:p-2 rounded bg-transparent text-white border border-white/50 text-xs sm:text-sm"
                        required
                      />
                      {formErrors.surname && (
                        <p className="text-red-300 text-xs mt-0.5 sm:mt-1">
                          {formErrors.surname}
                        </p>
                      )}
                    </div>
                    <div>
                      <input
                        name="email"
                        value={formData.email}
                        onChange={handleFormChange}
                        placeholder="Email"
                        type="email"
                        className="w-full p-1.5 sm:p-2 rounded bg-transparent text-white border border-white/50 text-xs sm:text-sm"
                        required
                      />
                      {formErrors.email && (
                        <p className="text-red-300 text-xs mt-0.5 sm:mt-1">
                          {formErrors.email}
                        </p>
                      )}
                    </div>
                    <div>
                      <input
                        name="phone"
                        value={formData.phone}
                        onChange={handleFormChange}
                        placeholder="Phone (e.g., 0412345678)"
                        className="w-full p-1.5 sm:p-2 rounded bg-transparent text-white border border-white/50 text-xs sm:text-sm"
                        required
                      />
                      {formErrors.phone && (
                        <p className="text-red-300 text-xs mt-0.5 sm:mt-1">
                          {formErrors.phone}
                        </p>
                      )}
                    </div>
                    <div>
                      <input
                        name="dob"
                        type="date"
                        value={formData.dob}
                        onChange={handleFormChange}
                        placeholder="Date of Birth"
                        className="w-full p-1.5 sm:p-2 rounded bg-transparent text-white border border-white/50 text-xs sm:text-sm"
                        required
                      />
                      {formErrors.dob && (
                        <p className="text-red-300 text-xs mt-0.5 sm:mt-1">
                          {formErrors.dob}
                        </p>
                      )}
                    </div>
                    <div>
                      <input
                        name="address"
                        value={formData.address}
                        onChange={handleFormChange}
                        placeholder="Address"
                        className="w-full p-1.5 sm:p-2 rounded bg-transparent text-white border border-white/50 text-xs sm:text-sm"
                        required
                      />
                      {formErrors.address && (
                        <p className="text-red-300 text-xs mt-0.5 sm:mt-1">
                          {formErrors.address}
                        </p>
                      )}
                    </div>
                    <div>
                      <input
                        name="suburb"
                        value={formData.suburb}
                        onChange={handleFormChange}
                        placeholder="Suburb"
                        className="w-full p-1.5 sm:p-2 rounded bg-transparent text-white border border-white/50 text-xs sm:text-sm"
                        required
                      />
                      {formErrors.suburb && (
                        <p className="text-red-300 text-xs mt-0.5 sm:mt-1">
                          {formErrors.suburb}
                        </p>
                      )}
                    </div>
                    <div>
                      <input
                        name="state"
                        value={formData.state}
                        onChange={handleFormChange}
                        placeholder="State (e.g., VIC)"
                        className="w-full p-1.5 sm:p-2 rounded bg-transparent text-white border border-white/50 text-xs sm:text-sm"
                        required
                      />
                      {formErrors.state && (
                        <p className="text-red-300 text-xs mt-0.5 sm:mt-1">
                          {formErrors.state}
                        </p>
                      )}
                    </div>
                    <div>
                      <input
                        name="postcode"
                        value={formData.postcode}
                        onChange={handleFormChange}
                        placeholder="Postcode (4 digits)"
                        className="w-full p-1.5 sm:p-2 rounded bg-transparent text-white border border-white/50 text-xs sm:text-sm"
                        required
                      />
                      {formErrors.postcode && (
                        <p className="text-red-300 text-xs mt-0.5 sm:mt-1">
                          {formErrors.postcode}
                        </p>
                      )}
                    </div>
                    <div>
                      <input
                        name="pin"
                        value={formData.pin}
                        onChange={handleFormChange}
                        placeholder="4-digit PIN"
                        maxLength={4}
                        className="w-full p-1.5 sm:p-2 rounded bg-transparent text-white border border-white/50 text-xs sm:text-sm"
                        required
                      />
                      {formErrors.pin && (
                        <p className="text-red-300 text-xs mt-0.5 sm:mt-1">
                          {formErrors.pin}
                        </p>
                      )}
                    </div>
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="mt-3 sm:mt-4 w-full bg-[#2bb673] text-white py-1.5 sm:py-2 rounded hover:opacity-90 text-xs sm:text-sm"
                  >
                    Submit Details
                  </button>
                </form>
              ) : showNumberButtons && numberOptions.length > 0 ? (
                <div className="flex flex-wrap gap-1 sm:gap-2 p-3 sm:p-4 bg-white/10 backdrop-blur-sm rounded-lg border border-white/30 justify-center">
                  {numberOptions.map((num, index) => (
                    <button
                      key={index}
                      onClick={() => handleNumberSelect(num)}
                      disabled={loading}
                      className="bg-[#2bb673] text-white px-2 py-1 sm:px-3 sm:py-1 md:px-4 md:py-2 rounded hover:opacity-90 text-xs sm:text-xs md:text-sm"
                    >
                      {num}
                    </button>
                  ))}
                </div>
              ) : showPlans && !selectedPlan && plans.length > 0 ? (
                <div className="flex flex-wrap gap-1 sm:gap-2 p-3 sm:p-4 bg-white/10 backdrop-blur-sm rounded-lg border border-white/30 justify-center">
                  {plans.map((plan, index) => (
                    <button
                      key={index}
                      onClick={() => handlePlanSelect(plan)}
                      className="bg-[#2bb673] text-white px-2 py-1 sm:px-3 sm:py-1 md:px-4 md:py-2 rounded hover:opacity-90 text-xs sm:text-xs md:text-sm"
                    >
                      {plan.planName} - ${plan.price}
                    </button>
                  ))}
                </div>
              ) : showSimTypeSelection ? (
                <div className="flex flex-col items-center gap-3 p-4 bg-white/10 rounded-lg border border-white/30 text-white">
                  <p className="text-sm sm:text-base">
                    Please choose SIM type:
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleSimTypeSelect("esim")}
                      className="bg-[#2bb673] text-white px-3 py-1 rounded hover:opacity-90 text-xs sm:text-sm"
                    >
                      E-SIM
                    </button>
                    <button
                      onClick={() => handleSimTypeSelect("physical")}
                      className="bg-[#215988] text-white px-3 py-1 rounded hover:opacity-90 text-xs sm:text-sm"
                    >
                      Physical SIM
                    </button>
                  </div>
                </div>
              ) : showSimNumberInput ? (
                <div className="flex flex-col items-center gap-3 p-4 bg-white/10 rounded-lg border border-white/30 text-white">
                  <p className="text-sm sm:text-base">
                    Enter your 13-digit SIM number:
                  </p>
                  <input
                    type="text"
                    maxLength={13}
                    value={simNumber}
                    onChange={(e) =>
                      setSimNumber(e.target.value.replace(/\D/g, ""))
                    }
                    className="w-full p-2 rounded bg-transparent border border-white/50 text-center text-white text-sm sm:text-base tracking-widest"
                    placeholder="Enter 13-digit SIM number"
                  />
                  <button
                    onClick={handleSimNumberContinue}
                    className="bg-[#2bb673] text-white px-4 py-1 rounded hover:opacity-90 text-xs sm:text-sm"
                  >
                    Continue
                  </button>
                </div>
              ) : showPayment && selectedPlan ? (
                <PaymentCard
                  custNo={custNo || ""}
                  planName={selectedPlan.planName}
                  planPrice={selectedPlan.price}
                  onPaymentComplete={(success, msg) => {
                    setShowPayment(false);

                    if (msg) {
                      setChat((prev) => [
                        ...prev,
                        {
                          id: prev.length + 1,
                          type: "bot",
                          text: msg,
                          time: new Date().toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          }),
                        },
                      ]);
                    }

                    if (success) handleActivateOrder();
                  }}
                />
              ) : (
                <div className="flex items-center gap-2 sm:gap-3 border border-white/30 rounded-full px-3 sm:px-4 py-2 sm:py-3 bg-white/10 backdrop-blur-sm text-white">
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                    placeholder="Message..."
                    className="flex-1 bg-transparent text-white placeholder-white/70 text-xs sm:text-sm focus:outline-none"
                  />

                  <button
                    onClick={sendMessage}
                    disabled={loading}
                    className="inline-flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-[#2bb673] hover:opacity-90 disabled:opacity-50"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="white"
                      strokeWidth="2"
                      className="w-3 h-3 sm:w-4 sm:h-4"
                    >
                      <path d="M22 2L11 13" />
                      <path d="M22 2l-7 20-4-9-9-4 20-7z" />
                    </svg>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChatWindow;
