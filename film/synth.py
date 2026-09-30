"""
PEAKfreq brand film — sound design, synthesised from scratch (no samples).

Every sound is placed on a visual event in the film:
  heartbeat + monitor blips on the opening ECG, a kick and a rising pentatonic
  pluck for each of the five frequencies, a riser into the dawn reveal, a pulse
  bass locked to the runner's footsteps, tension into the leap, a sub-drop and
  shimmer chord when the rays burst, a calm heartbeat as the pulse settles, and
  the monitor blip returning on the logo's pulse before the final chord.

    python film/synth.py film/out/events.json film/out/soundtrack.wav
"""
import json
import sys

import numpy as np
from scipy import signal

SR = 48000
DUR = 15.0
N = int(SR * DUR)
rng = np.random.default_rng(11)

ev = json.load(open(sys.argv[1]))
out_path = sys.argv[2]

L = np.zeros(N)
R = np.zeros(N)
rev_send_L = np.zeros(N)
rev_send_R = np.zeros(N)


def t_axis(dur):
    return np.arange(int(SR * dur)) / SR


def place(buf, start, sig, gain=1.0, pan=0.0, rev=0.0):
    """Mix mono `sig` at time `start` with equal-power pan (-1..1) and reverb send."""
    i0 = int(round(start * SR))
    if i0 >= N:
        return
    sig = sig[: N - i0]
    gl = np.cos((pan + 1) * np.pi / 4) * gain
    gr = np.sin((pan + 1) * np.pi / 4) * gain
    L[i0 : i0 + len(sig)] += sig * gl
    R[i0 : i0 + len(sig)] += sig * gr
    if rev:
        rev_send_L[i0 : i0 + len(sig)] += sig * gl * rev
        rev_send_R[i0 : i0 + len(sig)] += sig * gr * rev


def env_ad(n, a, d, curve=4.0):
    t = np.arange(n) / SR
    e = np.minimum(1.0, t / max(a, 1e-4))
    rel = np.exp(-np.maximum(0, t - a) * curve / max(d, 1e-4))
    return e * rel


def lp(x, fc, order=2):
    b, a = signal.butter(order, fc / (SR / 2), "low")
    return signal.lfilter(b, a, x)


def hp(x, fc, order=2):
    b, a = signal.butter(order, fc / (SR / 2), "high")
    return signal.lfilter(b, a, x)


def bp(x, lo, hi, order=2):
    b, a = signal.butter(order, [lo / (SR / 2), hi / (SR / 2)], "band")
    return signal.lfilter(b, a, x)


def sine_sweep(f0, f1, dur, curve=6.0):
    t = t_axis(dur)
    f = f1 + (f0 - f1) * np.exp(-t * curve)
    ph = 2 * np.pi * np.cumsum(f) / SR
    return np.sin(ph)


# ── instruments ──────────────────────────────────────────────


def heartbeat(strength=1.0):
    """Lub-dub: two soft, pitched low thumps."""
    def thump(f0, dur, amp):
        s = sine_sweep(f0, 38, dur, curve=18) * env_ad(int(SR * dur), 0.004, dur, curve=5)
        click = lp(rng.standard_normal(int(SR * dur)), 900) * env_ad(int(SR * dur), 0.001, 0.02, 6) * 0.25
        return (s + click) * amp
    lub = thump(78, 0.22, 1.0)
    dub = thump(92, 0.18, 0.62)
    out = np.zeros(int(SR * 0.5))
    out[: len(lub)] += lub
    i = int(SR * 0.19)
    out[i : i + len(dub)] += dub
    return out * strength


def blip(freq=1046.5, dur=0.42, bright=0.35):
    """Monitor blip, warmed up: sine + soft 2nd harmonic, quick decay."""
    t = t_axis(dur)
    s = np.sin(2 * np.pi * freq * t) + bright * np.sin(2 * np.pi * freq * 2 * t)
    return s * env_ad(len(t), 0.002, dur, curve=7)


def kick(f0=150, dur=0.38, amp=1.0):
    s = sine_sweep(f0, 42, dur, curve=22) * env_ad(int(SR * dur), 0.002, dur, curve=4.5)
    click = hp(rng.standard_normal(int(SR * 0.012)), 2000) * np.linspace(1, 0, int(SR * 0.012)) * 0.25
    s[: len(click)] += click
    return np.tanh(s * 1.4) * amp


def pluck(freq, dur=0.9, bright=0.6):
    """FM pluck: a clean, glassy tone with a fast brightness decay."""
    t = t_axis(dur)
    mod_idx = 2.4 * np.exp(-t * 14) * bright
    s = np.sin(2 * np.pi * freq * t + mod_idx * np.sin(2 * np.pi * freq * 2 * t))
    s += 0.35 * np.sin(2 * np.pi * freq * 0.5 * t)  # body
    return s * env_ad(len(t), 0.003, dur, curve=5)


def tick(dur=0.05, fc=4500, amp=1.0):
    n = int(SR * dur)
    s = bp(rng.standard_normal(n), fc * 0.6, min(fc * 1.6, SR / 2 - 100))
    return s * env_ad(n, 0.0008, dur, curve=9) * amp


def whoosh(dur, lo=300, hi=6000, peak=0.6, amp=1.0):
    """Filtered noise swell whose band sweeps upward and whose level peaks at `peak`."""
    n = int(SR * dur)
    x = rng.standard_normal(n)
    out = np.zeros(n)
    blocks = 24
    edges = np.linspace(0, n, blocks + 1).astype(int)
    for k in range(blocks):
        u = (k + 0.5) / blocks
        fc = lo * (hi / lo) ** u
        seg = bp(x[max(0, edges[k] - 2000) : edges[k + 1]], fc * 0.5, min(fc * 1.8, SR / 2 - 100))
        out[edges[k] : edges[k + 1]] = seg[-(edges[k + 1] - edges[k]) :]
    u = np.linspace(0, 1, n)
    e = np.where(u < peak, (u / peak) ** 2, np.exp(-(u - peak) / (1 - peak) * 4))
    # smooth block seams
    out = lp(out, hi * 1.2)
    return out * e * amp


def riser(dur, f0=180, f1=1400, amp=1.0):
    t = t_axis(dur)
    u = t / dur
    f = f0 * (f1 / f0) ** (u**1.6)
    ph = 2 * np.pi * np.cumsum(f) / SR
    tone = np.sin(ph) + 0.4 * np.sin(2 * ph + 0.3)
    noise = whoosh(dur, 200, 9000, peak=0.98)
    e = u**2.2
    return (tone * 0.35 + noise * 0.9) * e * amp


def sub_drop(dur=1.6, f0=85, f1=30, amp=1.0):
    s = sine_sweep(f0, f1, dur, curve=2.2)
    return np.tanh(1.6 * s * env_ad(int(SR * dur), 0.004, dur, curve=3.2)) * amp


def pad(freqs, dur, attack=0.8, release=1.2, detune=0.0035, bright=0.25):
    """Warm detuned-saw pad, gently low-passed."""
    t = t_axis(dur)
    s = np.zeros_like(t)
    for f in freqs:
        for d in (-detune, 0, detune):
            ph = (f * (1 + d) * t + rng.random()) % 1.0
            s += (2 * ph - 1) * 0.33
    s = lp(s, 900 + 2600 * bright, order=2)
    e = np.minimum(1, t / attack) * np.minimum(1, np.maximum(0, (dur - t) / release))
    return s * e / max(1, len(freqs))


def bell(freqs, dur=3.5, amp=1.0):
    t = t_axis(dur)
    s = np.zeros_like(t)
    for f in freqs:
        for ratio, a, dec in ((1, 1.0, 1.6), (2.76, 0.35, 3.2), (5.4, 0.18, 5.5)):
            s += a * np.sin(2 * np.pi * f * ratio * t + rng.random() * 6) * np.exp(-t * dec / dur * 3)
    return s * env_ad(len(t), 0.004, dur, curve=1.2) / len(freqs) * amp


def reverse(x):
    return x[::-1].copy()


# Pitches (D major pentatonic, the film's key).
D2, A2, D3, A3 = 73.42, 110.0, 146.83, 220.0
D4, E4, Fs4, A4, B4 = 293.66, 329.63, 369.99, 440.0, 493.88
D5, E5, Fs5, A5, D6 = 587.33, 659.26, 739.99, 880.0, 1174.66

# ── 1. SIGNAL (0–2s): ECG sweep, heartbeat, "Your body runs on rhythm." ──
place(L, 0.0, lp(rng.standard_normal(int(SR * 2.0)), 1200) * np.linspace(0, 1, int(SR * 2.0)) ** 2 * np.linspace(1, 0, int(SR * 2.0)) ** 0.2, 0.025)  # room tone
for t_beat, s in ((0.457, 0.55), (0.943, 1.0)):
    place(L, t_beat - 0.03, heartbeat(s), 0.9, 0, rev=0.25)
    place(L, t_beat, blip(1046.5 if s < 1 else 1174.66, 0.5), 0.16 * s, 0.25, rev=0.6)
place(L, 0.98, whoosh(0.55, 400, 5000, peak=0.55), 0.11, -0.2, rev=0.3)

# ── 2. FIVE FREQUENCIES (2.1–5.6s) ──
notes = [D4, E4, Fs4, A4, B4]
for i, tb in enumerate(ev["beats"][:5]):
    place(L, tb, kick(150 + i * 6, 0.42), 0.62, 0, rev=0.08)
    place(L, tb, pluck(notes[i], 1.2, 0.7), 0.2, (-0.35, 0.35, -0.2, 0.2, 0)[i], rev=0.5)
    place(L, tb, pluck(notes[i] * 2, 0.8, 0.4), 0.07, (0.3, -0.3, 0.2, -0.2, 0)[i], rev=0.6)
    place(L, tb - 0.2, whoosh(0.26, 1200, 9000, peak=0.85), 0.06, (0.5, -0.5, 0.5, -0.5, 0.3)[i])
    # 16th-note shaker in between for momentum
    for k in range(1, 4):
        place(L, tb + k * 0.175, tick(0.04, 7000), 0.035 + 0.01 * (k % 2), 0.4 * (-1) ** k)
# drone under the frequencies
place(L, 2.05, pad([D2, A2, D3], 3.7, attack=0.6, release=0.8, bright=0.15), 0.3, 0, rev=0.2)

# ── 3. DAWN (5.4–6.5s): riser, then light bursts through ──
place(L, 5.2, riser(0.78, 220, 1600), 0.2, 0, rev=0.3)
place(L, 5.93, sub_drop(1.4, 70, 32), 0.55, 0)
place(L, 5.93, bell([D5, Fs5, A5, E5], 3.2), 0.14, 0, rev=0.9)
place(L, 5.93, pad([D3, A3, Fs4, E4], 3.4, attack=0.05, release=2.0, bright=0.5), 0.2, 0, rev=0.5)
place(L, 5.9, whoosh(0.9, 800, 12000, peak=0.1), 0.1, 0, rev=0.5)

# ── 4. ASCENT (6.3–9.6s): pulse locked to footsteps ──
for i, ts in enumerate(ev["steps"]):
    place(L, ts, tick(0.06, 2400, 1.0), 0.12, 0.25 * (-1) ** i, rev=0.15)  # footfall
    bass = pluck(D2 if i % 4 < 2 else A2, 0.28, 0.25)
    place(L, ts, lp(bass, 400), 0.36, 0)
    place(L, ts + 0.14, tick(0.03, 8000), 0.03, -0.35 * (-1) ** i)  # off-beat hat
# tension pad rising through the climb
place(L, 6.3, pad([D3, A3, E4], 3.4, attack=1.8, release=0.4, bright=0.35), 0.16, 0, rev=0.3)
# copy accents
place(L, 7.0, whoosh(0.45, 600, 7000, peak=0.5), 0.08, -0.3, rev=0.3)
place(L, 8.08, whoosh(0.45, 600, 7000, peak=0.5), 0.08, 0.3, rev=0.3)
place(L, 8.1, pluck(D3, 1.6, 0.5), 0.2, 0, rev=0.5)  # "One place." lands
place(L, 8.1, kick(120, 0.5), 0.35, 0)

# ── 5. LEAP (8.8–11s): tension, leap, burst ──
place(L, 8.85, riser(2.13, 160, 2200), 0.46, 0, rev=0.4)
# heart rate climbs into the leap: beats quicken
for k, tb in enumerate((9.2, 9.62, 9.98, 10.3, 10.57, 10.8)):
    place(L, tb, heartbeat(0.55 + 0.08 * k), 0.55, 0, rev=0.2)
place(L, 9.56, kick(170, 0.3), 0.45, 0)  # push-off
place(L, 9.62, whoosh(0.7, 300, 8000, peak=0.35), 0.12, 0, rev=0.3)  # airborne
place(L, 10.25, reverse(bell([D5, A5], 0.75)), 0.1, 0, rev=0.5)  # reverse shimmer into the burst

# ── 6. PEAK (10.98s): the burst ──
place(L, 10.98, sub_drop(1.9, 95, 28), 0.72, 0)
place(L, 10.98, kick(180, 0.6), 0.5, 0)
noise_burst = lp(rng.standard_normal(int(SR * 1.2)), 3500) * env_ad(int(SR * 1.2), 0.002, 1.2, 6)
place(L, 10.98, noise_burst, 0.2, 0, rev=0.6)
place(L, 10.98, bell([D5, Fs5, A5, D6], 4.0), 0.26, 0, rev=1.0)
place(L, 10.98, pad([D3, A3, D4, Fs4, A4, E5], 4.2, attack=0.02, release=1.6, bright=0.55), 0.24, 0, rev=0.6)
# the heart settles: one calm beat, then the push into the sun
place(L, 11.6, heartbeat(0.7), 0.7, 0, rev=0.35)
place(L, 11.45, reverse(whoosh(0.6, 500, 12000, peak=0.1)), 0.14, 0, rev=0.4)

# ── 7. LOGO (12–15s) ──
place(L, 12.05, whoosh(0.8, 3000, 14000, peak=0.05), 0.07, 0, rev=0.8)  # air as the card appears
place(L, 12.12, pluck(A4, 1.6, 0.3), 0.12, -0.2, rev=0.7)  # mark draws
for i, f in enumerate((D5, E5, Fs5, A5)):  # P · E · A · K
    place(L, 12.5 + i * 0.055, pluck(f, 0.5, 0.9), 0.1, -0.3 + i * 0.2, rev=0.45)
    place(L, 12.5 + i * 0.055, tick(0.03, 5000), 0.05, -0.3 + i * 0.2)
place(L, 12.76, whoosh(0.4, 2000, 11000, peak=0.6), 0.07, 0.35, rev=0.3)  # freq writes on
place(L, 13.251, blip(1174.66, 0.9), 0.22, 0.2, rev=0.9)  # the pulse — bookends the opening
place(L, 13.2, heartbeat(0.55), 0.45, 0, rev=0.3)
# resolve
place(L, 13.3, pad([D3, A3, D4, Fs4, A4, E5], 1.7, attack=0.35, release=1.2, bright=0.45), 0.34, 0, rev=0.6)
place(L, 13.32, bell([D4, A4, Fs5], 1.7), 0.16, 0, rev=0.9)
place(L, 13.32, sub_drop(1.2, 60, 36), 0.35, 0)

# ── reverb (synthetic plate-ish IR) ──
def make_ir(dur=2.4, pre=0.018):
    n = int(SR * dur)
    t = np.arange(n) / SR
    irL = rng.standard_normal(n) * np.exp(-t * 3.1)
    irR = rng.standard_normal(n) * np.exp(-t * 3.1)
    irL, irR = lp(irL, 6500), lp(irR, 6000)
    pad_ = np.zeros(int(SR * pre))
    return np.concatenate([pad_, irL]), np.concatenate([pad_, irR])


irL, irR = make_ir()
wetL = signal.fftconvolve(rev_send_L, irL)[:N]
wetR = signal.fftconvolve(rev_send_R, irR)[:N]
scale = 0.12 / max(1e-9, np.sqrt(np.mean(irL**2)) * np.sqrt(len(irL)))
L = L + wetL * scale * 1.0
R = R + wetR * scale * 1.0

# ── master: glue, gentle saturation, fade, normalise ──
mix = np.stack([L, R])
mix = hp(mix, 28)
# gentle bus compression (RMS follower, 3:1 above threshold)
lvl = np.sqrt(signal.lfilter([1 - np.exp(-1 / (SR * 0.03))], [1, -np.exp(-1 / (SR * 0.03))], np.mean(mix**2, axis=0)) + 1e-12)
thr = np.percentile(lvl, 90) * 0.7
gain = np.where(lvl > thr, (thr / lvl) ** (1 - 1 / 3), 1.0)
gain = signal.lfilter([1 - np.exp(-1 / (SR * 0.08))], [1, -np.exp(-1 / (SR * 0.08))], gain)
mix = mix * gain
mix = np.tanh(mix * 1.15) / np.tanh(1.15)
fade_in = np.minimum(1, np.arange(N) / (SR * 0.02))
fade_out = np.minimum(1, (N - np.arange(N)) / (SR * 0.5))
mix *= fade_in * fade_out
# look-ahead peak limiter: drive into a -1 dBFS ceiling
from scipy.ndimage import maximum_filter1d, uniform_filter1d

DRIVE_DB = 4.0
CEIL = 10 ** (-1.4 / 20)
mix = mix / np.max(np.abs(mix)) * 10 ** (DRIVE_DB / 20) * CEIL
look = int(SR * 0.005)
env = maximum_filter1d(np.max(np.abs(mix), axis=0), size=2 * look + 1)
g = np.minimum(1.0, CEIL / np.maximum(env, 1e-9))
g = -maximum_filter1d(-g, size=int(SR * 0.03))  # hold
g = uniform_filter1d(g, size=int(SR * 0.012))  # smooth attack/release
mix = mix * g
peak = np.max(np.abs(mix))
mix = mix / peak * CEIL
rms_db = 20 * np.log10(np.sqrt(np.mean(mix**2)) + 1e-12)

pcm = (mix.T * 32767).astype(np.int16)
from scipy.io import wavfile

wavfile.write(out_path, SR, pcm)
print(f"wrote {out_path}: {DUR}s, peak -1.4 dBFS, RMS {rms_db:.1f} dBFS")
