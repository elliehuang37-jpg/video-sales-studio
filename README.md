# 影音銷售生成器（AI Sales Video Studio）

輸入腳本、需求或產品圖，排出分鏡，生成**產品示範／使用教學／UGC 見證**短影音，並在瀏覽器內錄製成 MP4／WebM。

- 單檔 PWA：`index.html`＋`manifest.webmanifest`＋`sw.js`，可安裝、可離線。
- AI 分鏡：在 Claude Artifact 中使用檢視者自己的 Claude；安裝版需在「AI 連線設定」貼上自己的 Anthropic API 金鑰（只存在本機瀏覽器）。
- 內建台灣化粧品廣告風險用語檢查；UGC 模式自動加上體驗分享揭露。

## 更新流程
1. 改 `index.html`
2. `node scripts/stamp-sw.js`
3. `node scripts/build-artifact.js <輸出路徑>`（Artifact 版，發佈時附 `assets/hero.webp`）
4. commit → push（GitHub Pages 約 1 分鐘生效）

本機預覽：`node scripts/serve.js 5231`
