import {
  validateEmail,
  validatePassword,
  validatePhoneNumber,
} from "../validator";

describe("Validator Utils", () => {
  describe("validateEmail", () => {
    it("should validate correct email addresses", () => {
      expect(validateEmail("test@example.com")).toBe(true);
      expect(validateEmail("user.name+tag@example.co.uk")).toBe(true);
      expect(validateEmail("test123@test-domain.com")).toBe(true);
    });

    it("should reject invalid email addresses", () => {
      expect(validateEmail("invalid")).toBe(false);
      expect(validateEmail("test@")).toBe(false);
      expect(validateEmail("@example.com")).toBe(false);
      expect(validateEmail("test @example.com")).toBe(false);
      expect(validateEmail("")).toBe(false);
    });
  });

  describe("validatePassword", () => {
    it("should validate strong passwords", () => {
      expect(validatePassword("StrongPass123!")).toBe(true);
      expect(validatePassword("MyP@ssw0rd")).toBe(true);
      expect(validatePassword("Secure123#")).toBe(true);
    });

    it("should reject weak passwords", () => {
      expect(validatePassword("short")).toBe(false);
      expect(validatePassword("alllowercase123")).toBe(false);
      expect(validatePassword("ALLUPPERCASE123")).toBe(false);
      expect(validatePassword("NoNumbers!")).toBe(false);
      expect(validatePassword("")).toBe(false);
    });
  });

  describe("validatePhoneNumber", () => {
    it("should validate correct phone numbers", () => {
      expect(validatePhoneNumber("1234567890")).toBe(true);
      expect(validatePhoneNumber("+254712345678")).toBe(true);
      expect(validatePhoneNumber("0712345678")).toBe(true);
    });

    it("should reject invalid phone numbers", () => {
      expect(validatePhoneNumber("123")).toBe(false);
      expect(validatePhoneNumber("abcdefghij")).toBe(false);
      expect(validatePhoneNumber("")).toBe(false);
      expect(validatePhoneNumber("123-456-7890")).toBe(false);
    });
  });
});
