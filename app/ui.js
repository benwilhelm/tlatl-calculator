import { evaluateTokens, InvalidExpressionError } from './domain.js';

function constructTokenString(input, ctx) {
  const tokens = input
    .trim()
    .split(/\s+/)
    .map((t) => t.trim())
    .map((t) => (ctx.savedValues?.hasOwnProperty(t) ? ctx.savedValues[t] : t))
    .map((t) => (isNaN(t) ? t : +t));

  if (tokens.length % 2 === 0) {
    tokens.unshift(ctx.current);
  }

  return tokens;
}

function saveValueToContext(ctx, name, value) {
  ctx.savedValues = ctx.savedValues || {};
  ctx.savedValues[name] = value;
}

function getSavedValueFromContext(ctx, name) {
  return ctx.savedValues[name];
}

export const actions = {
  printCurrentValue(_cmd, ctx, cb) {
    cb(null, ctx.current);
  },
  evaluateExpression(cmd, ctx, cb) {
    try {
      const tokens = constructTokenString(cmd, ctx);
      const result = evaluateTokens(tokens);
      ctx.current = result;
      cb(null, result);
    } catch (err) {
      if (err instanceof InvalidExpressionError) {
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
