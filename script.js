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
