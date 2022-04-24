/**
 * A naive implementation of a very simple command-line calculator.
 * Evaluates input using defined operators and saves result to a running
 * value. Inputs that begin with an operator will apply the expression to the
 * running value. Inputs that begin with a number will replace the running
 * value with the result
 *
 * For example:
 *  prompt> 3 + 6
 *  result: 9
 *  prompt> - 5  // starts with operator, applies expression to running value (ie. 9 - 5)
 *  result: 4
 *  prompt> 5 + 5 - 3 // complete expression, replaces running value with result
 *  result: 7
 *
 * The implementation below works, but is not very testable and does not
 * lend itself to additional features and commands.
 *
 * Your task is to extract the logic of the evaluator method into an interaction layer
 * and a domain layer, both of which can be tested and extended into additional
 * functionality, TBA in part two of the exercise.
 */

import repl from 'repl';

// defines the operators you can use in an expression
const operators = {
  '+': (a, b) => a + b,
  '-': (a, b) => a - b,
  '/': (a, b) => a / b,
  '*': (a, b) => a * b,
};

const app = repl.start({
  prompt: '> ',
  eval: (cmd, ctx, _filename, cb) => {
    // parses expression such as "3 + 5"
    // into array of tokens [ 3, "+", 5 ].
    // Assumes spaces between tokens in original expression
    const tokens = cmd
      .trim()
      .split(/\s+/)
      .map((t) => t.trim());

    let val;

    // If expression starts with an operator, prepend the
    // running value to the beginning of the expression
    if (operators.hasOwnProperty(tokens[0])) {
      tokens.unshift(ctx.current);
    }

    // iterate over the expression, applying operators to terms
    tokens.forEach((term, idx, arr) => {
      if (idx === 0) {
        val = +term;
      }

      // odd indices, ie. operators
      if (idx % 2) {
        const op = operators[term];
        val = op(val, +arr[idx + 1]);
      }
    });

    // update current with result
    ctx.current = val;

    // outputs running value to screen
    cb(null, ctx.current);
  },
});

// sets starting value for current
app.context.current = 0;
