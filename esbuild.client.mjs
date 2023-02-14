import esbuild from 'esbuild';
import { livereloadPlugin } from '@jgoz/esbuild-plugin-livereload';
import { lessLoader } from 'esbuild-plugin-less';

const watch = process.argv.includes('--watch');

const buildOptions = {
  entryPoints: ['src/client/script.ts', 'src/client/style.less'],
  outdir: 'dist/client',
  bundle: true,
  minify: !watch,
  sourcemap: watch,
  target: 'node16',
  logLevel: 'info',
};

if (watch) {
  buildOptions.plugins = [livereloadPlugin(), lessLoader()];
  const ctx = await esbuild.context(buildOptions);
  await ctx.watch();
} else {
  buildOptions.plugins = [lessLoader()];
  await esbuild.build(buildOptions);
}
