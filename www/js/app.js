angular.module('app', ['ionic', 'ngCordova'])

angular.module('app').run(init)

function init($ionicPlatform, geolocationService) {
  $ionicPlatform.ready(function(readySource) {
    //console.log('Platform ready from', readySource);
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
    if (window.AdMob) {
      AdMob.createBanner( {
        adId: 'ca-app-pub-1193419141108967/7166287944', 
        isTesting: true,
        overlap: false, 
        offsetTopBar: false, 
        position: AdMob.AD_POSITION.BOTTOM_CENTER,
        bgColor: 'black'
      } );
    }
    else {
      console.log( 'admob plugin not available' );
    }

    geolocationService.start();

    if (navigator.splashscreen)
      $timeout(function(){navigator.splashscreen.hide()}, 300);

  });
}
