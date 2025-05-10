import Joi from "joi";

const register_user = Joi.object({
  firstname: Joi.string()
    .min(3)
    .max(100)
    .required()
    .trim()
    .pattern(/^[a-zA-Z\s]*$/)
    .messages({
      "string.pattern.base": "First name must contain only letters and spaces",
      "string.empty": "First name is required",
      "string.min": "First name must be at least {#limit} characters",
      "string.max": "First name cannot exceed {#limit} characters",
    }),

  lastname: Joi.string()
    .min(3)
    .max(100)
    .required()
    .trim()
    .pattern(/^[a-zA-Z\s]*$/)
    .messages({
      "string.pattern.base": "Last name must contain only letters and spaces",
      "string.empty": "Last name is required",
      "string.min": "Last name must be at least {#limit} characters",
      "string.max": "Last name cannot exceed {#limit} characters",
    }),

  username: Joi.string()
    .min(3)
    .max(30)
    .required()
    .trim()
    .lowercase()
    .pattern(/^[a-zA-Z0-9_]+$/)
    .messages({
      "string.pattern.base":
        "Username can only contain letters, numbers and underscore",
      "string.empty": "Username is required",
      "string.min": "Username must be at least {#limit} characters",
      "string.max": "Username cannot exceed {#limit} characters",
    }),

  email: Joi.string().required().email().trim().lowercase().messages({
    "string.email": "Please enter a valid email address",
    "string.empty": "Email is required",
  }),

  password: Joi.string()
    .min(8)
    .max(100)
    .required()
    .pattern(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
    )
    .messages({
      "string.pattern.base":
        "Password must contain at least one uppercase letter, one lowercase letter, one number and one special character",
      "string.empty": "Password is required",
      "string.min": "Password must be at least {#limit} characters",
      "string.max": "Password cannot exceed {#limit} characters",
    }),

  planId: Joi.number().integer().required().positive().messages({
    "number.base": "Plan ID must be a number",
    "number.positive": "Plan ID must be a positive number",
    "any.required": "Plan ID is required",
  }),
});

const login_user = Joi.object({
  email: Joi.string().required().email().trim().lowercase().messages({
    "string.email": "Please enter a valid email address",
    "string.empty": "Email is required",
  }),

  password: Joi.string().required().messages({
    "string.empty": "Password is required",
  }),
});

export { register_user, login_user };
