import { Component } from '@angular/core';
import { Nav, NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { UsersProvider } from '../../../providers/users/users';
import { PrincipalProvider } from '../../../providers/principal';
import { LoginPage } from '../../login/login';
import { User } from '../../../interface/user.interface';
import { AngularFireStorage } from 'angularfire2/storage';
import * as moment from 'moment';

@Component({
    selector: 'page-data-user',
    templateUrl: 'data-user.html',
})
export class DataUserPage {

    forma : FormGroup;
    dataUser: User;
    typeAcount: string = "";
    data: any;
    prueba: any;
    anio: string;
    
    constructor(public navCtrl: NavController, 
                public nav: Nav,
                public navParams: NavParams,
                public loadingCtrl: LoadingController,
                public alertCtrl: AlertController,
                public formBuilder: FormBuilder,
                public _usersProvider: UsersProvider,
                public _principalProvider: PrincipalProvider,
                public storage: AngularFireStorage) {

        // this.anio = new Date().getFullYear();
        this.anio = moment().format('YYYY')
        this.data = navParams.get("data");
        this.forma = this.formBuilder.group({
            type_acount: ['', Validators.required],
            marca: ['', Validators.compose([Validators.required, Validators.minLength(3)])],
            modelo: ['', Validators.compose([Validators.required, Validators.minLength(3)])],
            ano: ['', Validators.required],
            color: ['', Validators.compose([Validators.required, Validators.minLength(3)])],
            placa: ['', Validators.compose([Validators.required, Validators.minLength(3)])],

            picture: ['', Validators.required]
        });
    }

    setTypeAcount(tipo){
        this.typeAcount = tipo;
    }


    /*createUser(){
        console.log(this.forma.controls['picture']['value'])

        let nuevoUsuario = false;
        let pwdEncrypt = this._principalProvider.encryptByDES(this.data.controls['password1']['value'])
        let loader = this._principalProvider.loading('Registrando usuario');
        this._usersProvider.comprobarEmail(this.data.controls['email'].value).snapshotChanges().subscribe(actions => {
            if(actions.length > 0){
                let dataFormateada = this.formatData(this.forma, this.data, pwdEncrypt);
                this._usersProvider.agregar(dataFormateada);
                this._principalProvider.showAlert('Éxito', 'Usuario registrado exitosamente');
                this.nav.setRoot(LoginPage)
                nuevoUsuario = true;
            }else{
                if(nuevoUsuario == false){
                    this._principalProvider.showAlert('Error', 'Este correo ya se encuentra en uso. Intente con otro correo');
                }
            }
        });
        loader.dismiss();
    }*/


    uploadFile(event){
        let file = event.target.files[0];
        let filePath = 'images/' + file['name'];
        let task = this.storage.upload(filePath, file);
        console.log(task)
    }

/*----------------------------------------------------------------------------------------------------------------------------------------*/

    createUser(){
        let pwdEncrypt = this._principalProvider.encryptByDES(this.data.controls['password1']['value'])
        let loader = this._principalProvider.loading('Registrando usuario');
        this._usersProvider.comprobarEmail1(this.data.controls['email'].value).subscribe(res => {
            if(res['status'] == "404"){
                let dataFormateada = this.formatData(this.forma, this.data, pwdEncrypt);
                this._usersProvider.usuarioNuevo(dataFormateada).subscribe(response => {
                    if(response['status'] == "200"){
                        this._principalProvider.showAlert('Éxito', 'Usuario registrado exitosamente');
                        this.nav.setRoot(LoginPage)
                    }else{
                        this._principalProvider.showAlert('Error', 'Ocurrió un error al intentar registrar el usuario');
                    }
                });
            }else{
                this._principalProvider.showAlert('Error', 'Este correo ya se encuentra en uso. Intente con otro correo');
            }
            loader.dismiss();
        },
        error => {
            console.log(error)
        });
    }

    formatData(forma, info, pwd){
        this.dataUser = {
            nombre: info['controls']['first_name']['value'],
            apellido: info['controls']['last_name']['value'],
            documento_identidad: info['controls']['identification_document']['value'],
            genero: info['controls']['gender']['value'],
            fecha_nacimiento: info['controls']['birthdate']['value'],
            correo: info['controls']['email']['value'],
            password: pwd,
            type_acount: forma.controls['type_acount']['value'],
            autorizado: forma.controls['type_acount']['value'] == 'driver' ? false : true
        }

        if(forma.controls['type_acount']['value'] == 'driver'){
            this.dataUser.marca = forma['controls']['marca']['value']
            this.dataUser.modelo = forma['controls']['modelo']['value']
            this.dataUser.ano = forma['controls']['ano']['value']
            this.dataUser.color = forma['controls']['color']['value']
            this.dataUser.placa = forma['controls']['placa']['value'] 
        }
        
        return this.dataUser;
    } 

}
