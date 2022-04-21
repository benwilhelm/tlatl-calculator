import repl from 'repl';
import { evaluator } from './lib.js';

const app = repl.start({
  prompt: '> ',
  eval: evaluator,
});
