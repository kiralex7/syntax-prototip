/* Сцена «было → стало» — движок прототипа. Без зависимостей.
 *
 * Картинка «до» — обычный <img> (её видно сразу и её видит поиск).
 * Поверх — холст, на котором «после» видно только там, где открыто:
 *   — маска руки: мазки кисти, только добавляются, никогда не стираются;
 *   — пятна прогресса: растут по порядку рассказа, в конце — дозаливка целиком.
 * Прогресс приходит снаружи: setScroll(s) — прокрутка, setTime(t) — самостоятельный рост.
 * Общий прогресс e = 1 − (1 − s)(1 − t); без отката он только растёт.
 * Маски живут в координатах картинки, в четверть стороны: мягкий край получается сам.
 */
(function () {
  'use strict';
  var Q = 4;

  function plavno(a, b, x) {
    x = Math.min(1, Math.max(0, (x - a) / (b - a)));
    return x * x * (3 - 2 * x);
  }
  function shum(n) { var x = Math.sin(n * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); }

  function Scena(okno, opt) {
    var self = this;
    this.okno = okno;
    this.img = okno.querySelector('.scena-do');
    this.cv = okno.querySelector('.scena-posle');
    this.ctx = this.cv.getContext('2d');
    this.W = opt.W; this.H = opt.H;
    this.fx = opt.fokus[0]; this.fy = opt.fokus[1];
    this.pyatna = opt.pyatna || [];
    this.dprMax = opt.dprMax || 1.5;
    this.img.style.objectPosition = (this.fx * 100) + '% ' + (this.fy * 100) + '%';

    this.ruka = document.createElement('canvas');
    this.ruka.width = Math.ceil(this.W / Q); this.ruka.height = Math.ceil(this.H / Q);
    this.rctx = this.ruka.getContext('2d');
    this.sbor = document.createElement('canvas');
    this.sbor.width = this.ruka.width; this.sbor.height = this.ruka.height;
    this.sctx = this.sbor.getContext('2d');
    this.mini = document.createElement('canvas'); this.mini.width = 64; this.mini.height = 36;
    this.mctx = this.mini.getContext('2d', { willReadFrequently: true });

    this.posle = null;
    this.s = 0; this.t = 0; this.e = 0; this.eMax = 0;
    this.otkat = false;     // true — при прокрутке назад открытое прокруткой закрывается (мазки остаются)
    this.oreol = null;      // {x, y, r} — временный ореол у курсора, в маску руки не пишется
    this.vse = false;       // показать «после» целиком (мигание для проверки пары)
    this.kadr = 0;
    this.kadrov = 0;        // счётчик отрисовок — для замера частоты кадров
    // Что перерисовать на холсте: 'vse' — весь экран, иначе прямоугольник в точках картинки.
    // Без видеокарты полная перерисовка экрана 1920×1080 стоит десятки мс — поэтому рисуем только изменившееся.
    this.gr = 'vse';
    this.ePrev = 0;
    this._risuj = function () { self.kadr = 0; self.risovat(); };
    this.razmer();
    window.addEventListener('resize', function () { self.razmer(); });
  }

  // Геометрия «как object-fit: cover» с той же точкой привязки, что у <img>.
  Scena.prototype.razmer = function () {
    var r = this.okno.getBoundingClientRect();
    this.dpr = Math.min(window.devicePixelRatio || 1, this.dprMax);
    this.cw = r.width; this.ch = r.height;
    this.cv.width = Math.max(1, Math.round(r.width * this.dpr));
    this.cv.height = Math.max(1, Math.round(r.height * this.dpr));
    this.k = Math.max(r.width / this.W, r.height / this.H);
    this.dw = this.W * this.k; this.dh = this.H * this.k;
    this.ox = (r.width - this.dw) * this.fx;
    this.oy = (r.height - this.dh) * this.fy;
    this.gr = 'vse';
    this.zaprosit();
  };

  Scena.prototype.pometit = function (x0, y0, x1, y1) {
    if (this.gr === 'vse') return;
    if (!this.gr) { this.gr = { x0: x0, y0: y0, x1: x1, y1: y1 }; return; }
    this.gr.x0 = Math.min(this.gr.x0, x0); this.gr.y0 = Math.min(this.gr.y0, y0);
    this.gr.x1 = Math.max(this.gr.x1, x1); this.gr.y1 = Math.max(this.gr.y1, y1);
  };
  Scena.prototype.pometitVse = function () { this.gr = 'vse'; this.zaprosit(); };

  // Ореол — временный: помечаем и старое, и новое место.
  Scena.prototype.setOreol = function (o) {
    var b = this.oreol;
    if (b) this.pometit(b.x - b.r, b.y - b.r, b.x + b.r, b.y + b.r);
    if (o) this.pometit(o.x - o.r, o.y - o.r, o.x + o.r, o.y + o.r);
    this.oreol = o; this.zaprosit();
  };

  Scena.prototype.vKartinku = function (cx, cy) {
    var r = this.okno.getBoundingClientRect();
    return { x: (cx - r.left - this.ox) / this.k, y: (cy - r.top - this.oy) / this.k };
  };

  Scena.prototype.zagruzit = function (url) {
    var self = this, im = new Image();
    im.decoding = 'async';
    im.src = url;
    return (im.decode ? im.decode() : new Promise(function (ok) { im.onload = ok; })).then(function () {
      self.posle = im; self.pometitVse(); return im;
    });
  };

  // Мягкий круг в маску (координаты и радиус — в точках картинки).
  function krug(c, x, y, r, sila) {
    var g = c.createRadialGradient(x / Q, y / Q, 0, x / Q, y / Q, r / Q);
    g.addColorStop(0, 'rgba(0,0,0,' + sila + ')');
    g.addColorStop(0.55, 'rgba(0,0,0,' + (sila * 0.85) + ')');
    g.addColorStop(1, 'rgba(0,0,0,0)');
    c.fillStyle = g; c.beginPath(); c.arc(x / Q, y / Q, r / Q, 0, Math.PI * 2); c.fill();
  }

  // Мазок от точки a к точке b без разрывов при быстром движении.
  Scena.prototype.mazok = function (a, b, r) {
    var dx = b.x - a.x, dy = b.y - a.y, shag = Math.max(2, r / 4);
    var n = Math.max(1, Math.ceil(Math.hypot(dx, dy) / shag));
    for (var i = 1; i <= n; i++) krug(this.rctx, a.x + dx * i / n, a.y + dy * i / n, r, 1);
    this.pometit(Math.min(a.x, b.x) - r, Math.min(a.y, b.y) - r, Math.max(a.x, b.x) + r, Math.max(a.y, b.y) + r);
    this.zaprosit();
  };

  Scena.prototype.setScroll = function (s) { this.s = s; this.obnovit(); };
  Scena.prototype.setTime = function (t) { this.t = t; this.obnovit(); };
  Scena.prototype.obnovit = function () {
    var syroj = 1 - (1 - this.s) * (1 - this.t);
    this.eMax = Math.max(this.eMax, syroj);
    this.e = this.otkat ? syroj : this.eMax;
    // помечаем только пятна, чей размер изменился; дозаливка меняет весь кадр
    if (this.e !== this.ePrev) {
      if (plavno(0.88, 1, this.e) !== plavno(0.88, 1, this.ePrev)) this.gr = 'vse';
      for (var i = 0; i < this.pyatna.length; i++) {
        var p = this.pyatna[i];
        if (plavno(p.ot, p.do, this.e) !== plavno(p.ot, p.do, this.ePrev)) {
          var R = p.r * 1.4;
          this.pometit(p.x - R, p.y - R, p.x + R, p.y + R);
        }
      }
      this.ePrev = this.e;
    }
    this.zaprosit();
  };

  Scena.prototype.sbros = function () {
    this.rctx.clearRect(0, 0, this.ruka.width, this.ruka.height);
    this.s = 0; this.t = 0; this.e = 0; this.eMax = 0; this.ePrev = 0; this.oreol = null;
    this.pometitVse();
  };

  // Доля картинки, открытая рукой, в процентах (по крошечной копии — дёшево).
  Scena.prototype.pokrytieRuki = function () {
    var c = this.mctx;
    c.clearRect(0, 0, 64, 36); c.drawImage(this.ruka, 0, 0, 64, 36);
    var d = c.getImageData(0, 0, 64, 36).data, n = 0;
    for (var i = 3; i < d.length; i += 4) if (d[i] > 128) n++;
    return Math.round(n / (64 * 36) * 100);
  };

  Scena.prototype.zaprosit = function () {
    if (!this.kadr) this.kadr = requestAnimationFrame(this._risuj);
  };

  // Пятна прогресса и дозаливка при прогрессе e — в маску c (размер маски руки).
  // У каждого пятна своё окно прогресса [ot, do], форма — несколько смещённых кругов.
  Scena.prototype.maskaProgressa = function (s, w, h, e) {
    for (var i = 0; i < this.pyatna.length; i++) {
      var p = this.pyatna[i], g = plavno(p.ot, p.do, e);
      if (g <= 0) continue;
      var rr = p.r * g;
      for (var j = 0; j < 5; j++) {
        var u = shum(i * 31 + j * 7), v = shum(i * 31 + j * 7 + 3), z = shum(i * 31 + j * 7 + 5);
        var ug = u * Math.PI * 2, dl = rr * 0.35 * v;
        krug(s, p.x + Math.cos(ug) * dl, p.y + Math.sin(ug) * dl, rr * (0.6 + 0.35 * z), 1);
      }
    }
    var f = plavno(0.88, 1, e);
    if (f > 0) { s.globalAlpha = f; s.fillStyle = '#000'; s.fillRect(0, 0, w, h); s.globalAlpha = 1; }
  };

  // Сколько процентов картинки откроется при прогрессе e без кисти — для панели («предел ≈ N% картинки»).
  Scena.prototype.dolja = function (e) {
    if (!this.dc) {
      this.dc = document.createElement('canvas');
      this.dc.width = this.ruka.width; this.dc.height = this.ruka.height;
      this.dctx = this.dc.getContext('2d', { willReadFrequently: true });
    }
    var c = this.dctx, w = this.dc.width, h = this.dc.height;
    c.clearRect(0, 0, w, h);
    this.maskaProgressa(c, w, h, e);
    var d = c.getImageData(0, 0, w, h).data, n = 0;
    for (var i = 3; i < d.length; i += 4) if (d[i] > 128) n++;
    return Math.round(n / (w * h) * 100);
  };

  Scena.prototype.risovat = function () {
    if (!this.posle) return;
    this.kadrov++;
    var s = this.sctx, w = this.sbor.width, h = this.sbor.height, e = this.e;
    s.globalCompositeOperation = 'source-over';
    s.globalAlpha = 1;
    s.clearRect(0, 0, w, h);
    s.drawImage(this.ruka, 0, 0);
    if (this.oreol) krug(s, this.oreol.x, this.oreol.y, this.oreol.r, 0.9);
    this.maskaProgressa(s, w, h, e);

    var c = this.ctx, gr = this.gr;
    if (!gr) return;
    this.gr = null;
    c.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    c.save();
    if (gr !== 'vse') {
      // прямоугольник из точек картинки — в точки экрана, с запасом на растяжение маски
      var zap = Q * this.k * 2;
      var x0 = Math.max(0, Math.floor(gr.x0 * this.k + this.ox - zap)), y0 = Math.max(0, Math.floor(gr.y0 * this.k + this.oy - zap));
      var x1 = Math.min(this.cw, Math.ceil(gr.x1 * this.k + this.ox + zap)), y1 = Math.min(this.ch, Math.ceil(gr.y1 * this.k + this.oy + zap));
      if (x1 <= x0 || y1 <= y0) { c.restore(); return; }
      c.beginPath(); c.rect(x0, y0, x1 - x0, y1 - y0); c.clip();
      c.clearRect(x0, y0, x1 - x0, y1 - y0);
    } else {
      c.clearRect(0, 0, this.cw, this.ch);
    }
    c.globalCompositeOperation = 'source-over';
    c.drawImage(this.posle, this.ox, this.oy, this.dw, this.dh);
    if (!this.vse) {
      c.globalCompositeOperation = 'destination-in';
      c.imageSmoothingEnabled = true;
      c.drawImage(this.sbor, this.ox, this.oy, this.dw, this.dh);
    }
    c.restore();
  };

  window.Scena = Scena;
})();
