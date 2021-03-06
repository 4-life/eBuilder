module.exports = {
  sourceDir: __dirname,
  presentation: {
    lang: 'RU', // язык презентации
    brand: 'No_brand', // бренд презентации
    nl_PID: 'nl_PID', // индекс nestline
    presentPrefix: 'P', // первый символ в названии презентации
    slidePrefix: 'S', // первый символ в названии всех слайдов
    customPresentationId: false, // если требуется специальный идентификатор презентации отличный от ее названия
    hidden: false, // видимость презентации в veeva
    approved: true, // если true - презентация обновится на ipad, иначе нет
    groups: '[RU_Brand_Team],[CV_RU]', // Groups
    detailGroup: 'CV_RU', // Detail Group
    disableActions: 'Navigation_Bar_vod; Swipe_vod; History_Buttons_vod; Rotation_Lock_vod; Zoom_vod; Pinch_To_Exit_vod;', // отключенные события в ipad
    slidePostfix: '' // Если требуется в конце названия слайда отобразить, например, дату
  },

  // Специальные настройки для BMS
  bms: {
    shortbrand: '',
    materialType: '',
    audience: '',
    purpose: ''
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
      },
      "2": {
        "slides": [1]
      }
    },

    // список ссылок на слайды при клике на "class"
    links: [
      //{"class":"className","slideTo":"slide","presentTo":"present"}
    ]
  }
};
