import React, { Component } from 'react'

import * as BiIcons from 'react-icons/bi';
import * as RiIcons from 'react-icons/ri';
import * as FaIcons from 'react-icons/fa';

import InputField from '../GeneralUseComp/InputField'
import SubmitButton from '../GeneralUseComp/SubmitButton'
import BtnSeccion from '../AgregarUsuarios/BtnSeccion'
import Credencial from './Credencial'

import '../AgregarUsuarios/MyAccount.css'
import '../GeneralUseComp/InputFile.css'
import SelectField from '../GeneralUseComp/SelectField';
import './ModificarCredencial.css'

import '../ConsultarUsuarios/ConsultaUsuarios.css'

const Compress = require('compress.js')

export class ModificarCredencial extends Component {
    imgRef = React.createRef() 
    state = {
        zona: 'tipo1',
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
        )

        if (this.state.zona === 'tipo2')
            return(
                <div>
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
                </div>
            </div>
        )
    }
}

export default ModificarCredencial
