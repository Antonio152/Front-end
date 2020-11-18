import React, { Component } from 'react'

import './BtnSeccion.css'
// Botón para el cambio de sección
export class BtnSeccion extends Component {
    render() {
        return (
            <div className="caja-main" style={{
                marginBottom:'5px',
                marginLeft:'0px',
                width:'100%'
                }}>
                <button 
                disabled={this.props.activo}
                className={`btn-accesos no-boton ${this.props.activo ? 'activo' : ''}`}
                onClick={ () => this.props.onclick() }>
                    <div className="columns">
                        <div className="fila">
                            <div className="columns">
                                <p>{this.props.nombre}</p>
                                <p className="link-desc tres-puntos">{this.props.descripcion}</p>
                            </div>
                        </div>
                    </div>
                </button>
            </div>
        )
    }
}

export default BtnSeccion
