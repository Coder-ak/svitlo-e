import esbuild from 'esbuild';
import serve from '@es-exec/esbuild-plugin-serve';

const watch = process.argv.includes('--watch');

const buildOptions = {
  entryPoints: ['./src/server/index.ts'],
  outfile: 'dist/server/index.js',
  bundle: true,
  minify: true,
  platform: 'node',
  sourcemap: false,
  target: 'node16',
  logLevel: 'info',
  packages: 'external',
};

if (watch) {
  buildOptions.plugins = [
    serve({
      main: 'dist/server/index.js',
    }),
  ];
  const ctx = await esbuild.context(buildOptions);
  await ctx.watch();
} else {
  await esbuild.build(buildOptions);
}
