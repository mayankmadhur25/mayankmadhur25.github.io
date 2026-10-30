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
      'html,body{cursor:url("data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2232%22%20height%3D%2232%22%20viewBox%3D%220%200%2032%2032%22%3E%20%3Cg%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20fill%3D%22none%22%3E%20%3Ccircle%20cx%3D%2212%22%20cy%3D%2212%22%20r%3D%229.5%22%20stroke%3D%22%23FFFFFF%22%20stroke-width%3D%225%22%2F%3E%20%3Cpath%20d%3D%22M19%2019%20L29%2029%22%20stroke%3D%22%23FFFFFF%22%20stroke-width%3D%227%22%2F%3E%20%3Cpath%20d%3D%22M19.5%2019.5%20L28.5%2028.5%22%20stroke%3D%22%231B3A4B%22%20stroke-width%3D%224.2%22%2F%3E%20%3Ccircle%20cx%3D%2212%22%20cy%3D%2212%22%20r%3D%229%22%20fill%3D%22%23FFFFFF%22%20fill-opacity%3D%22.92%22%20stroke%3D%22%231B3A4B%22%20stroke-width%3D%222.4%22%2F%3E%20%3Cpath%20d%3D%22M5%2012.5%20L8.4%2012.5%20L10%209.5%20L12.3%2016%20L14.3%207.5%20L16%2012.5%20L19%2012.5%22%20stroke%3D%22%230FA3A3%22%20stroke-width%3D%221.9%22%2F%3E%20%3C%2Fg%3E%20%3C%2Fsvg%3E") 12 12, auto;}' +
      'a,button,[role="button"],summary,label,select,.related-card,.ama-btn,.ama-chip,.theme-toggle,.to-top,.rel-arrow,.nav-toggle{cursor:url("data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2232%22%20height%3D%2232%22%20viewBox%3D%220%200%2032%2032%22%3E%20%3Cg%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20fill%3D%22none%22%3E%20%3Ccircle%20cx%3D%2212%22%20cy%3D%2212%22%20r%3D%229.5%22%20stroke%3D%22%23FFFFFF%22%20stroke-width%3D%225%22%2F%3E%20%3Cpath%20d%3D%22M19%2019%20L29%2029%22%20stroke%3D%22%23FFFFFF%22%20stroke-width%3D%227%22%2F%3E%20%3Cpath%20d%3D%22M19.5%2019.5%20L28.5%2028.5%22%20stroke%3D%22%231B3A4B%22%20stroke-width%3D%224.2%22%2F%3E%20%3Ccircle%20cx%3D%2212%22%20cy%3D%2212%22%20r%3D%229%22%20fill%3D%22%23FFFFFF%22%20fill-opacity%3D%22.92%22%20stroke%3D%22%231B3A4B%22%20stroke-width%3D%222.4%22%2F%3E%20%3Cpath%20d%3D%22M5%2012.5%20L8.4%2012.5%20L10%209.5%20L12.3%2016%20L14.3%207.5%20L16%2012.5%20L19%2012.5%22%20stroke%3D%22%23E08A3C%22%20stroke-width%3D%221.9%22%2F%3E%20%3C%2Fg%3E%20%3C%2Fsvg%3E") 12 12, pointer !important;}' +
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
