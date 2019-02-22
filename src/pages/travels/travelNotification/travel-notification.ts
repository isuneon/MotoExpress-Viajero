import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { PrincipalProvider } from '../../../providers/principal';
import { TravelerDetailsPage } from '../travelerDetails/traveler-details';


@IonicPage()
@Component({
  selector: 'page-travel-notification',
  templateUrl: 'travel-notification.html',
})
export class TravelNotificationPage {

    myLatLng: any;
    viajeros: any[] = [
    {
        
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
       
    },
    {
        "latitude": 10.4907889,
        "longitude": -66.8059144,
        "apellido": "usuario prueba",
        "autorizado": "true",
        "correo": "usuario@hotmail.com",
        "documento_identidad": "12345678",
        "fecha_nacimiento": "2018-08-14",
        "genero": "M",
        "id": "-LK23amATFmeocObOP11",
        "nombre": "usuario prueba",
        "password": "y2ubsi0NI1H77EYpb5dQzw==",
        "status": "disponible",
        "type_acount": "traveler",
        "telefono": "04169876543",
        "calificacion": "3",
        "viajesTomados": "1"
    },
    {
        "latitude": 10.4950298,
        "longitude": -66.801985,
        "apellido": "González",
        "autorizado": "true",
        "correo": "j.pinero@ittl.com.ar",
        "documento_identidad": "15632587",
        "fecha_nacimiento": "1976-02-14",
        "genero": "M",
        "id": "-LRIq7mJxc0RmW5lJPIV",
        "nombre": "Darwin",
        "password": "y2ubsi0NI1H77EYpb5dQzw==",
        "type_acount": "traveler",
        "telefono": "04269876543",
        "calificacion": "9",
        "viajesTomados": "2"
    }
    ];

	constructor(public navCtrl: NavController, 
				public navParams: NavParams,
                private geolocation: Geolocation,
				public _principalProvider: PrincipalProvider) {

        this.getPosition()
        for(let x in this.viajeros){
            this.viajeros[x]['promedio'] = parseInt(this.viajeros[x]['calificacion']) / parseInt(this.viajeros[x]['viajesTomados'])
        }

		
    }

    ionViewDidLoad() {
		
	}

    aceptarViaje(dataViajero){
        this.navCtrl.setRoot(TravelerDetailsPage, {data: dataViajero, posicion: this.myLatLng})
    }

    rechazarViaje(){
        console.log("SE RECHAZO EL VIAJE")
    }

    getPosition():any{
        this.geolocation.getCurrentPosition().then(response => {
            this.myLatLng = {lat: response.coords.latitude, lng: response.coords.longitude};
        })
        .catch(error =>{
            console.log(error);
        })
    }

}
