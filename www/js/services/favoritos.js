angular.module('app').factory('Favoritos', ['localstorage', '$rootScope', function(localstorage, $rootScope) {
  var _favoritos = localstorage.get('favoritos') || [];
  return {

    // local favs
    items: _favoritos,
    add: function(name, latlng) {
      _favoritos.push({
        nombre: name,
        latlng: {lat:latlng.lat, lng:latlng.lng}
      })
      localstorage.set('favoritos', _favoritos);
      $rootScope.$emit('FavoritosService:change', _favoritos);
    },
    delete: function(i) {
      _favoritos.splice(i, 1);
      localstorage.set('favoritos', _favoritos);
      $rootScope.$emit('FavoritosService:change', _favoritos);
    },
    onChange: function(scope, callback, callOnInit) {
      var handler = $rootScope.$on('FavoritosService:change', callback);
      scope.$on('$destroy', handler);
      if (callOnInit) callback(null, _favoritos);
    },

    // interact with cualbondi favorites api. Must have login
    save: function () {
      // return promise
    },
    load: function () {
      // return promise
    }
  }
}]);
