/*
 * Basado en
 *   https://gist.github.com/glenrobertson/3630960
 *   https://github.com/Leaflet/Leaflet/blob/master/src/layer/marker/Marker.js
 * 
 * */

L.MarkerWithCircle = L.Class.extend({
    includes: L.Mixin.Events,
 
    options: {
        weight: 1,
        clickable: false,
        draggable: true
    },
 
    initialize: function (latlng, options) {
        options = options || {};
        L.Util.setOptions(this, options);
        this._latlng = L.latLng(latlng);
        this._markerIcon = new L.DivIcon({
            className: this.options.className
        }),
        
        this._marker = new L.Marker(latlng, {
            icon: this._markerIcon,
            draggable: this.options.draggable
        });
        
        if ( this.options.popup ) {
            this._marker.bindPopup(this.options.popup);
        }
 
        this._circle = new L.Circle(latlng, this.options);
 
        // move circle when marker is dragged
        var self = this;
        this._marker.on('movestart', function(e) {
            self.fire('movestart', e);
        });
        this._marker.on('move', function(e) {
            self._latlng = e.target._latlng;
            self._circle.setLatLng(e.target._latlng);
            return self.fire('move', e);
        });
        this._marker.on('moveend', function(e) {
            self._latlng = e.target._latlng;
            self.fire('moveend', e);
        });
    },
 
    onAdd: function (map) {
        this._map = map;
        //this._marker.onAdd(map);
        //this._circle.onAdd(map);
        if ( this.options.draggable )
            this._marker.dragging.enable();
        this.fire('loaded');
    },
    
    addTo: function (map) {
        this._marker.addTo(map);
        this._circle.addTo(map);
        return this.onAdd(map);
    },
    
    getPopup: function() {
        return this._marker.getPopup();
    },
 
    onRemove: function (map) {
        this._marker.onRemove(map);
        this._circle.onRemove(map);
        this.fire('unloaded');
    },
 
    getBounds: function() {
        return this._circle.getBounds();
    },
 
    bindPopup: function(e) {
        return this._marker.bindPopup(e);
    },
    
    getLatLng: function () {
        return this._latlng;
    },
 
    setLatLng: function (latlng) {
        //this._marker.fire('movestart');
        this._latlng = L.latLng(latlng);
        this._marker.setLatLng(this._latlng);
        this._circle.setLatLng(this._latlng);
        //this._marker.fire('moveend');
        return this;
    },
 
    getRadius: function () {
        return this._circle.getRadius();
    },
 
    setRadius: function (meters) {
        //this._marker.fire('movestart');
        this._circle.setRadius(meters);
        //this._marker.fire('moveend');
    },
 
    getCircleOptions: function () {
        return this._circle.options;
    },
 
    setCircleStyle: function (style) {
        this._circle.setStyle(style);
    }
 
});
 
L.markerWithCircle = function (latlng, options) {
    return new L.MarkerWithCircle(latlng, options);
};
