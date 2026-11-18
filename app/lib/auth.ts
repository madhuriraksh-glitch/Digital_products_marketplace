import { SignJWT, jwtVerify } from "jose";

const secret = process.env.AUTH_SECRET;

if (!secret) {
  throw new Error("AUTH_SECRET is missing from .env.local");
}

const secretKey = new TextEncoder().encode(secret);

export interface SessionUser {
  user_id: number;
  name: string;
  email: string;
  role: "customer" | "creator" | "admin";
}

export async function createSessionToken(user: SessionUser) {
  return new SignJWT({
    user_id: user.user_id,
    name: user.name,
    email: user.email,
    role: user.role,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secretKey);
}

export async function createToken(user: {
  user_id: number;
  name: string;
  email: string;
  role: "customer" | "creator" | "admin";
}) {
  return createSessionToken(user);
}

export async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, secretKey);
    return payload;
  } catch {
    return null;
  }
}

export async function verifySessionToken(
  token: string
): Promise<SessionUser | null> {
  const payload = await verifyToken(token);

  if (!payload) return null;

  const userId = payload.user_id;
  const name = payload.name;
  const email = payload.email;
  const role = payload.role;

  if (
    typeof userId !== "number" ||
    typeof name !== "string" ||
    typeof email !== "string" ||
    (role !== "customer" && role !== "creator" && role !== "admin")
  ) {
    return null;
  }

  return { user_id: userId, name, email, role };
}