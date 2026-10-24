// Leonida Tpk: faro, cuenta regresiva, poste de millas y QR.

// Dirección pública en GitHub Pages. publicar-github.bat la reemplaza sola.
const PUBLIC_URL = "https://TU-USUARIO.github.io/gta6-leonida/";
const LAUNCH = new Date(2026, 10, 19, 0, 0, 0); // 19 nov 2026, hora local

const root = document.documentElement;
const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
const canHover = matchMedia("(hover: hover)");

const store = {
  get(key) { try { return localStorage.getItem(key); } catch { return null; } },
  set(key, value) { try { localStorage.setItem(key, value); } catch { /* sin almacenamiento */ } },
};

const isCalm = () => reducedMotion.matches || root.classList.contains("calm-mode");

/* ---------- Cuenta regresiva ---------- */

function tickCountdown() {
  const ms = LAUNCH - Date.now();
  const days = document.querySelectorAll('[data-cd="days"]');
  const unit = document.querySelector('[data-cd="unit"]');
  const clock = document.querySelector('[data-cd="clock"]');

  if (ms <= 0) {
    days.forEach((el) => { el.textContent = "Ya"; });
    unit.textContent = "disponible";
    clock.textContent = "19.11.2026";
    return;
  }
  const total = Math.floor(ms / 1000);
  const d = Math.floor(total / 86400);
  const h = Math.floor((total % 86400) / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  const pad = (n) => String(n).padStart(2, "0");

  days.forEach((el) => { el.textContent = d; });
  unit.textContent = d === 1 ? "día" : "días";
  clock.textContent = `${pad(h)}:${pad(m)}:${pad(s)}`;
}
tickCountdown();
setInterval(tickCountdown, 1000);

/* ---------- Faro ---------- */

const lit = [...document.querySelectorAll("[data-lit]")];
const visible = new Set();
const io = new IntersectionObserver((entries) => {
  entries.forEach((e) => (e.isIntersecting ? visible.add(e.target) : visible.delete(e.target)));
}, { rootMargin: "100px" });
lit.forEach((el) => io.observe(el));

const beam = { x: -9999, y: -9999, lastInput: 0, frame: 0 };

function paintBeam() {
  beam.frame = 0;
  root.style.setProperty("--bx", `${beam.x}px`);
  root.style.setProperty("--by", `${beam.y}px`);
  visible.forEach((el) => {
    const r = el.getBoundingClientRect();
    el.style.setProperty("--lx", `${beam.x - r.left}px`);
    el.style.setProperty("--ly", `${beam.y - r.top}px`);
  });
}

function aimBeam(x, y) {
  beam.x = x;
  beam.y = y;
  if (!beam.frame) beam.frame = requestAnimationFrame(paintBeam);
}

addEventListener("pointermove", (e) => {
  beam.lastInput = performance.now();
  aimBeam(e.clientX, e.clientY);
}, { passive: true });
addEventListener("pointerdown", (e) => {
  beam.lastInput = performance.now();
  aimBeam(e.clientX, e.clientY);
}, { passive: true });
addEventListener("scroll", () => { if (!beam.frame) beam.frame = requestAnimationFrame(paintBeam); }, { passive: true });

/* ---------- Carriles + auto que pasa ---------- */

const road = document.querySelector(".road");
const roadState = { off: 0, lastY: scrollY, speed: 0, last: performance.now() };

function drive(now) {
  const dt = Math.min(64, now - roadState.last);
  roadState.last = now;

  if (!isCalm()) {
    // Las líneas aceleran con la velocidad del scroll.
    const dy = Math.abs(scrollY - roadState.lastY);
    roadState.lastY = scrollY;
    roadState.speed += (dy * 0.9 - roadState.speed) * 0.12;
    roadState.off = (roadState.off + (0.09 + roadState.speed * 0.02) * dt) % 40;
    road.style.setProperty("--lane-off", `${roadState.off.toFixed(2)}px`);

    // Sin cursor (celular o mouse quieto): pasa un auto barriendo los carteles.
    const idle = now - beam.lastInput > (canHover.matches ? 4000 : 1800);
    if (idle) {
      const t = now / 1000;
      const w = innerWidth;
      const h = innerHeight;
      const sweep = (t % 6) / 6; // un auto cada 6 s
      aimBeam(-0.3 * w + sweep * 1.6 * w, h * (0.38 + 0.12 * Math.sin(t * 0.9)));
    }
  }
  requestAnimationFrame(drive);
}
requestAnimationFrame(drive);

/* ---------- Modo calma ---------- */

const calmBtn = document.getElementById("calm");
const calmLabel = document.querySelector("[data-calm-label]");

function setCalm(on) {
  root.classList.toggle("calm-mode", on);
  calmBtn.setAttribute("aria-pressed", String(on));
  calmLabel.textContent = on ? "encendido" : "apagado";
  if (on) aimBeam(innerWidth * 0.5, innerHeight * 0.3);
}
setCalm(store.get("calm") === "1" || reducedMotion.matches);
calmBtn.addEventListener("click", () => {
  const on = calmBtn.getAttribute("aria-pressed") !== "true";
  setCalm(on);
  store.set("calm", on ? "1" : "0");
});

/* ---------- Poste de millas ---------- */

const mile = document.querySelector("[data-mile]");
function updateMile() {
  const max = document.documentElement.scrollHeight - innerHeight;
  const p = max > 0 ? Math.min(1, scrollY / max) : 0;
  mile.textContent = (p * 6).toFixed(1);
}
addEventListener("scroll", updateMile, { passive: true });
addEventListener("resize", updateMile);
updateMile();

/* ---------- Navegación ---------- */

const gantry = document.querySelector(".gantry");
const toggle = document.querySelector(".gantry-toggle");
const links = [...document.querySelectorAll(".exits a")];

function setMenu(open) {
  gantry.classList.toggle("is-open", open);
  toggle.setAttribute("aria-expanded", String(open));
  toggle.querySelector("use").setAttribute("href", open ? "#i-close" : "#i-menu");
}
toggle.addEventListener("click", () => setMenu(toggle.getAttribute("aria-expanded") !== "true"));
links.forEach((a) => a.addEventListener("click", () => setMenu(false)));
addEventListener("keydown", (e) => { if (e.key === "Escape") setMenu(false); });

const sections = links.map((a) => document.querySelector(a.getAttribute("href")));
const navIO = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (!e.isIntersecting) return;
    links.forEach((a) => a.removeAttribute("aria-current"));
    const active = links[sections.indexOf(e.target)];
    if (active) active.setAttribute("aria-current", "true");
  });
}, { rootMargin: "-45% 0px -50% 0px" });
sections.forEach((s) => navIO.observe(s));

/* ---------- Pantalla actual ---------- */

const viewportEl = document.querySelector("[data-viewport]");
const laneSigns = [...document.querySelectorAll(".lane-sign")];
function updateViewport() {
  const w = innerWidth;
  viewportEl.textContent = `${w} × ${innerHeight} px`;
  const bp = w >= 1100 ? "1100" : w >= 720 ? "720" : "0";
  laneSigns.forEach((el) => el.classList.toggle("is-here", el.dataset.bp === bp));
}
addEventListener("resize", updateViewport);
updateViewport();

/* ---------- Tamaño real de los archivos ---------- */

document.querySelectorAll("[data-size]").forEach(async (el) => {
  try {
    const res = await fetch(el.dataset.size, { cache: "no-store" });
    if (!res.ok) throw new Error(res.status);
    const bytes = (await res.blob()).size;
    el.textContent = `${(bytes / 1024).toFixed(1)} KB · leído ahora`;
  } catch {
    el.textContent = "Ábrela desde el servidor para medirlo";
  }
});

/* ---------- QR ---------- */

function resolveUrl() {
  const { hostname, protocol } = location;
  const here = location.href.split("#")[0];
  const privateNet = /^(10\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.)/.test(hostname);
  const configured = !PUBLIC_URL.includes("TU-USUARIO");

  if (hostname.endsWith("github.io")) return { url: here, label: "Dirección pública" };
  if (privateNet) return { url: here, label: "Tu red Wi-Fi (mismo router)" };
  if (configured) return { url: PUBLIC_URL, label: "Dirección pública" };
  if (protocol === "file:") return { url: here, label: "Archivo local: usa iniciar-servidor.bat" };
  return { url: here, label: "Esta dirección" };
}

const { url: shareUrl, label: shareLabel } = resolveUrl();
const qrBox = document.querySelector("[data-qr]");
const qrLink = document.querySelector("[data-qr-link]");
document.querySelector("[data-qr-source]").textContent = shareLabel;
qrLink.href = shareUrl;
qrLink.textContent = shareUrl.replace(/^https?:\/\//, "");

function drawQr() {
  if (typeof qrcode !== "function") {
    qrBox.innerHTML = '<p class="qr-error">No se pudo cargar vendor/qrcode.js</p>';
    return;
  }
  const qr = qrcode(0, "M");
  qr.addData(shareUrl);
  qr.make();
  const n = qr.getModuleCount();
  let d = "";
  for (let r = 0; r < n; r++) {
    for (let c = 0; c < n; c++) if (qr.isDark(r, c)) d += `M${c} ${r}h1v1h-1z`;
  }
  qrBox.innerHTML = `<svg viewBox="0 0 ${n} ${n}" shape-rendering="crispEdges" aria-hidden="true"><path d="${d}" fill="#111210"/></svg>`;
}
drawQr();

const status = document.querySelector("[data-status]");
const copyBtn = document.querySelector("[data-copy-url]");
const shareBtn = document.querySelector("[data-share]");

function flash(btn, text) {
  const label = btn.querySelector("span");
  const icon = btn.querySelector("use");
  const prev = [label.textContent, icon.getAttribute("href")];
  btn.classList.add("is-done");
  label.textContent = text;
  icon.setAttribute("href", "#i-check");
  setTimeout(() => {
    btn.classList.remove("is-done");
    [label.textContent] = prev;
    icon.setAttribute("href", prev[1]);
  }, 2200);
}

copyBtn.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(shareUrl);
    flash(copyBtn, "Copiado");
    status.textContent = "Enlace copiado al portapapeles.";
  } catch {
    status.textContent = "Tu navegador bloqueó el portapapeles. Mantén presionado el enlace para copiarlo.";
  }
});

if (navigator.share) {
  shareBtn.addEventListener("click", async () => {
    try {
      await navigator.share({ title: document.title, text: "Rumbo a Vice City: una página fan de GTA VI", url: shareUrl });
      status.textContent = "";
    } catch (err) {
      if (err.name !== "AbortError") status.textContent = "No se pudo abrir el menú de compartir.";
    }
  });
} else {
  shareBtn.hidden = true;
}
