import { evaluator } from './ui.js';

describe('evaluator', () => {
  test('should evaluate complete expression and update ctx.currentValue', () => {
    const expression = '3 + 5';
    const expected = 8;
    const _filename = '';
    const ctx = {};
    const cb = jest.fn();

    evaluator(expression, ctx, _filename, cb);
    expect(ctx.current).toEqual(expected);
    expect(cb).toHaveBeenCalledWith(null, expected);
  });

  test('should evaluate partial expression in context of running value', () => {
    const expression = ' + 6';
    const ctx = { current: 5 };
    const _filename = '';
    const expected = 11;
    const cb = jest.fn();

    evaluator(expression, ctx, _filename, cb);
    expect(ctx.current).toEqual(expected);
    expect(cb).toHaveBeenCalledWith(null, expected);
  });

  test('should display invalid expression error and not change running value', () => {
    const expression = 'foo';
    const ctx = { current: 3 };
    const _filename = '';
    const cb = jest.fn();

    evaluator(expression, ctx, _filename, cb);
    expect(ctx.current).toEqual(3);
    expect(cb).toHaveBeenCalledWith(null, 'Invalid Expression: foo');
  });
});
