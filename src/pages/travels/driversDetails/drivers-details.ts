import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { PrincipalProvider } from '../../../providers/principal';
import { TravelsProvider } from '../../../providers/travels/travels';
import { TravelInfoPage } from '../travelInfo/travel-info';
import * as moment from 'moment';


@IonicPage()
@Component({
  selector: 'page-drivers-details',
  templateUrl: 'drivers-details.html',
})
export class DriversDetailsPage {

	dataConductores:any;
	dataViajes: any;
	idConductor:string;
	nombreConductor:string;
	loaderViaje:any;
	viajesTomados: number;
	anio: string;

	constructor(public navCtrl: NavController,
				public _principalProvider: PrincipalProvider,
				public _travelsProvider: TravelsProvider,
		  		public navParams: NavParams) {

		this.anio = moment().format('YYYY') 
		this.dataConductores = navParams.get("data");
		this.dataViajes = navParams.get("dataViaje");
	}


	ionViewDidLoad() {
		
	}


	confirmarViaje(dataConductor){
		this.dataViajes['idConductor'] = dataConductor['id']
		this.dataViajes['calificacionConductor'] = dataConductor['calificacion']
		this.dataViajes['telefono'] = dataConductor['telefono']
		this.dataViajes['nombreConductor'] = dataConductor['nombre']
		this.dataViajes['viajesTomados'] = parseInt(dataConductor['viajesTomados'])
		this.dataViajes['promedioConductor'] = dataConductor['promedio']
		let loader = this._principalProvider.loading('Consultando disponibilidad del conductor');
		if(localStorage.getItem("status") == 'disponible'){
			if(dataConductor['id'] == "-LJttffXaeTZsdkeNm3j"){
				this.cambiarEstatusConductor()
			}else{
				this._principalProvider.showAlert('Error', 'El conductor ha negado el viaje');
			}
		}else{
			this._principalProvider.showAlert('Error', 'Usted ya se encuentra en un viaje, no puede tomar otro hasta finalizar el actual');
		}
		loader.dismiss();
	}


	cambiarEstatusConductor(){
		this.loaderViaje = this._principalProvider.loading('Guardando información del viaje');
        this._travelsProvider.cambiarEstatusConductor(this.dataViajes['idConductor'], "en curso").subscribe(res => {
            if(res['status'] == "200"){
            	this.cambiarEstatusViajero()
            }else{
                this._principalProvider.showAlert('Error', 'Ocurrió un error intentando guardar el viaje');
                this.loaderViaje.dismiss();
            }
        },
        error => {
            console.log(error)
            this.loaderViaje.dismiss();
        });	
    }


    cambiarEstatusViajero(){
        this._travelsProvider.cambiarEstatusViajero(localStorage.getItem("id"), "en curso").subscribe(res => {
            if(res['status'] == "200"){
            	this.guardarInfoViaje();
            	localStorage.setItem("status", 'viaje en curso');
            }else{
                this._principalProvider.showAlert('Error', 'Ocurrió un error intentando guardar el viaje');
                this.loaderViaje.dismiss();
            }
        },
        error => {
            console.log(error)
            this.loaderViaje.dismiss();
        });	
    }


	guardarInfoViaje(){
		let datos = {
			nombreConductor: this.dataViajes['nombreConductor'],
			idConductor: this.dataViajes['idConductor'],
			nombreViajero:localStorage.getItem("user"),
			idViajero: localStorage.getItem("id"),
			origenText: this.dataViajes['origenText'],
			destinoText: this.dataViajes['destinoText'],
			latitudDestino: this.dataViajes['destino']['lat'],
			longitudDestino: this.dataViajes['destino']['lng'],
			latitudOrigen: this.dataViajes['origen']['lat'],
			longitudOrigen: this.dataViajes['origen']['lng'],
			statusViaje: "en curso"
		}

        this._travelsProvider.guardarInfoViaje(datos).subscribe(res => {
            if(res['status'] == "200"){
            	this.dataViajes['idViaje'] = res['data']['name']
            	this.actualizarViajesTomados()
				this.navCtrl.setRoot(TravelInfoPage, {dataConductores: this.dataConductores, dataViaje: this.dataViajes})
            }else{
                this._principalProvider.showAlert('Error', 'Ocurrió un error intentando guardar el viaje');
            }
            this.loaderViaje.dismiss();
        },
        error => {
            console.log(error)
            this.loaderViaje.dismiss();
        });	
	}


	actualizarViajesTomados(){
		let datos = {
			idConductor: this.dataViajes['idConductor'],
			viajesTomados: this.dataViajes['viajesTomados'] + 1
		}

		this._travelsProvider.actualizarViajesTomados(datos).subscribe(res => {
			if(res['status'] != "200"){
				this._principalProvider.showAlert('Error', 'Ocurrió un error intentando actualizar el viaje');
			}
        },
        error => {
            console.log(error)
        });	
	}

}
