import * as esbuild from 'esbuild'

const watch = process.argv.includes("--watch");

const buildOptions = {
  entryPoints: ['./src/client/script.ts'],
  outfile: 'dist/client/script.js',
  bundle: true,
  minify: !watch,
  sourcemap: watch,
  target: 'node16',
  logLevel: 'info',
};

if (watch) {
  const ctx = await esbuild.context(buildOptions);
  await ctx.watch();
} else {
  await esbuild.build(buildOptions);
}
