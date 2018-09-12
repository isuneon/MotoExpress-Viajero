import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { PreferStorage } from '../../providers/preferStorage';
import { PrincipalProvider } from '../../providers/principal';


@Injectable()
export class RatesProvider {


	constructor(private http:Http,
				public _preferStorage: PreferStorage,
				public _principalProvider: PrincipalProvider) {
  	}


    obtenerTarifas(){
        return this.http.get(`${this._preferStorage.dict.servicioTarifas.urlServicio}`).map( res => {
            return res.json();
        })
    }

}
