var _is_eng_lang = function () {
	return (document.location.pathname.toString().indexOf('/eng/') == 0)
};

var lang_markers = [],
	lang_clusters = [];



var Marker = function(options){
	google.maps.Marker.apply(this, arguments);

	if (options.text || options.url) {
		this.MarkerLabel = new MarkerLabel(options, this);
		this.MarkerLabel.owner = this;
		this.MarkerLabel.bindTo('position', this, 'position');
	}
};

Marker.prototype = $.extend(new google.maps.Marker(), {
	setMap: function(){
		google.maps.Marker.prototype.setMap.apply(this, arguments);
		(this.MarkerLabel) && this.MarkerLabel.setMap.apply(this.MarkerLabel, arguments);
	}
});


var MarkerLabel = function(options, owner) {
	var self = this;

	this.setValues(options);

	if (this.text) {
		this.div = document.createElement('div');
		this.div.style.position = 'absolute';
		this.div.className = 'map-marker-label';
		google.maps.event.addDomListener(this.div, 'click', function(e){
			(e.stopPropagation) && e.stopPropagation();
			google.maps.event.trigger(self.marker, 'click');
		});
		if (this.textOnHover) {
			google.maps.event.addListener(owner, 'mouseover', function() {
				self.div.style.display = 'block';
				owner.setZIndex(3);
			});
			google.maps.event.addListener(owner, 'mouseout', function() {
				self.div.style.display = 'none';
				owner.setZIndex(1);
			});
		}
	}
	if (this.url) {
		this.href = document.createElement('a');
		this.href.className = 'map-marker-href';
		this.href.style.position = 'absolute';
		this.href.style.border = 'none';
		//this.href.style.background = options.background || 'rgba(255,0,0,0.3)';
		this.href.style.background = 'transparent';
	}
};

MarkerLabel.prototype = $.extend(new google.maps.OverlayView(), {
	onAdd: function() {
		if (this.div) {
			this.getPanes().overlayImage.appendChild(this.div);
		}
		if (this.href) {
			this.getPanes().overlayImage.appendChild(this.href);
		}

		var self = this;
		this.listeners = [
			google.maps.event.addListener(this, 'position_changed', function() { self.draw(); }),
			google.maps.event.addListener(this, 'text_changed', function() { self.draw(); }),
			google.maps.event.addListener(this, 'url_changed', function() { self.draw(); })
			//google.maps.event.addListener(this, 'zindex_changed', function() { self.draw(); }),
		];
	},
	onRemove: function() {
		if (this.div) {
			this.div.parentNode.removeChild(this.div);
		}
		if (this.href) {
			this.href.parentNode.removeChild(this.href);
		}
		for (var i = 0; i < this.listeners.length; i++) {
			google.maps.event.removeListener(this.listeners[i]);
		}
	},
	draw: function() {
		var markerSize = this.markerSize || {width: 20, height: 29},
			position = this.getProjection().fromLatLngToDivPixel(this.get('position'));

		if (this.div) {
			this.div.style.display = 'block';
			this.div.innerHTML = String(this.get('text'));
			this.div.style.left = position.x - (this.div.offsetWidth / 2) + 'px';
			if (this.textOnHover) {
				this.div.style.top = position.y - markerSize.height - this.div.offsetHeight - 5 + 'px';
				this.div.style.display = 'none';
			} else {
				this.div.style.top = position.y + 'px';
			}
		}
		if (this.href) {
			this.href.href = this.url;
			this.href.style.left = position.x - markerSize.width / 2 + 'px';
			this.href.style.top = position.y - markerSize.height + 'px';
			this.href.style.width = markerSize.width + 'px';
			this.href.style.height = markerSize.height + 'px';
		}
	}
});


function miniMarkers(map, markers, options) {
	this.extend(miniMarkers, google.maps.OverlayView);
	this._map = map;
	this._markers = markers;
	this._options = $.extend({
		distance: 50
	}, options);
	this._minimarkers = [];
	this._isReady = false;

	this.setMap(map);

	this.hideMarkers();

	var that = this;
	google.maps.event.addListener(this._map, 'idle', function() {
		that.hideMarkers();
		that.redraw();
		//alert(11);
		google.maps.event.clearListeners(that._map, 'idle');
	});
	google.maps.event.addListener(this._map, 'zoom_changed', function() {
		that.hideMarkers();
		that.redraw();
		$(document).trigger('gmap_zoom_changed');
	});
}

miniMarkers.prototype.setMap = function(map) {
	this._map = map;
};

miniMarkers.prototype.hideMarkers = function() {
	for (var i = 0, marker; marker = this._markers[i]; i++) {
		marker.setMap(null);
	}
};

miniMarkers.prototype.showMarkers = function() {
	if (this.isRemoved) return false;
	var i, marker;
	for (i = 0; marker = this._markers[i]; i++) {
		marker.isAdded = false;
		marker.setMap(this._map);
	}
	for (i = 0; marker = this._minimarkers[i]; i++) {
		marker.setMap(null);
	}
	this._minimarkers = [];
};

miniMarkers.prototype.onAdd = function() {
	this._isReady = true;
};

miniMarkers.prototype.draw = function() {};

miniMarkers.prototype.redraw = function () {
	if (!this._isReady) return false;
	this.showMarkers();
	for (var i = 0, marker; marker = this._markers[i]; i++) {
		if (!marker.isAdded) {
			var markers = this.getClosestMarkers(marker);
			marker.isAdded = true;
			if (markers.length > 1) {
				for(var j = 0; j < markers.length; j++) {
					var minimarker = countryMap.createMiniMarker(markers[j]);
					markers[j].minimarker = minimarker;
					markers[j].setMap(null);
					this._minimarkers.push(minimarker);
				}
			}
		}
	}
};

miniMarkers.prototype.remove = function () {
	this.isRemoved = true;
}

miniMarkers.prototype.getClosestMarkers = function(currentMarker) {
	var markerBounds = new google.maps.LatLngBounds(currentMarker.getPosition()),
		bounds = this.getExtendedBounds(markerBounds),
		result = [];
	for (var i = 0, marker; marker = this._markers[i]; i++) {
		if (!marker.isAdded && this.isMarkerInBounds_(marker, bounds)) {
			result.push(marker);
			marker.isAdded = true;
		}
	}
	return result;
};

miniMarkers.prototype.isMarkerInBounds_ = function(marker, bounds) {
	return bounds.contains(marker.getPosition());
};

miniMarkers.prototype.getExtendedBounds = function(bounds) {
	var projection = this.getProjection();

	// Turn the bounds into latlng.
	var tr = new google.maps.LatLng(bounds.getNorthEast().lat(), bounds.getNorthEast().lng());
	var bl = new google.maps.LatLng(bounds.getSouthWest().lat(), bounds.getSouthWest().lng());

	// Convert the points to pixels and the extend out by the grid size.
	var trPix = projection.fromLatLngToDivPixel(tr);
	trPix.x += this._options.distance;
	trPix.y -= this._options.distance;

	var blPix = projection.fromLatLngToDivPixel(bl);
	blPix.x -= this._options.distance;
	blPix.y += this._options.distance;


	// Convert the pixel points back to LatLng
	var ne = projection.fromDivPixelToLatLng(trPix);
	var sw = projection.fromDivPixelToLatLng(blPix);

	// Extend the bounds to contain the new bounds.
	bounds.extend(ne);
	bounds.extend(sw);

	return bounds;
};




miniMarkers.prototype.extend = function(obj1, obj2) {
	return (function(object) {
		for (var property in object.prototype) {
			this.prototype[property] = object.prototype[property];
		}
		return this;
	}).apply(obj1, [obj2]);
};

var countryMap = {
	globalP: 90,
	init: function (map, name, $o) {
		var bounds = new google.maps.LatLngBounds(),
			markers = [],
			country_markers = [],
			self = this,
			current_view = 'cities',
			startZoom,
			isFirst = true,
			minimarkers = null,
			i;


		function createCities(_isFirst) {
			bounds = new google.maps.LatLngBounds();
			for (i = 0; i < country_markers.length; i++) {
				country_markers[i].setMap(null);
				if (country_markers[i].minimarker) {
					country_markers[i].minimarker.setMap(null);
				}
				if (minimarkers) {
					minimarkers.remove();
					minimarkers = null;
				}
			}
			country_markers = [];

			for (i = 0; i < cityCoords[name].length; i++) {
				var marker = self.createMarker(map, cityCoords[name][i]);
				if (!parseInt(cityCoords[name][i].exclude_from_bounds)) {
					bounds.extend(marker.getPosition());
				}
				lang_markers.push(marker);
				markers.push(marker);
			}

			if (markers.length > 1) {
				if (_isFirst) {
					map.fitBounds(bounds);
					map.setCenter(bounds.getCenter());
					google.maps.event.addListener(map, 'idle', function () {
						if (isFirst) {
							self.setMapZoom(map, bounds, markers, $o);
							isFirst = false;
							startZoom = map.getZoom();
						}
					});
				}

				minimarkers = new miniMarkers(map, markers);
			} else {
				if (_isFirst) {
					google.maps.event.addListener(map, 'idle', function () {
						if (isFirst) {
							startZoom = map.getZoom();
							isFirst = false;
						}
					});
				}
			}
		}

		function createCountries() {
			for (i = 0; i < markers.length; i++) {
				markers[i].setMap(null);
				if (markers[i].minimarker) {
					markers[i].minimarker.setMap(null);
				}
			}
			markers = [];
			lang_markers = [];
			if (minimarkers) {
				minimarkers.remove();
				minimarkers = null;
			}

			for (i = 0; i < map_countries.length; i++) {
				var data = map_countries[i];
				data.icon = '/svalka/travel/marker_green.png';
				var marker = self.createMarker(map, data);
				country_markers.push(marker);
			}

			minimarkers = new miniMarkers(map, country_markers);

		}

		createCities(true);


		$(document).on('gmap_zoom_changed', function() {
			google.maps.event.addListener(map, 'zoom_changed', function() {
				if (startZoom) {
					var zoom = map.getZoom();
					//console.log('current_zoom', zoom);
					//console.log('startZoom', startZoom);
					//console.log((zoom <= startZoom - 2 || zoom == 2) && zoom <= 6);

					if ((zoom <= startZoom - 2 || zoom == 2) && zoom <= 6) {
						if (current_view == 'cities') {
							createCountries();
							current_view = 'countries';
						}
					} else {
						if (current_view == 'countries') {
							createCities();
							current_view = 'cities';
						}
					}
				}
			});
		});
	},
	setMapZoom: function (map, bounds, markers) {
		var zoom = map.getZoom();
		map.setZoom(zoom + 2);

		function getVisibleCount(){
			var result = 0;
			for(var i = 0; i < markers.length; i++) {
				if (map.getBounds().contains(markers[i].getPosition())) {
					result++;
				}
			}
			return result;
		}

		var visible = getVisibleCount();

		if(visible * 100 / markers.length < this.globalP){
			map.setZoom(zoom + 1);
			visible = getVisibleCount();
			if(visible * 100 / markers.length < this.globalP){
				map.setZoom(zoom);
			}
		}
	},
	createMarker: function (map, data) {
		var title = data.name;
		if (_is_eng_lang()) {
			title = data.name_en;
		}
		var markerData = {
			position: new google.maps.LatLng(
				data.latitude,
				data.longitude
			),
			map: map,
			text: title,
			text_ru: data.name,
			text_en: data.name_en,
			icon: data.icon || '/svalka/travel/marker_red.png',
			zIndex: 1
		};

		if (data.uri && data.uri !== '') {
			if (document.location.pathname.toString().replace('/eng/', '') != data.uri && data.uri != '/travel/') {
				markerData.url = data.uri;
				if (_is_eng_lang()) {
					markerData.url = '/eng' + data.uri;
				}
			} else {
				markerData.cursor = 'default';
			}
		}
		var marker = new Marker(markerData);
		marker.markerData = markerData;
		return marker;
	},
	createMiniMarker: function (marker) {
		var data = marker.markerData;
		if (data.icon.indexOf('green') > -1) {
			data.icon = '/svalka/travel/marker_green_mini.png';
		} else {
			data.icon = '/svalka/travel/marker_red_mini.png';
		}
		data.textOnHover = true;
		data.markerSize = {width: 10, height: 10};
		data.background = 'rgba(255,255,0,0.3)';
		var marker = new Marker(data);
		lang_markers.push(marker);
		return marker;
	}
};