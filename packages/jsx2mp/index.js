const {
  existsSync,
  mkdirpSync,
  removeSync,
} = require('fs-extra');
const colors = require('colors');
const App = require('./transformer/App');
const Watch = require('./transformer/Watcher');
const {isDirectory} = require('./utils/file');
const {printLog, ask} = require('./utils/log');
const {invokeNpmInstall} = require('./utils/npm');

/**
 * Transform a jsx project.
 * @param sourcePath {String} Absolute path to source path.
 * @param distPath {String} Absolute distPath to source path.
 * @param enableWatch {Boolean} Watch file changes.
 */
async function transformJSXToMiniProgram(sourcePath, distPath, enableWatch = false) {
  if (!isDirectory(sourcePath)) throw new Error('Not a valid path.');

  if (existsSync(distPath)) {
    const needClean = await ask('发现目标目录 dist 已存在，是否需要清理?');
    if (needClean) {
      removeSync(distPath);
      printLog(colors.green('清理完成'), 'dist/');
    }
  }

  // Make sure dist directory created.
  mkdirpSync(distPath);
  printLog(colors.green('创建目录'), 'dist/');

  new App(sourcePath, {
    appDirectory: sourcePath,
    distDirectory: distPath,
  });

  if (enableWatch) {
    printLog(colors.green('将监听以下路径的文件变更'), sourcePath);
    new Watch({sourcePath, distPath});
  }

  // const shouldInstallDistNPM = await ask('是否需要自动安装 npm 到构建目录中?', false);
  // if (shouldInstallDistNPM) {
  //   invokeNpmInstall(distPath);
  // }
}

module.exports = transformJSXToMiniProgram;
