'use strict';

(function () {
  var LOAD_URL = 'https://js.dump.academy/keksobooking/data';
  // var SEND_URL = 'https://js.dump.academy/code-and-magick/';
  var TIMEOUT_IN_MS = 10000; // 10 сек
  var Methods = {
    GET: 'GET',
    POST: 'POST'
  };
  var STATUS_OK = 200;
  var ErrorCodes = {
    400: 'Неверный запрос',
    403: 'Доступ запрещен',
    404: 'Ничего не найдено',
    500: 'Ошибка сервера',
    502: 'Неверный ответ сервера',
    503: 'Сервер временно недоступен'
  };

  // создаем запрос
  var createRequest = function (method, url, onSuccess, onError) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    // загрузка
    xhr.addEventListener('load', function () {
      if (xhr.status === STATUS_OK) {
        onSuccess(xhr.response);
      } else {
        var error = ErrorCodes[xhr.response] || 'Cтатус ответа: ' + xhr.status + ' ' + xhr.statusText;
        onError(error);
      }
    });
    // ошибка запроса
    xhr.addEventListener('error', function () {
      onError('Произошла ошибка соединения');
    });
    // превышение лимита времени
    xhr.addEventListener('timeout', function () {
      onError('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
    });

    xhr.timeout = TIMEOUT_IN_MS;
    xhr.open(method, url);

    return xhr;
  };

  window.backend = {
    load: function (onLoad, onError) {
      var request = createRequest(Methods.GET, LOAD_URL, onLoad, onError);
      request.send();
    },

    // save: function (data, onLoad, onError) {
    //   var request = createRequest(Methods.POST, SEND_URL, onLoad, onError);
    //   request.send(data);
    // }
  };
})();
