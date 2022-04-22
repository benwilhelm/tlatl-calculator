import repl from 'repl';
import { evaluator } from './app/ui.js';

const app = repl.start({
  prompt: '> ',
  eval: evaluator,
});
