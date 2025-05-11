import Joi from "joi";

export const subscriptionPlanValidationSchema = Joi.object({
  plan_id: Joi.number().integer().required().messages({
    "any.required": "Plan ID is required",
    "number.base": "Plan ID must be a number",
  }),

  name: Joi.string().trim().required().messages({
    "any.required": "Plan name is required",
    "string.base": "Plan name must be a string",
  }),

  description: Joi.string().trim().required().messages({
    "any.required": "Plan description is required",
    "string.base": "Plan description must be a string",
  }),

  type: Joi.string()
    .valid("BASIC", "STANDARD", "PREMIUM", "ENTERPRISE")
    .default("BASIC")
    .required()
    .messages({
      "any.only": "Type must be one of BASIC, STANDARD, PREMIUM, ENTERPRISE",
      "any.required": "Type is required",
    }),

  price: Joi.object({
    amount: Joi.number().min(0).required().messages({
      "any.required": "Price amount is required",
      "number.min": "Price amount must be at least 0",
    }),
    currency: Joi.string().uppercase().default("USD").messages({
      "string.base": "Currency must be a string",
    }),
  })
    .required()
    .messages({
      "any.required": "Price is required",
    }),

  interval: Joi.string()
    .valid("DAILY", "WEEKLY", "MONTHLY", "YEARLY")
    .default("DAILY")
    .required()
    .messages({
      "any.only": "Interval must be one of DAILY, WEEKLY, MONTHLY, YEARLY",
      "any.required": "Interval is required",
    }),

  features: Joi.array()
    .items(
      Joi.object({
        name: Joi.string().required().messages({
          "any.required": "Feature name is required",
        }),
        included: Joi.boolean().required().messages({
          "any.required": "Feature included flag is required",
        }),
        limit: Joi.number().allow(null).messages({
          "number.base": "Feature limit must be a number or null",
        }),
      })
    )
    .messages({
      "array.base": "Features must be an array",
    }),

  status: Joi.string()
    .valid("ACTIVE", "INACTIVE", "DEPRECATED")
    .default("ACTIVE")
    .messages({
      "any.only": "Status must be one of ACTIVE, INACTIVE, DEPRECATED",
    }),
});

export const userSubscriptionValidationSchema = Joi.object({
  user_id: Joi.string().min(3).required(),
  planId: Joi.number().integer().required().messages({
    "any.required": "Plan ID is required",
    "number.base": "Plan ID must be a number",
  }),
});
