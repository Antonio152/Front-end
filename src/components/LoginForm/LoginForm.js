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
            const logueoExitoso = UserStore.setData(result);
            if (!logueoExitoso)
                this.resetForm();
        } catch (error) {
            UserStore.gotError();
            console.error(error)
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
