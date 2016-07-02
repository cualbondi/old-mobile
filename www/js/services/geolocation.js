angular.module('app').factory('geolocationService', function($cordovaGeolocation, $rootScope, $timeout) {
  return {
    onPosition: function(scope, callback) {
      // callback receives (event, position) arguments
      var handler = $rootScope.$on('geolocationService:position', callback);
      scope.$on('$destroy', handler);
    },
    onError: function(scope, callback) {
      // callback receives (event, error) arguments
      var handler = $rootScope.$on('geolocationService:error', callback);
      scope.$on('$destroy', handler);
    },
    start: function(scope, options) {
      options = angular.merge(options || {}, {
        enableHighAccuracy: true,
        maximumAge: 2000,
        timeout: 10000,
        retry: 2000
      })
      var self = this;

      self.startWatching = function () {
        var watch = $cordovaGeolocation.watchPosition(options);
        watch.then(
          null, // success/resolve is never called
          function(error) {
            $rootScope.$emit('geolocationService:error', error);
            watch.cancel();
            if (options.retry && options.retry > 0) {
              // failed, try again in two seconds
              $timeout(self.startWatching, options.retry);
            }
          },
          function(position) {
            $rootScope.$emit('geolocationService:position', position);
          }
        );

      };
      self.startWatching();
    }
  }
});
