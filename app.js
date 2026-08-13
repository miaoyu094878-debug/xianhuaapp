/* Luminara — Manifest Your Reality */
(function () {
  'use strict';

  /* ═══════ Starfield Canvas ═══════ */
  var canvas = document.getElementById('starfield');
  var ctx = canvas.getContext('2d');
  var stars = [], W, H;
  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  var STAR_PALETTES = {
    'luminara': ['255,220,170', '210,170,240'],
    'manifest-light': ['232,184,109', '244,166,189', '184,161,227'],
    'manifest-dark': ['255,255,255', '220,210,255', '255,230,200'],
    'prism': ['255,255,255', '255,170,190', '255,209,128', '143,195,245']
  };
  var starPalette = STAR_PALETTES['luminara'];

  for (var i = 0; i < 140; i++) {
    stars.push({
      x: Math.random() * W, y: Math.random() * H,
      r: Math.random() * 1.8 + 0.3,
      speed: Math.random() * 0.35 + 0.08,
      twinkle: Math.random() * Math.PI * 2,
      twinkleSpeed: Math.random() * 0.02 + 0.004,
      pi: i % 2
    });
  }

  function drawStars() {
    ctx.clearRect(0, 0, W, H);
    stars.forEach(function (s) {
      var hue = starPalette[s.pi % starPalette.length];
      var alpha = 0.3 + 0.7 * (Math.sin(s.twinkle) * 0.5 + 0.5);
      ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(' + hue + ',' + alpha + ')';
      ctx.fill();
      if (s.r > 1.0) {
        ctx.beginPath(); ctx.arc(s.x, s.y, s.r * 3.5, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(' + hue + ',' + (alpha * 0.06) + ')';
        ctx.fill();
      }
      s.y -= s.speed;
      s.twinkle += s.twinkleSpeed;
      if (s.y < -10) { s.y = H + 10; s.x = Math.random() * W; }
    });
    if (Math.random() < 0.004) {
      var sx = Math.random() * W * 0.8, sy = Math.random() * H * 0.5;
      var len = 60 + Math.random() * 50;
      var grd = ctx.createLinearGradient(sx, sy, sx + len * 1.5, sy + len);
      var sc = starPalette[0];
      grd.addColorStop(0, 'rgba(' + sc + ',0.8)');
      grd.addColorStop(1, 'rgba(' + sc + ',0)');
      ctx.beginPath(); ctx.moveTo(sx, sy);
      ctx.lineTo(sx + len * 1.5, sy + len);
      ctx.strokeStyle = grd; ctx.lineWidth = 1.5;
      ctx.stroke();
    }
    requestAnimationFrame(drawStars);
  }
  drawStars();

  /* ═══════ Data Layer ═══════ */
  var KEY = 'manifest_data_v1';
  var defaults = {
    goals: [], gratitude: {}, affirmFavs: [],
    vision: [], three69: {}, activeDays: [], meditationMin: 0,
    profile: { name: '', area: '', desire: '' }
  };

  var db = load();
  function load() {
    try { var raw = localStorage.getItem(KEY); if (raw) return Object.assign({}, defaults, JSON.parse(raw)); } catch (e) {}
    return Object.assign({}, defaults);
  }
  function save() { localStorage.setItem(KEY, JSON.stringify(db)); }
  function todayStr() {
    var d = new Date();
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  }
  function uid() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 6); }
  function markActive() {
    var t = todayStr();
    if (db.activeDays.indexOf(t) === -1) { db.activeDays.push(t); save(); }
  }
  function streak() {
    var set = {};
    db.activeDays.forEach(function (d) { set[d] = 1; });
    var n = 0, d = new Date();
    if (!set[fmt(d)]) d.setDate(d.getDate() - 1);
    while (set[fmt(d)]) { n++; d.setDate(d.getDate() - 1); }
    return n;
  }
  function fmt(d) {
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  }

  /* ═══════ Affirmation Library ═══════ */
  var AFFIRMATIONS = {
    'Abundance': [
      'Money flows to me effortlessly from expected and unexpected sources.',
      'I am a magnet for wealth, prosperity, and abundance.',
      'I deserve to live a life of financial freedom.',
      'Abundance is my natural state of being.',
      'I am open to receive unlimited abundance from the Universe.'
    ],
    'Love': [
      'I am deeply loved and cherished.',
      'My soulmate is on their way to me right now.',
      'I am worthy of a passionate, healthy, and fulfilling relationship.',
      'Love surrounds me everywhere I go.',
      'I radiate love and attract love effortlessly.'
    ],
    'Career': [
      'My talents are seen, valued, and rewarded.',
      'The perfect opportunity is already making its way to me.',
      'I do what I love and prosper abundantly from it.',
      'Every step I take leads me to my highest purpose.',
      'I am confident, capable, and successful in all I do.'
    ],
    'Wellness': [
      'Every cell in my body vibrates with energy and health.',
      'I am radiant, vibrant, and full of life force.',
      'My body heals, restores, and strengthens each day.',
      'I treat my body with love, and it loves me back.',
      'Perfect health is my birthright.'
    ],
    'Growth': [
      'I trust myself completely and believe in my journey.',
      'Everything is unfolding perfectly for my highest good.',
      'I have the power to create the life of my dreams.',
      'I live in the present moment, peaceful and powerful.',
      'The Universe always has my back.'
    ]
  };
  var QUOTES = [
    'What you focus on, you attract.',
    'Imagination is the beginning of creation.',
    'Gratitude for what you have opens the door to more.',
    'The Universe responds to your frequency, not your words.',
    'Become it first, then you shall have it.',
    'Believe it, and you will see it.',
    'Your beliefs are shaping your reality right now.'
  ];

  /* ═══════ Helpers ═══════ */
  function $(s) { return document.querySelector(s); }
  function $$(s) { return Array.prototype.slice.call(document.querySelectorAll(s)); }
  function el(tag, cls, text) {
    var e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e;
  }

  /* ═══════ Tab Navigation ═══════ */
  $$('.tab-btn').forEach(function (btn) {
    btn.addEventListener('click', function () { goTab(btn.dataset.tab); });
  });
  function goTab(id) {
    stopFutureAudio();
    var hasNav = false;
    $$('.tab-btn').forEach(function (b) {
      var on = b.dataset.tab === id;
      if (on) hasNav = true;
      b.classList.toggle('active', on);
    });
    if (!hasNav) {
      var more = $$('.tab-btn').filter(function (b) { return b.dataset.tab === 'tab-more'; })[0];
      if (more) more.classList.add('active');
    }
    $$('.tab-page').forEach(function (p) { p.classList.toggle('active', p.id === id); });
    window.scrollTo(0, 0);
  }
  $$('.mini-card, .focus-card, .more-card').forEach(function (c) {
    c.addEventListener('click', function () { goTab(c.dataset.goto); });
  });

  /* ═══════ Dashboard ═══════ */
  function renderToday() {
    var now = new Date();
    var week = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    $('#todayDate').textContent = week[now.getDay()] + ', ' + months[now.getMonth()] + ' ' + now.getDate();
    var h = now.getHours();
    var base = h < 6 ? 'The stars are still dreaming' : h < 12 ? 'A beautiful morning to create' : h < 18 ? 'The Universe is listening' : 'Reflect on today\'s magic';
    var name = db.profile && db.profile.name ? ', ' + db.profile.name : '';
    $('#greeting').textContent = base + name;
    var doy = Math.floor((now - new Date(now.getFullYear(), 0, 0)) / 864e5);
    $('#dailyQuote').textContent = '“' + QUOTES[doy % QUOTES.length] + '”';
    $('#statStreak').textContent = streak();
    $('#statGoals').textContent = db.goals.filter(function (g) { return !g.done; }).length;
    $('#statMeditation').textContent = db.meditationMin;

    var t = db.three69[todayStr()] || {};
    $('#glance369').textContent = 'Morning ' + (t.morning || 0) + '/3 · Noon ' + (t.afternoon || 0) + '/6 · Night ' + (t.night || 0) + '/9';
    var done369 = (t.morning || 0) + (t.afternoon || 0) + (t.night || 0);
    $('#glance369bar').style.width = Math.min(100, done369 / 18 * 100) + '%';
    var g = db.gratitude[todayStr()];
    $('#glanceGratitude').textContent = g && g.length ? g.length + ' blessing' + (g.length > 1 ? 's' : '') + ' recorded ✿' : 'Write 3 things you\'re grateful for';
  }

  /* ═══════ Goals ═══════ */
  $('#goalForm').addEventListener('submit', function (e) {
    e.preventDefault();
    var title = $('#goalTitle').value.trim();
    if (!title) return;
    db.goals.unshift({ id: uid(), title: title, category: $('#goalCategory').value, date: $('#goalDate').value || '', done: false, createdAt: todayStr() });
    $('#goalTitle').value = ''; $('#goalDate').value = '';
    markActive(); save(); renderGoals(); renderToday();
  });

  var CAT_EMOJI = { 'abundance': '💎', 'love': '💖', 'career': '⭐', 'wellness': '🌙', 'growth': '🌱' };
  var CAT_LABEL = { 'abundance': 'Abundance', 'love': 'Love', 'career': 'Purpose', 'wellness': 'Wellness', 'growth': 'Growth' };
  function renderGoals() {
    var wrap = $('#goalList');
    wrap.innerHTML = '';
    if (!db.goals.length) { wrap.appendChild(el('div', 'empty', 'No desires yet. Plant your first seed ✦')); return; }
    db.goals.forEach(function (g) {
      var item = el('div', 'list-item' + (g.done ? ' done' : ''));
      var toggle = el('button', 'icon-btn', g.done ? '✧' : '○');
      toggle.title = g.done ? 'Manifested' : 'Mark as manifested';
      toggle.addEventListener('click', function () { g.done = !g.done; save(); renderGoals(); renderToday(); });
      var mid = el('div', 'grow');
      mid.appendChild(el('div', 'title', g.title));
      var meta = (CAT_EMOJI[g.category] || '✦') + ' ' + (CAT_LABEL[g.category] || g.category) + ' · Planted ' + g.createdAt + (g.date ? ' · By ' + g.date : '');
      mid.appendChild(el('div', 'meta', g.done ? meta + ' · ✦ Manifested' : meta));
      var del = el('button', 'icon-btn', '✕');
      del.addEventListener('click', function () { db.goals = db.goals.filter(function (x) { return x.id !== g.id; }); save(); renderGoals(); renderToday(); });
      item.appendChild(toggle); item.appendChild(mid); item.appendChild(del);
      wrap.appendChild(item);
    });
  }

  /* ═══════ 369 Ritual ═══════ */
  var SESSIONS = [
    { key: 'morning', name: '☀ Dawn', target: 3, tip: 'Set your frequency for the day' },
    { key: 'afternoon', name: '☼ Noon', target: 6, tip: 'Reinforce the energy of your desire' },
    { key: 'night', name: '☽ Night', target: 9, tip: 'Let your wish drift into the cosmos as you sleep' }
  ];
  function t369() {
    var t = todayStr();
    if (!db.three69[t]) db.three69[t] = { affirmation: '', morning: 0, afternoon: 0, night: 0 };
    return db.three69[t];
  }
  $('#affirmSave').addEventListener('click', function () {
    var v = $('#affirmInput').value.trim();
    if (!v) return;
    t369().affirmation = v;
    $('#affirmInput').value = '';
    save(); render369();
  });
  function render369() {
    var t = t369();
    $('#currentAffirm').textContent = t.affirmation ? '「' + t.affirmation + '」' : 'Set your affirmation (in present tense: "I am…", "I have…")';
    var wrap = $('#sessions');
    wrap.innerHTML = '';
    var allDone = true;
    SESSIONS.forEach(function (s) {
      var n = t[s.key] || 0;
      if (n < s.target) allDone = false;
      var card = el('div', 'card glass session');
      var info = el('div', 'session-info');
      info.appendChild(el('h3', null, s.name + '  ·  ' + s.target + '×'));
      info.appendChild(el('div', 'meta', s.tip));
      var bar = el('div', 'progress');
      var fill = el('div');
      fill.style.width = Math.min(100, n / s.target * 100) + '%';
      bar.appendChild(fill);
      info.appendChild(bar);
      var btn = el('button', 'tap-btn');
      btn.innerHTML = n >= s.target ? '✓' : '+1<small>' + n + '/' + s.target + '</small>';
      btn.disabled = n >= s.target || !t.affirmation;
      btn.addEventListener('click', function () {
        t[s.key] = (t[s.key] || 0) + 1;
        if (t[s.key] >= s.target && SESSIONS.every(function (x) { return (t[x.key] || 0) >= x.target; })) markActive();
        save(); render369(); renderToday();
      });
      card.appendChild(info); card.appendChild(btn);
      wrap.appendChild(card);
    });
    $('#done369').classList.toggle('hidden', !(allDone && t.affirmation));
  }

  /* ═══════ Affirmations (List) ═══════ */
  var curCat = 'Abundance';
  var catsWrap = $('#affirmCats');
  Object.keys(AFFIRMATIONS).forEach(function (c) {
    var b = el('button', 'chip' + (c === curCat ? ' active' : ''), c);
    b.addEventListener('click', function () {
      curCat = c;
      $$('#affirmCats .chip').forEach(function (x) { x.classList.toggle('active', x.textContent === c); });
      renderAffirm();
    });
    catsWrap.appendChild(b);
  });
  function renderAffirm() {
    var wrap = $('#affirmList');
    wrap.innerHTML = '';
    AFFIRMATIONS[curCat].forEach(function (text) {
      var fav = db.affirmFavs.indexOf(text) !== -1;
      var item = el('div', 'list-item');
      var mid = el('div', 'grow');
      mid.appendChild(el('div', 'title', text));
      var favBtn = el('button', 'icon-btn', fav ? '✦' : '✧');
      favBtn.title = fav ? 'Unfavorite' : 'Favorite';
      favBtn.addEventListener('click', function () {
        var i = db.affirmFavs.indexOf(text);
        if (i === -1) db.affirmFavs.push(text); else db.affirmFavs.splice(i, 1);
        save(); renderAffirm();
      });
      var useBtn = el('button', 'icon-btn', '→');
      useBtn.title = 'Use for 369 ritual';
      useBtn.addEventListener('click', function () { t369().affirmation = text; save(); render369(); goTab('tab-369'); });
      item.appendChild(mid); item.appendChild(useBtn); item.appendChild(favBtn);
      wrap.appendChild(item);
    });
  }

  /* ═══════ Swipe Affirmations (Stella-style) ═══════ */
  var swipeQueue = [];
  function shuffle(arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; }
    return a;
  }
  function initSwipe() {
    var pool = [];
    Object.keys(AFFIRMATIONS).forEach(function (c) { AFFIRMATIONS[c].forEach(function (t) { pool.push(t); }); });
    swipeQueue = shuffle(pool);
    renderSwipe();
  }
  function renderSwipe() {
    var deck = $('#swipeDeck'); deck.innerHTML = '';
    if (!swipeQueue.length) {
      deck.appendChild(el('div', 'swipe-empty', "You've collected them all ✧\nTap Reset to begin again"));
      return;
    }
    var card = el('div', 'swipe-card');
    card.innerHTML = '<div class="sc-text">' + swipeQueue[swipeQueue.length - 1] + '</div><div class="sc-hint">♥ save · ✕ skip</div>';
    deck.appendChild(card);
  }
  function swipeOut(dir, after) {
    var card = $('#swipeDeck .swipe-card');
    if (!card) { after(); return; }
    card.classList.add(dir === 'save' ? 'swiped-right' : 'swiped-left');
    if (dir === 'save') card.classList.add('saved-flash');
    setTimeout(after, 320);
  }
  $('#swipeSave').addEventListener('click', function () {
    var text = swipeQueue[swipeQueue.length - 1];
    swipeOut('save', function () {
      swipeQueue.pop();
      if (text && db.affirmFavs.indexOf(text) === -1) db.affirmFavs.push(text);
      save(); renderSwipe(); renderAffirm();
    });
  });
  $('#swipeSkip').addEventListener('click', function () {
    swipeOut('skip', function () { swipeQueue.pop(); renderSwipe(); });
  });
  $('#swipeReset').addEventListener('click', function () { initSwipe(); });

  /* ═══════ Gratitude Journal ═══════ */
  var gratInputs = $$('.grat-input');
  $('#gratForm').addEventListener('submit', function (e) {
    e.preventDefault();
    var items = gratInputs.map(function (i) { return i.value.trim(); }).filter(Boolean);
    if (!items.length) return;
    db.gratitude[todayStr()] = items;
    gratInputs.forEach(function (i) { i.value = ''; });
    markActive(); save(); renderGrat(); renderToday();
  });
  function renderGrat() {
    var wrap = $('#gratHistory');
    wrap.innerHTML = '';
    var days = Object.keys(db.gratitude).sort().reverse();
    if (!days.length) { wrap.appendChild(el('div', 'empty', 'Your gratitude journal awaits ✿')); return; }
    days.slice(0, 14).forEach(function (day) {
      var card = el('div', 'card glass');
      card.appendChild(el('div', 'meta', day + (day === todayStr() ? ' · Today' : '')));
      db.gratitude[day].forEach(function (g) {
        var p = el('div', 'title', '✿  ' + g);
        p.style.marginTop = '8px'; p.style.lineHeight = '1.6';
        card.appendChild(p);
      });
      wrap.appendChild(card);
    });
    var tg = db.gratitude[todayStr()];
    if (tg) gratInputs.forEach(function (inp, i) { inp.value = tg[i] || ''; });
  }

  /* ═══════ Vision Board (with photo) ═══════ */
  $('#visionForm').addEventListener('submit', function (e) {
    e.preventDefault();
    var text = $('#visionText').value.trim();
    if (!text) return;
    var fileInput = $('#visionPhoto');
    var finish = function (photo) {
      db.vision.unshift({ id: uid(), emoji: $('#visionEmoji').value.trim() || '✦', text: text, photo: photo || null });
      $('#visionText').value = ''; $('#visionPhoto').value = '';
      markActive(); save(); renderVision();
    };
    if (fileInput.files && fileInput.files[0]) compressImage(fileInput.files[0], finish);
    else finish(null);
  });
  function compressImage(file, cb) {
    var reader = new FileReader();
    reader.onload = function (ev) {
      var img = new Image();
      img.onload = function () {
        var maxW = 600, scale = Math.min(1, maxW / img.width);
        var w = Math.round(img.width * scale), h = Math.round(img.height * scale);
        var c = document.createElement('canvas'); c.width = w; c.height = h;
        c.getContext('2d').drawImage(img, 0, 0, w, h);
        try { cb(c.toDataURL('image/jpeg', 0.7)); } catch (err) { cb(null); }
      };
      img.onerror = function () { cb(null); };
      img.src = ev.target.result;
    };
    reader.onerror = function () { cb(null); };
    reader.readAsDataURL(file);
  }
  function renderVision() {
    var wrap = $('#visionBoard');
    wrap.innerHTML = '';
    if (!db.vision.length) { wrap.appendChild(el('div', 'empty', 'Pin your first vision card ◈')); return; }
    db.vision.forEach(function (v) {
      var card = el('div', 'vision-card');
      card.appendChild(el('div', 've', v.emoji));
      card.appendChild(el('div', 'vt', v.text));
      if (v.photo) {
        card.classList.add('has-photo');
        card.style.backgroundImage = 'url(' + v.photo + ')';
        card.style.backgroundSize = 'cover';
        card.style.backgroundPosition = 'center';
      }
      var del = el('button', 'vdel', '✕');
      del.addEventListener('click', function () { db.vision = db.vision.filter(function (x) { return x.id !== v.id; }); save(); renderVision(); });
      card.appendChild(del);
      wrap.appendChild(card);
    });
  }

  /* ═══════ Future Self (audio manifestation) ═══════ */
  function buildFutureScript(name, desire) {
    var n = name ? name : 'friend';
    var d = desire || (db.profile && db.profile.area ? 'your ' + db.profile.area.toLowerCase() + ' dream' : 'your deepest desire');
    return 'Hello ' + n + '. I am you — from a future where ' + d + ' is already completely real.\n\n' +
      'I want you to know: it happened. Gently, surely, exactly as it was meant to. Every small step you took mattered. The doubt you felt was only the old you loosening its grip.\n\n' +
      'In my reality now, ' + d + ' fills my days with ease and quiet joy. You are already on the way. Keep going — I am already here, waiting for you with open arms.\n\n' +
      'Breathe. You have got this. ✧';
  }
  var fsPlaying = false;
  function pickVoice() {
    if (!('speechSynthesis' in window)) return null;
    var vs = window.speechSynthesis.getVoices();
    if (!vs.length) return null;
    return vs.filter(function (v) { return /en/i.test(v.lang) && /female|samantha|victoria|zira|karen|moira|google US|woman|girl/i.test(v.name); })[0] ||
           vs.filter(function (v) { return /en[-_]US/i.test(v.lang); })[0] ||
           vs.filter(function (v) { return /^en/i.test(v.lang); })[0] || null;
  }
  function fsSpeak(text) {
    if (!('speechSynthesis' in window)) { alert('Text-to-speech is not supported on this device.'); return; }
    window.speechSynthesis.cancel();
    var u = new SpeechSynthesisUtterance(text);
    u.rate = 0.9; u.pitch = 1.0;
    var v = pickVoice(); if (v) u.voice = v;
    u.onend = function () { fsPlaying = false; $('#fsPlay').textContent = '▶ Play'; };
    u.onerror = function () { fsPlaying = false; $('#fsPlay').textContent = '▶ Play'; };
    window.speechSynthesis.speak(u);
    fsPlaying = true; $('#fsPlay').textContent = '⏸ Pause';
  }
  $('#fsForm').addEventListener('submit', function (e) {
    e.preventDefault();
    var raw = $('#fsDesire').value.trim();
    var desire = raw || (db.profile && db.profile.desire) || '';
    if (!desire) return;
    var script = buildFutureScript(db.profile && db.profile.name, desire);
    $('#fsScript').textContent = script;
    $('#fsScript').setAttribute('contenteditable', 'true');
    $('#fsPlayer').classList.remove('hidden');
    fsSpeak(script);
  });
  $('#fsPlay').addEventListener('click', function () {
    var txt = $('#fsScript').textContent;
    if (fsPlaying) { window.speechSynthesis.pause(); fsPlaying = false; $('#fsPlay').textContent = '▶ Resume'; }
    else if (window.speechSynthesis && window.speechSynthesis.paused && window.speechSynthesis.speaking) {
      window.speechSynthesis.resume(); fsPlaying = true; $('#fsPlay').textContent = '⏸ Pause';
    } else { if (!txt) return; fsSpeak(txt); }
  });
  /* Ambient pad via Web Audio */
  var ambCtx = null, ambNodes = null, ambOn = false;
  function startAmbient() {
    try {
      var AC = window.AudioContext || window.webkitAudioContext;
      ambCtx = new AC();
      var o1 = ambCtx.createOscillator(); o1.type = 'sine'; o1.frequency.value = 110;
      var o2 = ambCtx.createOscillator(); o2.type = 'sine'; o2.frequency.value = 164.81;
      var filter = ambCtx.createBiquadFilter(); filter.type = 'lowpass'; filter.frequency.value = 600;
      var gain = ambCtx.createGain(); gain.gain.value = 0.045;
      o1.connect(filter); o2.connect(filter); filter.connect(gain); gain.connect(ambCtx.destination);
      o1.start(); o2.start();
      ambNodes = { o1: o1, o2: o2 };
      ambOn = true;
      $('#fsAmbient').textContent = 'Ambient: On'; $('#fsAmbient').setAttribute('aria-pressed', 'true');
    } catch (e) { /* ignore */ }
  }
  function stopAmbient() {
    if (ambNodes) { try { ambNodes.o1.stop(); ambNodes.o2.stop(); } catch (e) {} ambNodes = null; }
    if (ambCtx) { try { ambCtx.close(); } catch (e) {} ambCtx = null; }
    ambOn = false;
    var b = $('#fsAmbient'); if (b) { b.textContent = 'Ambient: Off'; b.setAttribute('aria-pressed', 'false'); }
  }
  $('#fsAmbient').addEventListener('click', function () { if (ambOn) stopAmbient(); else startAmbient(); });
  function stopFutureAudio() {
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    if (fsPlaying) { fsPlaying = false; var p = $('#fsPlay'); if (p) p.textContent = '▶ Play'; }
    if (ambOn) stopAmbient();
  }

  /* ═══════ Cosmic Meditation ═══════ */
  var medState = { min: 5, left: 300, timer: null, breathTimer: null, running: false };
  $$('.dur-chip').forEach(function (c) {
    c.addEventListener('click', function () {
      if (medState.running) return;
      medState.min = parseInt(c.dataset.min, 10);
      medState.left = medState.min * 60;
      $$('.dur-chip').forEach(function (x) { x.classList.toggle('active', x === c); });
      renderMedTime();
    });
  });
  function renderMedTime() {
    var m = Math.floor(medState.left / 60), s = medState.left % 60;
    $('#medTimer').textContent = String(m).padStart(2, '0') + ':' + String(s).padStart(2, '0');
  }
  function breathLoop() {
    var circle = $('#breathCircle'), txt = $('#breathText');
    var phases = [
      { label: 'Breathe in', cls: 'inhale', dur: 4000 },
      { label: 'Hold', cls: 'inhale', dur: 4000 },
      { label: 'Release', cls: 'exhale', dur: 6000 }
    ];
    var i = 0;
    function next() {
      if (!medState.running) return;
      var p = phases[i % phases.length];
      txt.textContent = p.label;
      circle.className = 'breath-circle ' + p.cls;
      medState.breathTimer = setTimeout(next, p.dur);
      i++;
    }
    next();
  }
  $('#medStart').addEventListener('click', function () {
    if (medState.running) { stopMed(false); return; }
    medState.running = true;
    medState.left = medState.min * 60;
    $('#medStart').textContent = 'End Journey ✦';
    renderMedTime();
    breathLoop();
    medState.timer = setInterval(function () {
      medState.left--;
      renderMedTime();
      if (medState.left <= 0) stopMed(true);
    }, 1000);
  });
  function stopMed(completed) {
    clearInterval(medState.timer);
    clearTimeout(medState.breathTimer);
    medState.running = false;
    var doneMin = completed ? medState.min : Math.round((medState.min * 60 - medState.left) / 60);
    if (doneMin > 0) { db.meditationMin += doneMin; markActive(); save(); }
    medState.left = medState.min * 60;
    $('#medStart').textContent = 'Begin Journey ✦';
    $('#breathText').textContent = completed ? '✦ Complete' : 'Ready';
    $('#breathCircle').className = 'breath-circle';
    renderMedTime(); renderToday();
    if (completed) setTimeout(function () { $('#breathText').textContent = 'Ready'; }, 3000);
  }

  /* ═══════ Onboarding Quiz ═══════ */
  var qStep = 1;
  function setQuizStep(n) {
    qStep = n;
    $$('.quiz-step').forEach(function (s) { s.classList.toggle('hidden', parseInt(s.dataset.step, 10) !== n); });
    $$('.qdot').forEach(function (d, i) { d.classList.toggle('active', i === n - 1); });
  }
  function showQuiz() { $('#quizModal').classList.remove('hidden'); setQuizStep(1); }
  function maybeShowQuiz() { if (!db.profile || !db.profile.name) showQuiz(); }
  $$('.q-next').forEach(function (b) {
    b.addEventListener('click', function () { setQuizStep(Math.min(3, qStep + 1)); });
  });
  $$('#qCats .chip').forEach(function (c) {
    c.addEventListener('click', function () {
      $$('#qCats .chip').forEach(function (x) { x.classList.remove('active'); });
      c.classList.add('active');
      db.profile = db.profile || {}; db.profile.area = c.dataset.cat;
    });
  });
  $('#qFinish').addEventListener('click', function () {
    db.profile = db.profile || {};
    db.profile.name = $('#qName').value.trim();
    db.profile.desire = $('#qDesire').value.trim();
    save();
    $('#quizModal').classList.add('hidden');
    renderToday();
  });

  /* ═══════ AI Vision (Kling AI) ═══════ */
  var AI_BASE = 'https://api.klingai.com';
  var aiKeys = db.aiKeys || {};
  var aiPhotoB64 = null, aiB64Raw = null;

  function b64url(buf) {
    var bin = '';
    var bytes = new Uint8Array(buf);
    for (var i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
    return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  }
  function makeJwt(ak, sk) {
    var enc = new TextEncoder();
    var header = b64url(enc.encode(JSON.stringify({ alg: 'HS256', typ: 'JWT' })));
    var now = Math.floor(Date.now() / 1000);
    var payload = b64url(enc.encode(JSON.stringify({ iss: ak, exp: now + 1800, nbf: now - 5 })));
    var data = enc.encode(header + '.' + payload);
    return crypto.subtle.importKey('raw', enc.encode(sk), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign'])
      .then(function (key) { return crypto.subtle.sign('HMAC', key, data); })
      .then(function (sig) { return header + '.' + payload + '.' + b64url(sig); });
  }
  function aiAuthHeaders() {
    if (aiKeys.key) return Promise.resolve({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + aiKeys.key });
    return makeJwt(aiKeys.ak, aiKeys.sk).then(function (t) { return { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + t }; });
  }
  function klingReq(path, method, body) {
    return aiAuthHeaders().then(function (headers) {
      return fetch(AI_BASE + path, { method: method, headers: headers, body: body ? JSON.stringify(body) : undefined });
    }).then(function (res) { return res.json(); }).then(function (j) {
      if (j.code !== 0) throw new Error(j.message || ('API error ' + j.code));
      return j.data;
    });
  }
  function pollTask(path, taskId, statusEl, done) {
    var tries = 0, start = Date.now();
    var timer = setInterval(function () {
      tries++;
      var secs = Math.round((Date.now() - start) / 1000);
      klingReq(path + '/' + taskId, 'GET').then(function (d) {
        var st = d.task_status;
        if (st === 'succeed') { clearInterval(timer); done(null, d); }
        else if (st === 'failed') { clearInterval(timer); done(d.task_status_msg || 'Task failed', null); }
        else {
          statusEl.textContent = 'Creating… ' + fmtSec(secs) + ' (status: ' + st + ')';
          if (tries >= 90) { clearInterval(timer); done('Timed out after ~15 min', null); }
        }
      }).catch(function (e) { clearInterval(timer); done(e.message, null); });
    }, 10000);
  }
  function fmtSec(s) { var m = Math.floor(s / 60), r = s % 60; return m + ':' + (r < 10 ? '0' : '') + r; }
  function aiHasKeys() { return !!(aiKeys.key || (aiKeys.ak && aiKeys.sk)); }
  function aiStatus(msg) { $('#aiStatus').textContent = msg; }
  function aiKeyStateTxt() { return aiHasKeys() ? (aiKeys.key ? 'API key ✓' : 'AK/SK ✓') : 'not set'; }

  $('#aiDrop').addEventListener('click', function () { $('#aiPhoto').click(); });
  $('#aiPhoto').addEventListener('change', function () {
    var f = this.files && this.files[0];
    if (!f) return;
    compressImage(f, function (data) {
      if (!data) { aiStatus('Could not read that image.'); return; }
      aiPhotoB64 = data; aiB64Raw = data.split(',')[1];
      $('#aiPrevImg').src = data;
      $('#aiPrevBox').classList.remove('hidden');
      aiStatus('Photo ready ✓');
    });
  });
  $('#aiPrevClear').addEventListener('click', function () {
    aiPhotoB64 = null; aiB64Raw = null;
    $('#aiPrevBox').classList.add('hidden');
    $('#aiPhoto').value = '';
    aiStatus('');
  });
  $('#aiKeyToggle').addEventListener('click', function () { $('#aiKeyBox').classList.toggle('hidden'); });
  $('#aiKeySave').addEventListener('click', function () {
    aiKeys.ak = $('#aiAk').value.trim(); aiKeys.sk = $('#aiSk').value.trim();
    aiKeys.key = $('#aiKey').value.trim();
    if (!aiKeys.ak && !aiKeys.key) aiKeys.sk = '';
    db.aiKeys = aiKeys; save();
    $('#aiKeyState').textContent = aiKeyStateTxt();
    aiStatus(aiHasKeys() ? 'Keys saved ✓' : 'Keys cleared.');
    $('#aiKeyBox').classList.add('hidden');
  });

  function aiGenerate(kind) {
    var prompt = $('#aiPrompt').value.trim();
    if (!prompt) { aiStatus('Describe the self you are becoming first ✍️'); return; }
    if (!aiHasKeys()) { aiStatus('Set your AI service key first ⚙ — tap the key section above'); return; }
    var srcInput = aiB64Raw;
    if (!srcInput) {
      var lastPhoto = (db.aiVision || []).filter(function (v) { return v.kind === 'photo'; })[0];
      if (lastPhoto && lastPhoto.url) srcInput = lastPhoto.url;
    }
    if (!srcInput) { aiStatus(kind === 'video' ? 'Add a photo to animate 📷' : 'Add your photo first 📷'); return; }
    $('#aiBtnPhoto').disabled = true; $('#aiBtnVideo').disabled = true;

    var body, path, pollPath;
    if (kind === 'photo') {
      body = { model_name: 'kling-v1', prompt: prompt, image: srcInput, aspect_ratio: '1:1', mode: 'std' };
      path = '/v1/images/generations'; pollPath = path;
      aiStatus('Sending to Kling AI…');
    } else {
      body = { model_name: 'kling-v1-6', image: srcInput, prompt: prompt, duration: '5', aspect_ratio: '9:16' };
      path = '/v1/videos/image2video'; pollPath = path;
      aiStatus('Sending photo to Kling AI…');
    }

    klingReq(path, 'POST', body).then(function (d) {
      aiStatus(kind === 'photo' ? 'Generating photo… (≈30 s)' : 'Generating video… (5–15 min, you can leave)');
      pollTask(pollPath, d.task_id, $('#aiStatus'), function (err, res) {
        $('#aiBtnPhoto').disabled = false; $('#aiBtnVideo').disabled = false;
        if (err) { aiStatus('❌ ' + err); return; }
        var url = kind === 'photo' ? res.task_result.images[0].url : res.task_result.videos[0].url;
        db.aiVision = db.aiVision || [];
        db.aiVision.unshift({ id: uid(), kind: kind, ts: Date.now(), prompt: prompt, url: url });
        save();
        aiStatus('Done ✓ — links expire in a few hours, download now ↓');
        renderAiResults();
      });
    }).catch(function (e) {
      $('#aiBtnPhoto').disabled = false; $('#aiBtnVideo').disabled = false;
      aiStatus('❌ ' + e.message);
    });
  }
  $('#aiBtnPhoto').addEventListener('click', function () { aiGenerate('photo'); });
  $('#aiBtnVideo').addEventListener('click', function () { aiGenerate('video'); });

  function renderAiResults() {
    var wrap = $('#aiResults');
    wrap.innerHTML = '';
    if (!db.aiVision || !db.aiVision.length) { wrap.appendChild(el('div', 'empty', 'Your future self will appear here 🪞')); return; }
    db.aiVision.forEach(function (v) {
      var card = el('div', 'card glass ai-result');
      card.appendChild(el('span', 'ai-badge ' + v.kind, v.kind === 'photo' ? 'Photo' : 'Video'));
      if (v.kind === 'photo') {
        var img = document.createElement('img'); img.src = v.url; card.appendChild(img);
      } else {
        var vid = document.createElement('video'); vid.src = v.url; vid.controls = true; vid.playsInline = true; card.appendChild(vid);
      }
      var when = new Date(v.ts).toLocaleString();
      card.appendChild(el('p', 'ai-rl', '“' + v.prompt + '” · ' + when));
      var dl = el('a', 'ai-rl', 'Download ' + (v.kind === 'photo' ? 'photo' : 'video') + ' ↓');
      dl.href = v.url; dl.setAttribute('download', 'luminara-future-self-' + v.id + (v.kind === 'photo' ? '.jpg' : '.mp4'));
      card.appendChild(dl);
      wrap.appendChild(card);
    });
  }
  renderAiResults();
  $('#aiKeyState').textContent = aiKeyStateTxt();

  /* ═══════ Theme Switcher ═══════ */
  var THEME_KEY = 'luminara_theme_v1';
  var THEMES = ['luminara', 'manifest-light', 'manifest-dark', 'prism'];
  function applyTheme(t) {
    if (THEMES.indexOf(t) === -1) t = 'luminara';
    document.documentElement.setAttribute('data-theme', t);
    localStorage.setItem(THEME_KEY, t);
    starPalette = STAR_PALETTES[t] || STAR_PALETTES['luminara'];
    $$('.theme-opt').forEach(function (o) { o.classList.toggle('active', o.dataset.theme === t); });
  }
  var savedTheme = localStorage.getItem(THEME_KEY);
  if (savedTheme) applyTheme(savedTheme);

  var fab = $('#themeFab'), panel = $('#themePanel');
  fab.addEventListener('click', function (e) { e.stopPropagation(); panel.classList.toggle('hidden'); });
  document.addEventListener('click', function (e) {
    if (!panel.contains(e.target) && e.target !== fab) panel.classList.add('hidden');
  });
  $$('.theme-opt').forEach(function (o) {
    o.addEventListener('click', function () { applyTheme(o.dataset.theme); panel.classList.add('hidden'); });
  });

  /* ═══════ PWA ═══════ */
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js').catch(function () {});
  }
  var deferredPrompt = null;
  window.addEventListener('beforeinstallprompt', function (e) {
    e.preventDefault(); deferredPrompt = e;
    $('#installBtn').classList.remove('hidden');
  });
  $('#installBtn').addEventListener('click', function () {
    if (deferredPrompt) { deferredPrompt.prompt(); deferredPrompt = null; }
    $('#installBtn').classList.add('hidden');
  });

  /* ═══════ Init ═══════ */
  renderToday(); renderGoals(); render369(); renderAffirm(); renderGrat(); renderVision(); renderMedTime();
  initSwipe();
  maybeShowQuiz();
})();
