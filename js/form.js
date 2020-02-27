'use strict';

(function () {
  var DEFAULT_GUEST_NUMBER = 1;
  var MAX_ROOMS = '100';
  var PIN_WIDTH = window.data.PIN_WIDTH;
  var PIN_HEIGHT = window.data.PIN_HEIGHT;

  var map = document.querySelector('.map');
  var mainPin = map.querySelector('.map__pin--main');
  var form = document.querySelector('.ad-form');
  var roomNumber = form.querySelector('#room_number');
  var guestNumber = form.querySelector('#capacity');
  var roomType = form.querySelector('#type');
  var price = form.querySelector('#price');
  var checkInTime = form.querySelector('#timein');
  var checkOutTime = form.querySelector('#timeout');
  var advertFormFieldsets = form.querySelectorAll('fieldset');
  var mapFilters = map.querySelectorAll('.map__filter');
  var mapFeatures = map.querySelectorAll('.map__features');

  var defaultMinPrice = window.data.roomData[roomType.value].minPrice;

  // управление инпутами
  var disableInputs = function (inputsArray) {
    for (var i = 0; i < inputsArray.length; i++) {
      inputsArray[i].setAttribute('disabled', 'true');
    }
  };

  var enableInputs = function (inputsArray) {
    for (var i = 0; i < inputsArray.length; i++) {
      inputsArray[i].removeAttribute('disabled');
    }
  };

  // отключение всех инпутов
  var disableAllInputs = function () {
    disableInputs(advertFormFieldsets);
    disableInputs(mapFilters);
    disableInputs(mapFeatures);
  };

  // заполнение адреса
  var getDefaultAddress = function () {
    form.querySelector('#address').value = (mainPin.offsetLeft + Math.floor(PIN_WIDTH / 2)) + ', ' + (mainPin.offsetTop + PIN_HEIGHT);
  };

  // валидация формы
  // дефолтные значения
  getDefaultAddress();
  disableAllInputs();
  price.setAttribute('min', defaultMinPrice);
  price.placeholder = defaultMinPrice;
  guestNumber.value = DEFAULT_GUEST_NUMBER;

  // сочетание гостей и спальных мест
  var onRoomCapacityChange = function () {
    guestNumber.setCustomValidity('');

    if (roomNumber.value < guestNumber.value) {
      guestNumber.setCustomValidity('Все не уместятся! Выбери жилье повместительнее!');
    }

    if (roomNumber.value === MAX_ROOMS && guestNumber.value !== '0') {
      guestNumber.setCustomValidity('Здесь лишним гостям не будут рады');
    }
  };

  // минимальная стоимость от типа жилья
  var onRoomTypeChange = function () {
    var minPrice = window.data.roomData[roomType.value].minPrice;
    price.min = minPrice;
    price.placeholder = minPrice;
  };

  // синхронизация времени
  var onCheckInTimeChange = function () {
    checkOutTime.value = checkInTime.value;
  };

  var onCheckOutTimeChange = function () {
    checkInTime.value = checkOutTime.value;
  };

  // обработчики событий
  roomNumber.addEventListener('change', onRoomCapacityChange);
  guestNumber.addEventListener('change', onRoomCapacityChange);
  roomType.addEventListener('change', onRoomTypeChange);
  checkInTime.addEventListener('change', onCheckInTimeChange);
  checkOutTime.addEventListener('change', onCheckOutTimeChange);

  // экспортируемые значения
  window.form = {
    // активация всех инпутов
    enableAllInputs: function () {
      enableInputs(advertFormFieldsets);
      enableInputs(mapFilters);
      enableInputs(mapFeatures);
    }
  };
})();
