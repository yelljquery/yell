$(function() {
	var _is_eng_lang = function () {
		return (document.location.pathname.toString().indexOf('/eng/') == 0)
	};
	var lang_markers = [];
	var mapInit = function($container, $canvas) {
		var name = $container.attr('data-map'),
			latitude = $container.attr('data-map-latitude'),
			longitude = $container.attr('data-map-longitude'),
			zoom = parseFloat($container.attr('data-map-zoom')),
			myLatlng = new google.maps.LatLng(latitude, longitude),
			marker;

		var map = new google.maps.Map(
			$canvas.get(0), {
				'zoom': zoom,
				'center': myLatlng
			}
		);


		$container.data('map-obj', map);

		if (cityCoords.hasOwnProperty(name)) {
			countryMap.init(map, name, $container);
			return false;
		}

		/*
		if (cityCoords.hasOwnProperty(name)) {
			for (var i = 0; i < cityCoords[name].length; i++) {
				var title = cityCoords[name][i].name;
				if (_is_eng_lang()) {
					title = cityCoords[name][i].name_en;
				}
				var markerData = {
					position: new google.maps.LatLng(
						cityCoords[name][i].latitude,
						cityCoords[name][i].longitude
					),
					map: map,
					title: title,
					title_ru: cityCoords[name][i].name,
					title_en: cityCoords[name][i].name_en,
					icon: '/travel/marker_green.png',
					zIndex: 1
				};

				if (cityCoords[name][i].uri !== '') {
					if (document.location.pathname.toString().replace('/eng/', '') != cityCoords[name][i].uri) {
						markerData.url = cityCoords[name][i].uri
					} else {
						markerData.cursor = 'default';
					}
				}

				marker = new google.maps.Marker(markerData);
				lang_markers.push(marker);

				google.maps.event.addListener(marker, 'click', function() {
					var url = this.url;
					if (url) {
						if (_is_eng_lang()) {
							url = '/eng' + this.url;
						}
						window.location.href = url;
					}
				});
			}
		}
		*/

		new google.maps.Marker({
			position: myLatlng,
			map: map,
			title: '',
			zIndex: 2
		});

		/*
		$('.lang-switcher a').unbind('click.changeMarkerTitle').bind('click.changeMarkerTitle', function () {
			for (var i = 0; i < lang_markers.length; i++) {
				var title = lang_markers[i].title_ru;
				if (_is_eng_lang()) {
					title = lang_markers[i].title_en;
				}
				lang_markers[i].setTitle(title);
			}
		});
		*/
	};


	$('.map-link').click(function(e) {
		var $map = $('.map[data-map=' + $(this).attr('data-map') + ']');
		var $canvas = $map.find('.map-canvas');

		if ($canvas.is(':animated')) return;

		if (!$map.data('map-obj')) {
			var height = Math.round(window.innerHeight || 500) / 2;
			$canvas.height(height).hide();
			$canvas.slideToggle(400, function() {
				mapInit($map, $canvas);
			});
		} else {
			$canvas.slideToggle(400);
		}
	});

	$('.map-auto-open').each(function () {
		var $map = $(this),
			$canvas = $map.find('.map-canvas'),
			height = Math.round(window.innerHeight || 500) / 2;
		$canvas.show().height(height);
		mapInit($map, $canvas);
	});

});