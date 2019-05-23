import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, PopoverController  } from 'ionic-angular';
import { TravelsProvider } from '../../../providers/travels/travels';
import { PrincipalProvider } from '../../../providers/principal';
import { PopoverTravelPage } from '../popoverTravel/popover-travel';
import { TravelQualificationPage } from '../travelQualification/travel-qualification';
import * as moment from 'moment';


@IonicPage()
@Component({
  selector: 'page-travel-info',
  templateUrl: 'travel-info.html',
})
export class TravelInfoPage {

    timeInSeconds;
    runTimer;
    hasStarted;
    hasFinished;
    remainingTime;
    displayTime;
    dataConductores:any;
    dataViajes: any;
    mensajesCancelacion:any;
    anio: string;

    constructor(public navCtrl: NavController, 
                public navParams: NavParams,
                public popoverCtrl: PopoverController,
                public _principalProvider: PrincipalProvider,
                public _travelsProvider: TravelsProvider) {

        this.anio = moment().format('YYYY') 
        this.dataConductores = navParams.get("dataConductores");
        this.dataViajes = navParams.get("dataViaje");
        this.initTimer();
        this.obtenerMensajeCancelacion()
		
    }

    ionViewDidLoad() {
		
	}

    presentPopover(myEvent) {
        let popover = this.popoverCtrl.create(PopoverTravelPage, {mensajes: this.mensajesCancelacion, dataConductores: this.dataConductores, dataViajes: this.dataViajes});
        popover.present({
            ev: myEvent
        });
    }


    calificarViaje(){
        localStorage.setItem("status", "disponible")
        this.cambiarEstatusConductor()
        this.cambiarEstatusViajero()
        this.hasFinished = true;
        this.navCtrl.setRoot(TravelQualificationPage, {dataConductores: this.dataConductores, dataViajes:this.dataViajes})
    }


    initTimer() {
        if (!this.timeInSeconds) { 
            this.timeInSeconds = this.dataViajes['tiempoLlegada']; 
        }
  
        this.runTimer = false;
        this.hasStarted = false;
        this.hasFinished = false;
        this.remainingTime = this.timeInSeconds;  

        this.startTimer()
    }
  

    startTimer() {
        this.runTimer = true;
        this.hasStarted = true;
        this.timerTick();
    }
  
  
    timerTick() {
        setTimeout(() => {
            if (!this.runTimer){ 
                return
            }
            this.remainingTime--;
            this.displayTime = this.getSecondsAsDigitalClock(this.remainingTime);
            if (this.remainingTime > 0) {
                this.timerTick();
            }else{
                this._principalProvider.showAlert('Aviso', 'El tiempo de llegada ya culminó, recuerda calificar al conductor');
                this.hasFinished = true;
            }
        }, 1000);
    }
  

    getSecondsAsDigitalClock(inputSeconds: number) {
        var sec_num = parseInt(inputSeconds.toString(), 10); // don't forget the second param
        var hours = Math.floor(sec_num / 3600);
        var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
        var seconds = sec_num - (hours * 3600) - (minutes * 60);
        var hoursString = '';
        var minutesString = '';
        var secondsString = '';
        hoursString = (hours < 10) ? "0" + hours : hours.toString();
        minutesString = (minutes < 10) ? "0" + minutes : minutes.toString();
        secondsString = (seconds < 10) ? "0" + seconds : seconds.toString();
        
        return hoursString + ':' + minutesString + ':' + secondsString;
    }


    obtenerMensajeCancelacion(){
        this._travelsProvider.obtenerMensajesCancelacion().subscribe(res => {
            if(res['status'] == "200"){
                this.mensajesCancelacion = res['data']
            }else{
                this._principalProvider.showAlert('Error', 'Ocurrió un error intentando obtener los mensajes de cancelación del viaje');
            }
        },
        error => {
            console.log(error)
        }); 
    }


    cambiarEstatusConductor(){
        let id = "";
        localStorage.getItem('type_acount') == 'driver' ? id = localStorage.getItem("id") : id = this.dataViajes['idConductor']

        this._travelsProvider.cambiarEstatusConductor(id, "disponible").subscribe(res => {
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
        let id = "";
        localStorage.getItem('type_acount') == 'driver' ? id = this.dataViajes['id'] : id = localStorage.getItem("id")

        this._travelsProvider.cambiarEstatusViajero(id, "disponible").subscribe(res => {
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
