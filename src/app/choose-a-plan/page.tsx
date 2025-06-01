"use client";

import React, { useState } from "react";
import {
  useCreateCheckoutSessionMutation,
  useGetPlansQuery,
} from "@/features/subscriptionApi/subscriptionApi";
import { useForm } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import Joi, { isError } from "joi";
import { Button } from "@/components/ui/button";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Loader2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useRegisterUserMutation } from "@/features/auth/authApi";
import { toast } from "sonner";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useRouter } from "next/navigation";
import SubscriptionPlanCard from "./SubscriptionPlanCard";
import { useSelector } from "react-redux";
import UpdatingPlan from "./UpdatingPlan";

const SubscriptionPlansPage = () => {
  const router = useRouter();
  let authInfo = useSelector((state: any) => state.authInfo);
  const [selectedPlan, setSelectedPlan] = useState<string>("Standard");
  const [selectedPlanId, setSelectedPlanId] = useState<any>("");
  const [selectedPlanDeatils, setSelectedPlanDetails] = useState<any>(null);

  const [step, setStep] = useState<number>(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const { data, error, isLoading }: any = useGetPlansQuery();
  const [token, setToken] = useLocalStorage<string>("token", "");

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-lg font-medium text-muted-foreground">
          Loading subscription plans...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Card className="w-[400px]">
          <CardHeader className="text-center text-destructive">
            <CardTitle>Error Loading Plans</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center text-muted-foreground">
              Failed to load subscription plans. Please try again later.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 py-12 px-4 md:px-10">
      <div className="max-w-4xl mx-auto">
        <div className="space-y-6 text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-900">
            {step === 1 ? "Choose Your Plan" : "Complete Your Profile"}
          </h1>
          <Progress
            value={step === 1 ? 50 : 100}
            className="w-[200px] mx-auto"
          />
        </div>

        {step === 1 ? (
          <>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-10">
              {data?.data?.plans?.map((plan: any) => {
                // const isActive = selectedPlan === plan.name;
                const isActive =
                  authInfo?.userInfo?.subscribePlanId === plan._id;

                return (
                  <React.Fragment key={plan._id}>
                    <SubscriptionPlanCard
                      plan={plan}
                      setSelectedPlan={setSelectedPlan}
                      setSelectedPlanId={setSelectedPlanId}
                      selectedPlanId={selectedPlanId}
                      setSelectedPlanDetails={setSelectedPlanDetails}
                    />
                  </React.Fragment>
                );
              })}
            </div>
            <div className="flex justify-center">
              <Button
                size="lg"
                onClick={() => setStep(2)}
                disabled={!selectedPlan}
                className="min-w-[200px]"
              >
                Continue with {selectedPlan}
              </Button>
            </div>
          </>
        ) : (
          <>
            <UpdatingPlan
              setStep={setStep}
              selectedPlan={selectedPlan}
              isProcessing={isProcessing}
              setIsProcessing={setIsProcessing}
              selectedPlanId={selectedPlanId}
              token={token}
              setToken={setToken}
              isActive={true}
              selectedPlanDeatils={selectedPlanDeatils}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default SubscriptionPlansPage;
