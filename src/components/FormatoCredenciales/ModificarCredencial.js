import React, { Component } from 'react'

import * as FaIcons from 'react-icons/fa';
import * as RiIcons from 'react-icons/ri';

import SubmitButton from '../GeneralUseComp/SubmitButton'
import BtnSeccion from '../AgregarUsuarios/BtnSeccion'
import Credencial from './Credencial'
import CredencialT from './CredencialT'
import InputField from '../GeneralUseComp/InputField'

import '../AgregarUsuarios/MyAccount.css'
import '../GeneralUseComp/InputFile.css'
import './ModificarCredencial.css'

import '../ConsultarUsuarios/ConsultaUsuarios.css'

const Compress = require('compress.js')

export class ModificarCredencial extends Component {
    imgRef = React.createRef() 
    state = {
        zona: 'tipo1',
        zona1: 'colores'
    }

    // Renderiza los inputs que podrán ser cambiados
    renderDatos = () => {
        
        if (this.state.zona === 'tipo1')
            return(
                <div className="columns col-iz">
                    <div className="fila">
                        <div className="columns">
                            <Credencial
                                universidad={{
                                    nombre:'Nombre de la universidad',
                                    lema: 'Lema de la universidad',
                                    departamento:'',
                                    pagWeb: 'Web de la universidad',
                                    direccion: '<b>Nombre de la universidad</b></br>Dirección parte 1</br>Dirección parte 2</br>Dirección parte 3'
                                }}
                                direccion={{nombre:'Nombre del rector de la universidad', cargo:'Cargo'}}
                                colores={{
                                    colorLinea: '#70AD47',
                                    colorPrinc: '#461E68',
                                    colorCarrera:'white',
                                }}
                            />
                        </div>
                    </div>
                </div>
            )

        if (this.state.zona === 'tipo2')
            return(
                <div className="columns col-iz">
                    <div className="fila">
                        <div className="columns">
                            <CredencialT
                                universidad={{
                                    nombre:'Nombre de la universidad',
                                    lema: 'Lema de la universidad',
                                    departamento:'',
                                    pagWeb: 'Web de la universidad',
                                    direccion: '<b>Nombre de la universidad</b></br>Dirección parte 1</br>Dirección parte 2</br>Dirección parte 3'
                                }}
                                direccion={{nombre:'Nombre del rector de la universidad', cargo:'Cargo'}}
                                colores={{
                                    colorLinea: '#70AD47',
                                    colorPrinc: '#461E68',
                                    colorCarrera:'white',
                                }}
                            />
                        </div>
                    </div>
                </div>
            )
    }

    renderFormato = () => {
        
        if (this.state.zona1 === 'colores')
            return(
                <div>
                    <div className="columns">
                        <span className="etiqueta" style={{marginLeft:'0'}}>FONDO FRONTAL</span>
                        <span className="span-descriptivo" style={{color:'#b4b4b4'}}>{}</span>
                    </div>

                    <div className="columns">
                        <span className="etiqueta" style={{marginLeft:'0'}}>FONDO TRASERO</span>
                        <span className="span-descriptivo" style={{color:'#b4b4b4'}}>{}</span>
                    </div>

                    <div className="columns">
                        <span className="etiqueta" style={{marginLeft:'0'}}>COLOR FUENTE-TITULOS</span>
                        <span className="span-descriptivo" style={{color:'#b4b4b4'}}>{}</span>
                    </div>

                    <div className="columns">
                        <span className="etiqueta" style={{marginLeft:'0'}}>COLOR FUENTE-CONTENIDO</span>
                        <span className="span-descriptivo" style={{color:'#b4b4b4'}}>{}</span>
                    </div>

                    <div className="columns">
                        <span className="etiqueta" style={{marginLeft:'0'}}>COLOR BARRA</span>
                        <span className="span-descriptivo" style={{color:'#b4b4b4'}}>{}</span>
                    </div>
                
                </div>
            )
        
        if (this.state.zona1 === 'logos')
            return(
                <div>
                    <div className="columns">
                        <span className="etiqueta" style={{marginLeft:'0'}}>ESCUDO UNIVERSIDAD</span>
                        <span className="span-descriptivo" style={{color:'#b4b4b4'}}>{}</span>
                    </div>

                    <div className="columns">
                        <span className="etiqueta" style={{marginLeft:'0'}}>AUTORIDAD 1</span>
                        <span className="span-descriptivo" style={{color:'#b4b4b4'}}>{}</span>
                    </div>

                    <div className="columns">
                        <span className="etiqueta" style={{marginLeft:'0'}}>AUTORIDAD 2</span>
                        <span className="span-descriptivo" style={{color:'#b4b4b4'}}>{}</span>
                    </div>

                    <div className="columns">
                        <span className="etiqueta" style={{marginLeft:'0'}}>AUTORIDAD 3</span>
                        <span className="span-descriptivo" style={{color:'#b4b4b4'}}>{}</span>
                    </div>

                    <div className="columns">
                        <span className="etiqueta" style={{marginLeft:'0'}}>AUTORIDAD 4</span>
                        <span className="span-descriptivo" style={{color:'#b4b4b4'}}>{}</span>
                    </div>

                    <div className="columns">
                        <span className="etiqueta" style={{marginLeft:'0'}}>FIRMA</span>
                        <span className="span-descriptivo" style={{color:'#b4b4b4'}}>{}</span>
                    </div>

                    <div className="columns">
                        <span className="etiqueta" style={{marginLeft:'0'}}>PERÍODO</span>
                        <span className="span-descriptivo" style={{color:'#b4b4b4'}}>{}</span>
                    </div>
                </div>
            )

        if (this.state.zona1 === 'textos')
            return(
                <div>
                    <div className="columns">
                        {this.inputTextEditable('NOMBRE UNIVERSIDAD', this.state.username, 'text', 'nombre', 12)}
                        {this.inputTextEditable('LEMA', this.state.username, 'text', 'LEMA', 12)}
                        {this.inputTextEditable('NOMBRE DEL RECTOR', this.state.username, 'text', 'RECTOR', 12)}
                        {this.inputTextEditable('CARGO', this.state.username, 'text', 'CARGO', 12)}
                        {this.inputTextEditable('DIRECCIÓN DE LA UNIVERSIDAD', this.state.username, 'text', 'dirección', 12)}
                    </div>
                </div>
            )
    }

    // Estado cambia con los select
    setSelectValue = (e) => {
        this.setState({
            [e.target.name] : e.target.value
        });
    }

    resizeImageFn = (archivos) => {
        Array.from(archivos).forEach(archivo => {
            const compress = new Compress();
            compress.compress([archivo], {
            size: 0.04, // the max size in MB, defaults to 2MB
            quality: 0.90, // the quality of the image, max is 1,
            maxWidth: 200, // the max width of the output image, defaults to 1920px
            maxHeight: 200, // the max height of the output image, defaults to 1920px
            resize: true // defaults to true, set false if you do not want to resize the image width and height
            }).then((results) => {
                const img = results[0]
                const base64str = img.data
                // const imgExt = img.ext
                // const file = Compress.convertBase64ToFile(base64str, imgExt)
                this.setState({
                    foto: base64str
                })
            })
        })
    }

    render() {
        return (
            
            <div><span className="banner" style={{marginLeft:'0'}} ><h1>Modulo en construcción</h1></span>
            <div className="main_fila main"> 
                <div>
                    <div className="caja-main-iz" style={{height:'auto'}}>
                        <span className="etiqueta" style={{marginLeft:'0', marginBottom:'10px'}}>FORMATO DE CREDENCIALES</span>
                        <div className="horizontal-line"/>
                        
                            <BtnSeccion
                                activo={this.state.zona === 'tipo1' ? true : false}
                                nombre='Tipo 1'
                                descripcion='Credencial de estudiante'
                                onclick={ () => this.setState({zona:'tipo1'}) }
                            />

                            <BtnSeccion
                                activo={this.state.zona === 'tipo2' ? true : false}
                                nombre='Tipo 2'
                                descripcion='Credencial de trabajador'
                                onclick={ () =>  this.setState({zona:'tipo2'}) }
                            />
                        
                    </div>

                    <br></br><br></br><br></br><br></br>

                    <div className="caja-main-iz" style={{height:'auto'}}>
                        <span className="etiqueta" style={{marginLeft:'0', marginBottom:'10px'}}>SECCIÓN CREDENCIAL</span>
                        <div className="horizontal-line"/>
                        
                            <BtnSeccion
                                activo={this.state.zona1 === 'colores' ? true : false}
                                nombre='Colores'
                                descripcion='De fondo, de fuente, de barras, ...'
                                onclick={ () => this.setState({zona1:'colores'}) }
                            />

                            <BtnSeccion
                                activo={this.state.zona1 === 'logos' ? true : false}
                                nombre='Logos / escudos / imágenes'
                                descripcion='De universidad, de autoridades, ...'
                                onclick={ () =>  this.setState({zona1:'logos'}) }
                            />

                            <BtnSeccion
                                activo={this.state.zona1 === 'textos' ? true : false}
                                nombre='Textos'
                                descripcion='Titulos, lemas, dirección, ...'
                                onclick={ () =>  this.setState({zona1:'textos'}) }
                            />

                        <div style={{textAlign:'center', marginTop:'10px'}}>
                            <SubmitButton
                            text="Guardar formato"
                            icon={<FaIcons.FaAddressCard/>}
                            styles="no_margin"
                            />
                        </div>
                        
                    </div>
                </div>
                <div className="columns col-iz">
                    <div className="fila">
                        <div className="columns">
                            {this.renderDatos()}
                        </div>
                    </div>
                    <div className="caja-main-iz" style={{height:'auto'}}>
                        <div className="columns">
                            {this.renderFormato()}
                        </div>
                    </div>
                </div>
            </div>
            </div>
        )
    }
    inputTextEditable = (titulo, dato, tipo, estado, longitud) => {
        return(
            <div className="columns texto-editable">
                <div className="fila">
                    <span className="etiqueta" style={{marginLeft:'0'}}>{titulo.toUpperCase()}</span>
                    <RiIcons.RiAddLine className="lapiz-icon"/>
                </div>
                
                <InputField
                    type={tipo}
                    value={dato}
                    noBorder={true}
                    onChange={(val) => this.setInputValue(estado,val,longitud)}
                    placeholder={titulo}
                />
            </div>
            
        )
    }
}



export default ModificarCredencial
