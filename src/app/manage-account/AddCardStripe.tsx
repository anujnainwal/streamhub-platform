"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import {
  useStripe,
  useElements,
  PaymentElement,
} from "@stripe/react-stripe-js";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useGetPaymentMethodQuery } from "@/features/subscriptionApi/subscriptionApi";

const CheckoutForm = ({ onClose }: { onClose: () => void }) => {
  const stripe = useStripe();
  const elements = useElements();

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [peReady, setPeReady] = useState(false);

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

    if (setupIntent?.status === "succeeded") {
      toast.success("Card Added Successfully");
      await refetch();
      setLoading(false);
      onClose();
    } else {
      setErrorMsg("Something went wrong during card setup.");
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Loader until the PaymentElement is ready */}
      {!peReady && (
        <div className="flex justify-center my-4">
          <Loader2 className="animate-spin" size={32} />
        </div>
      )}

      {/* Hide the element until it's ready to avoid flicker */}
      <div className={peReady ? "block" : "hidden"}>
        <PaymentElement
          options={{ layout: "tabs" }}
          onReady={() => setPeReady(true)}
        />
      </div>

      {errorMsg && <p className="text-red-600">{errorMsg}</p>}

      <Button
        type="submit"
        disabled={loading || !stripe || !elements || !peReady}
      >
        {loading ? "Processing..." : "Save Card"}
      </Button>
    </form>
  );
};

export default CheckoutForm;
