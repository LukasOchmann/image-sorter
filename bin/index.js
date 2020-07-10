#!/usr/bin/env node
let minimist = require('minimist');
const sort = require('../lib/index');
let pkg = require('../package.json');

(function () {

  const argv = minimist(process.argv.slice(2));

  if(argv['help']) {
    console.log('imageSorter [options] source destination');
    console.log('\t --executable path/executable  The path the executable.')
    console.log('\t--help                         Shows help.');
    return;
  }

  const input = argv._[0];
  const output = argv._[1];

  const executable = argv['executable'] ? argv['executable'] : pkg.imageSorterConfig.executablePath;

  if(!input) {
    console.error("Input is not set");
    return;
  }

  if(!output) {
    console.error("Output is not set");
    return;
  }

  sort(input, output, executable);

})();
