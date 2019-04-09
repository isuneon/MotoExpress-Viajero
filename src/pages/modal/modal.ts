import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { Geolocation, Geoposition } from '@ionic-native/geolocation'
declare var google;

@IonicPage()
@Component({
	selector: 'page-modal',
	templateUrl: 'modal.html',
})
export class ModalPage {

	map: any;
	data:any;
	myLatLng: any;
	bounds: any = null;
	start:any;
  	end:any;
  	waypoints: any[];
  	directionsService: any = null;
  	directionsDisplay: any = null;

	constructor(public navCtrl: NavController, 
				public navParams: NavParams,
				public viewCtrl: ViewController,
				private geolocation: Geolocation) {
		

		this.bounds = new google.maps.LatLngBounds();
		this.directionsService = new google.maps.DirectionsService();
    	this.directionsDisplay = new google.maps.DirectionsRenderer();
		this.data = navParams.get('data');
	}

	ionViewDidLoad() {
		this.getPosition();
	}


	cerrar(){
		let result = "Se cerro la modal del mapa";
		this.viewCtrl.dismiss({result: result});
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

		this.directionsDisplay.setMap(this.map);
	  	this.directionsDisplay.setPanel(panelEle);
  	 	this.directionsDisplay.setOptions({ suppressMarkers: true });

		google.maps.event.addListenerOnce(this.map, 'idle', () => {
			let marker = new google.maps.Marker({
		  		position: this.myLatLng,
			  	map: this.map,
			  	title: 'Hello World!'
			});
			mapEle.classList.add('show-map');
		});

		let destino = {lat: this.data['latitude'], lng: this.data['longitude']};
		this.calculateRoute(destino);
	}


	calculateRoute(destino){
		this.bounds.extend(destino);

		this.start  = new google.maps.Marker({
			position: new google.maps.LatLng(this.myLatLng),
		 	icon: "assets/imgs/iconoa.svg",
		 	map: this.map  
		 });

		this.end = new google.maps.Marker({
			position: new google.maps.LatLng(destino.lat, destino.lng),
			icon: "assets/imgs/iconob.svg",
		 	map: this.map 
		});

		// this.waypoints.forEach(waypoint => {
		// 	var point = new google.maps.LatLng(waypoint.location.lat, waypoint.location.lng);
		// 	this.bounds.extend(point);
		// });

		this.map.fitBounds(this.bounds);


		this.directionsService.route({
			origin: new google.maps.LatLng(this.myLatLng),
			// origin: this.start,
			destination: new google.maps.LatLng(destino.lat, destino.lng),
			// destination: this.end,
			// waypoints: this.waypoints,
			optimizeWaypoints: true,
			travelMode: google.maps.TravelMode.DRIVING,
			avoidTolls: true
		}, (response, status)=> {
			if(status === google.maps.DirectionsStatus.OK) {
		      this.directionsDisplay.setDirections(response);
		    }else{
		      alert('Could not display directions due to: ' + status);
		    }
		});  
	}


}