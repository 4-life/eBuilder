const gutil = require('gulp-util');

module.exports = function() {
  gutil.log(gutil.colors.bgGreen('Список доступных команд:'));
  gutil.log(gutil.colors.green('gulp') + ' - Режим разработчика');
  gutil.log(gutil.colors.green('gulp build') + ' - Собрать презентацию в папку _build/');
  gutil.log(gutil.colors.green('gulp thumbs') + ' - Сгенерировать тамбунашки для каждого слайда');
  gutil.log(gutil.colors.green('gulp upload') + ' - Запаковать слайды в zip и отправить на сервер (архивы будут в папке _zip/, файлы ctl в папке _ctl/)');
  gutil.log(gutil.colors.green('gulp createpresent') + ' - Создать презентацию в salesforce или обновить поля уже существующей');
  gutil.log(gutil.colors.green('gulp screenshots') + ' - Сгенерировать скриншоты слайдов и сохранить их в папку _screenshots/');
};
