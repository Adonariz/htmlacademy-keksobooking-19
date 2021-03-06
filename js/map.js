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

  var MainPinDefaultCoords = {
    X: 570,
    Y: 375
  };

  // создаем и вставляем фрагмент
  var createPinsBlock = function (array) {
    var fragment = document.createDocumentFragment();

    array.forEach(function (item, index) {
      if (item.offer !== undefined) {
        item.id = index;
        var pin = window.pin.render(item);
        fragment.appendChild(pin);
      }
    });

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

    var onPopupCloseClick = function () {
      var activePins = map.querySelectorAll('.map__pin--active');

      activePins.forEach(function (pin) {
        pin.classList.remove('map__pin--active');
      });

      popup.remove();
      popupClose.removeEventListener('click', onPopupCloseClick);
      document.removeEventListener('keydown', onDocumentEscKeydown);
    };

    popupClose.addEventListener('click', onPopupCloseClick);
    document.addEventListener('keydown', onDocumentEscKeydown);
  };

  // заполнение адреса
  var setInitialAddress = function () {
    address.value = (MainPinDefaultCoords.X + Math.floor(MAIN_PIN_WIDTH / 2)) + ', ' + (MainPinDefaultCoords.Y + MAIN_PIN_HEIGHT);
  };

  setInitialAddress();

  var setDefaultPosition = function () {
    mainPin.style.left = MainPinDefaultCoords.X + 'px';
    mainPin.style.top = MainPinDefaultCoords.Y + 'px';
  };

  // деактивация страницы
  var deactivateAllInputs = function () {
    window.utils.setInputAttribute(mapFilters, true);
    window.utils.setInputAttribute(mapFeatures, true);
    window.utils.setInputAttribute(window.form.fieldsets, true);

    mapFilters.forEach(function (filter) {
      filter.value = window.filter.default;
    });

    mapFeatures.forEach(function (checkbox) {
      checkbox.checked = false;
    });
  };

  deactivateAllInputs();
  window.form.setDefault();

  var removePins = function () {
    var pins = map.querySelectorAll('.map__pin:not(.map__pin--main)');
    var openedCard = document.querySelector('.map__card');

    pins.forEach(function (element) {
      element.remove();
    });

    if (openedCard) {
      openedCard.remove();
    }

    document.removeEventListener('keydown', onDocumentEscKeydown);
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
    window.form.setDefault();
    window.form.removeListeners();
    window.upload.reset();
    deactivateAllInputs();
  };

  // активируем страницу
  var onLoadSuccess = function (data) {
    downloadedAdverts = data;
    var filteredArray = window.filter.process(downloadedAdverts);
    createPinsBlock(filteredArray);
    window.utils.setInputAttribute(mapFilters);
    window.utils.setInputAttribute(mapFeatures);
    return downloadedAdverts;
  };

  var activatePage = function () {
    window.backend.load(onLoadSuccess, window.messages.showError);

    map.classList.remove('map--faded');
    form.classList.remove('ad-form--disabled');

    map.addEventListener('click', onPinClick);
    filtersForm.addEventListener('change', onFiltersChange);
    form.addEventListener('submit', onFormSubmit);
    userAvatar.addEventListener('change', onUserAvatarChange);
    resetButton.addEventListener('click', onResetClick);
    imagesInput.addEventListener('change', onImagesInputChange);

    window.utils.setInputAttribute(window.form.fieldsets);
    window.form.addListeners();
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

  var onDocumentEscKeydown = function (evt) {
    var popup = document.querySelector('.map__card');

    if (evt.key === window.utils.ESC_KEY) {
      var activePins = map.querySelectorAll('.map__pin--active');

      activePins.forEach(function (pin) {
        pin.classList.remove('map__pin--active');
      });

      popup.remove();
      document.removeEventListener('keydown', onDocumentEscKeydown);
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

