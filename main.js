const { app, BrowserWindow, BrowserView, ipcMain, dialog } = require('electron');
const path = require('path');

// ╔══════════════════════════════════════════════════╗
// ║   🔧 CONFIGURATION — ONLY arena.ai ALLOWED      ║
// ╚══════════════════════════════════════════════════╝
const ALLOWED_WEBSITES = [
  'https://arena.ai'
];
// ════════════════════════════════════════════════════

let mainWindow;
let contentView;

// --- URL Checking ---
function isURLAllowed(url) {
  if (!url || url === '' || url === 'about:blank') return true;
  if (url.startsWith('file://')) return true;
  if (url.startsWith('chrome://')) return true;
  if (url.startsWith('devtools://')) return true;
  if (url.startsWith('data:')) return false;

  try {
    const urlHost = new URL(url).hostname;
    return ALLOWED_WEBSITES.some(allowed => {
      const allowedHost = new URL(allowed).hostname;
      return urlHost === allowedHost ||
             urlHost.endsWith('.' + allowedHost);
    });
  } catch {
    return false;
  }
}

// --- Window Management ---
function updateViewBounds() {
  if (!mainWindow || !contentView) return;
  const { width, height } = mainWindow.getContentBounds();
  contentView.setBounds({ x: 0, y: 50, width, height: height - 50 });
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    title: 'Focus Browser',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  mainWindow.setMenuBarVisibility(false);
  mainWindow.loadFile('index.html');

  contentView = new BrowserView({
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
  });

  mainWindow.setBrowserView(contentView);
  updateViewBounds();
  contentView.setAutoResize({ width: true, height: true });
  contentView.webContents.loadURL(ALLOWED_WEBSITES[0]);

  contentView.webContents.on('will-navigate', (event, url) => {
    if (!isURLAllowed(url)) {
      event.preventDefault();
      mainWindow.webContents.send('show-challenge', url);
    }
  });

  contentView.webContents.on('will-redirect', (event, url) => {
    if (!isURLAllowed(url)) {
      event.preventDefault();
      mainWindow.webContents.send('show-challenge', url);
    }
  });

  contentView.webContents.setWindowOpenHandler(({ url }) => {
    if (isURLAllowed(url)) {
      contentView.webContents.loadURL(url);
    } else {
      mainWindow.webContents.send('show-challenge', url);
    }
    return { action: 'deny' };
  });

  contentView.webContents.on('did-navigate', (_event, url) => {
    mainWindow.webContents.send('url-changed', url);
  });
  contentView.webContents.on('did-navigate-in-page', (_event, url) => {
    mainWindow.webContents.send('url-changed', url);
  });

  mainWindow.on('resize', updateViewBounds);
}

// ========== IPC HANDLERS ==========

ipcMain.handle('navigate-to', (_event, url) => {
  if (!/^https?:\/\//i.test(url) && !url.startsWith('file://')) {
    url = 'https://' + url;
  }
  if (isURLAllowed(url)) {
    contentView.webContents.loadURL(url);
    return { allowed: true };
  }
  return { allowed: false, url };
});

ipcMain.handle('load-after-challenge', (_event, url) => {
  mainWindow.setBrowserView(contentView);
  updateViewBounds();
  contentView.webContents.loadURL(url);
});

ipcMain.handle('open-pdf', async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openFile'],
    filters: [{ name: 'PDF Files', extensions: ['pdf'] }],
  });
  if (!result.canceled && result.filePaths.length > 0) {
    mainWindow.setBrowserView(contentView);
    updateViewBounds();
    contentView.webContents.loadURL('file://' + result.filePaths[0]);
    return { success: true };
  }
  return { success: false };
});

ipcMain.handle('go-home', () => {
  mainWindow.setBrowserView(contentView);
  updateViewBounds();
  contentView.webContents.loadURL(ALLOWED_WEBSITES[0]);
});

ipcMain.handle('go-back', () => {
  if (contentView.webContents.canGoBack()) contentView.webContents.goBack();
});

ipcMain.handle('go-forward', () => {
  if (contentView.webContents.canGoForward()) contentView.webContents.goForward();
});

ipcMain.handle('refresh-page', () => {
  contentView.webContents.reload();
});

ipcMain.handle('hide-content-view', () => {
  mainWindow.removeBrowserView(contentView);
});

ipcMain.handle('show-content-view', () => {
  mainWindow.setBrowserView(contentView);
  updateViewBounds();
});

ipcMain.handle('get-allowed-site', () => ALLOWED_WEBSITES[0]);

// ========== APP LIFECYCLE ==========

app.whenReady().then(createWindow);
app.on('window-all-closed', () => app.quit());
app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
