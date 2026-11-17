/* Healthcare Pulse: related perspectives.
   Rebuilds the "Related perspectives" cards on every edition page from /editions.json,
   so titles are always the real edition titles and new editions appear automatically.
   Keeps the hand-picked cards that were already on the page as the strongest matches.
   If anything fails, the original cards stay as they were. */
(function(){
  var grid = document.querySelector('.related-grid');
  if (!grid || !window.fetch) return;
  var STOP = ('the a an and or of to in on for with by from at as is are was were be been it its this that these those india indian ' +
    'healthcare health edition what who why how when where which not no but into over under about after before more most less than ' +
    'their there they them our your you we us his her one two three six eight five four new just only also can will would should could ' +
    'has have had do does did doesn didn isn aren per via up out off all any each every other some such same so then still yet very').split(' ');
  var STOPSET = {}; STOP.forEach(function(w){ STOPSET[w] = 1; });
  function stem(w){ if (w.length > 4 && /ies$/.test(w)) return w.slice(0,-3)+'y'; if (w.length > 3 && /s$/.test(w) && !/ss$/.test(w)) return w.slice(0,-1); return w; }
  function toks(s){
    var out = {}; String(s || '').toLowerCase().replace(/[^a-z0-9]+/g,' ').split(' ').forEach(function(w){
      if (w.length < 3 || STOPSET[w] || /^\d+$/.test(w)) return; out[stem(w)] = 1; });
    return out;
  }
  function slug(s){ return String(s || 'policy').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,''); }
  function clean(t, e){ return String(t || '').replace(/^Edition\s+\d+\s*:\s*/i, ''); }
  function esc(s){ return String(s).replace(/[&<>"]/g, function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]; }); }
  var KNOWN = {'digital-health':1,'policy':1,'governance':1,'strategy':1};
  var FALLBACK = {'pharma':'linear-gradient(135deg,#C2553B,#8E3A27)','biotech':'linear-gradient(135deg,#37B68A,#1E7F5E)','geopolitics':'linear-gradient(135deg,#3A6EA5,#244A73)'};
  var here = location.pathname.replace(/\/+$/,'') || '/';
  var curated = Array.prototype.map.call(grid.querySelectorAll('a[href]'), function(a){ return a.getAttribute('href'); });

  fetch('/editions.json', {cache: 'no-cache'}).then(function(r){ if(!r.ok) throw 0; return r.json(); }).then(function(list){
    if (!list || !list.length) return;
    var cur = null;
    list.forEach(function(e){ if (e.u && (here === e.u || here === e.u.replace(/\.html$/,''))) cur = e; });
    var base = cur ? toks(cur.t + ' ' + cur.x + ' ' + (cur.g || []).join(' ')) : toks(document.title);
    var scored = [];
    list.forEach(function(e){
      if (!e.u || (cur && e.u === cur.u)) return;
      var t = toks(e.t + ' ' + e.x + ' ' + (e.g || []).join(' ')), s = 0;
      for (var w in t) if (base[w]) s += 1;
      var tt = toks(e.t); for (var w2 in tt) if (base[w2]) s += 1;      // title words count double
      if (cur && e.c === cur.c) s += 2;
      if (curated.indexOf(e.u) > -1) s += 6;                             // hand-picked links stay on top
      s += (e.e || 0) / 1000;                                            // newer wins ties
      if (s >= 3) scored.push({e: e, s: s});
    });
    scored.sort(function(a,b){ return b.s - a.s; });
    var pick = scored.slice(0, 6);
    if (pick.length < 3) return;                                         // not enough signal: keep the page as it is
    grid.innerHTML = pick.map(function(p){
      var e = p.e, c = slug(e.c);
      var style = KNOWN[c] ? '' : ' style="background:' + (FALLBACK[c] || 'linear-gradient(135deg,#0FA3A3,#2E7CB8)') + '"';
      return '<a class="related-card cat-' + c + '" href="' + esc(e.u) + '"' + style + '>' +
             '<span class="rc-ed">ED. ' + esc(e.e) + ' &middot; ' + esc(e.c) + '</span>' +
             '<span class="rc-title">' + esc(clean(e.t)) + '</span>' +
             '<span class="rc-go">Read this perspective &rarr;</span></a>';
    }).join('');
    var all = document.querySelector('.related-seeall');
    if (all && cur) all.setAttribute('href', '/topics/' + slug(cur.c) + '/');
  }).catch(function(){ /* keep the original cards */ });
})();
