const childProcess = require('child_process');
const pkg = require('../package.json');
const fs = require('fs');
const path = require('path');


const createExecution = (exifExecuteable) => (filesString, options = []) => new Promise(function (resolve, reject) {

  let absolutepath = path.resolve(exifExecuteable);
  if(fs.existsSync(absolutepath) && !fs.statSync(absolutepath).isFile()) {
    reject('Executable not found or it is a Directory.');
  }

  const optionsSting = options.map(o => o.length > 1 ? `--${o}`: `-${o}`).join(' ')

  childProcess.exec(
    `${absolutepath} ${optionsSting} ${filesString}`,
    {encoding: 'utf8'},
    (err, data) => {
        if(err) {
          return reject(err);
        }
        resolve(JSON.parse(data));
    });
});

const createExif = (exifExecutablePath ) => createExecution(exifExecutablePath)
const execute = createExecution(pkg.imageSorterConfig.executablePath);

module.exports = {
  createExif,
  execute
}