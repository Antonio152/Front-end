import React, { Component } from 'react'

import * as HiIcons from 'react-icons/hi';

import UserStore from '../Stores/UserStore'

import InputFile from '../GeneralUseComp/InputFile'
import InputField from '../GeneralUseComp/InputField'
import SubmitButton from '../GeneralUseComp/SubmitButton'

import './MyAccount.css'

export class MyAccount extends Component {

    state = {
        zona: 'personales'
    }

    renderDatos = () => {
        if (this.state.zona === 'personales')
            return(
                <div>
                    <div className="columns">
                        <span className="etiqueta" style={{marginLeft:'0'}}>ROL</span>
                        <span className="span-descriptivo">{UserStore.role}</span>
                    </div>
                    
                    {this.inputTextEditable('Nombre completo',`${UserStore.name} ${UserStore.lastNameP} ${UserStore.lastNameM}`)}
                </div>
            )
        if (this.state.zona === 'direccion')
            return(
                <div>
                    <div className="fila">
                        {this.inputTextEditable('Calle',`${UserStore.street}`)}
                        <div className="inp-numero">
                            {this.inputTextEditable('Numero',`${UserStore.streetNo}`)}

                        </div>
                    </div>
                    <div className="fila">
                        {this.inputTextEditable('Localidad',`${UserStore.location}`)}
                        <div className="inp-numero">
                            {this.inputTextEditable('C.P.',UserStore.postalCode)}
                        </div>
                    </div>
                    {this.inputTextEditable('Ciudad',UserStore.city)}

                    {this.inputTextEditable('Estado',UserStore.state)}
                </div>
            )
        if (this.state.zona === 'contacto')
        return(
            <div>
                <div className="columns">
                    <span className="etiqueta" style={{marginLeft:'0'}}>CORREO ELECTRÓNICO</span>
                    <span className="span-descriptivo">{UserStore.email}</span>
                </div>
                
                {this.inputTextEditable('Teléfono',UserStore.tel)}

                {this.inputTextEditable('Tel. Emergencia',UserStore.telEmer)}
            </div>
        )
    }
    // Un campo que puede ser editable al pasar el cursor sobre él
    inputTextEditable = (tipo, dato) => {
        return(
            <div className="columns texto-editable">
                <div className="fila">
                    <span className="etiqueta" style={{marginLeft:'0'}}>{tipo.toUpperCase()}</span>
                    <HiIcons.HiOutlinePencil className="lapiz-icon"/>
                </div>
                
                <InputField
                    value={dato}
                    noBorder={true}
                />
            </div>
            
        )
    }

    render() {
        return (
            <div className="main_fila main">
                <div className="columns col-iz">
                    <div className="caja-main-iz">
                        <span className="etiqueta" style={{marginLeft:'0'}}>FOTO DE PERFIL</span>
                        <br/>
                        <div className="columns">
                            <div className="fila cambia-cont cont_foto_usuario ">
                                <img className="foto-grande" alt="" src={`data:image/jpg;base64,${UserStore.photo}`}/>
                                <div className="file-middle">
                                    <InputFile styles="square200px"/>
                                </div>
                                
                            </div>
                            <div className="horizontal-line"/>
                            
                            {this.renderDatos()}
                        </div>
                    </div>
                </div>
                <div className="columns col-iz">
                    <div className="caja-main-iz" style={{height:'auto'}}>

                        <div className="caja-main" >
                            <button className="btn-accesos no-boton" onClick={ () => this.setState({zona:'personales'})}>
                                <div className="columns">
                                    <div className="fila">
                                        <div className="columns">
                                            <p>Datos personales</p>
                                            <p className="link-desc tres-puntos">Nombre, apellidos, contraseña, curp, núm. sos, grupo sanguíneo</p>
                                        </div>
                                    </div>
                                </div>
                            </button>
                        </div>

                        <div className="caja-main">
                            <button className="btn-accesos no-boton" onClick={ () => this.setState({zona:'direccion'})}>
                                <div className="columns">
                                    <div className="fila">
                                        <div className="columns">
                                            <p>Dirección</p>
                                            <p className="link-desc tres-puntos">Calle, número, localidad, ciudad, estado, C.P.</p>
                                        </div>
                                    </div>
                                </div>
                            </button>
                        </div>
                        
                        <div className="caja-main">
                            <button className="btn-accesos no-boton" onClick={ () => this.setState({zona:'contacto'})}>
                                <div className="columns">
                                    <div className="fila">
                                        <div className="columns">
                                            <p>Contacto</p>
                                            <p className="link-desc tres-puntos">Teléfono, correo electrónico, teléfono de emergencia</p>
                                        </div>
                                    </div>
                                </div>
                            </button>
                        </div>
                        {UserStore.role === 'Alumno' ?
                        <div className="caja-main">
                            <button className="btn-accesos no-boton" onClick={ () => this.setState({zona:'contacto'})}>
                                <div className="columns">
                                    <div className="fila">
                                        <div className="columns">
                                            <p>Académico</p>
                                            <p className="link-desc tres-puntos">Carrera, cuatrimestre, matrícula</p>
                                        </div>
                                    </div>
                                </div>
                            </button>
                        </div>
                        : <></>}
                        <div style={{textAlign:'center'}}>
                            <SubmitButton
                            text="Guardar cambios"
                            />
                        </div>
                        
                    </div>
                </div>
            </div>
        )
    }
}

export default MyAccount
