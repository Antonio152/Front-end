import React, { Component } from 'react'
import * as BiIcons from 'react-icons/bi';
import * as AiIcons from 'react-icons/ai';
import * as FaIcons from 'react-icons/fa';
import ContenedoresMain from './ContenedoresMain'
import './MainComponent.css'

export class MainComponent extends Component {

    primeraPalabra(palabra){
        // var firstWord = palabra.substr(0, codeLine.indexOf(" "));
        var firstWord = palabra.split(" ");
        return firstWord[0];
    }

    render() {
        return (
            <div className="fila main">

                <div className="columns col-iz">
                    <div className="caja-main-iz">
                        <AiIcons.AiOutlineHome className="icon-casa"/>
                        <p className="title titulo-main">{`Bienvenido ${this.primeraPalabra(this.props.profile_name)}`}</p>
                        <p style={{color: '#555555'}}>Descubre nuestras funciones de generación de credenciales a traves de este portal.</p>
                    </div>

                    <div className="caja-main-iz" style={{color: '#555555'}}>
                        <div className="fila cont_foto_usuario">
                            <img className="foto_usuario" alt="" src={`data:image/jpg;base64,${this.props.profile_photo}`}/>
                        </div>
                        <span className="etiqueta" style={{marginLeft:'0'}}>NOMBRE COMPLETO</span>
                        <span style={{marginLeft:'0'}}>{`${this.props.profile_name} ${this.props.profile_lastName}`}</span>
                        <span className="etiqueta" style={{marginLeft:'0'}}>ROL</span>
                        <span style={{marginLeft:'0'}}>{this.props.profile_role}</span>
                        <span className="etiqueta" style={{marginLeft:'0'}}>CORREO ELECTRÓNICO</span>
                        <span style={{marginLeft:'0'}}> {this.props.profile_email}</span>
                    </div>
                </div>

                <div className="columns col-der">
                    <div className="caja-main-iz">
                        <p className="title titulo-main">Revisa nuestras funciones</p>
                        <br/>
                        <div className="fila subitulo-main">
                            <FaIcons.FaUser className="title-icon" />
                            <p className="title subitulo-main">Usuarios</p>
                        </div>                        
                        <ContenedoresMain 
                            nombre="Usuarios" 
                            permisos={{
                            accion:[{
                                nombre:'Altas',
                                desc: 'Dar de alta un usuario.',
                                path: '/usuarios/alta'
                            },{
                                nombre:'Consultas',
                                desc: 'Ver, editar y eliminar usuarios.',
                                path: '/usuarios/consulta'
                            }]}}/>
                        
                        <div className="fila subitulo-main">
                            <FaIcons.FaGraduationCap className="title-icon"/>
                            <p className="title subitulo-main">Alumnos</p>
                        </div>
                        <ContenedoresMain 
                            nombre="Usuarios" 
                            permisos={{
                            accion:[{
                                nombre:'Altas',
                                desc: 'Dar de alta un alumno.',
                                icono:  <BiIcons.BiPencil/>,
                                path: '/usuarios/alta'
                            },{
                                nombre:'Consultas',
                                desc: 'Ver, editar y eliminar alumnos.',
                                icono:  <BiIcons.BiGlassesAlt/>,
                                path: '/alumnos/consulta'
                            }]}}/>
                    </div>
                </div>
            </div>
            
            
        )
    }
}

export default MainComponent
