import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { PreferStorage } from '../../providers/preferStorage';
import { PrincipalProvider } from '../../providers/principal';
// import { Http, RequestOptions, Headers, RequestMethod } from '@angular/http';
// import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
// import { Observable } from 'rxjs/Observable';


@Injectable()
export class UsersProvider {

	// dataUpdate;
	// password;
	// usersRef: AngularFireList<any>;
  	// users: Observable<any[]>;

	constructor(private http:Http,
				public _preferStorage: PreferStorage,
				// private afDB: AngularFireDatabase,
				public _principalProvider: PrincipalProvider) {

		// this.usersRef = this.afDB.list('/users'); 
		// this.users = this.usersRef.valueChanges();
  	}

  	/*agregar(info){
  		return this.usersRef.push(info);
  	}*/

    /*update(key, info){
        this.dataUpdate = {
            nombre: info['controls']['first_name']['value'],
            apellido: info['controls']['last_name']['value'],
            documento_identidad: info['controls']['identification_document']['value'],
            genero: info['controls']['gender']['value'],
            fecha_nacimiento: info['controls']['birthdate']['value'],
            correo: info['controls']['email']['value'],
            type_acount: info['controls']['type_acount']['value']        
        }

        return this.usersRef.update(key, this.dataUpdate)
    }*/
    
    // comprobarEmail(email){
    //     return this.afDB.list('/users', ref => ref.orderByChild('correo').equalTo(email)); 
    // }

  	/*changePassword(key, pwd){
  		this.password = {
  			password: pwd,
  		}
  		return this.usersRef.update(key, this.password)
  	}*/

/*-----------------------------------------------------------------------------------------------------------------------------------------*/

    iniciarSesion(data:any){

    	let parametros = {
            email: data['email'].value,
            password: data['password'].value
        }

        let options = this._principalProvider.configurarCabeceraPost() //configuro la cabecera de la peticion post
        let params = this._principalProvider.serializeParams(parametros) // serializo los parametros

        return this.http.post(`${this._preferStorage.dict.servicioUsuarios.urlServicio}/login`, params.toString(), options).map( res => {
            return res.json();
        })
    }


    comprobarEmail1(email){

    	let parametros = {
            email: email
        }

        let options = this._principalProvider.configurarCabeceraPost() //configuro la cabecera de la peticion post
        let params = this._principalProvider.serializeParams(parametros) // serializo los parametros

        return this.http.post(`${this._preferStorage.dict.servicioUsuarios.urlServicio}/validateUserAccount`, params.toString(), options).map( res => {
            return res.json();
        })
    } 


    usuarioNuevo(data:any){

    	let options = this._principalProvider.configurarCabeceraPost() //configuro la cabecera de la peticion post
        let params = this._principalProvider.serializeParams(data) // serializo los parametros

        return this.http.post(`${this._preferStorage.dict.servicioUsuarios.urlServicio}/create`, params.toString(), options).map( res => {
            return res.json();
        })
    }


    update(id, info){

        let parametros = {
            nombre: info['controls']['first_name']['value'],
            apellido: info['controls']['last_name']['value'],
            documento_identidad: info['controls']['identification_document']['value'],
            genero: info['controls']['gender']['value'],
            fecha_nacimiento: info['controls']['birthdate']['value'],
            correo: info['controls']['email']['value'],
            type_acount: info['controls']['type_acount']['value']        
        }

        let options = this._principalProvider.configurarCabeceraPost() //configuro la cabecera de la peticion post
        let params = this._principalProvider.serializeParams(parametros) // serializo los parametros

        return this.http.post(`${this._preferStorage.dict.servicioUsuarios.urlServicio}/${id}/update`, params.toString(), options).map( res => {
            return res.json();
        })
    }


    changePassword(id, pwdOld, pwdNew){

  		let parametros = {
            pwdNew: pwdNew,
			pwdOld: pwdOld         
        }

        let options = this._principalProvider.configurarCabeceraPost() //configuro la cabecera de la peticion post
        let params = this._principalProvider.serializeParams(parametros) // serializo los parametros

        return this.http.post(`${this._preferStorage.dict.servicioUsuarios.urlServicio}/${id}/cambiarContrasena`, params.toString(), options).map( res => {
            return res.json();
        })
  	}

}
