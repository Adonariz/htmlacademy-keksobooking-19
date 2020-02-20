'use strict';

var NUMBER_OF_ADVERTS = 8;
var TIMES = ['12:00', '13:00', '14:00'];
var TYPES = ['palace', 'flat', 'house', 'bungalo'];
var FEAUTURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var PHOTOS = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];
var ROOMS_MIN = 1;
var ROOMS_MAX = 3;
var GUESTS_MIN = 0;
var GUESTS_MAX = 2;
var PRICE_MIN = 0;
var PRICE_MAX = 10000;
var LOCATION_Y_MIN = 130;
var LOCATION_Y_MAX = 630;
var LOCATION_X_MIN = 25;
var MOUSE_LB = 0;
var ENTER_KEY = 'Enter';
var PIN_WIDTH = 50;
var PIN_HEIGHT = 70;

var map = document.querySelector('.map');
var pinsBlock = map.querySelector('.map__pins');
var pinMain = map.querySelector('.map__pin--main');
var advertForm = document.querySelector('.ad-form');
var advertFormFieldsets = advertForm.querySelectorAll('fieldset');
var filtersContainer = map.querySelector('.map__filters-container');
var mapFilters = filtersContainer.querySelectorAll('.map__filter');
var mapFeatures = filtersContainer.querySelectorAll('.map__features');
var pinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');
// var advertCardTemplate = document.querySelector('#card').content.querySelector('.map__card');
var advertRoomNumber = advertForm.querySelector('#room_number');
var advertGuestNumber = advertForm.querySelector('#capacity');

var locationXMax = map.offsetWidth - 25;

// генерируем случайное целое число
var getRandomInt = function (min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// получаем случайный элемент из массива
var getRandomArrayItem = function (array) {
  return array[getRandomInt(0, array.length - 1)];
};

// задаем случайную длину массиву
var clipArray = function (array) {
  return array.slice(0, getRandomInt(1, array.length));
};

// создаем объявление
var generateAdvert = function (index) {
  var locationX = getRandomInt(LOCATION_X_MIN, locationXMax);
  var locationY = getRandomInt(LOCATION_Y_MIN, LOCATION_Y_MAX);

  var advert = {
    author: {
      avatar: 'img/avatars/user0' + (index + 1) + '.png'
    },

    offer: {
      title: 'Заголовок объявления',
      address: locationX + ', ' + locationY,
      price: getRandomInt(PRICE_MIN, PRICE_MAX),
      type: getRandomArrayItem(TYPES),
      rooms: getRandomInt(ROOMS_MIN, ROOMS_MAX),
      guests: getRandomInt(GUESTS_MIN, GUESTS_MAX),
      checkin: getRandomArrayItem(TIMES),
      checkout: getRandomArrayItem(TIMES),
      features: clipArray(FEAUTURES),
      description: 'Описание объявления',
      photos: clipArray(PHOTOS)
    },

    location: {
      x: locationX,
      y: locationY
    }
  };

  return advert;
};

// создаем массив из объектов
var generateAdvertsArray = function (number) {
  var adverts = [];

  for (var i = 0; i < number; i++) {
    adverts.push(generateAdvert(i));
  }

  return adverts;
};

var advertsArray = generateAdvertsArray(NUMBER_OF_ADVERTS);

// создаем и вставляем фрагмент
var renderPin = function (advert) {
  var pin = pinTemplate.cloneNode(true);

  pin.querySelector('img').src = advert.author.avatar;
  pin.querySelector('img').alt = advert.offer.title;
  pin.style.left = (advert.location.x - 25) + 'px';
  pin.style.top = (advert.location.y - 70) + 'px';

  return pin;
};

var createPinsBlock = function (array) {
  var fragment = document.createDocumentFragment();

  for (var i = 0; i < array.length; i++) {
    fragment.appendChild(renderPin(array[i]));
  }

  return fragment;
};

/*
// создаем карточку объявления
var renderAdvertCard = function (advert) {
  var advertCard = advertCardTemplate.cloneNode(true);
  var advertAvatar = advertCard.querySelector('.popup__avatar');
  var advertTitle = advertCard.querySelector('.popup__title');
  var advertAddress = advertCard.querySelector('.popup__text--address');
  var advertPrice = advertCard.querySelector('.popup__text--price');
  var advertType = advertCard.querySelector('.popup__type');
  var advertCapacity = advertCard.querySelector('.popup__text--capacity');
  var advertTime = advertCard.querySelector('.popup__text--time');
  var advertFeatures = advertCard.querySelector('.popup__features');
  var advertFeature = advertCard.querySelectorAll('.popup__feature');
  var advertDescription = advertCard.querySelector('.popup__description');
  var advertPhotos = advertCard.querySelector('.popup__photos');
  var advertPhoto = advertPhotos.querySelector('.popup__photo');
  var roomType = '';
  var roomText = 'комната';
  var guestText = 'гостя';

  advertAvatar.src = advert.author.avatar;
  advertTitle.textContent = advert.offer.title;
  advertAddress.textContent = advert.offer.address;
  advertPrice.textContent = advert.offer.price + '₽/ночь';

  switch (advert.offer.type) {
    case 'palace':
      roomType = 'Дворец';
      break;

    case 'flat':
      roomType = 'Квартира';
      break;

    case 'house':
      roomType = 'Дом';
      break;

    case 'bungalo':
      roomType = 'Бунгало';
      break;
  }

  advertType.textContent = roomType;
  // склоняем "комната"
  if (advert.offer.rooms > 1 && advert.offer.rooms < 5) {
    roomText = 'комнаты';
  } else if (advert.offer.rooms >= 5) {
    roomText = 'комнат';
  }
  // склоняем "гость"
  if (advert.offer.guests > 1) {
    guestText = 'гостей';
  }

  advertCapacity.textContent = advert.offer.rooms + ' ' + roomText + ' для ' + advert.offer.guests + ' ' + guestText;
  // если выпадает 0 гостей
  if (advert.offer.guests === 0) {
    advertCapacity.textContent = advert.offer.rooms + ' ' + roomText + ' без гостей';
  }

  advertTime.textContent = 'Заезд после ' + advert.offer.checkin + ', выезд до ' + advert.offer.checkout;

  // удаляем ненужные фичи из шаблона
  for (var i = advertFeature.length - 1; i >= advert.offer.features.length; i--) {
    advertFeatures.removeChild(advertFeature[i]);
  }

  advertDescription.textContent = advert.offer.description;
  advertPhoto.src = advert.offer.photos[0];

  // если больше одной фото
  if (advert.offer.photos.length > 1) {
    for (var j = 1; j < advert.offer.photos.length; j++) {
      var newAdvertPhoto = advertPhoto.cloneNode(false);
      advertPhotos.appendChild(newAdvertPhoto);
      newAdvertPhoto.src = advert.offer.photos[j];
    }
  }

  return advertCard;
};

map.insertBefore(renderAdvertCard(advertsArray[0]), filtersContainer);
*/

// активация карты и формы

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

var deactivatePage = function () {
  disableInputs(advertFormFieldsets);
  disableInputs(mapFilters);
  disableInputs(mapFeatures);

};

var activatePage = function () {
  map.classList.remove('map--faded');
  pinsBlock.appendChild(createPinsBlock(advertsArray));
  advertForm.classList.remove('ad-form--disabled');
  enableInputs(advertFormFieldsets);
  enableInputs(mapFilters);
  enableInputs(mapFeatures);
  advertGuestNumber.value = 1;
};

var onPinMainMousedown = function (evt) {
  if (evt.button === MOUSE_LB) {
    activatePage();
    pinMain.removeEventListener('mousedown', onPinMainMousedown);
    pinMain.removeEventListener('keydown', onPinMainKeydown);
  }
};

var onPinMainKeydown = function (evt) {
  if (evt.key === ENTER_KEY) {
    activatePage();
    pinMain.removeEventListener('mousedown', onPinMainMousedown);
    pinMain.removeEventListener('keydown', onPinMainKeydown);
  }
};

var fillAddress = function () {
  advertForm.querySelector('#address').value = (pinMain.offsetLeft + Math.floor(PIN_WIDTH / 2)) + ', ' + (pinMain.offsetTop + PIN_HEIGHT);
};

var onRoomCapacityChange = function () {
  advertGuestNumber.setCustomValidity('');

  if (advertRoomNumber.value < advertGuestNumber.value) {
    advertGuestNumber.setCustomValidity('Все не уместятся! Выбери жилье повместительнее!');
  }

  if (advertRoomNumber.value === '100' && advertGuestNumber.value !== '0') {
    advertGuestNumber.setCustomValidity('Здесь лишним гостям не будут рады');
  }
};

deactivatePage();
fillAddress();

pinMain.addEventListener('mousedown', onPinMainMousedown);
pinMain.addEventListener('keydown', onPinMainKeydown);
advertRoomNumber.addEventListener('change', onRoomCapacityChange);
advertGuestNumber.addEventListener('change', onRoomCapacityChange);
