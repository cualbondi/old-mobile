angular.module('app')

.factory('Recorridos', function($http) {

  if ( typeof device !== 'undefined' ) {
    $scope.API_EXTRA_PARAMS.uuid = device.uuid;
    $scope.API_EXTRA_PARAMS.source = device.platform;
    $scope.device_uuid = device.platform + device.uuid;
  }
  var API_ENDPOINT = 'https://cualbondi.com.ar/api/';


  return {

    defaultParams: {
      // API configuration
      callback: 'JSON_CALLBACK',

      // setteables/overrideables
      radio_origen: 100,
      radio_destino: 100,
      c: 'la-plata',
      combinar: 'false',
      p: 1,
    },

    setCiudad: function(ciudad_slug) {
      this.defaultParams.c = ciudad_slug;
    },

    setDefaultRadio: function(radioOrigen, radioDestino) {
      if (typeof radioDestino == 'undefined')
        radioDestino = radioOrigen;
      this.defaultParams.radio_origen  = radioOrigen;
      this.defaultParams.radio_destino = radioDestino;
    },

    search: function(params) {
      /*
        params mandatory:
          - origen : leaflet's latlng
          - destino: leaflet's latlng

        params optional
          - radio_origen: overrides this.radioOrigen
          - radio_destino: overrides this.radioDestino
          - c
          - combinar
          - p
      */

      /*
      muestra del formato para la api
      {
          origen: $scope.markerA._latlng.lng+','+$scope.markerA._latlng.lat,
          destino: $scope.markerB._latlng.lng+','+$scope.markerB._latlng.lat,
          radio_origen: $scope.radio,
          radio_destino: $scope.radio,
          c: $scope.ciudad.slug,
          combinar: 'false',
          p: p
      }, 
      */

      return $http({
        url: API_ENDPOINT + 'recorridos/',
        method: 'jsonp',
        params: angular.extend(
          {},
          this.defaultParams,
          params,
          {
            origen : params.origen.lng  + ',' + params.origen.lat,
            destino: params.destino.lng + ',' + params.destino.lat
          }
        )
      })
    },

    get: function(id) {
      // TODO: returns one Recorrido
    }

  }
});
