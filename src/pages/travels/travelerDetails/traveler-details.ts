import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { PrincipalProvider } from '../../../providers/principal';
import { TravelsProvider } from '../../../providers/travels/travels';
import { TravelInfoPage } from '../travelInfo/travel-info';
import { ModalPage } from '../../modal/modal' ;

declare var google;


@IonicPage()
@Component({
  selector: 'page-traveler-details',
  templateUrl: 'traveler-details.html',
})
export class TravelerDetailsPage {

	dataViajero: any;
	poisitionConductor:any;
	directionsService: any = null;
	displayTime;
	timeInSeconds;
    runTimer;
    hasStarted;
    hasFinished;
    remainingTime;
    loaderViaje;

	constructor(public navCtrl: NavController,
				public navParams: NavParams,
                public modalCtrl: ModalController,
                public _travelsProvider: TravelsProvider,
				public _principalProvider: PrincipalProvider) {

		this.directionsService = new google.maps.DirectionsService();
		this.dataViajero = navParams.get("data");
		this.poisitionConductor = navParams.get("posicion");
		this.calculateRoute()
	}

	ionViewDidLoad() {
		
	}

	forzarInicioViaje(){
        this.cambiarEstatusConductor()
	}


	calculateRoute(){
        let destino = {lat: this.dataViajero['latitude'], lng: this.dataViajero['longitude']}; 
        this.directionsService.route({
            origin: new google.maps.LatLng(this.poisitionConductor),
            destination: new google.maps.LatLng(destino.lat, destino.lng),
            optimizeWaypoints: true,
            travelMode: google.maps.TravelMode.DRIVING,
            avoidTolls: true
        }, (response, status)=> {
            if(status === google.maps.DirectionsStatus.OK) {
                this.dataViajero['tiempoLlegada'] = response['routes'][0]['legs'][0]['duration']['value']
                this.dataViajero['distanciaKM'] = response['routes'][0]['legs'][0]['distance']['text']
                this.dataViajero['kmValue'] = response['routes'][0]['legs'][0]['distance']['value']
            }else{
              alert('Could not display directions due to: ' + status);
            }
        });
        // this.initTimer();
    }

    /*initTimer() {
        if (!this.timeInSeconds) { 
            this.timeInSeconds = this.dataViajero['tiempoLlegada']; 
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
                // this._principalProvider.showAlert('Aviso', 'El tiempo de llegada ya culminó, recuerda calificar al conductor');
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
    }*/

    /* ---------------------------------------------------------------------------------------------------------------------- */

    cambiarEstatusConductor(){
        this.loaderViaje = this._principalProvider.loading('Guardando información del viaje');
        this._travelsProvider.cambiarEstatusConductor(localStorage.getItem('id'), "en curso").subscribe(res => {
            if(res['status'] == "200"){
                this.cambiarEstatusViajero()
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


    cambiarEstatusViajero(){
        this._travelsProvider.cambiarEstatusViajero(this.dataViajero['id'], "en curso").subscribe(res => {
            if(res['status'] == "200"){
                this.guardarInfoViaje();
                localStorage.setItem("status", 'viaje en curso');
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

    guardarInfoViaje(){

        let datos = {
            nombreConductor: localStorage.getItem("user"),
            idConductor: localStorage.getItem("id"),
            nombreViajero: this.dataViajero['nombre'],
            idViajero: this.dataViajero['id'],
            origenText: "Prueba",
            destinoText: "Prueba",
            latitudDestino: this.dataViajero['latitude'],
            longitudDestino: this.dataViajero['longitude'],
            latitudOrigen: this.dataViajero['latitude'],
            longitudOrigen: this.dataViajero['longitude'],

            statusViaje: "en curso"
        }

        this._travelsProvider.guardarInfoViaje(datos).subscribe(res => {
            if(res['status'] == "200"){
                this.dataViajero['idViaje'] = res['data']['name']
                // this.actualizarViajesTomados()

                /*QUITAR ESTO*/
                this.dataViajero['destinoText'] = "Destino prueba"
                this.dataViajero['distancia'] = this.dataViajero['distanciaKM']
                this.dataViajero['precio'] = 500
                this.dataViajero['nombreConductor'] = localStorage.getItem('user')
                this.dataViajero['promedioConductor'] = parseInt(this.dataViajero['calificacion']) / parseInt(this.dataViajero['viajesTomados'])
                /*QUITAR ESTO*/

                this.navCtrl.setRoot(TravelInfoPage, {dataConductores: "", dataViaje: this.dataViajero})
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
            idConductor: this.dataViajero['id'],
            viajesTomados: this.dataViajero['viajesTomados'] + 1
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


    abrirModal(){
        let modal = this.modalCtrl.create(ModalPage, {data: this.dataViajero});
        modal.present();

        modal.onDidDismiss((data) =>{
            console.log(data)
        })
    }

}
