angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {
  $scope.API_EXTRA_PARAMS = {callback: "JSON_CALLBACK"};
  if ( typeof device !== 'undefined' ) {
    $scope.API_EXTRA_PARAMS.uuid = device.uuid;
    $scope.API_EXTRA_PARAMS.source = device.platform;
    $scope.device_uuid = device.platform + device.uuid;
  }
  $scope.API_ENDPOINT = "http://cualbondi.com.ar/api/";

  function getFromLocalStorage(name) {
    var ret = window.localStorage.getItem(name);
    if ( ret === null )
      return null;
    else
      return JSON.parse(ret);
  }
  $scope.ciudades = getFromLocalStorage("ciudades");
  $scope.ciudad = getFromLocalStorage("ciudad");

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
            navigator.geolocation.clearWatch(watchLocation);
            startWatching();
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
  $scope.markerA = L.editableCircleMarker(null, $scope.radio, {draggable: true, className: 'markerA'})
  $scope.markerB = L.editableCircleMarker(null, $scope.radio, {draggable: true, className: 'markerB'})
  $scope.map.addControl( L.control.zoom({position: 'bottomright'}) );
  
  $scope.map.setView([-34.92137284339113, -57.95438289642334], 12);
  
  L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
    attribution: '&copy; Cualbondi & OpenStreetMap contributors',
    unloadInvisibleTiles: false,
    updateWhenIdle: false
  }).addTo($scope.map);
  $scope.locationMarker = L.marker(null, {icon: L.divIcon({className: 'location-marker'})});

  $scope.marcarOrigen  = function(e) { $scope.marcarOD(e, true); };
  $scope.marcarDestino = function(e) { $scope.marcarOD(e, false); };
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








  // Form data for the login modal
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
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
})

.controller('PlaylistsCtrl', function($scope) {
  $scope.playlists = [
    { title: 'Reggae', id: 1 },
    { title: 'Chill', id: 2 },
    { title: 'Dubstep', id: 3 },
    { title: 'Indie', id: 4 },
    { title: 'Rap', id: 5 },
    { title: 'Cowbell', id: 6 }
  ];
})

.controller('PlaylistCtrl', function($scope, $stateParams) {
});
