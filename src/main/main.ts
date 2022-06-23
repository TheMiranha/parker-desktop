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
import { app, BrowserWindow, shell, ipcMain, Notification, Tray, Menu } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import MenuBuilder from './menu';
import { resolveHtmlPath } from './util';
import fs from 'fs';
import axios from 'axios';
import GithubDownloader from 'download-git-repo';

import pie from "puppeteer-in-electron";
import puppeteer from "puppeteer-core";

export default class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdates();
  }
}

const UPDATE_NOTIFICATION_TITLE = 'Parker';

autoUpdater.on('checking-for-update', () => {
})
autoUpdater.on('update-available', (ev, info) => {
  new Notification({ title: UPDATE_NOTIFICATION_TITLE, body: 'Atualização disponível.' }).show()
})
autoUpdater.on('update-not-available', (ev, info) => {
})
autoUpdater.on('error', (ev, err) => {
  new Notification({ title: UPDATE_NOTIFICATION_TITLE, body: 'Erro ao tentar atualizar.' }).show()
})
autoUpdater.on('download-progress', (ev, progressObj) => {
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
  return path.join(RESOURCES_PATH, x);
}

ipcMain.on('titlebar', async(event, arg: string) => {
  switch(arg) {
    case 'close':
    mainWindow?.hide();
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
  var config = fs.readFileSync(path.join('./','/plugins/' + plugin + '/config/config.json'), 'utf8');
  return JSON.parse(config);
}

async function setPluginConfig(plugin: string, config: any) {
  fs.writeFileSync(path.join('./','/plugins/' + plugin + '/config/config.json'), JSON.stringify(config));
}

async function getPlugins() {
  var pluginsFolders = fs.readdirSync(path.join('./','/plugins'));
  var plugins = [];
  pluginsFolders.forEach(folder => {
    var packageJson = fs.readFileSync(path.join('./','/plugins/' + folder + '/package.json'), 'utf8');
    packageJson = JSON.parse(packageJson);
    var plugin = {};
    plugin['package'] = packageJson;
    plugin['folder'] = folder;
    plugins.push(plugin);
  });
  return plugins;
}

async function downloadPlugin(repo, callBack) {
  GithubDownloader('github:' + repo, path.join('./','/plugins/' + repo.split('/')[1]), (err) => {
    callBack();
  })
}

async function saveConfig(config: any) {
  fs.writeFileSync('./data/config/config.json', JSON.stringify(config));
}

ipcMain.on('getAssetsPath', async(event, arg) => {
  event.reply('getAssetsPath', path.join('./',arg));
})

ipcMain.on('downloadPlugin', async(event, arg) => {
  var {repo} = arg;
  downloadPlugin(repo, () => {
    event.reply('downloadPlugin', 'done');
  });
})

ipcMain.on('removePlugin', async(event, arg) => {
  var {folder} = arg;
  fs.rmSync(path.join('./','/plugins/' + folder), { recursive: true, force: true });
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

var checked = false;

const createWindow = async () => {
  if (isDebug) {
    await installExtensions();
  }

  mainWindow = new BrowserWindow({
    show: false,
    width: 1500,
    frame: false,
    height: 850,
    minHeight: 728,
    minWidth: 1024,
    icon: getAssetPath('icon.png'),
    webPreferences: {
      webviewTag: true,
      nodeIntegration: true,
      preload: app.isPackaged
        ? path.join(__dirname, 'preload.js')
        : path.join(__dirname, '../../.erb/dll/preload.js'),
    },
  });

  mainWindow.loadURL(resolveHtmlPath('index.html'));

  mainWindow.on('ready-to-show', async() => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
    }
    var init = async() => {
      const browser = await pie.connect(app, puppeteer);

      const window = new BrowserWindow();
      const url = "https://google.com/";
      await window.loadURL(url);

      const page = await pie.getPage(browser, window);
      console.log(page.url());
      window.destroy();
    }
    
    init();
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
  if (checked == false)
{
  new AppUpdater();
  checked = true;
} else {
}
}
};

/**
 * Add event listeners...
 */

 app.setAppUserModelId('Parker');
app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

let tray = null;
app
  .whenReady()
  .then(() => {
    createWindow();
    tray = new Tray(getAssetPath('icon.png'));
    const contextMenu = Menu.buildFromTemplate([
      {label: 'Abrir', click: () => mainWindow?.show()},
      {label: 'Encerrar', click: () => app.quit()}
    ]);
    tray.setToolTip('Parker');
    tray.setContextMenu(contextMenu);

    app.on('activate', () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (mainWindow === null) createWindow();
    });
  })
  .catch(console.log);