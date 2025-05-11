import { SignJWT } from "jose";
import { TextEncoder } from "util";
import { v4 as uuidv4 } from "uuid";

const issuer = process.env.JWT_ISSUER!;
const audience = process.env.JWT_AUDIENCE!;
const expiration = process.env.JWT_EXPIRATION!;

const hsSecret = new TextEncoder().encode(process.env.JWT_SECRET!);

export async function generateToken(payload: Record<string, unknown>) {
  return await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(expiration)
    .setIssuer(issuer)
    .setAudience(audience)
    .setJti(uuidv4())
    .sign(hsSecret);
}
