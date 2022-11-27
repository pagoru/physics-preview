import * as esbuild from 'esbuild';
import { parse } from "$deno/flags/mod.ts";

const flags = parse(Deno.args, {
    boolean: ["dev"],
    string: ["version"],
    default: { dev: false },
});

await esbuild.build({
    entryPoints: ['src/main.ts'],
    bundle: true,
    outfile: './public/bundle.js',
    minify: !flags.dev
})

console.warn(flags.dev)

Deno.exit(0)