import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Geolocation, Geoposition } from '@ionic-native/geolocation';
import { TravelDetailsPage } from '../travels/travelDetails/travel-details';


declare var google;

@Component({
	selector: 'page-home',
	templateUrl: 'home.html'
})
export class HomePage {

	map: any;

	directionsService: any = null;
  	directionsDisplay: any = null;
  	bounds: any = null;
  	myLatLng: any;
  	waypoints: any[];


	markers: any[] = [
	{
	    position:{
	      latitude: 10.4989147,
	      longitude: -66.8334514,
	    },
	    title:'Casa'
	  },
	  {
	    position:{
	      latitude: 10.4936611,
	      longitude: -66.8261156,
	    },
	    title:'Experimental'
	  },
	  {
	    position:{
	      latitude: 10.4907889,
	      longitude: -66.8059144,
	    },
	    title:'Plan Suarez'
	  },
	  {
	    position:{
	      latitude: 10.4950298,
	      longitude: -66.801985,
	    },
	    title:'Makro'
	  },
	];




	constructor(public navCtrl: NavController,
		        private geolocation: Geolocation) {

    	this.directionsService = new google.maps.DirectionsService();
    	this.directionsDisplay = new google.maps.DirectionsRenderer();
    	this.bounds = new google.maps.LatLngBounds();

    	this.waypoints = [{
			location: { lat: 10.4989147, lng: -66.8334514 },
			stopover: true,
		}];

	}

	ionViewDidLoad(){
    	this.getPosition();
  	}


	getPosition():any{
		this.geolocation.getCurrentPosition().then(response => {
			this.loadMap(response);
		})
		.catch(error =>{
			console.log(error);
		})
	}

	loadMap(position: Geoposition){
		let latitude = position.coords.latitude;
		let longitude = position.coords.longitude;

		// create a new map by passing HTMLElement
		let mapEle: HTMLElement = document.getElementById('map');
		let panelEle: HTMLElement = document.getElementById('panel');

		// create LatLng object
		this.myLatLng = {lat: latitude, lng: longitude};

		// create map
		this.map = new google.maps.Map(mapEle, {
			center: this.myLatLng,
			zoom: 14
		});

		this.searchPlace();
	  	this.directionsDisplay.setMap(this.map);
	  	this.directionsDisplay.setPanel(panelEle);

		google.maps.event.addListenerOnce(this.map, 'idle', () => {
			new google.maps.Marker({
		  		position: this.myLatLng,
		  		map: this.map,
		  		title: 'Mi ubicación'
			});
			mapEle.classList.add('show-map');
		});


		this.markers.forEach(marker1=>{
	        this.addMarker(marker1);
		});
	}

	addMarker(options){
		new google.maps.Marker({
			position: {lat: options.position.latitude, lng: options.position.longitude},
	      	title: options.title,
	      	icon: "https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png",
	      	map: this.map,
	    })
	}

	searchPlace(){
		let input = document.getElementById('googlePlaces').getElementsByTagName('input')[0];
		this.map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
		let autocomplete = new google.maps.places.Autocomplete(input, {types: ['geocode']});
		google.maps.event.addListener(autocomplete, 'place_changed', () => {
			// retrieve the place object for your use
			let place = autocomplete.getPlace();
			let destino = {lat: place.geometry.location.lat(), lng: place.geometry.location.lng()};
			this.calculateRoute(destino);
		});
	}

	calculateRoute(destino){
		this.bounds.extend(destino);

		this.waypoints.forEach(waypoint => {
			var point = new google.maps.LatLng(waypoint.location.lat, waypoint.location.lng);
			this.bounds.extend(point);
		});

		this.map.fitBounds(this.bounds);


		this.directionsService.route({
			origin: new google.maps.LatLng(this.myLatLng),
			destination: new google.maps.LatLng(destino.lat, destino.lng),
			// waypoints: this.waypoints,
			optimizeWaypoints: true,
			travelMode: google.maps.TravelMode.DRIVING,
			avoidTolls: true
		}, (response, status)=> {
			if(status === google.maps.DirectionsStatus.OK) {
		      this.directionsDisplay.setDirections(response);
		      let distancia = response['routes'][0]['legs'][0]['distance']['text']
		      let duracion = response['routes'][0]['legs'][0]['duration']['text']
		      let origen = response['routes'][0]['legs'][0]['start_address']
		      let destino = response['routes'][0]['legs'][0]['end_address']
		      this.infoViaje(distancia, duracion, origen, destino)
		    }else{
		      alert('Could not display directions due to: ' + status);
		    }
		});  
	}

	infoViaje(distancia, duracion, origen, destino){
		let info = {
			"distancia": distancia,
			"duracion": duracion,
			"origen": origen,
			"destino": destino
		}

		this.navCtrl.push(TravelDetailsPage, {data: info})
	}
}
