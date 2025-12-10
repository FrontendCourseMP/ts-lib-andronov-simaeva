import { expect, test, describe } from "vitest";
import { sum } from "../counter";

describe("sum function", () => {
  describe("Happy path tests", () => {
    test("adds 1 + 2 to equal 3", () => {
      // Arrange
      const a = 1;
      const b = 2;
      const expected = 3;

      // Act
      const result = sum(a, b);

      // Assert
      expect(result).toBe(expected);
    });

    test("adds positive numbers", () => {
      // Arrange
      const a = 10;
      const b = 5;
      const expected = 15;

      // Act
      const result = sum(a, b);

      // Assert
      expect(result).toBe(expected);
    });

    test("adds zero + number", () => {
      // Arrange
      const a = 0;
      const b = 42;
      const expected = 42;

      // Act
      const result = sum(a, b);

      // Assert
      expect(result).toBe(expected);
    });

    test("adds negative + positive numbers", () => {
      // Arrange
      const a = -5;
      const b = 10;
      const expected = 5;

      // Act
      const result = sum(a, b);

      // Assert
      expect(result).toBe(expected);
    });

    test("adds two negative numbers", () => {
      // Arrange
      const a = -3;
      const b = -7;
      const expected = -10;

      // Act
      const result = sum(a, b);

      // Assert
      expect(result).toBe(expected);
    });

    test("adds decimal numbers", () => {
      // Arrange
      const a = 1.5;
      const b = 2.3;
      const expected = 3.8;

      // Act
      const result = sum(a, b);

      // Assert
      expect(result).toBe(expected);
    });

    test("adds large numbers", () => {
      // Arrange
      const a = 1000000;
      const b = 2000000;
      const expected = 3000000;

      // Act
      const result = sum(a, b);

      // Assert
      expect(result).toBe(expected);
    });
  });

  describe("Evil tests (edge cases)", () => {
    test("handles Infinity + number", () => {
      // Arrange
      const a = Infinity;
      const b = 5;
      const expected = Infinity;

      // Act
      const result = sum(a, b);

      // Assert
      expect(result).toBe(expected);
    });

    test("handles -Infinity + number", () => {
      // Arrange
      const a = -Infinity;
      const b = 5;
      const expected = -Infinity;

      // Act
      const result = sum(a, b);

      // Assert
      expect(result).toBe(expected);
    });

    test("handles NaN + number", () => {
      // Arrange
      const a = NaN;
      const b = 5;

      // Act
      const result = sum(a, b);

      // Assert
      expect(result).toBeNaN();
    });

    test("handles number + NaN", () => {
      // Arrange
      const a = 5;
      const b = NaN;

      // Act
      const result = sum(a, b);

      // Assert
      expect(result).toBeNaN();
    });

    test("handles very small decimal numbers", () => {
      // Arrange
      const a = 0.0000001;
      const b = 0.0000002;
      const expected = 0.0000003;

      // Act
      const result = sum(a, b);

      // Assert
      expect(result).toBe(expected);
    });

    test("handles floating point precision issues", () => {
      // Arrange
      const a = 0.1;
      const b = 0.2;
      const expected = 0.3;

      // Act
      const result = sum(a, b);

      // Assert
      expect(result).toBeCloseTo(expected, 10); // Allow small precision differences
    });
  });

  describe("Type coercion tests", () => {
    test("handles string + number (concatenation)", () => {
      // Arrange
      const a = "5";
      const b = 3;
      const expected = "53"; // JavaScript concatenates string + number

      // Act
      const result = sum(a as any, b);

      // Assert
      expect(result).toBe(expected);
    });

    test("handles boolean values (coercion)", () => {
      // Arrange
      const a = true; // coerced to 1
      const b = false; // coerced to 0
      const expected = 1;

      // Act
      const result = sum(a as any, b as any);

      // Assert
      expect(result).toBe(expected);
    });
  });

  describe("Branch coverage tests", () => {
    test("function is callable", () => {
      // Arrange & Act & Assert
      expect(typeof sum).toBe("function");
      expect(sum).toBeInstanceOf(Function);
    });

    test("function returns a number", () => {
      // Arrange
      const a = 1;
      const b = 2;

      // Act
      const result = sum(a, b);

      // Assert
      expect(typeof result).toBe("number");
    });
  });
});
