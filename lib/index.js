const fs = require('fs');
const path = require('path');
const exif = require('./Exif');
const createFilePath = (input) => (filename) => path.resolve(path.join(input, filename))
const pkg = require('../package.json');

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

module.exports = function (input, output, executable = pkg.imageSorterConfig.executablePath) {
  const createPath = createFilePath(input)
  const handleFile = createFileHandle(output);

  fs.readdir(path.resolve(input), (err, files) => {
    let filesString = files.map(file => createPath(file)).join(' ');
    exif.createExif(executable)(filesString, ['j', 'q']).then(data => {
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
}




