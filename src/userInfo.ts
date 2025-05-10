export type SubscriptionPlan = "basic" | "premium" | "pro";
export type SubscriptionStatus = "active" | "expired" | "cancelled";

export interface UserSubscription {
  id: string;
  plan: SubscriptionPlan;
  status: SubscriptionStatus;
  startDate: Date;
  endDate: Date;
  autoRenew: boolean;
}

export interface UserInfo {
  id: string;
  username: string;
  email: string;
  fullName: string;
  avatar?: string;
  subscription: UserSubscription;
  isActive: boolean;
  joinedDate: Date;
  lastLogin: Date;
}

export const isEmptyUser = (user?: UserInfo | null): boolean => {
  return !user || !user.id || user.id === "";
};

export const isSubscribed = (user?: UserInfo | null): boolean => {
  if (isEmptyUser(user)) return false;
  const currentDate = new Date();
  return (
    user!.subscription.status === "active" &&
    currentDate >= user!.subscription.startDate &&
    currentDate <= user!.subscription.endDate &&
    user!.isActive
  );
};

export const getSubscriptionStatus = (user?: UserInfo | null): string => {
  if (isEmptyUser(user)) return "Not logged in";
  if (isSubscribed(user)) {
    return `Subscribed (${user!.subscription.plan})`;
  }
  return "Not subscribed";
};

export const getRemainingDays = (user?: UserInfo | null): number => {
  if (isEmptyUser(user)) return 0;
  const currentDate = new Date();
  const endDate = user!.subscription.endDate;
  const diffTime = endDate.getTime() - currentDate.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

// export const userInfo: UserInfo = {
//   id: "1",
//   username: "john_doe",
//   email: "john@example.com",
//   fullName: "John Doe",
//   avatar: "/avatars/john.jpg",
//   subscription: {
//     id: "sub_1",
//     plan: "premium",
//     status: "active",
//     startDate: new Date("2025-05-01"),
//     endDate: new Date("2025-12-09"),
//     autoRenew: true,
//   },
//   isActive: true,
//   joinedDate: new Date("2023-12-01"),
//   lastLogin: new Date("2024-01-15"),
// };

export const userInfo: UserInfo = null;
