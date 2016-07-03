angular.module('app').factory('localstorage', function($window) {
  return {
    get: function(key) {
      var ret = $window.localStorage.getItem(key);
      if ( ret === null )
        return null;
      else
        return JSON.parse(ret);
    },
    set: function(key) {
      
    }
  }
});
