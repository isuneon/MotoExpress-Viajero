import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { TravelsProvider } from '../../../providers/travels/travels';
import { PrincipalProvider } from '../../../providers/principal';
import { HomePage } from '../../home/home';
import * as moment from 'moment';


@IonicPage()
@Component({
  selector: 'page-travel-qualification',
  templateUrl: 'travel-qualification.html',
})
export class TravelQualificationPage {

    dataConductores:any;
    dataViajes: any;
    calificacion:string;
    anio: string;


    constructor(public navCtrl: NavController, 
                public navParams: NavParams,
                public _principalProvider: PrincipalProvider,
                public _travelsProvider: TravelsProvider) {

        this.anio = moment().format('YYYY')
        this.dataConductores = navParams.get("dataConductores");
        this.dataViajes = navParams.get("dataViajes");
        if(localStorage.getItem('type_acount') == 'driver'){
            this.dataViajes['nombreConductor'] = this.dataViajes['nombre']
        }
    }


    ionViewDidLoad() {
		
	}


    guardarCalificacion(){
        if(this.calificacion){
            let datos;
            /*nuevo, lo que va es el else*/
            if(localStorage.getItem('type_acount') == 'driver'){
                datos = {
                    calificacion: parseInt(this.calificacion) + parseInt(this.dataViajes['calificacion']),
                    idConductor: this.dataViajes['id']
                }
            }else{
                datos = {
                    calificacion: parseInt(this.calificacion) + parseInt(this.dataViajes['calificacionConductor']),
                    idConductor: this.dataViajes['idConductor']
                }
            }
            /*nuevo, lo que va es el else*/

            let loader = this._principalProvider.loading('Guardando calificación del viaje');
            this._travelsProvider.guardarCalificacionViaje(datos).subscribe(res => {
                if(res['status'] == "200"){
                    this._principalProvider.presentToast('Gracias por utilizar nuesta aplicación', 'middle', 3500);
                    setTimeout(() =>{
                        this.navCtrl.setRoot(HomePage)
                    },1000);
                }else{
                    this._principalProvider.showAlert('Error', 'Ocurrió un error intentando guardar la calificación del viaje');
                }
                loader.dismiss();
            },
            error => {
                console.log(error)
            }); 
        }else{
           this._principalProvider.showAlert('Error', 'Debe indicar una calificación mayor a 0 para el viaje'); 
        }
    }
}
