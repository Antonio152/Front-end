import React, { Component } from 'react';
import Modal from 'react-responsive-modal';
import InputField from '../GeneralUseComp/InputField';
import SubmitButton from '../GeneralUseComp/SubmitButton';
import UserStore from '../Stores/UserStore';
import axios from 'axios';

import './LoginForm.css';

const bcrypt = require('bcryptjs');

export class LoginForm extends Component {

    constructor(props) {
        super(props);
        this.state = {
            username: '', // this two props will be for the input field data
            password: '', 
            email: '',
            codigo: '',
            idUsuario: '',
            rest_password: '',
            rest_passwordRep: '',
            isPswChanged: false,

            emailCorrecto: false,
            buttonDisabled: false, // When a user clicks log in button and the API checks if user exists
            redirect: null,

            modalAbierto:false,

            intentosFallidos:[]
        }
    }

    setInputValue(property, val, maxLenght) {
        val = val.trim(); // we don't want spaces
        if (property === 'codigo')
            val = val.toUpperCase();
        if (val.length > maxLenght)  //Max lenght
            return;
        this.setState({
            [property]: val // property = username or password
        });
    }
    // Deja el formulario en su estado original
    // Además, realiza el control de intentos fallidos
    async resetForm(result, id){
        // Variables auxiliares
        var intentosAux = this.state.intentosFallidos;
        var indiceAux = 0;
        var intentos = 0;
        // Cuando no esté registrado se retorna en lugar de contarlo 
        if (result.includes('no está registrado')) return;
        // Cuando el arreglo esté vacío y en caso de que el usuario esté bloqueado, lo agrega a la tabla con 6
        if (intentosAux.length === 0) {
            intentosAux.push({username: this.state.username, intentos: result.includes('bloqueado') ? 6 : 1})
        }
        else {
            // Obtiene el índice de un usuario específico
            indiceAux = intentosAux
                .findIndex(usuario => usuario.username === this.state.username);
            // Condición que pregunta si se encontró un usuario o no
            if (indiceAux !== -1) {
                // Incrementa los intentos
                intentos = this.state.intentosFallidos[indiceAux].intentos + 1;
                // AQUÍ SE IMPLEMENTARÁ EL BLOQUEO
                if (intentos > 5)  {
                    await axios.put(`http://localhost:4000/api/users/${id}`, {
                        bloqueado: true
                    })
                        .then(() => {
                            alert(`El usuario ${this.state.username} ha sido bloqueado.\nReestablezca su contraseña.`);
                            return;
                        })
                        .catch(err => console.error(err));
                }
                else
                    // Actualización del arreglo
                    intentosAux.splice(indiceAux,1,{
                        username:this.state.username, 
                        intentos: intentos});
            }
            else {
                // Cuando el usuario no fue encontrado, lo agrega
                intentosAux.push({username: this.state.username, intentos: 1})
            }
        }
        // Actualización de estado
        this.setState({
            password: '', 
            buttonDisabled: false,
            intentosFallidos: intentosAux
        })
    }

    // Se encarga de bloquear el usuario 
    // AÚN NO ESTÁ IMPLEMENTADA 
    async bloquearUsuario(usuario) {
        await axios.put(`http://localhost:4000/session/lock`,{
            username: usuario
        })
            .then(res => {
                if (res.status === 200){
                    alert('El usuario ha sido bloqueado, contacte al administrador.');
                }
                else if(res.status !== 500)
                    alert('Ha ocurrido un error. Inténtelo nuevamente.');
                else
                    alert('Ha ocurrido un error con la conexión al servidor.');
            })
            .catch(error => console.error(error));
    }

    // Realiza el login del usuario
    async doLogin() {
        if (!this.state.username)
            return;
        if (!this.state.password)
            return;
        this.setState({buttonDisabled:true});
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

            if (!logueoExitoso){
                alert(result.msg);
                // Función de error
                if (result.msg !== 'Usuario bloqueado')
                    this.resetForm(result.msg, result.id);
            }
        } catch (error) {
            UserStore.gotError();
            console.error(error);
        }
        this.setState({buttonDisabled:false});
    }

    // Se encarga de verificar que el email sea correcto
    async verificarCorreo() { 
        const res = await axios.put('http://localhost:4000/session/email',{
            email: this.state.email
        }); 

        if (res.data.success) {
            this.setState({emailCorrecto:true})
        }
        else {
            alert(res.data.msg)
        }
    }
    // Se encarga de verificar que el código sea correcto
    async verificarCodigo() {
        await axios.post('http://localhost:4000/session/codeVerification',{
            codigo: this.state.codigo,
            email: this.state.email
        }).then(res => {
            if (res.data.success){
                this.setState({emailCorrecto: true, isPswChanged: true, idUsuario: res.data.id});
            }
            else
                alert(res.data.msg)
        }).catch(error => console.error(error));
    }
    // Se encarga de realizar el cambio de contraseña
    async cambioPsw() {
        // Si no coinciden
        if (this.state.rest_passwordRep !== this.state.rest_password){
            alert('Las contraseñas no coinciden');
            return;
        }
        // Petición
        await axios.put(`http://localhost:4000/api/users/${this.state.idUsuario}`,{
            password: bcrypt.hashSync(this.state.rest_password,9),
            bloqueado:false
        })
            .then(res => {
                if (res.status === 200){
                    alert('La contraseña ha sido modificada.');
                    this.setState({modalAbierto:false , emailCorrecto: false});
                }
                else if(res.status !== 500)
                    alert('Ha ocurrido un error. Inténtelo nuevamente.');
                else
                    alert('Ha ocurrido un error con la conexión al servidor.');
            })
            .catch(error => console.error(error));
    }

    // Se encarga de consultar y renderizar qué usuario tiene n cantidad de intentos restantes
    renderizarFallidos = () => {
        var indAux = this.state.intentosFallidos.findIndex(usuario => usuario.username === this.state.username);
        if (indAux !== -1) {
            return (
                <div className="mensaje-error">
                    <p>{this.state.intentosFallidos[indAux].intentos < 5 ? `El usuario ${this.state.intentosFallidos[indAux].username} tiene ${5 - this.state.intentosFallidos[indAux].intentos} intentos restantes` : 'Usuario bloqueado'}</p>
                </div>
            )
        }
    }

    // Permite abrir y cerrar el modal
    abrirCerrarModal = () => {
        return <Modal 
            open={this.state.modalAbierto} 
            onClose={() => this.setState({ 
                modalAbierto:false, 
                emailCorrecto:false, 
                isPswChanged: false,
                email: '',
                codigo: '',
                idUsuario: '',
                rest_password: '',
                rest_passwordRep: '',
            })} >
            {!this.state.emailCorrecto ? this.renderVerificaCorreo() : 
            !this.state.isPswChanged ? this.renderCodigo(): this.renderCambioPsw()}
        </Modal>
    }

    // Renderiza el contenido del modal de verificación de correo electrónico
    renderVerificaCorreo () {
        return(
            <div>
                <br/><br/>
                <p className="text">Escriba la dirección de correo electrónico para la cual <br/> desea reestablecer la contraseña y su dirección de <br/>correo electrónico</p><br/>
                <span className="etiqueta" style={{marginLeft:'0'}}>CORREO ELECTRÓNICO</span>
                <InputField
                    type='text'
                    placeholder="micorreo@ejemplo.com"
                    value={ this.state.email ? this.state.email : ''}
                    onChange={ (val) => this.setInputValue('email',val, 100) }
                />
                <div className="fila">
                    <div style={{marginLeft:'auto'}}>
                        <SubmitButton
                            styles = {'no_margin'}
                            text = {'Verificar'}
                            onclick = {() => {this.verificarCorreo();this.setState({username:'', password:''});} }
                        />
                    </div>
                </div>
            
            </div>
        )
    }

    // Renderiza el contenido del modal de verificación del código
    renderCodigo() {
        return(
            <div>
                <br/><br/>
                <p>Por favor ingrese el código que le fue enviado.</p><br/>
                <span className="etiqueta" style={{marginLeft:'0'}}>CÓDIGO</span>
                <InputField
                    type='text'
                    placeholder="- - - - - -"
                    value={ this.state.codigo ? this.state.codigo : ''}
                    onChange={ (val) => this.setInputValue('codigo',val, 6) }
                />
                <div className="fila">
                    <div style={{marginLeft:'auto'}}>
                        <SubmitButton
                            styles = {'no_margin'}
                            text = {'Verificar'}
                            onclick = {() => this.verificarCodigo() }
                        />
                    </div>
                </div>
            </div>
        )
    }

    // Renderiza el contenido del modal de cambio de contraseña
    renderCambioPsw() {
        return(
            <div>
                <br/>
                <span className="etiqueta" style={{marginLeft:'0'}}>NUEVA CONTRASEÑA</span>
                <InputField
                    type='password'
                    placeholder="Nueva contraseña"
                    value={ this.state.rest_password ? this.state.rest_password : ''}
                    onChange={ (val) => this.setInputValue('rest_password',val, 12) }
                /><br/>
                <span className="etiqueta" style={{marginLeft:'0'}}>REPETIR CONTRASEÑA</span>
                <InputField
                    type='password'
                    placeholder="Repita contraseña"
                    value={ this.state.rest_passwordRep ? this.state.rest_passwordRep : ''}
                    onChange={ (val) => this.setInputValue('rest_passwordRep',val, 12) }
                />
                <div className="fila">
                    <div style={{marginLeft:'auto'}}>
                        <SubmitButton
                            styles = {'no_margin'}
                            text = {'Cambiar contraseña'}
                            onclick = {() => this.cambioPsw() }
                        />
                    </div>
                </div>
            </div>
        )
    }

    render() {
        return (
            <div className="background">
                <div className="loginForm">
                    {this.abrirCerrarModal()}
                    <span className=" text title" style={{marginBottom:'10px'}}>
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
                    {this.renderizarFallidos()}
                    {/* check SubmitButton css to know styles */}
                    <SubmitButton
                        styles = {'fullWidth'}
                        text = {'Ingresar'}
                        disabled = { this.state.buttonDisabled }
                        onclick = {() => this.doLogin() }
                    />
                    <span className="text extra-info">
                        <div onClick={() => this.setState({ modalAbierto:true })} style={{cursor:'pointer'}}>He olvidado mi contraseña</div>
                    </span>

                </div>
            </div>
            
        )
    }
}

export default LoginForm;
