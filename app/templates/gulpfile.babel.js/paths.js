// Folders
const appFolder = 'app';
const tempFolder = '.tmp';
const buildFolder = 'build';

const imagesFolder = 'images';
const scriptsFolder = 'scripts';
const stylesFolder = 'styles';
const viewsFolder = 'views';

// Paths
const srcPath = `${appFolder}/src`;
const publicPath = `${appFolder}/public`;

const imagesPath = `${srcPath}/${imagesFolder}`;
const scriptsPath = `${srcPath}/${scriptsFolder}`;
const stylesPath = `${srcPath}/${stylesFolder}`;
const viewsPath = `${srcPath}/${viewsFolder}`;

export default {
  appFolder, tempFolder, buildFolder,

  srcPath, publicPath,

  imagesFolder, imagesPath,
  scriptsFolder, scriptsPath,
  stylesFolder, stylesPath,
  viewsFolder, viewsPath,
};
