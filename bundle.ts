import * as esbuild from 'esbuild';

esbuild.build({
    entryPoints: ['src/main.ts'],
    bundle: true,
    outfile: './bundle/bundle.js',
    minify: true
})