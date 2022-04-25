import {
  evaluateTokens,
  numberStore,
  InvalidExpressionError,
} from './domain.js';

describe('evaluateTokens', () => {
  test('should evaluate simple sequences of + - * /', () => {
    expect(evaluateTokens([1, '+', 3])).toEqual(4);
    expect(evaluateTokens([1, '+', 3, '-', 5.5])).toEqual(-1.5);
  });

  test('should throw for invalid sequences', () => {
    expect(() => evaluateTokens(['+', 3])).toThrow(InvalidExpressionError);
    expect(() => evaluateTokens([3, '+', '+', 3])).toThrow(
      InvalidExpressionError
    );
    expect(() => evaluateTokens([3, '+'])).toThrow(InvalidExpressionError);
    expect(() => evaluateTokens(['m', '+', 'q'])).toThrow(
      InvalidExpressionError
    );
    expect(() => evaluateTokens(['+', 'q'])).toThrow(InvalidExpressionError);
  });
});

describe('numberStore', () => {
  describe('set()', () => {
    test('should set values by name', () => {
      const store = numberStore();
      store.set('foo', 5);
      store.set('bar', 6);
      expect(store.getAll()).toEqual({ foo: 5, bar: 6 });
    });

    test('should throw if passed non-number for value', () => {
      const store = numberStore();
      expect(() => store.set('foo', 'bar')).toThrow(/must be a number/);
    });
  });

  describe('get()', () => {
    test('should return value by name', () => {
      const store = numberStore();
      store.set('one', 1);
      expect(store.get('one')).toEqual(1);
    });

    test('should return undefined if key does not exist', () => {
      const store = numberStore();
      expect(store.get('not here')).toEqual(undefined);
    });
  });

  describe('getAll()', () => {
    test('should return object with all values', () => {
      const store = numberStore();
      store.set('one', 1);
      store.set('two', 2);
      expect(store.getAll()).toEqual({ one: 1, two: 2 });
    });

    test('modifying returned object should not modify store itself', () => {
      const store = numberStore();
      store.set('one', 1);
      store.set('two', 2);

      const allValues = store.getAll();
      allValues.one = 3;

      expect(store.getAll()).toEqual({ one: 1, two: 2 });
    });
  });
});
