'use strict';

module.exports = {
  sourceDir: __dirname,
  presentation: {
    lang: 'RU',
    brand: 'brand',
    nl_PID: 'nl_PID',
    presentPrefix: 'P',
    slidePrefix: 'S'
  },
  slides: [
    {num: 1},
    {num: 2},
    {num: 3},

    //{num: 4, assets: [], isFile: false, copy: 1},

  ],
  settings: {
    // карта презентации. Для вертикальных визитов необходимо
    // добавить свойства "p_pres" с указанием названия родительской
    // презентации и "p_slide" с указанием номера родительского слайда

    map: {
      "1": {
        "slides": [1, 2, 3, 4, 5]
      }
    },

    // список ссылок на слайды при клике на "class"
    links: [
      //{"class":"className","slideTo":"slide","presentTo":"present"}
    ]
  }
}
