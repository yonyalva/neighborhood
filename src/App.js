import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import {load_google_maps} from './components/script'
 
class App extends Component {

	componentDidMount() {
		let googleMapsPromise = load_google_maps ();
		Promise.all([
			googleMapsPromise
		])
				.then(values => {
			
				  let google = values[0];
					this.google = values;
				//	this.markers = [];
					let map;

					map = new google.maps.Map(document.getElementById('map'), {
						center: {lat: 41.179226, lng: -73.189438},
						zoom: 13
					});

					var locations = [
						{title: 'La Mexicana Restaurant & Bakery', location: {lat:  41.1727, lng: -73.210299}},
						{title: 'Mi Pueblo Restaurant & Bakery', location: {lat:  41.171315, lng: -73.206972}},
						{title: 'American Steak House', location: {lat:  41.201269, lng: -73.185896}},
						{title: 'Pantanal', location: {lat:  41.18697, lng: -73.198079}},
						{title: 'Terra Brasilis Restaurant', location: {lat:  41.188444, lng: -73.201293}}
					];

					var largeInfowindow = new google.maps.InfoWindow();
					var bounds = new google.maps.LatLngBounds();
					var markers = [];

					function populateInfoWindow(marker, infowindow){
						if (infowindow.marker != marker) {
						infowindow.marker = marker;
						infowindow.setContent('<div>' + marker.title + '</div>');
						infowindow.open(map, marker);
						infowindow.addListener('closeclick', function(){
						infowindow.setMarker(null);
						});
						}
						map.fitBounds(bounds);
					}
		
		for (var i = 0; i < locations.length; i++) {
			var position = locations[i].location;
			var title = locations[i].title;
			var marker = new google.maps.Marker({
			map: map,
			position: position,
			title: title,
			icon: {url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png"},		
			animation: google.maps.Animation.DROP,
			id: i
		});
			markers.push(marker);
			bounds.extend(marker.position);
			marker.addListener('click', function() {
			populateInfoWindow(this, largeInfowindow);
		});
		}


		})
	}
  render() {
    return (
      <div id="map">
        
      </div>

    );
  }
}

export default App;
