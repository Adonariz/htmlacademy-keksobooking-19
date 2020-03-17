'use strict';

(function () {
  var DEFAULT_GUEST_NUMBER = 1;
  var MAX_ROOMS = '100';

  var form = document.querySelector('.ad-form');
  var address = form.querySelector('#address');
  var roomNumber = form.querySelector('#room_number');
  var guestNumber = form.querySelector('#capacity');
  var roomType = form.querySelector('#type');
  var price = form.querySelector('#price');
  var checkInTime = form.querySelector('#timein');
  var checkOutTime = form.querySelector('#timeout');
  var formFieldsets = form.querySelectorAll('fieldset');
  var submitButton = form.querySelector('.ad-form__submit');
  var resetButton = form.querySelector('.ad-form__reset');

  var defaultMinPrice = window.card.roomData[roomType.value].minPrice;

  // валидация формы
  // дефолтные значения
  var setDefaultValues = function () {
    price.setAttribute('min', defaultMinPrice);
    price.placeholder = defaultMinPrice;
    guestNumber.value = DEFAULT_GUEST_NUMBER;
  };

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
    var minPrice = window.card.roomData[roomType.value].minPrice;
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

  // отправка формы
  var successHandler = function () {
    window.messages.showSuccess();
    submitButton.textContent = 'Сохранить';
    submitButton.disabled = false;
  };

  var errorHandler = function (errorMessage) {
    window.messages.showError(errorMessage);
    submitButton.textContent = 'Сохранить';
    submitButton.disabled = false;
  };

  var sendForm = function () {
    window.backend.save(new FormData(form), successHandler, errorHandler);
    submitButton.textContent = 'Данные отправляются...';
    submitButton.disabled = true;
  };

  // экспортируемые значения
  window.form = {
    element: form,
    fieldsets: formFieldsets,
    address: address,
    send: sendForm,
    setDefault: setDefaultValues,
    reset: resetButton
  };
})();
