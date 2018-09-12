import { Injectable } from '@angular/core';

@Injectable()
export class PreferStorage {

    server = "/proxy";
    // server = "https://webservicetaxiapp.appspot.com";

    constructor(){ }

    dict = {
        "servicioUsuarios": {
            "urlServicio":  this.server + "/users"
        },
        "servicioTarifas": {
            "urlServicio":  this.server + "/rates"
        },
        "servicioViajes": {
            "urlServicio":  this.server + "/drivers"
        }
    }

}
