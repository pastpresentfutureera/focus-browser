const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  navigateTo:          (url) => ipcRenderer.invoke('navigate-to', url),
  loadAfterChallenge:  (url) => ipcRenderer.invoke('load-after-challenge', url),
  openPDF:             ()    => ipcRenderer.invoke('open-pdf'),
  goHome:              ()    => ipcRenderer.invoke('go-home'),
  goBack:              ()    => ipcRenderer.invoke('go-back'),
  goForward:           ()    => ipcRenderer.invoke('go-forward'),
  refreshPage:         ()    => ipcRenderer.invoke('refresh-page'),
  hideContentView:     ()    => ipcRenderer.invoke('hide-content-view'),
  showContentView:     ()    => ipcRenderer.invoke('show-content-view'),
  getAllowedSite:      ()    => ipcRenderer.invoke('get-allowed-site'),
  onShowChallenge:     (cb)  => ipcRenderer.on('show-challenge', (_e, url) => cb(url)),
  onURLChanged:        (cb)  => ipcRenderer.on('url-changed', (_e, url) => cb(url)),
});
