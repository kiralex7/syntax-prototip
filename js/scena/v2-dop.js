/* Прототип v2 — короткая форма с выбранной услугой и точки-переходы к сценам. 07.11.2026.
 * Кнопка с data-usluga открывает форму, услуга уже выбрана, вместе с заявкой — сцена, откуда открыли.
 * Заявка никуда не уходит: это прототип. Для живого сайта обработчику формы нужны поля «usluga» и «scena» (задача Антону). */
(function () {
  'use strict';
  var fon = document.querySelector('.v2-forma-fon');
  var forma = fon.querySelector('form');
  var usluga = document.getElementById('v2-usluga');
  var scena = document.getElementById('v2-scena');
  var polya = forma.querySelector('.v2-polya'), spasibo = forma.querySelector('.v2-spasibo');
  var otkuda = null;

  function otkryt(knopka) {
    otkuda = knopka;
    usluga.value = knopka.dataset.usluga || 'audit';
    var sek = knopka.closest('.scena-sekciya');
    scena.value = sek ? sek.dataset.ekran : 'шапка';
    polya.hidden = false; spasibo.hidden = true; forma.reset(); usluga.value = knopka.dataset.usluga || 'audit';
    fon.hidden = false;
    document.body.style.overflow = 'hidden';
    setTimeout(function () { forma.querySelector('input[name=name]').focus(); }, 50);
  }
  function zakryt() {
    fon.hidden = true;
    document.body.style.overflow = '';
    if (otkuda) otkuda.focus();
  }
  document.querySelectorAll('[data-usluga]').forEach(function (k) {
    k.addEventListener('click', function (e) { e.preventDefault(); otkryt(k); });
  });
  fon.querySelector('.v2-zakryt').addEventListener('click', zakryt);
  fon.addEventListener('click', function (e) { if (e.target === fon) zakryt(); });
  addEventListener('keydown', function (e) { if (e.key === 'Escape' && !fon.hidden) zakryt(); });
  forma.addEventListener('submit', function (e) {
    e.preventDefault();
    var pusto = Array.prototype.filter.call(forma.querySelectorAll('input[required]'), function (i) { return !i.value.trim(); });
    if (pusto.length) { pusto[0].focus(); pusto[0].setAttribute('aria-invalid', 'true'); return; }
    window.v2Zayavka = { name: forma.name.value, contact: forma.contact.value, usluga: usluga.value, scena: scena.value };
    polya.hidden = true; spasibo.hidden = false;
  });

  // Точки-переходы: подсвечена сцена, которая сейчас на экране
  var tochki = document.querySelectorAll('.v2-tochki a');
  if ('IntersectionObserver' in window && tochki.length) {
    var nabl = new IntersectionObserver(function (z) {
      z.forEach(function (x) {
        if (!x.isIntersecting) return;
        var k = x.target.closest('.scena-sekciya').dataset.ekran;
        tochki.forEach(function (t) { t.classList.toggle('on', t.dataset.k === k); });
      });
    }, { threshold: 0.6 });
    document.querySelectorAll('.scena-sekciya .scena-okno').forEach(function (o) { nabl.observe(o); });
  }
})();
