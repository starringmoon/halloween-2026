/* js/video.js — play room-intro once, then switch to the looping room-video */
(() => {
  const introV = document.getElementById("room-intro");
  const loopV = document.getElementById("room-video");
  const curtain = document.getElementById("curtain");
  if (!introV || !loopV) return console.warn("[video] missing #room-intro or #room-video");

  let lifted = false;
  const liftOnce = () => { if (!lifted) { lifted = true; if (curtain) curtain.style.opacity = "0"; } };
  if ("requestVideoFrameCallback" in introV) {
    const wait = (now, meta) => meta.mediaTime > 0.1 ? liftOnce() : introV.requestVideoFrameCallback(wait);
    introV.requestVideoFrameCallback(wait);
  } else introV.addEventListener("timeupdate", () => { if (introV.currentTime > 0.1) liftOnce(); });
  setTimeout(liftOnce, 3000);

  let switched = false;
 function startLoop() {
  if (switched) return; switched = true;
  liftOnce(); loopV.currentTime = 0;
  document.body.classList.add("room-ready");      // hotspots appear now
  loopV.play().catch(e => console.warn("[video] loop failed:", e));
  introV.style.display = "none";
}
  introV.addEventListener("ended", startLoop);
  introV.addEventListener("error", startLoop);
  introV.addEventListener("timeupdate", () => {
    if (introV.duration && introV.currentTime >= introV.duration - 0.05) startLoop();
  });
  introV.play().catch(() => {});
})();
