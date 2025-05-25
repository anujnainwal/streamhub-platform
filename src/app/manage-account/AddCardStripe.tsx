"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import {
  useStripe,
  useElements,
  PaymentElement,
} from "@stripe/react-stripe-js";
import { toast } from "sonner";
import { useGetPaymentMethodQuery } from "@/features/subscriptionApi/subscriptionApi";

const CheckoutForm = ({ onClose }: { onClose: () => void }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const activeTab = "payment"; // Replace with your actual tab state
  const { refetch } = useGetPaymentMethodQuery(undefined, {
    skip: activeTab !== "payment",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    if (!stripe || !elements) {
      setErrorMsg("Stripe.js has not loaded yet.");
      return;
    }

    setLoading(true);

    const { error, setupIntent } = await stripe.confirmSetup({
      elements,
      redirect: "if_required",
    });

    if (error) {
      setErrorMsg(error.message || "Failed to save card.");
      setLoading(false);
      return;
    }

    if (setupIntent && setupIntent.status === "succeeded") {
      toast.success("Card Added Successfully");

      refetch();

      setLoading(false);
      onClose();
    } else {
      setErrorMsg("Something went wrong during card setup.");
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="p-3 border rounded-md">
        <PaymentElement />
      </div>
      {errorMsg && <p className="text-red-600">{errorMsg}</p>}
      <Button type="submit" disabled={loading || !stripe}>
        {loading ? "Processing..." : "Save Card"}
      </Button>
    </form>
  );
};

export default CheckoutForm;
