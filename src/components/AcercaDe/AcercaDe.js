import React, { Component } from 'react'
import logo from './img/Logo.png'
import background from './img/cuadro-bg.jpg'
import { Link } from 'react-router-dom'

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
                    <p>Esquema de datos v.2.2</p>
                    <p>Desarrollado en ReactJS</p>
                </div>
            </div>
            // <div className="acercade">
            //     <p>La licencia de este software fue adquirida por: <b>"Nombre de la universidad"</b></p>
            //     <div className="centrado-acercade">

            //         <h1 className="title">Mandatum</h1>
            //         <img src={logo} alt="" className="logo-centrado"/>
            //         <h2 className="title subitulo-main">Versión pre-alfa 1.0</h2>
            //         <p>2020 Mandatum Inc.</p>
            //     </div>
            //     <div className="abajo texto-derecha">
            //         <p>Esquema de datos v.2.2</p>
            //         <p>Desarrollado en ReactJS</p>
            //     </div>
            // </div>
            
        )
    }
}

export default AcercaDe
