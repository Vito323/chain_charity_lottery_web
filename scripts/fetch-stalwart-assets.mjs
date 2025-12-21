import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_URL = 'https://stalwartai.webflow.io/';
const ASSETS_DIR = path.resolve(__dirname, '../public/assets');
const MANIFEST_PATH = path.resolve(__dirname, '../public/assets/assets-manifest.json');

const exts = [
  '.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg',
  '.mp4', '.webm', '.mov', '.ogg', '.mp3', '.wav'
];

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function absoluteUrl(url) {
  if (!url) return null;
  if (url.startsWith('//')) return `https:${url}`;
  if (url.startsWith('http')) return url;
  if (url.startsWith('/')) return new URL(url, BASE_URL).toString();
  return new URL(url, BASE_URL).toString();
}

function isAsset(url) {
  try {
    const u = new URL(url);
    const ext = path.extname(u.pathname).toLowerCase();
    return exts.includes(ext);
  } catch {
    return false;
  }
}

async function fetchText(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.status}`);
  return await res.text();
}

async function fetchBuffer(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.status}`);
  return Buffer.from(await res.arrayBuffer());
}

function extractUrls(html) {
  const urls = new Set();
  const attrRegex = /(src|href|poster)=\"([^\"]+)\"/g; // src/href/poster
  const cssUrlRegex = /url\(([^)]+)\)/g; // background images

  for (const match of html.matchAll(attrRegex)) {
    const raw = match[2].trim().replace(/["']/g, '');
    const abs = absoluteUrl(raw);
    if (abs && isAsset(abs)) urls.add(abs);
  }
  for (const match of html.matchAll(cssUrlRegex)) {
    const raw = match[1].trim().replace(/["']/g, '');
    const abs = absoluteUrl(raw);
    if (abs && isAsset(abs)) urls.add(abs);
  }
  return Array.from(urls);
}

function filenameFromUrl(u) {
  const url = new URL(u);
  const base = path.basename(url.pathname);
  return base.split('?')[0] || `asset-${Date.now()}`;
}

async function saveAsset(u) {
  try {
    const buf = await fetchBuffer(u);
    const name = filenameFromUrl(u);
    const subdir = /\.(mp4|webm|mov|ogg|mp3|wav)$/i.test(name) ? 'videos' : 'images';
    const out = path.join(ASSETS_DIR, subdir, name);
    await fs.promises.writeFile(out, buf);
    const publicPath = `/assets/${subdir}/${name}`;
    return { ok: true, path: out, publicPath };
  } catch (e) {
    return { ok: false, error: e.message };
  }
}

async function main() {
  ensureDir(path.join(ASSETS_DIR, 'images'));
  ensureDir(path.join(ASSETS_DIR, 'videos'));
  const html = await fetchText(BASE_URL);
  const urls = extractUrls(html);
  console.log(`Found ${urls.length} assets`);
  const results = await Promise.all(urls.map(saveAsset));
  const ok = results.filter(r => r.ok).length;
  const fail = results.length - ok;
  console.log(`Saved ${ok}, failed ${fail}`);

  const manifest = {};
  results.forEach((res, i) => {
    const original = urls[i];
    if (res.ok) manifest[original] = res.publicPath;
  });
  await fs.promises.writeFile(MANIFEST_PATH, JSON.stringify(manifest, null, 2));
  console.log(`Manifest written to ${MANIFEST_PATH}`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
