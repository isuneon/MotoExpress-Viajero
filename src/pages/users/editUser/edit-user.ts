import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, AlertController, PopoverController } from 'ionic-angular';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { UsersProvider } from '../../../providers/users/users';
import { PrincipalProvider } from '../../../providers/principal';
import { PopoverPage } from '../popover/popover';
import * as moment from 'moment';


@Component({
    selector: 'page-edit-user',
    templateUrl: 'edit-user.html',
})
export class EditUserPage {

    forma : FormGroup;
    key: string = "";
    now:string = "";
    anio: string;

    constructor(public navCtrl: NavController, 
                public navParams: NavParams,
                public loadingCtrl: LoadingController,
                public alertCtrl: AlertController,
                public popoverCtrl: PopoverController,
                public formBuilder: FormBuilder,
                public _usersProvider: UsersProvider,
                public _principalProvider: PrincipalProvider) {

        // this.anio = new Date().getFullYear();
        this.anio = moment().format('YYYY')
        this.forma = this.formBuilder.group({
            first_name: ['', Validators.compose([Validators.required, Validators.minLength(3)])],
            last_name: ['', Validators.compose([Validators.required, Validators.minLength(3)])],
            identification_document: ['', Validators.compose([Validators.required, Validators.minLength(7)])],
            gender: ['', Validators.required],
            birthdate: ['', Validators.required],
            email: ['', Validators.compose([Validators.required, Validators.pattern("[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$")])],
            type_acount: ['', Validators.required]
        });

        this.now = moment().format('YYYY-MM-DD')

        this.getUser();
    }

    /*getUser(){
        let loader = this._principalProvider.loading('Consultando usuario');
        this._usersProvider.comprobarEmail(localStorage.getItem("email")).snapshotChanges().subscribe(actions => {
            if(actions.length > 0){
                this.key = actions[0]['key']
                this.forma.controls['first_name'].setValue(actions[0]['payload'].val()['nombre']);
                this.forma.controls['last_name'].setValue(actions[0]['payload'].val()['apellido']);
                this.forma.controls['identification_document'].setValue(actions[0]['payload'].val()['documento_identidad']);
                this.forma.controls['gender'].setValue(actions[0]['payload'].val()['genero']);
                this.forma.controls['birthdate'].setValue(actions[0]['payload'].val()['fecha_nacimiento']);
                this.forma.controls['email'].setValue(actions[0]['payload'].val()['correo']);
                this.forma.controls['type_acount'].setValue(actions[0]['payload'].val()['type_acount']);
            }else{
                this._principalProvider.showAlert('Error', 'Ocurrió un error al intentar consultar la información del usuario')
            }
            loader.dismiss();
        });
    }*/

    /*updateUser(){
        this._principalProvider.loadingTemp('Actualizando...');
        this._usersProvider.update(this.key, this.forma);
        localStorage.setItem("type_acount", this.forma.controls['type_acount']['value']);
    }*/

/*----------------------------------------------------------------------------------------------------------------------------------------*/

    getUser(){
        let loader = this._principalProvider.loading('Consultando usuario');
        this._usersProvider.comprobarEmail1(localStorage.getItem("email")).subscribe(res => {
            if(res['status'] = "200"){
                this.forma.controls['first_name'].setValue(res['data']['nombre']);
                this.forma.controls['last_name'].setValue(res['data']['apellido']);
                this.forma.controls['identification_document'].setValue(res['data']['documento_identidad']);
                this.forma.controls['gender'].setValue(res['data']['genero']);
                this.forma.controls['birthdate'].setValue(res['data']['fecha_nacimiento']);
                this.forma.controls['email'].setValue(res['data']['correo']);
                this.forma.controls['type_acount'].setValue(res['data']['type_acount']);
            }else{
                this._principalProvider.showAlert('Error', 'Ocurrió un error al intentar consultar la información del usuario')
            }
            loader.dismiss();
        });
    }


    updateUser(){
        this._principalProvider.loadingTemp('Actualizando...');
        this._usersProvider.update(localStorage.getItem("id"), this.forma).subscribe(res => {
            if(res['status'] == "200"){
                localStorage.setItem("email", res['data']['correo']);
                localStorage.setItem("user", res['data']['nombre']);
                // localStorage.setItem("id", res['data']['id']);
                localStorage.setItem("type_acount", res['data']['type_acount']);
                localStorage.setItem("procedencia", 'correo');
            }else{
                this._principalProvider.showAlert('Error', 'Ocurrió un error al intentar actualizar la información del usuario')
            }
        });
    }


    presentPopover(myEvent) {
        let popover = this.popoverCtrl.create(PopoverPage);
        popover.present({
            ev: myEvent
        });
    }

}
