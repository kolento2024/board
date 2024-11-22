const { app, protocol, BrowserWindow, globalShortcut } = require('electron')
// 需在当前文件内开头引入 Node.js 的 'path' 模块
const path = require('path')
 
app.commandLine.appendSwitch("--ignore-certificate-errors", "true");
// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
    { scheme: "app", privileges: { secure: true, standard: true } }
]);
 
const createWindow = () => {
    const win = new BrowserWindow({
        minWidth: 1350,
        minHeight: 846,
        width: 1400,
        height: 846,
        //窗口是否在屏幕居中. 默认值为 false
        center: true,
        //设置为 false 时可以创建一个无边框窗口 默认值为 true。
        frame: true,
        //窗口是否在创建时显示。 默认值为 true。
        show: true,
        icon:'/build/wangzai.jpg',
        webPreferences: {
            nodeIntegration: true,
            nodeIntegrationInWorker: true,
            // preload: path.join(__dirname, '/preload.js'),
            webSecurity: false,
            contextIsolation: true, // 如果你需要使用 Node.js 功能
        }
    })
    win.setMenu(null)

    console.log('执行..........');
    // win.loadFile("/electron/index.html");
    // win.loadFile(path.resolve(__dirname, '/electron/index.html')) // 新增
    // win.loadURL('http://127.0.0.1:5173/')
    // win.loadFile(path.resolve(__dirname, '/dist/index.html')) // 新增
    // if (app.isPackaged) {
    // win.loadUrl(`file://${path.join(__dirname, '/dist/index.html')}`);
    //     win.loadFile(path.resolve(__dirname, '/dist/index.html')) // 新增
    // } else {
    //     win.loadURL('http://127.0.0.1:5173/')
    //        //win.loadURL('http://localhost:5173/')
    //     // win.webContents.openDevTools()
    // }
    win.loadFile(path.join(__dirname, 'index.html'));
    // win.loadFile(path.resolve('../dist/index.html')) // 新增
    
    globalShortcut.register("CommandOrControl+Shift+i", function () {
        win.webContents.openDevTools();
    });
 
}
 
app.whenReady().then(() => {
 
    createWindow()
 
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})
 
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})
