'use strict';

(function () {
  window.utils = {
    // кнопки ввода мыши и клавиатуры
    MOUSE_LB: 0,
    ENTER_KEY: 'Enter',
    ESC_KEY: 'Escape',

    // генерируем случайное целое число
    getRandomInt: function (min, max) {
      min = Math.ceil(min);
      max = Math.floor(max);
      return Math.floor(Math.random() * (max - min + 1)) + min;
    },

    // получаем случайный элемент из массива
    getRandomArrayItem: function (array) {
      return array[this.getRandomInt(0, array.length - 1)];
    },

    // задаем случайную длину массиву
    clipArray: function (array) {
      return array.slice(0, this.getRandomInt(1, array.length));
    },

    // склонение числительных
    pluralize: function (number, titles) {
      var cases = [2, 0, 1, 1, 1, 2];
      return titles[(number % 100 > 4 && number % 100 < 20) ? 2 : cases[(number % 10 < 5) ? number % 10 : 5]];
    },

    // отключение инпутов
    disableInput: function (inputsArray) {
      for (var i = 0; i < inputsArray.length; i++) {
        inputsArray[i].setAttribute('disabled', 'true');
      }
    },

    // включение инпутов
    enableInput: function (inputsArray) {
      for (var i = 0; i < inputsArray.length; i++) {
        inputsArray[i].removeAttribute('disabled');
      }
    }

  };
})();
