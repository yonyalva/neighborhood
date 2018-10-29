export function load_google_maps() {
	return new Promise(function(resolve, reject) {
		window.resolveGoogleMapsPromise = function () {
			resolve(window.google);
			delete window.resolveGoogleMapsPromise;
		}



		const script = document.createElement('script');
		script.src = 'https://maps.googleapis.com/maps/api/js?libraries=places&key=AIzaSyB4R5eI2fRWGwgFMsYpXhbG4jtKArcR_QY&callback=resolveGoogleMapsPromise';
		script.async = true;
		document.body.appendChild(script);

	});
}
