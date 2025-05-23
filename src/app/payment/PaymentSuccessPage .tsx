"use client";

import React from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Copy, CheckCircle, Loader2, XCircle } from "lucide-react";
import { useGetVerifyPaymentQuery } from "@/features/subscriptionApi/subscriptionApi";

export default function PaymentSuccessPage() {
  const router = useRouter();
  const params: any = useSearchParams();
  const sessionId = params.get("sessionId") ?? "";
  const userId = params.get("userId") ?? "";
  const cancel = params.get("cancel") ?? "";
  const planId = params.get("planId") ?? "";

  // If cancel=2 and planId is present, show cancel UI
  if (cancel === "true") {
    // const plan = plansData.find(
    //   (p: any) => p.id === planId || p.plan_id === planId
    // );
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto p-4 bg-yellow-100 rounded-full">
              <XCircle className="h-8 w-8 text-yellow-600" aria-hidden />
            </div>
            <CardTitle className="text-2xl font-semibold">
              Subscription Cancelled
            </CardTitle>
            <p className="text-gray-600">
              You have cancelled the plan
              {/* {plan ? (
                <>
                  : <span className="font-bold">{plan.name}</span> for{" "}
                  <span className="font-bold">
                    ${plan.price?.amount ?? plan.price}
                  </span>
                </>
              ) : (
                "."
              )} */}
            </p>
          </CardHeader>
          <CardFooter className="flex justify-center">
            <Button onClick={() => router.push("/plans")}>
              Choose Another Plan
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  if (!sessionId || !userId) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center space-y-4">
            <XCircle className="h-8 w-8 text-red-600 mx-auto" aria-hidden />
            <CardTitle className="text-2xl font-semibold">
              Invalid Payment Link
            </CardTitle>
            <p className="text-gray-600">
              Missing payment session or user information.
            </p>
          </CardHeader>
          <CardFooter className="flex justify-center">
            <Button onClick={() => router.push("/")}>Go Home</Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  const { data, isLoading, isError } = useGetVerifyPaymentQuery(
    { sessionId, userId },
    { skip: !sessionId || !userId }
  );

  const result: any = data;
  console.log("res", result);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(sessionId);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <Loader2 className="h-10 w-10 animate-spin text-indigo-500" />
        <span className="ml-2 text-lg text-gray-600">Verifying payment…</span>
      </div>
    );
  }

  // Failure UI
  if (isError || !result?.stripe_status || !result?.paid) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto p-4 bg-red-100 rounded-full">
              <XCircle className="h-8 w-8 text-red-600" aria-hidden />
            </div>
            <CardTitle className="text-2xl font-semibold">
              Verification Failed
            </CardTitle>
            <p className="text-gray-600">
              {result?.message ||
                "We couldn't verify your payment. Please try again."}
            </p>
          </CardHeader>
          <CardFooter className="flex justify-center space-x-4">
            <Button onClick={() => router.push("/plans")}>
              Return to Plans
            </Button>
            <Button onClick={() => router.push("/support")} variant="outline">
              Contact Support
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  // Success UI
  return (
    <div className="flex items-center justify-center h-screen bg-gray-50 p-4">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto p-4 bg-green-100 rounded-full">
            <CheckCircle className="h-8 w-8 text-green-600" aria-hidden />
          </div>
          <CardTitle className="text-2xl font-semibold">
            Payment Successful!
          </CardTitle>
          <div className="text-gray-600 space-y-1">
            <p>
              Stripe status:{" "}
              <span className="font-medium">{result.stripe_status}</span>
            </p>
            <p>
              Subscription:{" "}
              <span className="font-medium">{result.subscription_status}</span>
            </p>
            <p>{result.message}</p>
          </div>
        </CardHeader>

        <CardContent className="flex justify-center mt-4">
          <div className="max-w-full overflow-x-auto">
            <Badge
              variant="secondary"
              className="inline-flex items-center space-x-2 px-4 py-2 break-all"
              title="Session ID"
            >
              <span className="font-medium">Session ID:</span>
              <code className="font-mono text-sm">{sessionId}</code>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Copy session ID"
                className="ml-2 shrink-0"
                onClick={copyToClipboard}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </Badge>
          </div>
        </CardContent>

        <CardFooter className="flex justify-center space-x-4">
          <Button onClick={() => router.push("/")}>Go to Dashboard</Button>
          <Button
            variant="outline"
            onClick={() => router.push("/account/subscriptions")}
          >
            View Subscription
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
