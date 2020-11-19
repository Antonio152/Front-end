import React, { Component } from 'react'
import axios from 'axios'
// Íconos e imágenes
import imgBusqueda from './img/busqueda.jpg'
import * as BiIcons from 'react-icons/bi'
// Componentes de uso general
import SelectField from '../GeneralUseComp/SelectField'
import SubmitButton from '../GeneralUseComp/SubmitButton'
import Loader from '../GeneralUseComp/Loader'
// Stores
import UserStore from '../Stores/UserStore'
// Sub módulos
import Busqueda from '../ComplementosConsultas/Busqueda'
import UserSelected from '../ComplementosConsultas/UserSelected'
// Estilos
import './ConsultaUsuarios.css'

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
        permisos: [],
        // Para cuando se estén obteniendo los usuarios del servidor
        cargandoUs: true,
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
                userQry: usuarios,
                cargandoUs: false
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
    // Para inputFields se utiliza la estructura: clasificación, placeholder, value, name y onChange
    // Para selects se utiliza la estructura: clasificación, options(con name dentro), value, name y onChange(evento)
    renderBusqueda(){
        if (this.state.consulta === 'Por nombre')
        return(
            <Busqueda
                inputs={{inputs: [{
                        classification: 'inputField',
                        placeholder: 'Nombre(s)',
                        value: this.state.nombre,
                        name: 'nombre',
                        onChange: (val) => {this.setInputValue('nombre',val, 100)} }
                ]}}
                onClick={() => this.busquedaParam()} />
        )
    
        if (this.state.consulta === 'Por apellidos') 
            return(
                <Busqueda
                    inputs={{inputs: [
                        {   classification: 'inputField',
                            placeholder: 'Apellido paterno',
                            value: this.state.aPaterno,
                            name: 'aPaterno',
                            onChange: (val) => {this.setInputValue('aPaterno',val, 50)}},
                        {   classification: 'inputField',
                            placeholder: 'Apellido Materno',
                            value: this.state.aMaterno,
                            name: 'aMaterno',
                            onChange: (val) => {this.setInputValue('aMaterno',val, 50)} 
                        }]}}
                    onClick={() => this.busquedaParam()} />
            )

        if (this.state.consulta === 'Por rol')
            return(
                <Busqueda
                    inputs={{inputs: [{
                            classification: 'select',
                            options: {nombre: ['Super administrador', 'Administrador', 'Consultor']},
                            value: this.state.rol,
                            name: 'rol',
                            onChange: (e) => {this.setSelectValue(e)} }
                    ]}}
                    onClick={() => this.busquedaParam()} />
            )

        if (this.state.consulta === 'Por estado')
            return(
                <Busqueda
                    inputs={{inputs: [{
                            classification: 'select',
                            options: {nombre: ['Activo', 'Inactivo']},
                            value: this.state.estado,
                            name: 'estado',
                            onChange: (e) => {this.setSelectValue(e)} }
                    ]}}
                    onClick={() => this.busquedaParam()} />
            )
    }

    // Busca todos
    // Actualización de estado para mostrar en tabla y en lista de credenciales
    busqueda = () => this.setState({userQry:this.state.usuarios});

    // Realiza el filtro de usuarios
    busquedaParam(){
        var usuarioSeleccionado =[]
        // Condicional múltiple de búsquedas
        // Para cada búsqueda, inlcuye en el arreglo usuarioSeleccionado el usuario que cumple
        // con el parámetro de búsqueda
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
        // Actualización de estado
        this.setState({
            userQry:usuarioSeleccionado, 
            userSelected:'',
            nombre: '',
            aPaterno: '',
            aMaterno: ''
        });
    }
    // Cuando del componente termine de cargar
    componentDidMount() {
        this.getUsuarios();
        this.getModulos();
    }

    // Renderiza los datos del usuario seleccionado
    renderUserSelected () {
        if (this.state.userSelected.nombre) {
            return(
                <UserSelected
                usuario={this.state.userSelected}
                datos={{filas: [
                    { seccion:[
                        {etiqueta: 'curp', dato: this.state.userSelected.curp},
                    ]},
                    { seccion:[
                        {etiqueta: 'email', dato: this.state.userSelected.contacto[0].email},
                        {etiqueta: 'tel / tel. Emergencia', dato: `${this.state.userSelected.contacto[0].telefono} | ${this.state.userSelected.contacto[0].telEmergencia}`}
                    ]},
                    { seccion:[
                        {etiqueta: 'dirección', dato: `${this.state.userSelected.direccion[0].calle} ${this.state.userSelected.direccion[0].numero}, ${this.state.userSelected.direccion[0].localidad}, ${this.state.userSelected.direccion[0].ciudad}, ${this.state.userSelected.direccion[0].estado}. C.P.  ${this.state.userSelected.direccion[0].cp}`}
                    ]}
                ]}}
                botones={['Eliminar', 'Editar']}
                permisos={this.state.permisos}
                />
            )
        }
        return(
            <div className="centrado">
                <span className="text no-seleccionado">No ha seleccionado un alumno</span>
            </div>
        )
    }

    renderTabla = () =>{
        if (this.state.cargandoUs)
            return(<Loader/>)
        if(this.state.userQry.length === 0)
            return(<span className="texto_mediano"> Usuarios no encontrados </span>)
        else
        // Sólo renderiza en caso de  que no se esté cargando o la lista no esté vacía
        return(
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
                this.state.userQry.filter(usuario => usuario._id !== UserStore.id).map((usuario, usIndex) => {
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
                            { this.renderTabla() }
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default ConsultaUsuarios
