import { evaluateTokens, InvalidExpressionError } from './domain.js';

function constructTokenString(input, ctx) {
  const tokens = input
    .trim()
    .split(/\s+/)
    .map((t) => t.trim())
    .map((t) => (isNaN(t) ? t : +t));

  if (tokens.length % 2 === 0) {
    tokens.unshift(ctx.current);
  }

  return tokens;
}

export function evaluator(cmd, ctx, _fname, cb) {
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
}
