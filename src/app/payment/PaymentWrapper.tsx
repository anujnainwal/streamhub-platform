import React, { Suspense } from "react";
import PaymentSuccessPage from "./PaymentSuccessPage "; // your component with useSearchParams

export default function PaymentWrapper() {
  return (
    <Suspense fallback={<div>Loading payment status...</div>}>
      <PaymentSuccessPage />
    </Suspense>
  );
}
