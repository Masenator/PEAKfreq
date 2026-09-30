/* PEAKfreq — 15s brand film. Deterministic: render(t) draws any instant. */
(async () => {
  const A = await (await fetch("assets.json")).json();
  await Promise.all([
    document.fonts.load('800 120px "Archivo"'),
    document.fonts.load('700 120px "Archivo"'),
    document.fonts.load('500 24px "Inter"'),
    document.fonts.load('400 16px "JetBrains Mono"'),
    document.fonts.load('600 16px "JetBrains Mono"'),
  ]);
  await document.fonts.ready;

  /* ───────────── constants & math ───────────── */
  const W = 1920, H = 1080, FPS = 60, DUR = 15;
  const NS = "http://www.w3.org/2000/svg";
  const C0 = { x: 800, y: 520 };
  const BASE = 1.2;
  const APEX = A.summit.apex;
  const FADE = ["#5E9E6A", "#7E9A5A", "#A08C4A", "#C4834A", "#DB7A45"];
  const INK = "#0E0F0F", BONE = "#F3F1EC", FOREST = "#2F4538", ORANGE = "#DB7A45";

  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const seg = (t, a, b) => clamp((t - a) / (b - a));
  const Ez = {
    inOut: (t) => 0.5 - Math.cos(Math.PI * clamp(t)) / 2,
    outExpo: (t) => (t >= 1 ? 1 : 1 - Math.pow(2, -10 * clamp(t))),
    inExpo: (t) => (t <= 0 ? 0 : Math.pow(2, 10 * (clamp(t) - 1))),
    outCubic: (t) => 1 - (1 - clamp(t)) ** 3,
    inCubic: (t) => clamp(t) ** 3,
    inOutCubic: (t) => { t = clamp(t); return t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2; },
    outBack: (t, s = 1.70158) => { t = clamp(t) - 1; return t * t * ((s + 1) * t + s) + 1; },
    outQuint: (t) => 1 - (1 - clamp(t)) ** 5,
  };
  const gss = (u, c, w) => Math.exp(-(((u - c) / w) ** 2));
  const frac = (x) => x - Math.floor(x);
  function rng(seed) {
    return () => {
      seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
      let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  const hex2rgb = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
  const mix = (a, b, t) => { const x = hex2rgb(a), y = hex2rgb(b); return `rgb(${x.map((v, i) => Math.round(lerp(v, y[i], clamp(t)))).join(",")})`; };
  const fadeAt = (u) => { // u in [0,1] along the logo gradient
    const k = clamp(u) * (FADE.length - 1); const i = Math.min(FADE.length - 2, Math.floor(k));
    return mix(FADE[i], FADE[i + 1], k - i);
  };
  const f1 = (n) => (Math.round(n * 10) / 10).toString();

  /* ───────────── svg helpers ───────────── */
  const svg = document.getElementById("svg");
  function el(tag, attrs = {}, parent) {
    const e = document.createElementNS(NS, tag);
    for (const k in attrs) e.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(e);
    return e;
  }
  function set(e, attrs) { for (const k in attrs) e.setAttribute(k, attrs[k]); }
  function show(e, on) { e.style.display = on ? "" : "none"; }
  function txt(parent, str, o = {}) {
    const t = el("text", { x: o.x || 0, y: o.y || 0, fill: o.fill || BONE, "text-anchor": o.anchor || "start" }, parent);
    t.style.fontFamily = o.family || "Archivo";
    t.style.fontSize = `${o.size || 16}px`;
    t.style.fontWeight = o.weight || 700;
    if (o.stretch) t.style.fontStretch = `${o.stretch}%`;
    if (o.ls != null) t.style.letterSpacing = `${o.ls}em`;
    if (o.opacity != null) t.setAttribute("opacity", o.opacity);
    t.textContent = str;
    return t;
  }
  let clipN = 0;
  function clipGroup(parent, x, y, w, h) {
    const id = `clip${clipN++}`;
    const cp = el("clipPath", { id }, defs);
    el("rect", { x, y, width: w, height: h }, cp);
    return el("g", { "clip-path": `url(#${id})` }, parent);
  }
  /** Lay out words from one measured string so kerning and spacing match a single line. */
  function buildWords(parent, parts, o) {
    const full = parts.map((p) => p.text).join("");
    const meas = txt(parent, full, { ...o, x: 0, anchor: "start" });
    const total = meas.getComputedTextLength();
    const x0 = o.anchor === "middle" ? o.x - total / 2 : o.x;
    const items = [];
    let idx = 0;
    for (const p of parts) {
      const start = idx ? meas.getSubStringLength(0, idx) : 0;
      const w = meas.getSubStringLength(idx, p.text.length);
      const g = el("g", {}, parent);
      const t = txt(g, p.text, { ...o, x: x0 + start, anchor: "start", fill: p.fill || o.fill });
      items.push({ g, t, x: x0 + start, w });
      idx += p.text.length;
    }
    meas.remove();
    return { items, x0, total };
  }
  function linGrad(id, x1, x2, stops, y1 = 0, y2 = 0) {
    const g = el("linearGradient", { id, gradientUnits: "userSpaceOnUse", x1, x2, y1, y2 }, defs);
    stops.forEach(([o, c, a = 1]) => el("stop", { offset: o, "stop-color": c, "stop-opacity": a }, g));
    return g;
  }

  /* ───────────── defs ───────────── */
  const defs = el("defs", {}, svg);
  defs.insertAdjacentHTML("beforeend", A.summit.defs);
  defs.insertAdjacentHTML(
    "beforeend",
    `
    <radialGradient id="g-dark" cx="50%" cy="46%" r="78%"><stop offset="0" stop-color="#1C2C22"/><stop offset="0.55" stop-color="#101A14"/><stop offset="1" stop-color="#070C09"/></radialGradient>
    <linearGradient id="g-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#E3E7DE"/><stop offset="0.38" stop-color="#EDE6D6"/><stop offset="0.62" stop-color="#F3D9B8"/><stop offset="1" stop-color="#EFC9A0"/></linearGradient>
    <radialGradient id="g-sunglow" cx="0" cy="0" r="360" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#FCE6C4"/><stop offset="0.25" stop-color="#F7D2A4" stop-opacity="0.8"/><stop offset="1" stop-color="#F3D9B8" stop-opacity="0"/></radialGradient>
    <radialGradient id="g-ray" cx="0" cy="0" r="210" gradientUnits="userSpaceOnUse"><stop offset="0.3" stop-color="#F6C185" stop-opacity="0.9"/><stop offset="1" stop-color="#F6C185" stop-opacity="0"/></radialGradient>
    <radialGradient id="g-dawn"><stop offset="0.78" stop-color="#fff"/><stop offset="1" stop-color="#000"/></radialGradient>
    <radialGradient id="g-aura"><stop offset="0" stop-color="#F2A36B" stop-opacity="0.6"/><stop offset="1" stop-color="#F2A36B" stop-opacity="0"/></radialGradient>
    <radialGradient id="g-prodglow"><stop id="pg0" offset="0" stop-color="#5E9E6A" stop-opacity="0.42"/><stop id="pg1" offset="1" stop-color="#5E9E6A" stop-opacity="0"/></radialGradient>
    <radialGradient id="g-endglow"><stop offset="0" stop-color="#FAE1BD" stop-opacity="0.85"/><stop offset="1" stop-color="#FAE1BD" stop-opacity="0"/></radialGradient>
    <radialGradient id="g-vig" cx="50%" cy="50%" r="72%"><stop offset="0.55" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity="1"/></radialGradient>
    <filter id="f-glow" x="-10%" y="-60%" width="120%" height="220%"><feGaussianBlur stdDeviation="7"/></filter>
    <filter id="f-haze" x="-40%" y="-80%" width="180%" height="260%"><feGaussianBlur stdDeviation="60"/></filter>
    <filter id="f-glow-lg" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="16"/></filter>
    <filter id="f-dof-far" x="-5%" y="-5%" width="110%" height="110%"><feGaussianBlur id="dof-far" stdDeviation="0"/></filter>
    <filter id="f-dof-main" x="-5%" y="-5%" width="110%" height="110%"><feGaussianBlur id="dof-main" stdDeviation="0"/></filter>
    <filter id="f-dof-near" x="-5%" y="-5%" width="110%" height="110%"><feGaussianBlur id="dof-near" stdDeviation="0"/></filter>
  `,
  );
  const gTrace = linGrad("g-trace", 120, 1800, [[0, FADE[0]], [0.5, FADE[2]], [1, FADE[4]]]);

  /* ───────────── background ───────────── */
  const bgDark = el("rect", { width: W, height: H, fill: "url(#g-dark)" }, svg);
  const worldWrap = el("g", {}, svg);
  const sky = el("rect", { width: W, height: H, fill: "url(#g-sky)" }, worldWrap);

  /* ───────────── world (summit) ───────────── */
  const G = {};
  for (const k of ["sun", "far1", "far2", "main", "mist", "mid", "fg", "fig"]) G[k] = el("g", {}, worldWrap);
  // Dawn reveal: a soft circle of light that bursts out from behind the peak.
  const dawnMask = el("mask", { id: "dawn", maskUnits: "userSpaceOnUse", x: 0, y: 0, width: W, height: H }, defs);
  const dawnCircle = el("circle", { cx: 1380, cy: 690, r: 0, fill: "url(#g-dawn)" }, dawnMask);
  const dawnRing = el("circle", { cx: 1380, cy: 690, r: 0, fill: "none", stroke: "#FFF1DC", "stroke-width": 46, opacity: 0, filter: "url(#f-glow-lg)" }, svg);
  const tmpLand = el("g", {}); tmpLand.innerHTML = A.summit.land;
  const land = [...tmpLand.children];
  const tmpFront = el("g", {}); tmpFront.innerHTML = A.summit.front;
  const front = [...tmpFront.children];
  G.far1.appendChild(land[0]);
  G.far2.appendChild(land[1]);
  for (const k of land.slice(2)) G.main.appendChild(k);
  G.mist.appendChild(front[0]);
  G.mid.appendChild(front[1]);
  G.fg.appendChild(front[2]);
  G.fg.appendChild(front[3]);

  // Ridge top-edge profiles (world coords) for the wave→mountain morph.
  function polyOf(d) {
    return d.split(/[MLZ]/).map((s) => s.trim()).filter(Boolean).map((p) => p.split(/[ ,]+/).map(Number));
  }
  const RIDGES = [
    [polyOf(land[0].getAttribute("d"))],
    [polyOf(land[1].getAttribute("d"))],
    [polyOf(land[2].getAttribute("d")), polyOf(land[3].getAttribute("d"))],
    [polyOf(front[1].getAttribute("d"))],
    [polyOf(front[3].getAttribute("d"))],
  ];
  function topY(polys, x) {
    let best = 1000;
    for (const poly of polys) {
      for (let i = 0; i < poly.length; i++) {
        const [x1, y1] = poly[i];
        const [x2, y2] = poly[(i + 1) % poly.length];
        if (x1 === x2) continue;
        if ((x - x1) * (x - x2) <= 0) {
          const y = y1 + ((x - x1) / (x2 - x1)) * (y2 - y1);
          if (y < best) best = y;
        }
      }
    }
    return best;
  }

  // Sun (drawn behind all land).
  const sunGlow = el("circle", { r: 360, fill: "url(#g-sunglow)" }, G.sun);
  const raysG = el("g", { fill: "url(#g-ray)", opacity: 0 }, G.sun);
  const SUN_R = 74;
  for (let i = 0; i < 24; i++) {
    const a = (i / 24) * Math.PI * 2;
    const r1 = SUN_R + 10, r2 = i % 2 ? SUN_R + 78 : SUN_R + 132, w = i % 2 ? 0.045 : 0.065;
    const p = (ang, r) => `${(Math.cos(ang) * r).toFixed(1)},${(Math.sin(ang) * r).toFixed(1)}`;
    el("path", { d: `M${p(a - w, r1)}L${p(a, r2)}L${p(a + w, r1)}Z` }, raysG);
  }
  const sunDisc = el("circle", { r: SUN_R, fill: "#FAE1BD" }, G.sun);
  const freqRings = el("g", { fill: "none" }, G.sun);
  const fRing = FADE.map((c) => el("circle", { r: 90, stroke: c, "stroke-width": 1.4, opacity: 0 }, freqRings));

  // Orange track along the trail.
  const trackGlow = el("path", { d: A.summit.trail, fill: "none", stroke: ORANGE, "stroke-opacity": 0.3, "stroke-width": 12, "stroke-linecap": "round", "stroke-linejoin": "round" }, G.main);
  const track = el("path", { d: A.summit.trail, fill: "none", stroke: ORANGE, "stroke-width": 4.2, "stroke-linecap": "round", "stroke-linejoin": "round" }, G.main);
  const L = track.getTotalLength();
  const TRAIL_PTS = [];
  for (let s = 0; s <= L + 0.5; s += 0.5) { const p = track.getPointAtLength(Math.min(s, L)); TRAIL_PTS.push([p.x, p.y]); }
  const trailAt = (s) => { const i = clamp(s, 0, L) / 0.5; const a = Math.floor(i), b = Math.min(TRAIL_PTS.length - 1, a + 1), f = i - a; return { x: lerp(TRAIL_PTS[a][0], TRAIL_PTS[b][0], f), y: lerp(TRAIL_PTS[a][1], TRAIL_PTS[b][1], f) }; };

  // Athlete.
  const aura = el("circle", { r: 70, fill: "url(#g-aura)", opacity: 0 }, G.fig);
  const fig = el("g", { fill: "none", stroke: "rgb(35,44,38)", "stroke-linecap": "round", "stroke-linejoin": "round", opacity: 0 }, G.fig);
  const legs = el("path", { "stroke-width": 6.4 }, fig);
  const torso = el("path", { "stroke-width": 11.5 }, fig);
  const arms = el("path", { "stroke-width": 5 }, fig);
  const head = el("circle", { r: 7.3, stroke: "none", fill: "rgb(35,44,38)" }, fig);

  /* ───────────── morph lines (waves → ridges) ───────────── */
  const linesG = el("g", { fill: "none", "stroke-linecap": "round", "stroke-linejoin": "round" }, svg);
  const LINES = FADE.map((c) => ({
    glow: el("path", { stroke: c, "stroke-width": 11, opacity: 0.45, filter: "url(#f-glow)" }, linesG),
    core: el("path", { stroke: c, "stroke-width": 4 }, linesG),
  }));

  /* ───────────── intro: signal + frequencies ───────────── */
  const intro = el("g", {}, svg);
  // ECG paper grid
  let gridD = "";
  for (let x = 0; x <= W; x += 40) gridD += `M${x} 0V${H}`;
  for (let y = 0; y <= H; y += 40) gridD += `M0 ${y}H${W}`;
  const grid = el("path", { d: gridD, stroke: BONE, "stroke-width": 1, opacity: 0 }, intro);
  let gridMajor = "";
  for (let x = 0; x <= W; x += 200) gridMajor += `M${x} 0V${H}`;
  for (let y = 40; y <= H; y += 200) gridMajor += `M0 ${y}H${W}`;
  const grid2 = el("path", { d: gridMajor, stroke: BONE, "stroke-width": 1, opacity: 0 }, intro);

  // S2 product stage (behind wave)
  const s2 = el("g", {}, intro);
  const PX = 1560, PY = 438;
  const prodGlow = el("circle", { cx: PX, cy: PY, r: 420, fill: "url(#g-prodglow)" }, s2);
  const ringA = el("circle", { cx: PX, cy: PY, r: 255, fill: "none", stroke: BONE, "stroke-width": 1.2, opacity: 0.18 }, s2);
  const ringB = el("circle", { cx: PX, cy: PY, r: 300, fill: "none", stroke: BONE, "stroke-width": 1.6, "stroke-dasharray": "2 12", opacity: 0.3 }, s2);

  // Wave (one line that plays every rhythm)
  const waveGlow = el("path", { fill: "none", stroke: "url(#g-trace)", "stroke-width": 12, opacity: 0.55, filter: "url(#f-glow)", "stroke-linecap": "round" }, intro);
  const wave = el("path", { fill: "none", stroke: "url(#g-trace)", "stroke-width": 4.2, "stroke-linecap": "round", "stroke-linejoin": "round" }, intro);
  const headGlow = el("circle", { r: 34, fill: "url(#g-aura)", opacity: 0 }, intro);
  const headDot = el("circle", { r: 6.5, fill: "#FFF6EA", opacity: 0 }, intro);
  const bpmLabel = txt(intro, "120 BPM", { x: 1330, y: 350, size: 15, family: "JetBrains Mono", weight: 500, ls: 0.18, fill: BONE, opacity: 0 });

  // S1 line
  const s1Clip = clipGroup(intro, 0, 780 - 80, W, 110);
  const s1 = buildWords(s1Clip, [
    { text: "Your " }, { text: "body " }, { text: "runs " }, { text: "on " }, { text: "rhythm.", fill: "url(#g-rhythm)" },
  ], { x: 960, y: 780, size: 68, weight: 700, stretch: 88, ls: -0.022, anchor: "middle", fill: BONE });
  { const last = s1.items[4]; linGrad("g-rhythm", last.x, last.x + last.w, [[0, FADE[0]], [0.5, FADE[2]], [1, FADE[4]]]); }

  // S2 per-frequency content
  const FREQ = [
    { word: "CADENCE", hz: "1.4–3 HZ", body: "Stride, stroke and pedal rate", slug: "carb-90-endurance-fuel", grade: "A", pname: "CARB 90", pdesc: "Dual-source endurance fuel" },
    { word: "CELLULAR", hz: "24–72 H", body: "Muscle and tendon repair", slug: "rebuild-collagen-vitamin-c", grade: "B", pname: "REBUILD", pdesc: "Collagen + vitamin C" },
    { word: "CIRCADIAN", hz: "1 / 24 H", body: "Your sleep–wake clock", slug: "descend-magnesium-glycine", grade: "B", pname: "DESCEND", pdesc: "Magnesium + glycine" },
    { word: "NEURAL", hz: "13–30 HZ", body: "Beta-band focus", slug: "signal-caffeine-l-theanine", grade: "B", pname: "SIGNAL", pdesc: "Caffeine + L-theanine" },
    { word: "CARDIAC", hz: "0.8–3 HZ", body: "Heart rate and HRV", slug: "foundation-algal-omega-3", grade: "A", pname: "FOUNDATION", pdesc: "Algal omega-3" },
  ];
  const BEATS = [2.1, 2.8, 3.5, 4.2, 4.9, 5.58];
  const WORD_Y = 548;
  const S2 = FREQ.map((f, i) => {
    const root = el("g", {}, s2);
    // product
    const prod = el("g", {}, root);
    prod.insertAdjacentHTML("beforeend", A.products[f.slug].svg);
    const psvg = prod.lastElementChild;
    set(psvg, { width: 400, height: 500, x: -200, y: -250 });
    for (const tx of psvg.querySelectorAll("text")) {
      const len = tx.getComputedTextLength();
      if (len > 200) { const fs = parseFloat(getComputedStyle(tx).fontSize); tx.style.fontSize = `${(fs * 196) / len}px`; }
    }
    const badge = el("g", {}, root);
    el("circle", { r: 38, fill: f.grade === "A" ? ORANGE : BONE }, badge);
    el("circle", { r: 47, fill: "none", stroke: f.grade === "A" ? ORANGE : BONE, "stroke-width": 1.4, opacity: 0.55 }, badge);
    txt(badge, f.grade, { x: 0, y: 13, size: 38, weight: 800, stretch: 80, anchor: "middle", fill: INK });
    // word (letters)
    const wordClip = clipGroup(root, 60, WORD_Y - 190, 1300, 222);
    const meas = txt(wordClip, f.word, { x: 150, y: WORD_Y, size: 214, weight: 800, stretch: 72, ls: -0.01 });
    const letters = [...f.word].map((ch, j) => {
      const x = 150 + (j ? meas.getSubStringLength(0, j) : 0);
      const g = el("g", {}, wordClip);
      txt(g, ch, { x, y: WORD_Y, size: 214, weight: 800, stretch: 72, fill: BONE });
      return g;
    });
    meas.remove();
    const meta = el("g", {}, root);
    txt(meta, `0${i + 1} / 05`, { x: 152, y: 330, size: 16, family: "JetBrains Mono", weight: 500, ls: 0.2, fill: BONE, opacity: 0.55 });
    txt(meta, f.hz, { x: 262, y: 330, size: 16, family: "JetBrains Mono", weight: 600, ls: 0.2, fill: FADE[i] });
    const body = el("g", {}, root);
    txt(body, f.body, { x: 152, y: 905, size: 30, family: "Inter", weight: 500, fill: BONE, opacity: 0.85 });
    return { root, prod, badge, letters, meta, body };
  });
  const pager = el("g", {}, s2);
  const PAGES = FADE.map((c, j) => el("rect", { x: 152 + j * 58, y: 972, width: 46, height: 3, rx: 1.5, fill: BONE, opacity: 0.22 }, pager));

  /* ───────────── S3 copy ───────────── */
  const s3 = el("g", {}, svg);
  const S3Y = 318;
  const haze = el("ellipse", { cx: 560, cy: S3Y - 44, rx: 560, ry: 150, fill: "#F6F0E4", opacity: 0, filter: "url(#f-haze)" }, s3);
  const s3aClip = clipGroup(s3, 0, S3Y - 130, W, 170);
  const s3a = buildWords(s3aClip, [{ text: "Every " }, { text: "rhythm.", fill: "url(#g-s3a)" }], { x: 150, y: S3Y, size: 132, weight: 700, stretch: 88, ls: -0.028, fill: INK });
  linGrad("g-s3a", s3a.items[1].x, s3a.items[1].x + s3a.items[1].w, [[0, FADE[0]], [0.5, FADE[2]], [1, FADE[4]]]);
  const s3bClip = clipGroup(s3, 0, S3Y - 130, W, 170);
  const s3b = buildWords(s3bClip, [{ text: "One " }, { text: "place.", fill: "url(#g-s3b)" }], { x: 150, y: S3Y, size: 132, weight: 700, stretch: 88, ls: -0.028, fill: INK });
  linGrad("g-s3b", s3b.items[1].x, s3b.items[1].x + s3b.items[1].w, [[0, FADE[0]], [0.5, FADE[2]], [1, FADE[4]]]);

  /* ───────────── shockwave (screen space) ───────────── */
  const shock = el("g", { fill: "none" }, svg);
  const SHOCK = [FADE[0], FADE[2], FADE[4], "#FAE1BD"].map((c) => el("circle", { r: 0, stroke: c, "stroke-width": 8, opacity: 0 }, shock));

  /* ───────────── end card ───────────── */
  const end = el("g", {}, svg);
  el("rect", { width: W, height: H, fill: BONE }, end);
  const endGlow = el("ellipse", { cx: 960, cy: 470, rx: 900, ry: 520, fill: "url(#g-endglow)" }, end);
  const topo = el("g", { fill: "none", stroke: FOREST }, end);
  const TOPO = [];
  for (let i = 0; i < 22; i++) {
    const r = 60 + i * 46, pts = [];
    for (let a = 0; a <= 360; a += 4) {
      const t = (a * Math.PI) / 180;
      const rr = r * (1 + 0.1 * Math.sin(t * 3 + 1.3 + i * 0.25) + 0.05 * Math.sin(t * 5 + 2.1));
      pts.push(`${f1(Math.cos(t) * rr * 1.35)},${f1(Math.sin(t) * rr)}`);
    }
    TOPO.push(el("path", { d: `M${pts.join("L")}Z`, "stroke-width": i % 4 === 0 ? 1.4 : 1, opacity: i % 4 === 0 ? 0.1 : 0.055 }, topo));
  }
  // Lockup: mark + wordmark
  const MARK_H = 126, MARK_S = MARK_H / 76, MARK_W = 126 * MARK_S;
  const WM_H = 144, WM_S = WM_H / 122, WM_W = 496 * WM_S;
  const GAP = 30, LOCK_W = MARK_W + GAP + WM_W, LOCK_X = 960 - LOCK_W / 2, LOCK_CY = 438;
  linGrad("g-mark", -3, 123, [[0, "#5E9E6A"], [0.35, "#6E9A62"], [0.5, "#A08C4A"], [0.62, "#DB7A45"], [1, "#DB7A45"]]);
  const markG = el("g", { transform: `translate(${LOCK_X} ${LOCK_CY - MARK_H / 2}) scale(${MARK_S}) translate(3 3)` }, end);
  const markMtn = el("path", { d: A.mark.mountain, fill: "none", stroke: "url(#g-mark)", "stroke-width": 7, "stroke-linecap": "round", "stroke-linejoin": "round" }, markG);
  const markWave = el("path", { d: A.mark.wave, fill: "none", stroke: "url(#g-mark)", "stroke-width": 7, "stroke-linecap": "round", "stroke-linejoin": "round" }, markG);
  const markMtnL = markMtn.getTotalLength(), markWaveL = markWave.getTotalLength();
  const [vbx, vby] = A.wordmark.viewBox.split(" ").map(Number);
  const wmG = el("g", { transform: `translate(${LOCK_X + MARK_W + GAP} ${LOCK_CY - WM_H / 2}) scale(${WM_S}) translate(${-vbx} ${-vby})` }, end);
  linGrad("g-wm", A.wordmark.gradX[0], A.wordmark.gradX[1], [[0, "#5E9E6A"], [0.45, "#A08C4A"], [1, "#DB7A45"]]);
  // PEAK split into letters, drawn in three passes (green outer, white, black fill).
  const peakSub = A.wordmark.peak.match(/M[^M]*/g);
  const letterOf = (d) => { const xs = d.match(/-?\d+(\.\d+)?/g).map(Number).filter((_, i) => i % 2 === 0); const cx = (Math.min(...xs) + Math.max(...xs)) / 2; return cx < 58 ? 0 : cx < 110 ? 1 : cx < 175 ? 2 : 3; };
  const peakLetters = [[], [], [], []];
  for (const d of peakSub) peakLetters[letterOf(d)].push(d);
  const PEAK_BOX = [[5, 55], [62, 109], [112, 173], [178, 235]];
  const passes = [
    { stroke: "#5E9E6A", width: 14, fill: "none" },
    { stroke: "#FFFFFF", width: 8, fill: "none" },
    { stroke: "none", width: 0, fill: INK },
  ];
  const peakG = el("g", {}, wmG);
  const PEAK_L = peakLetters.map(() => []);
  for (const pass of passes) {
    const layer = el("g", {}, peakG);
    peakLetters.forEach((ds, li) => {
      const g = el("g", {}, layer);
      el("path", { d: ds.join(""), fill: pass.fill, stroke: pass.stroke, "stroke-width": pass.width, "stroke-linejoin": "round" }, g);
      PEAK_L[li].push(g);
    });
  }
  const freqClipId = "freq-clip";
  const freqCP = el("clipPath", { id: freqClipId }, defs);
  const freqClipPoly = el("polygon", { points: "" }, freqCP);
  const freqG = el("g", { "clip-path": `url(#${freqClipId})` }, wmG);
  el("path", { d: A.wordmark.freq, fill: "url(#g-wm)" }, freqG);
  const pulse = el("path", { d: A.wordmark.pulse, fill: "none", stroke: "url(#g-wm)", "stroke-width": 4.2, "stroke-linecap": "round", "stroke-linejoin": "round" }, wmG);
  const pulseL = pulse.getTotalLength();
  const spark = el("circle", { r: 5, fill: "#FFF3E2", opacity: 0 }, wmG);
  const sparkGlow = el("circle", { r: 16, fill: "url(#g-aura)", opacity: 0 }, wmG);
  const blipRing = el("circle", { r: 0, fill: "none", stroke: ORANGE, "stroke-width": 2, opacity: 0 }, wmG);
  // Tagline
  const TAG_Y = 628;
  const tagClip = clipGroup(end, 0, TAG_Y - 70, W, 94);
  const tag = buildWords(tagClip, [
    { text: "Reach " }, { text: "your " }, { text: "peak ", fill: "url(#g-tag)" }, { text: "frequency.", fill: "url(#g-tag)" },
  ], { x: 960, y: TAG_Y, size: 64, weight: 700, stretch: 88, ls: -0.024, anchor: "middle", fill: INK });
  linGrad("g-tag", tag.items[2].x, tag.items[3].x + tag.items[3].w, [[0, FADE[0]], [0.5, FADE[2]], [1, FADE[4]]]);
  const SUB_Y = 690;
  const subClip = clipGroup(end, 0, SUB_Y - 40, W, 56);
  const sub = buildWords(subClip, [{ text: "Realise your full potential." }], { x: 960, y: SUB_Y, size: 32, family: "Inter", weight: 600, ls: -0.01, anchor: "middle", fill: "#3A403A" });
  const urlG = el("g", {}, end);
  const url = txt(urlG, "WWW.PEAKFREQ.CO.UK", { x: 960, y: 846, size: 18, family: "JetBrains Mono", weight: 600, ls: 0.34, anchor: "middle", fill: FOREST });
  const urlW = url.getComputedTextLength();
  const urlL1 = el("line", { x1: 960 - urlW / 2 - 90, x2: 960 - urlW / 2 - 26, y1: 840, y2: 840, stroke: FOREST, "stroke-width": 1.4, opacity: 0.5 }, urlG);
  const urlL2 = el("line", { x1: 960 + urlW / 2 + 26, x2: 960 + urlW / 2 + 90, y1: 840, y2: 840, stroke: FOREST, "stroke-width": 1.4, opacity: 0.5 }, urlG);
  const endVig = el("rect", { width: W, height: H, fill: "url(#g-vig)", opacity: 0.08 }, end);

  /* ───────────── HUD ───────────── */
  const hud = el("g", {}, svg);
  const panel = el("g", { transform: "translate(92 812)" }, hud);
  el("rect", { width: 404, height: 184, rx: 16, fill: FOREST, "fill-opacity": 0.86, stroke: BONE, "stroke-opacity": 0.18 }, panel);
  const HROWS = ["ALT", "HR", "CADENCE", "STATUS"].map((lab, i) => {
    const y = 44 + i * 38;
    txt(panel, lab, { x: 24, y, size: 13, family: "JetBrains Mono", weight: 500, ls: 0.18, fill: BONE, opacity: 0.55 });
    return txt(panel, "", { x: 140, y, size: 21, family: "JetBrains Mono", weight: 600, ls: 0.02, fill: BONE });
  });
  linGrad("g-status", 140, 340, [[0, FADE[0]], [0.5, FADE[2]], [1, FADE[4]]]);
  const miniEcg = el("path", { fill: "none", stroke: "#F4B27E", "stroke-width": 2, "stroke-linejoin": "round" }, panel);
  const gauge = el("g", {}, hud);
  el("line", { x1: 1836, x2: 1836, y1: 300, y2: 780, stroke: FOREST, "stroke-width": 1.4, opacity: 0.55 }, gauge);
  for (let i = 0; i <= 8; i++) el("line", { x1: 1826, x2: 1836, y1: 300 + i * 60, y2: 300 + i * 60, stroke: FOREST, "stroke-width": 1.2, opacity: 0.5 }, gauge);
  const gTop = txt(gauge, "SUMMIT", { x: 1846, y: 282, size: 12, family: "JetBrains Mono", weight: 600, ls: 0.2, anchor: "end", fill: FOREST, opacity: 0.85 });
  const gMark = el("path", { d: "M-14,0 L-2,-7 L-2,7 Z", fill: ORANGE }, gauge);
  const gFill = el("line", { x1: 1836, x2: 1836, y1: 780, y2: 780, stroke: ORANGE, "stroke-width": 3, "stroke-linecap": "round" }, gauge);

  /* ───────────── chrome (reel frame) ───────────── */
  const chrome = el("g", { fill: "none" }, svg);
  const corners = el("path", { d: "M48 84V48H84 M1836 48H1872V84 M1872 996V1032H1836 M84 1032H48V996", "stroke-width": 1.6 }, chrome);
  const cTL = txt(chrome, "PEAKFREQ — BRAND FILM", { x: 104, y: 70, size: 13, family: "JetBrains Mono", weight: 600, ls: 0.24 });
  const cTR = txt(chrome, "", { x: 1816, y: 70, size: 13, family: "JetBrains Mono", weight: 600, ls: 0.24, anchor: "end" });
  const cBR = txt(chrome, "", { x: 1816, y: 1022, size: 13, family: "JetBrains Mono", weight: 500, ls: 0.2, anchor: "end" });

  /* ───────────── canvases ───────────── */
  const fx = document.getElementById("fx").getContext("2d");
  const grainCv = document.getElementById("grain");
  const grain = grainCv.getContext("2d");
  const NOISE = [];
  { const r = rng(7);
    for (let n = 0; n < 6; n++) {
      const c = document.createElement("canvas"); c.width = 960; c.height = 540;
      const cx = c.getContext("2d"); const img = cx.createImageData(960, 540);
      for (let i = 0; i < img.data.length; i += 4) { const v = 128 + (r() - 0.5) * 150; img.data[i] = img.data[i + 1] = img.data[i + 2] = v; img.data[i + 3] = 255; }
      cx.putImageData(img, 0, 0); NOISE.push(c);
    } }

  /* ───────────── waves ───────────── */
  function ecgShape(u) {
    return -0.12 * gss(u, 0.14, 0.035) + 0.16 * gss(u, 0.285, 0.012) - 1.0 * gss(u, 0.31, 0.011) + 0.34 * gss(u, 0.334, 0.013) - 0.24 * gss(u, 0.56, 0.055);
  }
  const ecgAt = (x, xR, w) => { const u = (x - (xR - 0.31 * w)) / w; return u >= 0 && u <= 1 ? ecgShape(u) : 0; };
  const WAVES = [
    (x) => { const u = frac(x / 150); return -1.0 * gss(u, 0.3, 0.03) + 0.38 * gss(u, 0.36, 0.028) - 0.18 * gss(u, 0.68, 0.08); },
    (x) => Math.sin((2 * Math.PI * x) / 520),
    (x) => -Math.cos((2 * Math.PI * x) / 1700),
    (x) => Math.sin((2 * Math.PI * x) / 42) * (0.55 + 0.45 * Math.sin((2 * Math.PI * x) / 380)),
    (x) => ecgShape(frac(x / 300)),
  ];
  const AMPS = [80, 74, 98, 40, 120];
  const SPEEDS = [300, 170, 60, 420, 300];
  const waveVal = (k, x, t) => AMPS[k] * WAVES[k](x + SPEEDS[k] * t);
  const S1_BEATS = [{ x: 620, w: 240, a: 72 }, { x: 1300, w: 260, a: 178 }];
  const s1Y = (x) => 540 + S1_BEATS.reduce((s, b) => s + b.a * ecgAt(x, b.x, b.w), 0);
  const S1_T0 = 0.1, S1_T1 = 1.3, S1_X0 = 120, S1_X1 = 1800;
  const s1Head = (t) => lerp(S1_X0, S1_X1, seg(t, S1_T0, S1_T1));
  const WAVE_Y = 748;
  function s2Val(x, t) { // blended rhythm for the current beat
    let i = 0; for (let k = 1; k < 5; k++) if (t >= BEATS[k] - 0.07) i = k;
    const m = i === 0 ? 1 : Ez.inOutCubic(seg(t, BEATS[i] - 0.07, BEATS[i] + 0.16));
    const prev = i === 0 ? 0 : waveVal(i - 1, x, t);
    return { v: lerp(prev, waveVal(i, x, t), m), i, m };
  }

  /* ───────────── athlete rig (world units) ───────────── */
  const K = 1.18, TORSO = 25 * K, THIGH = 15 * K, SHIN = 15 * K, UA = 12.5 * K, FA = 11 * K, NECK = 9.4 * K, LEG_REACH = 27.5 * K;
  const STRIDE = 104, HOVER = 86;
  const DARK = [35, 44, 38], ORNG = [219, 122, 69];
  function blendPose(a, b, t) {
    const pr = (x, y) => [lerp(x[0], y[0], t), lerp(x[1], y[1], t)];
    return { lean: lerp(a.lean, b.lean, t), thigh: pr(a.thigh, b.thigh), shin: pr(a.shin, b.shin), upper: pr(a.upper, b.upper), fore: pr(a.fore, b.fore) };
  }
  function runPose(phi, face) {
    const leg = (p) => { const th = 0.14 + 0.56 * Math.sin(p); const bend = 0.3 + 0.95 * (0.5 + 0.5 * Math.cos(p + 0.25)); return [th, th - bend]; };
    const arm = (p) => { const u = -0.5 * Math.sin(p) + 0.12; return [u, u + 1.4]; };
    const [t1, s1] = leg(phi), [t2, s2] = leg(phi + Math.PI), [u1, f1] = arm(phi), [u2, f2] = arm(phi + Math.PI);
    return { lean: 0.26 * face, thigh: [t1 * face, t2 * face], shin: [s1 * face, s2 * face], upper: [u1 * face, u2 * face], fore: [f1 * face, f2 * face] };
  }
  const leapPose = (face) => ({ lean: 0.08 * face, thigh: [1.15 * face, -0.75 * face], shin: [0.55 * face, -1.75 * face], upper: [2.7, -2.7], fore: [2.85, -2.85] });
  const LOTUS = { lean: 0, thigh: [-1.42, 1.42], shin: [1.5, -1.5], upper: [-0.42, 0.42], fore: [-0.9, 0.9] };
  const vec = (a, l) => [Math.sin(a) * l, Math.cos(a) * l];
  function skeleton(hx, hy, pose) {
    const sx = hx + Math.sin(pose.lean) * TORSO, sy = hy - Math.cos(pose.lean) * TORSO;
    const legs = [], arms = [];
    for (const i of [0, 1]) {
      const [kx, ky] = vec(pose.thigh[i], THIGH), [fx2, fy2] = vec(pose.shin[i], SHIN);
      legs.push(`M${f1(hx)} ${f1(hy)}L${f1(hx + kx)} ${f1(hy + ky)}L${f1(hx + kx + fx2)} ${f1(hy + ky + fy2)}`);
      const [ex, ey] = vec(pose.upper[i], UA), [wx, wy] = vec(pose.fore[i], FA);
      arms.push(`M${f1(sx)} ${f1(sy)}L${f1(sx + ex)} ${f1(sy + ey)}L${f1(sx + ex + wx)} ${f1(sy + ey + wy)}`);
    }
    return { legs: legs.join(""), arms: arms.join(""), torso: `M${f1(hx)} ${f1(hy)}L${f1(sx)} ${f1(sy)}`, head: [sx + Math.sin(pose.lean) * NECK, sy - Math.cos(pose.lean) * NECK] };
  }

  // Run timeline
  const T_RUN0 = 6.3, T_RUN1 = 9.55, sA = L - 560;
  function runS(t) {
    const u = seg(t, T_RUN0, T_RUN1), a = 0.14, v = 1 / (1 - a / 2);
    let d; if (u < 1 - a) d = v * u; else { const x = u - (1 - a); d = v * (1 - a) + v * x - (v * x * x) / (2 * a); }
    return sA + (L - sA) * d;
  }
  function faceAt(s) {
    const a = trailAt(Math.max(0, s - 9)), b = trailAt(Math.min(L, s + 9)), dx = b.x - a.x;
    const f = clamp(dx / 12, -1, 1); return Math.abs(f) < 0.2 ? Math.sign(dx || 1) * 0.2 : f;
  }
  const T_JUMP0 = 9.58, T_JUMP1 = 10.5, T_LOT0 = 10.42, T_LOT1 = 11.1;
  function athlete(t) {
    const jumpT = seg(t, T_JUMP0, T_JUMP1), lotusT = seg(t, T_LOT0, T_LOT1), idle = Math.max(0, t - T_LOT1);
    if (t < T_JUMP0) {
      const s = runS(t), p = trailAt(s), face = faceAt(s), phi = (s / STRIDE) * Math.PI * 2;
      const moving = t < T_RUN1 - 0.02;
      const bob = moving ? -1.8 * (0.5 - 0.5 * Math.cos(2 * phi)) : 0;
      const stand = seg(t, T_RUN1 - 0.1, T_RUN1 + 0.03);
      const pose = blendPose(runPose(phi, face), runPose(Math.PI / 2, face), stand * 0.6);
      return { hx: p.x, hy: p.y - LEG_REACH + bob, pose, face, lotusT: 0, idle: 0, s, foot: p };
    }
    const face = faceAt(L - 1);
    const crouch = jumpT < 0.18 ? Math.sin((jumpT / 0.18) * Math.PI) * 5 : 0;
    const rise = Ez.outCubic((jumpT - 0.12) / 0.88) * (HOVER - LEG_REACH + 22) - Ez.inOut(lotusT) * 22;
    const hover = idle > 0 ? Math.sin((idle * 2 * Math.PI) / 3.4) * 4 : 0;
    const hx = APEX.x, hy = APEX.y - LEG_REACH + crouch - rise + hover;
    const pose = lotusT > 0 ? blendPose(leapPose(face), LOTUS, Ez.inOut(lotusT)) : blendPose(runPose(Math.PI / 2, face), leapPose(face), Ez.outCubic(jumpT / 0.6));
    return { hx, hy, pose, face, lotusT, idle, s: L, foot: trailAt(L) };
  }

  // Foot-strike sparks (deterministic).
  const SPARKS = [];
  { const r = rng(42); let lastStep = null;
    for (let t = T_RUN0; t <= T_RUN1; t += 1 / 480) {
      const s = runS(t), step = Math.floor((s / STRIDE) * 2);
      if (lastStep !== null && step !== lastStep) {
        const p = trailAt(s), face = faceAt(s);
        for (let k = 0; k < 7; k++) SPARKS.push({ t0: t, x: p.x + (r() - 0.5) * 6, y: p.y, vx: -face * (30 + r() * 110) + (r() - 0.5) * 40, vy: -(40 + r() * 110), life: 0.35 + r() * 0.45, size: 1.1 + r() * 2.2, c: ["#F2A36B", "#DB7A45", "#FFD9B0"][Math.floor(r() * 3)] });
      }
      lastStep = step;
    } }

  /* ───────────── camera ───────────── */
  function figCenter(t) { const a = athlete(t); return { x: a.hx, y: a.hy - 12 }; }
  const SUN_Y0 = APEX.y + 320, SUN_Y1 = APEX.y - HOVER - 14;
  function camAt(t) {
    let cx = C0.x, cy = C0.y, z = 1;
    if (t >= 6.2) {
      const w = Ez.inOutCubic(seg(t, 6.25, 7.2));
      const lag = athlete(Math.max(T_RUN0, Math.min(t, T_JUMP0) - 0.14));
      const fx2 = lag.hx + 40 * lag.face, fy2 = lag.hy - 36;
      cx = lerp(C0.x, fx2, w); cy = lerp(C0.y, fy2, w); z = lerp(1, 1.85, w);
    }
    if (t >= 8.85) { const w = Ez.inOut(seg(t, 8.85, 9.75)); cx = lerp(cx, APEX.x - 30, w); cy = lerp(cy, APEX.y - 64, w); z = lerp(z, 1.5, w); }
    if (t >= 9.6) { const w = Ez.inOutCubic(seg(t, 9.6, 10.65)); const f = figCenter(t); cx = lerp(cx, f.x, w); cy = lerp(cy, f.y + 6, w); z = lerp(z, 2.6, w); }
    if (t >= 10.65) { const w = Ez.inOut(seg(t, 10.7, 11.55)); z = lerp(z, 2.05, w); }
    let push = 0;
    if (t >= 11.55) { push = Ez.inExpo(seg(t, 11.55, 12.05)); cx = lerp(cx, APEX.x, push); cy = lerp(cy, SUN_Y1, push); z *= Math.pow(7, push); }
    let shx = 0, shy = 0;
    if (t >= 11.0) { const a = 9 * Math.exp(-(t - 11.0) * 6.5); shx = a * Math.sin(t * 97.3); shy = a * Math.cos(t * 83.1); }
    if (t >= 9.62 && t < 10.2) { const a = 2.2 * Math.exp(-(t - 9.62) * 8); shy += a * Math.sin(t * 70); }
    const rot = -1.6 * Math.sin(Math.PI * seg(t, 9.6, 11.6));
    return { cx, cy, z, shx, shy, rot };
  }
  const PAR = { sun: 0.35, far1: 0.45, far2: 0.62, main: 1, mist: 1.1, mid: 1.25, fg: 1.45, fig: 1 };
  function layerCam(cam, p) {
    const cx = lerp(C0.x, cam.cx, p), cy = lerp(C0.y, cam.cy, p), sc = BASE * Math.pow(cam.z, p);
    return { cx, cy, sc, str: `translate(${f1(960 + cam.shx)} ${f1(540 + cam.shy)}) rotate(${cam.rot.toFixed(3)}) scale(${sc.toFixed(5)}) translate(${f1(-cx)} ${f1(-cy)})` };
  }
  function toScreen(cam, x, y, p = 1) {
    const lc = layerCam(cam, p); const dx = (x - lc.cx) * lc.sc, dy = (y - lc.cy) * lc.sc; const r = (cam.rot * Math.PI) / 180;
    return { x: 960 + cam.shx + dx * Math.cos(r) - dy * Math.sin(r), y: 540 + cam.shy + dx * Math.sin(r) + dy * Math.cos(r), sc: lc.sc };
  }

  /* ───────────── render ───────────── */
  function pathFrom(fn, x0, x1, step = 2) {
    let d = ""; for (let x = x0; x <= x1 + 0.01; x += step) d += `${d ? "L" : "M"}${f1(x)} ${f1(fn(x))}`; return d;
  }

  function renderIntro(t) {
    const on = t < 5.9;
    show(intro, on); if (!on) return;
    // grid
    const gridA = seg(t, 0.05, 0.6) * (1 - seg(t, 5.3, 5.8));
    set(grid, { opacity: (0.045 * gridA).toFixed(3) });
    set(grid2, { opacity: (0.075 * gridA).toFixed(3) });
    // wave path
    let d = "";
    const m01 = Ez.inOutCubic(seg(t, 1.95, 2.28));
    if (t < 5.42) {
      if (m01 <= 0) {
        const hx = s1Head(t);
        if (t >= S1_T0) d = pathFrom(s1Y, S1_X0, Math.max(S1_X0 + 2, hx), 2);
      } else {
        const x0 = lerp(S1_X0, -20, m01), x1 = lerp(S1_X1, W + 20, m01);
        d = pathFrom((x) => lerp(s1Y(x), WAVE_Y + s2Val(x, t).v, m01), x0, x1, 2);
      }
    }
    set(wave, { d }); set(waveGlow, { d });
    // trace colour: brand gradient in S1, the current rhythm's colour in S2
    const cur = s2Val(0, t);
    const beatCol = cur.i === 0 ? FADE[0] : mix(FADE[cur.i - 1], FADE[cur.i], cur.m);
    const stops = gTrace.children;
    const k = m01;
    set(stops[0], { "stop-color": mix(FADE[0], beatCol.startsWith("rgb") ? rgbToHex(beatCol) : beatCol, k) });
    set(stops[1], { "stop-color": mix(FADE[2], rgbToHex(beatCol), k) });
    set(stops[2], { "stop-color": mix(FADE[4], rgbToHex(beatCol), k) });
    // sweep head
    const headOn = t >= S1_T0 && t < 1.55;
    const hx = s1Head(t), hy = s1Y(hx);
    const headA = headOn ? seg(t, S1_T0, S1_T0 + 0.08) * (1 - seg(t, 1.3, 1.55)) : 0;
    set(headDot, { cx: f1(hx), cy: f1(hy), opacity: headA.toFixed(3) });
    set(headGlow, { cx: f1(hx), cy: f1(hy), opacity: (headA * 0.9).toFixed(3) });
    set(bpmLabel, { opacity: (seg(t, 1.0, 1.25) * 0.75 * (1 - seg(t, 1.9, 2.05))).toFixed(3) });
    // S1 words
    s1.items.forEach((it, j) => {
      const st = 1.02 + 0.055 * j;
      const pin = Ez.outExpo(seg(t, st, st + 0.55));
      const pout = Ez.inCubic(seg(t, 1.9 + 0.018 * j, 2.1 + 0.018 * j));
      set(it.g, { transform: `translate(0 ${f1(110 * (1 - pin) - 110 * pout)})` });
    });
    // S2
    const s2on = t >= 2.0 && t < 5.9;
    show(s2, s2on);
    if (s2on) renderS2(t);
  }
  function rgbToHex(c) {
    if (c.startsWith("#")) return c;
    const n = c.match(/\d+/g).map(Number); return "#" + n.map((v) => v.toString(16).padStart(2, "0")).join("");
  }

  function renderS2(t) {
    const cur = s2Val(0, t);
    const i = cur.i;
    const col = rgbToHex(i === 0 ? FADE[0] : mix(FADE[i - 1], FADE[i], cur.m));
    set(document.getElementById("pg0"), { "stop-color": col });
    set(document.getElementById("pg1"), { "stop-color": col });
    const beatP = Ez.outCubic(seg(t, BEATS[i], BEATS[i] + 0.34));
    const punch = 1 + 0.028 * (1 - beatP);
    set(s2, { transform: `translate(960 540) scale(${punch.toFixed(4)}) translate(-960 -540)` });
    const glowIn = seg(t, 2.05, 2.4) * (1 - seg(t, 5.45, 5.75));
    set(prodGlow, { opacity: glowIn.toFixed(3), r: f1(400 + 40 * (1 - beatP)) });
    set(ringA, { opacity: (0.2 * glowIn).toFixed(3), r: f1(255 + 26 * (1 - beatP)) });
    set(ringB, { opacity: (0.32 * glowIn).toFixed(3), transform: `rotate(${f1(t * 24)} ${PX} ${PY})` });
    S2.forEach((b, k) => {
      const tin = BEATS[k], tout = BEATS[k + 1];
      const vis = t >= tin - 0.1 && t < tout + 0.25;
      show(b.root, vis); if (!vis) return;
      b.letters.forEach((g, j) => {
        const st = tin - 0.05 + 0.022 * j;
        const pin = Ez.outExpo(seg(t, st, st + 0.42));
        const so = tout - 0.17 + 0.012 * j;
        const pout = Ez.inCubic(seg(t, so, so + 0.17));
        set(g, { transform: `translate(0 ${f1(230 * (1 - pin) - 230 * pout)})` });
      });
      const mIn = Ez.outCubic(seg(t, tin + 0.02, tin + 0.3)), mOut = Ez.inCubic(seg(t, tout - 0.14, tout));
      set(b.meta, { opacity: (mIn * (1 - mOut)).toFixed(3), transform: `translate(${f1(-30 * (1 - mIn))} 0)` });
      set(b.body, { opacity: (mIn * (1 - mOut)).toFixed(3), transform: `translate(0 ${f1(24 * (1 - mIn) - 18 * mOut)})` });
      const pIn = Ez.outBack(seg(t, tin + 0.02, tin + 0.5), 1.35), pOut = Ez.inCubic(seg(t, tout - 0.14, tout + 0.03));
      const px = PX + 280 * (1 - pIn) - 220 * pOut, rot = 11 * (1 - pIn) - 6 * pOut, sc = 0.95 * (1 - 0.1 * pOut);
      const bob = Math.sin((t - tin) * 3.2) * 5;
      set(b.prod, { transform: `translate(${f1(px)} ${f1(PY + bob)}) rotate(${f1(rot)}) scale(${sc.toFixed(3)})`, opacity: (seg(t, tin, tin + 0.14) * (1 - pOut)).toFixed(3) });
      const bIn = Ez.outBack(seg(t, tin + 0.24, tin + 0.52), 2.6);
      set(b.badge, { transform: `translate(${f1(px + 150)} ${f1(PY - 205 + bob)}) scale(${bIn.toFixed(3)})`, opacity: (1 - pOut).toFixed(3) });
    });
    PAGES.forEach((r, j) => {
      const active = j === i;
      const a = active ? 1 : j < i ? 0.55 : 0.2;
      set(r, { opacity: (a * seg(t, 2.05, 2.3) * (1 - seg(t, 5.4, 5.6))).toFixed(3), fill: j <= i ? FADE[j] : BONE, width: f1(active ? 46 + 20 * beatP : 46) });
    });
  }

  function renderLines(t) {
    const on = t >= 5.4 && t < 6.62;
    show(linesG, on); if (!on) return;
    const split = Ez.outCubic(seg(t, 5.42, 5.74));
    const fadeOut = 1 - seg(t, 6.3, 6.6);
    const LANES = [500, 590, 680, 770, 860];
    LINES.forEach((ln, k) => {
      const r = Ez.inOutCubic(seg(t, 5.7 + 0.05 * k, 6.14 + 0.05 * k));
      const ridge = (X) => { const xw = (X - 960) / BASE + C0.x; return 540 + (topY(RIDGES[k], xw) - C0.y) * BASE; };
      const d = pathFrom((x) => {
        const yCard = WAVE_Y + waveVal(4, x, t);
        const yLane = LANES[k] + 0.72 * waveVal(k, x, t);
        const yw = lerp(yCard, yLane, split);
        return lerp(yw, ridge(x), r);
      }, -20, W + 20, 3);
      const col = rgbToHex(mix(FADE[4], FADE[k], split));
      set(ln.core, { d, stroke: col, opacity: fadeOut.toFixed(3), "stroke-width": f1(lerp(4, 3, r)) });
      set(ln.glow, { d, stroke: col, opacity: (0.45 * fadeOut).toFixed(3) });
    });
  }

  function renderWorld(t, cam) {
    const on = t >= 5.9 && t < 12.1;
    show(worldWrap, on); show(dawnRing, on && t < 6.6);
    if (!on) return;
    // dawn burst
    const dw = seg(t, 5.93, 6.5);
    const dr = dw <= 0 ? 0 : 2600 * Ez.inOutCubic(dw);
    if (dw < 1) { set(worldWrap, { mask: "url(#dawn)" }); set(dawnCircle, { r: f1(dr) }); }
    else worldWrap.removeAttribute("mask");
    set(dawnRing, { r: f1(dr * 0.88), opacity: (dw > 0 && dw < 1 ? 0.55 * Math.sin(Math.PI * dw) : 0).toFixed(3), "stroke-width": f1(30 + 60 * dw) });
    for (const k in G) set(G[k], { transform: layerCam(cam, PAR[k]).str });
    // depth of field during the leap
    const dof = Ez.inOut(seg(t, 9.85, 10.6)) * (1 - Ez.inOut(seg(t, 11.45, 11.75)));
    const scMain = layerCam(cam, 1).sc;
    const setDof = (id, px, sc) => document.getElementById(id).setAttribute("stdDeviation", (px / sc).toFixed(3));
    if (dof > 0.01) {
      setDof("dof-far", 5 * dof, layerCam(cam, 0.5).sc); setDof("dof-main", 2.2 * dof, scMain); setDof("dof-near", 7 * dof, layerCam(cam, 1.3).sc);
      set(G.far1, { filter: "url(#f-dof-far)" }); set(G.far2, { filter: "url(#f-dof-far)" }); set(G.main, { filter: "url(#f-dof-main)" });
      set(G.mist, { filter: "url(#f-dof-near)" }); set(G.mid, { filter: "url(#f-dof-near)" }); set(G.fg, { filter: "url(#f-dof-near)" });
    } else for (const k of ["far1", "far2", "main", "mist", "mid", "fg"]) G[k].removeAttribute("filter");

    // sun: far away while climbing, locks behind the athlete for the finale
    const sunT = Ez.inOut(seg(t, 6.0, 11.1));
    const sunY = lerp(SUN_Y0, SUN_Y1, sunT);
    const lock = Ez.inOut(seg(t, 9.2, 10.4));
    const pEff = lerp(PAR.sun, 1, lock);
    const sunX = APEX.x + (cam.cx - C0.x) * (1 - pEff), sunYW = sunY + (cam.cy - C0.y) * (1 - pEff);
    const sunScale = Math.pow(cam.z, pEff - 1);
    set(G.sun, { transform: layerCam(cam, 1).str });
    set(sunGlow, { cx: f1(sunX), cy: f1(sunYW), r: f1(360 * sunScale) });
    set(sunDisc, { cx: f1(sunX), cy: f1(sunYW), r: f1(SUN_R * sunScale) });
    const burst = seg(t, 10.98, 11.5);
    const rayS = t < 10.98 ? 0.35 : Ez.outBack(burst, 2.4) * (1 + 0.04 * Math.sin(t * 1.4));
    set(raysG, { opacity: seg(t, 10.98, 11.1).toFixed(3), transform: `translate(${f1(sunX)} ${f1(sunYW)}) rotate(${f1(t * 6)}) scale(${(rayS * sunScale).toFixed(4)})` });
    fRing.forEach((c, k) => {
      const u = frac((t - 11.1) * 0.55 + k / 5);
      const a = t < 11.1 ? 0 : (1 - u) * seg(t, 11.1, 11.35) * 0.8;
      set(c, { cx: f1(sunX), cy: f1(sunYW), r: f1((SUN_R + 8 + u * 220) * sunScale), opacity: a.toFixed(3) });
    });

    // track + athlete
    const a = athlete(t);
    let sTrack = 0;
    if (t >= 6.0) sTrack = t < T_RUN0 ? lerp(0, sA, Ez.inOutCubic(seg(t, 6.0, T_RUN0))) : a.s;
    for (const p of [track, trackGlow]) set(p, { "stroke-dasharray": `${L} ${L}`, "stroke-dashoffset": f1(L - sTrack) });
    const sk = skeleton(a.hx, a.hy, a.pose);
    set(legs, { d: sk.legs }); set(arms, { d: sk.arms }); set(torso, { d: sk.torso });
    set(head, { cx: f1(sk.head[0]), cy: f1(sk.head[1]) });
    const colT = Ez.inOut(a.lotusT);
    const col = `rgb(${DARK.map((c, i) => Math.round(lerp(c, ORNG[i], colT))).join(",")})`;
    set(fig, { stroke: col, opacity: seg(t, T_RUN0 - 0.05, T_RUN0 + 0.12).toFixed(3) });
    set(head, { fill: col });
    const pulse = a.idle > 0 ? 0.08 * Math.sin(a.idle * 1.8) : 0;
    set(aura, { cx: f1(a.hx), cy: f1(a.hy - 12), opacity: (colT * (0.8 + pulse)).toFixed(3) });
  }

  function renderS3(t) {
    const on = t >= 6.8 && t < 9.5;
    show(s3, on); if (!on) return;
    const line = (words, tin, tout) => words.items.forEach((it, j) => {
      const pin = Ez.outExpo(seg(t, tin + 0.07 * j, tin + 0.07 * j + 0.6));
      const pout = Ez.inCubic(seg(t, tout + 0.03 * j, tout + 0.03 * j + 0.2));
      set(it.g, { transform: `translate(0 ${f1(170 * (1 - pin) - 170 * pout)})` });
    });
    line(s3a, 7.02, 8.02);
    line(s3b, 8.1, 9.18);
    set(haze, { opacity: (0.78 * Ez.inOut(seg(t, 6.85, 7.2)) * (1 - Ez.inOut(seg(t, 9.1, 9.45)))).toFixed(3) });
  }

  function renderShock(t, cam) {
    const on = t >= 10.98 && t < 12.0;
    show(shock, on); if (!on) return;
    const f = figCenter(t), sp = toScreen(cam, f.x, f.y);
    SHOCK.forEach((c, k) => {
      const u = seg(t, 10.98 + 0.075 * k, 11.9 + 0.075 * k);
      const r = Ez.outExpo(u) * (1250 - k * 90);
      set(c, { cx: f1(sp.x), cy: f1(sp.y), r: f1(r), "stroke-width": f1(lerp(k === 3 ? 22 : 9, 0.6, u)), opacity: (u > 0 && u < 1 ? (1 - u) ** 1.4 : 0).toFixed(3) });
    });
  }

  function renderEnd(t) {
    const on = t >= 11.95;
    show(end, on); if (!on) return;
    set(topo, { transform: `translate(960 470) rotate(${f1((t - 12) * 2.2)}) scale(${(1.02 + 0.03 * Math.sin(t * 0.6)).toFixed(4)})`, opacity: seg(t, 12.1, 12.8).toFixed(3) });
    set(endGlow, { opacity: (1 - 0.55 * Ez.inOut(seg(t, 12.1, 13.2))).toFixed(3) });
    // mark draw
    const mt = Ez.inOutCubic(seg(t, 12.12, 12.6)), wt = Ez.inOutCubic(seg(t, 12.22, 12.74));
    set(markMtn, { "stroke-dasharray": `${markMtnL} ${markMtnL}`, "stroke-dashoffset": f1(markMtnL * (1 - mt)) });
    set(markWave, { "stroke-dasharray": `${markWaveL} ${markWaveL}`, "stroke-dashoffset": f1(markWaveL * (1 - wt)) });
    // PEAK letters pop
    PEAK_L.forEach((passG, li) => {
      const st = 12.5 + li * 0.055;
      const p = Ez.outBack(seg(t, st, st + 0.34), 2.2), o = seg(t, st, st + 0.08);
      const [x0, x1] = PEAK_BOX[li], cx = (x0 + x1) / 2;
      passG.forEach((g) => set(g, { transform: `translate(${cx} 0) scale(${Math.max(0.001, p).toFixed(4)}) translate(${-cx} 0)`, opacity: o.toFixed(3) }));
    });
    // freq write-on (slanted wipe)
    const fw = Ez.inOutCubic(seg(t, 12.78, 13.12));
    const xr = lerp(236, 420, fw), sl = 22;
    set(freqClipPoly, { points: `236,-90 ${f1(xr + sl)},-90 ${f1(xr - sl)},40 236,40` });
    // pulse draw + spark
    const pt = Ez.inOutCubic(seg(t, 13.0, 13.42));
    set(pulse, { "stroke-dasharray": `${pulseL} ${pulseL}`, "stroke-dashoffset": f1(pulseL * (1 - pt)) });
    const sp = pulse.getPointAtLength(pulseL * pt);
    const sa = pt > 0 && pt < 1 ? 1 : pt >= 1 ? 1 - seg(t, 13.42, 13.7) : 0;
    set(spark, { cx: f1(sp.x), cy: f1(sp.y), opacity: sa.toFixed(3) });
    set(sparkGlow, { cx: f1(sp.x), cy: f1(sp.y), opacity: (sa * 0.9).toFixed(3) });
    const br = seg(t, 13.3, 13.9);
    const peakPt = pulse.getPointAtLength(pulseL * 0.74);
    set(blipRing, { cx: f1(peakPt.x), cy: f1(peakPt.y - 20), r: f1(Ez.outCubic(br) * 70), opacity: (br > 0 && br < 1 ? (1 - br) * 0.7 : 0).toFixed(3) });
    // tagline
    tag.items.forEach((it, j) => {
      const p = Ez.outExpo(seg(t, 13.32 + 0.06 * j, 13.9 + 0.06 * j));
      set(it.g, { transform: `translate(0 ${f1(96 * (1 - p))})` });
    });
    const sp2 = Ez.outExpo(seg(t, 13.68, 14.3));
    sub.items.forEach((it) => set(it.g, { transform: `translate(0 ${f1(58 * (1 - sp2))})` }));
    const u = Ez.outCubic(seg(t, 14.05, 14.55));
    set(urlG, { opacity: u.toFixed(3), transform: `translate(0 ${f1(10 * (1 - u))})` });
    set(urlL1, { x1: f1(960 - urlW / 2 - 26 - 64 * u) }); set(urlL2, { x2: f1(960 + urlW / 2 + 26 + 64 * u) });
  }

  function renderHUD(t, cam) {
    const on = t >= 6.5 && t < 12.0;
    show(hud, on); if (!on) return;
    const a = Ez.outCubic(seg(t, 6.55, 6.95)) * (1 - seg(t, 11.7, 11.95));
    set(hud, { opacity: a.toFixed(3) });
    const at = athlete(t);
    const q = clamp((at.s - sA) / (L - sA));
    const alt = Math.round(1620 + q * 860);
    let hr;
    if (t < 9.55) hr = 146 + 30 * q + 1.5 * Math.sin(t * 6);
    else if (t < 10.35) hr = lerp(176, 189, seg(t, 9.55, 10.35));
    else hr = lerp(189, 54, Ez.inOut(seg(t, 10.45, 11.5)));
    const cad = t < 9.5 ? Math.round(174 + 4 * Math.sin(t * 2.3)) : null;
    HROWS[0].textContent = `${alt.toLocaleString("en-GB")} m`;
    HROWS[1].textContent = `${Math.round(hr)} bpm`;
    HROWS[2].textContent = cad ? `${cad} spm` : "—";
    const status = t < 9.55 ? "ASCENDING" : t < 11.05 ? "SUMMIT" : "PEAK FREQUENCY";
    HROWS[3].textContent = status;
    set(HROWS[3], { fill: status === "PEAK FREQUENCY" ? "#F4B27E" : BONE });
    set(HROWS[1], { fill: t > 10.9 ? "#F4B27E" : BONE });
    // mini ECG at the current heart rate
    const bps = hr / 60, speed = 110, spacing = speed / bps;
    const d = pathFrom((x) => { const u = frac((x + speed * t) / spacing); return 83 + 22 * ecgShape(u); }, 262, 382, 1.5);
    set(miniEcg, { d });
    // altitude gauge
    const gy = 780 - 480 * q;
    set(gMark, { transform: `translate(1828 ${f1(gy)})` });
    set(gFill, { y1: f1(gy) });
  }

  function renderChrome(t) {
    const a = seg(t, 0.12, 0.5) * (1 - seg(t, 11.75, 12.0));
    show(chrome, a > 0); if (a <= 0) return;
    const light = Ez.inOut(seg(t, 5.95, 6.45));
    const col = mix(BONE, INK, light);
    set(chrome, { opacity: (0.62 * a).toFixed(3) });
    set(corners, { stroke: col });
    for (const e of [cTL, cTR, cBR]) set(e, { fill: col });
    const scene = t < 2.05 ? "01 / SIGNAL" : t < 5.7 ? "02 / FREQUENCIES" : t < 9.6 ? "03 / ASCENT" : "04 / PEAK";
    cTR.textContent = scene;
    const f = Math.floor(t * FPS + 1e-6), s = Math.floor(f / FPS), fr = f % FPS;
    cBR.textContent = `00:00:${String(s).padStart(2, "0")}:${String(fr).padStart(2, "0")}  /  00:00:15:00`;
  }

  function renderFx(t, cam) {
    fx.clearRect(0, 0, W, H);
    // sparks
    if (t >= T_RUN0 && t < 10.2) {
      fx.save();
      fx.globalCompositeOperation = "lighter";
      for (const p of SPARKS) {
        const age = t - p.t0;
        if (age < 0 || age > p.life) continue;
        const x = p.x + p.vx * age, y = p.y + p.vy * age + 0.5 * 260 * age * age;
        const s = toScreen(cam, x, y);
        const al = (1 - age / p.life) ** 1.6;
        const r = p.size * s.sc * 0.55;
        const g = fx.createRadialGradient(s.x, s.y, 0, s.x, s.y, r * 3);
        g.addColorStop(0, p.c); g.addColorStop(1, "rgba(219,122,69,0)");
        fx.globalAlpha = al; fx.fillStyle = g;
        fx.beginPath(); fx.arc(s.x, s.y, r * 3, 0, Math.PI * 2); fx.fill();
      }
      fx.restore();
    }
    // runner appears at the head of the light streak
    if (t >= 6.22 && t < 6.7) {
      const a = athlete(Math.max(t, T_RUN0)), s = toScreen(cam, a.hx, a.hy);
      const k = 1 - seg(t, T_RUN0, 6.7), r = 140 * s.sc / BASE;
      const g = fx.createRadialGradient(s.x, s.y, 0, s.x, s.y, r);
      g.addColorStop(0, `rgba(255,232,200,${0.85 * k})`); g.addColorStop(1, "rgba(255,232,200,0)");
      fx.fillStyle = g; fx.fillRect(s.x - r, s.y - r, r * 2, r * 2);
    }
    // impact: flash + anamorphic streak
    if (t >= 10.98 && t < 11.8) {
      const u = seg(t, 10.98, 11.5);
      fx.fillStyle = `rgba(255,245,230,${(0.6 * (1 - u) ** 2).toFixed(3)})`;
      fx.fillRect(0, 0, W, H);
      const f = figCenter(t), s = toScreen(cam, f.x, f.y);
      const k = (1 - seg(t, 10.98, 11.38)) ** 2;
      const g = fx.createLinearGradient(0, 0, W, 0);
      g.addColorStop(0, "rgba(255,210,160,0)"); g.addColorStop(0.5, `rgba(255,236,210,${0.9 * k})`); g.addColorStop(1, "rgba(255,210,160,0)");
      fx.fillStyle = g; fx.fillRect(0, s.y - 2, W, 4);
      const g2 = fx.createLinearGradient(0, 0, W, 0);
      g2.addColorStop(0, "rgba(242,163,107,0)"); g2.addColorStop(0.5, `rgba(242,163,107,${0.35 * k})`); g2.addColorStop(1, "rgba(242,163,107,0)");
      fx.fillStyle = g2; fx.fillRect(0, s.y - 18, W, 36);
    }
    // push into the sun: white-out to the end card
    const wo = t < 12.05 ? Ez.inCubic(seg(t, 11.72, 12.05)) : 1 - Ez.outCubic(seg(t, 12.05, 12.45));
    if (wo > 0) { fx.fillStyle = `rgba(252,238,214,${wo.toFixed(3)})`; fx.fillRect(0, 0, W, H); }
    // vignette
    const light = t < 12 ? Ez.inOut(seg(t, 5.95, 6.45)) : 1;
    const vA = t >= 12 ? 0.08 : lerp(0.55, 0.2, light);
    const vg = fx.createRadialGradient(960, 540, 420, 960, 540, 1150);
    vg.addColorStop(0, "rgba(0,0,0,0)"); vg.addColorStop(1, `rgba(0,0,0,${vA})`);
    fx.fillStyle = vg; fx.fillRect(0, 0, W, H);
  }

  function renderGrain(t) {
    const f = Math.floor(t * FPS);
    grain.clearRect(0, 0, W, H);
    grain.imageSmoothingEnabled = true;
    grain.globalAlpha = 1;
    grain.drawImage(NOISE[f % NOISE.length], 0, 0, W, H);
    const light = t < 12 ? Ez.inOut(seg(t, 5.95, 6.45)) : 1;
    grainCv.style.opacity = (t >= 12 ? 0.1 : lerp(0.2, 0.14, light)).toFixed(3);
  }

  function render(t) {
    t = clamp(t, 0, DUR - 1e-6);
    const cam = camAt(t);
    renderIntro(t);
    renderLines(t);
    renderWorld(t, cam);
    renderS3(t);
    renderShock(t, cam);
    renderEnd(t);
    renderHUD(t, cam);
    renderChrome(t);
    renderFx(t, cam);
    renderGrain(t);
    set(bgDark, { opacity: t < 6.6 ? 1 : 0 });
  }

  window.render = render;
  window.REEL = { FPS, DUR, steps: [...new Set(SPARKS.map((p) => p.t0.toFixed(4)))].map(Number), beats: BEATS };
  const q = new URLSearchParams(location.search).get("t");
  render(q ? Number(q) : 0);
  window.reelReady = true;
})().catch((e) => { document.body.setAttribute("data-error", String(e && e.stack || e)); console.error(e); });
