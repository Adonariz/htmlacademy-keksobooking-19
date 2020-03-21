'use strict';

(function () {
  var FILTER_DEFAULT_VALUE = 'any';
  var ADVERT_LIMIT = 5;

  var filtersBlock = document.querySelector('.map__filters');
  var featureItems = filtersBlock.querySelectorAll('input[type=checkbox]');

  var priceValues = {
    'low': {
      min: 0,
      max: 10000
    },

    'middle': {
      min: 10000,
      max: 50000
    },

    'high': {
      min: 50000,
      max: Infinity
    }
  };

  var getFilterValues = function () {
    var filterInputs = filtersBlock.querySelectorAll('.map__filter, input[type=checkbox]:checked');
    var filterValues = [];

    filterInputs.forEach(function (filter) {
      filterValues.push({
        name: filter.getAttribute('name'),
        value: filter.value
      });
    });

    return filterValues;
  };

  var checkFeature = function (features, value) {
    return features.some(function (feature) {
      return feature === value;
    });
  };

  var filterRules = {
    'housing-type': function (offer, value) {
      return offer.type === value;
    },

    'housing-price': function (offer, value) {
      return offer.price >= priceValues[value].min && offer.price < priceValues[value].max;
    },

    'housing-rooms': function (offer, value) {
      return offer.rooms === parseInt(value, 10);
    },

    'housing-guests': function (offer, value) {
      return offer.guests === parseInt(value, 10);
    },

    'features': function (offer, value) {
      return checkFeature(offer.features, value);
    },
  };

  // фильтруем массив

  var filterAdverts = function (array) {
    var filteredAdverts = [];
    for (var i = 0; i < array.length; i++) {
      var advert = array[i];

      var isOfferMatch = advert.offer && getFilterValues().every(function (element) {
        return (element.value === FILTER_DEFAULT_VALUE) ? true : filterRules[element.name](advert.offer, element.value);
      });

      if (isOfferMatch) {
        filteredAdverts.push(advert);

        if (filteredAdverts.length === ADVERT_LIMIT) {
          break;
        }
      }
    }

    return filteredAdverts;
  };

  // экспорт значений
  window.filter = {
    form: filtersBlock,
    features: featureItems,
    default: FILTER_DEFAULT_VALUE,
    process: filterAdverts
  };
})();
