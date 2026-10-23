import { chromium } from '@playwright/test';
import { mkdir } from 'node:fs/promises';
const browser = await chromium.launch({ headless: true });
try {
  const page = await browser.newPage({
    viewport: { width: 1200, height: 630 },
    deviceScaleFactor: 1,
  });
  await page.setContent(
    `<!doctype html><html><head><meta charset="utf-8"><style>*{box-sizing:border-box}body{margin:0;width:1200px;height:630px;background:#f5f8ff;color:#17263f;font-family:Arial,sans-serif;padding:60px 74px;position:relative}header{display:flex;align-items:center;gap:16px;font-size:22px;font-weight:bold}.logo{border:1px solid #7298d0;background:#234dc5;border-radius:10px;padding:12px;color:#ffffff}.role{font:13px monospace;letter-spacing:3px;color:#526078;margin-top:6px}h1{font-size:74px;line-height:1.1;letter-spacing:-3px;font-weight:700;margin:65px 0 28px;max-width:1000px}h1 span{color:#234dc5}p{font-size:23px;color:#526078;margin:0}footer{position:absolute;bottom:48px;left:74px;right:74px;border-top:1px solid #344f70;padding-top:24px;display:flex;justify-content:space-between;font-size:16px;color:#526078}.mark{position:absolute;right:78px;top:70px;width:170px;height:170px;border:1px solid #314d70;border-radius:50%;opacity:.6}.mark:after{content:'';position:absolute;inset:24px;border:1px solid #4a6891;border-radius:50%}</style></head><body><header><span class="logo">PE</span><div>Pratheek Eranki<div class="role">SOFTWARE / AI / DATA</div></div></header><div class="mark"></div><h1>Building software.<br><span>Making data useful.</span></h1><p>Software engineering · Research data · AI projects</p><footer><span>Projects. Decisions. Evaluation.</span><span>pratheekeranki.github.io/portfolio</span></footer></body></html>`,
  );
  await mkdir('public/images', { recursive: true });
  await page.screenshot({ path: 'public/images/social-preview.png' });
} finally {
  await browser.close();
}
