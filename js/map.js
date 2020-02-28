'use strict';

(function () {
  var map = window.data.mapEl;
  var mainPin = window.data.mainPin;
  var filtersContainer = map.querySelector('.map__filters-container');
  var pinsBlock = map.querySelector('.map__pins');
  var mapFilters = map.querySelectorAll('.map__filter');
  var mapFeatures = map.querySelectorAll('.map__features');
  var form = window.data.formEl;

  // создаем и вставляем фрагмент
  var createPinsBlock = function (array) {
    var fragment = document.createDocumentFragment();

    for (var i = 0; i < array.length; i++) {
      fragment.appendChild(window.pin.render(array[i]));
    }

    return fragment;
  };

  // отображение карточки при нажатии на метку
  var addPopupCard = function () {
    var pins = document.querySelectorAll('.map__pin:not(.map__pin--main)');
    pins.forEach(function (element, index) {
      element.addEventListener('click', function () {
        var isElement = document.querySelector('.map__card');
        if (isElement) {
          isElement.remove();
        }
        map.insertBefore(window.card.render(window.data.advertsArray[index]), filtersContainer);
        closePopup();
      });
    });
  };

  // закрытие карточки
  var closePopup = function () {
    var popup = document.querySelector('.map__card');
    var popupClose = popup.querySelector('.popup__close');

    popupClose.addEventListener('click', function () {
      popup.remove();
    }, {once: true});

    document.addEventListener('keydown', function (evt) {
      if (evt.key === window.utils.ESC_KEY) {
        popup.remove();
      }
    }, {once: true});
  };

  // страница деактивирована
  window.utils.disableInput(mapFilters);
  window.utils.disableInput(mapFeatures);
  window.utils.disableInput(window.form.formFieldsets);

  // активируем страницу
  var activateAllInputs = function () {
    window.utils.enableInput(mapFilters);
    window.utils.enableInput(mapFeatures);
    window.utils.enableInput(window.form.formFieldsets);
  };

  var activatePage = function () {
    map.classList.remove('map--faded');
    form.classList.remove('ad-form--disabled');

    pinsBlock.appendChild(createPinsBlock(window.data.advertsArray));
    addPopupCard();
    activateAllInputs();
  };

  var onMainPinMousedown = function (evt) {
    if (evt.button === window.utils.MOUSE_LB) {
      activatePage();
      mainPin.removeEventListener('mousedown', onMainPinMousedown);
      mainPin.removeEventListener('keydown', onMainPinKeydown);
    }
  };

  var onMainPinKeydown = function (evt) {
    if (evt.key === window.utils.ENTER_KEY) {
      activatePage();
      mainPin.removeEventListener('mousedown', onMainPinMousedown);
      mainPin.removeEventListener('keydown', onMainPinKeydown);
    }
  };

  // добавляем обработчики
  mainPin.addEventListener('mousedown', onMainPinMousedown);
  mainPin.addEventListener('keydown', onMainPinKeydown);
})();
