/* =====================================================================
   main.js - All behaviour of the portfolio page.
   Needs js/lang/en.js and js/lang/ar.js to be loaded first (window.LANG).
   Every section below is wrapped in START / END comments.
   ===================================================================== */

/* ---------- START: 1. Global state & helpers ----------
   "calm" = visitor asked the OS for reduced motion (animations get skipped).
   "L" = current language code ("en" or "ar"). Each language has its own page (/ and /ar/),
   so the language is read from <html lang> that the build step wrote. */
var calm = false;
var L = document.documentElement.lang == "ar" ? "ar" : "en";
if (!window.LANG[L]) L = "en";
var BASE =
  L == "ar"
    ? "../"
    : ""; /* the Arabic page lives in /ar/, so assets are one level up */
/* ---------- END: 1. Global state & helpers ---------- */

/* ---------- START: 1b. Theme (dark by default, light on request) ----------
   index.html sets data-theme on <html> before first paint (dark unless the visitor chose light).
   setTheme() flips it, remembers the choice, updates the browser UI colour and the particle colours. */
var pal = {};
function readPal() {
  var cs = getComputedStyle(document.documentElement),
    g = function (k) {
      return cs.getPropertyValue(k).trim();
    };
  var light = document.documentElement.getAttribute("data-theme") == "light";
  pal = light
    ? {
        dot: "rgba(37,99,235,.55)",
        line: "37,99,235",
        mouse: "109,91,255",
        lineA: 0.22,
        mouseA: 0.5,
      }
    : {
        dot: "rgba(140,170,255,.7)",
        line: "110,150,255",
        mouse: "139,124,255",
        lineA: 0.28,
        mouseA: 0.6,
      };
  var meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute("content", g("--bg"));
}
function setTheme(t, save) {
  var root = document.documentElement;
  if (!calm) {
    root.classList.add("theme-anim");
    setTimeout(function () {
      root.classList.remove("theme-anim");
    }, 450);
  }
  root.setAttribute("data-theme", t);
  if (save) {
    try {
      localStorage.setItem("theme", t);
    } catch (e) {}
  }
  readPal();
  themeLabel();
}
function themeLabel() {
  var b = document.getElementById("theme"),
    light = document.documentElement.getAttribute("data-theme") == "light",
    d = LANG[L].ui;
  if (!b) return;
  b.setAttribute("aria-label", light ? d.thD : d.thL);
  b.title = light ? d.thD : d.thL;
}
document.getElementById("theme").onclick = function () {
  setTheme(
    document.documentElement.getAttribute("data-theme") == "light"
      ? "dark"
      : "light",
    true,
  );
};
readPal();
/* ---------- END: 1b. Theme ---------- */

/* ---------- START: 2. Contact form (opens the visitor's mail app) ----------
   Builds a mailto: link from the form fields and shows a confirmation message. */
function sendMail(f) {
  var d = LANG[L].ui,
    n = f.fn.value.trim(),
    e = f.fe.value.trim(),
    m = f.fm.value.trim();
  location.href =
    "mailto:mohammedshyiboub@gmail.com?subject=" +
    encodeURIComponent(d.subj + n) +
    "&body=" +
    encodeURIComponent(m + "\n\n— " + n + "\n" + e);
  document.getElementById("fst").textContent = d.fOk;
  return false;
}
/* ---------- END: 2. Contact form ---------- */

/* ---------- START: 3. Timeline / course card template ----------
   Returns the HTML of one experience or course card. */
function item(x) {
  var hoursLabel = L == "ar" ? " ساعة" : " hours";
  var tag = x.hours
    ? '<span class="tag"><span class="cn" data-c="' +
      x.hours +
      '">' +
      x.hours +
      "</span>" +
      hoursLabel +
      "</span>"
    : "";
  var lg = x.logo
    ? '<img class="lg" src="' +
      BASE +
      "assets/logos/" +
      x.logo +
      '.png" alt="" width="60" height="60" loading="lazy">'
    : "";
  return (
    '<div class="card rv' +
    (x.current ? " now" : "") +
    (x.logo ? " hl" : "") +
    '"><div class="ch">' +
    lg +
    '<div class="ct"><h3>' +
    x.title +
    "</h3>" +
    '<div class="meta"><span>' +
    x.org +
    "</span><span>" +
    x.date +
    "</span>" +
    tag +
    "</div></div></div>" +
    "<p>" +
    x.body +
    "</p></div>"
  );
}
/* ---------- END: 3. Timeline / course card template ---------- */

/* ---------- START: 4. render() - draws the page in the current language ----------
   Sets lang/dir on <html> (RTL for Arabic), fills every [data-i] text and [data-p]
   placeholder, and rebuilds marquee, timeline, courses and skills lists. */
function render() {
  var rtl = L == "ar",
    D = LANG[L],
    d = D.ui;

  document.documentElement.lang = L;
  document.documentElement.dir = rtl ? "rtl" : "ltr";

  /* static texts and placeholders */
  document.querySelectorAll("[data-i]").forEach(function (n) {
    n.textContent = d[n.dataset.i];
  });
  document.querySelectorAll("[data-p]").forEach(function (n) {
    n.placeholder = d[n.dataset.p];
  });

  /* marquee rows: row 1 = design skills, row 2 = professional skills
     (technical skills have their own "Technical Background" section) */
  var sk = D.skills;
  function mk(a, n) {
    var h = a
      .map(function (x) {
        return "<span>" + x + "</span>";
      })
      .join("");
    var out = "";
    for (var i = 0; i < n; i++)
      out += h; /* repeated so the loop never shows a gap */
    return out;
  }
  document.getElementById("m1").innerHTML = mk(sk[0].items, 4);
  document.getElementById("m2").innerHTML = mk(sk[1].items, 6);

  /* experience timeline, courses and skills section */
  document.getElementById("tl").innerHTML = D.experience.map(item).join("");
  document.getElementById("courses").innerHTML = D.courses.map(item).join("");
  document.getElementById("sk").innerHTML = sk
    .map(function (g) {
      return (
        '<div class="skr rv"><h3>' +
        g.title +
        '</h3><div class="skc">' +
        g.items
          .map(function (s, i) {
            return (
              "<span" +
              (i < (g.core || 0) ? ' class="pr"' : "") +
              ">" +
              s +
              "</span>"
            );
          })
          .join("") +
        "</div></div>"
      );
    })
    .join("");

  /* technical background: its own section */
  document.getElementById("tk").innerHTML = D.tech
    .map(function (g) {
      return (
        '<div class="card rv"><h3>' +
        g.title +
        '</h3><div class="skc">' +
        g.items
          .map(function (s) {
            return "<span>" + s + "</span>";
          })
          .join("") +
        "</div></div>"
      );
    })
    .join("");

  /* project tags (pills above each project title) */
  document.querySelectorAll(".pt").forEach(function (n) {
    n.innerHTML = D.projectTags[+n.dataset.t]
      .map(function (x) {
        return "<span>" + x + "</span>";
      })
      .join("");
  });

  themeLabel(); /* theme button label in the current language */

  watch(); /* re-attach scroll reveal to the new elements */
  bindNums(); /* re-attach number counters */
}
/* ---------- END: 4. render() ---------- */

/* ---------- START: 5. Reveal on scroll ----------
   Adds the "in" class to .rv / .tl elements when they enter the viewport. */
var io =
  "IntersectionObserver" in window
    ? new IntersectionObserver(
        function (es) {
          es.forEach(function (e) {
            if (e.isIntersecting) {
              var t = e.target;
              t.classList.add("in");
              io.unobserve(t);
              setTimeout(function () {
                t.style.transitionDelay = "";
              }, 1400);
            }
          });
        },
        { threshold: 0.12 },
      )
    : null;

function watch() {
  document
    .querySelectorAll(".rv:not(.in),.tl:not(.in)")
    .forEach(function (n, k) {
      n.style.transitionDelay = (k % 4) * 90 + "ms"; /* small stagger */
      io ? io.observe(n) : n.classList.add("in");
    });
}
/* ---------- END: 5. Reveal on scroll ---------- */

/* ---------- START: 6. Language switch link ----------
   #lang is a normal link to the other language's page (/ <-> /ar/) so search engines can follow it.
   JS only adds the current #section to it so the visitor stays where they were. */
document.getElementById("lang").addEventListener("click", function (e) {
  if (e.metaKey || e.ctrlKey || e.shiftKey || e.button) return;
  e.preventDefault();
  location.href = this.getAttribute("href") + location.hash;
});
/* ---------- END: 6. Language switch link ---------- */

/* ---------- START: 7. Mobile menu ----------
   Opens/closes the nav links on small screens; closes after a link is tapped. */
var m = document.getElementById("menu"),
  lk = document.getElementById("links");
m.onclick = function () {
  var o = lk.classList.toggle("open");
  m.setAttribute("aria-expanded", o);
};
lk.onclick = function (e) {
  if (e.target.tagName == "A") {
    lk.classList.remove("open");
    m.setAttribute("aria-expanded", "false");
  }
};
/* ---------- END: 7. Mobile menu ---------- */

/* ---------- START: 8. Active nav link on scroll ----------
   Highlights the nav link of the section currently on screen. */
var secs = [].slice.call(document.querySelectorAll("main section"));
addEventListener(
  "scroll",
  function () {
    var y = scrollY + 120,
      c = "home";
    secs.forEach(function (s) {
      if (s.offsetTop <= y) c = s.id;
    });
    if (c == "technical")
      c = "skills"; /* Technical Background has no menu link: keep Skills lit */
    document.querySelectorAll(".links a").forEach(function (a) {
      a.classList.toggle("on", a.getAttribute("href") == "#" + c);
    });
  },
  { passive: true },
);
/* ---------- END: 8. Active nav link on scroll ---------- */

/* ---------- START: 9. First render ----------
   Draw the page once now that all helpers are defined. */
render();
/* ---------- END: 9. First render ---------- */

/* ---------- START: 10. Scroll progress bar ----------
   Scales the top bar from 0 to 100% according to the scroll position. */
var bar = document.getElementById("bar");
addEventListener(
  "scroll",
  function () {
    var h = document.documentElement.scrollHeight - innerHeight;
    bar.style.transform =
      "scaleX(" + (h > 0 ? Math.min(scrollY / h, 1) : 0) + ")";
  },
  { passive: true },
);
/* ---------- END: 10. Scroll progress bar ---------- */

/* ---------- START: 11. Rotating text under the role ----------
   Shows the next line from LANG[L].rotating every 2.6 seconds. */
var ri = 0,
  rot = document.getElementById("rot");
function tick() {
  var a = LANG[L].rotating;
  rot.style.animation = "none";
  void rot.offsetWidth; /* restart the CSS animation */
  rot.style.animation = "";
  rot.textContent = a[ri++ % a.length];
}
tick();
setInterval(tick, 2600);
/* ---------- END: 11. Rotating text ---------- */

/* ---------- START: 12. Card spotlight & project tilt ----------
   Moves the spotlight gradient with the pointer on every card; project cards also tilt in 3D. */
addEventListener("pointermove", function (e) {
  if (e.pointerType != "mouse")
    return; /* touch: no spotlight, no tilt (they would fight with scrolling) */
  var c = e.target.closest && e.target.closest(".card");
  if (!c) return;
  var r = c.getBoundingClientRect();
  c.style.setProperty("--mx", e.clientX - r.left + "px");
  c.style.setProperty("--my", e.clientY - r.top + "px");
  if (
    !calm &&
    e.pointerType == "mouse" &&
    c.parentNode.classList.contains("proj")
  ) {
    var x = (e.clientX - r.left) / r.width - 0.5,
      y = (e.clientY - r.top) / r.height - 0.5;
    c.style.transform =
      "perspective(900px) rotateY(" +
      x * 3 +
      "deg) rotateX(" +
      -y * 3 +
      "deg) translateY(-4px)";
  }
});
document.querySelectorAll(".proj .card").forEach(function (c) {
  c.addEventListener("pointerleave", function () {
    c.style.transform = "";
  });
});
/* ---------- END: 12. Card spotlight & project tilt ---------- */

/* ---------- START: 13. Counting numbers ----------
   Animates numbers from 0 to their target (data-n / data-c) when they scroll into view. */
function ease(t) {
  return 1 - Math.pow(1 - t, 3);
}

function count(n) {
  var t = +(n.dataset.n != null ? n.dataset.n : n.dataset.c),
    s = performance.now(),
    D = 2000;
  (function f(now) {
    var p = Math.min((now - s) / D, 1);
    n.textContent = Math.round(t * ease(p));
    if (p < 1) requestAnimationFrame(f);
  })(s);
}

var no =
  "IntersectionObserver" in window && !calm
    ? new IntersectionObserver(
        function (es) {
          es.forEach(function (e) {
            if (!e.isIntersecting) return;
            no.unobserve(e.target);
            var sd = e.target.closest(".stats div");
            if (sd) sd.classList.add("go");
            count(e.target);
          });
        },
        { threshold: 0.3 },
      )
    : null;

function bindNums() {
  if (no === undefined) return;
  document.querySelectorAll("[data-n],[data-c]").forEach(function (n) {
    if (n.dataset.bound) return;
    n.dataset.bound = 1;
    var t = n.dataset.n != null ? n.dataset.n : n.dataset.c;
    if (!no) {
      /* no observer or reduced motion: show final number */
      n.textContent = t;
      var sd = n.closest(".stats div");
      if (sd) sd.classList.add("go");
      return;
    }
    n.textContent = "0";
    no.observe(n);
  });
}
bindNums();
/* ---------- END: 13. Counting numbers ---------- */

/* ---------- START: 14. Extra animations (skipped when reduced motion is on) ----------
   Intro curtain, cursor glow, magnetic buttons, parallax orbs and the particle canvas. */
(function () {
  var c0 = document.getElementById("cur0");
  /* ----- START: 14a. Intro curtain -----
     Opens the curtain after 0.85s and removes it from the page.
     Runs on every device (also with reduced motion) so the logo splash + intro video always show. */
  if (c0)
    setTimeout(function () {
      c0.classList.add("go");
      setTimeout(function () {
        c0.remove();
      }, 1100);
    }, 850);
  /* ----- END: 14a. Intro curtain ----- */

  if (calm) return; /* the extra effects below stay off for reduced motion */

  /* ----- START: 14b. Cursor glow -----
     A soft light that eases toward the mouse position. */
  var g = document.getElementById("glow"),
    gx = 0,
    gy = 0,
    tx = 0,
    ty = 0;
  addEventListener("pointermove", function (e) {
    if (e.pointerType != "mouse") return;
    tx = e.clientX;
    ty = e.clientY;
    g.classList.add("on");
  });
  (function loop() {
    gx += (tx - gx) * 0.12;
    gy += (ty - gy) * 0.12;
    g.style.transform = "translate(" + gx + "px," + gy + "px)";
    requestAnimationFrame(loop);
  })();
  /* ----- END: 14b. Cursor glow ----- */

  /* ----- START: 14c. Magnetic buttons -----
     Main buttons lean slightly toward the mouse. */
  document.querySelectorAll(".btn.pri,.cta .btn,.cvb").forEach(function (b) {
    b.addEventListener("pointermove", function (e) {
      if (e.pointerType != "mouse") return;
      var r = b.getBoundingClientRect();
      b.style.transform =
        "translate(" +
        (e.clientX - r.left - r.width / 2) * 0.25 +
        "px," +
        (e.clientY - r.top - r.height / 2) * 0.35 +
        "px)";
    });
    b.addEventListener("pointerleave", function () {
      b.style.transform = "";
    });
  });
  /* ----- END: 14c. Magnetic buttons ----- */

  /* ----- START: 14d. Parallax orbs -----
     Hero background orbs move at different speeds while scrolling. */
  var orbs = document.querySelectorAll(".orb");
  addEventListener(
    "scroll",
    function () {
      var y = scrollY;
      if (y > 900) return;
      orbs.forEach(function (o, i) {
        o.style.translate = "0 " + y * (i ? -0.15 : 0.25) + "px";
      });
    },
    { passive: true },
  );
  /* ----- END: 14d. Parallax orbs ----- */

  /* ----- START: 14e. Particle constellation (hero canvas) -----
     Floating dots joined by lines when close; they also connect to and avoid the mouse. */
  var cv = document.getElementById("fx"),
    cx = cv.getContext("2d"),
    W,
    H,
    P = [],
    mx = -999,
    my = -999,
    vis = true;

  function size() {
    var r = cv.parentNode.getBoundingClientRect(),
      d = Math.min(devicePixelRatio || 1, 2);
    W = r.width;
    H = r.height;
    cv.width = W * d;
    cv.height = H * d;
    cx.setTransform(d, 0, 0, d, 0, 0);
    var n = Math.round(Math.min((W * H) / 14000, 90));
    P = [];
    for (var i = 0; i < n; i++) {
      P.push({
        x: Math.random() * W,
        y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        r: Math.random() * 1.6 + 0.6,
      });
    }
  }
  size();
  addEventListener("resize", size);

  cv.parentNode.addEventListener("pointermove", function (e) {
    if (e.pointerType != "mouse") {
      mx = my = -999;
      return;
    } /* fingers never push the particles */
    var r = cv.getBoundingClientRect();
    mx = e.clientX - r.left;
    my = e.clientY - r.top;
  });
  cv.parentNode.addEventListener("pointerleave", function () {
    mx = my = -999;
  });
  if ("IntersectionObserver" in window) {
    /* pause drawing while the hero is off screen */
    new IntersectionObserver(function (es) {
      vis = es[0].isIntersecting;
    }).observe(cv.parentNode);
  }

  function draw() {
    requestAnimationFrame(draw);
    if (!vis) return;
    cx.clearRect(0, 0, W, H);
    for (var i = 0; i < P.length; i++) {
      var a = P[i];
      a.x += a.vx;
      a.y += a.vy;
      if (a.x < 0 || a.x > W) a.vx *= -1;
      if (a.y < 0 || a.y > H) a.vy *= -1;

      /* push dots away from the mouse */
      var dx = a.x - mx,
        dy = a.y - my,
        dd = dx * dx + dy * dy;
      if (dd < 14000) {
        var f = (1 - dd / 14000) * 0.8;
        a.x += dx * f * 0.05;
        a.y += dy * f * 0.05;
      }

      /* the dot */
      cx.fillStyle = pal.dot;
      cx.beginPath();
      cx.arc(a.x, a.y, a.r, 0, 6.283);
      cx.fill();

      /* lines to nearby dots */
      for (var j = i + 1; j < P.length; j++) {
        var b = P[j],
          x = a.x - b.x,
          y = a.y - b.y,
          d2 = x * x + y * y;
        if (d2 < 11000) {
          cx.strokeStyle =
            "rgba(" + pal.line + "," + (1 - d2 / 11000) * pal.lineA + ")";
          cx.lineWidth = 1;
          cx.beginPath();
          cx.moveTo(a.x, a.y);
          cx.lineTo(b.x, b.y);
          cx.stroke();
        }
      }

      /* line to the mouse */
      var mdx = a.x - mx,
        mdy = a.y - my,
        md = mdx * mdx + mdy * mdy;
      if (md < 26000) {
        cx.strokeStyle =
          "rgba(" + pal.mouse + "," + (1 - md / 26000) * pal.mouseA + ")";
        cx.beginPath();
        cx.moveTo(a.x, a.y);
        cx.lineTo(mx, my);
        cx.stroke();
      }
    }
  }
  draw();
  /* ----- END: 14e. Particle constellation ----- */
})();
/* ---------- END: 14. Extra animations ---------- */
