import { Component } from '@angular/core';
import { NavController, ActionSheetController  } from 'ionic-angular';
import { Geolocation, Geoposition } from '@ionic-native/geolocation';
import { TravelDetailsPage } from '../travels/travelDetails/travel-details';
import { PrincipalProvider } from '../../providers/principal';
import * as moment from 'moment';
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
  	anio: string;


	constructor(public navCtrl: NavController,
		        private geolocation: Geolocation,
		        public actionSheetCtrl: ActionSheetController,
		        public _principalProvider: PrincipalProvider) {

		this.anio = moment().format('YYYY')
    	this.directionsService = new google.maps.DirectionsService();
    	this.directionsDisplay = new google.maps.DirectionsRenderer();
    	this.bounds = new google.maps.LatLngBounds();
	}


	ionViewDidLoad(){
    	this.getPosition();
    	// obtener las coordenadas cada vez que estas cambien
    	/*let watch = this.geolocation.watchPosition();
		watch.subscribe((data) => {
	 		console.log(data)
		});*/
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
  	 	this.directionsDisplay.setOptions({ suppressMarkers: true });

		google.maps.event.addListenerOnce(this.map, 'idle', () => {
			new google.maps.Marker({
		  		position: this.myLatLng,
		  		map: this.map,
		  		title: 'Mi ubicación',
		  		// icon: "assets/imgs/iconomoto.svg"
			});
			mapEle.classList.add('show-map');
		});
	}


	searchPlace(){
		let input = document.getElementById('googlePlaces').getElementsByTagName('input')[0];
		this.map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

		let options = {
	  		// types: ['(regions)'],
	  		componentRestrictions: {country: this._principalProvider.getCountry()}
		};

		// let autocomplete = new google.maps.places.Autocomplete(input, {types: ['geocode']});
		let autocomplete = new google.maps.places.Autocomplete(input, options);
		google.maps.event.addListener(autocomplete, 'place_changed', () => {
			// retrieve the place object for your use
			let place = autocomplete.getPlace();
			let destino = {lat: place.geometry.location.lat(), lng: place.geometry.location.lng()};
			this.calculateRoute(destino);
		});
	}


	calculateRoute(destino){
		this.bounds.extend(destino);

		// Setear el icono para el punto de origen
		this.addMarker(this.myLatLng['lat'], this.myLatLng['lng'], "assets/imgs/iconoa.svg");

		// Setear el icono para el punto de llegada
		this.addMarker(destino.lat, destino.lng, "assets/imgs/iconob.svg");

		this.map.fitBounds(this.bounds);

		this.directionsService.route({
			origin: new google.maps.LatLng(this.myLatLng),
			destination: new google.maps.LatLng(destino.lat, destino.lng),
			optimizeWaypoints: true,
			travelMode: google.maps.TravelMode.DRIVING,
			avoidTolls: true
		}, (response, status)=> {
			if(status === google.maps.DirectionsStatus.OK) {
				this.directionsDisplay.setDirections(response);
				let distancia = response['routes'][0]['legs'][0]['distance']['text']
				let duracion = response['routes'][0]['legs'][0]['duration']['text']
				let tiempoLlegada = response['routes'][0]['legs'][0]['duration']['value']
				let origenText = response['routes'][0]['legs'][0]['start_address']
				let destinoText = response['routes'][0]['legs'][0]['end_address']
	      		setTimeout(() => {
		      		this.infoViaje(distancia, duracion, tiempoLlegada, origenText, destinoText, destino)
		        }, 1500);
		    }else{
		      alert('Could not display directions due to: ' + status);
		    }
		});  
	}


	infoViaje(distancia, duracion, tiempoLlegada, origenText, destinoText, destino){
		let info = {
			"distancia": distancia,
			"duracion": duracion,
			"tiempoLlegada": tiempoLlegada,
			"origenText": origenText,
			"destinoText": destinoText,
			"destino": destino,
			"origen": this.myLatLng
		}
		this.navCtrl.push(TravelDetailsPage, {data: info})
	}
	

	addMarker(lat, lng, icon){
		new google.maps.Marker({
			position: new google.maps.LatLng(lat, lng),
	      	icon: icon,
	      	map: this.map,
	    })
	}
}
