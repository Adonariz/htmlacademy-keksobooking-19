'use strict';

(function () {
  var MAIN_PIN_WIDTH = window.mainPin.width;
  var MAIN_PIN_HEIGHT = window.mainPin.height;

  var map = document.querySelector('.map');
  var mainPin = window.mainPin.element;
  var filtersContainer = map.querySelector('.map__filters-container');
  var pinsBlock = map.querySelector('.map__pins');
  var mapFilters = map.querySelectorAll('.map__filter');
  var mapFeatures = map.querySelectorAll('.map__features');
  var form = window.form.element;
  var address = window.form.address;
  var resetButton = window.form.reset;

  var mainPinDefaultCoords = {
    x: 570,
    y: 375
  };

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
  var setInitialAddress = function () {
    address.value = (mainPinDefaultCoords.x + Math.floor(MAIN_PIN_WIDTH / 2)) + ', ' + (mainPinDefaultCoords.y + MAIN_PIN_HEIGHT);
  };

  setInitialAddress();

  var setDefaultPosition = function () {
    mainPin.style.left = mainPinDefaultCoords.x + 'px';
    mainPin.style.top = mainPinDefaultCoords.y + 'px';
  };

  // деактивация страницы
  var deactivateAllInputs = function () {
    window.utils.disableInput(mapFilters);
    window.utils.disableInput(mapFeatures);
    window.utils.disableInput(window.form.fieldsets);
  };

  deactivateAllInputs();
  window.form.default();

  var removePins = function () {
    var pins = map.querySelectorAll('.map__pin:not(.map__pin--main)');
    pins.forEach(function (element) {
      element.remove();
    });
  };

  var deactivatePage = function () {
    form.reset();
    map.classList.add('map--faded');
    form.classList.add('ad-form--disabled');
    removePins();
    setDefaultPosition();
    setInitialAddress();
    window.form.default();
    deactivateAllInputs();
  };

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
    form.addEventListener('submit', onFormSubmit);
    resetButton.addEventListener('click', onResetClick);
    activateAllInputs();
  };

  // управление меткой
  var onMainPinMousedown = function (evt) {
    if (evt.button === window.utils.MOUSE_LB) {
      if (map.classList.contains('map--faded')) {
        activatePage();
      }

      evt.preventDefault();
      window.mainPin.drag(evt);

      mainPin.removeEventListener('keydown', onMainPinKeydown);
    }
  };

  // обработчики
  var onMainPinKeydown = function (evt) {
    if (evt.key === window.utils.ENTER_KEY) {
      activatePage();
      mainPin.removeEventListener('keydown', onMainPinKeydown);
    }
  };

  var onFormSubmit = function (evt) {
    evt.preventDefault();
    window.form.send();
    deactivatePage();
    form.removeEventListener('submit', onFormSubmit);
    resetButton.removeEventListener('click', onResetClick);
  };

  var onResetClick = function (evt) {
    evt.preventDefault();
    deactivatePage();
    form.removeEventListener('submit', onFormSubmit);
    resetButton.removeEventListener('click', onResetClick);
  };

  // добавляем обработчики
  mainPin.addEventListener('mousedown', onMainPinMousedown);
  mainPin.addEventListener('keydown', onMainPinKeydown);
})();
