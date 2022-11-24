import * as esbuild from 'esbuild';

await esbuild.build({
    entryPoints: ['src/main.ts'],
    bundle: true,
    outfile: './public/bundle.js',
    minify: true
})

Deno.exit(1)