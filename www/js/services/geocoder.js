angular.module('app')

.factory('Geocoder', function($http) {

  var API_ENDPOINT = 'https://cualbondi.com.ar/api/v2/geocoder/';

  var DEFAULTS = {
    callback: 'JSON_CALLBACK',
    c: 'la-plata'
  }

  var getParams = function(override) {
    override = override || {};
    var deviceParams = {};
    if ( typeof device !== 'undefined' ) {
      deviceParams.uuid = device.uuid;
      deviceParams.source = device.platform;
    }
    return angular.extend(
      {},
      deviceParams,
      DEFAULTS,
      override
    )
  }

  return {

    setCiudad: function(ciudad_slug) {
      DEFAULTS.c = ciudad_slug;
    },

    search: function(q) {
      return $http({
        url: API_ENDPOINT,
        method: 'jsonp',
        params: getParams({q: q})
      })
    },

    get: function(id) {
      // TODO: returns one Recorrido
    }

  }
});
