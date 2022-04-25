import {
  evaluateTokens,
  numberStore,
  InvalidExpressionError,
} from './domain.js';

/**
 *
 * @param {string} input - Expression to be converted into tokens
 * @param {Object} substitutions - Key/value object of named substitutions,
 *   eg. saved results from our context object
 * @param {Number} currentValue - The current running value to be prepended
 *   to the expression if it starts with an operator
 * @returns {Array} - sequential list of tokens which can be evaluated as
 *   an arithmetic expression
 */
function constructTokenString(input, substitutions = {}, currentValue = 0) {
  const tokens = input
    .trim()
    .split(/\s+/)
    .map((t) => t.trim())
    .map((t) => (substitutions?.hasOwnProperty(t) ? substitutions[t] : t))
    .map((t) => (isNaN(t) ? t : +t));

  if (tokens.length % 2 === 0) {
    tokens.unshift(currentValue);
  }

  return tokens;
}

/**
 * Actions object contains each individual handler for the various
 * actions that a user can take from the command line.
 */
export const actions = {
  /**
   * Evaluates arithmetic expression, saving result to context and
   * displaying it to the user
   *
   * @param {string} cmd - expression passed in by user
   * @param {object} ctx - REPL context object
   * @param {function} cb - Callback to signify completion
   */
  evaluateExpression(cmd, ctx, cb) {
    try {
      const tokens = constructTokenString(
        cmd,
        ctx.savedValues.getAll(),
        ctx.current
      );
      const result = evaluateTokens(tokens);
      ctx.current = result;
      cb(null, result);
    } catch (err) {
      if (err instanceof InvalidExpressionError) {
        // No need to display the whole error/callstack for
        // an invalid expression. Just give the user some feedback.
        return cb(null, err.message);
      } else {
        // Display the full error object for any other type of error
        cb(err);
      }
    }
  },

  /**
   * Saves current running value to a named variable which can
   * be used in calculations
   *
   * @param {string} cmd - expression passed in by user
   * @param {object} ctx - REPL context object
   * @param {function} cb - Callback to signify completion
   */
  saveResult(cmd, ctx, cb) {
    const matches = cmd.match(saveResultRegex);
    const varName = matches[1];
    ctx.savedValues.set(varName, ctx.current);
    cb(null, `value ${ctx.current} saved as ${varName}`);
  },
};

// matches =[optional space][variable name]
const saveResultRegex = new RegExp(/^\s*\=\s*([a-zA-Z][a-zA-Z0-9]*)\s*$/);

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
 *
 * Now that users can invoke different commands from the CLI, our evaluator
 * function takes the role of dispatcher, delegating the work to individual
 * handler functions
 */
export function evaluator(cmd, ctx, _fname, cb) {
  const input = cmd.trim();

  const commands = [
    {
      match: (cmd) => cmd.match(saveResultRegex),
      run: actions.saveResult,
    },
    {
      match: (cmd) => true,
      run: actions.evaluateExpression,
    },
  ];

  const commandDefinition = commands.find((command) => command.match(input));
  commandDefinition.run(input, ctx, cb);
}

/**
 * ContextFactory gives us a central place to define the shape of
 * the context object, ensuring that tests and live application get
 * initialized with the same properties, but allowing for the values
 * of those properties to be specified at runtime (useful for tests)
 */
export function contextFactory(overrides = {}) {
  const defaults = {
    current: 0,
    savedValues: numberStore(),
  };

  return { ...defaults, ...overrides };
}
