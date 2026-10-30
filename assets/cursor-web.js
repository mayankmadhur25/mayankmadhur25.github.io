/* Healthcare Pulse: cursor web effect
   Drop-in, no dependencies. Adds a transparent layer that draws a small web of
   dots and lines around the cursor. It never blocks clicks, never changes layout,
   switches off on touch screens and for visitors who prefer reduced motion,
   and follows the site's light and dark themes. */
(function () {
  if (window.__hpCursorWeb) return; window.__hpCursorWeb = true;
  var noMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var finePointer = window.matchMedia && window.matchMedia('(pointer: fine)').matches;
  if (noMotion || !finePointer) return;

  var COLORS = ['#0FA3A3', '#E08A3C', '#2E7CB8', '#0FA3A3', '#5A9FC9'];
  var RADIUS = 230;          // how far the web reaches from the cursor (px)
  var DENSITY = 1 / 7000;    // dots per square pixel of screen
  var cv = document.createElement('canvas');
  cv.setAttribute('aria-hidden', 'true');
  cv.style.cssText = 'position:fixed;inset:0;width:100vw;height:100vh;pointer-events:none;z-index:-1;';
  document.body.appendChild(cv);
  var ctx = cv.getContext('2d'), W, H, dpr, dots = [];
  var mouse = { x: -9999, y: -9999 }, hub = { x: -9999, y: -9999 }, energy = 0, lastMove = 0, running = false;

  function isDark() {
    var t = document.documentElement.getAttribute('data-theme');
    if (t) return t === 'dark';
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  }
  function size() {
    dpr = Math.min(window.devicePixelRatio || 1, 2); W = window.innerWidth; H = window.innerHeight;
    cv.width = W * dpr; cv.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    var n = Math.round(W * H * DENSITY); dots = [];
    for (var i = 0; i < n; i++) dots.push({ x: Math.random() * W, y: Math.random() * H, r: Math.random() * 1.6 + 1.2,
      c: COLORS[i % COLORS.length], ph: Math.random() * 6.28, sp: 0.5 + Math.random() });
  }
  function frame(now) {
    var idle = now - lastMove;
    var targetEnergy = idle < 900 ? 1 : 0;
    energy += (targetEnergy - energy) * 0.06;
    hub.x += (mouse.x - hub.x) * 0.18; hub.y += (mouse.y - hub.y) * 0.18;
    ctx.clearRect(0, 0, W, H);
    if (energy > 0.01) {
      var dark = isDark(), lineCol = dark ? '232,241,242' : '27,58,75';
      for (var i = 0; i < dots.length; i++) {
        var d = dots[i];
        var x = d.x + Math.sin(now / (1800 * d.sp) + d.ph) * 4, y = d.y + Math.cos(now / (2100 * d.sp) + d.ph) * 4;
        var dx = x - hub.x, dy = y - hub.y, dist = Math.sqrt(dx * dx + dy * dy);
        if (dist > RADIUS) continue;
        var k = (1 - dist / RADIUS) * energy;
        ctx.strokeStyle = 'rgba(' + lineCol + ',' + (0.5 * k).toFixed(3) + ')';
        ctx.lineWidth = 0.6 + 0.6 * k;
        ctx.beginPath(); ctx.moveTo(hub.x, hub.y); ctx.lineTo(x, y); ctx.stroke();
        ctx.globalAlpha = Math.min(1, 0.35 + k);
        ctx.fillStyle = d.c; ctx.beginPath(); ctx.arc(x, y, d.r * (0.7 + 0.5 * k), 0, 6.283); ctx.fill();
        ctx.globalAlpha = 1;
      }
      ctx.fillStyle = dark ? 'rgba(232,241,242,' + (0.9 * energy) + ')' : 'rgba(27,58,75,' + (0.75 * energy) + ')';
      ctx.beginPath(); ctx.arc(hub.x, hub.y, 3.2, 0, 6.283); ctx.fill();
    }
    if (energy > 0.01 || idle < 900) requestAnimationFrame(frame); else { running = false; ctx.clearRect(0, 0, W, H); }
  }
  function wake() { if (!running) { running = true; requestAnimationFrame(frame); } }
  window.addEventListener('mousemove', function (e) {
    if (hub.x < -1000) { hub.x = e.clientX; hub.y = e.clientY; }
    mouse.x = e.clientX; mouse.y = e.clientY; lastMove = performance.now(); wake();
  }, { passive: true });
  document.addEventListener('mouseleave', function () { lastMove = 0; });
  window.addEventListener('resize', size);
  size();
})();
