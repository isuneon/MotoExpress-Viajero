import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { PreferStorage } from '../../providers/preferStorage';
import { PrincipalProvider } from '../../providers/principal';


@Injectable()
export class TravelsProvider {


	constructor(private http:Http,
				public _preferStorage: PreferStorage,
				public _principalProvider: PrincipalProvider) {
  	}


    obtenerPosiciones(){
        return this.http.get(`${this._preferStorage.dict.servicioConductores.urlServicio}/positions`).map( res => {
            return res.json();
        })
    }


    cambiarEstatusConductor(idConductor, estatus){

    	let parametros = {
            idConductor: idConductor,
            estatus: estatus
        }

        let options = this._principalProvider.configurarCabeceraPost() //configuro la cabecera de la peticion post
        let params = this._principalProvider.serializeParams(parametros) // serializo los parametros

        return this.http.post(`${this._preferStorage.dict.servicioViajes.urlServicio}/estatusConductor`, params.toString(), options).map( res => {
            return res.json();
        })
    }


    cambiarEstatusViajero(idViajero, estatus){

    	let parametros = {
            idViajero: idViajero,
            estatus: estatus
        }

        let options = this._principalProvider.configurarCabeceraPost() //configuro la cabecera de la peticion post
        let params = this._principalProvider.serializeParams(parametros) // serializo los parametros

        return this.http.post(`${this._preferStorage.dict.servicioViajes.urlServicio}/estatusViajero`, params.toString(), options).map( res => {
            return res.json();
        })
    }


    guardarInfoViaje(datos){

        let options = this._principalProvider.configurarCabeceraPost() //configuro la cabecera de la peticion post
        let params = this._principalProvider.serializeParams(datos) // serializo los parametros

        return this.http.post(`${this._preferStorage.dict.servicioViajes.urlServicio}/travelInfo`, params.toString(), options).map( res => {
            return res.json();
        })
    }


    obtenerMensajesCancelacion(){
        return this.http.get(`${this._preferStorage.dict.servicioViajes.urlServicio}/mensajesCancelacion`).map( res => {
            return res.json();
        })
    }


    guardarCalificacionViaje(datos){

        let options = this._principalProvider.configurarCabeceraPost() //configuro la cabecera de la peticion post
        let params = this._principalProvider.serializeParams(datos) // serializo los parametros

        return this.http.post(`${this._preferStorage.dict.servicioViajes.urlServicio}/calificacion`, params.toString(), options).map( res => {
            return res.json();
        })
    }


    actualizarViajesTomados(datos){

        let options = this._principalProvider.configurarCabeceraPost() //configuro la cabecera de la peticion post
        let params = this._principalProvider.serializeParams(datos) // serializo los parametros

        return this.http.post(`${this._preferStorage.dict.servicioViajes.urlServicio}/viajesTomados`, params.toString(), options).map( res => {
            return res.json();
        })
    }

}
