const path = require('path');
const fsPromises = require('fs/promises');

const componentsPath = path.join(__dirname, 'components');
const tags = {};

(async () => {
  try {
    const projectPath = path.join(__dirname, 'project-dist');
    await fsPromises.rm(projectPath, { recursive: true, force: true });
    await fsPromises.mkdir(projectPath, { recursive: true });

    async function copyAssets(sourceDir, targetDir) {
      await fsPromises.mkdir(targetDir, { recursive: true });
      const files = await fsPromises.readdir(sourceDir, { withFileTypes: true });

      await Promise.all(files.map(async (file) => {
        const sourcePath = path.join(sourceDir, file.name);
        const targetPath = path.join(targetDir, file.name);

        if (file.isDirectory()) {
          await copyAssets(sourcePath, targetPath);
        } else if (file.isFile()) {
          await fsPromises.copyFile(sourcePath, targetPath);
        }
      }));
    }

    await copyAssets(path.join(__dirname, 'assets'), path.join(projectPath, 'assets'));

    const template = await fsPromises.readFile(path.join(__dirname, 'template.html'), { encoding: 'utf8' });
    let renderPage = template;

    const componentsContent = await fsPromises.readdir(componentsPath, { withFileTypes: true });
    const targetFiles = componentsContent
      .filter(item => item.isFile() && path.parse(item.name).ext === '.html')
      .map(item => item.name);

    await Promise.all(targetFiles.map(async (fileName) => {
      const value = await fsPromises.readFile(path.join(componentsPath, fileName), { encoding: 'utf8' });
      tags[fileName.slice(0, -5)] = value.toString();
    }));

    for (let tag in tags) {
      renderPage = renderPage.replace(`{{${tag}}}`, tags[tag]);
    }

    await fsPromises.writeFile(path.join(projectPath, 'index.html'), renderPage);

    const stylesPath = path.resolve(__dirname, 'styles');
    const stylesFiles = await fsPromises.readdir(stylesPath, { withFileTypes: true });
    const stylesList = stylesFiles
      .filter(item => item.isFile() && path.parse(item.name).ext === '.css')
      .map(item => item.name);

    let bundle = '';
    await Promise.all(stylesList.map(async (file) => {
      const value = await fsPromises.readFile(path.join(stylesPath, file), { encoding: 'utf8' });
      bundle += value;
    }));

    await fsPromises.writeFile(path.join(projectPath, 'style.css'), bundle);
  } catch (err) {
    console.log(err);
  }
})();