// My locations that will be shown to the user.
var locations = [
{
    name: 'El Jefe',
    location: {lat: 37.4126, lng: -79.1387},
    type: 'Restaurant'
},
{
    name : 'Waterstone Pizza',
    location: {lat: 37.411768, lng: -79.137258},
    type: 'Restaurant'
},
{
    name : 'Neighbors Place',
    location: {lat: 37.362684, lng: -79.244718},
    type: 'Restaurant'
},
{
    name : 'Beer 88',
    location: {lat: 37.3559, lng: -79.2396},
    type: 'Bar'
},
{
    name : 'Yamazatos',
    location: {lat: 37.335041, lng: -79.244265},
    type: 'Restaurant'
}
];

var Location = function(data){
  this.name = data.name;
  this.location = data.location;
  this.type = data.type;
  this.marker = data.marker;
  this.showPlace = ko.observable(true);
};

var ViewModel = function() {
  var self = this;

  this.placeList = ko.observableArray([]);

  locations.forEach(function(placeItem){
      self.placeList.push( new Location(placeItem) );
  })

  self.openInfoWindow = function(location) {
    google.maps.event.trigger(location.marker, 'click');
  };

  this.typedQuery = ko.observable();

  filteredLocations = ko.computed(function() {
       self.placeList().forEach(function(location) {
           if (self.typedQuery() != null) {

               // Filter available locations
               var match = location.name.toLowerCase().indexOf(self.typedQuery().toLowerCase()) != -1;
               location.showPlace(match);
               console.log(match);

               // Filter out map markers
               location.marker.setVisible(match);
           }
       });
   });
};

function googleError() {
    alert('Error loading Google Maps, please try again later.');
}

viewmodel = new ViewModel();
ko.applyBindings(viewmodel);

// Start Google Maps API

var map;
// Create a new blank array for all the listing markers.
var markers = [];

function initMap() {
  // Constructor creates a new map - only center and zoom are required.
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 37.4138, lng: -79.1422},
    zoom: 13,
    mapTypeControl: false
  });

  var largeInfowindow = new google.maps.InfoWindow({
        maxWidth:350
    });

  window.addEventListener('load', showListings);
  // The following group uses the location array to create an array of markers on initialize.
  for (var i = 0; i < locations.length; i++) {
    // Get the position from the location array.
    var position = locations[i].location;
    var name = locations[i].name;
    var type = locations[i].type;
    // Create a marker per location, and put into markers array.
    var marker = new google.maps.Marker({
      position: position,
      name: name,
      type: type,
      animation: google.maps.Animation.DROP,
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
       });
  }
};

function populateInfoWindow(marker, infowindow) {
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
  }
}

function showListings() {
  var bounds = new google.maps.LatLngBounds();
  // Extend the boundaries of the map for each marker and display the marker
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(map);
    bounds.extend(markers[i].position);
  }
  map.fitBounds(bounds);
}

// End Google Maps API
