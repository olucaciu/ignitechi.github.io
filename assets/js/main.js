(function($) {
    $.fn.countdown = function(options, callback) {
        thisEl = $(this);
        var settings = {
            'date': null,
            'format': null
        };
        if (options) {
            $.extend(settings, options);
        }

        function countdown_proc() {
            eventDate = Date.parse(settings['date']) / 1000;
            currentDate = Math.floor(Date.now() / 1000);

            if (eventDate <= currentDate) {
                callback.call(this);
                clearInterval(interval);
            }

            seconds = eventDate - currentDate;
            days = Math.floor(seconds / (60 * 60 * 24));
            seconds -= days * 60 * 60 * 24;
            hours = Math.floor(seconds / (60 * 60));
            seconds -= hours * 60 * 60;
            minutes = Math.floor(seconds / 60);
            seconds -= minutes * 60;
            if (days == 1) {
                thisEl.find(".timeRefDays").text("day");
            } else {
                thisEl.find(".timeRefDays").text("days");
            }
            if (hours == 1) {
                thisEl.find(".timeRefHours").text("hour");
            } else {
                thisEl.find(".timeRefHours").text("hours");
            }
            if (minutes == 1) {
                thisEl.find(".timeRefMinutes").text("minute");
            } else {
                thisEl.find(".timeRefMinutes").text("minutes");
            }
            if (seconds == 1) {
                thisEl.find(".timeRefSeconds").text("second");
            } else {
                thisEl.find(".timeRefSeconds").text("seconds");
            }
            if (settings['format'] == "on") {
                days = (String(days).length >= 2) ? days : "0" + days;
                hours = (String(hours).length >= 2) ? hours : "0" + hours;
                minutes = (String(minutes).length >= 2) ? minutes : "0" + minutes;
                seconds = (String(seconds).length >= 2) ? seconds : "0" + seconds;
            }
            if (!isNaN(eventDate)) {
                thisEl.find(".days").text(days);
                thisEl.find(".hours").text(hours);
                thisEl.find(".minutes").text(minutes);
                thisEl.find(".seconds").text(seconds);
            } else {
                alert("Invalid date. Here's an example: 12 Tuesday 2016 17:30:00");
                clearInterval(interval);
            }
        }
        countdown_proc();
        interval = setInterval(countdown_proc, 1000);
    }

    $('.btn-speak').click(function(){
        console.log('clicked');
        $('.speaker-form').toggleClass('hidden', 'show');
    });
})(jQuery);

(function($) {
    "use strict";
    $(window).scroll(function() {
        if ($(window).scrollTop() > 600) {
            $('.js-reveal-menu').removeClass('reveal-menu-hidden').addClass('reveal-menu-visible');
        } else {
            $('.js-reveal-menu').removeClass('reveal-menu-visible').addClass('reveal-menu-hidden');
        }
    });

    var get_date = $('#countdown').data('event-date');
    if (get_date) {
        $("#countdown").countdown({
            date: get_date,
            format: "on"
        });
    }

})(jQuery);

$(".play-video").on("click", function(e) {
    e.preventDefault();
    var videourl = $(this).data("video-url");
    $(this).append('<i class="video-loader fa fa-spinner fa-spin"></i>')
    $('.media-video iframe').attr('src', videourl);
    setTimeout(function() {
        $('.video-loader').remove();
    }, 1000);
});

if ($('.popup-gallery').length) {
    $('.popup-gallery').magnificPopup({
        delegate: 'a',
        type: 'image',
        tLoading: 'Loading image #%curr%...',
        mainClass: 'mfp-img-mobile',
        gallery: {
            enabled: true,
            navigateByImgClick: true,
            preload: [0, 1]
        },
        image: {
            tError: '<a href="%url%">The image #%curr%</a> could not be loaded.'
        },
        zoom: {
            enabled: true,
            duration: 300,
            opener: function(element) {
                return element.find('img');
            }
        },
        callbacks: {
            change: function() {
                var name = this.currItem.src;
                ga('set', 'page', '/#' + name);
                ga('send', 'pageview');
            }
        }
    });

    // $('.popup-gallery').on('mfpOpen', function(e /*, params */) {
    //     console.log('Popup opened',  $.magnificPopup.instance.currItem.src);
    // });
}

$(".navbar").on("activate.bs.scrollspy", function(){
    var name = $(".nav li.active > a").text().toLowerCase();

    ga('set', 'page', '/#' + name);
    ga('send', 'pageview');
})

function initMap() {
    $('.map').each(function(i, e) {
        $map = $(e);
        $map_lat = $map.attr('data-mapLat');
        $map_lon = $map.attr('data-mapLon');
        $map_zoom = parseInt($map.attr('data-mapZoom'));
        $map_title = $map.attr('data-mapTitle');
        $map_info = $map.attr('data-info');
        $map_height = $map.attr('data-height');
        var latlng = new google.maps.LatLng($map_lat, $map_lon);
        var options = {
            scrollwheel: false,
            draggable: false,
            zoomControl: false,
            disableDoubleClickZoom: true,
            disableDefaultUI: true,
            zoom: $map_zoom,
            center: latlng,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };

        var styles = [{
                "elementType": "geometry.stroke",
                "stylers": [{
                    "visibility": "off"
                }]
            }, {
                "featureType": "water",
                "stylers": [{
                    "color": "#fd685b"
                }]
            }, {
                "featureType": "water",
                "elementType": "labels.icon",
                "stylers": [{
                    "visibility": "off"
                }]
            }, {
                "featureType": "landscape.natural",
                "stylers": [{
                    "color": "#fe8e84"
                }]
            }, {
                "featureType": "road",
                "elementType": "geometry",
                "stylers": [{
                    "visibility": "off"
                }]
            }, {
                "featureType": "poi",
                "stylers": [{
                    "visibility": "off"
                }]
            }, {
                "featureType": "road",
                "stylers": [{
                    "visibility": "off"
                }]
            }, {
                "featureType": "transit",
                "stylers": [{
                    "visibility": "off"
                }]
            }, {
                "featureType": "landscape.man_made",
                "stylers": [{
                    "visibility": "off"
                }]
            }, {
                "featureType": "administrative",
                "stylers": [{
                    "visibility": "off"
                }]
            }];

        var textcolor = "#fd685b";

        var styledMap = new google.maps.StyledMapType(styles, {
            name: "Styled Map"
        });
        var map = new google.maps.Map($map[0], options);

        var marker = new google.maps.Marker({
            position: latlng,
            title: $map_title,
            map: map
        });
        // var contentString = '<span class="infobox-inner" style="color: ' + textcolor + ';">' + $map_info + '</span>';
        // var infobox = new google.maps.InfoWindow({
        //     content: contentString
        // });
        // var infobox = new InfoBox({
        //     content: contentString,
        //     disableAutoPan: false,
        //     maxWidth: 0,
        //     zIndex: null,
        //     boxStyle: {
        //         width: "280px"
        //     },
        //     closeBoxURL: "",
        //     pixelOffset: new google.maps.Size(-140, 40),
        //     infoBoxClearance: new google.maps.Size(1, 1)
        // });
        $map.css({
            'height': $map_height + 'px'
        });
        // google.maps.event.addListener(marker, 'click', function() {
        //     infobox.open(map, marker);
        // });
        // infobox.open(map, marker);
        google.maps.event.addDomListener(window, "resize", function() {
            var center = map.getCenter();
            google.maps.event.trigger(map, "resize");
            map.setCenter(center);
        });
    });
}
