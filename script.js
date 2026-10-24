// Vice City de noche: intro VI, menú, cuenta regresiva, datos en vivo y QR.

// Dirección pública en GitHub Pages. publicar-github.bat la reemplaza sola.
const PUBLIC_URL = "https://TU-USUARIO.github.io/gta6-leonida/";
const LAUNCH = new Date(2026, 10, 19, 0, 0, 0); // 19 nov 2026, hora local

const root = document.documentElement;
const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");

const store = {
  get(key) { try { return localStorage.getItem(key); } catch { return null; } },
  set(key, value) { try { localStorage.setItem(key, value); } catch { /* sin almacenamiento */ } },
};

const isCalm = () => reducedMotion.matches || root.classList.contains("calm-mode");
const clamp01 = (n) => Math.min(1, Math.max(0, n));
const pad = (n) => String(n).padStart(2, "0");

/* ---------- Cuenta regresiva ---------- */

const cd = {
  days: document.querySelectorAll('[data-cd="days"]'),
  clock: document.querySelectorAll('[data-cd="clock"]'),
  d: document.querySelector('[data-cd="d"]'),
  h: document.querySelector('[data-cd="h"]'),
  m: document.querySelector('[data-cd="m"]'),
  s: document.querySelector('[data-cd="s"]'),
};

function setNum(el, value) {
  if (el.textContent === value) return;
  el.textContent = value;
  if (isCalm()) return;
  el.classList.remove("tick");
  void el.offsetWidth; // reinicia la animación
  el.classList.add("tick");
}

function tickCountdown() {
  const total = Math.max(0, Math.floor((LAUNCH - Date.now()) / 1000));
  const d = Math.floor(total / 86400);
  const h = Math.floor((total % 86400) / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;

  cd.days.forEach((el) => { el.textContent = d; });
  cd.clock.forEach((el) => { el.textContent = `${pad(h)}:${pad(m)}:${pad(s)}`; });
  setNum(cd.d, pad(d));
  setNum(cd.h, pad(h));
  setNum(cd.m, pad(m));
  setNum(cd.s, pad(s));
}
tickCountdown();
setInterval(tickCountdown, 1000);

/* ---------- Intro: entrar por las letras VI ---------- */

const intro = document.querySelector(".intro");
const stage = document.querySelector(".intro-stage");
const maskSvg = document.querySelector(".intro-mask");
const letterText = maskSvg.querySelector(".mask-letters text");

// El zoom apunta al centro del trazo de la "I" para que al final se vea la foto, no la noche.
function aimAtI() {
  try {
    const box = letterText.getExtentOfChar(1);
    root.style.setProperty("--ox", `${box.x + box.width / 2}px`);
    root.style.setProperty("--oy", `${box.y + box.height * 0.55}px`);
  } catch { /* fuente aún sin cargar */ }
}

function paintIntro() {
  if (!root.classList.contains("js-intro")) return;
  const range = intro.offsetHeight - stage.offsetHeight;
  const p = clamp01(-intro.getBoundingClientRect().top / range);
  const zoom = clamp01(p / 0.72);
  const style = stage.style;

  style.setProperty("--s", Math.pow(70, zoom * zoom).toFixed(3));
  style.setProperty("--img-s", (1.3 - 0.3 * zoom).toFixed(3));
  style.setProperty("--outline", clamp01(1 - zoom * 3).toFixed(3));
  style.setProperty("--cue", clamp01(1 - p * 6).toFixed(3));
  style.setProperty("--night-o", clamp01(1 - (zoom - 0.82) / 0.18).toFixed(3));
  const copy = clamp01((p - 0.7) / 0.22);
  style.setProperty("--copy", copy.toFixed(3));
  style.setProperty("--copy-vis", copy > 0 ? "visible" : "hidden");
}

function setupIntro() {
  const on = !isCalm();
  root.classList.toggle("js-intro", on);
  if (!on) {
    ["--s", "--img-s", "--outline", "--cue", "--night-o", "--copy", "--copy-vis"].forEach((v) => stage.style.removeProperty(v));
    return;
  }
  aimAtI();
  paintIntro();
}

/* ---------- Scroll: barra de progreso, nav y parallax ---------- */

const nav = document.querySelector(".nav");
const bar = document.querySelector(".progress span");
let frame = 0;

function onScroll() {
  frame = 0;
  const max = root.scrollHeight - innerHeight;
  bar.style.setProperty("--p", max > 0 ? (scrollY / max).toFixed(4) : 0);
  nav.classList.toggle("is-scrolled", scrollY > 40);
  paintIntro();
}
addEventListener("scroll", () => { if (!frame) frame = requestAnimationFrame(onScroll); }, { passive: true });
addEventListener("resize", () => { aimAtI(); onScroll(); });
document.fonts?.ready.then(() => { aimAtI(); paintIntro(); });

/* ---------- Menú ---------- */

const menu = document.getElementById("menu");
const menuBtn = document.querySelector(".menu-btn");
const menuLinks = [...menu.querySelectorAll("a")];
const menuImgs = [...menu.querySelectorAll(".menu-bg img")];
menuLinks.forEach((a, i) => a.style.setProperty("--i", i));

function previewMenu(key) {
  menuImgs.forEach((img) => img.classList.toggle("is-on", img.dataset.for === key));
}

function setMenu(open) {
  menu.classList.toggle("is-open", open);
  menuBtn.setAttribute("aria-expanded", String(open));
  menuBtn.querySelector(".menu-label").textContent = open ? "Cerrar" : "Menú";
  document.body.style.overflow = open ? "hidden" : "";
  document.querySelector("main").inert = open;
  if (open) {
    previewMenu(menuLinks[0].dataset.img);
    setTimeout(() => menuLinks[0].focus({ preventScroll: true }), 350);
  }
}
menuBtn.addEventListener("click", () => setMenu(menuBtn.getAttribute("aria-expanded") !== "true"));
menuLinks.forEach((a) => {
  a.addEventListener("click", () => setMenu(false));
  a.addEventListener("pointerenter", () => previewMenu(a.dataset.img));
  a.addEventListener("focus", () => previewMenu(a.dataset.img));
});
addEventListener("keydown", (e) => {
  if (e.key === "Escape" && menu.classList.contains("is-open")) {
    setMenu(false);
    menuBtn.focus();
  }
});

/* ---------- Luz que sigue al cursor en los lugares ---------- */

document.querySelectorAll("[data-spot]").forEach((card) => {
  card.addEventListener("pointermove", (e) => {
    const r = card.getBoundingClientRect();
    card.style.setProperty("--mx", `${e.clientX - r.left}px`);
    card.style.setProperty("--my", `${e.clientY - r.top}px`);
  });
});

/* ---------- Modo calma ---------- */

const calmBtn = document.getElementById("calm");
const calmLabel = document.querySelector("[data-calm-label]");

function setCalm(on) {
  root.classList.toggle("calm-mode", on);
  calmBtn.setAttribute("aria-pressed", String(on));
  calmLabel.textContent = on ? "encendido" : "apagado";
  setupIntro();
}
setCalm(store.get("calm") === "1" || reducedMotion.matches);
calmBtn.addEventListener("click", () => {
  const on = calmBtn.getAttribute("aria-pressed") !== "true";
  setCalm(on);
  store.set("calm", on ? "1" : "0");
});
onScroll();

/* ---------- Datos en vivo ---------- */

const viewportEl = document.querySelector("[data-viewport]");
function updateViewport() { viewportEl.textContent = `${innerWidth} × ${innerHeight} px`; }
addEventListener("resize", updateViewport);
updateViewport();

async function sizeOf(path) {
  const res = await fetch(path, { cache: "no-store" });
  if (!res.ok) throw new Error(res.status);
  return (await res.blob()).size;
}
const kb = (bytes) => `${(bytes / 1024).toFixed(1)} KB`;

(async () => {
  const sizesEl = document.querySelector("[data-sizes]");
  const imgsEl = document.querySelector("[data-imgs]");
  try {
    const files = ["index.html", "style.css", "script.js"];
    const sizes = await Promise.all(files.map(sizeOf));
    sizesEl.textContent = files.map((f, i) => `${f} ${kb(sizes[i])}`).join(" · ");
  } catch {
    sizesEl.textContent = "Ábrela desde el servidor para medir los archivos.";
  }
  try {
    const imgs = ["hero-2400", "hero-1400", "hero-mobile", "ocean-drive", "keys", "grassrivers", "beach", "duo"].map((n) => `img/${n}.webp`);
    const total = (await Promise.all(imgs.map(sizeOf))).reduce((a, b) => a + b, 0);
    imgsEl.textContent = `${imgs.length} archivos WebP, ${kb(total)} en total`;
  } catch {
    imgsEl.textContent = "Ábrela desde el servidor para medir las imágenes.";
  }
})();

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
  qrBox.innerHTML = `<svg viewBox="0 0 ${n} ${n}" shape-rendering="crispEdges" aria-hidden="true"><path d="${d}" fill="#07060c"/></svg>`;
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
      await navigator.share({ title: document.title, text: "Vice City de noche: una página fan de GTA VI", url: shareUrl });
      status.textContent = "";
    } catch (err) {
      if (err.name !== "AbortError") status.textContent = "No se pudo abrir el menú de compartir.";
    }
  });
} else {
  shareBtn.hidden = true;
}
