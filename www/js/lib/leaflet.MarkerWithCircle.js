/*
 * 2015-2016 (c) Julian Perelli (jperelli@gmail.com)
 *   partially based on
 *   https://gist.github.com/glenrobertson/3630960
 *   https://github.com/Leaflet/Leaflet/blob/master/src/layer/marker/Marker.js
 * 
 * */

L.MarkerWithCircle = L.Marker.extend({

  options: {
    radius: 100
  },

  initialize: function (latlng, options) {
    ret = L.Marker.prototype.initialize.call(this, latlng, options);
    this._circle = new L.Circle(latlng, {radius:options.radius});
    this.on('remove', function(e) {
      this._circle.remove();
    })
    this.on('move', function(e) {
      this._circle.setLatLng(e.target._latlng);
    })
    // move circle when marker is dragged
    var self = this;

  },

  addTo: function (map) {
    this._circle.addTo(map);
    L.Marker.prototype.addTo.call(this, map);
    return this
  },

  setLatLng: function (latlng) {
    this._circle.setLatLng(latlng);
    L.Marker.prototype.setLatLng.call(this, latlng);
    return this
  },

  getBounds: function() {
    return this._circle.getBounds();
  },

  getLatLng: function () {
    return this._latlng;
  },

  getRadius: function () {
    return this._circle.getRadius();
  },

  setRadius: function (meters) {
    this._circle.setRadius(meters);
  },

  setCircleStyle: function (style) {
    this._circle.setStyle(style);
  }

});
 
L.markerWithCircle = function (latlng, options) {
  return new L.MarkerWithCircle(latlng, options);
};
