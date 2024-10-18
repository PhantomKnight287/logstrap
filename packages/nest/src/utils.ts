import type { CallerInfo } from './types';

export function getCallerInfo(errorStack?: string): CallerInfo {
  const stack = (errorStack || new Error().stack)?.split('\n');
  const callerStackLine = stack?.[3]; // The 3rd line contains the caller's info

  let className = 'Unknown';
  let functionName = 'Unknown';

  if (callerStackLine) {
    const classNameMatch = callerStackLine.match(/at\s+([\w.]+)\s*\./);
    if (classNameMatch && classNameMatch[1]) {
      className = classNameMatch[1];
    }

    const methodNameMatch = callerStackLine.match(/\.(\w+)\s*[\(<]/);
    if (methodNameMatch && methodNameMatch[1]) {
      functionName = methodNameMatch[1];
    } else {
      // Check for function outside a class
      const standaloneFunctionMatch =
        callerStackLine.match(/at\s+(\w+)\s*[\(<]/);
      if (standaloneFunctionMatch && standaloneFunctionMatch[1]) {
        functionName = standaloneFunctionMatch[1];
        className = undefined;
      }
    }
  }

  return { className, functionName };
}
