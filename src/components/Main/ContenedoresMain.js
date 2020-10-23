import React, { Component } from 'react'
import { Link } from 'react-router-dom'

import './ContenedoresMain.css'
// Cada uno de estos contenedores permite acceder a una acción que tenga permitida el usuario
export class ContenedoresMain extends Component {
    render() {
        return (
            <div className="caja-main">
                {this.props.permisos.accion.map((accion,acIndex) => {
                    return(
                        <div className="fila btn-accesos" key={acIndex}>
                            <Link className="columns link-acceso" to={accion.path}>
                                <div className="fila">
                                    <div className="columns">
                                        <p className="nombre-link">{accion.nombre}</p>
                                        <p className="link-desc">{accion.desc}</p>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    )
                })}
            </div>
        )
    }
}

export default ContenedoresMain
