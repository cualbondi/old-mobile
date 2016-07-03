angular.module('app').controller('AppCtrl', AppCtrl);

AppCtrl.$inject = ['$scope', '$http', '$ionicModal', '$timeout', '$ionicSideMenuDelegate', 'geolocationService', 'Recorridos', 'localstorage']

function AppCtrl($scope, $http, $ionicModal, $timeout, $ionicSideMenuDelegate, geolocationService, Recorridos, localstorage) {

  $scope.ciudades = localstorage.get('ciudades');
  $scope.ciudad = localstorage.get('ciudad');
  $scope.ciudad = {'slug':'la-plata',      'nombre':'La Plata'     , 'latlng':[-34.92137284339113, -57.95438289642334]}

  $scope.radio = 200;
  $scope.resultadoIndice = 0;
  $scope.resultados = [];

  $scope.enableHighAccuracy = true;

  geolocationService.onPosition($scope, function(event, position) {
    $scope.locationMarker.setLatLng([position.coords.latitude, position.coords.longitude]);
    $scope.locationMarker.setRadius(position.coords.accuracy);
    $scope.locationMarker.addTo($scope.map);
  })
  geolocationService.onError($scope, function(event, error) {
    // TODO 1: show and maintain error message on screen
    // OR alternatively remove marker

    // TODO 2: If error is because no permission from device, show message
    // with button to enable geolocation, (maybe do this inside service?)

    console.log(error.code)
    console.log(error.message)
  })



  $scope.marcar = function(e, marker) {
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
      marker.setLatLng = null;
    }
    $scope.buscarRecorridos();
  };


  $scope.map = new L.map('mapa',
    {
      closePopupOnClick: false,
      attributionControl: false,
      zoomControl:false,
      contextmenu: true,
      contextmenuItems: [
        {
          text: 'Marcar Origen',
          callback: function(e) { $scope.marcar(e, $scope.markerA); }
        }, {
          text: 'Marcar Destino',
          callback: function(e) { $scope.marcar(e, $scope.markerB); }
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
  $scope.markerA = L.markerWithCircle(null, {draggable: true, radius: $scope.radio, className: 'markerA'});
  $scope.markerB = L.markerWithCircle(null, {draggable: true, radius: $scope.radio, className: 'markerB'});
  $scope.markerA.on('moveend', function(e) {$scope.buscarRecorridos()});
  $scope.markerB.on('moveend', function(e) {$scope.buscarRecorridos()});

  $scope.map.addControl( L.control.zoom({position: 'bottomright'}) );
  $scope.resultadosLayer = L.featureGroup();
  $scope.map.addLayer($scope.resultadosLayer);

  $scope.map.setView($scope.ciudad.latlng, 12);
  
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; Cualbondi & OpenStreetMap contributors',
    unloadInvisibleTiles: false,
    updateWhenIdle: false
  }).addTo($scope.map);
  $scope.locationMarker = L.markerWithCircle(null, {draggable: false, radius: 0, className: 'location-marker'});

  $scope.map.on('click', function(e) {
      $scope.map.contextmenu.showAt(e.latlng);
  });

  // mostrar resultados en todos lados
  $scope.$watchCollection('resultados', function(newValue, oldValue) {
      actualizar_vista_resultados(newValue, $scope.resultadoIndice);
  }, true);


  $scope.buscarRecorridos = function buscarRecorridos(p) {
      var more = true;
      if ( typeof p === 'undefined' || typeof p === 'object') {
          $scope.resultadoIndice = 0;
          $scope.resultados = [];
          more = false;
          p = 1;
      }
      if ( $scope.markerA.getLatLng() !== null && $scope.markerB.getLatLng() !== null ) {
          $scope.status = 'buscando lineas';
          Recorridos.search({
              origen: $scope.markerA.getLatLng(),
              destino: $scope.markerB.getLatLng(),
          }).success(function(data) {
            if ( more ) {
                $scope.resultados = $scope.resultados.concat(data.resultados);
            }
            else
                $scope.resultados = data.resultados;
          })

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

}
