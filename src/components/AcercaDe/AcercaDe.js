import React, { Component } from 'react'
import background from './img/cuadro-bg.jpg'

import './AcercaDe.css'


export class AcercaDe extends Component {
    render() {
        return (
            <div className="acercade" style={{textAlign:'center', height:'fit-content'}}>
                <img src={background} alt="" className="cuadro-fondo"/>
                <div className="acercade-info">
                    <p className="txtMANDATUM">MANDATUM</p>
                    <p className="txtVERSION">VERSIÓN PREALFA 1.0</p>
                    <p className="txtDESCRIPCION">La mejor opción para generar credenciales.</p>
                    <button className="btnDESCRIPCION">Dependencias</button>
                </div>
                <div className="abajo texto-derecha">
                    <p>Licencia bajo:</p>
                    <p><b>Universidad Politécnica de Pacuca</b></p>
                    <br/>
                    <p>Esquema de datos v.2.3</p>
                    <p>Desarrollado en ReactJS</p>
                </div>
            </div>
            
        )
    }
}

export default AcercaDe
