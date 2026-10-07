// for mobile
(() => {
  const world = document.getElementById("world");
  const bl = document.getElementById("pan-left"), br = document.getElementById("pan-right");
  const panel = document.getElementById("info-panel");
  if (!world || !bl || !br) return;

  const mq = matchMedia("(max-width: 900px), (pointer: coarse)");
  const RATIO = 16 / 9, HOLD_MS = 250;
  let frac = 0.5, cur = 0, target = 0, max = 0, active = false;
  let dir = 0, heldSince = 0, raf = 0, last = 0;
  const clamp = v => Math.max(0, Math.min(max, v));

  function apply() {
    world.style.transform = `translate3d(${-cur}px,0,0)`;
    bl.disabled = target <= 1;
    br.disabled = target >= max - 1;
  }

  function layout() {
    const vw = innerWidth, w = innerHeight * RATIO;
    active = mq.matches && w > vw + 1;
    document.body.classList.toggle("pan", active);
    if (!active) { world.style.width = ""; world.style.transform = ""; max = 0; return; }
    max = w - vw;
    world.style.width = w + "px";
    cur = target = frac * max;      
    apply();
  }

  function tick(t) {
    const dt = Math.min(t - last, 50) / 1000; last = t;
    if (dir && t - heldSince > HOLD_MS) {         
      target = clamp(target + dir * innerHeight * 1.2 * dt);
      if (target <= 0 || target >= max) dir = 0;
    }
    cur += (target - cur) * Math.min(1, dt * 10);  
    if (Math.abs(target - cur) < 0.5) cur = target;
    frac = max ? target / max : 0.5;
    apply();
    raf = (dir || cur !== target) ? requestAnimationFrame(tick) : 0;
  }
  const kick = () => { if (!raf) { last = performance.now(); raf = requestAnimationFrame(tick); } };

  function press(d) {         
    dir = d; heldSince = performance.now();
    target = clamp(target + d * innerWidth * 0.45);
    kick();
  }
  const release = () => { dir = 0; };

  [[bl, -1], [br, 1]].forEach(([b, d]) => {
    b.addEventListener("pointerdown", e => { e.preventDefault(); press(d); });
    b.addEventListener("click", e => { if (e.detail === 0) { press(d); release(); } }); // keyboard
    b.addEventListener("contextmenu", e => e.preventDefault());
  });
  addEventListener("pointerup", release);
  addEventListener("pointercancel", release);

  addEventListener("keydown", e => {
    if (!active || !panel.hidden || e.repeat) return;
    if (e.key === "ArrowLeft") press(-1);
    if (e.key === "ArrowRight") press(1);
  });
  addEventListener("keyup", e => { if (e.key === "ArrowLeft" || e.key === "ArrowRight") release(); });

  world.addEventListener("focusin", e => {
    if (!active) return;
    const r = e.target.getBoundingClientRect();
    if (r.left < 0 || r.right > innerWidth) {
      target = clamp(cur + (r.left + r.width / 2) - innerWidth / 2); kick();
    }
  });

  addEventListener("resize", layout);
  addEventListener("orientationchange", layout);
  mq.addEventListener ? mq.addEventListener("change", layout) : mq.addListener(layout);
  layout();
})();