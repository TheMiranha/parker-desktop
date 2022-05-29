/* eslint global-require: off, no-console: off, promise/always-return: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives us some performance wins.
 */
import path from 'path';
import { app, BrowserWindow, shell, ipcMain, Notification } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import MenuBuilder from './menu';
import { resolveHtmlPath } from './util';
import fs from 'fs';
import axios from 'axios';
import GithubDownloader from 'download-git-repo';

const { session } = require('electron')

export default class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdates();
  }
}

const UPDATE_NOTIFICATION_TITLE = 'Parker';

autoUpdater.on('checking-for-update', () => {
  new Notification({ title: UPDATE_NOTIFICATION_TITLE, body: 'Verificando atualizações' }).show()
})
autoUpdater.on('update-available', (ev, info) => {
  new Notification({ title: UPDATE_NOTIFICATION_TITLE, body: 'Atualização disponível.' }).show()
})
autoUpdater.on('update-not-available', (ev, info) => {
  new Notification({ title: UPDATE_NOTIFICATION_TITLE, body: 'Nenhuma atualização disponível.' }).show()
})
autoUpdater.on('error', (ev, err) => {
  new Notification({ title: UPDATE_NOTIFICATION_TITLE, body: 'Erro ao tentar atualizar.' }).show()
})
autoUpdater.on('download-progress', (ev, progressObj) => {
  new Notification({ title: UPDATE_NOTIFICATION_TITLE, body: 'Baixando atualização...' }).show()
})
autoUpdater.on('update-downloaded', (ev, info) => {
  new Notification({ title: UPDATE_NOTIFICATION_TITLE, body: 'Atualização baixada; Instalando em 5 segundos...' }).show()
  setTimeout(() => {
    autoUpdater.quitAndInstall();
  }, 5000);
});

let mainWindow: BrowserWindow | null = null;

const RESOURCES_PATH = app.isPackaged
? path.join(process.resourcesPath, 'assets')
: path.join(__dirname, '../../assets');

const getAssetPath = (x: string) => {
  return path.join('./', x);
}

ipcMain.on('titlebar', async(event, arg: string) => {
  switch(arg) {
    case 'close':
    app.quit();
    case 'minimize':
    mainWindow?.minimize();
    break;
    case 'maximize':
    mainWindow?.maximize();
    default:
  }
});

async function getConfig() {
  var config = fs.readFileSync('./data/config/config.json', 'utf8');
  return JSON.parse(config);
}

async function getPluginConfig(plugin: string) {
  var config = fs.readFileSync(getAssetPath('/plugins/' + plugin + '/config/config.json'), 'utf8');
  return JSON.parse(config);
}

async function setPluginConfig(plugin: string, config: any) {
  fs.writeFileSync(getAssetPath('/plugins/' + plugin + '/config/config.json'), JSON.stringify(config));
}

async function getPlugins() {
  var pluginsFolders = fs.readdirSync(getAssetPath('/plugins'));
  var plugins = [];
  pluginsFolders.forEach(folder => {
    var packageJson = fs.readFileSync(getAssetPath('/plugins/' + folder + '/package.json'), 'utf8');
    packageJson = JSON.parse(packageJson);
    var plugin = {};
    plugin['package'] = packageJson;
    plugin['folder'] = folder;
    plugins.push(plugin);
  });
  return plugins;
}

async function downloadPlugin(repo, callBack) {
  GithubDownloader('github:' + repo, getAssetPath('/plugins/' + repo.split('/')[1]), (err) => {
    callBack();
  })
}

async function saveConfig(config: any) {
  fs.writeFileSync('./data/config/config.json', JSON.stringify(config));
}

ipcMain.on('getAssetsPath', async(event, arg) => {
  event.reply('getAssetsPath', getAssetPath(arg));
})

ipcMain.on('downloadPlugin', async(event, arg) => {
  var {repo} = arg;
  downloadPlugin(repo, () => {
    event.reply('downloadPlugin', 'done');
  });
})

ipcMain.on('removePlugin', async(event, arg) => {
  var {folder} = arg;
  fs.rmSync(getAssetPath('/plugins/' + folder), { recursive: true, force: true });
  event.reply('removePlugin', {})
})

ipcMain.on('getStore', async(event, arg) => {
  var response = await axios.get('https://parker-servers-plugins.herokuapp.com/plugins');
  event.reply('getStore', {plugins: response.data});
})

ipcMain.on('appendPluginConfig', async (event, arg) => {
  var config = await getPluginConfig(arg.plugin);
  Object.keys(arg.toSet).forEach(key => {
    config[key] = arg.toSet[key];
  })
  setPluginConfig(arg.plugin, config);
})

ipcMain.on('setPluginConfig', async(event, arg) => {
  var {plugin, config} = arg;
  setPluginConfig(plugin, config);
})

ipcMain.on('getPluginConfig', async (event, arg) => {
  var {plugin} = arg;
  var config = await getPluginConfig(plugin);
  event.reply(plugin + '-config', {config, plugin});
})

ipcMain.on('getPlugins', async(event, arg) => {
  var plugins = await getPlugins();
  event.reply('getPlugins', plugins);
})

ipcMain.on('appendConfig', async (event, arg) => {
  var config = await getConfig();
  Object.keys(arg).forEach(key => {
    config[key] = arg[key];
  })
  saveConfig(config);
})

ipcMain.on('saveConfig', async (event,arg) => {
  await saveConfig(arg);
});

ipcMain.on('getConfig', async (event, arg) => {
  var config = await getConfig();
  event.reply('getConfig', config);
})

ipcMain.on('getTheme', async(event, arg) => {
  var config = await getConfig();
  event.reply('getTheme', config.theme);
});

ipcMain.on('changeTheme', async(event, arg) => {
  var config = await getConfig();
  config.theme = arg;
  saveConfig(config);
})

ipcMain.on('ipc-example', async (event, arg) => {
  const msgTemplate = (pingPong: string) => `IPC test: ${pingPong}`;
  event.reply('ipc-example', msgTemplate('pong'));
});

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

const isDebug =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDebug) {
  require('electron-debug')();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS'];

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload
    )
    .catch(console.log);
};

const createWindow = async () => {
  if (isDebug) {
    await installExtensions();
  }

  mainWindow = new BrowserWindow({
    show: false,
    width: 1024,
    frame: false,
    height: 728,
    minHeight: 728,
    minWidth: 1024,
    icon: getAssetPath('icon.png'),
    webPreferences: {
      preload: app.isPackaged
        ? path.join(__dirname, 'preload.js')
        : path.join(__dirname, '../../.erb/dll/preload.js'),
    },
  });

  mainWindow.loadURL(resolveHtmlPath('index.html'));

  mainWindow.on('ready-to-show', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
    }
    
    autoUpdater.checkForUpdatesAndNotify();
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  // Open urls in the user's browser
  mainWindow.webContents.setWindowOpenHandler((edata) => {
    shell.openExternal(edata.url);
    return { action: 'deny' };
  });

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  if (process.env.NODE_ENV === 'development') {
  // Skip autoupdate check
  }else {
  new AppUpdater();}
};

/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app
  .whenReady()
  .then(() => {
    createWindow();
    app.on('activate', () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (mainWindow === null) createWindow();
    });
  })
  .catch(console.log);