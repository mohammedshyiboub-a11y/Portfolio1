/* =====================================================================
   v2.js - Extra motion layer (runs after main.js). Safe to remove.
   ===================================================================== */
(function () {
  var calm = false;

  /* Hero name: split by WORDS (never letters, so Arabic letters keep joining) */
  var h = document.querySelector(".hero h1");
  if (h && !calm) {
    var t = h.textContent.trim();
    h.setAttribute("aria-label", t);
    h.innerHTML = t.split(/\s+/).map(function (w, i) {
      return '<span class="w" aria-hidden="true"><i style="--d:' + i + '">' + w + "</i></span>";
    }).join("");
  }
  if (calm) return;

  /* Cursor ring that follows the mouse and grows over interactive things */
  if (matchMedia("(hover:hover)").matches) {
    var r = document.createElement("div"), x = 0, y = 0, tx = 0, ty = 0;
    r.id = "ring"; document.body.appendChild(r);
    addEventListener("pointermove", function (e) {
      if (e.pointerType != "mouse") return;
      tx = e.clientX; ty = e.clientY; r.classList.add("on");
      r.classList.toggle("big", !!(e.target.closest && e.target.closest("a,button,.ib,.card,.fl,input,textarea")));
    });
    (function loop() { x += (tx - x) * .18; y += (ty - y) * .18; r.style.transform = "translate(" + x + "px," + y + "px)"; requestAnimationFrame(loop); })();
  }

  /* Button ripple */
  document.addEventListener("pointerdown", function (e) {
    var b = e.target.closest && e.target.closest(".btn");
    if (!b) return;
    var q = b.getBoundingClientRect(), s = Math.max(q.width, q.height), p = document.createElement("span");
    p.className = "rp go";
    p.style.cssText = "width:" + s + "px;height:" + s + "px;left:" + (e.clientX - q.left - s / 2) + "px;top:" + (e.clientY - q.top - s / 2) + "px";
    b.appendChild(p); setTimeout(function () { p.remove(); }, 750);
  });

  /* Scroll parallax: photo drifts (hero text stays fully visible) */
  var ph = document.querySelector(".photo"), hg = document.querySelector(".hgrid");
  addEventListener("scroll", function () {
    var y = scrollY; if (y > 900) return;
    if (ph) ph.style.translate = "0 " + (y * .12) + "px";
  }, { passive: true });

  /* Photo 3D tilt following the mouse */
  if (ph) {
    ph.addEventListener("pointermove", function (e) {
      if (e.pointerType != "mouse") return;
      var q = ph.getBoundingClientRect(), a = (e.clientX - q.left) / q.width - .5, b = (e.clientY - q.top) / q.height - .5;
      ph.style.transform = "perspective(800px) rotateY(" + a * 14 + "deg) rotateX(" + -b * 14 + "deg)";
    });
    ph.addEventListener("pointerleave", function () { ph.style.transform = ""; });
  }

  /* Contact icons: soft magnetic pull */
  document.querySelectorAll(".ib").forEach(function (el) {
    el.addEventListener("pointermove", function (e) {
      if (e.pointerType != "mouse") return;
      var q = el.getBoundingClientRect();
      el.style.setProperty("--tx", (e.clientX - q.left - q.width / 2) * .18 + "px");
      el.style.translate = (e.clientX - q.left - q.width / 2) * .18 + "px 0";
    });
    el.addEventListener("pointerleave", function () { el.style.translate = ""; });
  });

  /* Hero chips in the marquee speed up a little while scrolling */
  var mt = document.querySelectorAll(".mt"), to;
  addEventListener("scroll", function () {
    mt.forEach(function (m) { m.style.animationDuration = "12s"; });
    clearTimeout(to);
    to = setTimeout(function () { mt.forEach(function (m, i) { m.style.animationDuration = ""; }); }, 400);
  }, { passive: true });
})();
