/* =====================================================================
   intro.js - LIVE intro (built with HTML/CSS/JS, no video file) shown right after the logo splash.
   Order: logo splash -> curtain opens -> intro plays -> the voice-over starts the moment the final logo screen appears (12.2s) -> "Enter website" button.
   - Sound is never muted. If the browser blocks sound until the visitor touches the page, the intro still
     starts and the voice-over joins (in sync) on the first touch/click/key - no extra screen.
   - The animation is drawn on a 1280x720 (landscape) or 720x1280 (portrait) board that is scaled to fit
     any screen, and it follows the voice-over file (assets/audio/intro-voice.mp3) as its clock.
   - Plays on every visit (not when switching EN <-> AR). ?intro=0 skips it, ?intro=1 forces it.
   - Esc jumps straight to the "Enter website" button (Esc again closes). The Skip button and the Enter button close it. Safe to remove: this file, its <script> tag,
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
  var light = document.documentElement.getAttribute("data-theme") === "light";
  var base =
    /\/ar\/?(index\.html)?$/.test(location.pathname) || ar ? "../" : "";
  var tr = ar
    ? {
        skip: "تخطي",
        enter: "دخول للموقع",
        sound: "اضغط لتشغيل الصوت",
        start: "اضغط للبدء",
        tagline: "تصميم جميل. وتجربة تعمل بذكاء.",
        websites: "المواقع الإلكترونية",
        mobile: "تطبيقات الموبايل",
        dashboards: "لوحات التحكم",
        cases: "دراسات الحالة",
        layout: "التخطيط · الألوان · الخطوط",
        navigation: "التنقل · التسلسل البصري",
        components: "المكونات · الحركة",
        flows: "مسارات الاستخدام · التغذية الراجعة",
        charts: "الرسوم · البطاقات · الأنظمة",
        insight: "الرؤى · سهولة القراءة",
        screens: "الشاشات النهائية",
        research: "البحث · الاختبار",
        webSub: "تخطيط واضح وتسلسل بصري يقود المستخدم",
        mobSub: "شاشات سهلة الاستخدام ومسارات طبيعية",
        dashSub: "بيانات معقدة بشكل واضح وسهل القراءة",
        caseSub: "الرحلة كاملة من البحث إلى الواجهة النهائية",
        clearNav: "تنقل واضح",
        primary: "إجراء أساسي واحد",
        focus: "ركز على المحتوى",
        keyNumbers: "الأرقام المهمة أولًا",
        hover: "تفاصيل عند التفاعل",
        understand: "افهم المستخدمين",
        inEvery: "في كل تصميم",
        chips: [
          "بحث المستخدم",
          "تصميم الواجهات",
          "النماذج الأولية",
          "تجربة المستخدم",
        ],
        role: "محمد شيبوب هدهد · مصمم UI/UX",
      }
    : {
        skip: "Skip",
        enter: "Enter website",
        sound: "Tap for sound",
        start: "Tap to start",
        tagline: "Looks right. Works right.",
        websites: "Websites",
        mobile: "Mobile Apps",
        dashboards: "Dashboards",
        cases: "Case Studies",
        layout: "Layout · Color · Type",
        navigation: "Navigation · Hierarchy",
        components: "Components · Motion",
        flows: "Flows · Feedback",
        charts: "Charts · Cards · Systems",
        insight: "Insight · Scanning",
        screens: "Final screens",
        research: "Research · Testing",
        webSub: "Clear layout, hierarchy and a path to action",
        mobSub: "Thumb-friendly screens that flow naturally",
        dashSub: "Complex data made calm, fast and readable",
        caseSub: "The full story: research to final interface",
        clearNav: "Clear navigation",
        primary: "One primary action",
        focus: "Focus the content",
        keyNumbers: "Key numbers first",
        hover: "Hover for detail",
        understand: "Understand users",
        inEvery: "in every design",
        chips: [
          "User research",
          "Interface design",
          "Prototyping",
          "User experience",
        ],
        role: "Mohammed Shyiboub Hedhed · UI/UX Designer",
      };
  box.classList.toggle("iv-light", light);
  st.setAttribute("dir", ar ? "rtl" : "ltr");
  st.style.fontFamily = ar
    ? '"IBM Plex Sans Arabic", sans-serif'
    : '"Inter", system-ui, sans-serif';
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

  skip.textContent = tr.skip;

  /* ---------- content ---------- */
  var L = function (w) {
    return '<b style="width:' + w + '%"></b>';
  };
  var CH = [tr.websites, tr.mobile, tr.dashboards, tr.cases];
  function sc(n, name, sub, tabs, a, b, mock) {
    var m = (b - a) / 2;
    return (
      '<section class="lv-sc" data-a="' +
      a +
      '" data-b="' +
      b +
      '"><header><div><small>0' +
      n +
      " / 04</small><h2>" +
      name +
      "</h2><p>" +
      sub +
      '</p></div><div class="lv-tabs">' +
      tabs
        .map(function (t, i) {
          return (
            '<span data-h="' +
            (a + 0.7 + i * m) +
            "-" +
            (a + 0.7 + (i + 1) * m) +
            '">' +
            t +
            "</span>"
          );
        })
        .join("") +
      '</div></header><div class="lv-mock">' +
      mock +
      "</div></section>"
    );
  }
  function co(t, a, b, x, y) {
    return (
      '<div class="lv-co" data-a="' +
      a +
      '" data-b="' +
      b +
      '" style="' +
      (ar ? "right:" : "left:") +
      x +
      "%;top:" +
      y +
      '%">' +
      t +
      "</div>"
    );
  }
  var cards = [1, 2, 3]
    .map(function (i) {
      return (
        '<div class="lv-cd"><i class="lv-g' +
        i +
        '"></i>' +
        L(80) +
        L(55) +
        "</div>"
      );
    })
    .join("");
  var web =
    '<div class="lv-win"><div class="lv-bar"><i></i><i></i><i></i></div><div class="lv-nav"><u></u><span><s></s><s></s><s></s></span><em></em></div><div class="lv-hero"><div class="lv-tx">' +
    L(75) +
    L(55) +
    L(40) +
    '<div class="lv-btn" data-a="3.6"></div></div><div class="lv-pic"></div></div><div class="lv-cds">' +
    cards +
    "</div></div>" +
    co(tr.clearNav, 3.7, 5, 38, 8) +
    co(tr.primary, 4.2, 5, 14, 52);
  var ph = function (x) {
    return (
      '<div class="lv-ph"><div class="lv-scr">' +
      L(40) +
      '<div class="lv-big"></div>' +
      '<div class="lv-row"><i></i>' +
      L(60) +
      '</div><div class="lv-row"><i></i>' +
      L(50) +
      "</div>" +
      (x || "") +
      "</div></div>"
    );
  };
  var mob =
    '<div class="lv-phs">' +
    ph() +
    ph('<div class="lv-pill"></div>') +
    "</div>" +
    co(tr.focus, 6.1, 7.2, 30, 34);
  var dash =
    '<div class="lv-win lv-dash"><div class="lv-side"><i></i><s></s><s></s><s></s></div><div class="lv-main"><div class="lv-kp"><u></u><u></u><u></u></div><div class="lv-chs"><div class="lv-bars">' +
    [55, 80, 45, 90, 65, 75]
      .map(function (h) {
        return '<i style="height:' + h + '%"></i>';
      })
      .join("") +
    '</div><div class="lv-don"></div></div></div></div>' +
    co(tr.keyNumbers, 8.1, 10, 34, 14) +
    co(tr.hover, 8.7, 10, 56, 44);
  var cs =
    '<div class="lv-cols">' +
    [
      ar ? "01 البحث" : "01 Research",
      ar ? "02 الهياكل" : "02 Wireframes",
      ar ? "03 الواجهة" : "03 Final UI",
    ]
      .map(function (c, i) {
        return (
          "<div><h4>" +
          c +
          '</h4><div class="lv-cc lv-k' +
          i +
          '">' +
          L(70) +
          L(50) +
          L(60) +
          "</div></div>"
        );
      })
      .join("") +
    "</div>" +
    co(tr.understand, 10.7, 12, 12, 30);
  var pg = [2.2, 5, 7.2, 10]
    .map(function (a, i, r) {
      return (
        '<i data-a="' + a + '" data-d="' + ((r[i + 1] || 12.2) - a) + '"></i>'
      );
    })
    .join("");
  var chips = tr.chips
    .map(function (c) {
      return "<span>" + c + "</span>";
    })
    .join("");

  st.innerHTML =
    '<section class="lv-sc lv-tt" data-a="0.2" data-b="2.2"><h1><span>UI</span><em>/</em><span>UX</span></h1><hr data-a="0.9"><p data-a="1.1">' +
    tr.tagline +
    "</p></section>" +
    sc(1, tr.websites, tr.webSub, [tr.layout, tr.navigation], 2.2, 5, web) +
    sc(2, tr.mobile, tr.mobSub, [tr.components, tr.flows], 5, 7.2, mob) +
    sc(3, tr.dashboards, tr.dashSub, [tr.charts, tr.insight], 7.2, 10, dash) +
    sc(4, tr.cases, tr.caseSub, [tr.screens, tr.research], 10, 12.2, cs) +
    '<div class="lv-pgb" data-a="2.2" data-b="12.2">' +
    pg +
    "</div>" +
    '<section class="lv-sc lv-end" data-a="12.2"><h1><span>UI</span><em>/</em><span>UX</span></h1><p>' +
    tr.inEvery +
    '</p><div class="lv-chips">' +
    chips +
    '</div><img src="' +
    base +
    'assets/logo.png" alt="" width="320" height="152"><small>' +
    tr.role +
    "</small>" +
    '<button class="btn pri big ivgo" id="iven" type="button" data-a="17.3"><span>' +
    tr.enter +
    '</span><svg class="ar" viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6"/></svg></button></section>';
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

  /* ---------- clock: the voice-over file drives everything ----------
     One continuous clock: it follows the audio while the audio is really playing, and keeps counting on its own
     when the audio is blocked, paused or finished - so starting the sound late never makes the clock jump back. */
  var END_T = 17.3; /* the second the "Enter website" button appears */
  var VOICE_T = 12.2; /* the second the final logo screen starts to appear - the voice-over starts exactly here */
  var closed = false,
    started = false,
    raf = 0,
    soundOn = false,
    synced = false,
    hint = null,
    voiceStarted = false,
    blocked = false;
  var ref = { t: 0, p: performance.now() };
  au.src = base + "assets/audio/intro-voice.mp3";
  au.preload = "auto";
  au.muted = false;
  au.volume = 1;
  function audioPlaying() {
    return synced && !au.paused && !au.ended && au.currentTime > 0;
  }
  function now() {
    if (audioPlaying()) {
      ref.t = VOICE_T + au.currentTime;
      ref.p = performance.now();
      return ref.t;
    }
    return ref.t + (performance.now() - ref.p) / 1000;
  }
  function jump(t) {
    ref.t = t;
    ref.p = performance.now();
  }
  function frame() {
    var t = now();
    els.forEach(function (e) {
      var a = +e.getAttribute("data-a"),
        b = e.getAttribute("data-b");
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
    if (t >= END_T && !skip.hidden) {
      skip.hidden = true;
      skip.style.display = "none";
      try {
        enter.focus({ preventScroll: true });
      } catch (e) {}
    }
    if (t >= VOICE_T && !voiceStarted && !blocked) playVoiceAfterIntro();
    raf = requestAnimationFrame(frame);
  }
  function run() {
    if (started || closed) return;
    started = true;
    removeGate();
    jump(0);
    frame();
  }
  function close() {
    if (closed) return;
    closed = true;
    cancelAnimationFrame(raf);
    removeEventListener("resize", fit);
    stopWatching();
    hideHint();
    box.classList.add("out");
    document.documentElement.style.overflow = "";
    setTimeout(function () {
      au.pause();
      box.remove();
    }, 700);
  }

  /* ---------- sound: voice-over starts the moment the final logo screen starts to appear (VOICE_T) ---------- */
  var GEST = ["pointerdown", "mousedown", "touchend", "click", "keydown"];
  function stopWatching() {
    GEST.forEach(function (ev) {
      removeEventListener(ev, onGesture, true);
    });
  }
  function hideHint() {
    if (hint) {
      hint.remove();
      hint = null;
    }
  }
  function showHint() {
    if (hint || soundOn || closed || now() < VOICE_T) return;
    hint = document.createElement("button");
    hint.type = "button";
    hint.className = "btn ivsnd2";
    hint.innerHTML =
      '<svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M11 5 6 9H2v6h4l5 4V5z"/><path d="M15.5 8.5a5 5 0 0 1 0 7M19 5a10 10 0 0 1 0 14"/></svg><span>' +
      tr.sound +
      "</span>";
    hint.addEventListener("click", function () {
      blocked = false;
      playVoiceAfterIntro();
    });
    skip.parentNode.insertBefore(hint, skip);
  }
  function soundStarted() {
    soundOn = true;
    stopWatching();
    hideHint();
  }
  function playVoiceAfterIntro() {
    if (closed || !started || voiceStarted || now() < VOICE_T) return;
    voiceStarted = true;
    /* if the sound was unlocked late (after the logo screen already appeared), join in sync instead of restarting */
    var off = now() - VOICE_T;
    if (au.duration && off >= au.duration - 0.15) {
      soundStarted();
      return;
    }
    try {
      au.currentTime = Math.max(0, off);
    } catch (e) {}
    au.muted = false;
    var p = au.play();
    if (p && p.then)
      p.then(soundStarted, function () {
        voiceStarted = false;
        blocked = true; /* stop retrying every frame; the next tap/click/key retries */
        showHint();
        GEST.forEach(function (ev) {
          addEventListener(ev, onGesture, { capture: true, passive: true });
        });
      });
    else soundStarted();
  }
  function onGesture(e) {
    blocked = false;
    if (
      e.type === "keydown" &&
      (e.key === "Escape" || e.key === "Tab" || e.key === "Shift")
    )
      return;
    var el = e.target;
    if (el && el.closest && el.closest("#ivs, #iven")) return;
    playVoiceAfterIntro();
  }
  function begin() {
    if (started || closed) return;
    /* Unlock the audio element during the start-button click, silently.
       The actual voice-over begins at VOICE_T, when the final logo screen appears. */
    au.muted = true;
    var p = au.play();
    if (p && p.then)
      p.then(
        function () {
          au.pause();
          try {
            au.currentTime = 0;
          } catch (e) {}
          au.muted = false;
          run();
        },
        function () {
          au.muted = false;
          run();
          GEST.forEach(function (ev) {
            addEventListener(ev, onGesture, { capture: true, passive: true });
          });
        },
      );
    else {
      au.pause();
      au.muted = false;
      run();
    }
  }
  /* ---------- start gate: one centred button the visitor must press, so the voice-over can always play ---------- */
  var gateEl = null;
  function removeGate() {
    if (gateEl) {
      gateEl.remove();
      gateEl = null;
    }
  }
  function gate() {
    if (closed || started || gateEl) return;
    gateEl = document.createElement("div");
    gateEl.className = "ivgate";
    gateEl.innerHTML =
      '<img src="' +
      base +
      'assets/logo.png" alt="" width="240" height="114"><button type="button" class="btn pri big ivstart"><span>' +
      tr.start +
      '</span><svg class="ar" viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg></button>';
    box.appendChild(gateEl);
    var b = gateEl.querySelector("button");
    b.addEventListener("click", function () {
      removeGate();
      begin();
    }); /* play() runs inside the click = allowed */
    try {
      b.focus({ preventScroll: true });
    } catch (e) {}
  }
  var waited = 0;
  (function wait() {
    /* wait until the splash curtain is completely gone */
    if (closed || started) return;
    if (!document.getElementById("cur0") || waited > 4000) return gate();
    waited += 60;
    setTimeout(wait, 60);
  })();

  /* ---------- buttons & keys ---------- */
  function goEnd() {
    /* jump to the final screen where the "Enter website" button is */
    if (closed) return;
    if (!started) run();
    jump(END_T);
    au.pause();
    voiceStarted = true;
    soundOn = true;
    stopWatching();
    hideHint();
    cancelAnimationFrame(raf);
    frame();
  }
  enter.addEventListener("click", close);
  skip.addEventListener("click", close);
  addEventListener("keydown", function (e) {
    if (e.key !== "Escape" || closed) return;
    if (started && now() >= END_T) close();
    else goEnd();
  });
})();
