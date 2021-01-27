#!/usr/bin/env node
let minimist = require('minimist');
const sort = require('../lib/index');
let pkg = require('../package.json');
const path = require('path');


function writeTriplet(source, dest, err) {
  if (err) {
    return console.error(`Could not move ${ source }. Because of: ${ err }`)
  }
  return console.log(`Moved ${ source } to ${ dest }`);
}


(function () {

  const argv = minimist(process.argv.slice(2));

  if (argv['help']) {
    console.log('imageSorter [options] source destination');
    console.log(`Version: ${ pkg.version }\n`);
    console.log(path.resolve(__dirname, pkg.imageSorterConfig.executablePath));
    console.log('\t --executable path/executable  The path the executable.')
    console.log('\t --copy                        Copy instead of move')
    console.log('\t --help                         Shows help.');
    return;
  }

  const input = argv._[0];
  const output = argv._[1];

  const executable = argv['executable'] ? argv['executable'] : path.resolve(__dirname, pkg.imageSorterConfig.executablePath);
  const copy = argv['copy'];

  if (!input) {
    console.error("Input is not set");
    return;
  }

  if (!output) {
    console.error("Output is not set");
    return;
  }

  console.log(`Files will be ${copy ? 'copied' : 'moved'} from ${input} to ${output}`);

  sort(input, output, {executable, copy}, (summary) => summary.forEach((triplet) => writeTriplet(...triplet)));

})();
