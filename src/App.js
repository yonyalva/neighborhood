import React, { Component } from 'react';
import './App.css';
import './responsive.css';
import {load_google_maps} from './components/script'

/*global google*/

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

					    this.map = new google.maps.Map(document.getElementById('map'), {
						center: {lat: 41.179226, lng: -73.189438},
						zoom: 13
					});

						this.locations = [
						{title: 'La Mexicana Restaurant & Bakery', id:0, location: {lat:  41.1727, lng: -73.210299}},
						{title: 'Mi Pueblo Restaurant & Bakery', id:1, location: {lat:  41.171315, lng: -73.206972}},
						{title: 'American Steak House', id:2, location: {lat:  41.201269, lng: -73.185896}},
						{title: 'Pantanal', id:3, location: {lat:  41.18697, lng: -73.198079}},
						{title: 'Terra Brasilis Restaurant', id:4, location: {lat:  41.188444, lng: -73.201293}}
					];

					this.infowindow = new google.maps.InfoWindow();
					var bounds = new google.maps.LatLngBounds();
					var markers = [];
	
		for (let i = 0; i < this.locations.length; i++) {
			let position = this.locations[i].location;
			let title = this.locations[i].title;
			let marker = new google.maps.Marker({
			map: this.map,
			position: position,
			title: title,
			icon: {url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png"},		
			animation: google.maps.Animation.DROP,
			id: i
		});
		
		marker.addListener('click', () => {
			if (marker.getAnimation() !== null) {marker.setAnimation(null);}
			else {marker.setAnimation(google.maps.Animation.BOUNCE);}
			setTimeout(() => {marker.setAnimation(null)}, 1500);
		});
		
		google.maps.event.addListener(marker, 'click', () => {
			this.infowindow.setContent(marker.title);
			this.map.setCenter(marker.position);
			this.infowindow.open(this.map, marker);
		});
			this.markers.push(marker);
			bounds.extend(marker.position);
			this.setState({filterLocations: this.locations});
		}
		})
	}
	
	

	listItemClick = (location) => {
	let marker = this.markers.filter(m => m.id === location.id)[0];
	if (marker.getAnimation() !== null) {marker.setAnimation(null);}
			else {marker.setAnimation(google.maps.Animation.BOUNCE);}
			setTimeout(() => {marker.setAnimation(null)}, 1500);
	this.infowindow.setContent(marker.title);
	this.map.setCenter(marker.position);
	this.infowindow.open(this.map, marker);
	}

	filterLocations(query) {
		let filt = this.locations.filter(location => location.title.toLowerCase().includes(query.toLowerCase()));
		this.markers.forEach(marker => {
			marker.title.toLowerCase().includes(query.toLowerCase()) == true ?
			marker.setVisible(true) :
			marker.setVisible(false);
		});
		this.infowindow.close();
		this.setState({filterLocations: filt, query});
	}
	

  render() {
    return (
		<div>
			
			<a id="menu" class="header__menu">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M2 6h20v3H2zm0 5h20v3H2zm0 5h20v3H2z" />
        </svg>
    </a>

			<div className='options-box'>
				<input placeholder="filter restaurants" value={this.state.query} onChange={(e) => {this.filterLocations(e.target.value)}}/>
				<br/>
				{
					this.state.filterLocations && this.state.filterLocations.length > 0 && this.state.filterLocations.map((location, index) => (
						<div key={index} className="sidebar-item"  onClick={() => {this.listItemClick(location)}}> 
						{location.title}
						</div>
					))
				}
			</div>

			<div id="map">
        
			</div>
			<div>
			<footer id="footer">
    Copyright (c) 2017 <a href="/"><strong>Restaurant Reviews</strong></a> All Rights Reserved.
     </footer>
			</div>

	 
	 </div>
    );
  }
}

export default App;
