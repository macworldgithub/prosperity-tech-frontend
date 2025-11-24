"use client";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store/reduxStore";
import { motion, AnimatePresence } from "framer-motion";
import { PaymentCard } from "./PaymentCard";
import { Text } from "./Text";
import { Heading } from "./Heading";
import { Button } from "./Button";
import { fetchCustomerServices } from "@/app/api/service";

interface Plan {
  _id: string;
  planName: string;
  planNo?: string;
  price: number;
  network: string;
  isActive: boolean;
}

interface ServiceDetail {
  planName: string;
  planNo?: string;
}

export default function ChangePlan() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [services, setServices] = useState<ServiceDetail[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);

  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const fetchServicesData = async () => {
      try {
        const result: any = await dispatch(fetchCustomerServices());
        setServices(result.payload?.data?.services?.serviceDetails || []);
      } catch (err) {
        console.error("Error fetching services:", err);
      }
    };

    fetchServicesData();
  }, [dispatch]);

  const currentPlanName = services[0]?.planName || "";

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await fetch(
          "https://prosperity.omnisuiteai.com/api/v1/plans"
        );
        if (!response.ok) throw new Error("Failed to fetch plans");

        const data = await response.json();
        setPlans(data.data || []);
      } catch (err) {
        console.error("Error fetching plans:", err);
        setError("Unable to load plans. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  const handleChoose = (plan: Plan) => {
    setSelectedPlan(plan);
  };

  const handleClosePayment = () => setSelectedPlan(null);

  const handlePaymentComplete = (success: boolean) => {
    if (success) {
      alert("Plan changed successfully!");
      window.location.reload();
    }
  };

  const custNo =
    typeof window !== "undefined" ? localStorage.getItem("custNo") : "";

  if (loading)
    return (
      <div className="text-center text-gray-600 py-20 bg-white">
        <Text>Loading plans...</Text>
      </div>
    );

  if (error)
    return (
      <div className="text-center text-red-500 py-20 bg-white">
        <Text variant="highlight">{error}</Text>
      </div>
    );

  return (
    <section className="py-20 px-4 bg-white text-center relative">
      <Heading
        title="Change Your Plan"
        subtitle="Choose a new plan that suits your needs"
        align="center"
        level={3}
      />

      <div
        className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto transition-all ${
          selectedPlan ? "blur-sm pointer-events-none" : ""
        }`}
      >
        {plans.map((plan) => {
          const dataMatch = plan.planName.match(/(\d+GB)/i);
          const dataAmount = dataMatch ? dataMatch[0] : "N/A";

          const isCurrentPlan =
            currentPlanName.trim().toLowerCase() ===
            plan.planName.trim().toLowerCase();

          return (
            <div
              key={plan._id}
              className={`rounded-2xl p-6 flex flex-col items-center shadow-sm hover:shadow-md transition cursor-pointer ${
                plan.network === "5G"
                  ? "bg-linear-to-b from-indigo-50 to-white border-2 border-indigo-200"
                  : "bg-gray-50 border border-gray-200"
              }`}
            >
              <Text variant="highlight" className="mb-1">
                {dataAmount}
              </Text>

              <Text className="text-lg font-semibold text-gray-800 mb-2">
                {plan.planName}
              </Text>

              <Text className="text-3xl font-bold text-gray-900">
                ${plan.price.toFixed(2)}
                <span className="text-base text-gray-500 font-normal">
                  /month
                </span>
              </Text>

              {isCurrentPlan ? (
                <Button
                  variant="outline"
                  size="md"
                  fullWidth
                  disabled
                  className="mt-4 mb-6 opacity-60 cursor-not-allowed"
                >
                  Current Plan
                </Button>
              ) : (
                <Button
                  onClick={() => handleChoose(plan)}
                  variant={plan.network === "5G" ? "primary" : "outline"}
                  size="md"
                  fullWidth
                  className="mt-4 mb-6"
                >
                  Choose This Plan
                </Button>
              )}
            </div>
          );
        })}
      </div>

      <AnimatePresence>
        {selectedPlan && custNo && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            <motion.div
              className="fixed inset-0 flex justify-center items-center z-50 p-4"
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 20 }}
              transition={{ duration: 0.25 }}
            >
              <div className="relative w-full max-w-lg">
                <button
                  onClick={handleClosePayment}
                  className="absolute -top-3 -right-3 bg-white shadow-md p-2 rounded-full hover:bg-gray-100 z-50 cursor-pointer"
                >
                  ✕
                </button>

                <PaymentCard
                  custNo={custNo}
                  planName={selectedPlan.planName}
                  planPrice={selectedPlan.price}
                  planNo={selectedPlan.planNo}
                  fromChangePlan={true}
                  onPaymentComplete={handlePaymentComplete}
                />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </section>
  );
}
