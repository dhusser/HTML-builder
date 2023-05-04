const fs = require('fs'),
  path = require('path');

const directory = path.join(__dirname, 'secret-folder');

fs.readdir(directory, (err, files) => {
  if (err) throw err;

  for (let file of files) {
    const filePath = path.join(directory, file);

    fs.stat(filePath, (err, stats) => {
      if (err) throw err;
      if (stats.isFile()) {

        const fileSizeInKilobytes = stats.size / 1024,
          name = path.parse(file).name,
          ext = path.parse(file).ext.substring(1);

        console.log(`${name} - ${ext} - ${fileSizeInKilobytes.toFixed(2)}kb`)
      }
    })
  }
})