/* =====================================================================
   intro.js - LIVE intro (built with HTML/CSS/JS, no video file) shown right after the logo splash.
   Order: logo splash -> curtain opens -> intro plays WITH SOUND -> it ends -> "Enter website" button.
   - Sound is never muted. If the browser blocks sound until the visitor touches the page, the intro still
     starts and the voice-over joins (in sync) on the first touch/click/key - no extra screen.
   - The animation is drawn on a 1280x720 (landscape) or 720x1280 (portrait) board that is scaled to fit
     any screen, and it follows the voice-over file (assets/audio/intro-voice.mp3) as its clock.
   - Plays on every visit (not when switching EN <-> AR). ?intro=0 skips it, ?intro=1 forces it.
   - Skip button, Esc, or the Enter button closes it. Safe to remove: this file, its <script> tag,
     the "Intro" block in template.html.
   Timeline: every element with data-a="start" (and optional data-b="end") appears at that second.
   ===================================================================== */
(function () {
  var box = document.getElementById("iv"),
    st = document.getElementById("ivst"),
    au = document.getElementById("iva"),
    skip = document.getElementById("ivs"),
    tap = null;
  if (!box || !st) return;
  var ar = document.documentElement.lang === "ar";
  var base = /\/ar\/?(index\.html)?$/.test(location.pathname) || ar ? "../" : "";
  var force = /[?&]intro=1/.test(location.search),
    off = /[?&]intro=0/.test(location.search),
    langSwitch = false;
  try {
    langSwitch = sessionStorage.getItem("introSkipOnce") === "1";
    sessionStorage.removeItem("introSkipOnce");
  } catch (e) {}
  var lang = document.getElementById("lang");
  if (lang)
    lang.addEventListener("click", function () {
      try {
        sessionStorage.setItem("introSkipOnce", "1");
      } catch (e) {}
    });
  if (off || (!force && langSwitch)) return box.remove();

  skip.textContent = ar ? "تخطي" : "Skip";

  /* ---------- content ---------- */
  var L = function (w) { return '<b style="width:' + w + '%"></b>'; };
  var CH = ["Websites", "Mobile Apps", "Dashboards", "Case Studies"];
  function sc(n, name, sub, tabs, a, b, mock) {
    var m = (b - a) / 2;
    return '<section class="lv-sc" data-a="' + a + '" data-b="' + b + '"><header><div><small>0' + n + " / 04</small><h2>" + name + "</h2><p>" + sub +
      '</p></div><div class="lv-tabs">' + tabs.map(function (t, i) { return '<span data-h="' + (a + 0.7 + i * m) + "-" + (a + 0.7 + (i + 1) * m) + '">' + t + "</span>"; }).join("") +
      '</div></header><div class="lv-mock">' + mock + "</div></section>";
  }
  function co(t, a, b, x, y) { return '<div class="lv-co" data-a="' + a + '" data-b="' + b + '" style="left:' + x + "%;top:" + y + '%">' + t + "</div>"; }
  var cards = [1, 2, 3].map(function (i) { return '<div class="lv-cd"><i class="lv-g' + i + '"></i>' + L(80) + L(55) + "</div>"; }).join("");
  var web = '<div class="lv-win"><div class="lv-bar"><i></i><i></i><i></i></div><div class="lv-nav"><u></u><span><s></s><s></s><s></s></span><em></em></div><div class="lv-hero"><div class="lv-tx">' + L(75) + L(55) + L(40) + '<div class="lv-btn" data-a="3.6"></div></div><div class="lv-pic"></div></div><div class="lv-cds">' + cards + "</div></div>" +
    co("Clear navigation", 3.7, 5, 38, 8) + co("One primary action", 4.2, 5, 14, 52);
  var ph = function (x) { return '<div class="lv-ph"><div class="lv-scr">' + L(40) + '<div class="lv-big"></div>' + '<div class="lv-row"><i></i>' + L(60) + '</div><div class="lv-row"><i></i>' + L(50) + "</div>" + (x || "") + "</div></div>"; };
  var mob = '<div class="lv-phs">' + ph() + ph('<div class="lv-pill"></div>') + "</div>" + co("Focus the content", 6.1, 7.2, 30, 34);
  var dash = '<div class="lv-win lv-dash"><div class="lv-side"><i></i><s></s><s></s><s></s></div><div class="lv-main"><div class="lv-kp"><u></u><u></u><u></u></div><div class="lv-chs"><div class="lv-bars">' +
    [55, 80, 45, 90, 65, 75].map(function (h) { return '<i style="height:' + h + '%"></i>'; }).join("") + '</div><div class="lv-don"></div></div></div></div>' + co("Key numbers first", 8.1, 10, 34, 14) + co("Hover for detail", 8.7, 10, 56, 44);
  var cs = '<div class="lv-cols">' + ["01 Research", "02 Wireframes", "03 Final UI"].map(function (c, i) { return "<div><h4>" + c + '</h4><div class="lv-cc lv-k' + i + '">' + L(70) + L(50) + L(60) + "</div></div>"; }).join("") + "</div>" + co("Understand users", 10.7, 12, 12, 30);
  var pg = [2.2, 5, 7.2, 10].map(function (a, i, r) { return '<i data-a="' + a + '" data-d="' + ((r[i + 1] || 12.2) - a) + '"></i>'; }).join("");
  var chips = CH.map(function (c) { return "<span>" + c + "</span>"; }).join("");

  st.innerHTML =
    '<section class="lv-sc lv-tt" data-a="0.2" data-b="2.2"><h1><span>UI</span><em>/</em><span>UX</span></h1><hr data-a="0.9"><p data-a="1.1">Looks right. Works right.</p></section>' +
    sc(1, "Websites", "Layout, hierarchy, a clear path to action", ["Layout · Color · Type", "Navigation · Hierarchy"], 2.2, 5, web) +
    sc(2, "Mobile Apps", "Thumb-friendly screens that flow naturally", ["Components · Motion", "Flows · Feedback"], 5, 7.2, mob) +
    sc(3, "Dashboards", "Complex data made calm, fast, readable", ["Charts · Cards · Systems", "Insight · Scanning"], 7.2, 10, dash) +
    sc(4, "Case Studies", "The full story: research to final interface", ["Final screens", "Research · Testing"], 10, 12.2, cs) +
    '<div class="lv-pgb" data-a="2.2" data-b="12.2">' + pg + "</div>" +
    '<section class="lv-sc lv-end" data-a="12.2"><h1><span>UI</span><em>/</em><span>UX</span></h1><p>in every design</p><div class="lv-chips">' + chips + '</div><img src="' + base + 'assets/logo.png" alt="" width="320" height="152"><small>Mohammed Shyiboub Hedhed · UI/UX Designer</small>' +
    '<button class="ivgo" id="iven" type="button" data-a="17.3">' + (ar ? "ادخل الموقع" : "Enter website") + '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg></button></section>';
  var enter = document.getElementById("iven"),
    els = st.querySelectorAll("[data-a]"),
    hs = st.querySelectorAll("[data-h]"),
    pgs = st.querySelectorAll(".lv-pgb i");

  /* ---------- fit the board to any screen ---------- */
  function fit() {
    var p = innerHeight > innerWidth,
      W = p ? 720 : 1280,
      H = p ? 1280 : 720;
    st.classList.toggle("lv-p", p);
    st.style.width = W + "px";
    st.style.height = H + "px";
    var k = Math.min(box.clientWidth / W, box.clientHeight / H);
    st.style.setProperty("--s", k);
    st.classList.toggle("lv-sm", k < 0.75);
  }
  box.hidden = false;
  document.documentElement.style.overflow = "hidden";
  fit();
  addEventListener("resize", fit);
  addEventListener("orientationchange", fit);

  /* ---------- clock: the voice-over file drives everything ---------- */
  var closed = false, started = false, useAudio = true, t0 = 0, raf = 0;
  au.src = base + "assets/audio/intro-voice.mp3";
  au.addEventListener("error", function () { useAudio = false; });
  function now() { return useAudio && au.currentTime > 0 ? au.currentTime : (performance.now() - t0) / 1000; }
  function frame() {
    var t = now();
    els.forEach(function (e) {
      var a = +e.getAttribute("data-a"), b = e.getAttribute("data-b");
      e.classList.toggle("lv-in", t >= a && (!b || t < +b));
    });
    pgs.forEach(function (e) {
      var f = (t - +e.getAttribute("data-a")) / +e.getAttribute("data-d");
      e.style.setProperty("--f", Math.max(0, Math.min(1, f)));
    });
    hs.forEach(function (e) {
      var r = e.getAttribute("data-h").split("-");
      e.classList.toggle("lv-hi", t >= +r[0] && t < +r[1]);
    });
    if (t >= 17.3 && !skip.hidden) {
      skip.hidden = true;
      skip.style.display = "none";
      try { enter.focus({ preventScroll: true }); } catch (e) {}
    }
    raf = requestAnimationFrame(frame);
  }
  function run() {
    if (started || closed) return;
    started = true;
    t0 = performance.now();
    frame();
  }
  function close() {
    if (closed) return;
    closed = true;
    cancelAnimationFrame(raf);
    removeEventListener("resize", fit);
    box.classList.add("out");
    document.documentElement.style.overflow = "";
    setTimeout(function () { au.pause(); box.remove(); }, 700);
  }
  /* try sound at once. If the browser blocks it, the intro still starts (no extra screen) and the voice-over
     joins, in sync, on the visitor's first touch / click / key / scroll anywhere on the page */
  function late() {
    ["pointerdown", "touchstart", "keydown", "wheel", "click"].forEach(function (ev) {
      removeEventListener(ev, onGesture, true);
    });
  }
  function onGesture() {
    if (closed || !started) return;
    late();
    try { au.currentTime = Math.min((performance.now() - t0) / 1000, 17); } catch (e) {}
    var p = au.play();
    if (p && p.catch) p.catch(function () { useAudio = false; });
  }
  function begin() {
    var p = au.play();
    if (!p || !p.then) return run();
    p.then(run, function () {
      run();
      ["pointerdown", "touchstart", "keydown", "wheel", "click"].forEach(function (ev) {
        addEventListener(ev, onGesture, { capture: true, passive: true });
      });
    });
  }
  var waited = 0;
  (function wait() { /* wait until the splash curtain is completely gone */
    if (closed) return;
    if (!document.getElementById("cur0") || waited > 4000) return begin();
    waited += 60;
    setTimeout(wait, 60);
  })();

  enter.addEventListener("click", close);
  skip.addEventListener("click", close);
  addEventListener("keydown", function (e) { if (e.key === "Escape") close(); });
})();
