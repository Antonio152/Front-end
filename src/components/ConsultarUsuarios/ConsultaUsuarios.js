import React, { Component } from 'react'
import axios from 'axios'
import './ConsultaUsuarios.css'
import imgBusqueda from './img/busqueda.jpg'
import SelectField from '../GeneralUseComp/SelectField'
import InputField from '../GeneralUseComp/InputField'
import SubmitButton from '../GeneralUseComp/SubmitButton'
import * as BiIcons from 'react-icons/bi'
import UserStore from '../Stores/UserStore'
import Loader from '../GeneralUseComp/Loader'

export class ConsultaUsuarios extends Component {
    // Estado de la clase
    state = {
        usuarios : [],
        userQry : [],
        userSelected:[],
        consulta: 'Todos',
        nombre: '',
        aPaterno: '',
        aMaterno: '',
        rol: 'Super administrador',
        estado: 'Activo',
        permisos: []
    }
    // Obtiene los usuarios del servidor
    getUsuarios = async () => {
        let res = await fetch('http://localhost:4000/api/users', {
            method: 'get',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
            credentials: 'include'
        }); // From API
        let result = await res.json();
        if (result && res.status === 200){
            let usuarios = [];
            result
                .filter(usuario => usuario.rol[0].nombre !== 'Alumno')
                .forEach(usuario => usuarios.push(usuario))
            this.setState({
                usuarios: usuarios,
                userQry: usuarios
            })
        }
    }
    // Obtiene los modulos del servidor
    getModulos = async () => {
        const res = await axios.get(`http://localhost:4000/api/users/${UserStore.id}`);
        if (res.status === 200)
            this.setState({permisos: res.data.rol[0].modulos[0].permisos});
    }

    // Estado cambia con inputs
    setInputValue = (property, val, maxLenght) => {
        val = val.trim(); // we don't want spaces
        if (val.length > maxLenght)  //Max lenght
            return;
        this.setState({
            [property]: val // Cambia el valor del estado que se le indique
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
                    <div className="columns" style={{width:'100%'}}>
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
                    </div>
                    
                    <SubmitButton 
                        styles=' btn-blanco no_margin no_padding width-auto size18 input-size'
                        icon={<BiIcons.BiSearch/>}
                        onclick={() => this.busquedaParam() }
                        />
                </div>
            )
        }
        if (this.state.consulta === 'Por rol'){
            return(
                <div className="fila justificado">
                    <SelectField
                        options={{
                            nombre:['Super administrador', 'Administrador', 'Consultor']}}
                        value={this.state.rol}
                        name='rol'
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

    // Realiza el filtro de usuarios
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
        if (this.state.consulta === 'Por rol')
                this.state.usuarios.forEach(usuario => {
                    if (usuario.rol[0].nombre === this.state.rol)
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
                                    styles={'fullWidth no_padding no_margin boton consulta btn-blanco'}
                                    text="Eliminar"
                                    disabled={this.state.permisos.includes('Eliminar') ? false : true}/>
                                <SubmitButton 
                                    icon={<BiIcons.BiPencil/>} 
                                    styles="fullWidth no_padding no_margin boton btn-blanco" 
                                    text="Editar   "
                                    disabled={this.state.permisos.includes('Modificar') ? false : true}/>
                            </div>
                        </div>
                        <div className="columns">
                            <span className="azul">{`${this.state.userSelected.rol[0].nombre}`}</span>
                            <div className="nombres">
                                <span className="texto_mediano">{`${this.state.userSelected.nombre} `}</span>
                                <span className="texto_mediano no_margen">{`${this.state.userSelected.aPaterno} ${this.state.userSelected.aMaterno}`}</span>
                            </div>
                            <div className="columns">
                                <span className="etiqueta">{`CURP`}</span>
                                <span>{`${this.state.userSelected.curp}`}</span>
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
            <div className="modulo">
                <div className="resize-columna justificado ">
                    <div className="contenedor blanco full_width mh_img">
                        <img src={imgBusqueda} alt="" className="img_contenedor_principal"></img>
                        <div className="contenidoMod">
                            <h1 className="resize-title title">Buscar usuario por...</h1><br/>
                            {/* Filtro de búsqueda */}
                            <SelectField
                                options={{
                                    nombre:['Todos','Por nombre', 'Por apellidos','Por rol','Por estado']}}
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

                <div className="fila ">
                    <div className="contenedor blanco full_width relleno ">
                        <div className="contenidoMod">
                            <h1 className="title">Usuarios</h1>
                            <p className="texto"><BiIcons.BiHelpCircle/>  Para conocer más detalles del usuario, haga click sobre él.</p>
                            { this.state.userQry.length === 0 ? <span className="texto_mediano"> Usuarios no encontrados </span> : 
                            <table className="tabla">
                                <tbody>
                                    <tr>
                                        <th className="th-nombre">Nombre completo</th>
                                        <th className="rol">Rol</th>
                                        <th>Módulos con acceso</th>
                                        <th className="activo" style={{borderLeft:'none'}}>Activo</th>
                                    </tr>
                                    {/* Carga los datos de los alumnos */}
                                    {/* Adjuntar en función con trycatch */
                                    this.state.userQry.length > 0 ?
                                    this.state.userQry.map((usuario, usIndex) => {
                                        return(
                                        <tr key = {usIndex} onClick={() => this.setState({userSelected:usuario})}>
                                            <td>{`${usuario.nombre} ${usuario.aPaterno} ${usuario.aMaterno} `}</td>
                                            <td>{usuario.rol[0].nombre}</td>
                                            <td className="modulos">
                                                {/* Imprime los datos de cada uno de los módulos que tiene acceso */}
                                                {usuario.rol[0].modulos.map((modulo, modIndex) => {
                                                    return(
                                                        <div className="fila" key={modIndex} styles={{textAlign:'center'}}>
                                                        <p><span style={{fontWeight:'500'}}>{modulo.nombre}</span>:  
                                                            {modulo.permisos.map((permiso, perIndex) => {
                                                                return(<span key={perIndex} style={{margin:0, paddingLeft:'1px'}}>{`${perIndex === 0 ? ' ' : ', '} ${permiso}`}</span>)
                                                            })}
                                                        </p>
                                                        </div>
                                                    )
                                                })}
                                            </td> 
                                            <td>{usuario.published ? 'Sí' : 'No'}</td>
                                        </tr>
                                        )
                                    }) : 
                                    <div className="centrado">
                                        <Loader/>
                                    </div>} 
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

export default ConsultaUsuarios
