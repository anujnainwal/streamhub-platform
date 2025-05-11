"use client";

import React, { useState } from "react";
import { useGetPlansQuery } from "@/features/subscriptionApi/subscriptionApi";
import { useForm } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import Joi from "joi";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Loader2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";

const signupSchema = Joi.object({
  firstName: Joi.string().required().min(2).messages({
    "string.empty": "First name is required",
    "string.min": "First name must be at least 2 characters",
  }),
  lastName: Joi.string().required().min(2).messages({
    "string.empty": "Last name is required",
    "string.min": "Last name must be at least 2 characters",
  }),
  email: Joi.string().email({ tlds: false }).required().messages({
    "string.empty": "Email is required",
    "string.email": "Please enter a valid email",
  }),
  username: Joi.string().min(3).max(30).required().trim(),
  password: Joi.string()
    .required()
    .min(8)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .messages({
      "string.empty": "Password is required",
      "string.min": "Password must be at least 8 characters",
      "string.pattern.base":
        "Password must contain at least one uppercase letter, one lowercase letter, and one number",
    }),
});

interface SignupFormData {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
}

const SubscriptionPlansPage = () => {
  const [selectedPlan, setSelectedPlan] = useState<string>("Standard");
  const [selectedPlanId, setSelectedPlanId] = useState<string>("");
  const [step, setStep] = useState<number>(1);
  const { data, error, isLoading } = useGetPlansQuery({ page: 1, limit: 10 });
  const form = useForm<SignupFormData>({
    resolver: joiResolver(signupSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      username: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = (data: SignupFormData) => {
    console.log({ ...data, planId: selectedPlanId });
  };

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
                const isActive = selectedPlan === plan.name;
                {
                  console.log("Sadsad", plan);
                }
                return (
                  <Card
                    key={plan._id}
                    className={`cursor-pointer transition-all duration-300 ${
                      isActive ? "border-primary ring-2 ring-primary/20" : ""
                    }`}
                    onClick={() => {
                      setSelectedPlan(plan.name);
                      setSelectedPlanId(plan.plan_id);
                    }}
                  >
                    <CardHeader>
                      <CardTitle className="text-center">
                        {plan?.name}
                        {isActive && (
                          <div className="absolute top-4 right-4">
                            <Check className="h-5 w-5 text-primary" />
                          </div>
                        )}
                      </CardTitle>
                      <div className="text-3xl font-bold text-center mt-2">
                        ${plan?.price?.amount}
                        <span className="text-sm text-muted-foreground ml-1">
                          /{plan?.interval.toLowerCase()}
                        </span>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3">
                        {plan?.features?.map((feature: any, index: number) => (
                          <li
                            key={index}
                            className="flex items-center gap-2 text-sm"
                          >
                            <Check className="h-4 w-4 text-primary" />
                            <span>{feature?.name}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
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
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle className="text-center">Create Your Account</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>First Name</FormLabel>
                          <FormControl>
                            <Input placeholder="John" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Last Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Doe" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Username</FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            placeholder="your username"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="john@example.com"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="********"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex gap-4 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setStep(1)}
                      className="flex-1"
                    >
                      Back
                    </Button>
                    <Button type="submit" className="flex-1">
                      Complete Sign Up
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default SubscriptionPlansPage;
