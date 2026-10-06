/* js/calibrate.js — only active at invite.html?calibrate */
(() => {
  if (!location.search.includes("calibrate")) return;
  const svgEl = document.getElementById("spots");
  const vb = svgEl && svgEl.getAttribute("viewBox");
  let W = 1920, H = 1080;
  if (vb) { const a = vb.split(/[\s,]+/).map(Number); W = a[2]; H = a[3]; }

  const NS = "http://www.w3.org/2000/svg";
  const o = document.createElementNS(NS, "svg");
  o.setAttribute("viewBox", `0 0 ${W} ${H}`);
  o.setAttribute("preserveAspectRatio", "xMidYMid slice");
  o.style.cssText = "position:fixed;inset:0;width:100%;height:100%;z-index:50;pointer-events:none";
  const poly = document.createElementNS(NS, "polygon");
  poly.setAttribute("fill", "rgba(255,0,0,.25)"); poly.setAttribute("stroke", "red"); poly.setAttribute("stroke-width", "2");
  const dots = document.createElementNS(NS, "g");
  o.append(poly, dots); document.body.appendChild(o);

  const box = document.createElement("pre");
  box.style.cssText = "position:fixed;left:8px;bottom:8px;z-index:60;margin:0;padding:8px;background:#000;color:#0f0;font:12px monospace;max-width:90vw;white-space:pre-wrap";
  document.body.appendChild(box);

  let pts = [], done = [];
  const toVideo = (cx, cy) => {
    const r = o.getBoundingClientRect(), s = Math.max(r.width / W, r.height / H);
    const ox = (r.width - W * s) / 2, oy = (r.height - H * s) / 2;
    return [Math.round((cx - r.left - ox) / s), Math.round((cy - r.top - oy) / s)];
  };
  const str = p => 'points="' + p.map(q => q.join(",")).join(" ") + '"';
  const draw = () => {
    poly.setAttribute("points", pts.map(p => p.join(",")).join(" "));
    dots.innerHTML = pts.map(p => `<circle cx="${p[0]}" cy="${p[1]}" r="6" fill="yellow"/>`).join("");
    box.textContent = "CALIBRATE (" + W + "x" + H + ")  click corners | Z undo | N next shape | C copy\n\n" +
      done.map((d, i) => "shape " + (i + 1) + ": " + str(d)).join("\n") + (pts.length ? "\ncurrent: " + str(pts) : "");
  };
  document.addEventListener("click", e => {
    e.preventDefault(); e.stopPropagation();           // stop hotspots from opening panels
    pts.push(toVideo(e.clientX, e.clientY)); draw(); console.log(str(pts));
  }, true);
  addEventListener("keydown", e => {
    const k = e.key.toLowerCase();
    if (k === "z") pts.pop();
    if (k === "n" && pts.length) { done.push(pts); pts = []; }
    if (k === "c") navigator.clipboard.writeText(str(pts.length ? pts : done[done.length - 1] || [])).catch(() => {});
    draw();
  });
  draw();
})();