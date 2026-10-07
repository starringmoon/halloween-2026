// only intro
const INTRO_CONFIG = {
  redirectDelay: 4500,
  target: "invite.html",
  shake: false 
};
(() => {
  const video = document.getElementById("intro-video");
  const btn = document.getElementById("open-door");
  const calm = matchMedia("(prefers-reduced-motion: reduce)").matches;
  let going = false;
  btn.addEventListener("click", () => {
    if (going) return; going = true; btn.disabled = true;
    document.body.classList.add("leaving");
    if (!calm) {
      if (INTRO_CONFIG.shake) video.style.animation = "shake .4s 3";
    }

    // playback from click
    try { const p = video.play(); if (p && p.catch) p.catch(() => {}); } catch (e) {}
    setTimeout(() => { location.href = INTRO_CONFIG.target; }, INTRO_CONFIG.redirectDelay); // fallback
  });
})();
