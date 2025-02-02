import React, { Component } from 'react'
import axios from 'axios'
import '../ConsultarUsuarios/ConsultaUsuarios.css'
import './ConsultaCredencial.css'
import Credencial from '../FormatoCredenciales/Credencial'
import CredencialT from '../FormatoCredenciales/CredencialT'
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
        direccion: {},
        btnImprimirDisabled: false
    }

    //Obtiene el usuario el id
    async componentDidMount() {
        const res = await axios.get('https://node-server-credenciales.herokuapp.com/api/users/' + UserStore.id);
        this.setState({ 
            usuario: res.data ,
            rol: res.data.rol[0],
            academico: res.data.academico[0],
            contacto: res.data.contacto[0],
            direccion: res.data.direccion[0]
        })
    }

    
    // Obtiene el archivo PDF en base 64
    getCredenciales = async (datos, formato) => {
        this.setState({btnImprimirDisabled: true});
        const enviados = {
            usuarios: datos,
            formato: formato
        };
        console.log(enviados);
        const res = await axios.post('https://node-server-credenciales.herokuapp.com/cards', enviados);
        this.setState({btnImprimirDisabled: false});
        this.generarArchivo(res.data.pdf, 'Credenciales');
    }

    //Convierte el archivo de base 64 a uno descargable
    generarArchivo = (content, fileName) => {
        // Decodifica base 64 y remueve el espacio para compatibilidad con  IE
        var binary = atob(content.replace(/\s/g, ''));
        var len = binary.length;
        // Buffer de datos y u
        var buffer = new ArrayBuffer(len);
        // array de enteros sin signo de 8 bits
        var view = new Uint8Array(buffer);
        // Decodifica caracter a caracter
        for (var i = 0; i < len; i++) {
            view[i] = binary.charCodeAt(i);
        }
        // Blob de datos
        const blob = new Blob([view], { type: "application/pdf" });
        // Crea link de descarga automático
        const link = document.createElement("a");
        link.href = window.URL.createObjectURL(blob);
        link.download = fileName;
        link.click();
    };
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
        var arrIds = [];
        arrIds.push(UserStore.id);
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
            </div>
            <div className="fila justificado">
                <div className="columna ">
                    <div className="contenedor-blanco ">
                        <div className="contenidoMod ">
                            <div className="fila justificado">
                                <h1 className="title">Vista previa</h1>
                                <SubmitButton styles=' fila fullWidth consulta padding-10 left-padding' text='imprimir' icon={<AiIcons.AiOutlinePrinter/>}
                                onclick = {() => {
                                    this.getCredenciales(arrIds, UserStore.role === 'Alumno' ? 'UPPCredencial1' : 'UPPCredencial2');
                                    alert('Se está generando el archivo para su descarga.');
                                }}
                                disabled={this.state.btnImprimirDisabled}/>
                            </div>
                            <br/>
                            {UserStore.role === 'Alumno' ? 
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
                                :
                                <CredencialT
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
                            }
                        </div>
                    </div>
                </div>
            </div>
            </div>
        )
    }
}

export default ConsultaCredencial

