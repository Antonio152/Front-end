import React, { Component } from 'react'

import * as AiIcons from 'react-icons/ai';
import * as BiIcons from 'react-icons/bi';
import * as RiIcons from 'react-icons/ri';

import InputField from '../GeneralUseComp/InputField'
import SubmitButton from '../GeneralUseComp/SubmitButton'
import BtnSeccion from '../AgregarUsuarios/BtnSeccion'

import '../AgregarUsuarios/MyAccount.css'
import '../GeneralUseComp/InputFile.css'
import SelectField from '../GeneralUseComp/SelectField';

const Compress = require('compress.js')

export class AltaAlumnos extends Component {
    imgRef = React.createRef() 
    state = {
        zona: 'personales',
        // for the input field data
        username: '',
        password: '', 
        fotoAnt: '',
        foto: '',
        rol: '',
        nombre: '',
        aPaterno: '',
        aMaterno: '',
        curp: '',
        sanguineo: '',
        con_telefono: '',
        con_email: '',
        con_telEmergencia: '',
        dir_numero: '',
        dir_calle: '',
        dir_localidad: '',
        dir_ciudad: '',
        dir_estado: '',
        dir_cp: '',
        aca_carrera: '',
        aca_matricula: '',
        aca_cuatrimestre: '',
    }
    // Renderiza los inputs que podrán ser cambiados
    renderDatos = () => {

        if (this.state.zona === 'cuenta')
        return(
            <div>

                {this.inputSelectEditable(
                    'ROL',
                    'rol',
                    this.state.rol,
                    {nombre:[ 'Super Administrador', 'Administrador', 'Administrador del sistema', 'Administrador de la escuela', 'Consultor', 'Diseñador', 'Alumno']}
                )}

                {this.inputTextEditable('Nombre de usuario', this.state.username, 'text', 'nombre', 12)}
                
                {this.inputTextEditable('Contraseña', this.state.password, 'password','password', 32)}
            </div>
        )

        if (this.state.zona === 'academico')
            return(
                <div>

                    {this.inputTextEditable('Matrícula',this.state.aca_matricula, 'text', 'aca_matricula', 10)}

                    {this.inputSelectEditable(
                        'CARRERA',
                        'aca_carrera',
                        this.state.aca_carrera,
                        {nombre:['Ingeniería en Software',
                        'Ingeniería en Mecatrónica',
                        'Ingeniería en Biomédica',
                        'Ingeniería en Biotecnología',
                        'Ingeniería en Telemática',
                        'Ingeniería en Redes y Telecomunicaciones',
                        'Ingeniería Mecánica Automotríz',
                        'Ingeniería Sistemas y Tecnologías Industriales',
                        'Licenciatura en Terapia física',
                        'Licenciatura en Médico Cirujano']}
                    )}
                    
                    <div className="inp-numero">
                        {this.inputSelectEditable(
                            'Cuatrimestre',
                            'aca_cuatrimestre',
                            this.state.aca_cuatrimestre,
                            {nombre:[ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]}
                        )}
                    </div>
                    
                </div>
            )

        if (this.state.zona === 'personales')
            return(
                <div>
                    
                    {this.inputTextEditable('Nombre(s)', this.state.nombre, 'text', 'nombre', 100)}

                    {this.inputTextEditable('Apellido paterno',this.state.aPaterno, 'text', 'aPaterno', 50)}

                    {this.inputTextEditable('Apellido materno',this.state.aMaterno, 'text', 'aMaterno', 50)}
                    
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
                    {this.inputTextEditable('Correo electrónico',this.state.con_email, 'text', 'con_email', 100)}
                    
                    {this.inputTextEditable('Teléfono',this.state.con_telefono, 'text', 'con_telefono', 10)}

                    {this.inputTextEditable('Teléfono Emer.',this.state.con_telEmergencia, 'text', 'con_telEmergencia', 10)}
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
                            <br></br><br></br><br></br><br></br><br></br><br></br><br></br><br></br>
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
                            activo={this.state.zona === 'cuenta' ? true : false}
                            nombre='Cuenta'
                            descripcion='Rol, nombre de usuario, contraseña'
                            onclick={ () => this.setState({zona:'cuenta'}) }
                        />

                        <BtnSeccion
                            activo={this.state.zona === 'personales' ? true : false}
                            nombre='Datos personales'
                            descripcion='Nombre, apellidos, contraseña, curp, grupo sanguíneo'
                            onclick={ () =>  this.setState({zona:'personales'}) }
                        />

                        <BtnSeccion
                            activo={this.state.zona === 'academico' ? true : false}
                            nombre='Académico'
                            descripcion='Matrícula, carrera, cuatrimestre'
                            onclick={ () => this.setState({zona:'academico'}) }
                        />

                        <BtnSeccion
                            activo={this.state.zona === 'direccion' ? true : false}
                            nombre='Dirección'
                            descripcion='Calle, número, localidad, ciudad, estado, C.P.'
                            onclick={ () => this.setState({zona:'direccion'}) }
                        />
                        
                        <BtnSeccion
                            activo={this.state.zona === 'contacto' ? true : false}
                            nombre='Contacto'
                            descripcion='Correo electrónico, teléfono, teléfono de emergencia'
                            onclick={ () => this.setState({zona:'contacto'}) }
                        />

                        <div style={{textAlign:'center', marginTop:'10px'}}>
                            <SubmitButton
                            text="Agregar alumno"
                            icon={<BiIcons.BiUserPlus/>}
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

export default AltaAlumnos
