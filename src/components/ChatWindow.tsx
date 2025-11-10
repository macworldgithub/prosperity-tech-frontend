"use client";
import React, { useState, useEffect } from "react";
import { PaymentCard } from "./PaymentCard";
import { TokenCard } from "./TokenCard";
import { PaymentProcessCard } from "./PaymentProcessCard";
import { useSearchParams } from "next/navigation";

interface Plan {
  _id: string;
  planName: string;
  price: number;
  network: string;
  isActive: boolean;
}

const ChatWindow = () => {
  const [chat, setChat] = useState<
    { id: number; type: "user" | "bot"; text: string; time: string }[]
  >([
    {
      id: 1,
      type: "bot",
      text: "Hi there, I would be glad to help. How can I help?",
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    },
  ]);

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
  console.log(selectedPlan, "SelectedPlan");
  const [showTokenCard, setShowTokenCard] = useState(false);
  const [paymentToken, setPaymentToken] = useState<string | null>(null);
  const [showPaymentProcessCard, setShowPaymentProcessCard] = useState(false);
  const [selectedSim, setSelectedSim] = useState<string | null>(null);
  const [custNo, setCustNo] = useState<string | null>(null);
  const [planNo, setPlanNo] = useState<string | null>(null);

  const searchParams = useSearchParams();

  useEffect(() => {
    const fetchPlansAndCheckQuery = async () => {
      try {
        const res = await fetch("https://bele.omnisuiteai.com/api/v1/plans");
        const data = await res.json();
        const plansList: Plan[] = data.data || [];
        setPlans(plansList);

        const planParam = searchParams.get("plan");
        if (planParam) {
          const preselected = plansList.find((p) => p.planName === planParam);
          if (preselected) {
            setSelectedPlan(preselected);
            handleSend(`You've selected the ${preselected.planName} plan.`);
          }
        }
      } catch (err) {
        console.error("Error fetching plans:", err);
      }
    };

    fetchPlansAndCheckQuery();
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
  const [formErrors, setFormErrors] = useState({
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

  const isDetailsRequest = (text: string): boolean => {
    const lowerText = text.toLowerCase();
    return (
      lowerText.includes("first name") &&
      lowerText.includes("surname") &&
      lowerText.includes("email") &&
      lowerText.includes("phone") &&
      lowerText.includes("date of birth") &&
      lowerText.includes("address") &&
      lowerText.includes("suburb") &&
      lowerText.includes("state") &&
      lowerText.includes("postcode") &&
      lowerText.includes("pin")
    );
  };

  const isNumberSelection = (text: string): boolean => {
    const matches = text.match(/04\d{8}/g);
    return matches ? matches.length === 5 : false;
  };

  const extractNumbers = (text: string): string[] => {
    const matches = text.match(/04\d{8}/g);
    return matches || [];
  };

  const validateForm = (): boolean => {
    let isValid = true;
    const errors = {
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
    };

    if (!formData.firstName.trim()) {
      errors.firstName = "First Name is required";
      isValid = false;
    }
    if (!formData.surname.trim()) {
      errors.surname = "Surname is required";
      isValid = false;
    }
    if (!formData.email.trim()) {
      errors.email = "Email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Invalid email format";
      isValid = false;
    }
    if (!formData.phone.trim()) {
      errors.phone = "Phone is required";
      isValid = false;
    } else if (!/^04\d{8}$/.test(formData.phone)) {
      errors.phone =
        "Phone must be a valid Australian mobile number (e.g., 0412345678)";
      isValid = false;
    }
    if (!formData.dob.trim()) {
      errors.dob = "Date of Birth is required";
      isValid = false;
    } else if (!/^\d{4}-\d{2}-\d{2}$/.test(formData.dob)) {
      errors.dob = "Date of Birth must be in YYYY-MM-DD format";
      isValid = false;
    }
    if (!formData.address.trim()) {
      errors.address = "Address is required";
      isValid = false;
    }
    if (!formData.suburb.trim()) {
      errors.suburb = "Suburb is required";
      isValid = false;
    }
    if (!formData.state.trim()) {
      errors.state = "State is required";
      isValid = false;
    }
    if (!formData.postcode.trim()) {
      errors.postcode = "Postcode is required";
      isValid = false;
    } else if (!/^\d{4}$/.test(formData.postcode)) {
      errors.postcode = "Postcode must be 4 digits";
      isValid = false;
    }
    if (!formData.pin.trim()) {
      errors.pin = "PIN is required";
      isValid = false;
    } else if (!/^\d{4}$/.test(formData.pin)) {
      errors.pin = "PIN must be exactly 4 digits";
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFormErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    const formatted = Object.entries(formData)
      .map(([key, value]) => `${key}: ${value}`)
      .join(", ");
    setShowDetailsForm(false);
    handleSend(formatted);
  };

  // Add new handler for plan selection
  const handlePlanSelect = (plan: any) => {
    setSelectedPlan(plan);
    setPlanNo(String(plan.planNo || "PLAN001"));
    setShowPlans(false);
    setShowPayment(true); // Show payment form
    handleSend(`I would like to select the plan: ${plan.planName}`);
  };

  const handleSend = async (msgText: string) => {
    if (!msgText.trim() || loading) return;

    const userMsg = {
      id: chat.length + 1,
      type: "user" as const,
      text: msgText.trim(),
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setChat((prev) => [...prev, userMsg]);
    setMessage("");
    setLoading(true);

    try {
      const payload = sessionId
        ? {
            query: userMsg.text,
            session_id: sessionId,
            brand: "prosperity-tech",
          }
        : { query: userMsg.text, brand: "prosperity-tech" };

      const response = await fetch("/api", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("API Response:", data);

      if (!sessionId && data.session_id) {
        setSessionId(data.session_id);
      }

      const botText =
        data?.message || data?.response || "Sorry, I couldn’t understand that.";

      const botMsg = {
        id: chat.length + 2,
        type: "bot" as const,
        text: botText,
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      setChat((prev) => [...prev, botMsg]);

      if (data?.custNo) setCustNo(data.custNo);

      if (botText.toLowerCase().includes("please provide your first name")) {
        setShowDetailsForm(true);
      }

      if (botText.match(/04\d{8}/g)?.length === 5) {
        const numbers = botText.match(/04\d{8}/g);
        setNumberOptions(numbers || []);
        setShowNumberButtons(true);
      }

      if (isDetailsRequest(botText)) {
        setShowDetailsForm(true);
      }

      if (isNumberSelection(botText)) {
        const numbers = extractNumbers(botText);
        setNumberOptions(numbers);
        setShowNumberButtons(true);

        if (!selectedPlan) {
          try {
            const plansResponse = await fetch(
              "https://bele.omnisuiteai.com/api/v1/plans",
              {
                method: "GET",
                headers: { accept: "application/json" },
              }
            );

            if (!plansResponse.ok) throw new Error("Failed to fetch plans");

            const plansData = await plansResponse.json();
            setPlans(plansData.data || []);
            setShowPlans(true);
          } catch (plansError) {
            console.error("Error fetching plans:", plansError);
            setPlans([]);
            setShowPlans(true);
          }
        }
      }
    } catch (error: any) {
      console.error("Full Chat error:", error); // Enhanced logging
      let errorMsg = "Oops! Something went wrong. Please try again.";
      if (
        error.name === "TypeError" &&
        error.message.includes("Failed to fetch")
      ) {
        errorMsg = "Network error (CORS?). Check console and try refreshing.";
      } else if (error.message.includes("401")) {
        errorMsg = "Session expired. Please log in again.";
      }
      const errorResponse = {
        id: chat.length + 2,
        type: "bot" as const,
        text: errorMsg,
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setChat((prev) => [...prev, errorResponse]);
    } finally {
      setLoading(false);
    }
  };

  const handleNumberSelect = async (number: string) => {
    setSelectedSim(number);
    setShowNumberButtons(false);
    handleSend(number);
    if (selectedPlan) {
      setShowPayment(true); // proceed to payment if plan already selected
    } else {
      setShowPlans(true); // otherwise show plan options
    }
  };

  const handleActivateOrder = async () => {
    try {
      const body = {
        number: selectedSim,
        cust: {
          custNo: custNo,
          suburb: formData.suburb,
          postcode: formData.postcode,
          address: formData.address,
          email: formData.email,
        },
        planNo: String(planNo || ""),
        simNo: "",
      };

      console.log("Activation payload:", body);

      const response = await fetch(
        "https://bele.omnisuiteai.com/api/v1/orders/activate",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        }
      );

      const result = await response.json();
      console.log("Activation result:", result);

      if (response.ok) {
        handleSend("Order successfully activated!");
      } else {
        handleSend(`Activation failed: ${result.message || "Unknown error"}`);
      }
    } catch (err) {
      console.error("Activation failed", err);
      handleSend("Order activation failed. Please try again.");
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
        <div className="w-full h-[95vh] sm:h-[90vh] md:h-auto md:max-h-[600px] max-w-[100vw] sm:max-w-5xl bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden">
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
            <button className="text-white text-lg sm:text-xl font-bold hover:text-gray-200 transition-colors">
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
              ) : showPayment && selectedPlan ? (
                <PaymentCard
                  onTokenReceived={(token) => {
                    setPaymentToken(token);
                    setShowPayment(false);
                    setShowTokenCard(true);
                    handleSend(
                      `Payment completed for plan ${selectedPlan.planName} with token: ${token}`
                    );
                  }}
                />
              ) : showTokenCard && paymentToken ? (
                <TokenCard
                  token={paymentToken}
                  custNo={custNo || ""}
                  onSuccess={() => {
                    setShowTokenCard(false);
                    setPaymentToken(null);
                    handleSend("Payment method successfully added!");
                    setShowPaymentProcessCard(true);
                  }}
                />
              ) : showPaymentProcessCard ? (
                <PaymentProcessCard
                  onClose={() => {
                    setShowPaymentProcessCard(false);
                    handleSend("Payment processing completed!");
                    handleActivateOrder();
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
