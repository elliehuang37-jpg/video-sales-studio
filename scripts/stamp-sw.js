// 依 index.html、manifest、圖示與素材內容產生版本號寫進 sw.js。改檔後、commit 前執行：node scripts/stamp-sw.js
const fs=require('fs'),path=require('path'),crypto=require('crypto');
const root=path.join(__dirname,'..');
const list=d=>fs.readdirSync(path.join(root,d)).sort().map(f=>d+'/'+f);
const files=['index.html','manifest.webmanifest',...list('icons'),...list('assets')];
const h=crypto.createHash('sha256'); for(const f of files) h.update(fs.readFileSync(path.join(root,f)));
const v='v-'+h.digest('hex').slice(0,10);
const p=path.join(root,'sw.js'); fs.writeFileSync(p,fs.readFileSync(p,'utf8').replace(/const VERSION = '[^']*';/,`const VERSION = '${v}';`));
console.log('sw.js version',v);
