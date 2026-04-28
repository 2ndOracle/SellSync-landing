(function () {
  'use strict';

  function track(name, props) {
    if (typeof umami === 'undefined' || !umami.track) return;
    umami.track(name, props);
  }

  function eventPropsFromDataset(el) {
    var props = {};
    for (var key in el.dataset) {
      if (!Object.prototype.hasOwnProperty.call(el.dataset, key)) continue;
      if (key === 'event') continue;
      if (key.indexOf('event') !== 0) continue;
      var propName = key.slice(5);
      propName = propName.charAt(0).toLowerCase() + propName.slice(1);
      props[propName] = el.dataset[key];
    }
    return props;
  }

  document.addEventListener('click', function (e) {
    var el = e.target.closest('[data-event]');
    if (!el) return;
    if (el.tagName === 'DETAILS' || el.tagName === 'SUMMARY') return;
    track(el.dataset.event, eventPropsFromDataset(el));
  });

  document.querySelectorAll('details[data-event="faq_open"]').forEach(function (d) {
    d.addEventListener('toggle', function () {
      if (!d.open) return;
      track('faq_open', {
        question: d.dataset.eventQuestion || 'unknown',
        page: d.dataset.eventPage || 'unknown'
      });
    });
  });

  var marks = [50, 75, 100];
  var fired = {};
  var pageSlug = (document.body && document.body.dataset.page) || 'unknown';

  function checkScroll() {
    var doc = document.documentElement;
    var bottom = (doc.scrollTop || window.pageYOffset) + window.innerHeight;
    var total = doc.scrollHeight;
    if (total <= window.innerHeight) {
      if (!fired[100]) {
        fired[100] = true;
        track('scroll_depth', { depth: '100', page: pageSlug });
      }
      return;
    }
    var pct = (bottom / total) * 100;
    for (var i = 0; i < marks.length; i++) {
      var m = marks[i];
      if (!fired[m] && pct >= m) {
        fired[m] = true;
        track('scroll_depth', { depth: String(m), page: pageSlug });
      }
    }
    if (fired[50] && fired[75] && fired[100]) {
      window.removeEventListener('scroll', onScroll);
    }
  }

  var ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    setTimeout(function () { ticking = false; checkScroll(); }, 200);
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  checkScroll();
})();
