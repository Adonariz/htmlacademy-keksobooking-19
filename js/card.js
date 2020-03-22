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
    if (features.length > 0 && features !== undefined) {
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
    if (photos.length > 0 && photos !== undefined) {
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

    if (advert.offer.title !== undefined) {
      title.textContent = advert.offer.title;
    } else {
      title.remove();
    }

    if (advert.offer.address !== undefined) {
      address.textContent = advert.offer.address;
    } else {
      address.remove();
    }

    if (advert.offer.price !== undefined) {
      price.textContent = advert.offer.price + '₽/ночь';
    } else {
      price.remove();
    }

    if (advert.offer.type !== undefined) {
      type.textContent = roomData[advert.offer.type].title;
    } else {
      type.remove();
    }

    if (advert.offer.guests !== undefined) {
      if (advert.offer.guests === 0) {
        capacity.textContent = advert.offer.rooms + ' ' + window.utils.pluralize(advert.offer.rooms, roomText) + ' без гостей';
      } else {
        capacity.textContent = advert.offer.rooms + ' ' + window.utils.pluralize(advert.offer.rooms, roomText) + ' для ' + advert.offer.guests + ' ' + window.utils.pluralize(advert.offer.guests, guestText);
      }
    } else {
      capacity.remove();
    }

    if (advert.offer.checkin !== undefined && advert.offer.checkout !== undefined) {
      time.textContent = 'Заезд после ' + advert.offer.checkin + ', выезд до ' + advert.offer.checkout;
    } else {
      time.remove();
    }

    renderFeatures(advert.offer.features, featuresBlock);

    if (advert.offer.description !== undefined) {
      description.textContent = advert.offer.description;
    } else {
      description.remove();
    }

    renderPhotos(advert.offer.photos, photos, photo);

    return сard;
  };

  window.card = {
    roomData: roomData,
    render: renderCard
  };
})();
