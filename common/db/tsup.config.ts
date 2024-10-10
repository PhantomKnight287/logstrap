import { defineConfig } from 'tsup';

export default defineConfig({
  external: [],
  dts: true,
  entry: ['src/schema.ts'],
});
