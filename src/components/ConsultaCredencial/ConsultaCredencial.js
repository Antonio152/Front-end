import React, { Component } from 'react'
import axios from 'axios'
import '../ConsultarUsuarios/ConsultaUsuarios.css'
import './ConsultaCredencial.css'
import Credencial from './Cedencial'
import SubmitButton from '../GeneralUseComp/SubmitButton'
import * as AiIcons from 'react-icons/ai'
import UserStore from '../Stores/UserStore'
import Loader from '../GeneralUseComp/Loader'

export class ConsultaCredencial extends Component {

    state = {
        usuario: {},
        rol: {},
        academico: {},
        contacto: {},
        direccion: {}
    }

    //Obtiene el usuario el id
    async componentDidMount() {
        const res = await axios.get('http://localhost:4000/api/users/' + UserStore.id);
        this.setState({ 
            usuario: res.data ,
            rol: res.data.rol[0],
            academico: res.data.academico[0],
            contacto: res.data.contacto[0],
            direccion: res.data.direccion[0]
        })
    }
    //Renderiza el usuario cargado con el id
    renderUserSelected () {
        if (this.state.usuario.nombre)
        return(
            <div className="column">
                <div className="fila">
                    <div className="columns justificado_vert">
                        <div className="cont_foto_cons">
                            <img className="foto-alumno" alt="" src={`data:image/jpg;base64,${this.state.usuario.foto ? this.state.usuario.foto : ''}`}/>
                        </div>
                    </div>
                    <div className="columns">
                        <span className="azul">{`${this.state.rol.nombre}`}</span>
                        <div className="nombres">
                            <span className="texto_mediano">{`${this.state.usuario.nombre} `}</span>
                            <span className="texto_mediano no_margen">{`${this.state.usuario.aPaterno} ${this.state.usuario.aMaterno}`}</span>
                        </div>
                        <div className="columns">
                            <div className="fila">
                                <div className="columns">
                                    <span className="etiqueta">{`MATRÍCULA`}</span>
                                    <span>{`${this.state.academico.matricula}`}</span>
                                </div>
                                <div className="columns dato-alumno">
                                    <span className="etiqueta ">{`CURP`}</span>
                                    <span>{`${this.state.usuario.curp}`}</span>
                                </div>
                                <div className="columns dato-alumno">
                                    <span className="etiqueta">{`GPO. SANGUÍNEO`}</span>
                                    <span>{`${this.state.usuario.sanguineo}`}</span>
                                </div>
                            </div>
                            <div className="fila">
                                <div className="columns">
                                    <span className="etiqueta">{`EMAIL`}</span>
                                    <span>{`${this.state.contacto.email}`}</span>
                                </div>
                                <div className="columns dato-alumno">
                                    <span className="etiqueta">{`TELÉFONO`}</span>
                                    <span>{`${this.state.contacto.telefono}`}</span>
                                </div>
                                <div className="columns dato-alumno">
                                    <span className="etiqueta">{`TEL. SOS`}</span>
                                    <span>{`${this.state.contacto.telEmergencia}`}</span>
                                </div>
                            </div>
                        </div>
                        <div className="columns">
                            <span className="etiqueta">DIRECCION</span>
                            <p className="direccion">
                                <span>{`${this.state.direccion.calle} ${this.state.direccion.numero}, ${this.state.direccion.localidad}, ${this.state.direccion.ciudad}, ${this.state.direccion.estado}. C.P.  ${this.state.direccion.cp}`}</span>
                            </p>
                        </div>
                    </div>
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

    render() {
        return (
            <div className="">
            <div className="fila">
                <div className="columna">
                    <div className="contenedor-blanco">
                        <div className="contenidoMod ">
                            {/* Renderiza los datos del usuario seleccionado */}
                            {this.renderUserSelected()}
                        </div>
                    </div>
                </div>
                <div className="columna">
                    <div className="contenedor-blanco tipo">
                        <div className="contenidoMod">
                            <div className="fila">
                            <h1 className="title">Tipo</h1>
                            </div>
                            <br/>
                            <div className="columns">
                                <div className="fila">
                                    <label className="radio-cont">Tipo 1
                                        <input type="radio"  name="radio" value="Tipo 1"/>
                                        <span className="checkmark"></span>
                                    </label>
                                </div>
                                <div className="fila">
                                    <label className="radio-cont">Tipo 2
                                        <input type="radio" id="tipo1" name="radio" value="Tipo 1"/>
                                        <span className="checkmark"></span>
                                    </label>
                                </div>
                                <SubmitButton styles=' fila fullWidth consulta padding-10 left-padding' text='imprimir' icon={<AiIcons.AiOutlinePrinter/>}/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="fila justificado">
                <div className="columna ">
                    <div className="contenedor-blanco ">
                        <div className="contenidoMod ">
                            <h1 className="title">Vista previa</h1>
                            <br/>
                            <Credencial
                            alumno={this.state}
                            universidad={{
                                nombre:'Universidad Politécnica de Pachuca',
                                lema: 'Una universidad para la Investigación',
                                departamento:'',
                                pagWeb: 'www.upp.edu.mx',
                                direccion: '<b>Universidad Politécnica de Pachuca</b></br>Carr. Pachuca-Ciudad Sahagún km 20.</br>Ex Hacienda de Sta.Bárbara, Zempoala, Hidalgo.</br>C.P. 43830 Tel 01(771)547 7510 ext. 2213'
                            }}
                            direccion={{nombre:'Dr. Marco Antonio Flores Gonzáles', cargo:'Rector'}}
                            colores={{
                                colorLinea: '#70AD47',
                                colorPrinc: '#461E68',
                                colorCarrera:'white',
                            }}
                            
                            />
                        </div>
                    </div>
                </div>
            </div>
            </div>
        )
    }
}

export default ConsultaCredencial

