import jwt from "jsonwebtoken";

export interface JwtPayload {
  userId: string;
  email: string;
  role: string;
  deviceId: string;
}

const JWT_SECRET =
  process.env.JWT_SECRET || "default-secret-change-in-production";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

/**
 * Generate JWT token
 * @param payload - Token payload
 * @returns JWT token
 */
export const generateToken = (payload: JwtPayload): string => {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  } as jwt.SignOptions);
};

/**
 * Verify JWT token
 * @param token - JWT token
 * @returns Decoded payload
 */
export const verifyToken = (token: string): JwtPayload => {
  try {
    return jwt.verify(token, JWT_SECRET) as JwtPayload;
  } catch (error) {
    throw new Error("Invalid or expired token");
  }
};
