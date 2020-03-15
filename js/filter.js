'use strict';

(function () {
  var FILTER_DEFAULT_VALUE = 'any';
  var ADVERT_LIMIT = 5;

  var filtersBlock = document.querySelector('.map__filters');
  var featureItems = filtersBlock.querySelectorAll('input[type=checkbox]');

  var PriceValues = {
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

  var FilterRules = {
    'housing-type': function (advert, value) {
      return advert.offer.type === value;
    },

    'housing-price': function (advert, value) {
      return advert.offer.price >= PriceValues[value].min && advert.offer.price < PriceValues[value].max;
    },

    'housing-rooms': function (advert, value) {
      return advert.offer.rooms === parseInt(value, 10);
    },

    'housing-guests': function (advert, value) {
      return advert.offer.guests === parseInt(value, 10);
    },

    'features': function (advert, value) {
      return checkFeature(advert.offer.features, value);
    },
  };

  // фильтруем массив
  var filterAdverts = function (array) {
    return array.filter(function (advert) {
      return advert.offer && getFilterValues().every(function (element) {
        return (element.value === FILTER_DEFAULT_VALUE) ? true : FilterRules[element.name](advert, element.value);
      });
    })
    .slice(0, ADVERT_LIMIT);
  };

  // экспорт значений
  window.filter = {
    form: filtersBlock,
    features: featureItems,
    default: FILTER_DEFAULT_VALUE,
    array: filterAdverts
  };
})();
