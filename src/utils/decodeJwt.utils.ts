import { jwtVerify, JWTPayload } from "jose";

interface TokenValidationResult {
  isValid: boolean;
  userInfo?: JWTPayload;
}

export async function validateToken(
  token: string | null | undefined
): Promise<TokenValidationResult> {
  console.log("=====>1");
  if (!token) return { isValid: false };
  try {
    console.log("=====>2");
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    console.log("=====>3");
    const expectedAudience = process.env.NEXT_PUBLIC_AUDIENCE;
    const expectedIssuer = process.env.NEXT_PUBLIC_ISSUER;
    const { payload } = await jwtVerify(token, secret, {
      issuer: expectedIssuer,
      audience: expectedAudience,
    });

    return { isValid: true, userInfo: payload };
  } catch (err) {
    console.log("=======>d", err);
    return { isValid: false };
  }
}
