import { defineConfig, loadEnv } from 'vite';
import solidPlugin from 'vite-plugin-solid';

export default defineConfig(({ mode }) => {
  Object.assign(process.env, loadEnv(mode, process.cwd()));
  console.log(process.env);
  return {
    plugins: [solidPlugin()],
    base: process.env.BASEPATH || '/',
    build: {
      target: 'esnext',
      polyfillDynamicImport: false,
    },
  }
});
