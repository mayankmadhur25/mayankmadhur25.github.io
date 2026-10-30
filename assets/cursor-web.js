/* Healthcare Pulse: cursor web effect
   Drop-in, no dependencies. Adds a transparent layer that draws a small web of
   dots and lines around the cursor. It stays visible while the cursor is on the page. It never blocks clicks, never changes layout,
   switches off on touch screens and for visitors who prefer reduced motion,
   and follows the site's light and dark themes. */
(function () {
  if (window.__hpCursorWeb) return; window.__hpCursorWeb = true;
  // Cursor: a magnifying glass with a heartbeat line, teal by default and amber over links
  // and buttons. The centre of the lens is the pointing spot. Text fields keep the text cursor.
  if (window.matchMedia && window.matchMedia('(pointer: fine)').matches && !document.getElementById('hp-lens-cursor')) {
    var cs = document.createElement('style'); cs.id = 'hp-lens-cursor';
    cs.textContent =
      'html,body{cursor:url("data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2232%22 height=%2232%22 viewBox=%220 0 32 32%22%3E %3Cg stroke-linecap=%22round%22 stroke-linejoin=%22round%22 fill=%22none%22%3E %3Ccircle cx=%2212%22 cy=%2212%22 r=%229.5%22 stroke=%22#FFFFFF%22 stroke-width=%225%22/%3E %3Cpath d=%22M19 19 L29 29%22 stroke=%22#FFFFFF%22 stroke-width=%227%22/%3E %3Cpath d=%22M19.5 19.5 L28.5 28.5%22 stroke=%22#1B3A4B%22 stroke-width=%224.2%22/%3E %3Ccircle cx=%2212%22 cy=%2212%22 r=%229%22 fill=%22#FFFFFF%22 fill-opacity=%22.92%22 stroke=%22#1B3A4B%22 stroke-width=%222.4%22/%3E %3Cpath d=%22M5 12.5 L8.4 12.5 L10 9.5 L12.3 16 L14.3 7.5 L16 12.5 L19 12.5%22 stroke=%22#0FA3A3%22 stroke-width=%221.9%22/%3E %3C/g%3E %3C/svg%3E") 12 12, auto;}' +
      'a,button,[role="button"],summary,label,select,.related-card{cursor:url("data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2232%22 height=%2232%22 viewBox=%220 0 32 32%22%3E %3Cg stroke-linecap=%22round%22 stroke-linejoin=%22round%22 fill=%22none%22%3E %3Ccircle cx=%2212%22 cy=%2212%22 r=%229.5%22 stroke=%22#FFFFFF%22 stroke-width=%225%22/%3E %3Cpath d=%22M19 19 L29 29%22 stroke=%22#FFFFFF%22 stroke-width=%227%22/%3E %3Cpath d=%22M19.5 19.5 L28.5 28.5%22 stroke=%22#1B3A4B%22 stroke-width=%224.2%22/%3E %3Ccircle cx=%2212%22 cy=%2212%22 r=%229%22 fill=%22#FFFFFF%22 fill-opacity=%22.92%22 stroke=%22#1B3A4B%22 stroke-width=%222.4%22/%3E %3Cpath d=%22M5 12.5 L8.4 12.5 L10 9.5 L12.3 16 L14.3 7.5 L16 12.5 L19 12.5%22 stroke=%22#E08A3C%22 stroke-width=%221.9%22/%3E %3C/g%3E %3C/svg%3E") 12 12, pointer;}' +
      'input,textarea,[contenteditable="true"]{cursor:text;}';
    document.head.appendChild(cs);
  }
  var noMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var finePointer = window.matchMedia && window.matchMedia('(pointer: fine)').matches;
  if (noMotion || !finePointer) return;

  var COLORS = ['#0FA3A3', '#E08A3C', '#2E7CB8', '#0FA3A3', '#5A9FC9'];
  var RADIUS = 260;          // how far the web reaches from the cursor (px)
  var DENSITY = 1 / 5200;    // dots per square pixel of screen
  var cv = document.createElement('canvas');
  cv.setAttribute('aria-hidden', 'true');
  cv.style.cssText = 'position:fixed;inset:0;width:100vw;height:100vh;pointer-events:none;z-index:-1;';
  document.body.appendChild(cv);
  var ctx = cv.getContext('2d'), W, H, dpr, dots = [];
  var mouse = { x: -9999, y: -9999 }, hub = { x: -9999, y: -9999 }, energy = 0, inside = false, running = false;

  function isDark() {
    var t = document.documentElement.getAttribute('data-theme');
    if (t) return t === 'dark';
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  }
  function size() {
    dpr = Math.min(window.devicePixelRatio || 1, 2); W = window.innerWidth; H = window.innerHeight;
    cv.width = W * dpr; cv.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    var n = Math.round(W * H * DENSITY); dots = [];
    for (var i = 0; i < n; i++) dots.push({ x: Math.random() * W, y: Math.random() * H, r: Math.random() * 1.8 + 2.0,
      c: COLORS[i % COLORS.length], ph: Math.random() * 6.28, sp: 0.5 + Math.random() });
  }
  function frame(now) {
    var targetEnergy = inside ? 1 : 0;
    energy += (targetEnergy - energy) * 0.06;
    hub.x += (mouse.x - hub.x) * 0.18; hub.y += (mouse.y - hub.y) * 0.18;
    ctx.clearRect(0, 0, W, H);
    if (energy > 0.01) {
      var dark = isDark(), lineCol = dark ? '160,220,220' : '15,110,120';
      for (var i = 0; i < dots.length; i++) {
        var d = dots[i];
        var x = d.x + Math.sin(now / (1800 * d.sp) + d.ph) * 4, y = d.y + Math.cos(now / (2100 * d.sp) + d.ph) * 4;
        var dx = x - hub.x, dy = y - hub.y, dist = Math.sqrt(dx * dx + dy * dy);
        if (dist > RADIUS) continue;
        var k = (1 - dist / RADIUS) * energy;
        ctx.strokeStyle = 'rgba(' + lineCol + ',' + (0.15 + 0.7 * k).toFixed(3) + ')';
        ctx.lineWidth = 0.9 + 1.1 * k;
        ctx.beginPath(); ctx.moveTo(hub.x, hub.y); ctx.lineTo(x, y); ctx.stroke();
        ctx.globalAlpha = Math.min(1, 0.65 + k);
        ctx.fillStyle = d.c; ctx.beginPath(); ctx.arc(x, y, d.r * (0.7 + 0.5 * k), 0, 6.283); ctx.fill();
        ctx.globalAlpha = 1;
      }
      ctx.fillStyle = dark ? 'rgba(232,241,242,' + (0.9 * energy) + ')' : 'rgba(27,58,75,' + (0.75 * energy) + ')';
      ctx.beginPath(); ctx.arc(hub.x, hub.y, 4.5, 0, 6.283); ctx.fill();
    }
    if (energy > 0.01 || inside) requestAnimationFrame(frame); else { running = false; ctx.clearRect(0, 0, W, H); }
  }
  function wake() { if (!running) { running = true; requestAnimationFrame(frame); } }
  window.addEventListener('mousemove', function (e) {
    if (hub.x < -1000) { hub.x = e.clientX; hub.y = e.clientY; }
    mouse.x = e.clientX; mouse.y = e.clientY; inside = true; wake();
  }, { passive: true });
  document.documentElement.addEventListener('mouseleave', function () { inside = false; });
  window.addEventListener('blur', function () { inside = false; });
  document.addEventListener('visibilitychange', function () { if (document.hidden) inside = false; });
  window.addEventListener('resize', size);
  size();
})();
