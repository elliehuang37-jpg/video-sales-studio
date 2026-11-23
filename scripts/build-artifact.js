// 由 index.html 產生 Claude Artifact 版（去掉 PWA 專用 head、SW 註冊仍保留但在 Artifact 中不會執行）。
// node scripts/build-artifact.js [輸出路徑]   預設 dist/artifact.html；發佈時 files 要帶 assets/hero.webp
const fs=require('fs'),path=require('path');
const root=path.join(__dirname,'..');
const src=fs.readFileSync(path.join(root,'index.html'),'utf8');
const head=src.slice(src.indexOf('<!--ARTIFACT-START-->')+21,src.indexOf('<!--HEAD-END-->')).replace(/<!--PWA-HEAD-START-->[\s\S]*?<!--PWA-HEAD-END-->\n?/,'');
const body=src.slice(src.indexOf('<body>')+6,src.lastIndexOf('</body>'));
const out=process.argv[2]||path.join(root,'dist','artifact.html');
fs.mkdirSync(path.dirname(out),{recursive:true});
fs.writeFileSync(out,head.trim()+'\n'+body.trim()+'\n');
console.log('artifact →',out,fs.statSync(out).size,'bytes');
