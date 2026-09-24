// Local initialization: no jQuery or external CDN is required.
(function () {
  function initialize() {
    document.querySelectorAll('.navbar-burger').forEach(function (burger) {
      burger.addEventListener('click', function () {
        var active = burger.classList.toggle('is-active');
        burger.setAttribute('aria-expanded', String(active));
        document.querySelectorAll('.navbar-menu').forEach(function (menu) {
          menu.classList.toggle('is-active', active);
        });
      });
    });
    if (document.querySelector('.carousel') && window.bulmaCarousel) {
      window.bulmaCarousel.attach('.carousel', {
        slidesToScroll: 1, slidesToShow: 3, loop: true, autoplay: false
      });
    }
    if (document.querySelector('input.slider') && window.bulmaSlider) {
      window.bulmaSlider.attach();
    }
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
  } else {
    initialize();
  }
})();
