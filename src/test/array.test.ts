import { describe, it, expect } from 'vitest';
import { moveItem } from '../utils/array';

describe('moveItem', () => {
  it('should move an item from one index to another', () => {
    const items = ['a', 'b', 'c', 'd'];
    const result = moveItem(items, 1, 2); // Move 'b' to index 2
    expect(result).toEqual(['a', 'c', 'b', 'd']);
  });

  it('should move an item to the beginning', () => {
    const items = ['a', 'b', 'c'];
    const result = moveItem(items, 2, 0); // Move 'c' to index 0
    expect(result).toEqual(['c', 'a', 'b']);
  });

  it('should move an item to the end', () => {
    const items = ['a', 'b', 'c'];
    const result = moveItem(items, 0, 2); // Move 'a' to index 2
    expect(result).toEqual(['b', 'c', 'a']);
  });

  it('should return a new array (immutability)', () => {
    const items = ['a', 'b', 'c'];
    const result = moveItem(items, 0, 1);
    expect(result).not.toBe(items);
  });
});
