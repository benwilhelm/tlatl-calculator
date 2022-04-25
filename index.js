import repl from 'repl';
import { evaluator, contextFactory } from './app/ui.js';

const app = repl.start({
  prompt: 'calc> ',
  eval: evaluator,
});

// assigns default values to context object, leaving intact
// the existing properties assigned by the repl library itself
Object.assign(app.context, contextFactory());
