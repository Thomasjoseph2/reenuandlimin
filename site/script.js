/* ============================================================
   Renu's Wedding — countdown + add-to-calendar
   Wedding: Monday, 4 January 2027, 11:00 AM  (India, +05:30)
   ============================================================ */

// Target time in IST. "+05:30" keeps the countdown correct for every guest,
// no matter what time zone their phone is in.
var WEDDING = new Date('2027-01-04T11:00:00+05:30');

/* ---------- Countdown ---------- */
(function () {
  var elDays  = document.getElementById('cd-days');
  var elHours = document.getElementById('cd-hours');
  var elMins  = document.getElementById('cd-mins');
  var elSecs  = document.getElementById('cd-secs');
  var elDone  = document.getElementById('cd-done');
  var grid    = document.getElementById('countdown');
  if (!elDays) return;

  function pad(n) { return n < 10 ? '0' + n : '' + n; }

  function tick() {
    var diff = WEDDING.getTime() - Date.now();

    if (diff <= 0) {
      if (grid) grid.hidden = true;
      if (elDone) elDone.hidden = false;
      clearInterval(timer);
      return;
    }

    var s = Math.floor(diff / 1000);
    var days  = Math.floor(s / 86400);
    var hours = Math.floor((s % 86400) / 3600);
    var mins  = Math.floor((s % 3600) / 60);
    var secs  = s % 60;

    elDays.textContent  = days;
    elHours.textContent = pad(hours);
    elMins.textContent  = pad(mins);
    elSecs.textContent  = pad(secs);
  }

  tick();
  var timer = setInterval(tick, 1000);
})();

/* ---------- Add to calendar (downloads an .ics file) ---------- */
(function () {
  var btn = document.getElementById('calBtn');
  if (!btn) return;

  btn.addEventListener('click', function (e) {
    e.preventDefault();

    // 11:00 and 13:00 IST -> UTC (05:30 and 07:30)
    var ics = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Renu Wedding//EN',
      'BEGIN:VEVENT',
      'UID:renu-wedding-2027@github',
      'DTSTAMP:20261114T000000Z',
      'DTSTART:20270104T053000Z',
      'DTEND:20270104T073000Z',
      'SUMMARY:Wedding of Renu Elizabeth Kuruvilla & Limin Thomas',
      'LOCATION:St. George Orthodox Church, Chathannoor (Valiyapally)',
      'DESCRIPTION:With joy we invite you to our wedding. 11:00 AM.',
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');

    var blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = 'Renu-Wedding.ics';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  });
})();

/* ---------- RSVP form (submits to Netlify Forms via AJAX) ---------- */
(function () {
  var form = document.getElementById('rsvpForm');
  if (!form) return;

  // The form posts to Google Forms via a hidden iframe (no page reload).
  // We just swap in a thank-you message once it's submitted.
  form.addEventListener('submit', function () {
    var btn = form.querySelector('button[type="submit"]');
    if (btn) { btn.disabled = true; btn.textContent = 'Sending...'; }
    setTimeout(function () {
      form.hidden = true;
      var thanks = document.getElementById('rsvpThanks');
      if (thanks) thanks.hidden = false;
    }, 600);
  });
})();

/* ---------- Gentle reveal on scroll ---------- */
(function () {
  if (!('IntersectionObserver' in window)) return;
  var items = document.querySelectorAll('.section__title, .story__card, .details__card, .gallery__grid img, .family__inner');
  items.forEach(function (el) { el.classList.add('reveal'); });

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (en.isIntersecting) {
        en.target.classList.add('reveal--in');
        io.unobserve(en.target);
      }
    });
  }, { threshold: 0.12 });

  items.forEach(function (el) { io.observe(el); });
})();

/* ---------- Background music toggle ---------- */
(function () {
  var audio = document.getElementById('bgMusic');
  var btn = document.getElementById('musicBtn');
  if (!audio || !btn) return;

  function setPlaying(on) {
    btn.classList.toggle('is-playing', on);
    btn.setAttribute('aria-label', on ? 'Pause music' : 'Play music');
    btn.title = on ? 'Pause music' : 'Play music';
  }

  btn.addEventListener('click', function () {
    if (audio.paused) {
      audio.play().then(function () { setPlaying(true); }).catch(function () {});
    } else {
      audio.pause();
      setPlaying(false);
    }
  });

  // Try to start softly on the guest's first interaction (browsers block autoplay).
  var started = false;
  function startOnce(e) {
    if (started) return;
    started = true;
    document.removeEventListener('pointerdown', startOnce);
    // If the first tap was the button itself, let its own handler decide.
    if (e && btn.contains(e.target)) return;
    audio.play().then(function () { setPlaying(true); }).catch(function () {});
  }
  document.addEventListener('pointerdown', startOnce);

  audio.addEventListener('pause', function () { setPlaying(false); });
  audio.addEventListener('play', function () { setPlaying(true); });
})();
