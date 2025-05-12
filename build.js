const esbuild = require('esbuild');
const path = require('path');
const globber = require('fast-glob');

const tsconfigPath = path.join(__dirname, 'tsconfig.json');
const tsconfig = require(tsconfigPath);

const { dtsPlugin } = require('esbuild-plugin-d.ts');

(async () => {
  console.log('Configuring build');
  const outdir = path.join(__dirname, tsconfig.compilerOptions.outDir);
  const entryPoints = await globber(
    tsconfig.include.map((glob) => path.join(__dirname, glob))
  );

  const options = {
    bundle: false,
    outdir,
    target: tsconfig.compilerOptions.target,
    platform: 'node',
    format: 'cjs',
    sourcemap: tsconfig.compilerOptions.sourceMap,
    tsconfig: tsconfigPath,
    entryPoints,
    plugins: [dtsPlugin({tsconfig})],
  };

  console.log('Building');
  const buildResult = await esbuild.build(options);

  if (buildResult.errors.length) {
    console.log(result.errors);
    process.exit(1);
  }
  if (buildResult.warnings.length) {
    console.log(result.warnings);
    process.exit(1);
  }

  options.bundle = true;
  options.entryPoints = [path.join(__dirname,"src","main.ts")];
  options.outfile     = path.join(options.outdir,"main.bundle.js");
  options.platform    = 'browser';
  delete options.outdir;

  console.log('Building bundle');
  const bundleResult = await esbuild.build(options);

  if (bundleResult.errors.length) {
    console.log(result.errors);
    process.exit(1);
  }
  if (bundleResult.warnings.length) {
    console.log(result.warnings);
    process.exit(1);
  }

  //console.log({
  //  options,
  //  result,
  //});



  console.log('Done');
})();
