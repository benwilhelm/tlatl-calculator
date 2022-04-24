import { evaluateTokens, InvalidExpressionError } from './domain.js';

describe('evaluateTokens', () => {
  test('should evaluate simple sequences of + - * /', () => {
    // Check all four operators
    expect(evaluateTokens([1, '+', 3])).toEqual(4);
    expect(evaluateTokens([7, '-', 1])).toEqual(6);
    expect(evaluateTokens([14, '/', 2])).toEqual(7);
    expect(evaluateTokens([7, '*', 3])).toEqual(21);

    // sequences can include multiple operators
    expect(evaluateTokens([1, '+', 3, '-', 5.5])).toEqual(-1.5);
    expect(evaluateTokens([7, '*', 3, '-', 10])).toEqual(11);
  });

  test('should throw for invalid sequences', () => {
    expect(() => evaluateTokens(['+', 3])).toThrow(InvalidExpressionError);
    expect(() => evaluateTokens([3, '+', '+', 3])).toThrow(
      InvalidExpressionError
    );
    expect(() => evaluateTokens([3, '+'])).toThrow(InvalidExpressionError);
    expect(() => evaluateTokens(['m', '+', 'q'])).toThrow(
      InvalidExpressionError
    );
    expect(() => evaluateTokens(['+', 'q'])).toThrow(InvalidExpressionError);
  });
});
