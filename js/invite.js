// invite

(() => {
  const $ = s => document.querySelector(s);
  const panel = $("#info-panel"), box = $("#info-panel-content"), tip = $("#examine"), tipName = $("#examine-name");
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;" }[c]));
  const ITEMS = { calendar:"DATE / TIME / LOCATION", closet:"DRESS CODE", typewriter:"RSVP", documents:"FOOD / CONTRIBUTIONS" };
  const KEY = "halloween-found";
  const load = (k, d) => { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch (e) { return d; } };
  const save = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} };
  let found = load(KEY, []).filter(id => id in ITEMS), last = null;   // old id fix

  const toast = $("#toast"); let pending = false, toastTimer;
function celebrate() {
  toast.hidden = false;
  if (window.Sound) Sound.complete();
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.hidden = true, 5000);
}
toast.addEventListener("click", () => toast.hidden = true);   // dismiss on tzp

  function hud() {

    const p = n => String(n).padStart(2, "0");
  const el = document.getElementById("hud-count");
  if (!el) return console.warn("[hud] #hud-count not found in invite.html");
  el.textContent = p(found.length) + " / " + p(Object.keys(ITEMS).length);
  document.querySelectorAll(".hot").forEach(h => h.classList.toggle("found", found.includes(h.dataset.id)));
    const P = {
  calendar: () => `<h2 id="ip-title">DATE / TIME / LOCATION</h2>
    <p class="big">${esc(PARTY_CONFIG.date).toUpperCase()}</p>
    <p class="dim">${new Date(PARTY_CONFIG.date + " 12:00").toLocaleDateString("en-US",{weekday:"long"}).toUpperCase()} · <span id="cd"></span></p>
    <p class="big">${esc(PARTY_CONFIG.startTime)} — ${esc(PARTY_CONFIG.endTime)}</p>
    <p class="big">${esc(PARTY_CONFIG.location)}</p>
    ${link(calUrl(), "ADD TO CALENDAR")}${link("https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(PARTY_CONFIG.location), "OPEN MAP")}`,
  closet: () => `<h2 id="ip-title">DRESS CODE</h2><p class="big">${esc(PARTY_CONFIG.dressCode)}</p><p class="dim">OR AT LEAST LOOK SUSPICIOUS.</p>`,
  typewriter: () => `<h2 id="ip-title">RSVP</h2><p class="big">CONFIRM YOUR PRESENCE.</p>${link(PARTY_CONFIG.googleFormUrl, "SAVE YOUR SPOT")}`,
  documents: () => `<h2 id="ip-title">WHAT IS EVERYONE BRINGING?</h2><div id="gl" class="dim">LOADING...</div>${link(PARTY_CONFIG.googleFormUrl, "+ ADD WHAT I'M BRINGING")}`,
  chest: () => `<h2 id="ip-title">INVENTORY</h2><ul class="inv">${Object.entries(ITEMS).map(([k, v]) => found.includes(k) ? `<li class="got">[✓] ${v}</li>` : `<li class="no">[ ] ${v}</li>`).join("")}</ul><p class="big">${found.length === Object.keys(ITEMS).length ? "INVITATION COMPLETE" : "EXAMINE THE ROOM."}</p>`
};
  }
  function calUrl() {
    const d = new Date(PARTY_CONFIG.date + " 12:00"), p = n => String(n).padStart(2, "0");
    const f = (day, t) => day.getFullYear() + p(day.getMonth() + 1) + p(day.getDate()) + "T" + t.replace(":", "") + "00";
    const end = new Date(d); if (PARTY_CONFIG.endTime <= PARTY_CONFIG.startTime) end.setDate(end.getDate() + 1);
    return "https://calendar.google.com/calendar/render?action=TEMPLATE&text=" + encodeURIComponent(PARTY_CONFIG.title) +
      "&dates=" + f(d, PARTY_CONFIG.startTime) + "/" + f(end, PARTY_CONFIG.endTime) +
      "&location=" + encodeURIComponent(PARTY_CONFIG.location) + "&details=" + encodeURIComponent(PARTY_CONFIG.description);
  }
  const link = (href, label) => `<a class="btn" href="${esc(href)}" target="_blank" rel="noopener">[ ${label} ]</a>`;
  function parseCSV(t) {
    const rows = []; let r = [], c = "", q = false;
    for (let i = 0; i < t.length; i++) { const ch = t[i];
      if (q) { if (ch === '"') { if (t[i+1] === '"') { c += '"'; i++; } else q = false; } else c += ch; }
      else if (ch === '"') q = true; else if (ch === ",") { r.push(c); c = ""; }
      else if (ch === "\n" || ch === "\r") { if (ch === "\r" && t[i+1] === "\n") i++; r.push(c); rows.push(r); r = []; c = ""; }
      else c += ch; }
    if (c || r.length) { r.push(c); rows.push(r); } return rows;
  }
  async function guests() {
    try {
      const res = await fetch(PARTY_CONFIG.googleSheetCsvUrl); if (!res.ok) throw 0;
      const rows = parseCSV(await res.text()), h = rows.shift().map(x => x.trim());
      const ni = h.indexOf(CSV_COLUMNS.name), bi = h.indexOf(CSV_COLUMNS.bringing); if (ni < 0 || bi < 0) throw 0;
      return { list: rows.filter(r => r[ni]).map(r => ({ name: r[ni], bringing: r[bi] || "" })), ok: true };
    } catch (e) { return { list: MANUAL_GUESTS, ok: false }; }
  }
  const P = {
    calendar: () => `<h2 id="ip-title">DATE</h2><p class="big">${esc(PARTY_CONFIG.date).toUpperCase()}</p><p class="dim">${new Date(PARTY_CONFIG.date + " 12:00").toLocaleDateString("en-US",{weekday:"long"}).toUpperCase()}</p><p class="dim" id="cd"></p>${link(calUrl(), "ADD TO CALENDAR")}`,
    clock: () => `<h2 id="ip-title">TIME</h2><p class="big">${esc(PARTY_CONFIG.startTime)} — ${esc(PARTY_CONFIG.endTime)}</p><p class="dim">DO NOT ARRIVE AFTER THE LAST CHIME.</p>`,
    door: () => `<h2 id="ip-title">LOCATION</h2><p class="big">${esc(PARTY_CONFIG.location)}</p>${link("https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(PARTY_CONFIG.location), "OPEN MAP")}`,
    closet: () => `<h2 id="ip-title">DRESS CODE</h2><p class="big">${esc(PARTY_CONFIG.dressCode)}</p><p class="dim">OR AT LEAST LOOK SUSPICIOUS.</p>`,
    typewriter: () => `<h2 id="ip-title">RSVP</h2><p class="big">CONFIRM YOUR PRESENCE.</p>${link(PARTY_CONFIG.googleFormUrl, "SAVE YOUR SPOT")}`,
    documents: () => `<h2 id="ip-title">WHAT IS EVERYONE BRINGING?</h2><div id="gl" class="dim">LOADING...</div>${link(PARTY_CONFIG.googleFormUrl, "+ ADD WHAT I'M BRINGING")}`,
    chest: () => `<h2 id="ip-title">INVENTORY</h2><ul class="inv">${Object.entries(ITEMS).map(([k, v]) => found.includes(k) ? `<li class="got">[✓] ${v}</li>` : `<li class="no">[ ] ${v}</li>`).join("")}</ul><p class="big">${found.length === 6 ? "INVITATION COMPLETE" : "EXAMINE THE ROOM."}</p>`
  };
  function open(id, el) {
    last = el; box.innerHTML = P[id](); panel.hidden = false; tip.hidden = true;
    document.body.classList.add("paused");
    if (ITEMS[id] && !found.includes(id)) {
  found.push(id); save(KEY, found); hud();
  if (found.length === Object.keys(ITEMS).length) pending = true;   // last object
}
    if (id === "calendar") { const days = Math.ceil((new Date(PARTY_CONFIG.date + " " + PARTY_CONFIG.startTime) - Date.now()) / 864e5); $("#cd").textContent = days > 0 ? days + " DAYS REMAIN" : "THE NIGHT IS HERE."; }
    if (id === "documents") guests().then(({ list, ok }) => { const g = $("#gl"); if (!g) return;
      g.innerHTML = (ok ? "" : "<p>SIGNAL LOST. SHOWING SAVED LIST.</p>") + `<table><tr><th>NAME</th><th>BRINGING</th></tr>${list.map(x => `<tr><td>${esc(x.name)}</td><td>${esc(x.bringing)}</td></tr>`).join("")}</table>`; });
    panel.querySelector(".info-panel__close").focus();
  }
  function close() {
  panel.hidden = true; document.body.classList.remove("paused"); if (last) last.focus();
  if (pending) { pending = false; celebrate(); }
}
  panel.addEventListener("click", e => { if (e.target === panel || e.target.closest(".info-panel__close")) close(); });
  addEventListener("keydown", e => { if (e.key === "Escape" && !panel.hidden) close(); });
  document.querySelectorAll(".hot").forEach(h => {
    h.addEventListener("click", () => open(h.dataset.id, h));
    const show = e => { const r = h.getBoundingClientRect(); tipName.textContent = h.dataset.name; tip.hidden = false;
      tip.style.left = Math.min((e.clientX || r.left + r.width / 2) + 16, innerWidth - 170) + "px"; tip.style.top = Math.min((e.clientY || r.top) + 16, innerHeight - 60) + "px"; };
    h.addEventListener("mousemove", show); h.addEventListener("focus", () => show({}));
    h.addEventListener("mouseleave", () => tip.hidden = true); h.addEventListener("blur", () => tip.hidden = true);
  });
  hud();

  document.querySelectorAll(".hot").forEach(h =>
  h.addEventListener("keydown", e => {
    if (e.key === "Enter" || e.key === " ") { e.preventDefault(); h.dispatchEvent(new Event("click")); }
  })
);
})();


