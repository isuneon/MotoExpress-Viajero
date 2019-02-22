import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController  } from 'ionic-angular';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { CreateUserPage } from '../users/createUser/create-user';
import { RestorePasswordPage } from '../users/restorePassword/restore-password';
import { HomePage } from '../home/home';
import { UsersProvider } from '../../providers/users/users';
import { PrincipalProvider } from '../../providers/principal';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import * as moment from 'moment';


@IonicPage()
@Component({
    selector: 'page-login',
    templateUrl: 'login.html',
})
export class LoginPage {

    forma : FormGroup;
    anio: string;
    
    constructor(public navCtrl: NavController, 
                public navParams: NavParams,
                public loadingCtrl: LoadingController,
                public alertCtrl: AlertController,
                public formBuilder: FormBuilder,
                public _usersProvider: UsersProvider,
                public _principalProvider: PrincipalProvider,
                private afAuth: AngularFireAuth) {

        // this.anio = new Date().getFullYear();
        this.anio = moment().format('YYYY') 
        this.forma = this.formBuilder.group({
            email: ['', Validators.compose([Validators.required, Validators.pattern("[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$")])],
            password: ['', Validators.required],
        });
    }

    /*inicioSesion(){
        let loader = this._principalProvider.loading('Iniciando sesión');
        this._usersProvider.comprobarEmail(this.forma.controls['email'].value).snapshotChanges().subscribe(actions => {
            if(actions.length > 0){
                let data = actions[0]['payload'].val()
                let pwdEncrypt = this._principalProvider.encryptByDES(this.forma.controls['password']['value'])
                if(data['correo'] == this.forma.controls['email'].value && data['password'] == pwdEncrypt){
                       if(data['type_acount'] == 'driver' && data['autorizado'] == false){
                           this._principalProvider.showAlert('Error', 'Su cuenta aun no esta autorizada para utilizar la app');
                       }else{
                            localStorage.setItem("email", data['correo']);
                            localStorage.setItem("type_acount", data['type_acount']);
                            localStorage.setItem("user", data['nombre']);
                            localStorage.setItem("procedencia", 'correo');
                            this.navCtrl.setRoot(HomePage)
                       }
                }else{
                    this._principalProvider.showAlert('Error', 'Usuario o contraseña incorrectos.');
                }
            }else{
                this._principalProvider.showAlert('Error', 'Usuario o contraseña incorrectos.');
            }
            loader.dismiss();
        });
    }*/

   /* inicioSesionFacebook() {
        let loader = this._principalProvider.loading('Iniciando sesión con Facebook');
        this.afAuth.auth.signInWithPopup(new firebase.auth.FacebookAuthProvider()).then(res => {
            if(res['user']['email']){
                let proveedor = res['credential']['providerId'].split(".")[0];
                this.validarCuentaUsuario(res, loader, proveedor);
            }
        });
    }*/

    /*inicioSesionGoogle() {
        let loader = this._principalProvider.loading('Iniciando sesión con Google');
        this.afAuth.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider()).then(res => {
            if(res['user']['email']){
                let proveedor = res['credential']['providerId'].split(".")[0];
                this.validarCuentaUsuario(res, loader, proveedor);
            }
        });
    } */
    
    /*validarCuentaUsuario(info, loader, redSocial){
        this._usersProvider.comprobarEmail(info['user']['email']).snapshotChanges().subscribe(actions => {
            if(actions.length > 0){
                let data = actions[0]['payload'].val()
                localStorage.setItem("email", data['correo']);
                localStorage.setItem("type_acount", data['type_acount']);
                localStorage.setItem("user", data['nombre']);
                localStorage.setItem("procedencia", redSocial);
                this.navCtrl.setRoot(HomePage)
            }else{
                this.navCtrl.push(CreateUserPage, {data: info});
            }
            loader.dismiss();
        });
    }*/
   

/*---------------------------------------------------------------------------------------------------------------------------------------*/
    
    // ESTE ES EL QUE VA
    inicioSesion(){
        this.forma.controls['password'].setValue(this._principalProvider.encryptByDES(this.forma.controls['password']['value']));
        let loader = this._principalProvider.loading('Iniciando sesión');
        this._usersProvider.iniciarSesion(this.forma.controls).subscribe(res => {
            if(res['status'] == "200"){
                let data = res['data']
                if(data['type_acount'] == 'driver' && data['autorizado'] == "false"){
                   this._principalProvider.showAlert('Error', 'Su cuenta aun no esta autorizada para utilizar la app');
                }else{
                    localStorage.setItem("email", data['correo']);
                    localStorage.setItem("type_acount", data['type_acount']);
                    localStorage.setItem("user", data['nombre']);
                    localStorage.setItem("id", data['id']);
                    localStorage.setItem("procedencia", 'correo');
                    localStorage.setItem("status", 'disponible');
                    this.navCtrl.setRoot(HomePage)
                }
            }else{
                this._principalProvider.showAlert('Error', 'Usuario o contraseña incorrectos.');
            }
            loader.dismiss();
        },
        error => {
            console.log(error)
        });
    }


    // inicioSesion(){
    //     this.navCtrl.setRoot(TravelDetailsPage)
    // }


    nuevoUsuario(){
        this.navCtrl.push(CreateUserPage)
    }


    recuperarContrasena(){
        this.navCtrl.push(RestorePasswordPage)
    }


    inicioSesionFacebook() {
        let loader = this._principalProvider.loading('Iniciando sesión con Facebook');
        this.afAuth.auth.signInWithPopup(new firebase.auth.FacebookAuthProvider()).then(res => {
            if(res['user']['email']){
                let proveedor = res['credential']['providerId'].split(".")[0];
                this.validarCuentaUsuario(res, loader, proveedor);
            }
        });
    }


    inicioSesionGoogle() {
        let loader = this._principalProvider.loading('Iniciando sesión con Google');
        this.afAuth.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider()).then(res => {
            if(res['user']['email']){
                let proveedor = res['credential']['providerId'].split(".")[0];
                this.validarCuentaUsuario(res, loader, proveedor);
            }
        });
    } 


    validarCuentaUsuario(info, loader, redSocial){
        this._usersProvider.comprobarEmail1(info['user']['email']).subscribe(res => {
            if(res['status'] == "200"){
                localStorage.setItem("email", res['data']['correo']);
                localStorage.setItem("type_acount", res['data']['type_acount']);
                localStorage.setItem("user", res['data']['nombre']);
                localStorage.setItem("id", res['data']['id']);
                localStorage.setItem("procedencia", redSocial);
                localStorage.setItem("status", 'disponible');
                this.navCtrl.setRoot(HomePage)
            }else{
                this.navCtrl.push(CreateUserPage, {data: info});
            }

            
            loader.dismiss();
        });
    }

    // signOut() {
    //     this.afAuth.auth.signOut();
    // }


    // logout() {
    //     this.afAuth.auth.signOut();
    // }

}
