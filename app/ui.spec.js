import { evaluator, actions, contextFactory } from './ui.js';

describe('actions.evaluateExpression', () => {
  test('should evaluate complete expression and update ctx.currentValue', () => {
    const expression = '3 + 5';
    const expected = 8;
    const ctx = contextFactory();
    const cb = jest.fn();

    actions.evaluateExpression(expression, ctx, cb);
    expect(ctx.current).toEqual(expected);
    expect(cb).toHaveBeenCalledWith(null, expected);
  });

  test('should evaluate partial expression in context of running value', () => {
    const expression = ' + 6';
    const ctx = contextFactory({ current: 5 });
    const expected = 11;
    const cb = jest.fn();

    actions.evaluateExpression(expression, ctx, cb);
    expect(ctx.current).toEqual(expected);
    expect(cb).toHaveBeenCalledWith(null, expected);
  });

  test('should display invalid expression error and not change running value', () => {
    const expression = 'foo';
    const ctx = contextFactory({ current: 3 });
    const cb = jest.fn();

    actions.evaluateExpression(expression, ctx, cb);
    expect(cb).toHaveBeenCalledWith(null, 'Invalid Expression: foo');
    expect(ctx.current).toEqual(3);
  });

  test('should allow saved variables in expression', () => {
    const expression = '3 + foo';
    const ctx = contextFactory();
    ctx.savedValues.set('foo', 5);
    const cb = jest.fn();
    const expected = 8;

    actions.evaluateExpression(expression, ctx, cb);
    expect(ctx.current).toEqual(expected);
    expect(cb).toHaveBeenCalledWith(null, expected);
  });
});

describe('actions.saveResult', () => {
  test('should save value to context', () => {
    const cmd = '= foo';
    const ctx = contextFactory({ current: 5 });
    const cb = jest.fn();

    actions.saveResult(cmd, ctx, cb);
    expect(ctx.savedValues.get('foo')).toEqual(5);
    expect(cb).toHaveBeenCalledWith(null, 'value 5 saved as foo');
  });
});

describe('evaluator', () => {
  test('should dispatch saveResult for command loosely matching `=varName`', () => {
    jest.spyOn(actions, 'saveResult');
    const ctx = contextFactory({ current: 3 });
    const _fname = '';
    const cb = jest.fn();

    // Checking that the input is permissive about whitespace. There is a
    // more idiomatic way to run the same test against multiple values,
    // which we will cover in the next module
    const inputs = ['=foo', '= foo', ' = foo ', '    =       foo  '];
    inputs.forEach((cmd, idx) => {
      evaluator(cmd, ctx, _fname, cb);
      expect(actions.saveResult).toHaveBeenCalledTimes(idx + 1);
      expect(ctx.savedValues.get('foo')).toEqual(3);
      expect(cb).toHaveBeenCalledWith(null, `value 3 saved as foo`);
    });
  });

  test('should dispatch evaluateExpression for any other command', () => {
    jest.spyOn(actions, 'evaluateExpression');
    const cmd = '+ 5';
    const ctx = contextFactory({ current: 3 });
    const _fname = '';
    const cb = jest.fn();
    const expected = 8;

    evaluator(cmd, ctx, _fname, cb);
    expect(actions.evaluateExpression).toHaveBeenCalledTimes(1);
    expect(ctx.current).toEqual(expected);
    expect(cb).toHaveBeenCalledWith(null, expected);
  });
});
