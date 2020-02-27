'use strict';

(function () {
  var popupCardTemplate = document.querySelector('#card').content.querySelector('.popup');

  window.card = {
    render: function (advert) {
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
      var roomText = ['комната', 'комнаты', 'комнат'];
      var guestText = ['гостя', 'гостей', 'гостей'];

      avatar.src = advert.author.avatar;
      title.textContent = advert.offer.title;
      address.textContent = advert.offer.address;
      price.textContent = advert.offer.price + '₽/ночь';
      type.textContent = window.data.roomData[advert.offer.type].title;

      capacity.textContent = advert.offer.rooms + ' ' + window.utils.pluralize(advert.offer.rooms, roomText) + ' для ' + advert.offer.guests + ' ' + window.utils.pluralize(advert.offer.guests, guestText);
      // если выпадает 0 гостей
      if (advert.offer.guests === 0) {
        capacity.textContent = advert.offer.rooms + ' ' + window.utils.pluralize(advert.offer.rooms, roomText) + ' без гостей';
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
    }
  };
})();
