'use strict';

(function () {
  var successTemplate = document.querySelector('#success').content.querySelector('.success');
  var errorTemplate = document.querySelector('#error').content.querySelector('.error');

  var renderMessage = function (template) {
    var node = template.cloneNode(true);
    var main = document.querySelector('main');
    var button = node.querySelector('button');

    document.addEventListener('click', function () {
      node.remove();
    }, {once: true});

    document.addEventListener('keydown', function (evt) {
      if (evt.key === window.utils.ESC_KEY) {
        node.remove();
      }
    }, {once: true});

    if (button) {
      button.addEventListener('click', function () {
        node.remove();
      }, {once: true});
    }

    main.appendChild(node);
  };

  window.messages = {
    // загрузка произошла успешно
    success: function () {
      renderMessage(successTemplate);
    },
    // вывод ошибки
    error: function (errorMessage) {
      renderMessage(errorTemplate);
      var messageText = document.querySelector('.error__message');
      messageText.textContent = errorMessage;
    }
  };
})();
