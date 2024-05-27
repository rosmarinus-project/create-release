import * as path from 'path';
import { describe, beforeEach, afterEach, test, expect } from '@jest/globals';
import semver from 'semver';

describe('third', () => {
  beforeEach(() => {});

  afterEach(() => {});

  test('path', () => {
    expect(path.join('/root', '')).toBe('/root');
  });
  test('semver', () => {
    expect(semver.valid('1.10.15')).toBe('1.10.15');
    expect(semver.valid('v1.10.15')).toBe('1.10.15');
  });
});
