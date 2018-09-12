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
        return this.http.get(`${this._preferStorage.dict.servicioViajes.urlServicio}/positions`).map( res => {
            return res.json();
        })
    }

}
