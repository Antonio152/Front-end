import React, { Component } from 'react'
import axios from 'axios'
import '../ConsultarUsuarios/ConsultaUsuarios.css'
import imgBusqueda from './img/addStudent.jpg'
import SelectField from '../GeneralUseComp/SelectField'
import SubmitButton from '../GeneralUseComp/SubmitButton'
import InputField from '../GeneralUseComp/InputField'
import * as BiIcons from 'react-icons/bi'
import * as AiIcons from 'react-icons/ai'
import UserStore from '../Stores/UserStore'

export class AltaAlumnos extends Component {

    //  Estado de la clase
    state = {
        usuarios : [],
        userQry : [],
        userAdded:[],
        permisos: [],
        // for the input field data
        username: '',
        password: '', 
        foto: '',
        nombre: '',
        aPaterno: '',
        aMaterno: '',
        curp: '',
        sanguineo: 'Selecciona',
        con_telefono: '',
        con_email: '',
        con_telEmergencia: '',
        dir_numero: '',
        dir_calle: '',
        dir_localidad: '',
        dir_ciudad: '',
        dir_estado: '',
        dir_cp: '',
        aca_carrera: 'Selecciona',
        aca_matricula: '',
        aca_cuatrimestre: 'Selecciona',
        
        // When a user clicks log in button and the API checks if user exists
        buttonDisabled: false,
    }

    // Obtiene los usuarios del servidor
    getUsuarios = async () => {
        const res = await axios.get('http://localhost:4000/api/users');
        this.setState({
            usuarios: res.data,
            userQry: res.data
        });
    }

    // Obtiene los modulos del servidor
    getModulos = async () => {
        const res = await axios.get(`http://localhost:4000/api/users/${UserStore.id}`);
        this.setState({permisos: res.data.rol[0].modulos[1].permisos});
    }

    setInputValue(property, val, maxLenght) {
        if (property === 'username' || 
            property === 'curp' || 
            property === 'con_telefono' || 
            property === 'con_telEmergencia' || 
            property === 'con_email' ||
            property === 'dir_cp' ||
            property === 'aca_matricula') 
        {
            val = val.trim(); // We don't want spaces
        }
        if (val.length > maxLenght)  // Max lenght
            return;
        this.setState({
            [property]: val
        });
    }

    // Estado cambia con los select
    setSelectValue = (e) => {
        this.setState({
            [e.target.name] : e.target.value
        });
    }

    altaAlumnos = async () => {
        await axios.post('http://localhost:4000/api/users', {
            username: this.state.username,
            password: this.state.password, 
            //foto: this.state.foto,
            nombre: this.state.nombre,
            aPaterno: this.state.aPaterno,
            aMaterno: this.state.aMaterno,
            curp: this.state.curp,
            sanguineo: this.state.sanguineo,
            contacto:[{
                telefono: this.state.con_telefono,
                email: this.state.con_email,
                telEmergencia: this.state.con_telEmergencia
            }],
            direccion:[{
                numero: this.state.dir_numero,
                calle: this.state.dir_calle,
                localidad: this.state.dir_localidad,
                ciudad: this.state.dir_ciudad,
                estado: this.state.dir_estado,
                cp: this.state.dir_cp
            }],
            academico:[{
                carrera: this.state.aca_carrera,
                matricula: this.state.aca_matricula,
                cuatrimestre: this.state.aca_cuatrimestre
            }]
        })
        //this.resetForm();
        //this.renderUserAdded();
    }

    // Deja el formulario en su estado original
    resetForm(){
        this.setState({
            username: '',
            password: '', 
            foto: '',
            nombre: '',
            aPaterno: '',
            aMaterno: '',
            curp: '',
            sanguineo: 'Selecciona',
            con_telefono: '',
            con_email: '',
            con_telEmergencia: '',
            dir_numero: '',
            dir_calle: '',
            dir_localidad: '',
            dir_ciudad: '',
            dir_estado: '',
            dir_cp: '',
            aca_carrera: 'Selecciona',
            aca_matricula: '',
            aca_cuatrimestre: 'Selecciona',
            buttonDisabled: false,
        })
    }

    componentDidMount() {
        this.getUsuarios();
        this.getModulos();
    }

    // Renderiza los datos del usuario agregado
    renderUserAdded () {
        if (this.state.userAdded.nombre) {
            return(
                <div className="column">
                    <div className="fila">
                        <div className="columns justificado_vert">
                            <div className="cont_foto">
                                <img className="foto_usuario" alt="" src={`data:image/jpg;base64,${this.state.userAdded.foto}`}/>
                            </div>
                            <div className="botones">
                                <SubmitButton 
                                    icon={<BiIcons.BiTrash/>} 
                                    styles="fullWidth no_padding no_margin boton consulta btn-blanco" 
                                    text="Eliminar"
                                    disabled={this.state.permisos.includes('Eliminar') ? false : true}/>
                                <SubmitButton 
                                    icon={<BiIcons.BiPencil/>} 
                                    styles="fullWidth no_padding no_margin boton btn-blanco" 
                                    text="Editar   "
                                    disabled={this.state.permisos.includes('Modificar') ? false : true}/>
                                <SubmitButton 
                                    icon={<AiIcons.AiOutlineIdcard/>} 
                                    styles="fullWidth no_padding no_margin boton btn-blanco padding-top7" 
                                    text="Credencial"/>
                            </div>
                        </div>
                        <div className="columns">
                            <span className="azul">{`${this.state.userAdded.rol[0].nombre}`}</span>
                            <div className="nombres">
                                <span className="texto_mediano">{`${this.state.userAdded.nombre} `}</span>
                                <span className="texto_mediano no_margen">{`${this.state.userAdded.aPaterno} ${this.state.userAdded.aMaterno}`}</span>
                            </div>
                            <div className="columns">
                                <div className="fila">
                                    <div className="columns">
                                        <span className="etiqueta">{`MATRÍCULA`}</span>
                                        <span>{`${this.state.userAdded.academico[0].matricula}`}</span>
                                    </div>
                                    <div className="columns">
                                        <span className="etiqueta">{`CURP`}</span>
                                        <span>{`${this.state.userAdded.curp}`}</span>
                                    </div>
                                    <div className="columns">
                                        <span className="etiqueta">{`GPO. SANGUÍNEO`}</span>
                                        <span>{`${this.state.userAdded.sanguineo}`}</span>
                                    </div>
                                </div>
                                <div className="fila">
                                    <div className="columns">
                                        <span className="etiqueta">{`EMAIL`}</span>
                                        <span>{`${this.state.userAdded.contacto[0].email}`}</span>
                                    </div>
                                    <div className="columns">
                                        <span className="etiqueta">{`TEL / TEL. SOS`}</span>
                                        <span>{`${this.state.userAdded.contacto[0].telefono} | ${this.state.userAdded.contacto[0].telEmergencia}`}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="columns">
                                <span className="etiqueta">DIRECCION</span>
                                <p className="direccion">
                                    <span>{`${this.state.userAdded.direccion[0].calle} ${this.state.userAdded.direccion[0].numero}, ${this.state.userAdded.direccion[0].localidad}, ${this.state.userAdded.direccion[0].ciudad}, ${this.state.userAdded.direccion[0].estado}. C.P.  ${this.state.userAdded.direccion[0].cp}`}</span>
                                </p>
                            </div>
                        </div>
                    </div>
                    
                </div>
            )
        }
        return(
            <div className="centrado">
                <span className="text no-seleccionado">No ha agregado un alumno</span>
            </div>
        )
    }

    // Renderizado del módulo
    render() {
        return (
            <div className="modulo max-1357px">
                <div className="resize-columna justificado ">
                    <div className="contenedor blanco full_width mh_img">
                        <img src={imgBusqueda} alt="" className="img_contenedor_principal"></img>
                        <div className="contenidoMod">
                        <br/><br/><h1 className="resize-title-alu title">Agregar alumnos...</h1><br/>
                        </div>
                    </div>
                    <div className="contenedor blanco mh_img datos_usuario">
                        <div className="contenidoMod ">
                            {/* Renderiza los datos del alumno agregado */}
                            {this.renderUserAdded()}
                        </div>
                    </div>
                </div>

                <div className="fila">
                    <div className="contenedor blanco full_width relleno">
                        <div className="contenidoMod">
                            <div className="fila justificado">
                                <div className="columns">
                                    <h1 className="title">Alumnos</h1>
                                    <p className="texto"><BiIcons.BiHelpCircle/>  Ingrese los datos requeridos obligatoriamente *.</p>
                                </div>
                                <div className="columns">
                                    <SubmitButton
                                        styles='btn width-auto size18 input-size-select'
                                        text='Agregar'
                                        icon={<BiIcons.BiUserPlus/>}
                                        onclick={() => this.altaAlumnos() }
                                    />
                                </div>
                            </div>

                            {/* Formulario para alta de alumno
                                ?Preguntar: caracteres maximos
                            */}
                            <div className="fila justificado">
                                <div className="columns ancho5 padding5">
                                    <h3>Datos generales</h3><br></br>
                                    <span className="text inputDesc">
                                        Nombre de usuario
                                    </span>
                                    <InputField
                                        type='text'
                                        placeholder="Usuario"
                                        value={ this.state.username ? this.state.username : ''}
                                        onChange={ (val) => this.setInputValue('username',val, 12) }
                                    />
                                    <span className="text inputDesc">
                                        Contraseña
                                    </span>
                                    <InputField
                                        type='password'
                                        placeholder="Contraseña"
                                        value={ this.state.password ? this.state.password : ''}
                                        onChange={ (val) => this.setInputValue('password',val, 32) }
                                    />
                                    <span className="text inputDesc">
                                        Nombre/s
                                    </span>
                                    <InputField
                                        type='text'
                                        placeholder="Nombre/s"
                                        value={ this.state.nombre ? this.state.nombre : ''}
                                        onChange={ (val) => this.setInputValue('nombre',val, 100) }
                                    />
                                    <span className="text inputDesc">
                                        Apellido paterno
                                    </span>
                                    <InputField
                                        type='text'
                                        placeholder="Apellido paterno"
                                        value={ this.state.aPaterno ? this.state.aPaterno : ''}
                                        onChange={ (val) => this.setInputValue('aPaterno',val, 100) }
                                    />
                                    <span className="text inputDesc">
                                        Apellido materno
                                    </span>
                                    <InputField
                                        type='text'
                                        placeholder="Apellido materno"
                                        value={ this.state.aMaterno ? this.state.aMaterno : ''}
                                        onChange={ (val) => this.setInputValue('aMaterno',val, 100) }
                                    />
                                    <span className="text inputDesc">
                                        CURP
                                    </span>
                                    <InputField
                                        type='text'
                                        placeholder="CURP"
                                        value={ this.state.curp ? this.state.curp : ''}
                                        onChange={ (val) => this.setInputValue('curp',val, 18) }
                                    />
                                    <span className="text inputDesc">
                                        Grupo sanguineo
                                    </span>
                                    <SelectField
                                        options={{
                                            nombre:[
                                                'Selecciona',
                                                'O-',
                                                'O+',
                                                'A-',
                                                'A+',
                                                'B-',
                                                'B+',
                                                'AB-',
                                                'AB+'
                                            ]}}
                                        value={this.state.sanguineo}
                                        name='sanguineo'
                                        onChange={this.setSelectValue}
                                    />
                                    <br></br>
                                    <h3>Datos de contacto</h3><br></br>
                                    <span className="text inputDesc">
                                        Teléfono móvil
                                    </span>
                                    <InputField
                                        type='text'
                                        placeholder="Teléfono móvil"
                                        value={ this.state.con_telefono ? this.state.con_telefono : ''}
                                        onChange={ (val) => this.setInputValue('con_telefono',val, 10) }
                                    />
                                    <span className="text inputDesc">
                                        Correo electrónico
                                    </span>
                                    <InputField
                                        type='text'
                                        placeholder="Email"
                                        value={ this.state.con_email ? this.state.con_email : ''}
                                        onChange={ (val) => this.setInputValue('con_email',val, 100) }
                                    />
                                    <span className="text inputDesc">
                                        Teléfono de emergencia
                                    </span>
                                    <InputField
                                        type='text'
                                        placeholder="Teléfono"
                                        value={ this.state.con_telEmergencia ? this.state.con_telEmergencia : ''}
                                        onChange={ (val) => this.setInputValue('con_telEmergencia',val, 10) }
                                    />
                                </div>
                                <div className="columns ancho5 padding5">
                                <h3>Datos de domicilio</h3><br></br>
                                    <span className="text inputDesc">
                                        Calle
                                    </span>
                                    <InputField
                                        type='text'
                                        placeholder="Calle"
                                        value={ this.state.dir_calle ? this.state.dir_calle : ''}
                                        onChange={ (val) => this.setInputValue('dir_calle',val, 50) }
                                    />
                                    <span className="text inputDesc">
                                        Número
                                    </span>
                                    <InputField
                                        type='text'
                                        placeholder="#"
                                        value={ this.state.dir_numero ? this.state.dir_numero : ''}
                                        onChange={ (val) => this.setInputValue('dir_numero',val, 6) }
                                    />
                                    <span className="text inputDesc">
                                        Colonia
                                    </span>
                                    <InputField
                                        type='text'
                                        placeholder="Colonia"
                                        value={ this.state.dir_localidad ? this.state.dir_localidad : ''}
                                        onChange={ (val) => this.setInputValue('dir_localidad',val, 50) }
                                    />
                                    <span className="text inputDesc">
                                        Ciudad
                                    </span>
                                    <InputField
                                        type='text'
                                        placeholder="Ciudad"
                                        value={ this.state.dir_ciudad ? this.state.dir_ciudad : ''}
                                        onChange={ (val) => this.setInputValue('dir_ciudad',val, 50) }
                                    />
                                    <span className="text inputDesc">
                                        Estado
                                    </span>
                                    <InputField
                                        type='text'
                                        placeholder="Estado"
                                        value={ this.state.dir_estado ? this.state.dir_estado : ''}
                                        onChange={ (val) => this.setInputValue('dir_estado',val, 50) }
                                    />
                                    <span className="text inputDesc">
                                        Código postal
                                    </span>
                                    <InputField
                                        type='text'
                                        placeholder="CP"
                                        value={ this.state.dir_cp ? this.state.dir_cp : ''}
                                        onChange={ (val) => this.setInputValue('dir_cp',val, 5) }
                                    />
                                    <br></br>
                                    <h3>Datos académicos</h3><br></br>
                                    <span className="text inputDesc">
                                        Matrícula
                                    </span>
                                    <InputField
                                        type='text'
                                        placeholder="ID"
                                        value={ this.state.aca_matricula ? this.state.aca_matricula : ''}
                                        onChange={ (val) => this.setInputValue('aca_matricula',val, 10) }
                                    />
                                    <span className="text inputDesc">
                                        Programa educativo
                                    </span>
                                    <SelectField
                                        options={{
                                            nombre:[
                                                'Selecciona',
                                                'Ingeniería en Software',
                                                'Ingeniería en Mecatrónica',
                                                'Ingeniería en Biomédica',
                                                'Ingeniería en Biotecnología',
                                                'Ingeniería en Telemática',
                                                'Ingeniería en Redes y Telecomunicaciones',
                                                'Ingeniería Mecánica Automotríz',
                                                'Ingeniería Sistemas y Tecnologías Industriales',
                                                'Licenciatura en Terapia física',
                                                'Licenciatura en Médico Cirujano'
                                            ]}}
                                        value={this.state.aca_carrera}
                                        name='aca_carrera'
                                        onChange={this.setSelectValue}
                                    />
                                    <span className="text inputDesc">
                                        Cuatrimestre
                                    </span>
                                    <SelectField
                                        options={{
                                            nombre:[
                                                'Selecciona',
                                                '1',
                                                '2',
                                                '3',
                                                '4',
                                                '5',
                                                '6',
                                                '7',
                                                '8',
                                                '9',
                                                '10'
                                            ]}}
                                        value={this.state.aca_cuatrimestre}
                                        name='aca_cuatrimestre'
                                        onChange={this.setSelectValue}
                                    />
                                    <span className="text inputDesc">
                                        Foto de perfil
                                    </span>
                                    <InputField
                                        type='file'
                                        placeholder="Foto"
                                        value={ this.state.foto ? this.state.foto : ''}
                                        onChange={ (val) => this.setInputValue('foto',val, 1000000n) }
                                    />
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
export default AltaAlumnos