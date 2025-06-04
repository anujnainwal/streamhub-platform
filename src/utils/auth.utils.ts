import { jwtVerify } from "jose";

export const verifyToken = async (token: string): Promise<any | null> => {
  const secret = new TextEncoder().encode(process.env.JWT_SECRET);
  try {
    console.log("Token payload:", process.env.NEXT_PUBLIC_JWT_SECRET, secret);
    const { payload } = await jwtVerify(token, secret);
    return payload;
  } catch (err) {
    console.error("Token verification failed:", err);
    return null;
  }
};

export const isTokenExpired = async (token: string): Promise<boolean> => {
  const payload = await verifyToken(token);

  if (!payload) return true;

  const now = Math.floor(Date.now() / 1000);
  return typeof payload.exp === "number" && payload.exp < now;
};
