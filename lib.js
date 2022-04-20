const INVALID_EXPRESSION = 'INVALID_EXPRESSION';

const operators = {
  '+': (a, b) => a + b,
  '-': (a, b) => a - b,
  '/': (a, b) => a / b,
  '*': (a, b) => a * b,
};

function termsFromExpression(input) {
  return input
    .trim()
    .split(/\s+/)
    .map((t) => t.trim())
    .map((t) => (isNaN(t) ? t : +t));
}

function validateTerms(terms) {
  // should be an odd number of terms
  if (terms.length % 2 === 0) {
    return false;
  }

  for (let i = 0; i < terms.length; i++) {
    const term = terms[i];

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

export function evaluateTerms(terms) {
  if (!validateTerms(terms)) {
    const err = new Error(`Invalid Expression: ${terms.join(' ')}`);
    err.code = INVALID_EXPRESSION;
    throw err;
  }

  return terms.reduce((val, term, idx, arr) => {
    if (idx % 2) {
      const op = operators[term];
      val = op(val, arr[idx + 1]);
    }

    return val;
  });
}

export const actions = {
  evaluateExpression(expression, ctx, _fname, cb) {
    try {
      const terms = termsFromExpression(expression);

      // even number of terms, likely needs running value prepended
      if (terms.length % 2 === 0) {
        terms.unshift(ctx.current);
      }
      const result = evaluateTerms(terms);
      ctx.current = result;
      cb(null, result);
    } catch (err) {
      if (err.code === INVALID_EXPRESSION) {
        return cb(null, err.message);
      } else {
        cb(err);
      }
    }
  },
};

export function evaluator(cmd, ctx, _fname, cb) {}
