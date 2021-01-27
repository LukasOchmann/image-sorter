const fs = require('fs');

function move(source, dest) {
  return fs.renameSync(source, dest);
}

function copy(source, dest) {
  fs.copyFileSync(source, dest);
}

function exists(fileOrDir) {
  return fs.existsSync(fileOrDir);
}

function isDir(path) {
  return fs.statSync(path).isDirectory();
}

function makeDir(path, options = {recursive: true}) {
  return !exists(path) && fs.mkdirSync(path, options);
}

function listFiles(path, options = {}) {
  if (isDir(path)) {
    return new Promise(function (resolve, reject) {
      fs.readdir(path, options, ((err, files) => {
        if (err) {
          return reject(err);
        }
        return resolve(files)
      }))
    });
  }
  return Promise.reject("Not a Directory");
}


module.exports = {
  move,
  exists,
  isDir,
  makeDir,
  listFiles,
  copy
}
