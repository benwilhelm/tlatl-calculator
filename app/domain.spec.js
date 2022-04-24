import { evaluateTokens, InvalidExpressionError } from './domain.js';

describe('evaluateTokens', () => {
  test('should evaluate simple sequences of + - * /', () => {
    expect(evaluateTokens([1, '+', 3])).toEqual(4);
    expect(evaluateTokens([1, '+', 3, '-', 5.5])).toEqual(-1.5);
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
