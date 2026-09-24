(function () {
  'use strict';
  var rows = Array.from(document.querySelectorAll('.bw-comparison-row'));
  function pauseAll() {
    document.querySelectorAll('video').forEach(function (video) { video.pause(); });
  }
  rows.forEach(function (row) {
    var videos = Array.from(row.querySelectorAll('video'));
    videos.forEach(function (video) {
      video.addEventListener('error', function () {
        video.closest('figure').querySelector('.bw-comparison-error').hidden = false;
      });
      video.addEventListener('loadeddata', function () {
        video.closest('figure').querySelector('.bw-comparison-error').hidden = true;
      });
    });
    row.querySelector('[data-action="play"]').addEventListener('click', function () {
      pauseAll();
      videos.forEach(function (video) {
        video.currentTime = 0;
        var promise = video.play();
        if (promise) promise.catch(function () { /* Native controls remain available. */ });
      });
    });
    row.querySelector('[data-action="pause"]').addEventListener('click', function () {
      videos.forEach(function (video) { video.pause(); });
    });
    row.querySelectorAll('[data-clip]').forEach(function (button) {
      button.addEventListener('click', function () {
        videos.forEach(function (video) {
          video.pause();
          var base = './static/videos/' + video.dataset.method + '/' + button.dataset.clip;
          video.src = base + '.mp4?v=realrobot-v1';
          video.poster = base + '.jpg?v=realrobot-v1';
          video.closest('figure').querySelector('.bw-comparison-error').hidden = true;
          video.closest('figure').querySelector('.bw-comparison-error a').href = video.src;
          video.load();
        });
        row.querySelectorAll('[data-clip]').forEach(function (item) {
          item.setAttribute('aria-pressed', String(item === button));
        });
      });
    });
  });
  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) entry.target.querySelectorAll('video').forEach(function (video) { video.pause(); });
      });
    });
    rows.forEach(function (row) { observer.observe(row); });
  }
  document.addEventListener('visibilitychange', function () { if (document.hidden) pauseAll(); });
})();
