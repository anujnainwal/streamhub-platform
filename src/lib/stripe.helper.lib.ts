import customStripe from "./stripe";
interface StripeCustomerData {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  metadata?: Record<string, string>;
}
export const createStripeCustomer = async ({
  firstName,
  lastName,
  email,
  username,
  metadata = {},
}: StripeCustomerData) => {
  try {
    const customer = await customStripe.customers.create({
      name: `${firstName} ${lastName}`,
      email,
      metadata: {
        username,
        firstName,
        lastName,
        ...metadata,
      },
    });

    return customer;
  } catch (error: any) {
    throw new Error(`Failed to create Stripe customer: ${error.message}`);
  }
};

export const getCustomerByEmail = async (email: string) => {
  try {
    const customers = await customStripe.customers.list({
      email,
      limit: 1,
    });
    console.log("==>customers", customers);
    return customers.data[0] || null;
  } catch (error: any) {
    throw new Error(`Failed to fetch customer: ${error.message}`);
  }
};

export const getCustomerById = async (customerId: string) => {
  try {
    const customer = await customStripe.customers.retrieve(customerId);

    return customer;
  } catch (error: any) {
    throw new Error(`Failed to fetch customer: ${error.message}`);
  }
};
