import React, { Component } from 'react'

import * as HiIcons from 'react-icons/hi';
import * as AiIcons from 'react-icons/ai';

import UserStore from '../Stores/UserStore'

import InputField from '../GeneralUseComp/InputField'
import SubmitButton from '../GeneralUseComp/SubmitButton'
import BtnSeccion from '../AgregarUsuarios/BtnSeccion'

import '../AgregarUsuarios/MyAccount.css'
import '../GeneralUseComp/InputFile.css'
import SelectField from '../GeneralUseComp/SelectField';

const Compress = require('compress.js')

export class MyAccount extends Component {
    imgRef = React.createRef() 
    state = {
        zona: 'personales',
        // for the input field data
        username: UserStore.username,
        password: '', 
        fotoAnt: UserStore.photo,
        foto: UserStore.photo,
        nombre: UserStore.name,
        aPaterno: UserStore.lastNameP,
        aMaterno: UserStore.lastNameM ? UserStore.lastNameM : '',
        curp: UserStore.curp,
        sanguineo: UserStore.rh,
        con_telefono: UserStore.tel,
        con_email: UserStore.email,
        con_telEmergencia: UserStore.telEmer,
        dir_numero: UserStore.streetNo,
        dir_calle: UserStore.street,
        dir_localidad: UserStore.location,
        dir_ciudad: UserStore.city,
        dir_estado: UserStore.state,
        dir_cp: UserStore.postalCode,
        aca_carrera: UserStore.career ? UserStore.career : '',
        aca_matricula: UserStore.idStudent ? UserStore.idStudent : '',
        aca_cuatrimestre: UserStore.grade ? UserStore.grade : '',
    }
    // Renderiza los inputs que podrán ser cambiados
    renderDatos = () => {
        if (this.state.zona === 'personales')
            return(
                <div>
                    <div className="columns">
                        <span className="etiqueta" style={{marginLeft:'0'}}>ROL</span>
                        <span className="span-descriptivo" style={{color:'#b4b4b4'}}>{UserStore.role}</span>
                    </div>
                    
                    {this.inputTextEditable('Nombre(s)', this.state.nombre, 'text', 'nombre', 100)}

                    {this.inputTextEditable('Apellido paterno',this.state.aPaterno, 'text', 'aPaterno', 50)}

                    {this.inputTextEditable('Apellido Materno',this.state.aMaterno, 'text', 'aMaterno', 50)}
                    
                    <div className="fila">
                        {this.inputTextEditable('CURP',this.state.curp, 'text', 'curp', 18)}
                        <div className="inp-numero">
                            {this.inputSelectEditable(
                                'RH',
                                'sanguineo',
                                this.state.sanguineo,
                                {nombre:[ 'O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+']}
                                )}
                        </div>
                    </div>
                    
                    
                </div>
            )
        if (this.state.zona === 'direccion')
            return(
                <div>
                    <div className="fila">
                        {this.inputTextEditable('Calle',this.state.dir_calle, 'text', 'dir_calle', 50)}
                        <div className="inp-numero">
                            {this.inputTextEditable('Numero',this.state.dir_numero, 'text', 'dir_numero', 10)}
                        </div>
                    </div>
                    <div className="fila">
                        {this.inputTextEditable('Localidad',this.state.dir_localidad, 'text', 'dir_localidad', 100)}
                        <div className="inp-numero">
                            {this.inputTextEditable('C.P.',this.state.dir_cp, 'text', 'dir_cp', 10)}
                        </div>
                    </div>
                    {this.inputTextEditable('Ciudad',this.state.dir_ciudad, 'text', 'dir_ciudad', 100)}

                    {this.inputTextEditable('Estado',this.state.dir_estado, 'text', 'dir_estado', 50)}
                </div>
            )
        if (this.state.zona === 'contacto')
        return(
            <div>
                <div className="columns">
                    <span className="etiqueta" style={{marginLeft:'0'}}>CORREO ELECTRÓNICO</span>
                    <span className="span-descriptivo" style={{color:'#b4b4b4'}}>{UserStore.email}</span>
                </div>
                
                {this.inputTextEditable('Teléfono',this.state.con_telefono, 'text', 'con_telefono', 10)}

                {this.inputTextEditable('Teléfono Emer.',this.state.con_telEmergencia, 'text', 'con_telEmergencia', 10)}
            </div>
        )
        if (this.state.zona === 'cuenta')
        return(
            <div>
                <div className="columns">
                    <span className="etiqueta" style={{marginLeft:'0'}}>CORREO ELECTRÓNICO</span>
                    <span className="span-descriptivo" style={{color:'#b4b4b4'}}>{UserStore.email}</span>
                </div>
                <div className="columns">
                    <span className="etiqueta" style={{marginLeft:'0'}}>USUARIO</span>
                    <span className="span-descriptivo" style={{color:'#b4b4b4'}}>{UserStore.username}</span>
                </div>
                
                {this.inputTextEditable('Nueva contraseña', this.state.password, 'password','password', 32)}
            </div>
        )
        if (this.state.zona === 'academico')
        return(
            <div>
                <div className="columns">
                    <span className="etiqueta" style={{marginLeft:'0'}}>CARRERA</span>
                    <span className="span-descriptivo" style={{color:'#b4b4b4'}}>{UserStore.career}</span>
                </div>
                <div className="columns">
                    <span className="etiqueta" style={{marginLeft:'0'}}>MATRÍCULA</span>
                    <span className="span-descriptivo" style={{color:'#b4b4b4'}}>{UserStore.idStudent}</span>
                </div>
                
                <div className="inp-numero">
                    {this.inputSelectEditable(
                        'Cuatrimestre',
                        'aca_cuatrimestre',
                        this.state.aca_cuatrimestre,
                        {nombre:[ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]}
                        )}
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
                    <HiIcons.HiOutlinePencil className="lapiz-icon"/>
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
                    <HiIcons.HiOutlinePencil className="lapiz-icon"/>
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
                        <span className="etiqueta" style={{marginLeft:'0', marginBottom:'10px'}}>FOTO DE PERFIL</span>
                        <div className="fila cambia-cont cont_foto_usuario ">
                            <img 
                            ref={this.imgRef} 
                            className="foto-grande" 
                            alt="" 
                            src={`data:image;base64,${this.state.foto}`}
                            onLoad={()=> {
                                // Verifica que la foto sea cuadrada
                                if (this.imgRef.current.clientHeight===this.imgRef.current.clientWidth)
                                    this.setState({
                                        fotoAnt : this.state.foto
                                    })
                                else{
                                    this.setState({
                                        foto: this.state.fotoAnt
                                    })
                                    //alert('La relación de aspecto debe ser cuadrada')
                                }}
                            }/>
                            <div className="file-middle">
                                <input 
                                    type="file" 
                                    name="file" 
                                    id="file" 
                                    className={`inputfile square150px`} 
                                    onChange = {(e) => this.resizeImageFn(e.target.files)}
                                    accept="image/*"
                                    />
                                <label htmlFor="file"><AiIcons.AiOutlineCloudUpload/>Subir</label>
                            </div>
                            
                        </div>
                        <div className="horizontal-line"/>

                        <BtnSeccion
                            activo={this.state.zona === 'personales' ? true : false}
                            nombre='Datos personales'
                            descripcion='Nombre, apellidos, contraseña, curp, grupo sanguíneo'
                            onclick={ () =>  this.setState({zona:'personales'}) }
                        />

                        <BtnSeccion
                            activo={this.state.zona === 'direccion' ? true : false}
                            nombre='Dirección'
                            descripcion='Calle, número, localidad, ciudad, estado, C.P.'
                            onclick={ () => this.setState({zona:'direccion'}) }
                        />
                        
                        {UserStore.role === 'Alumno' ?
                        <BtnSeccion
                            activo={this.state.zona === 'academico' ? true : false}
                            nombre='Académico'
                            descripcion='Carrera, cuatrimestre, matrícula'
                            onclick={ () => this.setState({zona:'academico'}) }
                        />
                        : <></>}
                        
                        <BtnSeccion
                            activo={this.state.zona === 'contacto' ? true : false}
                            nombre='Contacto'
                            descripcion='Correo electrónico, teléfono, teléfono de emergencia'
                            onclick={ () => this.setState({zona:'contacto'}) }
                        />

                        <BtnSeccion
                            activo={this.state.zona === 'cuenta' ? true : false}
                            nombre='Cuenta'
                            descripcion='Correo electrónico, nombre de usuario, contraseña'
                            onclick={ () => this.setState({zona:'cuenta'}) }
                        />

                        <div style={{textAlign:'center', marginTop:'10px'}}>
                            <SubmitButton
                            text="Guardar cambios"
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

export default MyAccount
