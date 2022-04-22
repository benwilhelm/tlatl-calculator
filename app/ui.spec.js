import { evaluator, actions } from './ui.js';

describe('actions.evaluateExpression', () => {
  test('should evaluate complete expression and update ctx.currentValue', () => {
    const expression = '3 + 5';
    const expected = 8;
    const ctx = {};
    const cb = jest.fn();

    actions.evaluateExpression(expression, ctx, cb);
    expect(ctx.current).toEqual(expected);
    expect(cb).toHaveBeenCalledWith(null, expected);
  });

  test('should evaluate partial expression in context of running value', () => {
    const expression = ' + 6';
    const ctx = { current: 5 };
    const expected = 11;
    const cb = jest.fn();

    actions.evaluateExpression(expression, ctx, cb);
    expect(ctx.current).toEqual(expected);
    expect(cb).toHaveBeenCalledWith(null, expected);
  });

  test('should display invalid expression error and not change running value', () => {
    const expression = 'foo';
    const ctx = { current: 3 };
    const cb = jest.fn();

    actions.evaluateExpression(expression, ctx, cb);
    expect(ctx.current).toEqual(3);
    expect(cb).toHaveBeenCalledWith(null, 'Invalid Expression: foo');
  });

  test('should allow saved variables in expression', () => {
    const expression = '3 + foo';
    const ctx = { savedValues: { foo: 5 } };
    const cb = jest.fn();
    const expected = 8;

    actions.evaluateExpression(expression, ctx, cb);
    expect(ctx.current).toEqual(expected);
    expect(cb).toHaveBeenCalledWith(null, expected);
  });
});

describe('actions.saveValue', () => {
  test('should save value to context', () => {
    const cmd = '= foo';
    const ctx = { current: 5 };
    const cb = jest.fn();

    actions.saveValue(cmd, ctx, cb);
    expect(ctx.savedValues.foo).toEqual(5);
    expect(cb).toHaveBeenCalledWith(null, 'value 5 saved as foo');
  });
});

describe('evaluator', () => {
  test('should dispatch printCurrentValue for current', () => {
    const cmd = 'current';
    const ctx = { current: 10 };
    const _fname = '';
    const cb = jest.fn();
    evaluator(cmd, ctx, _fname, cb);

    expect(cb).toHaveBeenCalledWith(null, 10);
  });
  test('should dispatch saveValue for command loosely matching `=varName`', () => {
    jest.spyOn(actions, 'saveValue');
    const cmd = '= foo';
    const ctx = { current: 3 };
    const _fname = '';
    const cb = jest.fn();

    evaluator(cmd, ctx, _fname, cb);
    expect(actions.saveValue).toHaveBeenCalledTimes(1);
    expect(ctx.savedValues.foo).toEqual(3);
    expect(cb).toHaveBeenCalledWith(null, `value 3 saved as foo`);
  });

  test('should dispatch evaluateExpression for any other command', () => {
    jest.spyOn(actions, 'evaluateExpression');
    jest.spyOn(actions, 'saveValue');
    const cmd = '+ 5';
    const ctx = { current: 3 };
    const _fname = '';
    const cb = jest.fn();
    const expected = 8;

    evaluator(cmd, ctx, _fname, cb);
    expect(ctx.current).toEqual(expected);
    expect(cb).toHaveBeenCalledWith(null, expected);
  });
});
