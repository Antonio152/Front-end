import React, { Component } from 'react'
import axios from 'axios'
import '../ConsultarUsuarios/ConsultaUsuarios.css'
import imgBusqueda from './img/busqueda.jpg'
import SelectField from '../GeneralUseComp/SelectField'
import SubmitButton from '../GeneralUseComp/SubmitButton'
import InputField from '../GeneralUseComp/InputField'
import * as BiIcons from 'react-icons/bi'
import * as AiIcons from 'react-icons/ai'
import UserStore from '../Stores/UserStore'

export class ConsultaAlumnos extends Component {

    // Estado de la case
    state = {
        usuarios : [],
        userQry : [],
        userSelected:[],
        consulta: 'Todos',
        nombre: '',
        aPaterno: '',
        aMaterno: '',
        matricula: '',
        carrera: 'Ingeniería en Software',
        estado: 'Activo',
        permisos: []
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

    // Estado cambia con inputs
    setInputValue = (property, val, maxLenght) => {
        val = val.trim(); // we don't want spaces
        if (val.length > maxLenght)  //Max lenght
            return;
        this.setState({
            [property]: val // property = username or password
        });
    }

    // Estado cambia con los select
    setSelectValue = (e) => {
        this.setState({
            [e.target.name] : e.target.value
        });
    }

    // Renderiza opciones de búsqueda
    renderBusqueda(){
        if (this.state.consulta === 'Por nombre'){
            return(
                <div className="fila justificado">
                    <InputField
                        type='text'
                        placeholder='Nombre(s)'
                        value={this.state.nombre}
                        name='nombre'
                        onChange={ (val) => this.setInputValue('nombre',val, 100) }/>
                    <SubmitButton 
                        styles=' btn-blanco no_margin no_padding width-auto size18 input-size'
                        icon={<BiIcons.BiSearch/>}
                        onclick={() => this.busquedaParam() }
                        />
                </div>
            )
        }
        if (this.state.consulta === 'Por apellidos') {
            return(
                <div className="fila justificado">
                    <InputField
                        type='text'
                        placeholder='Apellido paterno'
                        value={this.state.aPaterno}
                        name='aPaterno'
                        onChange={ (val) => this.setInputValue('aPaterno',val, 50) }/>
                    <InputField
                        type='text'
                        placeholder='Apellido Materno'
                        value={this.state.aMaterno}
                        name='aMaterno'
                        onChange={ (val) => this.setInputValue('aMaterno',val, 50) }/>
                    <SubmitButton 
                        styles=' btn-blanco no_margin no_padding width-auto size18 input-size'
                        icon={<BiIcons.BiSearch/>}
                        onclick={() => this.busquedaParam() }
                        />
                </div>
            )
        }
        if (this.state.consulta === 'Por matrícula'){
            return(
                <div className="fila justificado">
                    <InputField
                        type='text'
                        placeholder='Matrícula'
                        value={this.state.matricula}
                        name='matricula'
                        onChange={ (val) => this.setInputValue('matricula',val, 50) }/>
                    <SubmitButton 
                        styles=' btn-blanco no_margin no_padding width-auto size18 input-size'
                        icon={<BiIcons.BiSearch/>}
                        onclick={() => this.busquedaParam() }
                        />
                </div>
            )            
        }
        if (this.state.consulta === 'Por carrera'){
            return(
                <div className="fila justificado">
                    <SelectField
                        options={{
                            nombre:[
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
                        value={this.state.carrera}
                        name='carrera'
                        onChange={this.setSelectValue}/>
                    <SubmitButton 
                        styles=' btn-blanco no_margin no_padding width-auto size18 input-size-select'
                        icon={<BiIcons.BiSearch/>}
                        onclick={() => this.busquedaParam() }
                        />
                </div>
            )            
        }
        if (this.state.consulta === 'Por estado'){
            return(
                <div className="fila justificado">
                    <SelectField
                        options={{
                            nombre:['Activo', 'Inactivo']}}
                        value={this.state.estado}
                        name='estado'
                        onChange={this.setSelectValue}/>
                    <SubmitButton 
                        styles=' btn-blanco no_margin no_padding width-auto size18 input-size-select'
                        icon={<BiIcons.BiSearch/>}
                        onclick={() => this.busquedaParam() }
                        />
                </div>
                )
        }
    }

    // Busca todos
    busqueda = () => this.setState({userQry:this.state.usuarios});

    // Realiza el filtro de alumnos
    busquedaParam(){
        var usuarioSeleccionado =[]
        if (this.state.consulta === 'Por nombre')
                this.state.usuarios.forEach(usuario => {
                    if (usuario.nombre.includes(this.state.nombre))
                        usuarioSeleccionado.push(usuario); 
                });
        if (this.state.consulta === 'Por apellidos')
                this.state.usuarios.forEach(usuario => {
                    if (`${usuario.aPaterno} ${usuario.aMaterno}` === `${this.state.aPaterno} ${this.state.aMaterno}`)
                        usuarioSeleccionado.push(usuario);
                    else if (usuario.aPaterno === this.state.aPaterno)
                        usuarioSeleccionado.push(usuario);
                    else if(usuario.aMaterno === this.state.aMaterno)
                        usuarioSeleccionado.push(usuario);
                });
        if (this.state.consulta === 'Por matrícula')
                this.state.usuarios.forEach(usuario => {
                    if (usuario.academico[0].matricula === this.state.matricula)
                        usuarioSeleccionado.push(usuario);
                });        
        if (this.state.consulta === 'Por carrera')
                this.state.usuarios.forEach(usuario => {
                    if (usuario.academico[0].carrera === this.state.carrera)
                        usuarioSeleccionado.push(usuario);
                });
        if (this.state.consulta === 'Por estado')
                this.state.usuarios.forEach(usuario => {
                    if (`${usuario.published ? 'Activo' : 'Inactivo'}` === this.state.estado)
                        usuarioSeleccionado.push(usuario);
                });
        
        this.setState({
            userQry:usuarioSeleccionado, 
            userSelected:'',
            nombre: '',
            aPaterno: '',
            aMaterno: ''
        });
    }


    componentDidMount() {
        this.getUsuarios();
        this.getModulos();
    }

    // Renderiza los datos del usuario seleccionado
    renderUserSelected () {
        if (this.state.userSelected.nombre) {
            return(
                <div className="column">
                    <div className="fila">
                        <div className="columns justificado_vert">
                            <div className="cont_foto">
                                <img className="foto_usuario" alt="" src={`data:image/jpg;base64,${this.state.userSelected.foto}`}/>
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
                            <span className="azul">{`${this.state.userSelected.rol[0].nombre}`}</span>
                            <div className="nombres">
                                <span className="texto_mediano">{`${this.state.userSelected.nombre} `}</span>
                                <span className="texto_mediano no_margen">{`${this.state.userSelected.aPaterno} ${this.state.userSelected.aMaterno}`}</span>
                            </div>
                            <div className="columns">
                                <div className="fila">
                                    <div className="columns">
                                        <span className="etiqueta">{`MATRÍCULA`}</span>
                                        <span>{`${this.state.userSelected.academico[0].matricula}`}</span>
                                    </div>
                                    <div className="columns">
                                        <span className="etiqueta">{`CURP`}</span>
                                        <span>{`${this.state.userSelected.curp}`}</span>
                                    </div>
                                    <div className="columns">
                                        <span className="etiqueta">{`GPO. SANGUÍNEO`}</span>
                                        <span>{`${this.state.userSelected.sanguineo}`}</span>
                                    </div>
                                </div>
                                <div className="fila">
                                    <div className="columns">
                                        <span className="etiqueta">{`EMAIL`}</span>
                                        <span>{`${this.state.userSelected.contacto[0].email}`}</span>
                                    </div>
                                    <div className="columns">
                                        <span className="etiqueta">{`TEL / TEL. SOS`}</span>
                                        <span>{`${this.state.userSelected.contacto[0].telefono} | ${this.state.userSelected.contacto[0].telEmergencia}`}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="columns">
                                <span className="etiqueta">DIRECCION</span>
                                <p className="direccion">
                                    <span>{`${this.state.userSelected.direccion[0].calle} ${this.state.userSelected.direccion[0].numero}, ${this.state.userSelected.direccion[0].localidad}, ${this.state.userSelected.direccion[0].ciudad}, ${this.state.userSelected.direccion[0].estado}. C.P.  ${this.state.userSelected.direccion[0].cp}`}</span>
                                </p>
                            </div>
                        </div>
                    </div>
                    
                </div>
            )
        }
        return(
            <div className="centrado">
                <span className="text no-seleccionado">No ha seleccionado un usuario</span>
            </div>
        )
    }


    // Renderizado del módulo
    render() {
        return (
            <div className="modulo max-1357px">
                <div className="fila justificado resize-columna">
                    <div className="contenedor blanco full_width mh_img">
                        <img src={imgBusqueda} alt="" className="img_contenedor_principal"></img>
                        <div className="contenidoMod">
                            <h1 className="title">Buscar alumno por...</h1><br/>
                            {/* Filtro de búsqueda */}
                            <SelectField
                                options={{
                                    nombre:['Todos', 'Por matrícula','Por nombre', 'Por apellidos','Por carrera','Por estado']}}
                                value={this.state.consulta}
                                name='consulta'
                                onChange={this.setSelectValue}/>
                            {this.state.consulta === 'Todos' ? 
                            <div className="right">
                                <SubmitButton 
                                    styles=' btn-blanco no_margin no_padding width-auto size18 padding-10'
                                    icon={<BiIcons.BiSearch/>}
                                    text='Buscar'
                                    onclick={ () => this.busqueda() }
                                    />
                            </div> : ''}
                            <br/>
                            {this.renderBusqueda()}
                        </div>
                    </div>
                    <div className="contenedor blanco mh_img datos_usuario">
                        <div className="contenidoMod ">
                            {/* Renderiza los datos del usuario seleccionado */}
                            {this.renderUserSelected()}
                        </div>
                    </div>
                </div>

                <div className="fila">
                    <div className="contenedor blanco full_width relleno">
                        <div className="contenidoMod">
                            <div className="fila justificado">
                                <div className="columns">
                                    <h1 className="title">Usuarios</h1>
                                    <p className="texto"><BiIcons.BiHelpCircle/>  Para conocer más detalles del usuario, haga click sobre él. De ser necesario,</p><p> seleccione el botón a la derecha para generar las credenciales de todos los alumnos de la tabla.</p>
                                </div>
                                <div className="columns">
                                    <SubmitButton
                                    styles='btn-blanco large-text'
                                    text='Generar credenciales'/>
                                </div>
                            </div>
                            
                            { !this.state.userQry[0] ? <><br/><br/><span className="texto_mediano"> Usuarios no encontrados </span></> : 
                            <table className="tabla">
                                <tbody>
                                    <tr>
                                        <th>Nombre completo</th>
                                        <th className="matricula">Matricula</th>
                                        <th>Carrera</th>
                                        <th className="rol">Cuatrimestre</th>
                                        <th className="activo">Activo</th>
                                    </tr>
                                    {/* Carga los datos de los alumnos */}
                                    {this.state.usuarios.filter(usuario => usuario.rol[0].nombre === 'Alumno').map((usuario, usIndex) => {
                                        return(
                                            <tr key = {usIndex} onClick={() => this.setState({userSelected:usuario})}>
                                                <td className="adjustable_td">{`${usuario.nombre} ${usuario.aPaterno} ${usuario.aMaterno} `}</td>
                                                <td>{usuario.academico[0].matricula}</td>
                                                <td className="adjustable_td">{usuario.academico[0].carrera}</td>
                                                <td>{usuario.academico[0].cuatrimestre}</td>
                                                <td>{usuario.published ? 'Sí' : 'No'}</td>
                                            </tr>
                                        )
                                    })} 
                                </tbody>
                            </table>
                            }
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default ConsultaAlumnos
