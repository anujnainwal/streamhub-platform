import { Appearance } from "@stripe/stripe-js";

const appearance: Appearance = {
  theme: "stripe",
  variables: {
    fontFamily: "'Inter', sans-serif",
    fontLineHeight: "1.5",
    borderRadius: "8px",
    colorBackground: "#ffffff",
    accessibleColorOnColorPrimary: "#fff",
    
  },
  rules: {
    ".Input": {
      padding: "12px",
    },
  },
};

export default appearance;
