'use strict';

(function () {
  var popupCardTemplate = document.querySelector('#card').content.querySelector('.popup');

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

  var renderFeatures = function (features, container) {
    if (features.length > 0) {
      container.textContent = '';
      var fragment = document.createDocumentFragment();
      var featureElement = document.createElement('li');
      featureElement.classList.add('popup__feature');

      features.forEach(function (element) {
        var newFeature = featureElement.cloneNode(true);
        var classMod = 'popup__feature--' + element;
        newFeature.classList.add(classMod);
        fragment.appendChild(newFeature);
      });

      container.appendChild(fragment);
    } else {
      container.remove();
    }
  };

  var renderPhotos = function (photos, container, photo) {
    if (photos.length > 0) {
      container.textContent = '';
      var fragment = document.createDocumentFragment();

      photos.forEach(function (element) {
        var newPhoto = photo.cloneNode(true);
        newPhoto.src = element;
        fragment.appendChild(newPhoto);
      });

      container.appendChild(fragment);
    } else {
      container.remove();
    }

  };

  var renderCard = function (advert) {
    var сard = popupCardTemplate.cloneNode(true);
    var avatar = сard.querySelector('.popup__avatar');
    var title = сard.querySelector('.popup__title');
    var address = сard.querySelector('.popup__text--address');
    var price = сard.querySelector('.popup__text--price');
    var type = сard.querySelector('.popup__type');
    var capacity = сard.querySelector('.popup__text--capacity');
    var time = сard.querySelector('.popup__text--time');
    var featuresBlock = сard.querySelector('.popup__features');
    var description = сard.querySelector('.popup__description');
    var photos = сard.querySelector('.popup__photos');
    var photo = photos.querySelector('.popup__photo');
    var roomText = ['комната', 'комнаты', 'комнат'];
    var guestText = ['гостя', 'гостей', 'гостей'];

    avatar.src = advert.author.avatar;
    title.textContent = advert.offer.title;
    address.textContent = advert.offer.address;
    price.textContent = advert.offer.price + '₽/ночь';
    type.textContent = roomData[advert.offer.type].title;

    if (advert.offer.guests === 0) {
      capacity.textContent = advert.offer.rooms + ' ' + window.utils.pluralize(advert.offer.rooms, roomText) + ' без гостей';
    }

    capacity.textContent = advert.offer.rooms + ' ' + window.utils.pluralize(advert.offer.rooms, roomText) + ' для ' + advert.offer.guests + ' ' + window.utils.pluralize(advert.offer.guests, guestText);
    time.textContent = 'Заезд после ' + advert.offer.checkin + ', выезд до ' + advert.offer.checkout;
    renderFeatures(advert.offer.features, featuresBlock);
    description.textContent = advert.offer.description;
    renderPhotos(advert.offer.photos, photos, photo);

    return сard;
  };

  window.card = {
    roomData: roomData,
    render: renderCard
  };
})();
