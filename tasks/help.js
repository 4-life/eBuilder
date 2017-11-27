const gutil = require('gulp-util');

module.exports = function() {
  gutil.log(gutil.colors.bgGreen('Список доступных команд:'));
  gutil.log(gutil.colors.green('gulp') + ' - Режим разработчика');
  gutil.log(gutil.colors.green('gulp build') + ' - Собрать презентацию в папку _build/');
  gutil.log(gutil.colors.green('gulp thumbs') + ' - Сгенерировать тамбунашки для каждого слайда');
  gutil.log(gutil.colors.green('gulp imagemin') + ' - Минифицировать все изображения презентации в директории `_source/<название презы>` сохранив места их расположения. Осторожно! Задача нагружает процессор. На слабых машинах может зависнуть. Сжимает в среднем 10 изображений в минуту.');
  gutil.log(gutil.colors.green('gulp upload') + ' - Запаковать слайды в zip и отправить на сервер (архивы будут в папке _zip/, файлы ctl в папке _ctl/). Загрузка дескрипшенов слайдов осуществляется так же через эту команду. Для этого необходимо в директории `_source/<название презы>` создать файл `descriptions.json` и поместить туда код из econstructor.');
  gutil.log(gutil.colors.green('gulp excel') + ' - Сгенерировать excel файл со списком слайдов и их дескрипшенов, согласно файлу descriptions.json');
  gutil.log(gutil.colors.green('gulp createpresent') + ' - Создать презентацию в salesforce или обновить поля уже существующей');
  gutil.log(gutil.colors.green('gulp screenshots') + ' - Сгенерировать скриншоты слайдов и сохранить их в папку _screenshots/');
};
