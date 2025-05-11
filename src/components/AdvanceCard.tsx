import { useState } from "react";
import {
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  Elements,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import stripePromise from "@/lib/clientStripe";

const elementStyle = {
  style: {
    base: {
      fontSize: "16px",
      color: "#424770",
      "::placeholder": {
        color: "#aab7c4",
      },
    },
    invalid: {
      color: "#9e2146",
    },
  },
};

const StripeInput = ({
  onPaymentMethod,
}: {
  onPaymentMethod: (paymentMethod: any) => void;
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [cardHolder, setCardHolder] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setIsProcessing(true);
    setError(null);

    try {
      const { error: billingDetailsError, paymentMethod } =
        await stripe.createPaymentMethod({
          type: "card",
          card: elements.getElement(CardNumberElement)!,
          billing_details: {
            name: cardHolder,
          },
        });

      if (billingDetailsError) {
        throw new Error(billingDetailsError.message);
      }

      onPaymentMethod(paymentMethod);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label>Card Holder Name</Label>
        <Input
          type="text"
          value={cardHolder}
          onChange={(e) => setCardHolder(e.target.value)}
          placeholder="John Doe"
          required
        />
      </div>

      <div className="space-y-2">
        <Label>Card Number</Label>
        <div className="border rounded-md p-3">
          <CardNumberElement options={elementStyle} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Expiry Date</Label>
          <div className="border rounded-md p-3">
            <CardExpiryElement options={elementStyle} />
          </div>
        </div>

        <div className="space-y-2">
          <Label>CVC</Label>
          <div className="border rounded-md p-3">
            <CardCvcElement options={elementStyle} />
          </div>
        </div>
      </div>

      {error && <div className="text-red-500 text-sm">{error}</div>}

      <button
        type="submit"
        disabled={!stripe || isProcessing}
        className="w-full bg-primary text-white py-3 rounded-md hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isProcessing ? "Processing..." : "Pay Now"}
      </button>
    </form>
  );
};

export const AdvancedCardInput = ({
  onPaymentMethod,
}: {
  onPaymentMethod: (paymentMethod: any) => void;
}) => {
  return (
    <Elements stripe={stripePromise}>
      <StripeInput onPaymentMethod={onPaymentMethod} />
    </Elements>
  );
};
