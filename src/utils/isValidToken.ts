import { decodeJwt } from "jose";

export function isValidToken(token: string | null | undefined): boolean {
  if (!token) return false;

  try {
    const payload = decodeJwt(token);

    const expectedAudience = process.env.NEXT_PUBLIC_AUDIENCE;
    const expectedIssuer = process.env.NEXT_PUBLIC_ISSUER;

    if (!payload.exp) return false;
    const now = Math.floor(Date.now() / 1000);
    if (payload.exp <= now) return false;

    if (expectedAudience) {
      if (
        !payload.aud ||
        (Array.isArray(payload.aud)
          ? !payload.aud.includes(expectedAudience)
          : payload.aud !== expectedAudience)
      ) {
        return false;
      }
    }

    if (expectedIssuer && payload.iss !== expectedIssuer) {
      return false;
    }

    return true;
  } catch {
    return false;
  }
}
