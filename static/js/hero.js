(function () {
  var root = document.getElementById('bridgewam-teaser');
  if (!root) return;

  var tabs = Array.from(root.querySelectorAll('[role="tab"]'));
  var panels = Array.from(root.querySelectorAll('[role="tabpanel"]'));
  var status = root.querySelector('#bw-teaser-status');
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  function play(video) {
    var promise = video.play();
    // Native controls remain available when the browser disallows autoplay.
    if (promise) promise.catch(function () {});
  }

  function activate(tab, replay) {
    panels.forEach(function (panel) {
      var active = panel.id === tab.getAttribute('aria-controls');
      panel.hidden = !active;
      panel.querySelectorAll('video').forEach(function (video) {
        video.pause();
        if (!active) return;
        if (video.dataset.src) {
          video.src = video.dataset.src;
          delete video.dataset.src;
          video.load();
        }
        video.currentTime = 0;
        if (replay || !reduceMotion.matches) play(video);
      });
    });
    tabs.forEach(function (button) {
      button.setAttribute('aria-selected', String(button === tab));
      button.tabIndex = button === tab ? 0 : -1;
    });
    var panel = document.getElementById(tab.getAttribute('aria-controls'));
    var count = panel.querySelectorAll('video').length;
    status.textContent = tab.firstChild.textContent + ' · ' + count + (count === 1 ? ' setting' : ' settings');
  }

  tabs.forEach(function (tab, index) {
    tab.addEventListener('click', function () { activate(tab, false); });
    tab.addEventListener('keydown', function (event) {
      var next;
      if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
      if (event.key === 'ArrowLeft') next = (index + tabs.length - 1) % tabs.length;
      if (event.key === 'Home') next = 0;
      if (event.key === 'End') next = tabs.length - 1;
      if (next === undefined) return;
      event.preventDefault();
      tabs[next].focus();
      activate(tabs[next], false);
    });
  });

  root.querySelectorAll('video').forEach(function (video) {
    video.addEventListener('error', function () {
      video.closest('figure').querySelector('.bw-video-error').hidden = false;
    });
    // A pending play request must not restart a task after it was hidden.
    video.addEventListener('play', function () {
      if (video.closest('[role="tabpanel"]').hidden) video.pause();
    });
  });

  root.querySelector('.bw-replay').addEventListener('click', function () {
    activate(tabs.find(function (tab) { return tab.getAttribute('aria-selected') === 'true'; }), true);
  });

  document.addEventListener('visibilitychange', function () {
    if (document.hidden) root.querySelectorAll('video').forEach(function (video) { video.pause(); });
  });

  activate(tabs[0], false);
})();
