"use client";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import { Button } from "@/components/ui/button";
import Joi from "joi";
import { useRegisterUserMutation } from "@/features/auth/authApi";
import { useCreateCheckoutSessionMutation } from "@/features/subscriptionApi/subscriptionApi";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

const signupSchema = Joi.object({
  firstname: Joi.string().required().min(2).messages({
    "string.empty": "First name is required",
    "string.min": "First name must be at least 2 characters",
  }),
  lastname: Joi.string().required().min(2).messages({
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
  firstname: string;
  lastname: string;
  username: string;
  email: string;
  password: string;
}
interface UpdatePlanProps {
  setStep: (step: number) => void;
  selectedPlan: any;
  isActive: boolean;
  isExpired?: boolean;
  isProcessing: boolean;
  selectedPlanId: string;
  setIsProcessing: (processing: boolean) => void;
  setToken: (token: string) => void;
  token: string;
}

const UpdatingPlan: React.FC<UpdatePlanProps> = ({
  setStep,
  selectedPlanId,
  setIsProcessing,
  setToken,
  isProcessing,
  token,
}) => {
  let router = useRouter();
  const form = useForm<SignupFormData>({
    resolver: joiResolver(signupSchema),
    defaultValues: {
      firstname: "",
      lastname: "",
      username: "",
      email: "",
      password: "",
    },
  });
  const [registerUser, registerUserStatus] = useRegisterUserMutation();
  const [createSession, { isLoading: isCheckoutLoading }] =
    useCreateCheckoutSessionMutation();

  const {
    isLoading: isRegisterLoading,
    isSuccess: isRegisterSuccess,
    isError: isRegisterError,
    error: registerError,
  } = registerUserStatus;
  const onSubmit = async (data: SignupFormData) => {
    setIsProcessing(true);
    let formDetails: any = {
      ...data,
      planId: selectedPlanId,
    };
    try {
      const response: any = await registerUser(formDetails).unwrap();
      console.log("Registration success:", response);
      if (response.status) {
        toast.success("User Registered Successfully.");
        let userId = response?.data?.newUser?._id;
        if (response.data?.token) {
          setToken(response.data.token);
        }

        const repose: any = await createSession({
          user_id: userId,
          planId: selectedPlanId,
        }).unwrap();

        console.log("Checkout session created:", repose);
        if (repose.status) {
          // window.location.href = repose?.data?.sessionUrl;
          router.push(repose?.data?.sessionUrl);
        }
      }
    } catch (error: any) {
      console.error("Registration error:", error);
      // let { error: errorDetails } = error.data;
      // toast.error(errorDetails.message);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div>
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-center">Create Your Account</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="firstname"
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
                  name="lastname"
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
                {/* <Button type="submit" className="flex-1">
                      Complete Sign Up
                    </Button> */}
                <Button
                  type="submit"
                  className="flex-1"
                  disabled={
                    isProcessing ||
                    isCheckoutLoading ||
                    registerUserStatus.isLoading
                  }
                >
                  {isProcessing ||
                  isCheckoutLoading ||
                  registerUserStatus.isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {registerUserStatus.isLoading
                        ? "Registering..."
                        : isCheckoutLoading
                        ? "Processing Payment..."
                        : "Processing..."}
                    </>
                  ) : (
                    "Complete Sign Up"
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default UpdatingPlan;
