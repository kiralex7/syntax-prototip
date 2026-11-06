/* Блоки после сцен v2 (07.11.2026): основная форма и точки-переходы.
 * Основная форма: пустую не отправить; после отправки — «Спасибо» на месте формы. Прототип: заявка никуда не уходит,
 * для проверок кладётся в window.v2ZayavkaOsnovnaya.
 * Точки-переходы сцен прячутся, когда последняя сцена ушла с экрана больше чем наполовину. */
(function () {
  'use strict';
  var forma = document.getElementById('b2-forma');
  if (forma) {
    var spasibo = document.getElementById('b2-spasibo');
    forma.addEventListener('submit', function (e) {
      e.preventDefault();
      var pusto = Array.prototype.filter.call(forma.querySelectorAll('input[required]'), function (i) { return !i.value.trim(); });
      forma.querySelectorAll('input').forEach(function (i) { i.removeAttribute('aria-invalid'); });
      if (pusto.length) { pusto.forEach(function (i) { i.setAttribute('aria-invalid', 'true'); }); pusto[0].focus(); return; }
      window.v2ZayavkaOsnovnaya = { name: forma.name.value, contact: forma.contact.value, sfera: forma.sfera.value, usluga: forma.usluga.value };
      forma.hidden = true; spasibo.hidden = false;
    });
  }
  var tochki = document.querySelector('.v2-tochki');
  var sceny = document.querySelectorAll('.scena-sekciya');
  var poslednyaya = sceny[sceny.length - 1];
  if (tochki && poslednyaya) {
    var zhdet = false;
    var proverit = function () {
      zhdet = false;
      tochki.classList.toggle('skryty', poslednyaya.getBoundingClientRect().bottom < innerHeight * 0.5);
    };
    addEventListener('scroll', function () { if (!zhdet) { zhdet = true; requestAnimationFrame(proverit); } }, { passive: true });
    proverit();
  }
})();
