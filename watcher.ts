const process = Deno.run({
	cmd: ['deno', 'run', '-A', 'bundler.ts'],
	stdout: 'piped',
	stderr: 'piped',
});

const [status, stdout, stderr] = await Promise.all([
	process.status(),
	process.output(),
	process.stderrOutput(),
]);

const error = new TextDecoder().decode(stderr);
error ? console.error(error) : console.log(`Done!`);

process.close();
