import localFont from "next/font/local";

export const helvetica = localFont({
  src: [
    {
      path: "../../../public/helvetica-255/Helvetica.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/helvetica-255/Helvetica-Bold.ttf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../../public/helvetica-255/Helvetica-Light.ttf",
      weight: "300",
      style: "normal",
    },
  ],
  variable: "--font-helvetica",
});
