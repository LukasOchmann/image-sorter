const childProcess = require('child_process');
const config = require('./config.json');
const fs = require('fs');
const path = require('path');


module.exports = (filesString, options = []) => new Promise(function (resolve, reject) {

  let absolutepath = path.resolve(config.exifExecuteable);
  if(fs.existsSync(absolutepath) && !fs.statSync(absolutepath).isFile()) {
    reject('Executable not found or it is a Directory.');
  }

  const optionsSting = options.map(o => o.length > 1 ? `--${o}`: `-${0}`).join(' ')

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

