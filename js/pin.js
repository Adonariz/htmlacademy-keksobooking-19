'use strict';

(function () {
  var PIN_WIDTH = 50;
  var PIN_HEIGHT = 70;

  var pinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');

  window.pin = {
    render: function (advert) {
      var pin = pinTemplate.cloneNode(true);
      var pinImg = pin.querySelector('img');

      pin.dataset.id = advert.id;
      pinImg.src = advert.author.avatar;
      pinImg.alt = advert.offer.title;
      pin.style.left = (advert.location.lat - PIN_WIDTH / 2) + 'px';
      pin.style.top = (advert.location.lng - PIN_HEIGHT) + 'px';

      return pin;
    }
  };
})();
