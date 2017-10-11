(function() {

  var app = {
    opt: {
      /* @echo MAP */
      /* @echo LINKS */

      // показывать bredcrumbs или нет
      show_bc: true,

      // элемент на котором срабатывает функция возврата на предыдущую страницу
      goto_back_btn: '.goto_back',

      // в функции customEvents описываются все события и анимация,
      // как общие, так и индивидуальные для каждого слайда
      customEvents: function() {

        console.info('Этот log выполняется на всех слайдах');

        // @if NUM=='num'
        console.info('Этот log выполняется только на слайде num');
        // @endif

      },


      // тут обьявляем функции и события кастомных платформ
      initOtherPlatforms: function() {
        var present = Object.keys(app.opt.map)[0];

        this.veevaInit = function() {
          com.veeva.clm.getDataForCurrentObject('Presentation', 'Presentation_Id_vod__c', function(result) {
            console.log(result);
            //app.opt.current_presentation = result.Presentation.Presentation_Id_vod__c;
            com.veeva.clm.getDataForCurrentObject('KeyMessage', 'Media_File_Name_vod__c', function(result) {
              app.opt.current_slide = result.KeyMessage.Media_File_Name_vod__c.split(".")[0];

              app.afterStart();
            });
          });
        };

        // событие перехода на слайд
        this.goToSlide = function(slide) {
          com.veeva.clm.gotoSlide(slide + '.zip', present);
        };

      },

      ////////------------ END MAIN OPTIONS -----------///////////////

      current_presentation: false,
      current_slide: false,
      isSlideDataReady: function() {
        return app.opt.current_presentation !== '' && app.opt.current_slide !== '';
      },
      slidePresentationH: "",
      slidePresentationV: "",
      slidePresentationV2: "",
      prev_Present: "",
      prev_Slide: "",
      slideLeft: "",
      slideRight: "",
      slideUp: "",
      slideDown: "",
      is_app: false
    },
    init: function() {
      // создаем экземпляр кастомной платформы
      this.otherPlatform = new this.opt.initOtherPlatforms();

      var self = this,
        address = document.location.href;

      // определение приложение это или веб-страница
      if (address.indexOf('/mobile/') == -1) {
        self.opt.current_slide = address.slice(address.lastIndexOf("/") + 1, address.lastIndexOf(".html"));
        self.afterStart();
      } else {
        self.opt.is_app = true;
        self.otherPlatform.veevaInit();
      }

    },
    afterStart: function() {
      var self = this;
      self.opt.current_presentation = self.getCurrentPresent();
      if (!self.opt.current_presentation) {
        alert("Данный слайд отсутствует в карте презентации!");
        return false;
      }
      self.setSwipesData();
      self.transitionLog();
      if (self.opt.show_bc) self.generate_bc();
      self.initEvents();
    },
    initEvents: function() {
      var self = this;

      $$('body').on("swipeLeft", function() {
        if (!self.opt.isSlideDataReady()) return;
        if (self.opt.slideRight !== '') {
          self.gotoSlide(false, self.opt.slideRight, self.opt.slidePresentationH);
        }
      });
      $$('body').on("swipeRight", function() {
        if (!self.opt.isSlideDataReady()) return;
        if (self.opt.slideLeft !== '') {
          self.gotoSlide(false, self.opt.slideLeft, self.opt.slidePresentationH);
        }
      });
      $$('body').on("swipeUp", function() {
        if (!self.opt.isSlideDataReady()) return;
        if (self.opt.slideDown !== '') {
          self.gotoSlide(false, self.opt.slideDown, self.opt.slidePresentationV);
        }
      });
      $$('body').on("swipeDown", function() {
        if (!self.opt.isSlideDataReady()) return;
        if (self.opt.slideUp !== '') {
          self.gotoSlide(false, self.opt.slideUp, self.opt.slidePresentationV2);
        }
      });

      for (var a in self.opt.links) {
        self.gotoSlide('button.' + self.opt.links[a]['class'], self.opt.links[a].slideTo, self.opt.links[a].presentTo);
      }

      $$(document).on('touchmove', function(e) {
        e.preventDefault();
      });

      $$(self.opt.goto_back_btn).on("touchend", function() {
        self.go_back();
      });

      self.opt.customEvents();
    },
    getCurrentPresent: function() {
      var self = this;

      for (var i in self.opt.map) {
        if (self.opt.map[i].slides.indexOf(self.opt.current_slide) >= 0) {
          return i;
        }
      }
    },
    setCurrentPresent: function(present, callback) {
      //localStorage.setItem("currentPresentationName", present);
      return callback;
    },
    gotoSlideEvent: function(slide, present) {
      var self = this;
      self.setCurrentPresent(present, self.opt.is_app ? self.otherPlatform.goToSlide(slide, present) : document.location.href = "../" + slide + "/" + slide + ".html");
    },
    gotoSlide: function(obj, slide, present) {
      var self = this;
      if (obj) {
        $$(obj).on("touchend", function() {
          self.setCurrentPresent(present, self.gotoSlideEvent(slide, present));
        });
      } else {
        self.setCurrentPresent(present, self.gotoSlideEvent(slide, present));
      }
    },
    go_back: function() {
      this.gotoSlideEvent(this.opt.prev_s, this.opt.prev_p);
    },

    transitionLog: function() {
      var self = this;
      var presentLog = localStorage.getItem("presentLog");
      var slideLog = localStorage.getItem("slideLog");

      if (presentLog) {
        presentLog = presentLog.split(',');
        slideLog = slideLog.split(',');
        self.opt.prev_Present = presentLog[presentLog.length - 1];
        self.opt.prev_Slide = slideLog[slideLog.length - 1];
        presentLog.push(self.opt.current_presentation);
        slideLog.push(self.opt.current_slide);
      } else {
        presentLog = new Array(self.opt.current_presentation);
        slideLog = new Array(self.opt.current_slide);
      }

      localStorage.setItem("presentLog", presentLog.join());
      localStorage.setItem("slideLog", slideLog.join());

    },

    // генерация bredcrumbs
    generate_bc: function() {
      var self = this;
      if (!self.opt.isSlideDataReady()) return;

      var presentation, columns = [],
        rows = [],
        s = '',
        s2 = '',
        flag = false;
      if (self.opt.map[self.opt.current_presentation].p_pres !== '') {
        presentation = self.opt.map[self.opt.current_presentation].p_pres;
      } else {
        presentation = self.opt.current_presentation;
      }
      for (var k in self.opt.map[presentation].slides) {
        if (self.opt.map[presentation].slides[k] == self.opt.current_slide) {
          rows.push(1);
          flag = true;
        } else {
          rows.push(0);
        }
        for (var l in self.opt.map) {
          if (self.opt.map[l].p_slide == self.opt.map[presentation].slides[k] && self.opt.map[l].p_pres == presentation) {
            for (var i in self.opt.map[l].slides) {
              if (self.opt.map[l].slides[i] == self.opt.current_slide && l == self.opt.current_presentation && !flag) {
                rows.push(1);
                flag = true;
              } else {
                rows.push(0);
              }
            }
          }
        }

        columns.push(rows);
        rows = [];
      }

      for (var i in columns) {
        for (var j in columns[i]) {
          s += '<div class="bc-item' + (columns[i][j] == 1 ? ' active' : '') + '"></div>';
        }
        s2 += '<div class="bc-column">' + s + '</div>';
        s = '';
      }
      $$('section .content').append('<div class="bc">' + s2 + '</div>');
    },

    // генерация сценария перелистывания
    setSwipesData: function() {
      var self = this;

      if (!self.opt.isSlideDataReady()) return;

      var k, flag = false,
        slides, slide;

      if (self.opt.map[self.opt.current_presentation].p_pres === '') {
        slides = self.opt.map[self.opt.current_presentation].slides;
        self.opt.slidePresentationH = self.opt.current_presentation;
        slide = self.opt.current_slide;
      } else {
        slides = self.opt.map[self.opt.map[self.opt.current_presentation].p_pres].slides;
        self.opt.slidePresentationH = self.opt.map[self.opt.current_presentation].p_pres;
        slide = self.opt.map[self.opt.current_presentation].p_slide;
      }

      for (var k in slides) {
        if (slides[k] == slide) {
          self.opt.slideLeft = (parseInt(k) === 0) ? '' : slides[parseInt(k) - 1];
          self.opt.slideRight = (parseInt(k) == (slides.length - 1)) ? '' : slides[parseInt(k) + 1];
          flag = true;
        }
        if (flag) {
          flag = false;
          break;
        }
      }

      if (self.opt.map[self.opt.current_presentation].p_pres === '') {
        for (var k in self.opt.map) {
          if (self.opt.map[k].p_slide == self.opt.current_slide) {
            self.opt.slidePresentationV = k;
            self.opt.slideUp = '';
            self.opt.slideDown = self.opt.map[k].slides[0];
            flag = true;
          }
          if (flag) {
            flag = false;
            break;
          }
        }
      } else {
        self.opt.slidePresentationV = self.opt.current_presentation;
        self.opt.slidePresentationV2 = self.opt.current_presentation;
        slides = self.opt.map[self.opt.current_presentation].slides;
        slide = self.opt.current_slide;

        for (var k in slides) {
          if (slides[k] == slide) {
            if (parseInt(k) === 0) {
              self.opt.slidePresentationV2 = self.opt.map[self.opt.current_presentation].p_pres;
              self.opt.slideUp = self.opt.map[self.opt.current_presentation].p_slide;
            } else {
              self.opt.slideUp = slides[parseInt(k) - 1];
            }
            self.opt.slideDown = (parseInt(k) == (slides.length - 1)) ? '' : slides[parseInt(k) + 1];
            flag = true;
          }
          if (flag) {
            flag = false;
            break;
          }
        }
      }
    }
  };

  app.init();

})();
