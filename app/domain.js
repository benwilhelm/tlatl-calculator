export class InvalidExpressionError extends Error {
  constructor(message) {
    super(message);
    this.name = 'InvalidExpressionError';
  }
}

const operators = {
  '+': (a, b) => a + b,
  '-': (a, b) => a - b,
  '/': (a, b) => a / b,
  '*': (a, b) => a * b,
};

function validateTokens(tokens) {
  // should be an odd number of tokens
  if (tokens.length % 2 === 0) {
    return false;
  }

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
