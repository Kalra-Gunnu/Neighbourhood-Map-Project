'use strict';

// My Favorite Locations Array
var locations = [
  {title: 'Salar Jung Meuseum', location: {lat: 17.371503, lng: 78.480256}, id: 'nav0', visible: ko.observable(true), boolTest: true},
  {title: 'Snow World Amusement Park', location: {lat: 17.414571, lng: 78.480923}, id: 'nav1', visible: ko.observable(true), boolTest: true},
  {title: 'Buddha Statue, Hussain Sagar', location: {lat: 17.415573, lng: 78.474977}, id: 'nav2', visible: ko.observable(true), boolTest: true},
  {title: 'Ramoji Film City', location: {lat: 17.253884, lng: 78.680723}, id: 'nav3', visible: ko.observable(true), boolTest: true},
  {title: 'Charminar', location: {lat: 17.361564, lng: 78.474665}, id: 'nav4', visible: ko.observable(true), boolTest: true},
  {title: 'Golconda Fort', location: {lat: 17.383252, lng: 78.401061}, id: 'nav5', visible: ko.observable(true), boolTest: true},
  {title: 'Birla Mandir', location: {lat: 17.406237, lng: 78.46906}, id: 'nav6', visible: ko.observable(true), boolTest: true},
  {title: 'Osmansagar View Point, Gandipet', location: {lat: 17.380682, lng: 78.317242}, id: 'nav7', visible: ko.observable(true), boolTest: true},
  {title: 'Shilparamam', location: {lat: 17.452443, lng: 78.379576}, id: 'nav8', visible: ko.observable(true), boolTest: true},
  {title: 'Love Hyderabad Sculpture', location: {lat: 17.419356, lng: 78.482670}, id: 'nav9', visible: ko.observable(true), boolTest: true},
  {title: 'Nehru Zoological Park', location: {lat: 17.350932, lng: 78.451622}, id: 'nav10', visible: ko.observable(true), boolTest: true},
  {title: 'Durgam Cheruvu', location: {lat: 17.430041, lng: 78.389459}, id: 'nav11', visible: ko.observable(true), boolTest: true}
];

var flickrPhotoArray = [];

var counter = 0;

var imagesAreSet = false;

// Initialise a map variable
var map;

// Initialize a 'bounds' variable to focus on the bounds of our favorite location 
var bounds = null;

// Initialise a null array for markers
var markers = [];

// Initialise a variable for searching in a polygon
var polygon = null;


//CallBack function when google maps Api is loaded
function initMap() {
  // Styles array to customise the map
  var styles = [
    {
      "elementType": "geometry",
      "stylers": [
        {
          "hue": "#ff4400"
        },
        {
          "saturation": -68
        },
        {
          "lightness": -4
        },
        {
          "gamma": 0.72
        }
      ]
    },
    {
      "featureType": "road",
      "elementType": "labels.icon"
    },
    {
      "featureType": "landscape.man_made",
      "elementType": "geometry",
      "stylers": [
        {
          "hue": "#0077ff"
        },
        {
          "gamma": 3.1
        }
      ]
    },
    {
      "featureType": "water",
      "stylers": [
        {
          "color": "#19a0d8"
        }
      ]
    },
    {
      "featureType": "poi.park",
      "stylers": [
        {
          "hue": "#44ff00"
        },
        {
          "saturation": -23
        }
      ]
    },
    {
      "featureType": "water",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "hue": "#007fff"
        },
        {
          "gamma": 0.77
        },
        {
          "saturation": 65
        },
        {
        "lightness": 99
        }
      ]
    },
    {
      "featureType": "water",
      "elementType": "labels.text.stroke",
      "stylers": [
        {
          "gamma": 0.11
        },
        {
          "weight": 5.6
        },
        {
          "saturation": 99
        },
        {
          "hue": "#0091ff"
        },
        {
          "lightness": -86
        }
      ]
    },
    {
      "featureType": "transit.line",
      "elementType": "geometry",
      "stylers": [
        {
          "lightness": -48
        },
        {
          "hue": "#ff5e00"
        },
        {
          "gamma": 1.2
        },
        {
          "saturation": -23
        }
      ]
    },
    {
      "featureType": "transit",
      "elementType": "labels.text.stroke",
      "stylers": [
        {
          "saturation": -64
        },
        {
          "hue": "#ff9100"
        },
        {
          "lightness": 16
        },
        {
          "gamma": 0.47
        },
        {
          "weight": 2.7
        }
      ]
    },
    {
      featureType: 'transit.station',
      stylers: [
        {
          weight: 9
        },
        {
          hue: '#e85113'
        }
      ]
    }
  ];

  // Create a new Map with the following properties
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 17.3392035, lng: 78.540914},
    zoom: 11,
    styles: styles, // Apply costume styles to map
    mapTypeControl: false
  });

  // Loop over each location and define the markers associated with it
  locations.forEach(function(loc, index){
    var position = loc.location;
    var title = loc.title;
    var marker = new google.maps.Marker({
      position: position,
      title: title,
      icon: defaultIcon,
      animation: google.maps.Animation.DROP,
      id: index
    });
    
    markers.push(marker);

    // 'click' event listener on marker to open the infoWindow
    marker.addListener('click', function(){
      toggleBounce(this);
      populateInfoWindow(this, largeInfowindow);
    });
          
    // Event listeners on marker to show different types of marker
    marker.addListener('mouseover',function() {
      this.setIcon(highlightedIcon);
    });

    marker.addListener('mouseout',function() {
      this.setIcon(defaultIcon);
    });
  });
  
  // Render function to set the markers on our map
  setMarkers();

  //
  //var geocoder = new google.maps.Geocoder();
  // 'click' event listener on reset buton
  document.getElementById('reset').addEventListener('click', function() {
    resetMap();
  });

  // 'click' event listener on hide listings button
  document.getElementById('hide-listings').addEventListener('click', hideListings);

  // 'click' event listener to zoom to the provided area
  document.getElementById('zoom-to-area').addEventListener('click', function() {
    zoomToArea(); 
  });

  // 'click' event listener to search all places within a given period of time and mode of travel
  document.getElementById('search-within-time').addEventListener('click', function() {
    searchWithinTime();
  });

  // Variable initialisation for infoWindow
  var largeInfowindow = new google.maps.InfoWindow();

  // Variable initialisation for Drawing management options
  var drawingManager = new google.maps.drawing.DrawingManager({
    drawingMode: google.maps.drawing.OverlayType.POLYGON,
    drawingControl: true,
    drawingControlOptions:{
      position: google.maps.ControlPosition.TOP_LEFT,
      drawingModes: [
        google.maps.drawing.OverlayType.POLYGON
      ]
    }
  });

  document.getElementById('toggle-drawing').addEventListener('click', function() {
    toggleDrawing(drawingManager);
  });
  
  drawingManager.addListener('overlaycomplete', function(event){

    if(polygon) {
      polygon.setMap(null);
      hideListings();
    }

    drawingManager.setDrawingMode(null);
    polygon = event.overlay;
    polygon.setEditable(true);

    searchWithinPolygon();
    polygon.getPath().addListener('set_at', searchWithinPolygon);
    polygon.getPath().addListener('insert_at', searchWithinPolygon);
  });

  // Icon when mouse is not over the marker
  var defaultIcon = makeMarkerIcon('fe7569');

  // Icon when mouse hovers over the marker
  var highlightedIcon = makeMarkerIcon('ffff24');
};

// Animate the marker on 'click'
function toggleBounce(marker) {
    marker.setAnimation(google.maps.Animation.BOUNCE);
    setTimeout(function() {
      marker.setAnimation(null)
    }, 1500);
};

// Resets the zoom of map and set markers again  
function resetMap() {
  map.setCenter({lat: 17.3392035, lng: 78.540914});
  map.setZoom(11);
  map.fitBounds(bounds);
};

// Renders the marker on map
function setMarkers() {
  // Initialise the bounds variable to bound our map to certain area
  bounds = new google.maps.LatLngBounds();
  // Loop over each location and render only those Locations which have boolTest = true
  locations.forEach(function(loc,index) {
    if(loc.boolTest === true){
      markers[index].setMap(map);
      // Calculate bounds of our region of interest
      bounds.extend(markers[index].position);
    } else {
      markers[index].setMap(null);
    }
  });

  // Set bounds over the map to show and focus only our region of interest
  map.fitBounds(bounds);
};

// Hide Listings function
function hideListings() {
  markers.forEach(function(mark){
    mark.setMap(null);
  });
};

// Function to zoom to the specified area
function zoomToArea() {
  var geocoder = new google.maps.Geocoder();

  var address = viewListModel.address().toLowerCase();
  if(address == '') {
    window.alert('You must enter an area, or address.');
  } else {
    geocoder.geocode(
      { 
        address: address,
        componentRestrictions: {locality: 'Hyderabad'}
      }, 
      function(results, status) {
        if(status == google.maps.GeocoderStatus.OK) {
          map.setCenter(results[0].geometry.location);
          map.setZoom(15);
          var marker = new google.maps.Marker({
            title: results[0].formatted_address,
            position: results[0].geometry.location
          });
          marker.setMap(map);
          var infowindow = new google.maps.InfoWindow({
            content : '<span>' + marker.title + '</span>'
          });
          infowindow.open(map,marker);
          marker.addListener('click', function(){
            toggleBounce(this);
          });
        } else {
          window.alert('We couldn\'t find the location - try entering a more specific one');
        }
      }
    );
  }
};

// Function to search all places inside a given time by the provided mode of travel
function searchWithinTime() {
  var distanceMatrixService = new google.maps.DistanceMatrixService;
  var address = document.getElementById('search-within-time-text').value;
  var marker = new google.maps.Marker({
    position : address
  })
  marker.setMap(map);
  if(address == '') {
    window.alert('You must enter an address!');
  } else {
    hideListings();
    var origins = [];
    for( var i = 0; i < markers.length; i++) {
      origins[i] = markers[i].position;
    }
    
    var destination = address;
    var mode = viewListModel.selectedMode();
    distanceMatrixService.getDistanceMatrix(
      {
        origins: origins,
        destinations: [destination],
        travelMode: google.maps.TravelMode[mode],
        unitSystem: google.maps.UnitSystem.IMPERIAL
      },
      function(response, status) {
        if(status !== google.maps.DistanceMatrixStatus.OK) {
          window.alert('Error was: ' + status);
        } else {
          displayMarkersWithinTime(response);
        }
      }
    );
  }
};

// Function to display all markers within given period of time and given mode of travel
function displayMarkersWithinTime(response) {
  var maxDuration = viewListModel.selectedDuration();

  var origins = response.originAddresses;
  var destinations = response.destinationAddresses;

  var atLeastOne = false;

  for(var i = 0; i < origins.length; i++) {
    var results = response.rows[i].elements;
    for( var j = 0; j < results.length; j++) {
      var element = results[j];

      if(element.status === 'OK') {
        var distanceText = element.distance.text;
        var duration = element.duration.value/60;
        var durationText = element.duration.text;
        if(duration <= maxDuration) {
          markers[i].setMap(map);
          atLeastOne = true;
          var infowindow = new google.maps.InfoWindow({
            content : '<span>' + origins[i] + '</span><br>' + durationText + ' away.' + distanceText + '<div><input type = \"button\" value = \"View Route\" onclick =' +
            '\"displayDirections(&quot;' + origins[i] + '&quot;);\"></input></div>'
          });
          infowindow.open(map, markers[i]);
          markers[i].infowindow = infowindow;
          google.maps.event.addListener(markers[i], 'click', function() {
            this.infowindow.close();
          });
        }
      }
    }
  }
  if(!atLeastOne) {
    window.alert('We couldn\'t find any locations within the distance!');
  }
};

// Function to display route from the provided point of start
function displayDirections(origin) {
  hideListings();
  var directionsService = new google.maps.DirectionsService;
  var destinationAddress = document.getElementById('search-within-time-text').value;
  var mode = viewListModel.selectedMode();
  directionsService.route(
    {
      origin: origin,
      destination: destinationAddress,
      travelMode: google.maps.TravelMode[mode]
    },
    function(response, status) {
      if(status === google.maps.DirectionsStatus.OK){
        var directionsDisplay = new google.maps.DirectionsRenderer({
          map: map,
          directions: response,
          draggable: true,
          polylineOptions: {
            strokeColor: 'green'
          }
        });
      } else {
        window.alert('Directions request failed due to ' + status);
      }
    } 
  );
};

// Opens an Infowindow and renders the latLng and StreetView for the location/marker clicked
function populateInfoWindow(marker, infowindow) {
  if(infowindow.marker != marker) {
    infowindow.marker = marker;
    infowindow.setContent('');
    infowindow.addListener('closeClick', function() {
      infowindow.marker(null);
    });
    // Street view request
    var streetViewService = new google.maps.StreetViewService();
    var radius = 50;

    // Request for street view and display it
    function getStreetView(data, status) {
      // If status of returned request 'OK'
      if(status == google.maps.StreetViewStatus.OK) {
        var nearStreetViewLocation = data.location.latLng;
        map.setCenter(nearStreetViewLocation);
        map.setZoom(16);
        var heading = google.maps.geometry.spherical.computeHeading(nearStreetViewLocation, marker.position);
        infowindow.setContent('<div>' + marker.title + '</div>' + '<div>' + marker.position + '</div><div id="pano"></div>' + '<img id="flickr" src="img/flickr.png" alt="Flickr Logo">');
        var panoramaOptions = {
          position: nearStreetViewLocation,
          pov: {
            heading: heading,
            pitch: 30
          }
        };
        var panorama = new google.maps.StreetViewPanorama(document.getElementById('pano'), panoramaOptions);
      } 
      // Else Display an Error Message
      else {
        infowindow.setContent('<div>' + marker.title + '</div>' + '<div>' + marker.position + '</div><div>No Street View Found</div>' + '<img id="flickr" src="img/flickr.png" alt="Flickr Logo">');
      }
      getflickrContent(marker);
    }
    
    streetViewService.getPanoramaByLocation(marker.position, radius, getStreetView);
    infowindow.open(map, marker);
  }
};

function getflickrContent(marker) {
  var flickrJSON;

  //Binds click handler to flickr image to open modal
  $("#flickr").click(function() {
    $(".modal").css("z-index", "3");
    $(".modal").show();
  });

  //Binds click handler to x button to close modal
  $("#exit-modal").click(function() {
    $(".modal").css("z-index", "0");
    $(".modal").hide();
    $('.flickr-image-container img').hide();
    imagesAreSet = true;
  });

  //GET JSON from flickr
  //Display message if error getting flickr JSON
  function getFlickrImages(mark) {
    var flickrUrl = 'https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=d5831bdf210abd3d393c6af8142aed21&accuracy=16&lat=' + mark.position.lat() + '&lon=' + mark.position.lng() +'&format=json';
    $.ajax({
      url: flickrUrl,
      dataType: 'jsonp',
      jsonp: 'jsoncallback',
      success: function(data) {
        var photo = data.photos.photo;
        flickrJSON = photo;
      },
      error: function() {
        viewListModel.flickrImage('<h1 style="text-align: center;">Sorry!</h1><br><h2 style="text-align: center;">Flickr Images Could Not Be Loaded</h2>');
        $("#right-arrow").hide();
        $("#left-arrow").hide();
      }
    });
  }
  getFlickrImages(marker);

  //Get random images from flickr JSON
  //Store image data in flickrPhotoArray
  //Hide all images except the first
  function setFlickrImages() {
    if(imagesAreSet === false) {
      for(var i=0; i < 25; i++) {
        var photo = 'https://farm' + flickrJSON[i].farm + '.staticflickr.com/' + flickrJSON[i].server + '/' + flickrJSON[i].id + '_' + flickrJSON[i].secret + '.jpg';
        flickrPhotoArray.push(photo);
        viewListModel.flickrImage('<img id="flickr-image' + i + '" src="' + photo + '" alt="' + flickrJSON[i].title + ' Flickr Image">');
      }
    } else {
      $("#flickr-image" + counter).show();
    }
  }
  $("#flickr").click(setFlickrImages);

  //Bind click handler to arrow button to view next image
  function scrollForward() {
    $('#flickr-image' + counter).hide();
    counter += 1;
    if(counter >= 24) {
      counter = 0;
    }
    $('#flickr-image' + counter).fadeIn(300); 
  }

  //Bind click handler to arrow button to view previous image
  function scrollBackWard() {
    $('#flickr-image' + counter).hide();
    counter -= 1;
    if(counter < 0) {
      counter = 24;
    }
    $('#flickr-image' + counter).fadeIn(300); 
  }

  $("#right-arrow").click(scrollForward);
  $("#left-arrow").click(scrollBackWard);
}

// Styled markers creating function
function makeMarkerIcon(color) {
  var markerImage = new google.maps.MarkerImage('http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|' + color + '|40|_|%E2%80%A2',
    new google.maps.Size(21,34),
    new google.maps.Point(0,0),
    new google.maps.Point(10,34),
    new google.maps.Size(21,34));
    return markerImage;
};

// Function to open/close drawing tools
function toggleDrawing(drawingManager) {
  if (drawingManager.map) {
    drawingManager.setMap(null);
    if(polygon) {
      polygon.setMap(null);
    }
  } else {
    drawingManager.setMap(map);
  }
};

// Function to search the markers within the drawn polygon
function searchWithinPolygon(){
  markers.forEach(function(mark) {
    if(google.maps.geometry.poly.containsLocation(mark.position, polygon)){
      mark.setMap(map);
    } else {
      mark.setMap(null);
    }
  });
};

// Our ViewModel 
var viewListModel = {
  query: ko.observable(''),
  address: ko.observable(''),
  availableDurations: ko.observable(['10','15','30','60','120','300']),
  selectedDuration: ko.observable(''),
  availableModes: ko.observable(['DRIVING','WALKING','BICYCLING','TRANSIT']),
  selectedMode: ko.observable(''),
  flickrImage: ko.observable('')
};

viewListModel.markers = ko.dependentObservable(function() {
  var self = this;
  var search = self.query().toLowerCase();
  return ko.utils.arrayFilter(locations, function(marker) {
    if(marker.title.toLowerCase().indexOf(search) >= 0) {
      marker.boolTest = true;
      return marker.visible(true);
    } else {
      marker.boolTest = false;
      setMarkers();
      return marker.visible(false);
    }
  });
}, viewListModel);

viewListModel.set = function() {
  setMarkers();
}

viewListModel.listElem = function(mark) {
  var largeInfowindow = new google.maps.InfoWindow();
  var marker = new google.maps.Marker({
    position: mark.location,
    title: mark.title,
    icon: mark.defaultIcon,
    animation: google.maps.Animation.DROP,
    id: mark.id
  });
  marker.setMap(map);
  populateInfoWindow(marker, largeInfowindow);
  toggleBounce(marker);
}

viewListModel.errorMessage = function() {
  window.alert('Google Maps not responding. Please try again later!!');
}

ko.applyBindings(viewListModel);
