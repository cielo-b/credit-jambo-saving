import { hashPassword, comparePassword } from "../hash";

describe("Hash Utils", () => {
  const testPassword = "TestPassword123!";

  describe("hashPassword", () => {
    it("should hash a password", async () => {
      const hash = await hashPassword(testPassword);

      expect(hash).toBeDefined();
      expect(hash).not.toBe(testPassword);
      expect(hash.length).toBeGreaterThan(0);
    });

    it("should generate different hashes for the same password", async () => {
      const hash1 = await hashPassword(testPassword);
      const hash2 = await hashPassword(testPassword);

      expect(hash1).not.toBe(hash2);
    });
  });

  describe("comparePassword", () => {
    it("should return true for matching password and hash", async () => {
      const hash = await hashPassword(testPassword);
      const isMatch = await comparePassword(testPassword, hash);

      expect(isMatch).toBe(true);
    });

    it("should return false for non-matching password and hash", async () => {
      const hash = await hashPassword(testPassword);
      const isMatch = await comparePassword("WrongPassword123!", hash);

      expect(isMatch).toBe(false);
    });

    it("should handle empty passwords", async () => {
      const hash = await hashPassword("password");
      const isMatch = await comparePassword("", hash);

      expect(isMatch).toBe(false);
    });
  });
});
