import { Component } from '@angular/core';
import { ViewController, NavController, NavParams, AlertController } from 'ionic-angular';
import { PrincipalProvider } from '../../../providers/principal';
import { TravelsProvider } from '../../../providers/travels/travels';
import { TravelQualificationPage } from '../travelQualification/travel-qualification';


@Component({
	selector: 'popover-travel',
    templateUrl: 'popover-travel.html',
})
export class PopoverTravelPage {

    motivo:string;
    mensajes:any;
    dataConductores:any;
    dataViajes:any;
  
	constructor(public viewCtrl: ViewController,
				public navCtrl: NavController,
                public navParams: NavParams,
                public _principalProvider: PrincipalProvider,
                public _travelsProvider: TravelsProvider,
				public alertCtrl: AlertController) {

        this.mensajes = navParams.get("mensajes");
        this.dataConductores = navParams.get("dataConductores");
        this.dataViajes = navParams.get("dataViajes");
	}


	confirmarCancelacion(){
        if(this.motivo){
            const confirm = this.alertCtrl.create({
                title: 'Cancelación del viaje',
                message: '¿Está seguro de querer cancelar el viaje?',
                buttons: [{
                    text: 'Cancelar',
                    handler: () => {}
                },
                {
                    text: 'Aceptar',
                    handler: () => {
                        localStorage.setItem("status", "disponible")
                        this.cambiarEstatusConductor()
                        this.cambiarEstatusViajero()
                        this.navCtrl.push(TravelQualificationPage, {dataConductores: this.dataConductores, dataViajes:this.dataViajes})
                    }
                }]
            });
            confirm.present();
        }else{
            this._principalProvider.showAlert('Error', 'Para cancelar el viaje debe seleccionar un motivo');
        }
	}


    cambiarEstatusConductor(){
        this._travelsProvider.cambiarEstatusConductor(this.dataViajes['idConductor'], "disponible").subscribe(res => {
            if(res['status'] == "200"){
            }else{
                this._principalProvider.showAlert('Error', 'Ocurrió un error intentando actualizar el estatus del conductor');
            }
        },
        error => {
            console.log(error)
        }); 
    }


    cambiarEstatusViajero(){
        this._travelsProvider.cambiarEstatusViajero(localStorage.getItem("id"), "disponible").subscribe(res => {
            if(res['status'] == "200"){
            }else{
                this._principalProvider.showAlert('Error', 'Ocurrió un error intentando actualizar el estatus del viajero');
            }
        },
        error => {
            console.log(error)
        }); 
    }
}