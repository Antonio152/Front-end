import React, { Component } from 'react'
import axios from 'axios'
import * as BiIcons from 'react-icons/bi';
import * as AiIcons from 'react-icons/ai';
import * as FaIcons from 'react-icons/fa';
import ContenedoresMain from './ContenedoresMain'
import './MainComponent.css'
import UserStore from '../Stores/UserStore'

import Loader from '../GeneralUseComp/Loader'

import { observer } from 'mobx-react'

export class MainComponent extends Component {

    state = {
        usuario: {},
        concatDesc: ''
    }

    primeraPalabra(palabra){
        // var firstWord = palabra.substr(0, codeLine.indexOf(" "));
        var firstWord = palabra.split(" ");
        return firstWord[0];
    }

    componentDidMount() {
        try {
             axios.get('http://localhost:4000/api/users/' + UserStore.id)
                .then(res => {
                    const usuario = res.data;
                    this.setState({ usuario:usuario });
                })
        } catch (error) {
            console.log('Existió un error', error)
        }
    }

    resetAccion = () => this.setState({accion : []})

    render() {
        if (this.state.usuario.nombre)
            return (
                <div className="fila main">

                    <div className="columns col-iz">
                        <div className="caja-main-iz">
                            <AiIcons.AiOutlineHome className="icon-casa"/>
                            <p className="title titulo-main">{`Bienvenido ${this.primeraPalabra(this.state.usuario.nombre)}`}</p>
                            <p style={{color: '#555555'}}>Descubre nuestras funciones de generación de credenciales a traves de este portal.</p>
                        </div>

                        <div className="caja-main-iz" style={{color: '#555555'}}>
                            <div className="fila cont_foto_usuario">
                                <img className="foto_usuario" alt="" src={`data:image/jpg;base64,${this.state.usuario.foto}`}/>
                            </div>
                            <span className="etiqueta" style={{marginLeft:'0'}}>NOMBRE COMPLETO</span>
                            <span style={{marginLeft:'0'}}>{`${this.state.usuario.nombre} ${this.state.usuario.aPaterno} ${this.state.usuario.aMaterno}`}</span>
                            <span className="etiqueta" style={{marginLeft:'0'}}>ROL</span>
                            <span style={{marginLeft:'0'}}>{this.state.usuario.rol[0].nombre}</span>
                            <span className="etiqueta" style={{marginLeft:'0'}}>CORREO ELECTRÓNICO</span>
                            <span style={{marginLeft:'0'}}> {this.state.usuario.contacto[0].email}</span>
                        </div>
                    </div>

                    <div className="columns col-der">
                        <div className="caja-main-iz">
                            <p className="title titulo-main">Revisa nuestras funciones</p>
                            <br/>
                            {
                                this.state.usuario.rol[0].modulos.map((modulo, modIndex) => {
                                    // this.resetAccion();
                                    var data = []
                                    return(
                                        <div key={modIndex}>
                                            <div className="fila subitulo-main">
                                                {modulo.nombre === 'Usuarios' ? <FaIcons.FaUser className="title-icon" /> :
                                                modulo.nombre === 'Alumnos' ? <FaIcons.FaGraduationCap className="title-icon"/> :
                                                <FaIcons.FaRegCreditCard className="title-icon" />}
                                                
                                                <p className="title subitulo-main">{modulo.nombre}</p>
                                            </div>
                                            {modulo.permisos
                                                .filter(permiso => permiso !== 'Eliminar')
                                                .filter(permiso => permiso !== 'Modificar')
                                                .forEach( permiso => {
                                                    data.push( {
                                                        nombre: `${permiso === 'Crear' ? 'Altas' : permiso === 'Consultar' ? 'Consultar' : 'Modificar formato'}`,
                                                        desc: 
                                                        `${permiso === 'Crear' ? `Dar de alta ${modulo.nombre.toLowerCase()}.` : permiso === 'Consultar' ?
                                                        `Ver, editar y eliminar ${modulo.nombre.toLowerCase()}.` : 'Modificar el formato predeterminado de las credenciales.'}`,
                                                        path: `/${modulo.nombre.toLowerCase()}/${permiso.toLowerCase().replace(' ','-')}`
                                                    })
                                                })}
                                            <ContenedoresMain 
                                                key={modIndex}
                                                nombre={modulo.nombre}
                                                permisos={{accion: data}}
                                            />
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>
                </div>
                
                
            )
        else
            return(<div>
                <Loader/>{`    Cargando...`} 
            </div>)
    }
}

export default observer(MainComponent)
