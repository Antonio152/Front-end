import React, { Component } from 'react'
import './Credencial.css'
import fondoaAtras from './img/FONDO ATRAS.png'
import fondoaFrente from './img/FONDO FRENTE.png'
import escudo from './img/LOGO.png'
import sep from './img/SEP.png'
import firma from './img/FIRMA.png'
import periodo from './img/PERIODO.png'
import qr from './img/QR.png'
import Loader from '../GeneralUseComp/Loader'

export class Cedencial extends Component {
    render() {
        if (this.props.alumno.usuario.nombre)
        return (
            <div className="credencial">
                <div className="fila justificado">
                    <div className="cred-lado">
                        <div className="fila">
                            <div className="columns">
                                <img src={fondoaFrente} className="fondo" alt="" />
                                <div className="fila datos-cred">
                                    <div className="cred-images">
                                        <img src={escudo} className="escudo" alt=""/>
                                    </div>
                                    <div className="datos-inst" style={{color:this.props.colores.colorPrinc}}>
                                        <p className="nombre-inst"><b>{this.props.universidad.nombre}</b></p>
                                        <hr style={{borderColor:this.props.colores.colorLinea}}/>
                                        <p className="lema">{this.props.universidad.lema}</p>
                                    </div>
                                </div>
                                <div className="fila datos-cred">
                                    <div className="cred-images">
                                        <img src={`data:image/jpg;base64,${this.props.alumno.usuario.foto ? this.props.alumno.usuario.foto : ''}`} className="foto-cred" alt=""/>
                                    </div>
                                    <div className="datos-inst">
                                        <div className="nom-compl">
                                            <p className="mayus"><b>{this.props.alumno.usuario.nombre}</b></p>
                                            <p className="mayus"><b>{`${this.props.alumno.usuario.aPaterno} ${this.props.alumno.usuario.aMaterno ? this.props.alumno.usuario.aMaterno : ''}`}</b></p>
                                        </div>
                                        
                                        <p className="mayus desc"><b>{`MATRÍCULA: ${this.props.alumno.academico.matricula ? this.props.alumno.academico.matricula : ''}`}</b></p>
                                        <p className="mayus desc"><b>{`CURP: ${this.props.alumno.usuario.curp ? this.props.alumno.usuario.curp : ''}`}</b></p>
                                        <div className="fila">
                                            <div>
                                                <p className="mayus desc"><b>{`SOS: ${this.props.alumno.contacto.telEmergencia ? this.props.alumno.contacto.telEmergencia : ''}`}</b></p>
                                            </div>
                                            <div>
                                                <p className="mayus desc"><b>{`RH: ${this.props.alumno.usuario.sanguineo ? this.props.alumno.usuario.sanguineo : ''}`}</b></p>
                                            </div>
                                        </div>
                                        <div className="direc-alu">
                                            <p className="mayus desc"><b>{`${this.props.alumno.direccion.calle} ${this.props.alumno.direccion.numero}, ${this.props.alumno.direccion.localidad}, ${this.props.alumno.direccion.ciudad}, ${this.props.alumno.direccion.estado}. C.P.  ${this.props.alumno.direccion.cp}`}</b></p>
                                        </div>
                                        
                                    </div>
                                </div>
                            </div>
                            <div className="columns">
                                <div className="rotado180" style={{background:this.props.colores.colorPrinc, color: this.props.colores.colorCarrera}}>
                                    <p className=" mayus carrera"><b>{`${this.props.alumno.academico.carrera ? this.props.alumno.academico.carrera : ''}`}</b></p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="cred-lado lado-der">
                        
                        <div className="fondo">
                            <img src={fondoaAtras} className="fondo" alt="" />
                            <div className="fila datos-cred justificado">
                                <div className="direccion-academica">
                                    <div className="firma-director">
                                        <div className="absoluto-centrado">
                                            <div className="relativo-centrado">
                                                <img className="img-firma-director" src={firma} alt=""/>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="director">
                                        <p>{`${this.props.direccion.nombre}`}</p>
                                        <p>{`${this.props.direccion.cargo}`}</p>
                                    </div>
                                </div>
                                <div className="inst-superior">
                                    <img className="img-inst-superior" src={sep} alt=""/>
                                </div>
                            </div>
                            <div className="fila datos-cred">
                                <div className="cuadro-firma"/>
                            </div>
                            <div className="fila datos-cred">
                                <div className="letra-pequeña texto-centrado">
                                    <p>Este documento es intransferible, el titular es responsable de las acciones derivadas de su uso.</p>
                                    <p>Es indispensable su presentación para efectos de trámites académicos y administrativos</p>
                                </div>
                            </div>
                            <div className="fila datos-cred justificado">
                                <div className="columns">
                                    <img className="periodo" src={periodo} alt=""/>
                                </div>
                                <div className="columns">
                                    <div className="linea-vertical" style={{background: `${this.props.colores.colorLinea}`}}/>
                                </div>
                                <div className="columns">
                                    <div className="letra-pequeña">
                                        <div dangerouslySetInnerHTML={{__html: `${this.props.universidad.direccion}`}} />
                                    </div>
                                </div>
                                <div className="columns">
                                    <img className="periodo" src={qr} alt=""/>
                                </div>
                            </div>
                        </div>

                    </div>

                </div>
                <br/>
                <div className="fila justificado">
                    <div className="fullWidth"><p  className="texto-centrado">Parte frontal</p></div>
                    <div className="fullWidth"><p  className="texto-centrado">Parte trasera</p></div>
                </div>
            </div>
        )
        else
            return(
                <div>
                    <Loader/>{`    Cargando...`} 
                </div>
            )
    }
}

export default Cedencial
