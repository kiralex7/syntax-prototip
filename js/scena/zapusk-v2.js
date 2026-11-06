/* Сцена «было → стало» — запуск прототипа: экраны по порядку, варианты A/B/C, кисть, время, прокрутка, панель сравнения.
 * Адрес: /prototip-scena?v=a|b|c&panel=1&tekst=0
 * Клавиши: 1/2/3 — вариант, R — сначала, P — панель, T — текст.
 * 06.11: второй экран — фасад с оффером; рост начинается через 5 с после появления экрана; разгон роста на панели;
 * подписи панели словами и подсказки при наведении; в итоге показа — докуда дошёл рост.
 * 07.11, v2: копия zapusk.js для prototip-v2.html; на экране в вертикальном положении — своя вертикальная пара сцены (mobil), если есть.
 * 06.11, ночь: кисть, ореол и прокрутка — через 0,5 с после того, как экран встал целиком (компьютер); шестой экран — бюро.
 * 06.11, вечер: третий, четвёртый и пятый экраны — приёмная, кабинет руководителя, диспетчерская; положение текста на панели — у каждого свой выбор.
 */
(function () {
  'use strict';

  var W = 1672, H = 941;
  // Экраны. Пятна — точки картинки 1672×941, по порядку рассказа: что меняется и когда открывается.
  var EKRANY = {
    ceh: {
      imya: 'цех',
      // Вертикальная пара (телефон), точки картинки 941×1672. 07.11, пары из Загрузок 07.11 00:26–00:55.
      mobil: {
        W: 941, H: 1672, posle: 'img/sceny/ceh/mobil-posle.v1.webp',
        pyatna: [
          { x: 520, y: 950, r: 260, ot: 0.00, do: 0.32 },   // проход → робот-тележка
          { x: 140, y: 1000, r: 300, ot: 0.06, do: 0.38 },   // верстак слева → рабочее место с экраном
          { x: 150, y: 470, r: 260, ot: 0.12, do: 0.44 },   // окна слева → экраны
          { x: 520, y: 620, r: 230, ot: 0.18, do: 0.50 },   // глубина цеха, торец
          { x: 830, y: 700, r: 260, ot: 0.22, do: 0.54 },   // станки справа → ячейки
          { x: 470, y: 180, r: 520, ot: 0.30, do: 0.64 },   // кровля и свет
          { x: 600, y: 1300, r: 420, ot: 0.38, do: 0.74 },   // пол спереди
          { x: 200, y: 1450, r: 330, ot: 0.44, do: 0.80 },   // левый низ
          { x: 470, y: 1620, r: 520, ot: 0.55, do: 0.88 }   // низ
        ]
      },
      fokus: [0.62, 0.55],              // точка привязки кадра: торец и проход не уходят за край на телефоне
      posle: 'img/sceny/ceh/posle.v1.webp',
      pyatna: [
        { x: 180, y: 420, r: 280, ot: 0.00, do: 0.30 },   // доска с бумагами → экран с показателями
        { x: 390, y: 790, r: 340, ot: 0.10, do: 0.42 },   // стол мастера → рабочее место
        { x: 760, y: 560, r: 320, ot: 0.22, do: 0.55 },   // станки → новые станки
        { x: 1120, y: 690, r: 270, ot: 0.34, do: 0.66 },  // проход → робот-тележка
        { x: 1500, y: 520, r: 380, ot: 0.45, do: 0.78 },  // стеллажи → ячейки с роботом
        { x: 1080, y: 500, r: 220, ot: 0.55, do: 0.80 },  // торец целиком одним пятном
        { x: 1000, y: 150, r: 560, ot: 0.60, do: 0.90 }   // кровля и свет
      ],
      // На телефоне в кадре только середина картинки (примерно x 770–1200): доска и стол — за краем.
      // Поэтому порядок другой: сначала то, что видно, иначе первую пятую прокрутки ничего не меняется.
      pyatnaTelefon: [
        { x: 760, y: 560, r: 320, ot: 0.00, do: 0.35 },   // станки
        { x: 1120, y: 690, r: 270, ot: 0.08, do: 0.42 },  // проход → робот-тележка
        { x: 1080, y: 500, r: 230, ot: 0.22, do: 0.58 },  // торец
        { x: 1000, y: 150, r: 560, ot: 0.38, do: 0.85 },  // кровля и свет
        { x: 180, y: 420, r: 280, ot: 0.50, do: 0.85 },   // доска — за краем кадра
        { x: 390, y: 790, r: 340, ot: 0.50, do: 0.85 },   // стол — за краем кадра
        { x: 1500, y: 520, r: 380, ot: 0.50, do: 0.85 }   // ячейки — за краем кадра
      ]
    },
    fasad: {
      imya: 'фасад',
      // Вертикальная пара для экранов в вертикальном положении (телефон). Координаты — точки картинки 941×1672. 07.11.
      mobil: {
        W: 941, H: 1672, posle: 'img/sceny/fasad/mobil-posle.v1.webp',
        pyatna: [
          { x: 470, y: 750, r: 240, ot: 0.00, do: 0.35 },   // глухие ворота → стеклянный вход
          { x: 470, y: 290, r: 200, ot: 0.05, do: 0.40 },   // фронтон → знак S и надпись SYNTAX.HELP
          { x: 470, y: 500, r: 190, ot: 0.12, do: 0.45 },   // арочное окно над входом
          { x: 80, y: 620, r: 210, ot: 0.18, do: 0.50 },    // окна слева
          { x: 860, y: 640, r: 210, ot: 0.18, do: 0.50 },   // окна и будка справа
          { x: 120, y: 900, r: 220, ot: 0.24, do: 0.56 },   // поддоны → газон и фонари
          { x: 840, y: 900, r: 220, ot: 0.24, do: 0.56 },   // шлагбаум → кусты и фонарь
          { x: 470, y: 1150, r: 460, ot: 0.30, do: 0.70 },  // мостовая у входа
          { x: 470, y: 1500, r: 520, ot: 0.40, do: 0.80 },  // мостовая внизу
          { x: 470, y: 90, r: 520, ot: 0.50, do: 0.85 },    // небо
          { x: 90, y: 90, r: 260, ot: 0.55, do: 0.88 },     // дерево
          { x: 850, y: 250, r: 160, ot: 0.55, do: 0.88 }    // труба и крыша справа
        ]
      },
      fokus: [0.52, 0.6],               // вход и знак S в кадре на телефоне
      posle: 'img/sceny/fasad/posle.v1.webp',
      pyatna: [
        { x: 795, y: 600, r: 230, ot: 0.00, do: 0.30 },   // глухие ворота → стеклянный вход под навесом
        { x: 950, y: 300, r: 170, ot: 0.08, do: 0.36 },   // фронтон → знак S
        { x: 560, y: 430, r: 270, ot: 0.15, do: 0.45 },   // окна слева от входа → свет внутри
        { x: 400, y: 720, r: 260, ot: 0.22, do: 0.52 },   // поддоны и ящики → машина и кусты
        { x: 1200, y: 500, r: 300, ot: 0.30, do: 0.60 },  // окна справа → свет внутри
        { x: 1520, y: 640, r: 220, ot: 0.38, do: 0.66 },  // шлагбаум и проходная → ворота со знаком
        { x: 760, y: 170, r: 380, ot: 0.45, do: 0.75 },   // кровля → стеклянная надстройка
        { x: 1230, y: 300, r: 200, ot: 0.48, do: 0.76 },  // кровля справа
        { x: 950, y: 860, r: 480, ot: 0.50, do: 0.82 },   // мостовая → подсветка и разметка
        { x: 170, y: 220, r: 300, ot: 0.58, do: 0.88 },   // дерево
        { x: 1450, y: 150, r: 420, ot: 0.60, do: 0.90 }   // небо
      ],
      // На телефоне в кадре примерно x 680–1115: вход, знак, середина окон.
      pyatnaTelefon: [
        { x: 795, y: 600, r: 230, ot: 0.00, do: 0.35 },   // вход
        { x: 950, y: 300, r: 170, ot: 0.05, do: 0.40 },   // знак S
        { x: 1050, y: 480, r: 260, ot: 0.15, do: 0.50 },  // окна в кадре
        { x: 950, y: 860, r: 480, ot: 0.30, do: 0.70 },   // мостовая
        { x: 900, y: 180, r: 380, ot: 0.38, do: 0.78 },   // кровля
        { x: 400, y: 720, r: 260, ot: 0.50, do: 0.85 },   // дальше — за краем кадра
        { x: 560, y: 430, r: 270, ot: 0.50, do: 0.85 },
        { x: 1200, y: 500, r: 300, ot: 0.50, do: 0.85 },
        { x: 1520, y: 640, r: 220, ot: 0.50, do: 0.85 },
        { x: 170, y: 220, r: 300, ot: 0.50, do: 0.88 },
        { x: 1450, y: 150, r: 420, ot: 0.50, do: 0.88 }
      ]
    },
    priyomnaya: {
      imya: 'приёмная',
      // Вертикальная пара (телефон), точки картинки 941×1672. 07.11, пары из Загрузок 07.11 00:26–00:55.
      mobil: {
        W: 941, H: 1672, posle: 'img/sceny/priyomnaya/mobil-posle.v1.webp',
        pyatna: [
          { x: 470, y: 860, r: 330, ot: 0.00, do: 0.32 },   // стойка «ЗАЯВКИ» → стойка SYNTAX.HELP
          { x: 470, y: 520, r: 230, ot: 0.06, do: 0.38 },   // вывеска → экран «Чем помочь?»
          { x: 480, y: 690, r: 150, ot: 0.12, do: 0.42 },   // стеллаж за стойкой → робот
          { x: 90, y: 700, r: 220, ot: 0.20, do: 0.50 },   // шкафы слева
          { x: 790, y: 420, r: 260, ot: 0.26, do: 0.56 },   // окно-арка справа
          { x: 150, y: 330, r: 240, ot: 0.30, do: 0.60 },   // доска и часы слева
          { x: 470, y: 120, r: 420, ot: 0.36, do: 0.70 },   // лампы и потолок
          { x: 470, y: 1200, r: 480, ot: 0.44, do: 0.80 },   // пол у стойки
          { x: 470, y: 1550, r: 520, ot: 0.55, do: 0.88 }   // пол внизу
        ]
      },
      fokus: [0.65, 0.5],               // на телефоне в кадре робот, надпись SYNTAX.HELP и круг «98%»
      posle: 'img/sceny/priyomnaya/posle.v1.webp',
      pyatna: [
        { x: 960, y: 700, r: 330, ot: 0.00, do: 0.30 },   // стойка «ЗАЯВКИ» → стойка syntax.help
        { x: 1140, y: 290, r: 230, ot: 0.08, do: 0.36 },  // доска с бумагами → экран с показателями
        { x: 930, y: 430, r: 170, ot: 0.14, do: 0.42 },   // стеллаж с папками → робот
        { x: 1190, y: 520, r: 120, ot: 0.18, do: 0.44 },  // телефон и бумаги на стойке → мониторы и планшет
        { x: 600, y: 530, r: 190, ot: 0.24, do: 0.52 },   // железный шкаф → растения
        { x: 300, y: 660, r: 280, ot: 0.30, do: 0.58 },   // кресла и столик → диван
        { x: 445, y: 330, r: 170, ot: 0.36, do: 0.62 },   // часы и календарь
        { x: 1500, y: 560, r: 320, ot: 0.42, do: 0.70 },  // дверь в цех и турникет
        { x: 130, y: 300, r: 300, ot: 0.50, do: 0.80 },   // окно слева
        { x: 900, y: 880, r: 520, ot: 0.52, do: 0.84 },   // пол
        { x: 1520, y: 180, r: 260, ot: 0.58, do: 0.88 },  // окно-арка справа
        { x: 850, y: 80, r: 620, ot: 0.60, do: 0.90 }     // потолок и свет
      ],
      // На телефоне в кадре примерно x 805–1240: робот, надпись на стойке, левая половина экрана.
      pyatnaTelefon: [
        { x: 980, y: 690, r: 300, ot: 0.00, do: 0.35 },   // стойка
        { x: 930, y: 430, r: 170, ot: 0.05, do: 0.40 },   // робот
        { x: 1140, y: 290, r: 230, ot: 0.15, do: 0.50 },  // экран
        { x: 1190, y: 520, r: 120, ot: 0.20, do: 0.52 },  // мониторы и планшет
        { x: 950, y: 880, r: 480, ot: 0.30, do: 0.70 },   // пол
        { x: 900, y: 100, r: 450, ot: 0.38, do: 0.78 },   // потолок
        { x: 600, y: 530, r: 190, ot: 0.50, do: 0.85 },   // дальше — за краем кадра
        { x: 300, y: 660, r: 280, ot: 0.50, do: 0.85 },
        { x: 445, y: 330, r: 170, ot: 0.50, do: 0.85 },
        { x: 1500, y: 560, r: 320, ot: 0.50, do: 0.85 },
        { x: 130, y: 300, r: 300, ot: 0.50, do: 0.88 },
        { x: 1520, y: 180, r: 260, ot: 0.50, do: 0.88 }
      ]
    },
    kabinet: {
      imya: 'кабинет',
      // Вертикальная пара (телефон), точки картинки 941×1672. 07.11, пары из Загрузок 07.11 00:26–00:55.
      mobil: {
        W: 941, H: 1672, posle: 'img/sceny/kabinet/mobil-posle.v1.webp',
        pyatna: [
          { x: 650, y: 480, r: 280, ot: 0.00, do: 0.32 },   // картины и шкаф → экран «Управление производством»
          { x: 820, y: 770, r: 200, ot: 0.06, do: 0.38 },   // угол справа → робот
          { x: 470, y: 1050, r: 330, ot: 0.12, do: 0.44 },   // стол с бумагами → светящийся стол
          { x: 380, y: 860, r: 200, ot: 0.18, do: 0.48 },   // руководитель, телефон → ноутбук
          { x: 520, y: 170, r: 300, ot: 0.24, do: 0.54 },   // лампа → световое кольцо
          { x: 110, y: 500, r: 260, ot: 0.30, do: 0.60 },   // окно слева
          { x: 200, y: 1350, r: 300, ot: 0.36, do: 0.70 },   // кресло спереди
          { x: 600, y: 1450, r: 420, ot: 0.44, do: 0.80 },   // пол
          { x: 470, y: 60, r: 480, ot: 0.50, do: 0.85 },   // потолок
          { x: 470, y: 1620, r: 520, ot: 0.56, do: 0.88 }   // низ
        ]
      },
      fokus: [0.52, 0.5],               // на телефоне в кадре робот, левая колонка панели и голограмма завода
      posle: 'img/sceny/kabinet/posle.v1.webp',
      pyatna: [
        { x: 1000, y: 260, r: 300, ot: 0.00, do: 0.30 },  // шкаф с папками и кубок → панель показателей
        { x: 1440, y: 280, r: 240, ot: 0.06, do: 0.34 },  // фотография завода → правая часть панели
        { x: 930, y: 640, r: 260, ot: 0.12, do: 0.40 },   // бумаги и дисковый телефон → голограмма завода
        { x: 450, y: 520, r: 200, ot: 0.18, do: 0.46 },   // монитор с трубкой → прозрачная панель syntax.help
        { x: 710, y: 450, r: 170, ot: 0.22, do: 0.50 },   // настольная лампа → робот
        { x: 985, y: 530, r: 130, ot: 0.28, do: 0.54 },   // кресло за столом
        { x: 1430, y: 600, r: 260, ot: 0.32, do: 0.60 },  // тумба и витрина → макет и лампа
        { x: 230, y: 450, r: 260, ot: 0.38, do: 0.66 },   // цветок на подоконнике → большие растения
        { x: 420, y: 800, r: 330, ot: 0.44, do: 0.74 },   // кресла для гостей
        { x: 900, y: 830, r: 380, ot: 0.48, do: 0.78 },   // стол спереди
        { x: 150, y: 220, r: 300, ot: 0.55, do: 0.85 },   // окна слева
        { x: 1450, y: 860, r: 300, ot: 0.58, do: 0.88 },  // ковёр и пол справа
        { x: 900, y: 60, r: 600, ot: 0.60, do: 0.90 }     // потолок, плющ, свет
      ],
      // На телефоне в кадре примерно x 640–1075.
      pyatnaTelefon: [
        { x: 710, y: 450, r: 170, ot: 0.00, do: 0.35 },   // робот
        { x: 950, y: 250, r: 300, ot: 0.05, do: 0.40 },   // панель показателей
        { x: 930, y: 640, r: 260, ot: 0.15, do: 0.50 },   // голограмма
        { x: 985, y: 530, r: 130, ot: 0.22, do: 0.55 },   // кресло
        { x: 900, y: 830, r: 380, ot: 0.30, do: 0.70 },   // стол спереди
        { x: 900, y: 60, r: 500, ot: 0.38, do: 0.78 },    // потолок
        { x: 450, y: 520, r: 200, ot: 0.50, do: 0.85 },   // дальше — за краем кадра
        { x: 1440, y: 280, r: 240, ot: 0.50, do: 0.85 },
        { x: 1430, y: 600, r: 260, ot: 0.50, do: 0.85 },
        { x: 230, y: 450, r: 260, ot: 0.50, do: 0.85 },
        { x: 420, y: 800, r: 330, ot: 0.50, do: 0.85 },
        { x: 150, y: 220, r: 300, ot: 0.50, do: 0.88 },
        { x: 1450, y: 860, r: 300, ot: 0.50, do: 0.88 }
      ]
    },
    dispetcherskaya: {
      imya: 'диспетчерская',
      // Вертикальная пара (телефон), точки картинки 941×1672. 07.11, пары из Загрузок 07.11 00:26–00:55.
      mobil: {
        W: 941, H: 1672, posle: 'img/sceny/dispetcherskaya/mobil-posle.v1.webp',
        pyatna: [
          { x: 590, y: 490, r: 300, ot: 0.00, do: 0.32 },   // доска «План производства» → экран
          { x: 600, y: 290, r: 200, ot: 0.05, do: 0.36 },   // вывеска «Диспетчерская» → «Процессы»
          { x: 300, y: 1050, r: 330, ot: 0.10, do: 0.42 },   // стол с бумагами → стол с планшетом
          { x: 560, y: 760, r: 260, ot: 0.16, do: 0.48 },   // диспетчеры и старые мониторы
          { x: 840, y: 760, r: 200, ot: 0.22, do: 0.52 },   // угол справа → робот
          { x: 110, y: 420, r: 260, ot: 0.28, do: 0.58 },   // окно слева
          { x: 350, y: 1400, r: 380, ot: 0.34, do: 0.66 },   // стол спереди
          { x: 780, y: 1300, r: 330, ot: 0.40, do: 0.74 },   // пол справа
          { x: 520, y: 110, r: 460, ot: 0.46, do: 0.80 },   // лампы и потолок
          { x: 470, y: 1600, r: 520, ot: 0.55, do: 0.88 }   // низ
        ]
      },
      fokus: [0.66, 0.5],               // на телефоне в кадре середина экрана процессов (завод, «риск задержки», «готово») и оператор
      posle: 'img/sceny/dispetcherskaya/posle.v1.webp',
      pyatna: [
        { x: 990, y: 330, r: 330, ot: 0.00, do: 0.30 },   // доска «ПРОЦЕССЫ» мелом → экран процессов
        { x: 640, y: 560, r: 200, ot: 0.08, do: 0.36 },   // диспетчер с телефоном и монитор с трубкой → витрина с макетом
        { x: 1180, y: 640, r: 260, ot: 0.14, do: 0.42 },  // второй диспетчер → оператор у мониторов
        { x: 1100, y: 120, r: 140, ot: 0.20, do: 0.46 },  // часы → время на экране
        { x: 470, y: 400, r: 200, ot: 0.24, do: 0.52 },   // чертежи и шкаф → растение на стене
        { x: 300, y: 700, r: 320, ot: 0.30, do: 0.60 },   // стол с телефоном, лампой и журналами → новый стол
        { x: 1510, y: 400, r: 300, ot: 0.36, do: 0.66 },  // дверь с табличкой → стеклянная дверь
        { x: 1520, y: 780, r: 250, ot: 0.42, do: 0.72 },  // низ двери
        { x: 200, y: 300, r: 320, ot: 0.48, do: 0.80 },   // окна в цех → роботы за стеклом
        { x: 120, y: 870, r: 200, ot: 0.52, do: 0.82 },   // стул спереди
        { x: 800, y: 880, r: 380, ot: 0.55, do: 0.85 },   // пол
        { x: 900, y: 50, r: 600, ot: 0.60, do: 0.90 }     // потолок и лампы
      ],
      // На телефоне в кадре примерно x 820–1255.
      pyatnaTelefon: [
        { x: 1040, y: 300, r: 300, ot: 0.00, do: 0.35 },  // экран процессов
        { x: 1180, y: 640, r: 260, ot: 0.05, do: 0.40 },  // оператор
        { x: 1100, y: 120, r: 140, ot: 0.15, do: 0.45 },  // время на экране
        { x: 800, y: 600, r: 200, ot: 0.22, do: 0.55 },   // витрина с макетом
        { x: 950, y: 880, r: 380, ot: 0.30, do: 0.70 },   // пол
        { x: 950, y: 50, r: 450, ot: 0.38, do: 0.78 },    // потолок
        { x: 640, y: 560, r: 200, ot: 0.50, do: 0.85 },   // дальше — за краем кадра
        { x: 470, y: 400, r: 200, ot: 0.50, do: 0.85 },
        { x: 300, y: 700, r: 320, ot: 0.50, do: 0.85 },
        { x: 1510, y: 400, r: 300, ot: 0.50, do: 0.85 },
        { x: 1520, y: 780, r: 250, ot: 0.50, do: 0.85 },
        { x: 200, y: 300, r: 320, ot: 0.50, do: 0.88 },
        { x: 120, y: 870, r: 200, ot: 0.50, do: 0.88 }
      ]
    },
    byuro: {
      imya: 'бюро',
      // Вертикальная пара (телефон), точки картинки 941×1672. 07.11, пары из Загрузок 07.11 00:26–00:55.
      mobil: {
        W: 941, H: 1672, posle: 'img/sceny/byuro/mobil-posle.v1.webp',
        pyatna: [
          { x: 630, y: 380, r: 230, ot: 0.00, do: 0.30 },   // вывеска «Конструкторское бюро» → «Дизайн и разработка»
          { x: 560, y: 640, r: 280, ot: 0.06, do: 0.38 },   // кульман → большой экран
          { x: 260, y: 1020, r: 300, ot: 0.12, do: 0.44 },   // инженер за столом → разработчик с мониторами
          { x: 380, y: 760, r: 200, ot: 0.18, do: 0.48 },   // у кульмана
          { x: 790, y: 900, r: 250, ot: 0.24, do: 0.54 },   // столы справа
          { x: 470, y: 120, r: 420, ot: 0.30, do: 0.62 },   // лампа → световое кольцо
          { x: 110, y: 500, r: 240, ot: 0.36, do: 0.66 },   // окна слева
          { x: 470, y: 1300, r: 420, ot: 0.42, do: 0.76 },   // стол спереди
          { x: 470, y: 1600, r: 520, ot: 0.55, do: 0.88 }   // низ
        ]
      },
      fokus: [0.57, 0.5],               // на телефоне в кадре середина экрана «Дизайн и разработка» и разработчик в центре
      posle: 'img/sceny/byuro/posle.v1.webp',
      pyatna: [
        { x: 1090, y: 300, r: 380, ot: 0.00, do: 0.30 },  // вывеска и кульманы → экран «Дизайн и разработка»
        { x: 330, y: 520, r: 260, ot: 0.08, do: 0.38 },   // инженер с лампой → разработчик у мониторов
        { x: 890, y: 470, r: 220, ot: 0.14, do: 0.42 },   // кульман в центре → рабочее место
        { x: 1450, y: 480, r: 240, ot: 0.20, do: 0.48 },  // кульман справа → рабочее место
        { x: 700, y: 820, r: 360, ot: 0.26, do: 0.56 },   // калька и инструменты → эскизы и планшет
        { x: 1350, y: 760, r: 260, ot: 0.32, do: 0.62 },  // кружка и свитки → макет шестерни и ноутбуки
        { x: 560, y: 300, r: 200, ot: 0.38, do: 0.66 },   // стеллаж со свитками → растения
        { x: 180, y: 230, r: 300, ot: 0.48, do: 0.80 },   // окна
        { x: 100, y: 880, r: 200, ot: 0.55, do: 0.85 },   // угол стола слева
        { x: 1620, y: 350, r: 180, ot: 0.55, do: 0.85 },  // стена справа
        { x: 900, y: 40, r: 600, ot: 0.58, do: 0.90 }     // потолок и лампы
      ],
      // На телефоне в кадре примерно x 705–1140.
      pyatnaTelefon: [
        { x: 1000, y: 300, r: 330, ot: 0.00, do: 0.35 },  // экран
        { x: 890, y: 470, r: 220, ot: 0.05, do: 0.40 },   // рабочее место в центре
        { x: 900, y: 800, r: 360, ot: 0.15, do: 0.50 },   // стол спереди
        { x: 900, y: 40, r: 450, ot: 0.30, do: 0.70 },    // потолок
        { x: 330, y: 520, r: 260, ot: 0.50, do: 0.85 },   // дальше — за краем кадра
        { x: 1450, y: 480, r: 240, ot: 0.50, do: 0.85 },
        { x: 1350, y: 760, r: 260, ot: 0.50, do: 0.85 },
        { x: 560, y: 300, r: 200, ot: 0.50, do: 0.85 },
        { x: 180, y: 230, r: 300, ot: 0.50, do: 0.88 },
        { x: 100, y: 880, r: 200, ot: 0.50, do: 0.88 },
        { x: 1620, y: 350, r: 180, ot: 0.50, do: 0.88 }
      ]
    }
  };

  var KONF = {
    varianty: {
      a: { imya: 'A', opis: 'кисть с ореолом + картинка растёт сама', kist: true, oreol: 150, vremya: true },
      b: { imya: 'B', opis: 'кисть + прокрутка', kist: true, oreol: 0, vremya: false },
      c: { imya: 'C', opis: 'только прокрутка', kist: false, oreol: 0, vremya: false }
    },
    // zaderzhka — с появления экрана; razgon: 0 — сразу заметно, 1 — медленный старт (как было до 06.11)
    // pauza — только до начала роста: пока двигают мышью, рост не стартует; начавшийся рост не останавливается (решение 06.11)
    vremya: { zaderzhka: 5, dlit: 35, predel: 0.6, razgon: 0, pauza: false, vozobnovit: 1.5 },
    zagotovki: { medlenno: 60, sredne: 35, bystro: 18 },
    kist: 90,
    otkrytie: 0.5,                    // кисть, ореол и прокрутка — через столько секунд после того, как экран встал целиком (компьютер)
    telefon: { pauza: 0.12, konec: 0.88 }, // телефон: доля залипания без смены в начале и с какой доли смена закончена (07.11)
    pokazan: 0.6                      // экран считается показанным, когда на виду 60% его окна
  };

  var par = new URLSearchParams(location.search);
  var mysh = matchMedia('(hover: hover) and (pointer: fine)').matches;
  // То же условие, что у <source media> в разметке: вертикальный экран — вертикальная пара. Повернули — перезагрузить страницу.
  var portretMq = matchMedia('(orientation: portrait)'), portret = portretMq.matches;
  if (portretMq.addEventListener) portretMq.addEventListener('change', function () { location.reload(); });
  var menshe = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var tek = null;                   // текущий вариант

  // ── экраны ────────────────────────────────────────────────────────
  var sceny = [];
  document.querySelectorAll('.scena-sekciya').forEach(function (sek, nomer) {
    var opis = EKRANY[sek.dataset.ekran];
    var okno = sek.querySelector('.scena-okno');
    var mob = portret && opis.mobil;
    var st = {
      nomer: nomer, imya: opis.imya, opis: opis, sek: sek, okno: okno,
      sc: new window.Scena(okno, mob ? { W: mob.W, H: mob.H, fokus: [0.5, 0.5], pyatna: mob.pyatna }
        : { W: W, H: H, fokus: opis.fokus, pyatna: mysh ? opis.pyatna : opis.pyatnaTelefon }),
      posleSrc: mob ? mob.posle : opis.posle, vertik: !!mob,
      vr: { id: 0 }, sch: null, posled: null, tajmer: 0, kadrovProshlo: 0, fps: 0,
      vidna: nomer === 0, dolya: nomer === 0 ? 1 : 0, pokazan: false,
      otkryt: false, kistGotova: false, tajmerOtkr: 0, s0: null, sRaw: 0
    };
    st.shag = function (n) { shagVremeni(st, n); };
    sceny.push(st);
  });
  window.scena = sceny[0].sc;       // для проверок из консоли и Playwright
  window.sceny = sceny;

  // ── время (вариант A) ─────────────────────────────────────────────
  function vVremya(x) {
    var srazu = 1 - (1 - x) * (1 - x);                                   // заметно сразу, к концу замедляется
    var plavno = x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2;  // медленный старт и медленный конец
    var k = KONF.vremya.razgon;
    return (1 - k) * srazu + k * plavno;
  }
  function shagVremeni(st, n) {
    var vr = st.vr; vr.id = 0;
    if (!tek.vremya || menshe) return;
    var dt = vr.prev ? (n - vr.prev) / 1000 : 0; vr.prev = n;
    if (document.hidden || !st.vidna) vr.status = 'пауза (экран не виден)';
    else if (n - vr.start < KONF.vremya.zaderzhka * 1000) vr.status = 'ждёт старта';
    else if (!vr.poshyol && KONF.vremya.pauza && n - vr.posledMazok < KONF.vremya.vozobnovit * 1000) vr.status = 'ждёт: двигают мышью';
    else { vr.poshyol = true; vr.tLin = Math.min(1, vr.tLin + dt / KONF.vremya.dlit); vr.status = 'идёт'; }
    var t = KONF.vremya.predel * vVremya(vr.tLin);
    if (n - vr.poslRis > 33 || vr.tLin >= 1) { vr.poslRis = n; st.sc.setTime(t); }   // рост медленный — хватает 30 кадров
    if (vr.tLin >= 1) { vr.status = 'стоп (предел)'; return; }
    vr.id = requestAnimationFrame(st.shag);
  }
  // Экран впервые показался — пошли отсчёты: «первый мазок» и «рост начнётся через».
  function poyavilsya(st) {
    if (st.pokazan) return;
    st.pokazan = true;
    st.sch.nachalo = performance.now();
    if (tek.vremya && !menshe) {
      st.vr.start = performance.now(); st.vr.prev = 0;
      st.vr.status = 'ждёт старта';
      if (!st.vr.id) st.vr.id = requestAnimationFrame(st.shag);
    }
  }

  // ── счётчики показа ───────────────────────────────────────────────
  var tik = performance.now();
  setInterval(function () {
    var n = performance.now();
    sceny.forEach(function (st) {
      if (st.vidna && !document.hidden) st.sch.naScene += (n - tik) / 1000;
      st.fps = (st.sc.kadrov - st.kadrovProshlo) / 0.5; st.kadrovProshlo = st.sc.kadrov;
    });
    tik = n;
  }, 500);

  // ── кисть (варианты A, B; только мышь) ────────────────────────────
  sceny.forEach(function (st) {
    st.okno.addEventListener('pointermove', function (e) {
      if (!tek || !tek.kist || !mysh || e.pointerType === 'touch' || !st.sc.posle) return;
      if (!st.kistGotova) { st.posled = null; return; }   // экран ещё въезжает или не кончилась пауза
      var p = st.sc.vKartinku(e.clientX, e.clientY);
      st.sc.setOreol(tek.oreol ? { x: p.x, y: p.y, r: tek.oreol } : null);
      st.sc.mazok(st.posled || p, p, KONF.kist);
      st.posled = p;
      st.vr.posledMazok = performance.now();
      if (st.sch.pervyj === null) st.sch.pervyj = (performance.now() - st.sch.nachalo) / 1000;
      clearTimeout(st.tajmer);
      st.tajmer = setTimeout(function () { st.sch.ruka = st.sc.pokrytieRuki(); }, 400);
    });
    st.okno.addEventListener('pointerleave', function () { st.posled = null; st.sc.setOreol(null); });
  });

  // ── прокрутка ─────────────────────────────────────────────────────
  // Компьютер: экран залипает, прогресс — от верха секции до её низа.
  // Телефон: первый экран — от верха страницы; следующие превращаются, пока проезжают через экран.
  function naProkrutku(st, s) {
    st.sRaw = s;
    var podskazka = st.okno.querySelector('.scena-prokrutka');
    if (podskazka) podskazka.classList.toggle('skryta', s > 0.03);
    // Компьютер: до конца паузы после полного открытия прокрутка не открывает ничего, потом считает от места, где пауза кончилась.
    if (mysh) s = st.s0 === null ? 0 : Math.max(0, Math.min(1, (s - st.s0) / (1 - st.s0)));
    // Телефон (07.11): сцена залипает; сначала немного прокрутки без смены, потом смена, в конце снова без смены — и дальше.
    else s = Math.max(0, Math.min(1, (s - KONF.telefon.pauza) / (KONF.telefon.konec - KONF.telefon.pauza)));
    st.sc.setScroll(s);
    if (s >= 0.98 && st.sch) st.sch.konec = true;
  }
  if (window.gsap && window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);
    ScrollTrigger.config({ ignoreMobileResize: true });
    sceny.forEach(function (st) {
      var proxy = { s: 0 };
      gsap.to(proxy, {
        s: 1, ease: 'none',
        scrollTrigger: { trigger: st.sek, start: 'top top', end: 'bottom bottom', scrub: 0.4 },
        onUpdate: function () { naProkrutku(st, proxy.s); }
      });
    });
  } else {
    // Без GSAP — свой расчёт прогресса, сцена от этого не меняется.
    var zapr = 0;
    var schitat = function () {
      zapr = 0;
      var vh = innerHeight;
      sceny.forEach(function (st) {
        var r = st.sek.getBoundingClientRect();
        var nach = mysh || st.nomer === 0 ? 0 : vh * 0.75;
        var dlina = r.height - (mysh ? vh : vh * 0.35) + nach;
        naProkrutku(st, Math.min(1, Math.max(0, (nach - r.top) / Math.max(1, dlina))));
      });
    };
    addEventListener('scroll', function () { if (!zapr) zapr = requestAnimationFrame(schitat); }, { passive: true });
    schitat();
  }

  if ('IntersectionObserver' in window) {
    var nabl = new IntersectionObserver(function (zapisi) {
      zapisi.forEach(function (z) {
        var st = sceny.filter(function (s) { return s.okno === z.target; })[0];
        st.vidna = z.isIntersecting; st.dolya = z.intersectionRatio;
        if (!mysh && z.intersectionRatio >= KONF.pokazan - 0.01) poyavilsya(st);   // компьютер — по полному открытию, ниже
      });
    }, { threshold: [0, 0.2, 0.4, KONF.pokazan, 0.8, 1] });
    sceny.forEach(function (st) { nabl.observe(st.okno); });
  } else {
    sceny.forEach(function (st) { st.vidna = true; st.dolya = 1; });
  }

  // ── полное открытие экрана (компьютер) ────────────────────────────
  // Решение 06.11: пока экран въезжает, посетитель видит «до» целиком. Кисть, ореол и открытие прокруткой включаются
  // через KONF.otkrytie с после того, как окно экрана встало целиком; отсчёт «рост начнётся через» — тоже отсюда.
  // На телефоне не действует: кисти нет, а экраны не залипают — «встал целиком» там почти не бывает.
  function proverOtkrytie() {
    if (!mysh || !tek) return;
    sceny.forEach(function (st) {
      var r = st.okno.getBoundingClientRect();
      var celikom = Math.abs(r.top) < 2 && r.bottom <= innerHeight + 2;
      if (celikom && !st.otkryt) {
        st.otkryt = true;
        poyavilsya(st);
        clearTimeout(st.tajmerOtkr);
        st.tajmerOtkr = setTimeout(function () {
          st.kistGotova = true;
          // прокрутка открывает с того места, где кончилась пауза, — без скачка
          if (st.s0 === null) { st.s0 = Math.min(st.sRaw, 0.85); naProkrutku(st, st.sRaw); }
        }, KONF.otkrytie * 1000);
      } else if (!celikom && st.otkryt) {   // уехал — кисть ждёт следующего полного открытия
        st.otkryt = false; st.kistGotova = false; clearTimeout(st.tajmerOtkr);
        st.posled = null; st.sc.setOreol(null);
      }
    });
  }
  var zaprOtkr = 0;
  addEventListener('scroll', function () {
    if (!zaprOtkr) zaprOtkr = requestAnimationFrame(function () { zaprOtkr = 0; proverOtkrytie(); });
  }, { passive: true });
  addEventListener('resize', proverOtkrytie);

  // ── варианты ──────────────────────────────────────────────────────
  var slepoj = null; // {'1':'b', '2':'c', '3':'a'} — в слепом режиме
  function ustanovit(k) {
    if (!KONF.varianty[k]) k = 'a';
    tek = KONF.varianty[k];
    tek.kluch = k;
    sceny.forEach(function (st) {
      st.sc.sbros(); st.posled = null;
      if (st.vr.id) cancelAnimationFrame(st.vr.id);
      st.vr = { tLin: 0, start: 0, prev: 0, poslRis: 0, posledMazok: -1e9, id: 0, poshyol: false,
        status: !tek.vremya ? 'выкл (в этом варианте нет)' : menshe ? 'выкл (в системе выключена анимация)' : 'ждёт показа экрана' };
      st.sch = { nachalo: performance.now(), pervyj: null, ruka: 0, konec: false, naScene: 0 };
      st.pokazan = false;
      st.otkryt = false; st.kistGotova = false; st.s0 = null; clearTimeout(st.tajmerOtkr);
      if (!mysh && st.dolya >= KONF.pokazan - 0.01) poyavilsya(st);
    });
    proverOtkrytie();
    document.body.dataset.variant = k;
    document.body.classList.toggle('s-kistyu', !!tek.kist && mysh);
    var u = new URL(location.href); u.searchParams.set('v', k); history.replaceState(null, '', u);
    panelObnovit();
  }
  function snachala() {
    window.scrollTo(0, 0);
    sceny.forEach(function (st, i) { st.dolya = i === 0 ? 1 : 0; st.vidna = i === 0; });
    ustanovit(tek.kluch);
    if (window.ScrollTrigger) ScrollTrigger.refresh();
  }

  // ── панель сравнения ──────────────────────────────────────────────
  var panel = document.querySelector('.panel');
  function $(id) { return document.getElementById(id); }
  function zap(v) { return String(v).replace('.', ','); }
  function panelObnovit() {
    if (!panel) return;
    document.querySelectorAll('[data-var]').forEach(function (b) {
      var k = slepoj ? slepoj[b.dataset.var] : b.dataset.var;
      b.classList.toggle('on', k === tek.kluch);
      b.textContent = slepoj ? { a: '1', b: '2', c: '3' }[b.dataset.var] : KONF.varianty[b.dataset.var].imya;
    });
    $('p-opis').textContent = slepoj ? 'слепой режим: какой вариант под номером — скрыто' : tek.imya + ' — ' + tek.opis;
    $('p-a').hidden = !tek.vremya && !tek.oreol;
  }
  document.querySelectorAll('[data-var]').forEach(function (b) {
    b.onclick = function () { ustanovit(slepoj ? slepoj[b.dataset.var] : b.dataset.var); };
  });
  $('p-snachala').onclick = snachala;
  $('p-otkat').onchange = function (e) { sceny.forEach(function (st) { st.sc.otkat = e.target.checked; st.sc.obnovit(); }); };
  $('p-pauza').onchange = function (e) { KONF.vremya.pauza = e.target.checked; };
  $('p-tekst').onchange = function (e) { document.body.classList.toggle('bez-teksta', !e.target.checked); };
  $('p-podskazka').onchange = function (e) { document.body.classList.toggle('s-podskazkoj', e.target.checked); };
  // Положение текста — у каждого экрана свой выбор: data-tekst у выпадающего списка = класс экрана.
  document.querySelectorAll('select[data-tekst]').forEach(function (sel) {
    sel.onchange = function (e) {
      document.querySelectorAll('.scena-sekciya.' + sel.dataset.tekst).forEach(function (s) {
        s.classList.remove('tekst-sleva', 'tekst-sprava', 'tekst-sverhu', 'tekst-snizu');
        s.classList.add('tekst-' + e.target.value);
      });
    };
  });
  function polzunok(id, chto, fmt) {
    var el = $(id), out = $(id + '-z');
    var pokaz = function () { out.textContent = fmt(+el.value); };
    el.oninput = function () { chto(+el.value); pokaz(); };
    pokaz();
  }
  function doliPredela() {
    $('p-predel-dolya').textContent = '≈ ' + sceny.map(function (st) {
      return st.sc.dolja(KONF.vremya.predel) + '% картинки — ' + st.imya;
    }).join(', ') + '; остальное — прокрутка и кисть';
  }
  polzunok('p-zaderzhka', function (v) { KONF.vremya.zaderzhka = v; }, function (v) { return zap(v) + ' с'; });
  polzunok('p-dlit', function (v) { KONF.vremya.dlit = v; }, function (v) { return v + ' с'; });
  polzunok('p-razgon', function (v) { KONF.vremya.razgon = v / 100; },
    function (v) { return v === 0 ? '0% · сразу' : v === 100 ? '100% · медленно' : v + '%'; });
  polzunok('p-predel', function (v) {
    KONF.vremya.predel = v / 100;
    sceny.forEach(function (st) { if (st.vr.tLin >= 1) st.sc.setTime(KONF.vremya.predel); });   // рост уже на пределе — передвинуть
    doliPredela();
  }, function (v) { return v + '%'; });
  polzunok('p-vozobn', function (v) { KONF.vremya.vozobnovit = v; }, function (v) { return zap(v) + ' с'; });
  polzunok('p-otkrytie', function (v) { KONF.otkrytie = v; }, function (v) { return zap(v) + ' с'; });
  polzunok('p-oreol', function (v) { KONF.varianty.a.oreol = v; if (tek.kluch === 'a') tek.oreol = v; },
    function (v) { return v ? v + ' ≈ ' + Math.round(v * sceny[0].sc.k) + ' px' : 'нет'; });
  doliPredela();
  document.querySelectorAll('[data-zag]').forEach(function (b) {
    b.onclick = function () {
      KONF.vremya.dlit = KONF.zagotovki[b.dataset.zag];
      $('p-dlit').value = KONF.vremya.dlit; $('p-dlit').oninput();
      if (tek.vremya) snachala();
    };
  });
  $('p-slepoj').onchange = function (e) {
    if (e.target.checked) {
      var m = ['a', 'b', 'c'];
      for (var i = m.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var x = m[i]; m[i] = m[j]; m[j] = x; }
      slepoj = { a: m[0], b: m[1], c: m[2] };   // кнопка a показывает «1» и т. д.
    } else slepoj = null;
    $('p-raskryt').hidden = !slepoj; $('p-rasklad').textContent = '';
    panelObnovit();
  };
  $('p-raskryt').onclick = function () {
    $('p-rasklad').textContent = '1 = ' + KONF.varianty[slepoj.a].imya + ', 2 = ' + KONF.varianty[slepoj.b].imya + ', 3 = ' + KONF.varianty[slepoj.c].imya;
  };
  var migalka = 0, vse = false;
  $('p-migat').onclick = function () {
    if (migalka) {
      clearInterval(migalka); migalka = 0; vse = false;
      sceny.forEach(function (st) { st.sc.vse = false; st.sc.pometitVse(); });
      this.classList.remove('on'); return;
    }
    this.classList.add('on');
    migalka = setInterval(function () { vse = !vse; sceny.forEach(function (st) { st.sc.vse = vse; st.sc.pometitVse(); }); }, 600);
  };
  $('p-kopir').onclick = function () {
    var stroka = itogStroka();
    var gotovo = function () { $('p-kopir').textContent = 'Скопировано'; setTimeout(function () { $('p-kopir').textContent = 'Скопировать итог показа'; }, 2500); };
    if (navigator.clipboard) navigator.clipboard.writeText(stroka).then(gotovo, function () { prompt('Скопируй:', stroka); });
    else prompt('Скопируй:', stroka);
  };
  function pervyjMazok(st) { return st.sch.pervyj === null ? 'не было' : zap(st.sch.pervyj.toFixed(1)) + ' с'; }
  function rostDoshyol(st) {
    return Math.round(st.sc.t * 100) + '% из ' + Math.round(KONF.vremya.predel * 100) + '% (≈ ' + st.sc.dolja(st.sc.t) + '% картинки)';
  }
  function itogStroka() {
    var v = slepoj ? 'номер ' + Object.keys(slepoj).filter(function (k) { return slepoj[k] === tek.kluch; }).map(function (k) { return { a: 1, b: 2, c: 3 }[k]; })[0] + ' (вариант ' + tek.imya + ')' : 'вариант ' + tek.imya;
    var chasti = [v];
    sceny.forEach(function (st) {
      var s = st.imya + ': ' + (st.pokazan ? '' : 'не показан, ') + 'первый мазок ' + pervyjMazok(st) +
        ', рукой ' + st.sch.ruka + '%, до конца ' + (st.sch.konec ? 'да' : 'нет') + ', на экране ' + Math.round(st.sch.naScene) + ' с';
      if (tek.vremya) s += ', рост дошёл до ' + rostDoshyol(st);
      chasti.push(s);
    });
    if (tek.vremya) {
      chasti.push('рост: начинается через ' + zap(KONF.vremya.zaderzhka) + ' с, длится ' + KONF.vremya.dlit + ' с, предел ' + Math.round(KONF.vremya.predel * 100) +
        '%, разгон ' + Math.round(KONF.vremya.razgon * 100) + '%, старт ждёт остановки мыши: ' + (KONF.vremya.pauza ? 'да, через ' + zap(KONF.vremya.vozobnovit) + ' с' : 'нет'));
    }
    chasti.push('кисть и прокрутка — через ' + zap(KONF.otkrytie) + ' с после того, как экран встал целиком');
    chasti.push('откат назад: ' + ($('p-otkat').checked ? 'да' : 'нет'),
      'картинки: ' + (portret ? 'вертикальные, где есть' : 'широкие'),
      'экран ' + innerWidth + '×' + innerHeight);
    return chasti.join(' | ');
  }
  // Показ — по экрану, который сейчас больше всего на виду.
  setInterval(function () {
    if (!panel || panel.hidden) return;
    var st = sceny.reduce(function (a, b) { return b.dolya > a.dolya ? b : a; });
    var sc = st.sc;
    var stroki = [
      'экран: ' + st.imya + ' (' + (st.nomer + 1) + ' из ' + sceny.length + ')',
      'прокрутка ' + sc.s.toFixed(2) + ' · рост ' + sc.t.toFixed(2) + ' · видно ' + sc.e.toFixed(2),
      'рост: ' + st.vr.status,
      'кисть и прокрутка: ' + (!mysh ? 'телефон — без паузы' : st.kistGotova ? 'работают' : st.otkryt ? 'пауза ' + zap(KONF.otkrytie) + ' с' : 'ждут, пока экран встанет целиком'),
      'перерисовок в секунду: ' + Math.round(st.fps),
      'первый мазок: ' + pervyjMazok(st),
      'закрашено рукой: ' + st.sch.ruka + '%',
      'дошёл до конца: ' + (st.sch.konec ? 'да' : 'нет'),
      'на экране: ' + Math.round(st.sch.naScene) + ' с'
    ];
    if (tek.vremya) stroki.splice(3, 0, 'рост дошёл до: ' + rostDoshyol(st));
    $('p-cifry').textContent = stroki.join('\n');
  }, 500);

  // ── клавиши ───────────────────────────────────────────────────────
  addEventListener('keydown', function (e) {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT' || e.ctrlKey || e.metaKey || e.altKey) return;
    var k = e.key.toLowerCase();
    if (k === '1' || k === '2' || k === '3') { var b = ['a', 'b', 'c'][+k - 1]; ustanovit(slepoj ? slepoj[b] : b); }
    else if (k === 'r' || k === 'к') snachala();
    else if (k === 'p' || k === 'з') { panel.hidden = !panel.hidden; panelObnovit(); }
    else if (k === 't' || k === 'е') { var c = $('p-tekst'); c.checked = !c.checked; c.onchange({ target: c }); }
  });

  // ── меню на телефоне ──────────────────────────────────────────────
  var burger = document.getElementById('nav-burger'), menyu = document.getElementById('nav-menu');
  if (burger && menyu) {
    burger.onclick = function () {
      var otkr = menyu.hidden; menyu.hidden = !otkr; burger.setAttribute('aria-expanded', String(otkr));
    };
    document.addEventListener('click', function (e) {
      if (!menyu.hidden && !menyu.contains(e.target) && !burger.contains(e.target)) { menyu.hidden = true; burger.setAttribute('aria-expanded', 'false'); }
    });
  }

  // ── старт ─────────────────────────────────────────────────────────
  if (par.get('panel') === '1') panel.hidden = false;
  if (par.get('tekst') === '0') { $('p-tekst').checked = false; document.body.classList.add('bez-teksta'); }
  ustanovit(par.get('v') || 'a');
  // «После» — после загрузки страницы: первой показывается «до», кисть включается, когда «после» готово.
  var gruzit = function () {
    sceny.forEach(function (st) {
      st.sc.zagruzit(st.posleSrc).then(function () {
        st.sek.classList.add('posle-gotovo');
        if (st.nomer === 0) document.body.classList.add('posle-gotovo');
      });
    });
  };
  if (document.readyState === 'complete') gruzit(); else addEventListener('load', gruzit);
})();
