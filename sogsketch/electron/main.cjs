const {app,BrowserWindow}=require("electron");
const path=require("node:path");

function createWindow(){
 const window=new BrowserWindow({width:1440,height:940,minWidth:900,minHeight:620,backgroundColor:"#1d1d1d",title:"SogSketch",webPreferences:{contextIsolation:true,nodeIntegration:false,sandbox:true}});
 window.removeMenu();
 void window.loadFile(path.join(__dirname,"..","index.html"));
}

app.whenReady().then(()=>{createWindow();app.on("activate",()=>{if(BrowserWindow.getAllWindows().length===0)createWindow()})});
app.on("window-all-closed",()=>{if(process.platform!=="darwin")app.quit()});
