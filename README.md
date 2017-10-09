## Neighbourhood Map project

A one page application which contains a map of your favorite area showing markers of some great places of that area. I have created a map for Hyderabad and places to visit there.

### Getting started

Instructions to run site:

1. Fork & Clone the repository.
2. Open `index.html` file.
3. `Drawing Tools` option allows you to search for locations inside a given area drawn.
4. `Hide Listings` hides al the markers.
5. `Zoom` allows you to center the map to your area of interest.
6. An additional functionality gives you an option to search for all the locations from your provided location in the time interval & the mode of travelling specified.
7. If using with a screen size less than 750px, All the locations will  be in a drawer which opens when you click the nav button on top left.
8. `Reset Map Zoom` recenters the map and resets the zoom.
9. A Flickr icon is also present which provides images from your favorite location.

### Customize it according to your favorite Area

1. Open `main.js` in `js` directory.
2. Replace the `titles` and `latLng` positions accordingly.
3. In `initMap()` function, replace the `centre` latLng position with latLng of your favorite area.
4. Also replace the `lat` and `lon` in flickrUrl in `flickr.js` file to receive images of your favorite location.
4. Also there are styles(a `styles` array is created and a `style` property commented out in map variable) which can be appiled to our map.

