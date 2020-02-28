'use strict';

(function () {
  var DEFAULT_GUEST_NUMBER = 1;
  var MAX_ROOMS = '100';
  var MAIN_PIN_WIDTH = window.data.MAIN_PIN_WIDTH;
  var MAIN_PIN_HEIGHT = window.data.MAIN_PIN_HEIGHT;

  var form = window.data.formEl;
  var address = form.querySelector('#address');
  var roomNumber = form.querySelector('#room_number');
  var guestNumber = form.querySelector('#capacity');
  var roomType = form.querySelector('#type');
  var price = form.querySelector('#price');
  var checkInTime = form.querySelector('#timein');
  var checkOutTime = form.querySelector('#timeout');
  var formFieldsets = form.querySelectorAll('fieldset');

  var defaultMinPrice = window.data.roomData[roomType.value].minPrice;
  var mainPin = window.data.mainPin;

  // заполнение адреса
  var getDefaultAddress = function () {
    address.value = (mainPin.offsetLeft + Math.floor(MAIN_PIN_WIDTH / 2)) + ', ' + (mainPin.offsetTop + MAIN_PIN_HEIGHT);
  };

  // валидация формы
  // дефолтные значения
  getDefaultAddress();
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
    formFieldsets: formFieldsets,
    address: address
  };
})();
