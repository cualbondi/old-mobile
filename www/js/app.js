angular.module('app', ['ionic', 'ngCordova', 'ionic-pullup'])

angular.module('app').run(init)

function init($ionicPlatform, geolocationService, $timeout) {
  $ionicPlatform.ready(function(readySource) {
    //console.log('Platform ready from', readySource);
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);
    }
    else {
      console.log('PLUGIN NOT FOUND window.cordova.plugins.Keyboard')
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
    else {
      console.log('PLUGIN NOT FOUND window.StatusBar')
    }
    if (window.AdMob) {
      var options = {
        adId: 'ca-app-pub-1193419141108967/7166287944', 
        isTesting: false,
        overlap: true, 
        offsetTopBar: false, 
        position: window.AdMob.AD_POSITION.BOTTOM_CENTER,
        bgColor: 'white'
      }
      window.AdMob.setOptions(options);
      window.AdMob.createBanner(options);
    }
    else {
      console.log('PLUGIN NOT FOUND window.AdMob')
    }

    geolocationService.start();

    if (navigator.splashscreen)
      $timeout(function(){navigator.splashscreen.hide()}, 300)
    else
      console.log('PLUGIN NOT FOUND navigator.splashscreen')

  });
}
