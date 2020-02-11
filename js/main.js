'use stict';

var times = ['12:00', '13:00', '14:00'];
var types = ['palace', 'flat', 'house', 'bungalo'];
var features = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var photos = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg']
var rooms = [1, 2, 3]
var guests = [0, 1, 2]
var LOCATION_Y_MIN = 130;
var LOCATION_Y_MAX = 630;
var map = document.querySelector('.map');

var getRandomInt = function (min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

var getRandomArrayItem = function (array) {
  return array[getRandomInt(0, array.length - 1)];
};

var clipArray = function (array) {
  return array.slice(0, getRandomInt(1, array.length));
};

var generateAdvert = function (index) {
  var advert = {
    author: {},
    offer: {},
    location: {}
  };

  advert.author.avatar = 'img/avatars/user0' + index + '.png';

  advert.location.x = '';
  advert.location.y = '';

  advert.offer.title = 'Заголовок объявления';
  advert.offer.address = advert.location.x + ', ' + advert.location.y;
  advert.offer.price = '';
  advert.offer.type = getRandomArrayItem(types);
  advert.offer.rooms = getRandomArrayItem(rooms);
  advert.offer.guests = getRandomArrayItem(guests);
  advert.offer.checkin = getRandomArrayItem(times);
  advert.offer.checkout = getRandomArrayItem(times);
  advert.offer.features = '';
  advert.offer.description = 'Описание объявления';
  advert.offer.photos = clipArray(photos);

  return advert
};

var randomAdvert = generateAdvert(1);

console.log(randomAdvert);
map.classList.remove('map--faded');
