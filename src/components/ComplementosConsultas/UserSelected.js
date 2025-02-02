import React, { Component } from 'react'
import { Link } from 'react-router-dom'

import SubmitButton from '../GeneralUseComp/SubmitButton'

import * as BiIcons from 'react-icons/bi'
import * as AiIcons from 'react-icons/ai'

import '../ConsultarUsuarios/ConsultaUsuarios.css'

export class UserSelected extends Component {

    render() {
        var ancho;
        return(
            <div className="column">
                <div className="fila">
                    <div className="columns justificado_vert">
                        <div className="cont_foto">
                            <img className="foto_usuario" alt="" src={`data:image/;base64,${this.props.usuario.foto}`}/>
                        </div>
                        <div className="botones">
                            {/* Revisa la existencia de los botones */}
                            {this.props.botones.includes('Eliminar') ? 
                            <SubmitButton
                                icon={<BiIcons.BiTrash/>}
                                styles="fullWidth no_padding no_margin boton consulta btn-blanco"
                                text="Eliminar"
                                onclick={() => this.props.eliminarClick()}
                                disabled={this.props.permisos.includes('Eliminar') ? false : true}/>
                            : ''}
                            {this.props.botones.includes('Editar') ? 
                            <Link 
                                className="no-decor-link fullWidth no_padding no_margin boton btn-blanco"
                                to={`editar/${this.props.usuario._id}`}>
                                <BiIcons.BiPencil/>
                                <span>Editar</span>   
                            </Link>
                            : ''}
                            {this.props.botones.includes('Credencial') ? 
                            <SubmitButton
                                icon={<AiIcons.AiOutlineIdcard/>}
                                styles="fullWidth no_padding no_margin boton btn-blanco padding-top7"
                                onclick={() => this.props.cardClick()}
                                disabled={this.props.btnCardDisabled}
                                text="Credencial"/>
                            : ''}
                        </div>
                    </div>
                    <div className="columns">
                        <span className="azul">{`${this.props.usuario.rol[0].nombre}`}</span>
                        <div className="nombres">
                            <span className="texto_mediano">{`${this.props.usuario.nombre} `}</span>
                            <span className="texto_mediano no_margen">{`${this.props.usuario.aPaterno} ${this.props.usuario.aMaterno}`}</span>
                        </div>
                        <div className="columns">
                            {/* Renderiza las filas de contenido */}
                            {this.props.datos.filas.map((fila, filaIndex) => {
                                return(
                                    <div key={filaIndex} className="fila" style={{maxWidth:'518px'}}>
                                        {fila.seccion.map((seccion,secIndex) => {
                                            ancho = 518 / fila.seccion.lenght;
                                            return(
                                                <div key={secIndex} className="columns" style={{maxWidth:`${ancho}px`,overflowY:'hidden'}}>
                                                    <span className="etiqueta">{seccion.etiqueta.toUpperCase()}</span>
                                                    <span>{seccion.dato}</span>
                                                </div>
                                            )
                                        })}
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>

            </div>
        )
    }
}

export default UserSelected
