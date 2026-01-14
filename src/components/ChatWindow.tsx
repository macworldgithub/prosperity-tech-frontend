"use client";
import React, { useState, useEffect } from "react";
import { PaymentCard } from "./PaymentCard";
import { useRouter, useSearchParams } from "next/navigation";
import { formatDob, formatDobToISO, isDeleteIntent } from "@/lib/utils";
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/themes/dark.css";
import sessionStorage from "redux-persist/es/storage/session";

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
  const [showExistingNumberOptions, setShowExistingNumberOptions] =
    useState(false);
  const [showNumberTypeSelection, setShowNumberTypeSelection] = useState(false);
  const [showConfirmNewNumber, setShowConfirmNewNumber] = useState(false);
  const [existingNumberType, setExistingNumberType] = useState<
    "prepaid" | "postpaid" | null
  >(null);
  const [showArnInput, setShowArnInput] = useState(false);
  const [arn, setArn] = useState("");
  const [existingPhone, setExistingPhone] = useState("");
  const [showConfirmExistingNumber, setShowConfirmExistingNumber] =
    useState(false);

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
  const [isPorting, setIsPorting] = useState(false); // ← NEW
  const [hasSelectedNumber, setHasSelectedNumber] = useState(false); // ← NEW
  const [selectedOption, setSelectedOption] = useState("");
  const [showInitialOptions, setShowInitialOptions] = useState(true);
  const [isTypingEnabled, setIsTypingEnabled] = useState(false);
  const [isTransferFlow, setIsTransferFlow] = useState(false);

  const [showOtpInput, setShowOtpInput] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [otpTransactionId, setOtpTransactionId] = useState(""); // to track OTP
  const [otpVerified, setOtpVerified] = useState(false);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [pendingDeleteIntent, setPendingDeleteIntent] = useState(false);

  const [states, setStates] = useState([]);
  const [loadingStates, setLoadingStates] = useState(false);
  const [numberDecisionMade, setNumberDecisionMade] = useState(false);
  const [ageError, setAgeError] = useState("");
  const [showNumberConfirmation, setShowNumberConfirmation] = useState(false);
  const [confirmationType, setConfirmationType] = useState<
    "new" | "existing" | null
  >(null);
  const [flowCompleted, setFlowCompleted] = useState(false);
  const [typingDots, setTypingDots] = useState("");

  useEffect(() => {
    if (!loading) {
      setTypingDots("");
      return;
    }

    const interval = setInterval(() => {
      setTypingDots((prev) => (prev.length < 3 ? prev + "." : ""));
    }, 500);

    return () => clearInterval(interval);
  }, [loading]);

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
      setShowInitialOptions(false);
      setIsTypingEnabled(false);
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

  useEffect(() => {
    if (showDetailsForm && states.length === 0) {
      setLoadingStates(true);
      fetch("https://prosperity.omnisuiteai.com/states")
        .then((res) => res.json())
        .then((data) => setStates(data))
        .catch((err) => console.error("Failed to fetch states:", err))
        .finally(() => setLoadingStates(false));
    }
  }, [showDetailsForm]);

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
    custAuthorityNo: "",
    custAuthorityType: "",
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
      "custAuthorityNo",
      "custAuthorityType",
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
    if (!formData.custAuthorityNo.trim()) {
      errors.custAuthorityNo = "Customer Authority Number is required";
    }

    if (!formData.custAuthorityType) {
      errors.custAuthorityType = "Please select a Customer Authority Type";
    }
    if (formData.dob) {
      const [day, month, year] = formData.dob.split("/").map(Number);
      const birthDate = new Date(year, month - 1, day);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }

      if (age < 18) {
        setAgeError("You must be at least 18 years old to sign up.");
        ok = false;
      } else {
        setAgeError(""); // clear error if age is ok
      }
    }
    setFormErrors(errors);
    return ok;
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.name as keyof typeof formData;
    const { value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setFormErrors((prev: any) => ({ ...prev, [name]: "" }));
    if (name === "dob" && value.trim()) {
      const match = value.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
      if (match) {
        const [_, day, month, year] = match.map(Number);
        const birthDate = new Date(year, month - 1, day);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
          age--;
        }

        if (age < 18) {
          setAgeError("You must be at least 18 years old to sign up.");
        } else {
          setAgeError("");
        }
      }
    }
  };

  // Convert "dd/mm/yyyy" string to JS Date object
  const parseDateFromDDMMYYYY = (dateStr: string) => {
    if (!dateStr) return null;
    const [day, month, year] = dateStr.split("/").map(Number);
    return new Date(year, month - 1, day);
  };

  const handleFormSubmit = async (e: any) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setLoading(true);
      setShowInitialOptions(false);
      setIsTypingEnabled(false);
      // Save DOB to localStorage
      const isoDob = formatDobToISO(formData.dob);

      sessionStorage.setItem("userDOB", isoDob);
      setUserEmail(formData.email);
      sessionStorage.setItem("userEmail", formData.email);

      const formatted = Object.entries(formData)
        .map(([k, v]) => `${k}: ${v}`)
        .join(", ");

      setShowDetailsForm(false);

      await handleSend(formatted, true);
      setShowSimTypeSelection(true);
      const prosperityMessage =
        "Great! Before we continue, please choose whether you want an eSIM or a Physical SIM.";

      setChat((prev) => [
        ...prev,
        {
          id: prev.length + 1,
          type: "bot",
          text: prosperityMessage,
          time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ]);
    } catch (error) {
      console.error("Error during form submission:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    sessionStorage.removeItem("custNo");
    sessionStorage.removeItem("userEmail");
    sessionStorage.removeItem("userDOB");
  }, []);

  const handleNewNumber = () => {
    setSelectedOption("new");
    setShowNumberTypeSelection(false);
    setShowConfirmNewNumber(true);
  };

  const confirmNewNumber = async (yes: boolean) => {
    setShowConfirmNewNumber(false);

    if (!yes) {
      setShowNumberTypeSelection(true);
      return;
    }

    setSelectedOption("new");
    setIsPorting(false);
    setHasSelectedNumber(false);
    setNumberDecisionMade(false);

    addBotMessage(
      "Thanks, now it's time to choose a number from the selection below."
    );

    await handleSend("new number");
  };

  // const handleExistingNumber = () => {
  //   setShowNumberTypeSelection(false);
  //   setShowConfirmNewNumber(true);
  //   setExistingNumberType(null);
  //   setShowArnInput(false);
  //   setArn("");
  //   setExistingPhone("");
  //   setShowConfirmExistingNumber(false);

  //   setShowExistingNumberOptions(true);
  // };
  const handleExistingNumber = () => {
    setShowNumberTypeSelection(false);
    setConfirmationType("existing");
    setShowNumberConfirmation(true);
    setExistingNumberType(null);
    setShowArnInput(false);
    setArn("");
    setExistingPhone("");
    setShowConfirmExistingNumber(false);
    setShowExistingNumberOptions(true);
  };
  const handleExistingTypeSelect = (type: "prepaid" | "postpaid") => {
    setExistingNumberType(type);
    setShowArnInput(type === "postpaid");
  };

  const handleExistingNumberSubmit = async () => {
    if (!existingPhone.match(/^04\d{8}$/)) {
      alert(
        "Please enter a valid 10-digit Australian mobile number starting with 04"
      );
      return;
    }

    if (existingNumberType === "postpaid" && !arn.trim()) {
      alert("Please enter your ARN (Account Reference Number)");
      return;
    }

    setLoading(true);

    try {
      localStorage.setItem("portingNumber", existingPhone);

      setIsPorting(true);
      setHasSelectedNumber(true);
      setShowNumberButtons(false);

      await new Promise((resolve) => setTimeout(resolve, 1500));

      if (!custNo) {
        addBotMessage(
          "We're having trouble fetching your customer ID. Please try again in a moment."
        );
        return;
      }

      const res = await fetch(
        "https://prosperity.omnisuiteai.com/api/v1/auth/otp",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            custNo,
            destination: existingPhone,
          }),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "OTP request failed");

      setOtpTransactionId(data.data.getOtp.transactionId);
      setShowExistingNumberOptions(false);
      setShowOtpInput(true);

      addBotMessage("OTP has been sent. Please enter it to proceed.");
    } catch (err) {
      console.error(err);
      addBotMessage("Failed to send OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    // Basic validation
    if (!existingPhone || !existingPhone.match(/^04\d{8}$/)) {
      addBotMessage("Cannot resend OTP: Invalid phone number.");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(
        "https://prosperity.omnisuiteai.com/api/v1/auth/otp",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            custNo,
            destination: existingPhone,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to resend OTP");
      }

      // Update transaction ID for the new OTP
      setOtpTransactionId(data.data.getOtp.transactionId);

      // Clear the previous OTP input
      setOtpCode("");

      // Inform user
      addBotMessage("A new OTP has been sent to your number.");
    } catch (err) {
      console.error(err);
      addBotMessage("Failed to resend OTP. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const confirmExistingNumber = (yes: boolean) => {
    setShowConfirmExistingNumber(false);
    if (yes) {
      localStorage.setItem("existingPhoneNumber", existingPhone);
      if (existingNumberType === "postpaid") {
        localStorage.setItem("arn", arn);
      }

      setIsPorting(true);
      setHasSelectedNumber(true);
      setSelectedSim(existingPhone);
      setNumberDecisionMade(true);

      setShowNumberButtons(false);
      if (selectedPlan) {
        setShowPlans(false);
        setShowSimTypeSelection(true);
      } else {
        setShowPlans(true);
      }

      addBotMessage(
        `Great! We'll port your existing number ${existingPhone}. Now please choose a plan.`
      );
    } else {
      setShowExistingNumberOptions(true);
    }
  };
  const addBotMessage = (text: string) => {
    setChat((prev) => [
      ...prev,
      {
        id: prev.length + 1,
        type: "bot" as const,
        text,
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      },
    ]);
  };

  const handleInitialOption = async (option: string) => {
    setShowInitialOptions(false);

    if (option === "buy-esim") {
      // Call API with "signup" query to open signup modal
      setLoading(true);
      await new Promise((res) => setTimeout(res, 50));

      const data = await callAPI("signup");
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

      // Check if response contains signup form indicators
      if (
        botText.toLowerCase().includes("first name") ||
        botText.toLowerCase().includes("surname")
      ) {
        addBotMessage("Please fill in the details in the given form below.");
        setShowDetailsForm(true);
        return;
      }

      // Add bot message if it's not empty
      if (botText.trim()) {
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
      }
    } else if (option === "account-problem") {
      // Enable typing for user to enter their query
      setIsTypingEnabled(true);
      addBotMessage(
        "Please describe your account, billing, or technical problem:"
      );
    } else if (option === "transfer-number") {
      // Set transfer flow flag and call API with "signup" query
      setIsTransferFlow(true);
      setLoading(true);
      await new Promise((res) => setTimeout(res, 50));

      const data = await callAPI("signup");
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

      // Check if response contains signup form indicators
      if (
        botText.toLowerCase().includes("first name") ||
        botText.toLowerCase().includes("surname")
      ) {
        addBotMessage("Please fill in the details in the given form below.");
        setShowDetailsForm(true);
        return;
      }

      // Add bot message if it's not empty
      if (botText.trim()) {
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
      }
    }
  };
  const callAPI = async (text: string) => {
    const payload = sessionId
      ? { query: text, session_id: sessionId, brand: "prosperity-tech" }
      : { query: text, brand: "prosperity-tech" };

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
      if (data.custNo) sessionStorage.setItem("custNo", data.custNo);

      return data;
    } catch (e) {
      console.error("API error:", e);
      return null;
    }
  };

  const handleSend = async (text: string, skipUserDisplay = false) => {
    if (!text.trim() || loading) return;

    if (!skipUserDisplay) {
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
    }
    setMessage("");
    setLoading(true);
    if (isDeleteIntent(text)) {
      try {
        const data = await callDeleteIntentAPI(text);

        setLoading(false);

        // show bot message from /chat/query
        if (data?.message) {
          addBotMessage(data.message);
        }

        // open modal AFTER success
        setPendingDeleteIntent(true);
        setShowDeleteModal(true);
        return;
      } catch (err) {
        setLoading(false);
        addBotMessage("Something went wrong. Please try again.");
        return;
      }
    }
    await new Promise((res) => setTimeout(res, 50));

    // Skip API call if it's a new number confirmation
    if (text.toLowerCase().includes("new number") && showConfirmNewNumber) {
      const botText = "Please choose a number from the selection below.";
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
      setLoading(false);
      return;
    }

    // Original API call for other messages
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

    // Prevent showing the form again if we're in the number selection flow
    if (
      botText.toLowerCase().includes("first name") ||
      botText.toLowerCase().includes("surname")
    ) {
      if (!showNumberTypeSelection && !showConfirmNewNumber) {
        addBotMessage("Please fill in the details in the given form below.");
        setShowDetailsForm(true);
      }
      return;
    }

    const matches = botText.match(/04\d{8}/g);
    if (
      matches?.length === 5 &&
      !isPorting &&
      !hasSelectedNumber &&
      !showOtpInput &&
      !isTransferFlow
    ) {
      setNumberOptions(matches);
      setShowNumberButtons(true);
      return;
    }

    // Only add bot message if it's not empty and not in inappropriate flow states
    if (botText.trim()) {
      // Don't show reserved numbers or eSIM/Physical SIM messages during OTP or existing number flows
      const isReservedNumbersMessage =
        botText.includes("reserved") && botText.includes("phone numbers");
      const isESimMessage = botText.includes(
        "Before we continue, please choose whether you want an eSIM"
      );

      if (
        (isReservedNumbersMessage &&
          (showOtpInput || showExistingNumberOptions || isTransferFlow)) ||
        (isESimMessage &&
          (showOtpInput || showExistingNumberOptions || isTransferFlow))
      ) {
        // Skip adding these messages during inappropriate flow states
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
    }
  };

  const handleNumberSelect = async (num: string) => {
    setSelectedSim(num);
    setHasSelectedNumber(true);
    setShowNumberButtons(false);
    setShowInitialOptions(false);
    setIsTypingEnabled(false);
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
      setShowPayment(true);
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

    setShowPayment(true);
  };

  const handleSimTypeSelect = (type: "esim" | "physical") => {
    setSimType(type);
    setShowSimTypeSelection(false);
    if (type === "physical") {
      setShowSimNumberInput(true);
    }
    setShowNumberTypeSelection(true);
    addBotMessage("Would you like a new number or use your existing number?");
  };

  const handleSimNumberContinue = async () => {
    const trimmedSim = simNumber.trim();

    if (trimmedSim.length !== 13) {
      alert("SIM number must be exactly 13 digits.");
      return;
    }

    try {
      const response = await fetch(
        `https://prosperity.omnisuiteai.com/api/v1/numbers/check/${trimmedSim}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const result = await response.json();

      if (!result?.data?.success) {
        alert("SIM number is not valid.");
        setShowSimNumberInput(true);
        return;
      }

      localStorage.setItem("physicalSimNumber", trimmedSim);
      setShowSimNumberInput(false);
      setShowPayment(true);
    } catch (error) {
      console.error("SIM check failed:", error);
      alert("Unable to verify SIM number. Please try again.");
      setShowSimNumberInput(true);
    }
  };

  const handleOtpVerify = async () => {
    if (otpCode.length !== 6) {
      alert("Please enter a 6-digit OTP");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(
        "https://prosperity.omnisuiteai.com/api/v1/auth/otp/verify",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            code: otpCode,
            transactionId: otpTransactionId,
          }),
        }
      );

      const data = await res.json();
      console.log("OTP Verify Response:", data);

      const isValid = data?.data?.verifyOtp?.valid === true;

      if (isValid) {
        setOtpVerified(true);
        setShowOtpInput(false);
        addBotMessage(
          "OTP verified successfully! Please choose a plan to continue."
        );

        if (!selectedPlan) {
          setShowPlans(true);
        } else {
          setShowPayment(true);
        }
        return;
      }

      const remaining = data?.data?.verifyOtp?.remainingAttempts ?? 0;
      const msg = data?.data?.verifyOtp?.message || "Invalid OTP";

      if (remaining > 0) {
        addBotMessage(`${msg}. You have ${remaining} attempt left.`);
      } else {
        addBotMessage(
          `${msg}. No attempts remaining. Please request a new OTP.`
        );
      }

      setOtpCode("");
    } catch (err) {
      console.error("OTP verification error:", err);
      addBotMessage(
        "Failed to verify OTP. Please check your connection and try again."
      );
      setOtpCode("");
    } finally {
      setLoading(false);
    }
  };

  const callDeleteIntentAPI = async (text: string) => {
    const res = await fetch("https://prosperity.omnisuiteai.com/chat/query", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: text }),
    });

    if (!res.ok) throw new Error("Delete intent API failed");

    return res.json();
  };

  const handleConfirmDelete = async () => {
    setShowDeleteModal(false);
    setPendingDeleteIntent(false);

    const storedCustNo = localStorage.getItem("custNo");

    if (!storedCustNo) {
      addBotMessage(
        "You need to sign up or log in first before deleting your account."
      );
      return;
    }

    try {
      await callAPI(`Yes I am sure, my custNo is -- ${storedCustNo}`);
      addBotMessage("Your account has been deleted successfully.");

      // optional cleanup
      localStorage.clear();
    } catch (err) {
      addBotMessage("Failed to delete your account. Please try again.");
    }
  };

  const handleActivateOrder = async () => {
    try {
      const isPorting =
        existingNumberType === "prepaid" || existingNumberType === "postpaid";
      const existingType = existingNumberType;
      const arn = localStorage.getItem("arn") || "";
      const dob = formData.dob || "";
      const portingNo = localStorage.getItem("portingNumber") || "";
      const activationNumber = isPorting ? portingNo : selectedSim || "";

      let body: any = {
        number: activationNumber,
        cust: {
          custNo,
          suburb: formData.suburb,
          postcode: formData.postcode,
          address: formData.address.trim(),
          email: formData.email,
        },
        planNo: String(selectedPlan?.planNo),
        simNo:
          simType === "physical"
            ? localStorage.getItem("physicalSimNumber") || ""
            : "",
      };
      if (isPorting) {
        body.numType = existingType;

        if (existingType === "prepaid") {
          // body.cust.dob = formatDob(dob);
          body.cust.dob = dob;
        } else if (existingType === "postpaid") {
          body.cust.arn = arn;
        }
      }

      console.log("Activation payload:", body);

      const url = isPorting
        ? "https://prosperity.omnisuiteai.com/api/v1/orders/activate/port"
        : "https://prosperity.omnisuiteai.com/api/v1/orders/activate";

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (!res.ok) throw new Error("Activation failed");
      const receiptNumber = data?.data?.orderId || "";
      const simLabel = simType === "esim" ? "eSIM" : "physical SIM";
      const activationMessage = `Great news... your ${simLabel} has been created with prosperity-tech.

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
      setFlowCompleted(true);
      setShowInitialOptions(false);
      setIsTypingEnabled(false);
    } catch (err) {
      console.error("Activation error:", err);

      const failureMessage = `Unfortunately, we couldn't complete your SIM activation.

This can sometimes happen if:
• Some of the details provided were incorrect
• There was a temporary system issue
• The selected number or SIM could not be validated

No worries — you can try again or choose one of the options below, and I’ll help you from there.`;

      setChat((prev) => [
        ...prev,
        {
          id: prev.length + 1,
          type: "bot",
          text: failureMessage,
          time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ]);

      setFlowCompleted(false);
      setShowInitialOptions(true);
      setIsTypingEnabled(false);
    }
  };

  const sendMessage = () => {
    handleSend(message);
  };

  return (
    <>
      {/* Background with image */}
      <div
        className="fixed inset-0 bg-black/40 z-40 bg-cover bg-center "
        style={{
          backgroundImage: "url('/images/bg.png')",
        }}
      />

      {/* Chat Modal */}
      <div className="fixed inset-0 flex items-center justify-center z-50 p-2 sm:p-4 md:p-0 overflow-y-auto">
        <div className="w-full sm:w-[50%] h-[70vh] sm:h-[65vh] md:max-h-[600px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden">
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
                className={`flex items-start gap-2 sm:gap-3 mb-3 sm:mb-4 md:mb-6 ${msg.type === "user" ? "justify-end" : "justify-start"
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
                  className={`${msg.type === "user"
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
              <div className="flex items-start gap-2 sm:gap-3 mb-3 sm:mb-4 md:mb-6 animate-fade-in">
                <div className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 bg-yellow-400 rounded-full flex items-center justify-center overflow-hidden shadow-sm">
                  <img
                    src="/images/bot.png"
                    alt="Loading Avatar"
                    className="w-full h-full rounded-full object-cover"
                  />
                </div>

                <div className="bg-white rounded-2xl px-4 py-2 shadow-md max-w-[90%] sm:max-w-[80%] md:max-w-[70%]">
                  <p className="text-[#0E3B5C] text-xs sm:text-sm font-medium">
                    Prosperity Assistant
                  </p>
                  <p className="text-[#0E3B5C] text-xs sm:text-sm leading-relaxed">
                    Preparing the next step{typingDots}
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
                    <Flatpickr
                      placeholder="dd/mm/yyyy"
                      value={formData.dob}
                      options={{
                        dateFormat: "d/m/Y",
                        maxDate: "today",
                      }}
                      onChange={([date]) => {
                        if (!date) return;

                        const day = String(date.getDate()).padStart(2, "0");
                        const month = String(date.getMonth() + 1).padStart(
                          2,
                          "0"
                        );
                        const year = date.getFullYear();
                        const newDob = `${day}/${month}/${year}`;

                        setFormData((prev) => ({
                          ...prev,
                          dob: newDob,
                        }));
                        const birthDate = new Date(
                          year,
                          date.getMonth(),
                          date.getDate()
                        );
                        const today = new Date();
                        let age = today.getFullYear() - birthDate.getFullYear();
                        const m = today.getMonth() - birthDate.getMonth();
                        if (
                          m < 0 ||
                          (m === 0 && today.getDate() < birthDate.getDate())
                        ) {
                          age--;
                        }
                        if (age < 18) {
                          setAgeError(
                            "You must be at least 18 years old to sign up."
                          );
                        } else {
                          setAgeError(""); // Clear error if now 18+
                        }
                        setFormErrors((prev: any) => ({ ...prev, dob: "" }));
                      }}
                      className="w-full p-2 rounded bg-transparent text-white border border-white/50 text-xs sm:text-sm"
                    />
                    {formErrors.dob && (
                      <p className="text-red-300 text-xs mt-1">
                        {formErrors.dob}
                      </p>
                    )}

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
                      <div>
                        <select
                          name="state"
                          value={formData.state}
                          onChange={(e) => {
                            setFormData((prev) => ({
                              ...prev,
                              state: e.target.value,
                            }));
                            setFormErrors((prev: any) => ({
                              ...prev,
                              state: "",
                            }));
                          }}
                          className="w-full p-1.5 sm:p-2 rounded bg-transparent text-white border border-white/50 text-xs sm:text-sm focus:outline-none"
                          required
                        >
                          <option value="" className="text-black">
                            Select State
                          </option>

                          {states.map((state: any, index) => (
                            <option
                              key={index}
                              value={state.code}
                              className="text-black"
                            >
                              {state.name ?? state.code}
                            </option>
                          ))}
                        </select>

                        {formErrors.state && (
                          <p className="text-red-300 text-xs mt-0.5 sm:mt-1">
                            {formErrors.state}
                          </p>
                        )}
                      </div>
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
                        placeholder="Create your 4-digit PIN"
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
                    <div>
                      <select
                        name="custAuthorityType"
                        value={formData.custAuthorityType}
                        onChange={(e) => {
                          setFormData((prev) => ({
                            ...prev,
                            custAuthorityType: e.target.value,
                          }));
                          setFormErrors((prev: any) => ({
                            ...prev,
                            custAuthorityType: "",
                          }));
                        }}
                        className="w-full p-1.5 sm:p-2 rounded bg-transparent text-white border border-white/50 text-xs sm:text-sm focus:outline-none"
                        required
                      >
                        <option
                          value=""
                          disabled
                          hidden
                          className="text-gray-400"
                        >
                          ID Type
                        </option>
                        <option value="DL" className="text-black">
                          Driver License
                        </option>
                        <option value="PA" className="text-black">
                          Passport
                        </option>
                        <option value="PI" className="text-black">
                          Proof of age Card
                        </option>
                      </select>

                      {formErrors.custAuthorityType && (
                        <p className="text-red-300 text-xs mt-0.5 sm:mt-1">
                          {formErrors.custAuthorityType}
                        </p>
                      )}
                    </div>
                    <div>
                      <input
                        name="custAuthorityNo"
                        value={formData.custAuthorityNo}
                        onChange={(e) => {
                          const value = e.target.value.substring(0, 20);
                          setFormData((prev) => ({
                            ...prev,
                            custAuthorityNo: String(value),
                          }));
                          setFormErrors((prev: any) => ({
                            ...prev,
                            custAuthorityNo: "",
                          }));
                        }}
                        placeholder="Your ID Number"
                        maxLength={20}
                        className="w-full p-1.5 sm:p-2 rounded bg-transparent text-white border border-white/50 text-xs sm:text-sm"
                        required
                      />
                      {formErrors.custAuthorityNo && (
                        <p className="text-red-300 text-xs mt-0.5 sm:mt-1">
                          {formErrors.custAuthorityNo}
                        </p>
                      )}
                    </div>
                  </div>
                  {ageError && (
                    <p className="text-red-400 font-semibold text-sm mt-2 col-span-2 text-center">
                      {ageError}
                    </p>
                  )}
                  <button
                    type="submit"
                    disabled={loading || ageError !== ""} // ← YEH ADD KARO
                    className={`mt-3 sm:mt-4 w-full py-3 rounded text-white font-semibold transition-opacity ${ageError
                      ? "bg-gray-500 cursor-not-allowed"
                      : "bg-[#2bb673] hover:opacity-90"
                      }`}
                  >
                    {loading ? "Submitting..." : "Submit Details"}
                  </button>
                </form>
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
                    disabled={loading}
                    className="bg-[#2bb673] text-white px-4 py-1 rounded hover:opacity-90 text-xs sm:text-sm"
                  >
                    {loading ? "Checking..." : "Continue"}
                  </button>
                </div>
              ) : showNumberTypeSelection ? (
                <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg border border-white/30 text-center">
                  <p className="text-white mb-3">
                    {isTransferFlow
                      ? "Since you're transferring your number, we'll use your existing number."
                      : "Do you want a new number or keep your existing one?"}
                  </p>
                  <div className="flex gap-3 justify-center">
                    {!isTransferFlow && (
                      <button
                        onClick={handleNewNumber}
                        className="bg-[#2bb673] text-white px-4 py-2 rounded"
                      >
                        New Number
                      </button>
                    )}
                    <button
                      onClick={handleExistingNumber}
                      className="bg-[#215988] text-white px-4 py-2 rounded"
                    >
                      Existing Number
                    </button>
                  </div>
                </div>
              ) : showConfirmNewNumber ? (
                <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg border border-white/30 text-center">
                  <p className="text-white mb-3">
                    Are you sure you want a{" "}
                    {selectedOption === "new"
                      ? "new number"
                      : "existing number"}
                    ?
                  </p>
                  <div className="flex gap-3 justify-center">
                    <button
                      onClick={() => confirmNewNumber(true)}
                      className="bg-green-600 text-white px-4 py-2 rounded"
                    >
                      Yes
                    </button>
                    <button
                      onClick={() => confirmNewNumber(false)}
                      className="bg-red-600 text-white px-4 py-2 rounded"
                    >
                      No
                    </button>
                  </div>
                </div>
              ) : showExistingNumberOptions ? (
                <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg border border-white/30">
                  <p className="text-white mb-3 text-center">
                    Is your existing number Prepaid or Postpaid?
                  </p>
                  <div className="flex gap-3 justify-center mb-4">
                    <button
                      onClick={() => handleExistingTypeSelect("prepaid")}
                      className={`px-4 py-2 rounded ${existingNumberType === "prepaid"
                        ? "bg-[#2bb673]"
                        : "bg-gray-600"
                        } text-white`}
                    >
                      Prepaid
                    </button>
                    <button
                      onClick={() => handleExistingTypeSelect("postpaid")}
                      className={`px-4 py-2 rounded ${existingNumberType === "postpaid"
                        ? "bg-[#2bb673]"
                        : "bg-gray-600"
                        } text-white`}
                    >
                      Postpaid
                    </button>
                  </div>

                  <div className="mb-3">
                    <input
                      type="tel"
                      value={existingPhone}
                      onChange={(e) =>
                        setExistingPhone(
                          e.target.value.replace(/\D/g, "").substring(0, 10)
                        )
                      }
                      placeholder="Enter your 10-digit mobile number (04xxxxxxxx)"
                      className="w-full p-2 rounded bg-transparent border border-white/50 text-white text-center"
                    />
                    {existingPhone && !existingPhone.match(/^04\d{8}$/) && (
                      <p className="text-red-300 text-xs mt-1">
                        Please enter a valid 10-digit Australian mobile number
                        starting with 04
                      </p>
                    )}
                  </div>

                  {showArnInput && (
                    <div className="mb-3">
                      <input
                        type="text"
                        value={arn}
                        onChange={(e) => {
                          const value = e.target.value;
                          setArn(value);
                          localStorage.setItem("arn", value);
                        }}
                        placeholder="Enter ARN (Account Reference Number)"
                        className="w-full p-2 rounded bg-transparent border border-white/50 text-white text-center"
                      />
                    </div>
                  )}

                  <button
                    onClick={handleExistingNumberSubmit}
                    disabled={
                      loading ||
                      !existingPhone.match(/^04\d{8}$/) ||
                      (existingNumberType === "postpaid" && !arn.trim())
                    }
                    className="w-full bg-[#2bb673] text-white py-2 rounded hover:opacity-90 disabled:opacity-50"
                  >
                    {loading ? "Processing..." : "Continue"}
                  </button>
                </div>
              ) : showConfirmExistingNumber ? (
                <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg border border-white/30 text-center">
                  <p className="text-white mb-3">
                    Are you sure you want to port {existingPhone}?
                  </p>
                  <div className="flex gap-3 justify-center">
                    <button
                      onClick={() => confirmExistingNumber(true)}
                      className="bg-green-600 text-white px-4 py-2 rounded"
                    >
                      Yes
                    </button>
                    <button
                      onClick={() => confirmExistingNumber(false)}
                      className="bg-red-600 text-white px-4 py-2 rounded"
                    >
                      No
                    </button>
                  </div>
                </div>
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
              ) : showOtpInput ? ( // OTP input only appears for existing numbers
                <div className="flex flex-col items-center gap-3 p-4 bg-white/10 rounded-lg border border-white/30 text-white">
                  <p className="text-sm sm:text-base">
                    Enter the OTP sent to your existing number:
                  </p>
                  <input
                    type="text"
                    maxLength={6}
                    value={otpCode}
                    onChange={(e) =>
                      setOtpCode(e.target.value.replace(/\D/g, ""))
                    }
                    className="w-full p-2 rounded bg-transparent border border-white/50 text-center text-white text-sm sm:text-base"
                    placeholder="Enter 6-digit OTP"
                    autoFocus
                  />
                  <button
                    onClick={handleOtpVerify}
                    disabled={otpCode.length !== 6}
                    className="bg-[#2bb673] text-white px-4 py-1 rounded hover:opacity-90 text-xs sm:text-sm"
                  >
                    {loading ? "Verifying..." : "Verify OTP"}
                  </button>

                  {/* Resend OTP Link */}
                  <button
                    onClick={handleResendOtp}
                    disabled={loading}
                    className="text-white/80 hover:text-white underline text-sm mt-4 transition-colors disabled:opacity-50"
                  >
                    Resend OTP
                  </button>
                </div>
              ) : showPayment &&
                selectedPlan &&
                (existingNumberType ? otpVerified : true) ? (
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
              ) : showInitialOptions && !flowCompleted ? (
                <div className="flex flex-col items-center gap-3 p-4 bg-white/10 backdrop-blur-sm rounded-lg border border-white/30 text-white">
                  <p className="text-sm sm:text-base text-center">
                    How can I help you today?
                  </p>
                  <div className="flex flex-col gap-2 w-full max-w-sm">
                    <button
                      onClick={() => handleInitialOption("buy-esim")}
                      className="bg-white text-[#0E3B5C] border border-gray-300 px-4 py-3 rounded-lg hover:bg-gray-50 text-xs sm:text-sm font-medium transition-colors"
                    >
                      Buy an eSIM / Physical SIM
                    </button>
                    <button
                      onClick={() => handleInitialOption("account-problem")}
                      className="bg-white text-[#0E3B5C] border border-gray-300 px-4 py-3 rounded-lg hover:bg-gray-50 text-xs sm:text-sm font-medium transition-colors"
                    >
                      Account, billing or Technical Problem
                    </button>
                    <button
                      onClick={() => handleInitialOption("transfer-number")}
                      className="bg-white text-[#0E3B5C] border border-gray-300 px-4 py-3 rounded-lg hover:bg-gray-50 text-xs sm:text-sm font-medium transition-colors"
                    >
                      Transfer my number
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2 sm:gap-3 border border-white/30 rounded-full px-3 sm:px-4 py-2 sm:py-3 bg-white/10 backdrop-blur-sm text-white">
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                    placeholder="Message..."
                    className="flex-1 bg-transparent text-white placeholder-white/70 text-xs sm:text-sm focus:outline-none"
                    disabled={!isTypingEnabled}
                  />

                  <button
                    onClick={sendMessage}
                    disabled={loading || !isTypingEnabled}
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
        {showDeleteModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
            <div className="bg-white rounded-xl p-6 w-[90%] max-w-sm shadow-2xl text-center">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                Delete Account
              </h3>
              <p className="text-sm text-gray-600 mb-6">
                Are you sure you want to delete your account?
              </p>

              <div className="flex justify-center gap-4">
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setPendingDeleteIntent(false);
                  }}
                  className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
                >
                  No
                </button>

                <button
                  onClick={handleConfirmDelete}
                  className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
                >
                  Yes
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ChatWindow;
