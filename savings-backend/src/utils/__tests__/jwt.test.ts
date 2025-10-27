import { generateToken, verifyToken } from "../jwt";

describe("JWT Utils", () => {
  const testPayload = {
    userId: "123",
    email: "test@example.com",
    role: "user",
  };

  describe("generateToken", () => {
    it("should generate a valid JWT token", () => {
      const token = generateToken(testPayload);

      expect(token).toBeDefined();
      expect(typeof token).toBe("string");
      expect(token.split(".")).toHaveLength(3);
    });

    it("should generate different tokens for different payloads", () => {
      const token1 = generateToken(testPayload);
      const token2 = generateToken({ ...testPayload, userId: "456" });

      expect(token1).not.toBe(token2);
    });
  });

  describe("verifyToken", () => {
    it("should verify a valid token and return payload", () => {
      const token = generateToken(testPayload);
      const decoded = verifyToken(token);

      expect(decoded).toBeDefined();
      expect(decoded.userId).toBe(testPayload.userId);
      expect(decoded.email).toBe(testPayload.email);
      expect(decoded.role).toBe(testPayload.role);
    });

    it("should throw error for invalid token", () => {
      const invalidToken = "invalid.token.here";

      expect(() => verifyToken(invalidToken)).toThrow();
    });

    it("should throw error for empty token", () => {
      expect(() => verifyToken("")).toThrow();
    });

    it("should include iat and exp in decoded token", () => {
      const token = generateToken(testPayload);
      const decoded = verifyToken(token);

      expect(decoded.iat).toBeDefined();
      expect(decoded.exp).toBeDefined();
      expect(decoded.exp).toBeGreaterThan(decoded.iat);
    });
  });
});
