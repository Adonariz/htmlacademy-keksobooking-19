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

var map = document.querySelector('.map');
var pinsBlock = map.querySelector('.map__pins');
var filtersContainer = map.querySelector('.map__filters-container');

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

// перемешиваем массив
var shuffleArray = function (array) {
  var j;
  var temp;

  for (var i = array.length - 1; i > 0; i--) {
    j = Math.floor(Math.random() * (i + 1));
    temp = array[j];
    array[j] = array[i];
    array[i] = temp;
  }

  return array;
};

// создаем объявление
var generateAdvert = function (index) {
  var advert = {
    author: {
      avatar: 'img/avatars/user0' + (index + 1) + '.png'
    },

    offer: {
      title: 'Заголовок объявления',
      address: location.x + ', ' + location.y,
      price: getRandomInt(PRICE_MIN, PRICE_MAX),
      type: getRandomArrayItem(TYPES),
      rooms: getRandomInt(ROOMS_MIN, ROOMS_MAX),
      guests: getRandomInt(GUESTS_MIN, GUESTS_MAX),
      checkin: getRandomArrayItem(TIMES),
      checkout: getRandomArrayItem(TIMES),
      features: clipArray(shuffleArray(FEAUTURES)),
      description: 'Описание объявления',
      photos: clipArray(PHOTOS)
    },

    location: {
      x: getRandomInt(LOCATION_X_MIN, locationXMax),
      y: getRandomInt(LOCATION_Y_MIN, LOCATION_Y_MAX)
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

// создаем и вставляем фрагмент
var renderPin = function (advert) {
  var pinTemplate = document.querySelector('#pin').content;
  var pin = pinTemplate.querySelector('.map__pin').cloneNode(true);

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

var renderAdvertCard = function (advert) {
  var advertCardTemplate = document.querySelector('#card').content;
  var advertCard = advertCardTemplate.querySelector('.map__card').cloneNode(true);

  return advertCard;
}

map.insertBefore(renderAdvertCard(generateAdvertsArray[0]), filtersContainer);
pinsBlock.appendChild(createPinsBlock(generateAdvertsArray(NUMBER_OF_ADVERTS)));

map.classList.remove('map--faded');
