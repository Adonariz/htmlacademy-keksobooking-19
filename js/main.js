'use strict';

// var PIN_WIDTH = 50;
// var PIN_HEIGHT = 70;

var map = document.querySelector('.map');
var pinsBlock = map.querySelector('.map__pins');
var mainPin = map.querySelector('.map__pin--main');
var advertForm = document.querySelector('.ad-form');
var advertFormFieldsets = advertForm.querySelectorAll('fieldset');
var filtersContainer = map.querySelector('.map__filters-container');
var mapFilters = filtersContainer.querySelectorAll('.map__filter');
var mapFeatures = filtersContainer.querySelectorAll('.map__features');

var advertRoomNumber = advertForm.querySelector('#room_number');
var advertGuestNumber = advertForm.querySelector('#capacity');
var advertRoomType = advertForm.querySelector('#type');
var advertPrice = advertForm.querySelector('#price');
var advertCheckInTime = advertForm.querySelector('#timein');
var advertCheckOutTime = advertForm.querySelector('#timeout');

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

// активация карты и формы

// отключаем инпуты
var disableInputs = function (inputsArray) {
  for (var i = 0; i < inputsArray.length; i++) {
    inputsArray[i].setAttribute('disabled', 'true');
  }
};

var deactivatePage = function () {
  disableInputs(advertFormFieldsets);
  disableInputs(mapFilters);
  disableInputs(mapFeatures);
};

// включаем инпуты
var enableInputs = function (inputsArray) {
  for (var i = 0; i < inputsArray.length; i++) {
    inputsArray[i].removeAttribute('disabled');
  }
};

// активируем страницу
var activatePage = function () {
  map.classList.remove('map--faded');
  advertForm.classList.remove('ad-form--disabled');
  pinsBlock.appendChild(createPinsBlock(window.data.advertsArray));
  addPopupCard();
  enableInputs(advertFormFieldsets);
  enableInputs(mapFilters);
  enableInputs(mapFeatures);
  advertGuestNumber.value = 1;
  advertPrice.placeholder = 1000;
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

// валидация формы
// заполнение адреса
var fillAddress = function () {
  advertForm.querySelector('#address').value = (mainPin.offsetLeft + Math.floor(window.data.PIN_WIDTH / 2)) + ', ' + (mainPin.offsetTop + window.data.PIN_HEIGHT);
};

// сочетание гостей и спальных мест
var onRoomCapacityChange = function () {
  advertGuestNumber.setCustomValidity('');

  if (advertRoomNumber.value < advertGuestNumber.value) {
    advertGuestNumber.setCustomValidity('Все не уместятся! Выбери жилье повместительнее!');
  }

  if (advertRoomNumber.value === '100' && advertGuestNumber.value !== '0') {
    advertGuestNumber.setCustomValidity('Здесь лишним гостям не будут рады');
  }
};

// минимальная стоимость от типа жилья
var onRoomTypeChange = function () {
  switch (advertRoomType.value) {
    case 'bungalo':
      advertPrice.setAttribute('min', 0);
      advertPrice.placeholder = 0;
      break;

    case 'flat':
      advertPrice.setAttribute('min', 1000);
      advertPrice.placeholder = 1000;
      break;

    case 'house':
      advertPrice.setAttribute('min', 5000);
      advertPrice.placeholder = 5000;
      break;

    case 'palace':
      advertPrice.setAttribute('min', 10000);
      advertPrice.placeholder = 10000;
      break;
  }
};

// синхронизация времени
var onCheckInTimeChange = function () {
  advertCheckOutTime.value = advertCheckInTime.value;
};

var onCheckOutTimeChange = function () {
  advertCheckInTime.value = advertCheckOutTime.value;
};

// неактивная страница
deactivatePage();
fillAddress();

// добавляем обработчики
mainPin.addEventListener('mousedown', onMainPinMousedown);
mainPin.addEventListener('keydown', onMainPinKeydown);
advertRoomNumber.addEventListener('change', onRoomCapacityChange);
advertGuestNumber.addEventListener('change', onRoomCapacityChange);
advertRoomType.addEventListener('change', onRoomTypeChange);
advertCheckInTime.addEventListener('change', onCheckInTimeChange);
advertCheckOutTime.addEventListener('change', onCheckOutTimeChange);
