// My Locations
var locations = [{
    name: 'El Jefe',
    location: {
      lat: 37.4126,
      lng: -79.1387
    },
    type: 'restaurant'
  },
  {
    name: 'Waterstone Pizza',
    location: {
      lat: 37.411768,
      lng: -79.137258
    },
    type: 'restaurant'
  },
  {
    name: 'Beer 88',
    location: {
      lat: 37.3559,
      lng: -79.2396
    },
    type: 'restaurant'
  },
  {
    name: 'Yamazato',
    location: {
      lat: 37.335041,
      lng: -79.244265
    },
    type: 'restaurant'
  },
  {
    name: 'Blackwater Creek Trail',
    location: {
      lat: 37.416690,
      lng: -79.141263
    },
    type: 'landmark'
  },
  {
    name: 'White Hart Cafe',
    location: {
      lat: 37.412303,
      lng: -79.139706
    },
    type: 'restaurant'
  },
  {
    name: '{RA} Bistro',
    location: {
      lat: 37.410477,
      lng: -79.138148
    },
    type: 'restaurant'
  },
  {
    name: 'Peaks View Park',
    location: {
      lat: 37.420004,
      lng: -79.226103
    },
    type: 'park'
  },
  {
    name: 'Appomattox Court House',
    location: {
      lat: 37.377520,
      lng: -78.796007
    },
    type: 'landmark'
  },
  {
    name: 'Thomas Jefferson\'s Poplar Forest',
    location: {
      lat: 37.347907,
      lng: -79.264540
    },
    type: 'landmark'
  },
  {
    name: 'Natural Bridge State Park',
    location: {
      lat: 37.628620,
      lng: -79.543535
    },
    type: 'park'
  },
  {
    name: 'Shakers',
    location: {
      lat: 37.367122,
      lng: -79.175420
    },
    type: 'restaurant'
  },
  {
    name: 'Perky\'s',
    location: {
      lat: 37.147667,
      lng: -79.230994
    },
    type: 'restaurant'
  },
  {
    name: 'Rivermont Pizza',
    location: {
      lat: 37.435186,
      lng: -79.171021
    },
    type: 'restaurant'
  },
  {
    name: 'Peaks of Otter',
    location: {
      lat: 37.445630,
      lng: -79.609981
    },
    type: 'park'
  },
  {
    name: 'Texas Inn',
    location: {
      lat: 37.418401,
      lng: -79.145141
    },
    type: 'restaurant'
  }
];

var Location = function(data) {
  this.name = data.name;
  this.location = data.location;
  this.type = data.type;
  this.marker = data.marker;
  this.showPlace = ko.observable(true);
};

// ViewModel Start

var ViewModel = function() {
  var self = this;

  this.placeList = ko.observableArray([]);

  locations.forEach(function(placeItem) {
    self.placeList.push(new Location(placeItem));
  })

  this.openNav = function() {
    document.getElementById("mySidenav").style.width = "250px";
    document.getElementById("map").style.marginLeft = "250px";
    document.body.style.backgroundColor = "rgba(0,0,0,0.4)";
  }
  this.closeNav = function() {
    document.getElementById("mySidenav").style.width = "0";
    document.getElementById("map").style.marginLeft = "0";
    document.body.style.backgroundColor = "white";
  }

  this.openWindow = function(location) {
    //console.log(location.name)
    var marker = markers.filter(m => m.name === location.name)[0];
    if (marker) {
      google.maps.event.trigger(marker, 'click');
    }
  };

  this.typeToShow = ko.observable("all");
  this.locationsToShow = ko.computed(function(place) {
    var desiredType = this.typeToShow();
    //console.log(desiredType);
    if (desiredType == "all") {
      this.placeList().forEach(function(place) {
        if (place.marker) {
          place.marker.setVisible(true);
        };
      });
      return this.placeList();
    } else {
      return ko.utils.arrayFilter(this.placeList(), function(place) {
        //console.log(place.type);
        var showMarkers = place.type.indexOf(self.typeToShow()) != -1;
        place.marker.setVisible(showMarkers);
        return place.type === desiredType;
      });
    };
  }, this);


  function googleError() {
    alert('Error loading Google Maps, please try again later.');
  };

};

viewmodel = new ViewModel();
ko.applyBindings(viewmodel);

var map;
// Create a new blank array for all the listing markers.
var markers = [];

function initMap() {

  // Map styles

  var styles = [{
      "featureType": "all",
      "elementType": "labels.text.fill",
      "stylers": [{
        "color": "#ffffff"
      }]
    },
    {
      "featureType": "all",
      "elementType": "labels.text.stroke",
      "stylers": [{
          "color": "#000000"
        },
        {
          "lightness": 13
        }
      ]
    },
    {
      "featureType": "administrative",
      "elementType": "geometry.fill",
      "stylers": [{
        "color": "#000000"
      }]
    },
    {
      "featureType": "administrative",
      "elementType": "geometry.stroke",
      "stylers": [{
          "color": "#144b53"
        },
        {
          "lightness": 14
        },
        {
          "weight": 1.4
        }
      ]
    },
    {
      "featureType": "landscape",
      "elementType": "all",
      "stylers": [{
        "color": "#08304b"
      }]
    },
    {
      "featureType": "poi",
      "elementType": "geometry",
      "stylers": [{
          "color": "#0c4152"
        },
        {
          "lightness": 5
        }
      ]
    },
    {
      "featureType": "road.highway",
      "elementType": "geometry.fill",
      "stylers": [{
        "color": "#000000"
      }]
    },
    {
      "featureType": "road.highway",
      "elementType": "geometry.stroke",
      "stylers": [{
          "color": "#0b434f"
        },
        {
          "lightness": 25
        }
      ]
    },
    {
      "featureType": "road.arterial",
      "elementType": "geometry.fill",
      "stylers": [{
        "color": "#000000"
      }]
    },
    {
      "featureType": "road.arterial",
      "elementType": "geometry.stroke",
      "stylers": [{
          "color": "#0b3d51"
        },
        {
          "lightness": 16
        }
      ]
    },
    {
      "featureType": "road.local",
      "elementType": "geometry",
      "stylers": [{
        "color": "#000000"
      }]
    },
    {
      "featureType": "transit",
      "elementType": "all",
      "stylers": [{
        "color": "#146474"
      }]
    },
    {
      "featureType": "water",
      "elementType": "all",
      "stylers": [{
        "color": "#021019"
      }]
    }
  ]
  // Create Map
  map = new google.maps.Map(document.getElementById('map'), {
    center: {
      lat: 37.4138,
      lng: -79.1422
    },
    zoom: 13,
    mapTypeControl: false,
    styles: styles
  });

  var largeInfowindow = new google.maps.InfoWindow({
    maxWidth: 240
  });

  // On load, render all markers to map

  window.addEventListener('load', showLocations);
  // The following group uses the location array to create an array of markers on initialize.
  for (var i = 0; i < locations.length; i++) {
    // Get the position from the location array.
    var position = locations[i].location;
    var lat = locations[i].location.lat;
    var lng = locations[i].location.lng;
    var name = locations[i].name;
    var type = locations[i].type;

    // Create a marker per location, and put into markers array.
    var marker = new google.maps.Marker({
      position: position,
      lat: lat,
      lng: lng,
      name: name,
      type: type,
      animation: google.maps.Animation.DROP,
      icon: {
        url: "img/icon.png",
        scaledSize: new google.maps.Size(30, 30)
      },
      id: i,
      map: map
    });

    // Push the marker to our array of markers.
    markers.push(marker);

    location.marker = marker;
    viewmodel.placeList()[i].marker = marker;

    marker.addListener('click', function() {
      // console.log(this.location_name, 'clicked');
      populateInfoWindow(this, largeInfowindow);
      toggleBounce(this);
    });
  };

  // Toggle bounce for markers

  function toggleBounce(marker) {
    marker.setAnimation(google.maps.Animation.BOUNCE);
    setTimeout(function() {
      marker.setAnimation(null);
    }, 1500);
  };
};

// Start Foursquare API
// Make ajax request to Foursquare's venue search API
function populateInfoWindow(marker, infowindow) {
  infowindow.setContent('');
  var lat = marker.lat;
  var lng = marker.lng;
  var url = "https://api.foursquare.com/v2/venues/search/?" + $.param({
    client_id: "JE5ABTNDMETWFRVUS3BGTFYF5LE1CFLEJ4PXFFKCEXJ25YCZ",
    client_secret: "UFQPWNLOPKBDCNPHNLHD11I3O2Q310WYLKSFH3IXUEJREWTK",
    v: "20130815",
    ll: lat + ',' + lng,
    query: marker.name,
    limit: "1"
  });

  $.ajax(url, {
    dataType: "jsonp",
    success: function(data) {
      var id = data.response.venues[0].id;
      var locName = data.response.venues[0].name;
      var address = data.response.venues[0].location.formattedAddress[0];
      getPhoto(id, marker, address);
    },
    // If any errors
    error: function(xhr, status, error) {
      alert("Error: " + status);
    }
  });

  // Make ajax request to Foursquare's photo api
  function getPhoto(id, model, locAddress) {
    url = "https://api.foursquare.com/v2/venues/" + id + "/photos/?" + $.param({
      client_id: "JE5ABTNDMETWFRVUS3BGTFYF5LE1CFLEJ4PXFFKCEXJ25YCZ",
      client_secret: "UFQPWNLOPKBDCNPHNLHD11I3O2Q310WYLKSFH3IXUEJREWTK",
      v: "20130815",
      limit: "1"
    });

    $.ajax(url, {
      dataType: "jsonp",
      success: function(data) {
        var photos = data.response.photos.items;
        photos.forEach(function(photo) {
          var pic = photo.prefix + "height500" + photo.suffix;
          infowindow.setContent('<div class="marker-name">' + marker.name +
            '</div><div class="address">' + locAddress +
            '</div><figure class="location-img"><img src="' + pic +
            '" id="infobox"></figure><a href="' + 'http://foursquare.com/v/' +
            marker.name + '/' + id +
            '?ref=JE5ABTNDMETWFRVUS3BGTFYF5LE1CFLEJ4PXFFKCEXJ25YCZ">' +
            '<img class="foursquareImg" src="img/Powered-by-Foursquare.png">');
        });
      },
      // If any errors
      error: function(xhr, status, error) {
        alert("Error: " + status);
      }
    });
    infowindow.open(map, marker);
  };
  /*
  // Google's street view
  // Check to make sure the infowindow is not already opened on this marker.
    if (infowindow.marker != marker) {
      // Clear the infowindow content to give the streetview time to load.
      infowindow.setContent('');
      infowindow.marker = marker;
      // Make sure the marker property is cleared if the infowindow is closed.
      infowindow.addListener('closeclick', function() {
        infowindow.marker = null;
      });
      var streetViewService = new google.maps.StreetViewService();
      var radius = 50;
      // In case the status is OK, which means the pano was found, compute the
      //position of the streetview image, then calculate the heading, then get a
      // panorama from that and set the options
      function getStreetView(data, status) {
        if (status == google.maps.StreetViewStatus.OK) {
          var nearStreetViewLocation = data.location.latLng;
          var heading = google.maps.geometry.spherical.computeHeading(
            nearStreetViewLocation, marker.position);
            infowindow.setContent('<div class="marker-name">' + marker.name + '</div><div id="pano"></div>');
            var panoramaOptions = {
              position: nearStreetViewLocation,
              pov: {
                heading: heading,
                pitch: 20
              }
            };
          var panorama = new google.maps.StreetViewPanorama(
            document.getElementById('pano'), panoramaOptions);
        } else {
            infowindow.setContent('<div class="marker-name">' + marker.name + '</div>' +
            '<div>No Street View Found</div>')
          }
      }
      // Use streetview service to get the closest streetview image within
      // 50 meters of the markers position
      streetViewService.getPanoramaByLocation(marker.position, radius, getStreetView);
      // Open the infowindow on the correct marker.
      infowindow.open(map, marker);
    }*/
}

function showLocations() {
  var bounds = new google.maps.LatLngBounds();
  // Extend the boundaries of the map for each marker and display the marker
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(map);
    bounds.extend(markers[i].position);
  };
  map.fitBounds(bounds);
};
