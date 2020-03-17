'use strict';

(function () {
  var MAIN_PIN_WIDTH = window.mainPin.width;
  var MAIN_PIN_HEIGHT = window.mainPin.height;

  var map = document.querySelector('.map');
  var mainPin = window.mainPin.element;
  var filtersContainer = map.querySelector('.map__filters-container');
  var filtersForm = window.filter.form;
  var pinsBlock = map.querySelector('.map__pins');
  var mapFilters = map.querySelectorAll('.map__filter');
  var mapFeatures = window.filter.features;
  var form = window.form.element;
  var address = window.form.address;
  var resetButton = window.form.reset;
  var userAvatar = window.upload.avatar;
  var onUserAvatarChange = window.upload.setAvatar;
  var imagesInput = window.upload.images;
  var onImagesInputChange = window.upload.setImages;

  var downloadedAdverts = [];
  var adverts = [];

  var mainPinDefaultCoords = {
    x: 570,
    y: 375
  };

  // создаем и вставляем фрагмент
  var createPinsBlock = function (array) {
    var fragment = document.createDocumentFragment();

    for (var i = 0; i < array.length; i++) {
      array[i].id = i;
      var pin = window.pin.render(array[i]);
      fragment.appendChild(pin);
    }

    adverts = array;
    pinsBlock.appendChild(fragment);
  };

  // отображение карточки при нажатии на метку
  var showPopupCard = function (advert) {
    var openedCard = document.querySelector('.map__card');
    if (openedCard) {
      openedCard.remove();
    }
    map.insertBefore(window.card.render(advert), filtersContainer);
    addPopupCardListeners();
  };

  var onPinClick = function (evt) {
    var activePins = map.querySelectorAll('.map__pin--active');
    var target = evt.target;
    var isClickOnPin = target.classList.contains('map__pin:not(map__pin--main)');
    var isClickInside = target.closest('.map__pin:not(.map__pin--main)');
    var currentPin;
    var isCurrentPinActive = isClickOnPin ? target.classList.contains('map__pin--active') : target.closest('.map__pin--active');

    if (isClickOnPin) {
      currentPin = target;
    } else if (isClickInside) {
      currentPin = isClickInside;
    }

    if (!currentPin || isCurrentPinActive) {
      return;
    }

    var pinId = +currentPin.dataset.id;
    var advert = adverts.find(function (ad) {
      return ad.id === pinId;
    });

    showPopupCard(advert);

    activePins.forEach(function (pin) {
      pin.classList.remove('map__pin--active');
    });

    currentPin.classList.add('map__pin--active');
  };

  // закрытие карточки
  var addPopupCardListeners = function () {
    var popup = document.querySelector('.map__card');
    var popupClose = popup.querySelector('.popup__close');

    popupClose.addEventListener('click', function () {
      var activePins = map.querySelectorAll('.map__pin--active');

      activePins.forEach(function (pin) {
        pin.classList.remove('map__pin--active');
      });

      popup.remove();
    }, {once: true});

    document.addEventListener('keydown', function (evt) {
      if (evt.key === window.utils.ESC_KEY) {
        var activePins = map.querySelectorAll('.map__pin--active');

        activePins.forEach(function (pin) {
          pin.classList.remove('map__pin--active');
        });

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

    mapFilters.forEach(function (filter) {
      filter.value = window.filter.default;
    });

    mapFeatures.forEach(function (checkbox) {
      checkbox.checked = false;
    });
  };

  deactivateAllInputs();
  window.form.default();

  var removePins = function () {
    var pins = map.querySelectorAll('.map__pin:not(.map__pin--main)');
    var openedCard = document.querySelector('.map__card');

    pins.forEach(function (element) {
      element.remove();
    });

    if (openedCard) {
      openedCard.remove();
    }
  };

  var deactivatePage = function () {
    form.reset();

    map.classList.add('map--faded');
    form.classList.add('ad-form--disabled');

    map.removeEventListener('click', onPinClick);
    filtersForm.removeEventListener('change', onFiltersChange);
    form.removeEventListener('submit', onFormSubmit);
    resetButton.removeEventListener('click', onResetClick);
    userAvatar.removeEventListener('change', onUserAvatarChange);

    removePins();
    setDefaultPosition();
    setInitialAddress();
    window.form.default();
    window.upload.reset();
    deactivateAllInputs();
  };

  // активируем страницу
  var activateAllInputs = function () {
    window.utils.enableInput(mapFilters);
    window.utils.enableInput(mapFeatures);
    window.utils.enableInput(window.form.fieldsets);
  };

  var onLoadSuccess = function (data) {
    downloadedAdverts = data;
    var filteredArray = window.filter.process(downloadedAdverts);
    createPinsBlock(filteredArray);
    return downloadedAdverts;
  };

  var activatePage = function () {
    window.backend.load(onLoadSuccess, window.messages.error);

    map.classList.remove('map--faded');
    form.classList.remove('ad-form--disabled');

    map.addEventListener('click', onPinClick);
    filtersForm.addEventListener('change', onFiltersChange);
    form.addEventListener('submit', onFormSubmit);
    userAvatar.addEventListener('change', onUserAvatarChange);
    resetButton.addEventListener('click', onResetClick);
    imagesInput.addEventListener('change', onImagesInputChange);

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

  var onFiltersChange = window.debounce(function () {
    removePins();
    createPinsBlock(window.filter.process(downloadedAdverts));
  });

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
