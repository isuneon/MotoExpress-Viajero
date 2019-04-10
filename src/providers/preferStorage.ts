import { Injectable } from '@angular/core';

@Injectable()
export class PreferStorage {

    // server = "/proxy";
    server = "https://cors-anywhere.herokuapp.com/https://wsappviajes.herokuapp.com";

    constructor(){ }

    dict = {
        "servicioUsuarios": {
            "urlServicio":  this.server + "/users"
        },
        "servicioTarifas": {
            "urlServicio":  this.server + "/rates"
        },
        "servicioConductores": {
            "urlServicio":  this.server + "/drivers"
        },
        "servicioViajes": {
            "urlServicio":  this.server + "/travels"
        }
    }

}
