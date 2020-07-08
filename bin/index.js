#!/usr/bin/env node
let minimist = require('minimist');
const sort = require('../lib/index');

(function () {

  const argv = minimist(process.argv.slice(2));

  if(argv['help']) {
    console.log('image-sorter');
    console.log('\t--input path/to/images         the root path to the images.')
    console.log('\t--output path/to/output        the root path to the output folder.')
    console.log('\t--help                         Shows help');
    return;
  }

  const input = argv['input'];
  const output = argv['output'];

  if(!input) {
    throw Error("Input is not set");
  }

  if(!output) {
    throw Error("Output is not set");
  }

  sort(input, output);

})();
