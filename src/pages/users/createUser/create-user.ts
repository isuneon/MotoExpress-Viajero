import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { DataUserPage } from './data-user';
import { UsersProvider } from '../../../providers/users/users';
import { PrincipalProvider } from '../../../providers/principal';
import * as moment from 'moment';


@Component({
    selector: 'page-create-user',
    templateUrl: 'create-user.html',
})
export class CreateUserPage {

    forma : FormGroup;
    now:string = "";
    data:any;
    anio: string;

    constructor(public navCtrl: NavController, 
                public navParams: NavParams,
                public formBuilder: FormBuilder,
                public _usersProvider: UsersProvider,
                public _principalProvider: PrincipalProvider) {

        // this.anio = new Date().getFullYear();
        this.anio = moment().format('YYYY')
        this.data = navParams.get("data");

        this.forma = this.formBuilder.group({
            first_name: ['', Validators.compose([Validators.required, Validators.minLength(3)])],
            last_name: ['', Validators.compose([Validators.required, Validators.minLength(3)])],
            identification_document: ['', Validators.compose([Validators.required, Validators.minLength(7)])],
            gender: ['', Validators.required],
            birthdate: ['', Validators.required],
            email: ['', Validators.compose([Validators.required, Validators.pattern("[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$")])],
            password1: ['', Validators.compose([Validators.required, Validators.minLength(8)])],
            password2: []
        });

        this.now = moment().format('YYYY-MM-DD')
        this.forma.controls['password2'].setValidators([Validators.required, this.noIgual.bind(this.forma)])

        if(this.data != undefined){
            let nombreCompleto = this.data['user']['displayName'].split(" ");
            let nombres = "";
            let apellidos = "";

            if(nombreCompleto.length > 2){
                nombres = nombreCompleto[0] + " " + nombreCompleto[1];
                apellidos = nombreCompleto[2] + " " + nombreCompleto[3];
            }else{
                nombres = nombreCompleto[0];
                apellidos = nombreCompleto[1];
            }

            this.forma.controls['first_name'].setValue(nombres);
            this.forma.controls['last_name'].setValue(apellidos);
            this.forma.controls['email'].setValue(this.data['user']['email']);
        }
    }

    noIgual(control: FormBuilder): any {
        if(control['value'] !== this['controls']['password1'].value){
            return {
                noIguales:true
            }
        }
        return null;
    }


    setDataUser(){
        /*VALIDAR SI EL CORREO YA EXISTE*/
        this.navCtrl.push(DataUserPage, {data: this.forma});
    }
   
}
