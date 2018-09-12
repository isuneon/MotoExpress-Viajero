import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController  } from 'ionic-angular';
import { RatesProvider } from '../../../providers/rates/rates';
import { TravelsProvider } from '../../../providers/travels/travels';
import { PrincipalProvider } from '../../../providers/principal';
import { DriversDetailsPage } from '../driversDetails/drivers-details';

declare var google;

@IonicPage()
@Component({
  selector: 'page-travel-details',
  templateUrl: 'travel-details.html',
})
export class TravelDetailsPage {

	data:any;

    // nuevo
    myLatLng: any;
    directionsService: any = null;
    directionsDisplay: any = null;
    distancias = [];
    // nuevo

	constructor(public navCtrl: NavController, 
				public navParams: NavParams, 
				public alertCtrl: AlertController,
                public _principalProvider: PrincipalProvider,
                public _ratesProvider: RatesProvider,
                public _travelsProvider: TravelsProvider,) {
		
        // nuevo
        this.directionsService = new google.maps.DirectionsService();
        this.directionsDisplay = new google.maps.DirectionsRenderer();
        this.myLatLng = {lat: 10.4996864, lng: -66.8737536};
        // nuevo

        this.obtenerTarifa()
        this.data = navParams.get("data");
    }

    ionViewDidLoad() {
		console.log('ionViewDidLoad TravelDetailsPage');
	}


	showPrompt() {
        const confirm = this.alertCtrl.create({
            title: 'Confirmación del viaje',
            message: '¿Está seguro de querer este viaje?',
            buttons: [{
                text: 'Cancelar',
                handler: () => {
                    console.log('Viaje cancelado');
                }
            },
            {
                text: 'Aceptar',
                handler: () => {
                    console.log('Viaje aceptado');
                    this.obtenerPosicionesConductores()
                }
            }]
        });
        confirm.present();
  	}


    obtenerTarifa(){
        let loader = this._principalProvider.loading('Obteniendo información del viaje');
        this._ratesProvider.obtenerTarifas().subscribe(res => {
            if(res['status'] == "200"){
                this.data['precio'] = res['data']
            }else{
                this._principalProvider.showAlert('Error', 'Ocurrió un error al intentar obtener la tarifa del viaje');
            }
            loader.dismiss();
        },
        error => {
            console.log(error)
        });
    }


    obtenerPosicionesConductores(){
        this._travelsProvider.obtenerPosiciones().subscribe(res => {
            if(res['status'] == "200"){
                this.calculateRoute(res['data'])
            }else{
                this._principalProvider.showAlert('Error', 'Ocurrió un error al intentar obtener las posicion es de los conductores');
            }
        },
        error => {
            console.log(error)
        });
    }

    calculateRoute(data){
        for(let x in data){
            let destino = {lat: data[x]['latitude'], lng: data[x]['longitude']}; 
            this.directionsService.route({
                origin: new google.maps.LatLng(this.myLatLng),
                destination: new google.maps.LatLng(destino.lat, destino.lng),
                optimizeWaypoints: true,
                travelMode: google.maps.TravelMode.DRIVING,
                avoidTolls: true
            }, (response, status)=> {
                if(status === google.maps.DirectionsStatus.OK) {
                    // this.distancias.push(response['routes'][0]['legs'][0]['distance']['text'])
                    // this.distancias.sort()
                    data[x]['distanciaKM'] = response['routes'][0]['legs'][0]['distance']['text']
                }else{
                  alert('Could not display directions due to: ' + status);
                }
            });  
        }
        this.navCtrl.push(DriversDetailsPage, {data: data})
    }


    // seleccionarViajero(distancia){
    //     for(let x in distancia){
    //         const confirm = this.alertCtrl.create({
    //             title: 'Conductor encontrado',
    //             message: '¿Está seguro de querer este viaje con el conductor:  , que se encuentra a: ' + distancia[x] + ' de distancia.',
    //             buttons: [{
    //                 text: 'Cancelar',
    //                 handler: () => {
    //                     console.log('Viaje cancelado');
    //                 }
    //             },
    //             {
    //                 text: 'Aceptar',
    //                 handler: () => {
    //                     console.log('Conductor aceptado');
    //                 }
    //             }]
    //         });
    //         confirm.present();
    //     }
    // }

}
