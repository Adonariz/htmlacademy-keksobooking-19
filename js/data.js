'use strict';
(function () {
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
  var PIN_WIDTH = 50;
  var PIN_HEIGHT = 70;

  var roomData = {
    'palace': {
      title: 'Дворец',
      minPrice: 10000
    },

    'flat': {
      title: 'Квартира',
      minPrice: 1000
    },

    'house': {
      title: 'Дом',
      minPrice: 5000
    },

    'bungalo': {
      title: 'Бунгало',
      minPrice: 0
    },
  };

  var map = document.querySelector('.map');

  // создаем объявление
  var generateAdvert = function (index) {
    var locationXMin = PIN_WIDTH / 2;
    var locationXMax = map.offsetWidth - PIN_WIDTH / 2;
    var locationX = window.utils.getRandomInt(locationXMin, locationXMax);
    var locationY = window.utils.getRandomInt(LOCATION_Y_MIN, LOCATION_Y_MAX);
    var time = window.utils.getRandomArrayItem(TIMES);

    var advert = {
      author: {
        avatar: 'img/avatars/user0' + (index + 1) + '.png'
      },

      offer: {
        title: 'Заголовок объявления',
        address: locationX + ', ' + locationY,
        price: window.utils.getRandomInt(PRICE_MIN, PRICE_MAX),
        type: window.utils.getRandomArrayItem(TYPES),
        rooms: window.utils.getRandomInt(ROOMS_MIN, ROOMS_MAX),
        guests: window.utils.getRandomInt(GUESTS_MIN, GUESTS_MAX),
        checkin: time,
        checkout: time,
        features: window.utils.clipArray(FEATURES),
        description: 'Описание объявления',
        photos: window.utils.clipArray(PHOTOS)
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

  window.data = {
    PIN_WIDTH: PIN_WIDTH,
    PIN_HEIGHT: PIN_HEIGHT,
    advertsArray: advertsArray,
    roomData: roomData
  };
})();
