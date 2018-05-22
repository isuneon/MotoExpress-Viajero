import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';


@Injectable()
export class UsersProvider {

	dataUpdate;
	password;
	usersRef: AngularFireList<any>;
  	users: Observable<any[]>;

	constructor(private afDB: AngularFireDatabase) {
		this.usersRef = this.afDB.list('/users'); 
		this.users = this.usersRef.valueChanges();
  	}

  	agregar(info){
  		return this.usersRef.push(info);
  	}

    update(key, info){
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
    }
    
    comprobarEmail(email){
        return this.afDB.list('/users', ref => ref.orderByChild('correo').equalTo(email)); 
    }

  	changePassword(key, pwd){
  		this.password = {
  			password: pwd,
  		}
  		return this.usersRef.update(key, this.password)
  	}

}
