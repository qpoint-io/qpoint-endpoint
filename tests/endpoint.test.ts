import { describe, it, expect } from 'vitest';
import { GetEnv } from '../src/endpoint';

describe('getEnvVariable', () => {
  it('should retrieve environment variable in Node.js environment', () => {
    // Mock process.env for Node.js
    const originalProcess = global.process;
    global.process = { env: { SOME_VAR_KEY: 'some_var_value' } } as any;

    expect(GetEnv('SOME_VAR_KEY')).toBe('some_var_value');

    // Restore original process.env after the test
    global.process = originalProcess;
  });

  it('should retrieve environment variable in Deno environment', () => {
    // Mock Deno.env for Deno
    const originalDeno = (global as any).Deno;
    (global as any).Deno = { env: { get: (key: string) => key === 'SOME_VAR_KEY' ? 'some_deno_var_value' : undefined } };

    expect(GetEnv('SOME_VAR_KEY')).toBe('some_deno_var_value');

    // Restore original Deno after the test
    (global as any).Deno = originalDeno;
  });
});
