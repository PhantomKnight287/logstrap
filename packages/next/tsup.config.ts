import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts', 'src/app/index.ts'],
  dts: true,
  format: ['esm'],
  target: 'node18',
  external: ['next', 'typescript'],
  sourcemap: true,
});
