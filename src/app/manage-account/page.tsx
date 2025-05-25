"use client";

import * as React from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useGetPaymentMethodQuery } from "@/features/subscriptionApi/subscriptionApi";
import { Loader } from "@/components/loader/Loader";

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import CheckoutForm from "./AddCardStripe";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import appearance from "@/constant/stripe/stripe.constant";
import getCardIcon from "@/constant/stripe/card";
import CardItem from "./CardListing";
import { AnyAaaaRecord } from "dns";
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

const ManageAccountPage = () => {
  const [activeTab, setActiveTab] = React.useState("plans");
  const [open, setOpen] = React.useState(false);

  // Only fetch payment method when 'payment' tab is active
  const { data, isError, isLoading } = useGetPaymentMethodQuery(undefined, {
    skip: activeTab !== "payment",
  });

  const [cardsState, setCardsState] = React.useState(data?.cards);

  const setDefaultCard = async (cardId: any) => {
    // Simulate an API call with delay
    await new Promise((r) => setTimeout(r, 1500));

    setCardsState((prev: any) =>
      prev.map((card: any) => ({
        ...card,
        isDefault: card.id === cardId,
      }))
    );
  };

  return (
    <div className="max-w-6xl mx-auto py-12 px-4 lg:px-0">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight text-gray-900">
          Account Settings
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Manage your plan, billing, devices, and payment details.
        </p>
      </div>

      <Tabs
        defaultValue="plans"
        className="w-full space-y-6"
        value={activeTab}
        onValueChange={setActiveTab}
      >
        {/* Tab Navigation */}
        <TabsList className="w-full cursor-pointer justify-start flex-wrap gap-4 border-b">
          <TabsTrigger value="plans" className="cursor-pointer">
            My Plan
          </TabsTrigger>
          <TabsTrigger value="payment" className="cursor-pointer">
            Payment Method
          </TabsTrigger>
          <TabsTrigger value="invoices" className="cursor-pointer">
            Invoices
          </TabsTrigger>
          <TabsTrigger value="devices" className="cursor-pointer">
            My Devices
          </TabsTrigger>
        </TabsList>

        {/* Plans */}
        <TabsContent value="plans">
          <Card>
            <CardHeader>
              <CardTitle>Current Plan</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <p className="text-base font-medium">Pro Plan</p>
                <p className="text-sm text-muted-foreground">
                  Billed monthly at $20
                </p>
                <p className="text-xs text-gray-500">
                  Next renewal: June 21, 2025
                </p>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="secondary">
                  Downgrade
                </Button>
                <Button size="sm" variant="default">
                  Upgrade
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Payment */}
        <TabsContent value="payment">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Primary Payment Method</CardTitle>
              </div>
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                  <Button>Add Card</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Add a new card</DialogTitle>
                    <DialogDescription>
                      Securely add your payment method using Stripe.
                    </DialogDescription>
                  </DialogHeader>
                  <Elements
                    stripe={stripePromise}
                    options={{
                      locale: "en",
                      appearance: appearance,
                      clientSecret: data?.setupIntentClientSecret || "",
                    }}
                  >
                    <CheckoutForm onClose={() => setOpen(false)} />
                  </Elements>
                </DialogContent>
              </Dialog>
            </CardHeader>

            {isLoading ? (
              <div className="flex justify-center items-center py-12">
                <Loader size="large" />
              </div>
            ) : (
              <CardContent className="space-y-6">
                {isError && (
                  <p className="text-red-500 text-sm">
                    Failed to load payment method.
                  </p>
                )}

                {data?.cards && data?.cards.length > 0 ? (
                  data.cards.map((card) => (
                    <CardItem
                      key={card.id}
                      card={card}
                      onSetDefault={setDefaultCard}
                    />
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center py-8">
                    <p className="text-muted-foreground">
                      No payment methods found.
                    </p>
                  </div>
                )}
              </CardContent>
            )}
          </Card>
        </TabsContent>

        {/* Invoices */}
        <TabsContent value="invoices">
          <Card>
            <CardHeader>
              <CardTitle>Billing History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="text-left text-muted-foreground border-b">
                      <th className="py-2 pr-4">Invoice</th>
                      <th className="py-2 pr-4">Date</th>
                      <th className="py-2 pr-4">Amount</th>
                      <th className="py-2">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { id: "12345", date: "20 May 2025", amount: "$20" },
                      { id: "12346", date: "20 April 2025", amount: "$20" },
                      { id: "12347", date: "20 March 2025", amount: "$20" },
                    ].map((invoice) => (
                      <tr
                        key={invoice.id}
                        className="border-b last:border-none"
                      >
                        <td className="py-2 pr-4">{invoice.id}</td>
                        <td className="py-2 pr-4">{invoice.date}</td>
                        <td className="py-2 pr-4">{invoice.amount}</td>
                        <td className="py-2">
                          <Button size="sm" variant="outline">
                            Download
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Devices */}
        <TabsContent value="devices">
          <Card>
            <CardHeader>
              <CardTitle>Signed-in Devices</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="text-sm space-y-2">
                <li>Windows 11 · Chrome · New York · 20 May 2025</li>
                <li>iPhone 14 · Safari · Delhi · 19 May 2025</li>
              </ul>
              <Button size="sm" variant="destructive">
                Sign Out All Devices
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ManageAccountPage;
