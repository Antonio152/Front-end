
import React, { Component } from 'react'
import { Link } from 'react-router-dom'

import './ContenedoresMain.css'

export class ContenedoresMain extends Component {
    render() {
        return (
            <div className="caja-main">
                {this.props.permisos.accion.map((accion,acIndex) => {
                    return(
                        <div className="fila btn-accesos" key={acIndex}>
                            {/* <div className="columns link-icono">
                                {accion.icono}
                            </div> */}
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
