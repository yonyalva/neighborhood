import React, { Component } from 'react';
import './App.css';
import './responsive.css';
import {load_google_maps, gm_authFailure} from './components/script';
import {locations} from './components/locations';

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
			 ]).then(values => {
				  	let google = values[0];
					this.google = google;
					this.markers = [];
					    this.map = new google.maps.Map(document.getElementById('map'), {
						center: {lat: 41.179226, lng: -73.189438},
						zoom: 13
					});
					// restaurant list from /components/locations.js
					this.locations = locations;

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
			}).then(response => {
				if (response.ok) {
					return response.json();
				  } else {
					throw new Error();
				  }})
			.then((data) => {
				var firstImage = data.results[0].urls.small;
				this.infowindow.setContent("<div style='float:left'><img src=" + firstImage + " alt="+ marker.photo + "></div><div style='float:right; padding-left: 10px;'><b>" + marker.title + "</b><br/>" + marker.street + "<br/>" + marker.city + "</div>");
			}).catch((error) => {
				let firstImage = 'unsplash.jpg';
				this.infowindow.setContent("<div style='float:left'><img src=" + firstImage + " alt="+ marker.photo + "></div><div style='float:right; padding-left: 10px;'><b>" + marker.title + "</b><br/>" + marker.street + "<br/>" + marker.city + "</div>");
			  });
			// end of unsplush api
			// end of marker click
			this.map.setCenter(marker.position);
			this.infowindow.open(this.map, marker);
		});
			this.markers.push(marker);
			bounds.extend(marker.position);
			this.setState({filterLocations: this.locations});
		}
		}).catch((error) => {
			alert('hi there');
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
	})
	.then(response => {
		if (response.ok) {
			return response.json();
		  } else {
			throw new Error();
		  }})
	.then((data) => {
		let firstImage = data.results[0].urls.small;
		this.infowindow.setContent("<div style='float:left'><img src=" + firstImage + " alt="+ marker.photo + "></div><div style='float:right; padding-left: 10px;'><b>" + marker.title + "</b><br/>" + marker.street + "<br/>" + marker.city + "</div>");
	}).catch((error) => {
		let firstImage = 'unsplash.jpg';
		this.infowindow.setContent("<div style='float:left'><img src=" + firstImage + " alt="+ marker.photo + "></div><div style='float:right; padding-left: 10px;'><b>" + marker.title + "</b><br/>" + marker.street + "<br/>" + marker.city + "</div>");
	  });
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
				<input role="search" aria-label="search for restaurants" tabIndex="3" placeholder="filter restaurants" value={this.state.query} onChange={(e) => {this.filterLocations(e.target.value)}}/>
				<br/>
				{
					this.state.filterLocations && this.state.filterLocations.length > 0 && this.state.filterLocations.map((location, index) => (
						<div role="listitem" tabIndex={index + 4} key={index} className="sidebar-item"  onKeyPress={event => {if (event.key === "Enter") {this.listItemClick(location)}}} onClick={() => {this.listItemClick(location)}}> 
						{location.title} 
						</div>
					))
				}
			</div>

			<div id="map" role="application" aria-label="Map with restaurant markers">
        
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
