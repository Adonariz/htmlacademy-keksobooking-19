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

    'bungalow': {
      title: 'Бунгало',
      minPrice: 0
    },

    'hotel': {
      title: 'Отель',
      minPrice: 5000
    },
  };

  var renderInfo = function (item, container) {
    if (item !== undefined) {
      container.textContent = item;
    } else {
      container.remove();
    }
  };

  var renderPrice = function (price, container) {
    if (price !== undefined) {
      container.textContent = price + '₽/ночь';
    } else {
      container.remove();
    }
  };

  var renderType = function (type, container) {
    if (type !== undefined) {
      container.textContent = roomData[type].title;
    } else {
      container.remove();
    }
  };

  var renderCapacity = function (guests, rooms, container, roomText, guestText) {
    if (guests !== undefined) {
      if (guests === 0) {
        container.textContent = rooms + ' ' + window.utils.pluralize(rooms, roomText) + ' без гостей';
      } else {
        container.textContent = rooms + ' ' + window.utils.pluralize(rooms, roomText) + ' для ' + guests + ' ' + window.utils.pluralize(guests, guestText);
      }
    } else {
      container.remove();
    }
  };

  var renderTime = function (checkin, checkout, container) {
    if (checkin !== undefined && checkout !== undefined) {
      container.textContent = 'Заезд после ' + checkin + ', выезд до ' + checkout;
    } else {
      container.remove();
    }
  };

  var renderFeatures = function (features, container) {
    if (features !== undefined && features.length > 0) {
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
    if (photos !== undefined && photos.length > 0) {
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
    renderInfo(advert.offer.title, title);
    renderInfo(advert.offer.address, address);
    renderPrice(advert.offer.price, price);
    renderType(advert.offer.type, type);
    renderCapacity(advert.offer.guests, advert.offer.rooms, capacity, roomText, guestText);
    renderTime(advert.offer.checkin, advert.offer.checkout, time);
    renderFeatures(advert.offer.features, featuresBlock);
    renderInfo(advert.offer.description, description);
    renderPhotos(advert.offer.photos, photos, photo);

    return сard;
  };

  window.card = {
    roomData: roomData,
    render: renderCard
  };
})();
