'use strict';

(function () {
  var LOCATION_Y_MIN = 130;
  var LOCATION_Y_MAX = 630;
  var MAIN_PIN_WIDTH = 65;
  var MAIN_PIN_HEIGHT = 65;

  var mainPin = document.querySelector('.map__pin--main');
  var maxWidth = document.querySelector('.map').offsetWidth;
  var address = window.form.address;

  // чтобы главный пин был над другими пинами
  mainPin.style.zIndex = '2';

  // перемещение главного пина
  var dragMainPin = function (evt) {
    var startCoords = {
      x: evt.clientX,
      y: evt.clientY
    };

    var onMouseMove = function (moveEvt) {
      moveEvt.preventDefault();

      var mapLimits = {
        x: {
          min: 0,
          max: maxWidth - MAIN_PIN_WIDTH
        },

        y: {
          min: LOCATION_Y_MIN,
          max: LOCATION_Y_MAX
        }
      };

      var moveArea = {
        top: mapLimits.y.min - MAIN_PIN_HEIGHT,
        right: mapLimits.x.max,
        bottom: mapLimits.y.max - MAIN_PIN_HEIGHT,
        left: mapLimits.x.min
      };

      var shift = {
        x: startCoords.x - moveEvt.clientX,
        y: startCoords.y - moveEvt.clientY
      };

      startCoords = {
        x: moveEvt.clientX,
        y: moveEvt.clientY
      };

      var mainPinCoordinates = {
        x: mainPin.offsetLeft - shift.x,
        y: mainPin.offsetTop - shift.y
      };

      // задаем границы перемещения
      if (mainPinCoordinates.y > moveArea.top && mainPinCoordinates.y < moveArea.bottom) {
        mainPin.style.top = mainPinCoordinates.y + 'px';
      }

      if (mainPinCoordinates.x > moveArea.left && mainPinCoordinates.x < moveArea.right) {
        mainPin.style.left = mainPinCoordinates.x + 'px';
      }

      var pinTailCoordinates = {
        x: mainPinCoordinates.x + Math.floor(MAIN_PIN_WIDTH / 2),
        y: mainPinCoordinates.y + MAIN_PIN_HEIGHT,
      };

      // выводим адрес в поле формы
      address.value = (pinTailCoordinates.x + ', ' + pinTailCoordinates.y);
    };

    // удаление обработчиков при отпускании пина
    var onMouseUp = function (upEvt) {
      upEvt.preventDefault();
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };

  // экспорируемые значения
  window.mainPin = {
    element: mainPin,
    width: MAIN_PIN_WIDTH,
    height: MAIN_PIN_HEIGHT,
    drag: dragMainPin
  };
})();
