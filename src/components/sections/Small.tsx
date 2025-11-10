"use client";
import React, { useEffect, useState } from "react";
import PlanCard from "./Cards";

interface Plan {
  _id: string;
  planName: string;
  price: number;
  network: string;
  isActive: boolean;
}

const PlansSection: React.FC = () => {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await fetch("https://bele.omnisuiteai.com/api/v1/plans");
        if (!response.ok) throw new Error("Failed to fetch plans");
        const data = await response.json();
        setPlans(data.data || []);
      } catch (err: any) {
        setError("Unable to load plans. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  // Extract numeric GB value (for sorting and categorization)
  const extractGB = (name: string) => {
    const match = name.match(/(\d+)\s*GB/i);
    return match ? parseInt(match[1]) : 0;
  };

  // Categorize
  const smallPlans = plans.filter(p => extractGB(p.planName) <= 40);
  const bigPlans = plans.filter(p => extractGB(p.planName) > 40);

  if (loading)
    return (
      <div className="text-center text-white py-20 bg-[#1D5E8E]">
        Loading plans...
      </div>
    );

  if (error)
    return (
      <div className="text-center text-red-300 py-20 bg-[#1D5E8E]">{error}</div>
    );

  return (
    <>
      {/* Small Plans Section */}
      {smallPlans.length > 0 && (
        <section className="w-full py-16 sm:py-20 bg-[#1D5E8E]">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-10">
              <h2 className="text-3xl sm:text-4xl font-semibold text-white">
                Small Plans
              </h2>
              <p className="mt-3 text-sm sm:text-base text-white/80">
                Perfect for light users — affordable, reliable, and fast.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {smallPlans.map(plan => {
                const dataMatch = plan.planName.match(/(\d+GB)/i);
                const dataAmount = dataMatch ? dataMatch[0] : "N/A";

                return (
                  <PlanCard
                    key={plan._id}
                    title={plan.planName}
                    data={dataAmount}
                    price={`$${plan.price.toFixed(2)}`}
                    features={[
                      `Network: ${plan.network}`,
                      "Unlimited calls to Australian numbers",
                      "Unlimited SMS",
                      "Auto recharge enabled",
                    ]}
                    highlight={plan.network === "5G"}
                  />
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Big Plans Section */}
      {bigPlans.length > 0 && (
        <section className="w-full py-16 sm:py-20 bg-[#f2f7fb]">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-10">
              <h2 className="text-3xl sm:text-4xl font-semibold text-[#1D5E8E]">
                Big Plans
              </h2>
              <p className="mt-3 text-sm sm:text-base text-gray-700">
                Ideal for heavy users, remote teams, and data-intensive workloads.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {bigPlans.map(plan => {
                const dataMatch = plan.planName.match(/(\d+GB)/i);
                const dataAmount = dataMatch ? dataMatch[0] : "N/A";

                return (
                  <PlanCard
                    key={plan._id}
                    title={plan.planName}
                    data={dataAmount}
                    price={`$${plan.price.toFixed(2)}`}
                    features={[
                      `Network: ${plan.network}`,
                      "Unlimited standard calls",
                      "Unlimited SMS",
                      "5G network access",
                    ]}
                    highlight={plan.network === "5G"}
                  />
                );
              })}
            </div>
          </div>
        </section>
      )}
    </>
  );
};

export default PlansSection;
