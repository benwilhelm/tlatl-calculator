/**
 * This module represents our domain layer - This is where to
 * put the logic that is core to the application, independent of
 * any persistence or interaction concerns.
 */

/**
 * Evaluates an arithmetic expression represented by a sequence of tokens (ie. numbers and operators)
 *
 * @param {Array} tokens - An array of numbers and operators which can be evaluated
 *         sequentially to produce an arithmetic result
 * @returns {Number} - Result of the evaluated expression
 *
 * The basic job of the application is to evaluate sequences of
 * arithmetic operators. Here is the core function of our domain module,
 * whose contract can remain stable even as implementation details and
 * individual requirements change.
 *
 * Regardless of how we choose to parse the incoming expression, or which
 * operations we support in an expression, this can remain a stable, testable
 * interface for evaluating, allowing the tests to ignore implementation details
 */
export function evaluateTokens(tokens) {
  if (!validateTokens(tokens)) {
    throw new InvalidExpressionError(`Invalid Expression: ${tokens.join(' ')}`);
  }

  return tokens.reduce((val, term, idx, arr) => {
    if (idx % 2) {
      const op = operators[term];
      val = op(val, arr[idx + 1]);
    }

    return val;
  });
}

const operators = {
  '+': (a, b) => a + b,
  '-': (a, b) => a - b,
  '/': (a, b) => a / b,
  '*': (a, b) => a * b,
};

/**
 * Ensures that the sequence of tokens represents a valid expression
 *
 * @param {Array} tokens - An array of numbers and operators which can be evaluated
 *         sequentially to produce an arithmetic result
 * @returns boolean - Whether the sequence is valid
 *
 * This function is very focused in its responsibility and requires no outside
 * context (ie. it's a pure function). It might be tempting to write tests for
 * it, but it's not part of the public interface. It's a helper function
 * that allows the evaluateTokens function to fulfill part of *its* interface.
 * If we keep the public contract of the evaluateTokens function stable and test
 * only against that, we are free to refactor the implementation and interfaces
 * between these functions without having to rewrite our tests.
 */
function validateTokens(tokens) {
  // valid expression should be an odd number of tokens
  if (tokens.length % 2 === 0) {
    return false;
  }

  // verify that our sequence alternates
  // number, operator, number, operator...
  for (let i = 0; i < tokens.length; i++) {
    const term = tokens[i];

    if (i % 2) {
      // odd indices, ie. operators
      if (!operators[term]) return false;
    } else {
      // even indices, ie. numbers
      if (isNaN(term)) return false;
    }
  }

  return true;
}

export class InvalidExpressionError extends Error {
  constructor(message) {
    super(message);
    this.name = 'InvalidExpressionError';
  }
}
