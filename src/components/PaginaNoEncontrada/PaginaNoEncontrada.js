import React, { Component } from 'react'
import {Link} from 'react-router-dom'
import './PaginaNoEncontrada.css'
import SvgHexagon from './SvgHexagon'
export class PaginaNoEncontrada extends Component {
    render() {
        return (
            <div>
                <SvgHexagon/>
                <div className="message-box">
                <h1 style={{fontWeight:400}}>Hmm.</h1>
                <p>Parece que estás perdido. La ruta que ingresaste no es correcta o quizá no tienes los permisos de acceso para dicho módulo.</p>
                <div className="buttons-con">
                    <div className="action-link-wrap">
                    <Link to='/' className="link-button">Ir a la página principal</Link>
                    </div>
                </div>
                </div>
            </div>
        )
    }
}

export default PaginaNoEncontrada
