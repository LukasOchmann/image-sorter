const fs = require('./FileSystemDao');
const path = require('path');
const exif = require('./Exif');
const pkg = require('../package.json');

const createFilePath = (input) => (filename) => path.resolve(path.join(input, filename))

const createFileHandle = (output, use = fs.move) => (name, createDate) => {
  const yearMonthDay = createDate.split(' ')[0].split(':');
  const dest = path.resolve(path.join(output, ...yearMonthDay));
  if (!fs.exists(dest)) {
    console.log("%s dose not Excists. Creating", dest);
    fs.makeDir(dest, {recursive: true});
  }
  const filename = path.basename(name);
  use(name, path.join(dest, filename));
  return [filename, dest, null];
}

const defaultOptions = {
  executable: pkg.imageSorterConfig.executablePath,
  copy: false
}

module.exports = function (input, output, options = defaultOptions, callback = (summary) => null) {
  const createPath = createFilePath(input)
  const handleFile = createFileHandle(output, options.copy ? fs.copy : fs.move);
  let exec = exif.createExif(options.executable);

  fs.listFiles(path.resolve(input)).then(files => {
    const resolved = files.map(file => {
      return exec(createPath(file), ['j', 'q']).then(data => {
        const exif = data[0];
        let sourceFile = exif['SourceFile'];
        let createDate = exif['CreateDate'];
        try {
          return handleFile(sourceFile, createDate);
        } catch (e) {
          console.log("could not handle %s", sourceFile, e);
          return [sourceFile, 'N/A', e];
        }
      });
    });

    return Promise.all(resolved).then((summary) => {
      callback(summary)
    });

  });
}




