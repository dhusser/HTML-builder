const fs = require('fs');
const path = require('path');

function copyDir(sourceDir, targetDir) {
  fs.readdir(sourceDir,
    { withFileTypes: true },
    (err, files) => {
      if (err) throw new Error(`Error copying directory: ${err}`);

      fs.access(targetDir, (err) => {
        if (err) {
          createDirectory(targetDir);
        } else {
          removeExtraFiles(targetDir, files);
        }

        for (const file of files) {
          const sourcePath = path.join(sourceDir, file.name);
          const targetPath = path.join(targetDir, file.name);
  
          if (file.isDirectory()) {
            copyDir(sourcePath, targetPath);
          } else {
            copyFile(sourcePath, targetPath);
          }
        }
      });


    });
}

function createDirectory(targetDir) {
  fs.mkdir(targetDir,
    { recursive: true },
    (err) => {
      if (err) throw new Error(`Error creating directory: ${err}`);
    });
}

function removeExtraFiles(targetDir, targetFiles) {
  fs.readdir(targetDir,
    { withFileTypes: true },
    (err, files) => {
      if (err) throw new Error(`Error removing extra files: ${err}`);
      for (let file of files) {

        const filePath = path.join(targetDir, file.name);

        if (!targetFiles.find(f => f.name === file.name)) {
          fs.unlink(filePath, err => {
            if (err) throw err;
            console.log(`${filePath} was removed.`)
          });
        }
      }
    });
}

function copyFile(sourcePath, targetPath) {
  fs.copyFile(sourcePath, targetPath, (err) => {
    if (err) throw new Error(`Error copying files: ${err}`);
    console.log(`${sourcePath} was copied.`);
  });
}

const sourceDir = path.join(__dirname, 'files');
const targetDir = path.join(__dirname, 'files-copy');

copyDir(sourceDir, targetDir);