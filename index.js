import repl from 'repl';
import { actions } from './lib.js';

const app = repl.start({
  prompt: '> ',
  eval: actions.evaluateExpression,
});
