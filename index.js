const fs = require('fs');
const path = require('path');
const exif = require('./src/Exif');
const createFilePath = (input) => (filename) => path.resolve(path.join(input, filename))

const createFileHandle = (output) => (name, createDate) => {
  const yearMonthDay = createDate.split(' ')[0].split(':');
  const dest = path.resolve(path.join(output, ...yearMonthDay));
  if (!fs.existsSync(dest)) {
    console.log("%s dose not Excists. Creating", dest);
    fs.mkdirSync(dest, {recursive: true});
  }
  const filename = path.basename(name);
  console.log("move %s to %s", filename, dest);
  fs.renameSync(name, path.join(dest, filename));
}

const argv = require('minimist')(process.argv.slice(2));

const input = argv['input'];
const output = argv['output'];

if(!input) {
  throw Error("Input is not set");
}

if(!output) {
  throw Error("Output is not set");
}

const createPath = createFilePath(input)
const handleFile = createFileHandle(output);

fs.readdir(path.resolve(input), (err, files) => {
  let filesString = files.map(file => createPath(file)).join(' ');
  exif(filesString, ['j', 'q']).then(data => {
    data.forEach(exif => {
      let sourceFile = exif['SourceFile'];
      let createDate = exif['CreateDate'];
      try {
        handleFile(sourceFile, createDate);
      } catch (e) {
        console.log("could not handle %s", sourceFile);
      }
    })
  });
});

