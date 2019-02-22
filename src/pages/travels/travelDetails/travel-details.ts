import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController  } from 'ionic-angular';
import { RatesProvider } from '../../../providers/rates/rates';
import { TravelsProvider } from '../../../providers/travels/travels';
import { PrincipalProvider } from '../../../providers/principal';
import { DriversDetailsPage } from '../driversDetails/drivers-details';
import * as moment from 'moment';
declare var google;

@IonicPage()
@Component({
  selector: 'page-travel-details',
  templateUrl: 'travel-details.html',
})
export class TravelDetailsPage {

	dataViaje:any;
    directionsService: any = null;
    directionsDisplay: any = null;
    kmAbarcar: number;
    loader;
    anio: string;

    constructor(public navCtrl: NavController, 
                public navParams: NavParams, 
                public alertCtrl: AlertController,
                public _principalProvider: PrincipalProvider,
                public _ratesProvider: RatesProvider,
                public _travelsProvider: TravelsProvider) {
        
        // this.anio = new Date().getFullYear();
        this.anio = moment().format('YYYY') 
        this.obtenerTarifa()

        this.obtenerKm()

        this.directionsService = new google.maps.DirectionsService();
        this.directionsDisplay = new google.maps.DirectionsRenderer();
        this.dataViaje = navParams.get("data");
    }

    ionViewDidLoad() {
		
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
                    this.obtenerPosicionesConductores()
                }
            }]
        });
        confirm.present();
  	}


    obtenerTarifa(){
        this.loader = this._principalProvider.loading('Obteniendo información del viaje');
        this._ratesProvider.obtenerTarifas().subscribe(res => {
            if(res['status'] == "200"){
                this.dataViaje['precio'] = res['data']
                this.obtenerKm()
            }else{
                this._principalProvider.showAlert('Error', 'Ocurrió un error al intentar obtener la tarifa del viaje');
            }
        },
        error => {
            console.log(error)
        });
    }


    obtenerKm(){
        this._ratesProvider.obtenerKm().subscribe(res => {
            if(res['status'] == "200"){
                this.kmAbarcar = res['data']
            }else{
                this._principalProvider.showAlert('Error', 'Ocurrió un error al intentar obtener la tarifa del viaje');
            }
            this.loader.dismiss();
        },
        error => {
            console.log(error)
        });
    }


    obtenerPosicionesConductores(){
        let loader = this._principalProvider.loading('Obteniendo posicion de los conductores');
        this._travelsProvider.obtenerPosiciones().subscribe(res => {
            if(res['status'] == "200"){
                this.calculateRoute(res['data'])
            }else{
                this._principalProvider.showAlert('Error', 'Ocurrió un error al intentar obtener las posicion es de los conductores');
            }
            loader.dismiss();
        },
        error => {
            console.log(error)
        });
    }


    calculateRoute(dataConductores){
        for(let x in dataConductores){
            let destino = {lat: dataConductores[x]['latitude'], lng: dataConductores[x]['longitude']}; 
            this.directionsService.route({
                origin: new google.maps.LatLng(this.dataViaje['origen']),
                destination: new google.maps.LatLng(destino.lat, destino.lng),
                optimizeWaypoints: true,
                travelMode: google.maps.TravelMode.DRIVING,
                avoidTolls: true
            }, (response, status)=> {
                if(status === google.maps.DirectionsStatus.OK) {
                    dataConductores[x]['distanciaKM'] = response['routes'][0]['legs'][0]['distance']['text']
                    dataConductores[x]['kmValue'] = response['routes'][0]['legs'][0]['distance']['value']
                }else{
                  alert('Could not display directions due to: ' + status);
                }
            });  
            dataConductores[x]['promedio'] = parseInt(dataConductores[x]['calificacion']) / parseInt(dataConductores[x]['viajesTomados'])
            dataConductores[x]['promedio'] = dataConductores[x]['promedio'] ? dataConductores[x]['promedio'] : 0
            dataConductores[x]['promedio'] = dataConductores[x]['promedio'] > 5.00 ? 5.00 : dataConductores[x]['promedio']
        }
        this.navCtrl.push(DriversDetailsPage, {data: dataConductores, dataViaje: this.dataViaje, kmAbarcar: this.kmAbarcar})
    }
}
