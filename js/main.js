'use strict';

var NUMBER_OF_ADVERTS = 8;
var TIMES = ['12:00', '13:00', '14:00'];
var TYPES = ['palace', 'flat', 'house', 'bungalo'];
var FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var PHOTOS = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];
var ROOMS_MIN = 1;
var ROOMS_MAX = 3;
var GUESTS_MIN = 0;
var GUESTS_MAX = 2;
var PRICE_MIN = 0;
var PRICE_MAX = 10000;
var LOCATION_Y_MIN = 130;
var LOCATION_Y_MAX = 630;
var MOUSE_LB = 0;
var ENTER_KEY = 'Enter';
var ESC_KEY = 'Escape';
var PIN_WIDTH = 50;
var PIN_HEIGHT = 70;

var map = document.querySelector('.map');
var pinsBlock = map.querySelector('.map__pins');
var mainPin = map.querySelector('.map__pin--main');
var advertForm = document.querySelector('.ad-form');
var advertFormFieldsets = advertForm.querySelectorAll('fieldset');
var filtersContainer = map.querySelector('.map__filters-container');
var mapFilters = filtersContainer.querySelectorAll('.map__filter');
var mapFeatures = filtersContainer.querySelectorAll('.map__features');
var pinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');
var popupCardTemplate = document.querySelector('#card').content.querySelector('.popup');
var advertRoomNumber = advertForm.querySelector('#room_number');
var advertGuestNumber = advertForm.querySelector('#capacity');
var advertRoomType = advertForm.querySelector('#type');
var advertPrice = advertForm.querySelector('#price');
var advertCheckInTime = advertForm.querySelector('#timein');
var advertCheckOutTime = advertForm.querySelector('#timeout');

var locationXMin = PIN_WIDTH / 2;
var locationXMax = map.offsetWidth - PIN_WIDTH / 2;

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
  var locationX = getRandomInt(locationXMin, locationXMax);
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
      features: clipArray(FEATURES),
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
  var pinImg = pin.querySelector('img');

  pinImg.src = advert.author.avatar;
  pinImg.alt = advert.offer.title;
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

// склонение числительных (numeralize-ru)
var pluralize = function (count, one, two, five) {
  count = Math.floor(Math.abs(count)) % 100;
  if (count > 10 && count < 20) {
    return five;
  }

  count = count % 10;
  if (count === 1) {
    return one;
  }

  if (count >= 2 && count <= 4) {
    return two;
  }

  return five;
};

// создаем карточку объявления
var renderPopupCard = function (advert) {
  var сard = popupCardTemplate.cloneNode(true);
  var avatar = сard.querySelector('.popup__avatar');
  var title = сard.querySelector('.popup__title');
  var address = сard.querySelector('.popup__text--address');
  var price = сard.querySelector('.popup__text--price');
  var type = сard.querySelector('.popup__type');
  var capacity = сard.querySelector('.popup__text--capacity');
  var time = сard.querySelector('.popup__text--time');
  var features = сard.querySelector('.popup__features');
  var feature = сard.querySelectorAll('.popup__feature');
  var description = сard.querySelector('.popup__description');
  var photos = сard.querySelector('.popup__photos');
  var photo = photos.querySelector('.popup__photo');
  var roomType = '';
  var roomText = 'комната';
  var guestText = 'гостя';

  avatar.src = advert.author.avatar;
  title.textContent = advert.offer.title;
  address.textContent = advert.offer.address;
  price.textContent = advert.offer.price + '₽/ночь';

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

  type.textContent = roomType;
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

  capacity.textContent = advert.offer.rooms + ' ' + roomText + ' для ' + advert.offer.guests + ' ' + guestText;
  // если выпадает 0 гостей
  if (advert.offer.guests === 0) {
    capacity.textContent = advert.offer.rooms + ' ' + roomText + ' без гостей';
  }

  time.textContent = 'Заезд после ' + advert.offer.checkin + ', выезд до ' + advert.offer.checkout;

  // удаляем ненужные фичи из шаблона
  for (var i = features.length - 1; i >= advert.offer.features.length; i--) {
    features.removeChild(feature[i]);
  }

  description.textContent = advert.offer.description;
  photo.src = advert.offer.photos[0];

  // если больше одной фото
  if (advert.offer.photos.length > 1) {
    for (var j = 1; j < advert.offer.photos.length; j++) {
      var newPopupPhoto = photo.cloneNode(false);
      photos.appendChild(newPopupPhoto);
      newPopupPhoto.src = advert.offer.photos[j];
    }
  }

  return сard;
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
      map.insertBefore(renderPopupCard(advertsArray[index]), filtersContainer);
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
    if (evt.key === ESC_KEY) {
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
  pinsBlock.appendChild(createPinsBlock(advertsArray));
  addPopupCard();
  enableInputs(advertFormFieldsets);
  enableInputs(mapFilters);
  enableInputs(mapFeatures);
  advertGuestNumber.value = 1;
  advertPrice.placeholder = 1000;
};

var onMainPinMousedown = function (evt) {
  if (evt.button === MOUSE_LB) {
    activatePage();
    mainPin.removeEventListener('mousedown', onMainPinMousedown);
    mainPin.removeEventListener('keydown', onMainPinKeydown);
  }
};

var onMainPinKeydown = function (evt) {
  if (evt.key === ENTER_KEY) {
    activatePage();
    mainPin.removeEventListener('mousedown', onMainPinMousedown);
    mainPin.removeEventListener('keydown', onMainPinKeydown);
  }
};

// валидация формы
// заполнение адреса
var fillAddress = function () {
  advertForm.querySelector('#address').value = (mainPin.offsetLeft + Math.floor(PIN_WIDTH / 2)) + ', ' + (mainPin.offsetTop + PIN_HEIGHT);
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
