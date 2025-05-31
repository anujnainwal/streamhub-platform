import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Feature {
  name: string;
}
interface Plan {
  _id: string;
  name: string;
  price: { amount: number };
  interval: string;
  features: Feature[];
  plan_id: string;
}
interface SubscriptionPlanCardProps {
  plan: Plan;
  isActive: boolean;
  setSelectedPlan: (planName: string) => void;
  setSelectedPlanId: (planId: string) => void;
  isExpired?: boolean;
}
const SubscriptionPlanCard: React.FC<SubscriptionPlanCardProps> = ({
  plan,
  isActive,
  isExpired = false,
  setSelectedPlan,
  setSelectedPlanId,
}) => {
  return (
    <Card
      key={plan._id}
      className={`relative cursor-pointer transition-all duration-300 ${
        isActive
          ? "border-primary ring-2 ring-primary/20"
          : isExpired
          ? "border-destructive ring-2 ring-destructive/20"
          : ""
      }`}
      onClick={() => {
        setSelectedPlan(plan.name);
        setSelectedPlanId(plan.plan_id);
      }}
    >
      {/* Status Badge */}
      {(isActive || isExpired) && (
        <Badge
          className="absolute top-4 right-4 z-10"
          variant={isActive ? "default" : "destructive"}
        >
          {isActive ? "Active" : "Expired"}
        </Badge>
      )}
      <CardHeader>
        <CardTitle className="text-center">
          {plan?.name}
          {isActive && (
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
