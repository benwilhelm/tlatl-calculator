import { evaluateTokens, InvalidExpressionError } from './domain.js';

/**
 *
 * @param {string} input - String expression as entered by user
 * @param {object} ctx - context object
 * @returns {array} - Array of tokens to be passed to evaluateTokens function
 *
 * This is not part of the public interface of our UI module, so we don't test it.
 * This allows us freedom to refactor and change not only its imlementation but its
 * arguments
 */
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

/**
 * The evaluator function given to our REPL instance. Follows the signature
 * defined by Node's REPL implementation.
 *
 * @param {string} cmd - The command string as entered in the CLI
 * @param {object} ctx - A context object that persists for the lifetime
 *   of the REPL execution. Changes to this object will be visible in
 *   subsequent invocations of the evaluator function
 * @param {string} _fname - We're not using this, but it is passed in
 *   from Node's REPL implementation. It is not very well documented and
 *   appears to have something to do with the VM in which the repl instance
 *   is executed
 * @param {function} cb - The callback which is executed to return
 *   control back to the user. Argument 1 is an error if one occurred,
 *   argument 2 is the value that will printed to the screen. Both
 *   arguments are optional
 */
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
