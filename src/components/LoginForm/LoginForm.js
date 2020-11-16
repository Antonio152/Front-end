import React, { Component } from 'react';
import InputField from '../GeneralUseComp/InputField';
import SubmitButton from '../GeneralUseComp/SubmitButton';
import UserStore from '../Stores/UserStore';

import './LoginForm.css'

export class LoginForm extends Component {

    constructor(props) {
        super(props);
        this.state = {
            username: '', // this two props will be for the input field data
            password: '', 
            buttonDisabled: false, // When a user clicks log in button and the API checks if user exists
            redirect: null
        }
    }

    setInputValue(property, val, maxLenght) {
        val = val.trim(); // we don't want spaces
        if (val.length > maxLenght)  //Max lenght
            return;
        this.setState({
            [property]: val // property = username or password
        });
    }
    // Deja el formulario en su estado original
    resetForm(){
        this.setState({
            username: '', 
            password: '', 
            buttonDisabled: false 
        })
    }
    // Realiza el login del usuario
    async doLogin() {
        if (!this.state.username)
            return;
        if (!this.state.password)
            return;
        try {
            // From API
            let res = await fetch('http://localhost:4000/session/logIn', {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({ // Sending data on json
                    username: this.state.username,
                    password: this.state.password
                })
            }); 
            let result = await res.json();
            //Almacenamos el token en el sistema local.
            localStorage.setItem('token', result.token)
            // If user is logged
            if (result && result.success) {
                UserStore.loading = false;
                UserStore.isLoggedIn = true;
                UserStore.username = result.username;
                UserStore.id = result._id;
                UserStore.name = result.nombre;
                UserStore.lastNameP = result.apellidoPaterno;
                UserStore.lastNameM = result.apellidoMaterno ? result.apellidoMaterno : '';
                UserStore.curp = result.curp;
                UserStore.rh = result.seguroSocial[0].gpoSanguineo;
                UserStore.numSS = result.seguroSocial[0].numSos;
                UserStore.role = result.role;
                UserStore.photo = result.foto;
                UserStore.email = result.contacto[0].email;
                UserStore.tel = result.contacto[0].telefono;
                UserStore.telEmer = result.contacto[0].telEmergencia;
                UserStore.street = result.direccion[0].calle;
                UserStore.streetNo = result.direccion[0].numero;
                UserStore.location = result.direccion[0].localidad;
                UserStore.city = result.direccion[0].ciudad;
                UserStore.postalCode = result.direccion[0].cp;
                UserStore.state = result.direccion[0].estado;
                //Asignación de permisos
                if(UserStore.role !== 'Alumno'){
                    if(result.modulos[0].permisos)
                        UserStore.Usuarios = result.modulos[0].permisos;
                    if(result.modulos[1].permisos)
                        UserStore.Alumnos = result.modulos[1].permisos;
                    if(result.modulos[2].permisos)
                        UserStore.Credenciales = result.modulos[2].permisos;
                }
                else {
                    UserStore.career = result.datosAcademicos[0].carrera;
                    UserStore.idStudent = result.datosAcademicos[0].matricula;
                    UserStore.grade = result.datosAcademicos[0].cuatrimestre;
                    UserStore.aca_estatus = result.datosAcademicos[0].estatus;
                    if(result.modulos[0].permisos)
                        UserStore.Credenciales = result.modulos[0].permisos;
                }
                
            }
            else if (result && result.success === false) {
                this.resetForm();
                alert(result.msg); // Error from API
                UserStore.loading = false;
                UserStore.isLoggedIn = false;
            }
        } catch (error) {
            console.log(error)
            // this.resetForm();
        }
    }

    render() {
        return (
            <div className="background">
                <div className="loginForm">
                    <span className=" text title">
                        Bienvenido
                    </span>
                    <span className="text">
                        Por favor ingrese sus credenciales para acceder.
                    </span>
                    <br/>
                    <span className="text inputDesc">
                        Nombre de usuario
                    </span>
                    <InputField
                        type='text'
                        placeholder="Usuario"
                        value={ this.state.username ? this.state.username : ''}
                        onChange={ (val) => this.setInputValue('username',val, 12) }
                    />
                    <span className="text inputDesc">
                        Contraseña
                    </span>
                    <InputField
                        type='password'
                        placeholder="Contraseña"
                        value={ this.state.password ? this.state.password : ''}
                        onChange={ (val) => this.setInputValue('password',val, 32) }
                    />
                    {/* check SubmitButton css to know styles */}
                    <SubmitButton
                        styles = {'fullWidth'}
                        text = {'Ingresar'}
                        disabled = { this.state.buttonDisabled }
                        onclick = {() => this.doLogin() }
                    />
                    <span className="text extra-info">
                        En caso de no recordar tu usuario o contraseña, contactar al administrador.
                    </span>

                </div>
            </div>
            
        )
    }
}

export default LoginForm;
