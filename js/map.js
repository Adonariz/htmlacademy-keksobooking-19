'use strict';

(function () {
  var MAIN_PIN_WIDTH = 65;
  var MAIN_PIN_HEIGHT = 65;
  var LOCATION_Y_MIN = 130;
  var LOCATION_Y_MAX = 630;

  var map = document.querySelector('.map');
  var mainPin = document.querySelector('.map__pin--main');
  var filtersContainer = map.querySelector('.map__filters-container');
  var pinsBlock = map.querySelector('.map__pins');
  var mapFilters = map.querySelectorAll('.map__filter');
  var mapFeatures = map.querySelectorAll('.map__features');
  var form = window.form.element;
  var address = window.form.address;

  // создаем и вставляем фрагмент
  var createPinsBlock = function (array) {
    var fragment = document.createDocumentFragment();

    for (var i = 0; i < array.length; i++) {
      var pin = window.pin.render(array[i]);
      fragment.appendChild(pin);
    }

    pinsBlock.appendChild(fragment);
    addPopupCard(array);
  };

  // отображение карточки при нажатии на метку
  var addPopupCard = function (array) {
    var pins = document.querySelectorAll('.map__pin:not(.map__pin--main)');
    pins.forEach(function (element, index) {
      element.addEventListener('click', function () {
        var isElement = document.querySelector('.map__card');
        if (isElement) {
          isElement.remove();
        }
        map.insertBefore(window.card.render(array[index]), filtersContainer);
        closePopup();
      });
    });
  };

  var onPinClick = function (evt) {
    var isActive = map.querySelector('.map__pin--active');

    if (evt.target.matches('.map__pin:not(.map__pin--main)')) {
      if (isActive) {
        isActive.classList.remove('map__pin--active');
      }
      evt.target.classList.add('map__pin--active');
    } else if (evt.target.matches('.map__pin:not(.map__pin--main) img')) {
      if (isActive) {
        isActive.classList.remove('map__pin--active');
      }
      evt.target.parentNode.classList.add('map__pin--active');
    }
  };

  // закрытие карточки
  var closePopup = function () {
    var popup = document.querySelector('.map__card');
    var popupClose = popup.querySelector('.popup__close');

    popupClose.addEventListener('click', function () {
      var activePin = map.querySelector('.map__pin--active');
      activePin.classList.remove('map__pin--active');
      popup.remove();
    }, {once: true});

    document.addEventListener('keydown', function (evt) {
      if (evt.key === window.utils.ESC_KEY) {
        var activePin = map.querySelector('.map__pin--active');
        activePin.classList.remove('map__pin--active');
        popup.remove();
      }
    }, {once: true});
  };

  // заполнение адреса
  var getDefaultAddress = function () {
    address.value = (mainPin.offsetLeft + Math.floor(MAIN_PIN_WIDTH / 2)) + ', ' + (mainPin.offsetTop + MAIN_PIN_HEIGHT);
  };

  // страница деактивирована
  window.utils.disableInput(mapFilters);
  window.utils.disableInput(mapFeatures);
  window.utils.disableInput(window.form.fieldsets);
  getDefaultAddress();

  // активируем страницу
  var activateAllInputs = function () {
    window.utils.enableInput(mapFilters);
    window.utils.enableInput(mapFeatures);
    window.utils.enableInput(window.form.fieldsets);
  };

  var activatePage = function () {
    map.classList.remove('map--faded');
    form.classList.remove('ad-form--disabled');
    window.backend.load(createPinsBlock, window.messages.error);
    map.addEventListener('click', onPinClick);
    activateAllInputs();
  };

  // управление меткой
  var onMainPinMousedown = function (evt) {
    if (evt.button === window.utils.MOUSE_LB) {
      if (map.classList.contains('map--faded')) {
        activatePage();
      }

      evt.preventDefault();

      var startCoords = {
        x: evt.clientX,
        y: evt.clientY
      };

      var onMouseMove = function (moveEvt) {
        moveEvt.preventDefault();

        var mainPinDims = {
          width: MAIN_PIN_WIDTH,
          height: MAIN_PIN_HEIGHT
        };

        var mapLimits = {
          x: {
            min: 0,
            max: map.offsetWidth - mainPinDims.width
          },

          y: {
            min: LOCATION_Y_MIN,
            max: LOCATION_Y_MAX
          }
        };

        var moveArea = {
          top: mapLimits.y.min - mainPinDims.height,
          right: mapLimits.x.max,
          bottom: mapLimits.y.max - mainPinDims.height,
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

        if (mainPinCoordinates.y > moveArea.top && mainPinCoordinates.y < moveArea.bottom) {
          mainPin.style.top = mainPinCoordinates.y + 'px';
        }

        if (mainPinCoordinates.x > moveArea.left && mainPinCoordinates.x < moveArea.right) {
          mainPin.style.left = mainPinCoordinates.x + 'px';
        }

        var pinTailCoordinates = {
          x: mainPinCoordinates.x + Math.floor(mainPinDims.width / 2),
          y: mainPinCoordinates.y + mainPinDims.height,
        };

        address.value = (pinTailCoordinates.x + ', ' + pinTailCoordinates.y);
      };

      var onMouseUp = function (upEvt) {
        upEvt.preventDefault();
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
      };

      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
      mainPin.removeEventListener('keydown', onMainPinKeydown);
    }
  };

  var onMainPinKeydown = function (evt) {
    if (evt.key === window.utils.ENTER_KEY) {
      activatePage();
      mainPin.removeEventListener('keydown', onMainPinKeydown);
    }
  };

  // добавляем обработчики
  mainPin.addEventListener('mousedown', onMainPinMousedown);
  mainPin.addEventListener('keydown', onMainPinKeydown);
})();
