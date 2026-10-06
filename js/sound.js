/* js/sound.js — music, hover sound, click sounds, SOUND button */
(() => {
  const KEY = "halloween-sound";
  let on = true;
  try { on = JSON.parse(localStorage.getItem(KEY)) ?? true; } catch (e) {}
  console.log("[sound] preference:", on ? "ON" : "OFF");

  const make = (src, vol, loop = false) => {
    const a = new Audio(src); a.volume = vol; a.loop = loop; a.preload = "auto";
    a.addEventListener("error", () => console.error("[sound] cannot load file:", src));
    return a;
  };
  const music = make(SOUNDS.music, .25, true);
  const hover = make(SOUNDS.hover, .3);

  const complete = make(SOUNDS.complete, .5);
  window.Sound = { complete: () => play(complete) };   // lets invite.js trigger it
  
  
  const click = {};
  Object.entries(SOUNDS.click).forEach(([id, src]) => click[id] = make(src, .5));

  const play = a => {
    if (!on || !a) return;
    a.currentTime = 0;
    a.play().catch(e => console.warn("[sound] blocked:", a.src, e.name));
  };

  // Hover (mouse only) + click sounds on every hotspot
  document.querySelectorAll(".hot").forEach(h => {
    h.addEventListener("pointerenter", e => { if (e.pointerType === "mouse") play(hover); });
    h.addEventListener("click", () => play(click[h.dataset.id]));
  });

  // SOUND button
  const btn = document.getElementById("sound");
  const render = () => { btn.textContent = "SOUND: " + (on ? "ON" : "OFF"); btn.setAttribute("aria-pressed", on); };
  btn.addEventListener("click", () => {
    on = !on; try { localStorage.setItem(KEY, JSON.stringify(on)); } catch (e) {}
    render();
    if (on) music.play().catch(() => {}); else music.pause();
  });
  render();

  // Music: try on arrival, else start on the first click/tap/key
  if (on) music.play().catch(() => {
    const go = () => { if (on) music.play().catch(() => {}); };
    ["pointerdown", "keydown", "touchstart"].forEach(t => addEventListener(t, go, { once: true }));
  });
})();
