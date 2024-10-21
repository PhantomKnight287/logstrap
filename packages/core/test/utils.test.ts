import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getCrypto, generateId, getCallerInfo } from '../src/utils';

describe('getCallerInfo', () => {
  it('should return class and function name for class method', () => {
    function testFunction() {
      return getCallerInfo();
    }
    class TestClass {
      testMethod() {
        return testFunction();
      }
    }
    const result = new TestClass().testMethod();
    expect(result).toEqual({ className: 'TestClass', functionName: 'testMethod' });
  });

  it('should return function name for standalone function', () => {
    function testStandaloneFunction() {
      return getCallerInfo();
    }
    const result = testStandaloneFunction();
    expect(result).toEqual({ className: "Unknown", functionName: 'testStandaloneFunction' });
  });

  it('should return Unknown for unrecognized stack', () => {
    const result = getCallerInfo('Unrecognized stack');
    expect(result).toEqual({ className: 'Unknown', functionName: 'Unknown' });
  });
});
