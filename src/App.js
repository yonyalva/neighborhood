import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import {load_google_maps} from './components/script'
 
class App extends Component {
	
	constructor(props) {
		super(props);
		this.state = {
			query: ''
		}
	}

	componentDidMount() {
		let googleMapsPromise = load_google_maps ();
		Promise.all([
			googleMapsPromise
		])
				.then(values => {
			
				  	let google = values[0];
					this.google = values;
				    this.markers = [];
					let map;

					    map = new google.maps.Map(document.getElementById('map'), {
						center: {lat: 41.179226, lng: -73.189438},
						zoom: 13
					});

						this.locations = [
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
						infowindow.marker = null;
						});
						}
						map.fitBounds(bounds);
					}

		
		for (let i = 0; i < this.locations.length; i++) {
			let position = this.locations[i].location;
			let title = this.locations[i].title;
			let marker = new google.maps.Marker({
			map: map,
			position: position,
			title: title,
			icon: {url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png"},		
			animation: google.maps.Animation.DROP,
			id: i
		});
			this.markers.push(marker);
			bounds.extend(marker.position);
			marker.addListener('click', function() {
			populateInfoWindow(this, largeInfowindow);
		});

		this.setState({filterLocations: this.locations});

		}

		   

		})
	}

	listItemClick = (location) => {
		let marker = this.markers.filter(m => m.id === location.id)[0];
		console.log(marker);
		this.infowindow.setContent(marker.title);
		this.map.setCenter(marker.position);
		this.infowindow.open(this.map, marker);
		this.map.panBy(0, -125);
	}

	filterLocations(query) {
		let filt = this.locations.filter(location => location.title.toLowerCase().includes(query.toLowerCase()));
		this.markers.forEach(marker => {
			marker.title.toLowerCase().includes(query.toLowerCase()) == true ?
			marker.setVisible(true) :
			marker.setVisible(false);
		});
		this.setState({filterLocations: filt, query});
	}
	

  render() {
    return (
		<div>
			<div className='options-box'>

				<input placeholder="filter content" value={this.state.query} onChange={(e) => {this.filterLocations(e.target.value)}}/>
				<br/>
				{
					this.state.filterLocations && this.state.filterLocations.length > 0 && this.state.filterLocations.map((location, index) => (
						<div key={index} className="sidebar-item" onClick={() => {this.listItemClick(location)}}> 
						{location.title}
						</div>
					))
				}
			</div>

			<div id="map">
        
			</div>
	 </div>
    );
  }
}

export default App;
