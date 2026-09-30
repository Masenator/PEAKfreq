/**
 * Renders the brand film to film/out/peakfreq-brand-film.mp4 (1080p60, H.264 + AAC).
 *
 *   pip install numpy scipy imageio-ffmpeg     # once
 *   node film/render.mjs [--workers 3] [--preview]
 *
 * Serves film/ locally, renders every frame deterministically with window.render(t)
 * in headless Chromium, synthesises the soundtrack (synth.py), then encodes with ffmpeg.
 * --preview renders every 4th frame at 15fps for a quick look.
 */
import { spawn, spawnSync } from "node:child_process";
import { createServer } from "node:http";
import { mkdirSync, readFileSync, rmSync, writeFileSync, existsSync } from "node:fs";
import { dirname, extname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const HERE = dirname(fileURLToPath(import.meta.url));
const OUT = join(HERE, "out");
const FRAMES = join(OUT, "frames");
const args = process.argv.slice(2);
const WORKERS = Number(args[args.indexOf("--workers") + 1]) || 3;
const PREVIEW = args.includes("--preview");
const PY = process.env.PYTHON ?? "python3";

const TYPES = { ".html": "text/html", ".js": "text/javascript", ".json": "application/json", ".woff2": "font/woff2" };
const server = createServer((req, res) => {
  const file = join(HERE, decodeURIComponent(req.url.split("?")[0]).replace(/^\/$/, "/index.html"));
  if (!file.startsWith(HERE) || !existsSync(file)) return res.writeHead(404).end();
  res.writeHead(200, { "content-type": TYPES[extname(file)] ?? "application/octet-stream" }).end(readFileSync(file));
}).listen(0, "127.0.0.1");
await new Promise((r) => server.once("listening", r));
const URL = `http://127.0.0.1:${server.address().port}/index.html`;

rmSync(FRAMES, { recursive: true, force: true });
mkdirSync(FRAMES, { recursive: true });

const browser = await chromium.launch();
const probe = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
await probe.goto(URL, { waitUntil: "networkidle" });
await probe.waitForFunction(() => window.reelReady);
const { FPS, DUR, steps, beats } = await probe.evaluate(() => window.REEL);
await probe.close();
writeFileSync(join(OUT, "events.json"), JSON.stringify({ steps, beats }));

const STEP = PREVIEW ? 4 : 1;
const OUT_FPS = FPS / STEP;
const frames = [];
for (let f = 0, i = 0; f < FPS * DUR; f += STEP, i++) frames.push({ f, i });
const chunk = Math.ceil(frames.length / WORKERS);
const started = Date.now();
await Promise.all(
  Array.from({ length: WORKERS }, async (_, w) => {
    const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
    await page.goto(URL, { waitUntil: "networkidle" });
    await page.waitForFunction(() => window.reelReady);
    for (const { f, i } of frames.slice(w * chunk, (w + 1) * chunk)) {
      await page.evaluate((t) => window.render(t), f / FPS);
      await page.screenshot({ path: join(FRAMES, `f_${String(i).padStart(4, "0")}.png`), clip: { x: 0, y: 0, width: 1920, height: 1080 } });
    }
    await page.close();
  }),
);
await browser.close();
server.close();
console.log(`rendered ${frames.length} frames in ${((Date.now() - started) / 1000).toFixed(0)}s`);

const audio = join(OUT, "soundtrack.wav");
const synth = spawnSync(PY, [join(HERE, "synth.py"), join(OUT, "events.json"), audio], { stdio: "inherit" });
if (synth.status !== 0) throw new Error("synth.py failed");

const ffmpeg = spawnSync(PY, ["-c", "import imageio_ffmpeg;print(imageio_ffmpeg.get_ffmpeg_exe())"], { encoding: "utf8" }).stdout.trim() || "ffmpeg";
const mp4 = join(OUT, PREVIEW ? "peakfreq-brand-film-preview.mp4" : "peakfreq-brand-film.mp4");
await new Promise((resolve, reject) => {
  const p = spawn(ffmpeg, [
    "-y", "-hide_banner", "-loglevel", "error",
    "-framerate", String(OUT_FPS), "-i", join(FRAMES, "f_%04d.png"), "-i", audio,
    "-c:v", "libx264", "-preset", "slow", "-crf", "17", "-tune", "grain", "-pix_fmt", "yuv420p",
    "-profile:v", "high", "-level", "4.2", "-movflags", "+faststart",
    "-c:a", "aac", "-b:a", "256k", "-shortest", mp4,
  ], { stdio: "inherit" });
  p.on("exit", (code) => (code === 0 ? resolve() : reject(new Error(`ffmpeg exited ${code}`))));
});
console.log(`wrote ${mp4}`);
