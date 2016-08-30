angular.module('app')

.factory('Recorridos', function($http) {

  var API_ENDPOINT = 'https://cualbondi.com.ar/api/v2/recorridos/';

  var DEFAULTS = {
    callback: 'JSON_CALLBACK',
    c: 'la-plata',
    t: 'false',
    page: 1,
  }
  
  var DEFAULT_RAD = 300;
  
  var point2param = function(point, rad) {
    return point.lng + ',' + point.lat + ',' + rad
  }

  var getParams = function(override) {
    var over = angular.copy(override || {});
    var params = {};

    if ( typeof device !== 'undefined' ) {
      params.uuid   = device.uuid;
      params.source = device.platform;
    }

    if (over.origen && over.destino)
      params.l = 
          point2param(over.origen, over.radioOrigen || over.rad || DEFAULT_RAD)
        + '|'
        + point2param(over.destino, over.radioDestino || over.rad || DEFAULT_RAD);

    if (over.page || over.p)
      params.page = over.page || over.p;

    if (over.combinar || over.t)
      params.t = over.combinar || over.t;

    return angular.extend(
      {},
      DEFAULTS,
      params
    )
  }

  return {

    setCiudad: function(ciudad_slug) {
      DEFAULTS.c = ciudad_slug;
    },

    setDefaultRadio: function(rad) {
      DEFAULT_RAD  = rad;
    },

    search: function(params) {
      /*
        params mandatory:
          - origen : leaflet's latlng
          - destino: leaflet's latlng

        params optional
          - radio_origen: overrides this.radioOrigen
          - radio_destino: overrides this.radioDestino
          - rad: overrides this.radioOrigen & this.radioDestino if not present
          - c
          - combinar
          - page
      */

      /*
      muestra del formato para la api
      {
          l: $markerA.lng+','+$markerA.lat+'|'+$markerB.lng+','+$markerB.lat,
          rad: 300,
          c: 'la-plata',
          combinar: 'false',
          page: page
      }, 
      */

      return $http({
        url: API_ENDPOINT,
        method: 'jsonp',
        params: getParams(params)
      })
    },

    get: function(id) {
      // TODO: returns one Recorrido
    }

  }
});
