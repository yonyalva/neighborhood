import React, { Component } from 'react';
import './App.css';
import './responsive.css';
import {load_google_maps, gm_authFailure} from './components/script'

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
					this.google = google;
				    this.markers = [];

					    this.map = new google.maps.Map(document.getElementById('map'), {
						center: {lat: 41.179226, lng: -73.189438},
						zoom: 13
					});
						// restaurant list
						this.locations = [
						{title: 'La Mexicana Restaurant & Bakery', id:0, location: {lat:  41.1727, lng: -73.210299}, photo: 'mexico', street: '1407 Fairfield Ave', city: 'Bridgeport, CT 06605'},
						{title: 'Mi Pueblo Restaurant & Bakery', id:1, location: {lat:  41.171315, lng: -73.206972}, photo: 'colombia', street: '1222 State St', city: 'Bridgeport, CT 06605'},
						{title: 'American Steak House', id:2, location: {lat:  41.201269, lng: -73.185896}, photo: 'USA', street: '210 Boston Ave', city: 'Bridgeport, CT 06610'},
						{title: 'Pantanal', id:3, location: {lat:  41.18697, lng: -73.198079}, photo: 'brazil', street: '215 Frank St', city: 'Bridgeport, CT 06604'},
						{title: 'Terra Brasilis Restaurant', id:4, location: {lat:  41.188444, lng: -73.201293}, photo: 'brazil', street: '1282 North Ave', city: 'Bridgeport, CT 06604'}
					];

				this.infowindow = new google.maps.InfoWindow();
					const bounds = new google.maps.LatLngBounds();
					//fetch link for unplash api
					this.foto = 'https://api.unsplash.com/search/photos?page=1&query=';
	
		for (let i = 0; i < this.locations.length; i++) {
			let position = this.locations[i].location;
			let title = this.locations[i].title;
			let photo = this.locations[i].photo;
			let street = this.locations[i].street;
			let city = this.locations[i].city;
			let marker = new google.maps.Marker({
			map: this.map,
			position: position,
			title: title,
			photo: photo,
			street: street,
			city: city,
			icon: {url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png"},		
			animation: google.maps.Animation.DROP,
			id: i
		});
		
		marker.addListener('click', () => {
			if (marker.getAnimation() !== null) {marker.setAnimation(null);}
			else {marker.setAnimation(google.maps.Animation.BOUNCE);}
			setTimeout(() => {marker.setAnimation(null)}, 1500);
		});
		
		// marker click
		google.maps.event.addListener(marker, 'click', () => {
			// unsplush api
			fetch(this.foto + marker.photo, {
				headers: {
					Authorization: 'Client-ID 51ad43d66995eda4105dc52c08c9031cb3c5c6f22ef58de8d709c2c10871b3e4'
				}
			}).then(response => response.json())
			.then((data) => {
				const firstImage = data.results[0];
				this.infowindow.setContent("<div style='float:left'><img src=" + firstImage.urls.small + " alt=" + marker.photo + "></div><div style='float:right; padding-left: 10px;'><b>" + marker.title + "</b><br/>" + marker.street + "<br/>" + marker.city + "</div>");
			})
			// end of unsplush api
			// end of marker click
			this.map.setCenter(marker.position);
			this.infowindow.open(this.map, marker);
		});
			this.markers.push(marker);
			bounds.extend(marker.position);
			this.setState({filterLocations: this.locations});
		}
		})
	}
	
	
	//list item click
	listItemClick = (location) => {
	let marker = this.markers.filter(m => m.id === location.id)[0];
	if (marker.getAnimation() !== null) {marker.setAnimation(null);}
			else {marker.setAnimation(google.maps.Animation.BOUNCE);}
			setTimeout(() => {marker.setAnimation(null)}, 1500);
	// unsplush api
	fetch(this.foto + marker.photo, {
		headers: {
			Authorization: 'Client-ID 51ad43d66995eda4105dc52c08c9031cb3c5c6f22ef58de8d709c2c10871b3e4'
		}
	}).then(response => response.json())
	.then((data) => {
		// var firstImage = data.reults[0] != undefined ? data.results[0] :'not definito';
		if (data !== "undefined") {
			// let firstImage = 'img/unsplash.jpg';
			// console.log(firstImage);
			this.infowindow.setContent("<div style='float:left'><img src='unsplash.jpg' alt='no image'></div></div><div style='float:right; padding-left: 10px;'><b>" + marker.title + "</b><br/>" + marker.street + "<br/>" + marker.city + "</div>");
		}
			// var firstImage = data.reults[0];
			// this.infowindow.setContent("<div style='float:left'><img src=" + firstImage.urls.small + " alt="+ marker.photo + "></div><div style='float:right; padding-left: 10px;'><b>" + marker.title + "</b><br/>" + marker.street + "<br/>" + marker.city + "</div>");
		  

		// var firstImage;
		// firstImage = (data.reults[0] != undefined) ? data.reults[0] : 'none';
			// var firstImage = data.reults[0];
		//	this.infowindow.setContent("<div style='float:left'><img src=" + firstImage.urls.small + " alt="+ marker.photo + "></div><div style='float:right; padding-left: 10px;'><b>" + marker.title + "</b><br/>" + marker.street + "<br/>" + marker.city + "</div>");
		// firstImage = data.results[0] != undefined ? firstImage :'not definito';
		// this.infowindow.setContent("<div style='float:left'><img src=" + firstImage.urls.small + " alt="+ marker.photo + "></div><div style='float:right; padding-left: 10px;'><b>" + marker.title + "</b><br/>" + marker.street + "<br/>" + marker.city + "</div>");
	})
	// end of unsplush api
	this.map.setCenter(marker.position);
	this.infowindow.open(this.map, marker);
	}

	//filter restaurants function
	filterLocations(query) {
		let filt = this.locations.filter(location => location.title.toLowerCase().includes(query.toLowerCase()));
		this.markers.forEach(marker => {
			marker.title.toLowerCase().includes(query.toLowerCase()) === true ?
			marker.setVisible(true) :
			marker.setVisible(false);
		});
		this.infowindow.close();
		this.setState({filterLocations: filt, query});
	}

  render() {
    return (
		<div>
					
			<div className='options-box'>
				<input tabIndex="3" placeholder="filter restaurants" value={this.state.query} onChange={(e) => {this.filterLocations(e.target.value)}}/>
				<br/>
				{
					this.state.filterLocations && this.state.filterLocations.length > 0 && this.state.filterLocations.map((location, index) => (
						<div role="listitem" tabIndex={index + 4} key={index} className="sidebar-item"  onKeyPress={event => {if (event.key === "Enter") {this.listItemClick(location)}}} onClick={() => {this.listItemClick(location)}}> 
						{location.title} 
						</div>
					))
				}
			</div>

			<div id="map">
        
			</div>
			<div>
			<footer id="footer">
    			Maps by <strong>Google</strong>. Images by <strong>unsplash</strong>
     		</footer>
			</div>

	 
	 </div>
    );
  }
}

export default App;
