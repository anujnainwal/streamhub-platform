import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Feature {
  _id: string;
  name: string;
  included: boolean;
  limit: number | null;
}

interface Plan {
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

interface SubscriptionPlanCardProps {
  plan: Plan;
  selectedPlanId: string | number | null;
  setSelectedPlan: (planName: string) => void;
  setSelectedPlanId: (planId: string | number) => void;

  setSelectedPlanDetails: (plan: Plan) => void;
}

const SubscriptionPlanCard: React.FC<SubscriptionPlanCardProps> = ({
  plan,
  setSelectedPlan,
  setSelectedPlanId,
  setSelectedPlanDetails,
  selectedPlanId,
}) => {
  return (
    <Card
      key={plan._id}
      // className={`relative cursor-pointer transition-all duration-300 border border-muted ${
      //   plan.isActive
      //     ? "border-[green] ring-2 ring-[green]"
      //     : "hover:border-primary/50 hover:shadow-md"
      // }`}
      className={`relative cursor-pointer transition-all duration-300 border ${
        plan.isActive
          ? "border-green-600 ring-2 ring-green-400"
          : plan.plan_id === selectedPlanId
          ? "border-blue-600 ring-2 ring-blue-300"
          : "border-muted hover:border-primary/50 hover:shadow-md"
      }`}
      onClick={() => {
        setSelectedPlan(plan.name);
        setSelectedPlanId(plan.plan_id);
        setSelectedPlanDetails(plan);
      }}
    >
      {/* Status Badge */}
      {plan.isActive && (
        <Badge
          className="absolute top-4 right-4 z-10"
          variant={plan.isActive ? "default" : "destructive"}
        >
          {plan.isActive ? "Active" : "Expired"}
        </Badge>
      )}
      <CardHeader>
        <CardTitle className="text-center">
          {plan?.name}
          {plan.isActive && (
            <div className="absolute top-4 right-12">
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
          {plan?.features?.map((feature, index) => (
            <li key={index} className="flex items-center gap-2 text-sm">
              <Check className="h-4 w-4 text-primary" />
              <span>{feature?.name}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};
export default SubscriptionPlanCard;
