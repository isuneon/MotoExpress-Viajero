import { Injectable } from '@angular/core';
import { RequestOptions, Headers, RequestMethod, URLSearchParams } from '@angular/http';
import { LoadingController, AlertController, ToastController  } from 'ionic-angular';
import * as CryptoJS from 'crypto-js';
import * as moment from 'moment';


@Injectable()
export class PrincipalProvider {

    key = 'isuneon123ServiceApp456';

	constructor(public loadingCtrl: LoadingController,
				public alertCtrl: AlertController,
                public toastCtrl: ToastController) {}

	loading(texto) {
        let loader = this.loadingCtrl.create({
            content: texto
        });
        loader.present();

        return loader;
    }

    showAlert(title, texto) {
        let alert = this.alertCtrl.create({
            title: title,
            subTitle: texto,
            buttons: ['OK']
        });
        alert.present();
    }

    loadingTemp(texto) {
        let loader = this.loadingCtrl.create({
            content: texto,
            duration: 1500
        });
        loader.present();
    }

    presentToast(texto, posicion, tiempo = 3000){
        const toast = this.toastCtrl.create({
            message: texto,
            duration: tiempo,
            position: posicion
        });
        toast.present();
    }

    encryptByDES(message) {

        let keyHex = CryptoJS.enc.Utf8.parse(this.key);
        let encrypted = CryptoJS.DES.encrypt(message, keyHex, {
            mode: CryptoJS.mode.ECB,
            padding: CryptoJS.pad.Pkcs7
        });

        return encrypted.toString();
    }

    decryptByDES(ciphertext) {

        let keyHex = CryptoJS.enc.Utf8.parse(this.key);
        let decrypted = CryptoJS.DES.decrypt({
            ciphertext: CryptoJS.enc.Base64.parse(ciphertext)
        }, keyHex, {
            mode: CryptoJS.mode.ECB,
            padding: CryptoJS.pad.Pkcs7
        });

        return decrypted.toString(CryptoJS.enc.Utf8);
    }

    getUser(){
        return localStorage.getItem("user");
    }

    getEmail(){
        return localStorage.getItem("email");
    }

    getRol(){
        return localStorage.getItem("type_acount");
    }

    generateCodeRandom(){
        return Math.floor((Math.random() * 100000000) + 1)
    }

    formatDate(fecha, formato){
        return moment(fecha).format(formato)
    }

    configurarCabeceraPost() {
        let headers = new Headers({'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'});
        let options = new RequestOptions({ method: RequestMethod.Post, headers: headers });
        return options
    }

    serializeParams(data){
        let params = new URLSearchParams();
        for(let key in data){
            params.set(key, data[key])
        }
        return params
    }
}
