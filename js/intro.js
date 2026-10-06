/* =========================================================
   🎃 INTRO CUSTOMIZATION
   ========================================================= */
const INTRO_CONFIG = {
  redirectDelay: 4500,        // ms between click and going to invite.html (match your door video length)
  target: "invite.html",      // next page
  shake: false                 // subtle camera shake (auto-off with reduced motion)
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
    // Playback starts from the user's click, so autoplay rules are respected.
    try { const p = video.play(); if (p && p.catch) p.catch(() => {}); } catch (e) {}
    setTimeout(() => { location.href = INTRO_CONFIG.target; }, INTRO_CONFIG.redirectDelay); // continues even if video fails
  });
})();
