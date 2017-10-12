
// My Favorite Locations Array
var locations = [
  {title: 'Salar Jung Meuseum', lat: 17.371503, lng: 78.480256, id: "4bc95d44fb84c9b6d5101b3e"},
  {title: 'Snow World', lat: 17.414571, lng: 78.480923, id: "4c63bee9de1b2d7f007de570"},
  {title: 'Buddha Statue', lat: 17.415573, lng: 78.474977, id: "4c878ecb9062ef3b665940c6"},
  {title: 'Ramoji Film City', lat: 17.253884, lng: 78.680723, id: "55e93dbb498e336a2e409522"},
  {title: 'Charminar', lat: 17.361564, lng: 78.474665, id: "4e1d712415207c4cbec540bd"},
  {title: 'Golconda Fort', lat: 17.383252, lng: 78.401061, id: "4c42eee8d7fad13ab4d009da"},
  {title: 'Birla Mandir', lat: 17.406237, lng: 78.46906, id: "4be4c4478a8cb7139351c4a0"},
  {title: 'Osman Sagar', lat: 17.380682, lng: 78.317242, id: "4eafe7ac6c250ddebe80c665"},
  {title: 'Shilparamam', lat: 17.452443, lng: 78.379576, id: "4c249cc3136d20a1290ae261"},
  {title: 'Nehru Zoological Park', lat: 17.350932, lng: 78.451622, id: "4c4269da520fa593d043cbac"},
  {title: 'Durgam Cheruvu', lat: 17.430041, lng: 78.389459, id: "4c2f426a66e40f47a288c18b"},
];

// Id's for foursquare api
var clientID;
var clientSecret;

// Initialise a map variable
var map;

var bounds = null;

function formatPhone(phonenum) {
    var regexObj = /^(?:\+?1[-. ]?)?(?:\(?([0-9]{3})\)?[-. ]?)?([0-9]{3})[-. ]?([0-9]{4})$/;
    if (regexObj.test(phonenum)) {
        var parts = phonenum.match(regexObj);
        var phone = "";
        if (parts[1]) { phone += "+1 (" + parts[1] + ") "; }
        phone += parts[2] + "-" + parts[3];
        return phone;
    }
    else {
        //invalid phone number
        return phonenum;
    }
}

var Location = function(data) {
  var self = this;
  this.name = data.title;
  this.lat = data.lat;
  this.long = data.lng;
  this.id = data.id;
  this.Url = "";
  this.street = "";
  this.city = "";
  this.phone = "";

  this.visible = ko.observable(true);
  var foursquareURL = 'https://api.foursquare.com/v2/venues/search?ll='+ this.lat + ',' + this.long + '&client_id=' + clientID + '&client_secret=' + clientSecret + '&v=20160118' + '&query=' + this.name;
  var foursquareImgURL = 'https://api.foursquare.com/v2/venues/' + this.id + '/photos?limit=25&client_id=' + clientID + '&client_secret=' + clientSecret + '&v=20160118';
  $.getJSON(foursquareURL).done(function(data) {
    var results = data.response.venues[0];
    self.URL = results.url;
    if (typeof self.URL === 'undefined'){
      self.URL = "";
    }
    self.street = results.location.formattedAddress[0];
      self.city = results.location.formattedAddress[1];
        self.phone = results.contact.phone;
        if (typeof self.phone === 'undefined'){
      self.phone = "";
    } else {
      self.phone = formatPhone(self.phone);
    }
  }).fail(function() {
    alert("There was an error with the Foursquare API call. Please refresh the page and try again to load Foursquare data.");
  });

  $.getJSON(foursquareImgURL).done(function(data){
    var results = data.response.photos.items[0];
    self.prefix = results.prefix;
    self.suffix = results.suffix;
    self.size = '300x500';
    self.photoURL = self.prefix + self.size + self.suffix;
  }).fail(function(){
    alert('Error in getting images.');
  });

  this.contentString = '<div class="info-window-content"><div class="title"><b>' + data.title + "</b></div>" +
        '<img src="' + self.photoURL + '" alt="' + data.title + '">' + '<div class="content"><a href="' + self.URL +'">' + self.URL + "</a></div>" +
        '<div class="content">' + self.street + "</div>" +
        '<div class="content">' + self.city + "</div>" +
        '<div class="content">' + self.phone + "</div></div>";

  this.infoWindow = new google.maps.InfoWindow({content: self.contentString});

  this.marker = new google.maps.Marker({
      position: new google.maps.LatLng(data.lat, data.lng),
      map: map,
      title: data.title
  });

  this.showMarker = ko.computed(function() {
    if(this.visible() === true) {
      this.marker.setMap(map);
      bounds.extend(this.marker.position);
    } else {
      this.marker.setMap(null);
    }
    return true;
  }, this);

  this.marker.addListener('click', function(){
    self.contentString = '<div class="info-window-content"><div class="title"><b>' + data.title + "</b></div>" +
        '<img src="' + self.photoURL + '" alt="' + data.title + '">' + '<div class="content"><a href="' + self.URL +'">' + self.URL + "</a></div>" +
        '<div class="content">' + self.street + "</div>" +
        '<div class="content">' + self.city + "</div>" +
        '<div class="content"><a href="tel:' + self.phone +'">' + self.phone +"</a></div></div>";

        self.infoWindow.setContent(self.contentString);

    self.infoWindow.open(map, this);

    self.marker.setAnimation(google.maps.Animation.BOUNCE);
        setTimeout(function() {
          self.marker.setAnimation(null);
      }, 2100);
  });

  this.bounce = function(place) {
    self.marker.setAnimation(google.maps.Animation.BOUNCE);
        setTimeout(function() {
          self.marker.setAnimation(null);
      }, 2100);
  };
};

function AppViewModel() {
  var self = this;

  this.searchTerm = ko.observable("");

  this.locationList = ko.observableArray([]);

  bounds = new google.maps.LatLngBounds();

  map = new google.maps.Map(document.getElementById('map'), {
      zoom: 12,
      center: {lat: 17.3392035, lng: 78.540914}
  });

  // Foursquare API settings
  clientID = "M4VKJZZRYSBK4ZTGKHO1CJ3UWUJNNE5VPE2HJ5LLATYWO4LX";
  clientSecret = "L3PSQRSMSCYC0B2XRVB4V5AZAWGXPIQCNO25TB31WSF5DTRO";

  locations.forEach(function(locationItem){
    self.locationList.push( new Location(locationItem));
  });

  this.filteredList = ko.computed( function() {
    var filter = self.searchTerm().toLowerCase();
    if (!filter) {
      self.locationList().forEach(function(locationItem){
        locationItem.visible(true);
      });
      return self.locationList();
    } else {
      return ko.utils.arrayFilter(self.locationList(), function(locationItem) {
        var string = locationItem.name.toLowerCase();
        var result = (string.search(filter) >= 0);
        locationItem.visible(result);
        return result;
      });
    }
  }, self);

  this.mapElem = document.getElementById('map');
  this.mapElem.style.height = window.innerHeight - 50;
}

AppViewModel.errorMessage = function() {
  alert("Google Maps has failed to load. Please check your internet connection and try again.");
}

function startApp() {
  ko.applyBindings(new AppViewModel());
}