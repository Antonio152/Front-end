import React, { Component } from 'react'
import './Credencial.css'
import fondoaAtras from './img/FONDO ATRAS.png'
import fondoaFrente from './img/FONDO FRENTE.png'
import escudo from './img/LOGO.png'
import firma from './img/FIRMA.png'
import periodo from './img/PERIODO.png'
import qr from './img/QR.png'
import user from './img/usuario.png'
import gob from './img/Gobierno.png'
import hidalgo from './img/Hidalgo.png'
import utyp from './img/UTyP.png'

export class CredencialT extends Component {
    render() {
  
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
                                    <div className="datos-inst">
                                        <div className="nom-compl">
                                            <p className="mayus"><b>{`NOMBRE(S)`}</b></p>
                                            <p className="mayus"><b>{`APELLIDOS`}</b></p>
                                        </div>
                                        
                                        <p className="mayus desc"><b>{`MATRÍCULA:`}</b></p>
                                        <p className="mayus desc"><b>{`CURP:`}</b></p>
                                        <div className="fila">
                                            <div>
                                                <p className="mayus desc"><b>{`SOS:`}</b></p>
                                            </div>
                                            <div>
                                                <p className="mayus desc"><b>{`RH:`}</b></p>
                                            </div>
                                        </div>
                                        <div className="direc-alu">
                                            <p className="mayus desc"><b>{`Calle, No., Localidad / Colonia, C.P., Ciudad, Estado`}</b></p>
                                        </div>
                                        
                                    </div>
                                    <div className="cred-images">
                                        <img src={user} className="foto-cred" alt=""/>
                                    </div>
                                </div>

                                <div className="barraCarrera" style={{background:this.props.colores.colorPrinc, color: this.props.colores.colorCarrera}}>
                                    <p className=" mayus"><b>{`Carrera`}</b></p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="cred-lado lado-der">
                        
                        <div className="fondo">
                            <img src={fondoaAtras} className="fondo" alt="" />
                            <div className="columns datos-cred justificado">
                                <div className="fila direccion-academica">
                                        <div className="absoluto-centrado">
                                            <div className="relativo-centrado">
                                                <img className="logosInst1" src={utyp} alt="" />
                                                <img className="logosInst" src={gob} alt="" />
                                                <img className="logosInst" src={hidalgo} alt="" />
                                            </div>
                                        </div>
                                </div>
                            </div>
                            <div className="director">
                                        
                            </div>
                            <div className="columns datos-cred">
                                <div className="fila datos-cred">
                                    <div className="cuadro-firma" />
                                </div>
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
                                <div className="columns letra-pequeña">
                                        <img className="img-firma-director" src={firma} alt=""/>
                                        <p>{`${this.props.direccion.nombre}`}</p>
                                        <p>{`${this.props.direccion.cargo}`}</p>
                                </div>
                                <div className="columns">
                                    <div className="linea-vertical" style={{background: `${this.props.colores.colorLinea}`}}/>
                                </div>
                                <div className="columns">
                                    <div className="letra-pequeña texto-derecha">
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
    }
}

export default CredencialT
