import { Component } from '@angular/core';
import { NavController, ActionSheetController  } from 'ionic-angular';
import { Geolocation, Geoposition } from '@ionic-native/geolocation';
import { TravelDetailsPage } from '../travels/travelDetails/travel-details';
import { PrincipalProvider } from '../../providers/principal';
import { TravelerDetailsPage } from '../travels/travelerDetails/traveler-details';
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
  	start:any;
  	end:any;

  	tipoCuenta: string = "";
  	estatus: string = "";

  	viajeros = {
        "latitude": 10.4936611,
        "longitude": -66.8261156,
        "apellido": "Gonzalez Fermin",
        "autorizado": "true",
        "correo": "billyrogers07@gmail.com",
        "documento_identidad": "21134094",
        "fecha_nacimiento": "2018-08-16",
        "genero": "M",
        "id": "-LK1xQAXsNfigb-n47XT",
        "nombre": "Billy Rogers",
        "password": "y2ubsi0NI1H77EYpb5dQzw==",
        "status": "disponible",
        "type_acount": "traveler",
        "telefono": "04249876543",
        "calificacion": "50",
        "viajesTomados": "10"
    };

	/*markers: any[] = [{
	    position:{
	      latitude: 10.4989147,
	      longitude: -66.8334514,
	    },
	    title:'Casa',
	    icon: "assets/imgs/iconoa.svg"
	  },
	  {
	    position:{
	      latitude: 10.4936611,
	      longitude: -66.8261156,
	    },
	    title:'Experimental',
	    icon: "assets/imgs/iconoa.svg"
	  },
	  {
	    position:{
	      latitude: 10.4907889,
	      longitude: -66.8059144,
	    },
	    title:'Plan Suarez',
	    icon: "assets/imgs/iconob.svg"
	  },
	  {
	    position:{
	      latitude: 10.4950298,
	      longitude: -66.801985,
	    },
	    title:'Makro',
	    icon: "assets/imgs/iconob.svg"
	  },
	];*/


	constructor(public navCtrl: NavController,
		        private geolocation: Geolocation,
		        public actionSheetCtrl: ActionSheetController,
		        public _principalProvider: PrincipalProvider) {

		this.tipoCuenta = localStorage.getItem("type_acount")
		this.estatus = localStorage.getItem("status")

		this.anio = moment().format('YYYY')
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
    	if(this.estatus == 'no disponible'){
    		this._principalProvider.showAlert("Aviso", "Te encuentras desconectado. Conectate presionando el boton en la esquina inferior izquierda")
    	}
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


		/*this.markers.forEach(marker1=>{
	        this.addMarker(marker1);
		});*/
	}

	addMarker(options){
		new google.maps.Marker({
			position: {lat: options.position.latitude, lng: options.position.longitude},
	      	title: options.title,
	      	icon: options.icon,
	      	map: this.map,
	    })
	}

	searchPlace(){
		let input = document.getElementById('googlePlaces').getElementsByTagName('input')[0];
		this.map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

		let options = {
	  		// types: ['(regions)'],
	  		componentRestrictions: {country: 'VE'}
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

		this.waypoints.forEach(waypoint => {
			var point = new google.maps.LatLng(waypoint.location.lat, waypoint.location.lng);
			this.bounds.extend(point);
		});

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
		      let distancia = response['routes'][0]['legs'][0]['distance']['text']
		      let duracion = response['routes'][0]['legs'][0]['duration']['text']
		      let tiempoLlegada = response['routes'][0]['legs'][0]['duration']['value']
		      let origenText = response['routes'][0]['legs'][0]['start_address']
		      let destinoText = response['routes'][0]['legs'][0]['end_address']
		      this.infoViaje(distancia, duracion, tiempoLlegada, origenText, destinoText, destino)
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


	iniciarViajes(){
		this._principalProvider.loadingTemp("Conectandote...")
		setTimeout(() => {
            this.presentActionSheet()
        }, 2000);
		localStorage.setItem("status", 'disponible');
	}


	presentActionSheet() {
	    const actionSheet = this.actionSheetCtrl.create({
      		title: 'Nueva solicitud de viaje',
      		subTitle: 'Calificación del viajero: '+ (parseInt(this.viajeros['calificacion']) / parseInt(this.viajeros['viajesTomados'])).toFixed(2) + ' ★',
      		cssClass: 'action-sheets-basic-page',
      		buttons: [
      			{
	          		text: 'Aceptar',
	          		role: 'destructive',
	          		icon: 'checkmark',
	          		handler: () => {
	          			this._principalProvider.loadingTemp("Cargando información del viaje...")
	          			this.viajeros['promedio'] = parseInt(this.viajeros['calificacion']) / parseInt(this.viajeros['viajesTomados']);
	            		this.navCtrl.setRoot(TravelerDetailsPage, {data: this.viajeros, posicion: this.myLatLng})
	          		}
	        	},{
	          		text: 'Rechazar',
	          		cssClass: 'button-cancel',
	          		icon: 'close',
	          		handler: () => {
	            		this._principalProvider.showAlert('Aviso', 'Viaje rechazado')
	          		}
	        	}
	      	]
	    });
	    actionSheet.present();
	}


	cancelarViajes(){
        this._principalProvider.loadingTemp("Desconectandote...")
        localStorage.setItem("status", "no disponible");
    }
}
