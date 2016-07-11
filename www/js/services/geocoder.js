angular.module('app')

.factory('Geocoder', function($http) {

  if ( typeof device !== 'undefined' ) {
    $scope.API_EXTRA_PARAMS.uuid = device.uuid;
    $scope.API_EXTRA_PARAMS.source = device.platform;
    $scope.device_uuid = device.platform + device.uuid;
  }
  var API_ENDPOINT = 'https://cualbondi.com.ar/api/v2/geocoder/';


  return {

    defaultParams: {
      // API configuration
      callback: 'JSON_CALLBACK',
    },

    setCiudad: function(ciudad_slug) {
      this.defaultParams.ciudad = ciudad_slug;
    },

    search: function(q) {
      return $http({
        url: API_ENDPOINT,
        method: 'jsonp',
        params: angular.extend(
          {},
          this.defaultParams,
          { q: q }
        )
      })
    },

    get: function(id) {
      // TODO: returns one Recorrido
    }

  }
});
