import pkg from './package.json';

export default {
  plugins: [],
  external: ['kronos-interceptor'],
  input: pkg.module,

  output: {
    format: 'cjs',
    file: pkg.main
  }
};
