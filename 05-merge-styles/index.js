const fs = require('fs');
const path = require('path');

const stylesFolderPath = path.join(__dirname, 'styles');
const bundleFilePath = path.join(__dirname, 'project-dist/bundle.css');
const output = fs.createWriteStream(bundleFilePath)

fs.readdir(stylesFolderPath, (err, files) => {
  if (err) throw err;

  files.forEach((file) => {
    const filePath = path.join(stylesFolderPath, file);

    if (path.parse(filePath).ext === '.css') {
      const input = fs.createReadStream(filePath, 'utf-8');
      input.on('data', chunk => output.write(chunk + '\n'));
    }
  });

  console.log('bundle.css created');
});