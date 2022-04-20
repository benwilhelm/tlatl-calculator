import repl from 'repl';

const app = repl.start({
  prompt: '> ',
  eval: evaluator,
});
app.context.current = 0;

const operators = {
  '+': (a, b) => a + b,
  '-': (a, b) => a - b,
  '/': (a, b) => a / b,
  '*': (a, b) => a * b,
};

function evaluator(cmd, ctx, filename, cb) {
  const terms = cmd
    .trim()
    .split(/\s+/)
    .map((t) => t.trim());

  let val;

  if (isNaN(terms[0])) {
    terms.unshift(ctx.current);
  }

  terms.forEach((term, idx, arr) => {
    if (idx === 0) {
      val = +term;
    }

    // odd indices, ie. operators
    if (idx % 2) {
      const op = operators[term];
      val = op(val, +arr[idx + 1]);
    }
  });

  ctx.current = val;
  app.setPrompt(prompt(ctx.current));
  cb(null, ctx.current);
}

function prompt(current) {
  return `${current} > `;
}
