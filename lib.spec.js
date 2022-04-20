import { evaluateTerms, actions } from './lib.js';

describe('evaluateTerms', () => {
  test('should evaluate simple sequences of + - * /', () => {
    expect(evaluateTerms([1, '+', 3])).toEqual(4);
    expect(evaluateTerms([1, '+', 3, '-', 5.5])).toEqual(-1.5);
  });

  test('should throw for invalid sequences', () => {
    expect(() => evaluateTerms(['+', 3])).toThrow(/invalid expression/i);
    expect(() => evaluateTerms([3, '+', '+', 3])).toThrow(
      /invalid expression/i
    );
    expect(() => evaluateTerms([3, '+'])).toThrow(/invalid expression/i);
    expect(() => evaluateTerms(['m', '+', 'q'])).toThrow(/invalid expression/i);
    expect(() => evaluateTerms(['+', 'q'])).toThrow(/invalid expression/i);
  });
});

describe('actions.evaluateExpression', () => {
  test('should evaluate complete expression and update ctx.currentValue', () => {
    const expression = '3 + 5';
    const expected = 8;
    const _filename = '';
    const ctx = {};
    const cb = jest.fn();

    actions.evaluateExpression(expression, ctx, _filename, cb);
    expect(ctx.current).toEqual(expected);
    expect(cb).toHaveBeenCalledWith(null, expected);
  });

  test('should evaluate partial expression in context of running value', () => {
    const expression = ' + 6';
    const ctx = { current: 5 };
    const _filename = '';
    const expected = 11;
    const cb = jest.fn();

    actions.evaluateExpression(expression, ctx, _filename, cb);
    expect(ctx.current).toEqual(expected);
    expect(cb).toHaveBeenCalledWith(null, expected);
  });

  test('should display invalid expression error and not change running value', () => {
    const expression = 'foo';
    const ctx = { current: 3 };
    const _filename = '';
    const cb = jest.fn();

    actions.evaluateExpression(expression, ctx, _filename, cb);
    expect(ctx.current).toEqual(3);
    expect(cb).toHaveBeenCalledWith(null, 'Invalid Expression: foo');
  });
});

test.todo('evaluator');
