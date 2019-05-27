import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController  } from 'ionic-angular';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { CreateUserPage } from '../users/createUser/create-user';
import { RestorePasswordPage } from '../users/restorePassword/restore-password';
import { HomePage } from '../home/home';
import { UsersProvider } from '../../providers/users/users';
import { TravelsProvider } from '../../providers/travels/travels';
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
    pais:string;
    
    
    constructor(public navCtrl: NavController, 
                public navParams: NavParams,
                public loadingCtrl: LoadingController,
                public alertCtrl: AlertController,
                public formBuilder: FormBuilder,
                public _usersProvider: UsersProvider,
                public _principalProvider: PrincipalProvider,
                private afAuth: AngularFireAuth,
                public _travelsProvider: TravelsProvider) {

        this.anio = moment().format('YYYY') 
        this.forma = this.formBuilder.group({
            email: ['', Validators.compose([Validators.required, Validators.pattern("[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$")])],
            password: ['', Validators.required],
        });

        this.obtenerPais();
    }


    inicioSesion(){
        this.forma.controls['password'].setValue(this._principalProvider.encryptByDES(this.forma.controls['password']['value']));
        let loader = this._principalProvider.loading('Iniciando sesión');
        this._usersProvider.iniciarSesion(this.forma.controls).subscribe(res => {
            if(res['status'] == "200"){
                let data = res['data']
                if(data['type_acount'] == 'driver'){
                    this._principalProvider.showAlert('Error', 'Su cuenta no está autorizada para utilizar la app de viajeros');
                }else{
                    if(data['type_acount'] == 'driver' && data['autorizado'] == "false"){
                       this._principalProvider.showAlert('Error', 'Su cuenta aun no esta autorizada para utilizar la app. Por favor contacte un administrador');
                    }else{
                        localStorage.setItem("email", data['correo']);
                        localStorage.setItem("type_acount", data['type_acount']);
                        localStorage.setItem("user", data['nombre']);
                        localStorage.setItem("id", data['id']);
                        localStorage.setItem("procedencia", 'correo');
                        data['type_acount'] == 'driver' ? localStorage.setItem("status", 'no disponible') : localStorage.setItem("status", 'disponible');     
                        localStorage.setItem("country", this.pais);
                        this.navCtrl.setRoot(HomePage)
                    }
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
            }else{
               this._principalProvider.showAlert('Error', 'Usuario o contraseña incorrectos.'); 
            }
        });
    }


    inicioSesionGoogle() {
        let loader = this._principalProvider.loading('Iniciando sesión con Google');
        this.afAuth.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider()).then(res => {
            if(res['user']['email']){
                let proveedor = res['credential']['providerId'].split(".")[0];
                this.validarCuentaUsuario(res, loader, proveedor);
            }else{
               this._principalProvider.showAlert('Error', 'Usuario o contraseña incorrectos.'); 
            }
        });
    } 


    validarCuentaUsuario(info, loader, redSocial){
        this._usersProvider.comprobarEmail1(info['user']['email']).subscribe(res => {
            if(res['status'] == "200"){
                if(res['data']['type_acount'] == 'driver'){
                    this._principalProvider.showAlert('Error', 'Su cuenta no está autorizada para utilizar la app de viajeros');
                }else{
                    localStorage.setItem("email", res['data']['correo']);
                    localStorage.setItem("type_acount", res['data']['type_acount']);
                    localStorage.setItem("user", res['data']['nombre']);
                    localStorage.setItem("id", res['data']['id']);
                    localStorage.setItem("procedencia", redSocial);
                    localStorage.setItem("status", 'disponible');
                    localStorage.setItem("country", this.pais);
                    this.navCtrl.setRoot(HomePage)
                }
            }else{
                this.navCtrl.push(CreateUserPage, {data: info});
            }
            loader.dismiss();
        });
    }


    obtenerPais(){
        this._travelsProvider.obtenerPais().subscribe(res => {
            if(res['status'] == "200"){
               this.pais = res['data']
            }else{
                this._principalProvider.showAlert('Error', 'Ocurrió un error al intentar obtener la tarifa del viaje');
            }
        },
        error => {
            console.log(error)
        });    
    }
}
