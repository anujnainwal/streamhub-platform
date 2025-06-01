"use client";
import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import {
  useGetPaymentMethodQuery,
  useUpdateSubscriptionPlanMutation,
} from "@/features/subscriptionApi/subscriptionApi";
import { toast } from "sonner";

// Types for props
interface Feature {
  _id: string;
  name: string;
  included: boolean;
}

interface PlanDetails {
  _id: string;
  plan_id: number;
  name: string;
  description: string;
  type: string;
  status: string;
  price: {
    amount: number;
    currency: string;
  };
  interval: string;
  features: Feature[];
  amount: number;
  isActive: boolean;
}

interface SelectedPlanSummaryProps {
  selectedPlanDeatils: PlanDetails | null;
  setStep: (step: number) => void;
}

interface PaymentCard {
  id: string;
  brand: string;
  last4: string;
  expMonth: string;
  expYear: string;
  funding: string;
  country: string;
}

const SelectedPlanSummary: React.FC<SelectedPlanSummaryProps> = ({
  selectedPlanDeatils,
  setStep,
}) => {
  const router = useRouter();
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);

  const { data, isLoading, isError, error } = useGetPaymentMethodQuery(
    undefined,
    {
      skip: !selectedPlanDeatils,
    }
  );

  // Early return if no selected plan details
  if (!selectedPlanDeatils) {
    return (
      <div className="max-w-5xl mx-auto p-4 text-center text-gray-500">
        Please select a plan to see details.
      </div>
    );
  }

  const {
    name,
    description,
    price: { amount, currency },
    interval,
    features,
  } = selectedPlanDeatils;

  const handleCardSelect = (id: string) => {
    setSelectedCardId(id);
  };

  const [
    updateSubscriptionPlan,
    { isLoading: isUpdatePlanLoading, isSuccess, error: isUpdatePlanError },
  ] = useUpdateSubscriptionPlanMutation();

  const handleUpgrade = async () => {
    if (!selectedCardId) return;

    try {
      const result = await updateSubscriptionPlan({
        planId: selectedPlanDeatils.plan_id,
        cardId: selectedCardId,
      }).unwrap();

      console.log("Subscription updated:", result);
      toast.success(result?.message || "Subscription updated successfully!");
    } catch (err) {
      console.error("Update failed:", err);
      toast.error(
        (err as any)?.data?.message || "Failed to update subscription."
      );
    }
  };

  return (
    <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 p-4">
      {/* Left: Payment Method Selection */}
      <Card className="h-fit">
        <CardHeader>
          <CardTitle>Select Payment Method</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading && <p>Loading payment methods...</p>}
          {isError && (
            <p className="text-red-600">
              Failed to load payment methods. {(error as any)?.message}
            </p>
          )}

          {!isLoading &&
            !isError &&
            Array.isArray(data?.cards) &&
            data.cards.length > 0 && (
              <div className="space-y-4">
                {data.cards.map((card: any) => (
                  <label
                    key={card.id}
                    className={`border rounded-md p-3 flex items-center gap-4 cursor-pointer hover:bg-gray-50 transition ${
                      selectedCardId === card.id
                        ? "border-blue-500 bg-blue-50"
                        : ""
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={card.id}
                      checked={selectedCardId === card.id}
                      onChange={() => handleCardSelect(card.id)}
                      className="accent-blue-500"
                    />
                    <div>
                      <p className="font-medium capitalize">
                        {card.brand} ending in {card.last4}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Exp: {card.expMonth}/{card.expYear} | {card.funding} |{" "}
                        {card.country}
                      </p>
                    </div>
                  </label>
                ))}
              </div>
            )}

          {!isLoading && !isError && data?.cards?.length === 0 && (
            <p>No payment methods available.</p>
          )}
        </CardContent>
      </Card>

      {/* Right: Plan Summary */}
      <Card className="h-fit">
        <CardHeader>
          <CardTitle>{name} Plan Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-3">{description}</p>

          <p className="font-semibold mb-4">
            Price: {amount} {currency} / {interval.toLowerCase()}
          </p>

          <h3 className="font-semibold mb-2">Features:</h3>
          <ul className="list-disc list-inside space-y-1 mb-6">
            {features.map(({ _id, name, included }) => (
              <li
                key={_id}
                className={
                  included ? "text-green-600" : "text-red-500 line-through"
                }
              >
                {name}{" "}
                {!included && <span className="text-sm">(Not Included)</span>}
              </li>
            ))}
          </ul>

          <div className="flex justify-between items-center gap-4">
            <Button variant="outline" onClick={() => setStep(1)}>
              ← Back
            </Button>
            <Button
              onClick={handleUpgrade}
              disabled={!selectedCardId || isUpdatePlanLoading}
              className={
                !selectedCardId || isUpdatePlanLoading
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }
            >
              {isUpdatePlanLoading ? "Updating..." : "Continue to Upgrade →"}
            </Button>
          </div>

          {isUpdatePlanError && (
            <p className="text-red-600 mt-4">
              {(isUpdatePlanError as any)?.data?.message ||
                "Failed to update subscription."}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SelectedPlanSummary;
