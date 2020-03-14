'use strict';

(function () {
  var FILTER_DEFAULT_VALUE = 'any';
  var ADVERT_LIMIT = 5;

  var housingType = document.querySelector('#housing-type');

  var filterAdverts = function (adverts) {
    return adverts.filter(function (advert) {
      return housingType.value !== FILTER_DEFAULT_VALUE ? advert.offer.type === housingType.value : advert.offer.type;
    }).slice(0, ADVERT_LIMIT);
  };

  window.filter = {
    type: housingType,
    limit: ADVERT_LIMIT,
    default: FILTER_DEFAULT_VALUE,
    array: filterAdverts
  };
})();
