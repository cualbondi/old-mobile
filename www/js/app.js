angular.module('starter', ['ionic'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
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
  });
})



.controller('AppCtrl', ['$scope', '$http', '$ionicModal', '$timeout', '$ionicSideMenuDelegate', function($scope, $http, $ionicModal, $timeout, $ionicSideMenuDelegate) {

  $scope.API_EXTRA_PARAMS = {callback: 'JSON_CALLBACK'};
  if ( typeof device !== 'undefined' ) {
    $scope.API_EXTRA_PARAMS.uuid = device.uuid;
    $scope.API_EXTRA_PARAMS.source = device.platform;
    $scope.device_uuid = device.platform + device.uuid;
  }
  $scope.API_ENDPOINT = 'https://cualbondi.com.ar/api/';

  function getFromLocalStorage(name) {
    var ret = window.localStorage.getItem(name);
    if ( ret === null )
      return null;
    else
      return JSON.parse(ret);
  }
  $scope.ciudades = getFromLocalStorage('ciudades');
  $scope.ciudad = getFromLocalStorage('ciudad');

  $scope.radio = 200;
  $scope.resultadoIndice = 0;
  $scope.resultados = [];

  $scope.enableHighAccuracy = true;

  document.addEventListener(
    'deviceready',
    function onDeviceReady () {

      var startWatching = function () {
        var watchLocation = navigator.geolocation.watchPosition(
          function(position) {
            $scope.locationMarker.setLatLng([position.coords.latitude, position.coords.longitude]).addTo($scope.map);
          },
          function(error){
            console.log(error.code);
            console.log(error.message);
            // failed, try again in two seconds
            $timeout(startWatching, 2000);
            navigator.geolocation.clearWatch(watchLocation);
          },
          {
            enableHighAccuracy: $scope.enableHighAccuracy,
            maximumAge: 2000,
            timeout: 10000
          }
        );
      };
      startWatching();
    },
    false
  );


  $scope.marcarOD = function(e, origen) {
    var marker = origen ? $scope.markerA : $scope.markerB;
    if ( e.latlng ) {
      marker.setLatLng(e.latlng).addTo($scope.map);
      if ( e.text )
      marker.bindPopup(e.text);
      else
      if ( marker.getPopup() )
      marker.unbindPopup();
    }
    else {
      $scope.map.removeLayer(marker);
      marker._latlng = null;
    }
    $scope.buscarRecorridos();
  };
  $scope.marcarOrigen  = function(e) { $scope.marcarOD(e, true); };
  $scope.marcarDestino = function(e) { $scope.marcarOD(e, false); };


  $scope.map = new L.map('mapa',
    {
      closePopupOnClick: false,
      attributionControl: false,
      zoomControl:false,
      contextmenu: true,
      contextmenuItems: [
        {
          text: 'Marcar Origen',
          callback: $scope.marcarOrigen
        }, {
          text: 'Marcar Destino',
          callback: $scope.marcarDestino
        },
        '-',
        {
          text: 'Marcar Favorito',
          callback: $scope.nuevoFavorito
        },
        '-',
        {
          text: 'Cerrar'
        }
    ]
    }
  );
  $scope.markerA = L.circle(null, $scope.radio, {draggable: true, className: 'markerA'});
  $scope.markerB = L.circle(null, $scope.radio, {draggable: true, className: 'markerB'});
  //$scope.markerA = L.editableCircleMarker(null, $scope.radio, {draggable: true, className: 'markerA'});
  //$scope.markerB = L.editableCircleMarker(null, $scope.radio, {draggable: true, className: 'markerB'});
  $scope.map.addControl( L.control.zoom({position: 'bottomright'}) );
  $scope.resultadosLayer = L.featureGroup();
  $scope.map.addLayer($scope.resultadosLayer);

  $scope.map.setView([-34.92137284339113, -57.95438289642334], 12);
  
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; Cualbondi & OpenStreetMap contributors',
    unloadInvisibleTiles: false,
    updateWhenIdle: false
  }).addTo($scope.map);
  $scope.locationMarker = L.marker(null, {icon: L.divIcon({className: 'location-marker'})});

  $scope.map.on('click', function(e) {
      $scope.map.contextmenu.showAt(e.latlng);
  });

  // mostrar resultados en todos lados
  $scope.$watchCollection('resultados', function(newValue, oldValue) {
      actualizar_vista_resultados(newValue, $scope.resultadoIndice);
  }, true);


  $scope.ciudad = {'slug':'la-plata',      'nombre':'La Plata'     , 'latlng':[-34.92137284339113, -57.95438289642334]}

  $scope.buscarRecorridos = function buscarRecorridos(p) {
      var more = true;
      if ( typeof p === 'undefined' || typeof p === 'object') {
          $scope.resultadoIndice = 0;
          $scope.resultados = [];
          more = false;
          p = 1;
      }
      if ( $scope.markerA._latlng !== null && $scope.markerB._latlng !== null ) {
          $scope.status = 'buscando lineas';
          var params = angular.extend(
              {
                  origen: $scope.markerA._latlng.lng+','+$scope.markerA._latlng.lat,
                  destino: $scope.markerB._latlng.lng+','+$scope.markerB._latlng.lat,
                  radio_origen: $scope.radio,
                  radio_destino: $scope.radio,
                  c: $scope.ciudad.slug,
                  combinar: 'false',
                  p: p
              }, 
              $scope.API_EXTRA_PARAMS
          );
          $http({
              url: $scope.API_ENDPOINT + 'recorridos/',
              method: 'jsonp',
              params: params
          }).success(function(data, status, headers, config) {
              if ( more ) {
                  $scope.resultados = $scope.resultados.concat(data.resultados);
              }
              else
                  $scope.resultados = data.resultados;
              $scope.status = '';
          }).error(function(data, status, headers, config) {
              // console.log('http error');
          });
      }    
  };


  function actualizar_vista_resultados(newValue, idx) {
      $scope.resultadoIndice = idx;
      $scope.resultadosLayer.clearLayers();
      var res = $scope.resultadoIndice;
      var r = [];
      if ( newValue.length > res ) {
          var ruta_corta = newValue[res].itinerario[0].ruta_corta;
          var dec = RC4decode(ruta_corta);
          dec = dec.replace("LINESTRING(", "").replace("LINESTRING (", "").replace(/, /g, ',').replace(")","").split(",");
          for ( var i = 0; i < dec.length; i++ ) {
              var p = dec[i].split(" ");
              r.push([parseFloat(p[1]), parseFloat(p[0])]);
          }
          var ruta = L.polyline(r, {color:"black"});
          ruta.addTo($scope.resultadosLayer);
      }
  }




  // Form data for the login modal
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('modal-login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };
  
}]);
