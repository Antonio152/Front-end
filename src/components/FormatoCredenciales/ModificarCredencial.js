import React, { Component } from 'react'

import * as BiIcons from 'react-icons/bi';
import * as RiIcons from 'react-icons/ri';
import * as FaIcons from 'react-icons/fa';

import InputField from '../GeneralUseComp/InputField'
import SubmitButton from '../GeneralUseComp/SubmitButton'
import BtnSeccion from '../MyAccount/BtnSeccion'

import '../MyAccount/MyAccount.css'
import '../GeneralUseComp/InputFile.css'
import SelectField from '../GeneralUseComp/SelectField';

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
            <div>
                
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

    // Estado cambia con inputs
    setInputValue = (property, val, maxLenght) => {
        if (val.length > maxLenght)  //Max lenght
            return;
        this.setState({
            [property]: val // property = username or password
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

    // Un campo que puede ser editable al pasar el cursor sobre él
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
    
    // Un campo que puede ser editable al pasar el cursor sobre él
    inputSelectEditable = (tipo, nombre, valor, opciones) => {
        return(
            <div className="columns texto-editable">
                <div className="fila">
                    <span className="etiqueta" style={{marginLeft:'0'}}>{tipo.toUpperCase()}</span>
                    <RiIcons.RiAddLine className="lapiz-icon"/>
                </div>
                
                <SelectField
                    options={opciones}
                    value={valor}
                    name={nombre}
                    onChange={this.setSelectValue}
                    styles='no-border'
                />
            </div>
        )
    }

    render() {
        return (
            <div className="main_fila main">
                <div className="columns col-iz">
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
                    <div className="caja-main-iz" style={{height:'auto'}}>
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