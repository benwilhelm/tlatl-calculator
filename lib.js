const INVALID_EXPRESSION = 'INVALID_EXPRESSION';

const operators = {
  '+': (a, b) => a + b,
  '-': (a, b) => a - b,
  '/': (a, b) => a / b,
  '*': (a, b) => a * b,
};

function constructExpressionTerms(input, ctx) {
  const terms = input
    .trim()
    .split(/\s+/)
    .map((t) => t.trim())
    .map((t) => (ctx.savedValues?.hasOwnProperty(t) ? ctx.savedValues[t] : t))
    .map((t) => (isNaN(t) ? t : +t));

  // even number of terms, likely needs running value prepended
  if (terms.length % 2 === 0) {
    terms.unshift(ctx.current);
  }

  return terms;
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

function saveValueToContext(ctx, name, value) {
  ctx.savedValues = ctx.savedValues || {};
  ctx.savedValues[name] = value;
}

function getSavedValueFromContext(ctx, name) {
  return ctx.savedValues[name];
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
  printCurrentValue(_cmd, ctx, cb) {
    cb(null, ctx.current);
  },
  evaluateExpression(cmd, ctx, cb) {
    try {
      const terms = constructExpressionTerms(cmd, ctx);
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

  saveValue(cmd, ctx, cb) {
    const matches = cmd.match(saveValueRegex);
    const varName = matches[1];
    saveValueToContext(ctx, varName, ctx.current);
    cb(null, `value ${ctx.current} saved as ${varName}`);
  },
};

// matches =[optional space][variable name]
const saveValueRegex = new RegExp(/^\s*\=\s*([a-zA-Z][a-zA-Z0-9]*)\s*$/);

export function evaluator(cmd, ctx, _fname, cb) {
  const input = cmd.trim();

  const commands = [
    {
      match: (cmd) => cmd === 'current',
      run: actions.printCurrentValue,
    },
    {
      match: (cmd) => cmd.match(saveValueRegex),
      run: actions.saveValue,
    },
    {
      match: (cmd) => true,
      run: actions.evaluateExpression,
    },
  ];

  const commandDefinition = commands.find((command) => command.match(input));
  commandDefinition.run(input, ctx, cb);
}
