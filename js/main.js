'use strict';

var map = document.querySelector('.map');
var pinsBlock = map.querySelector('.map__pins');
var pinTemplate = document.querySelector('#pin').content;
var NUMBER_OF_ADVERTS = 8;

var times = ['12:00', '13:00', '14:00'];
var types = ['palace', 'flat', 'house', 'bungalo'];
var features = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var photos = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];
var rooms = [1, 2, 3];
var guests = [0, 1, 2];
var prices = [1000, 2000, 3000, 4000, 5000];
var LOCATION_Y_MIN = 130;
var LOCATION_Y_MAX = 630;
var LOCATION_X_MIN = 25;
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
    author: {},
    offer: {},
    location: {}
  };

  advert.author.avatar = 'img/avatars/user0' + (index + 1) + '.png';

  advert.location.x = getRandomInt(LOCATION_X_MIN, locationXMax);
  advert.location.y = getRandomInt(LOCATION_Y_MIN, LOCATION_Y_MAX);

  advert.offer.title = 'Заголовок объявления';
  advert.offer.address = advert.location.x + ', ' + advert.location.y;
  advert.offer.price = getRandomArrayItem(prices);
  advert.offer.type = getRandomArrayItem(types);
  advert.offer.rooms = getRandomArrayItem(rooms);
  advert.offer.guests = getRandomArrayItem(guests);
  advert.offer.checkin = getRandomArrayItem(times);
  advert.offer.checkout = getRandomArrayItem(times);
  advert.offer.features = clipArray(shuffleArray(features));
  advert.offer.description = 'Описание объявления';
  advert.offer.photos = clipArray(photos);

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

// создаем фрагмент
var renderPin = function (advert) {
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

pinsBlock.appendChild(createPinsBlock(generateAdvertsArray(NUMBER_OF_ADVERTS)));

map.classList.remove('map--faded');
