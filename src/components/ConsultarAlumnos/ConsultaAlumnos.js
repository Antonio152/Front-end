import React, { Component } from 'react'
import axios from 'axios'
// Íconos e imágenes
import imgBusqueda from '../ConsultarUsuarios/img/busqueda.jpg'
import * as BiIcons from 'react-icons/bi'
// Componentes de uso general
import SelectField from '../GeneralUseComp/SelectField'
import SubmitButton from '../GeneralUseComp/SubmitButton'
import Loader from '../GeneralUseComp/Loader'
import Checkbox from '../GeneralUseComp/Checkbox'
// Stores
import UserStore from '../Stores/UserStore'
// Sub módulos
import Busqueda from '../ComplementosConsultas/Busqueda'
import UserSelected from '../ComplementosConsultas/UserSelected'
// css
import '../ConsultarUsuarios/ConsultaUsuarios.css'

export class ConsultaAlumnos extends Component {

    // Estado de la case
    state = {
        usuarios : [], // Ususarios de la petición al servidor
        userQry : [], // Ususarios consultados
        usersForCredential: [], // IDs de usuarios para credencial
        userSelected:[], // Usuario que se ha seleccionado
        consulta: 'Todos', // Filtro de consulta
        // campos de los filtros de consulta
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
            let usuarios_id = [];
            result
                .filter(usuario => usuario.rol[0].nombre === 'Alumno')
                .forEach(usuario => {
                    usuarios.push(usuario);
                    usuarios_id.push(usuario._id)
                })
            this.setState({
                usuarios: usuarios,
                userQry: usuarios,
                usersForCredential: usuarios_id
            })
        }
    }

    // Obtiene los modulos del servidor
    getModulos = async () => {
        const res = await axios.get(`http://localhost:4000/api/users/${UserStore.id}`);
        if (res.status === 200)
            this.setState({permisos: res.data.rol[0].modulos[1].permisos});
    }

    // Obtiene el archivo PDF en base 64
    getCredenciales = async (datos, formato) => {
        var arrDatos = [];
        this.state.userQry.forEach(usuario => {
            datos.forEach(index => {
                if (usuario._id === index) arrDatos.push(usuario);
            })
        });
        // if (!datos.length) arrDatos.push(datos)
        // else arrDatos = datos;
        const res = await axios.post('http://localhost:4000/cards',{
            usuarios: arrDatos,
            formato: formato
        });
        this.generarArchivo(res.data.pdf, arrDatos.length === 1 ? `Credencial ${arrDatos[0].nombre} ${arrDatos[0].aPaterno}` : 'Credenciales');
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
            
        if (this.state.consulta === 'Por matrícula')
            return(
                <Busqueda
                    inputs={{inputs: [{
                            classification: 'inputField',
                            placeholder: 'Matrícula',
                            value: this.state.matricula,
                            name: 'matricula',
                            onChange: (val) => {this.setInputValue('matricula',val, 50)} }
                    ]}}
                    onClick={() => this.busquedaParam()} />
            )
        
        if (this.state.consulta === 'Por carrera')
            return(
                <Busqueda
                    inputs={{inputs: [{
                            classification: 'select',
                            options: {nombre: ['Ingeniería en Software', 'Ingeniería en Mecatrónica', 'Ingeniería en Biomédica', 'Ingeniería en Biotecnología', 'Ingeniería en Telemática', 'Ingeniería en Redes y Telecomunicaciones', 'Ingeniería Mecánica Automotríz', 'Ingeniería Sistemas y Tecnologías Industriales', 'Licenciatura en Terapia física','Licenciatura en Médico Cirujano']},
                            value: this.state.carrera,
                            name: 'carrera',
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

    // Recorre todos los usuarios que se van a imprimir
    selectUserForCard = (usuario, borrar) => {
        if(borrar === 'false')
            this.state.usersForCredential.push(usuario._id)
        for (let index = 0; index < this.state.usersForCredential.length; index++)
            // Revisa si es el usuario seleccionado y si se elimina o no
            if(usuario._id === this.state.usersForCredential[index] && borrar === 'true')
                this.state.usersForCredential.splice(index, 1)
    }
    // Busca todos
    busqueda = () => {
        // Sólo obtiene los ID para la seleccion de credenciales
        let usuarios_id = [];
        this.state.usuarios.forEach(usuario =>  usuarios_id.push(usuario._id));
        // Actualización de estado para mostrar en tabla y en lista de credenciales
        this.setState({
            userQry:this.state.usuarios,
            usersForCredential: usuarios_id
        });
    }

    // Realiza el filtro de alumnos
    busquedaParam(){
        var usuarioSeleccionado =[]
        var usuarioSeleccionado_id =[]
        // Condicional múltiple de búsquedas
        // Para cada búsqueda, inlcuye en el arreglo usuarioSeleccionado el usuario que cumple
        // con el parámetro de búsqueda
        switch (this.state.consulta) {
            case 'Por nombre':
                this.state.usuarios.forEach(usuario => {
                    if (usuario.nombre.includes(this.state.nombre))
                        usuarioSeleccionado.push(usuario);
                });
                break;

            case 'Por apellidos':
                this.state.usuarios.forEach(usuario => {
                    if (`${usuario.aPaterno} ${usuario.aMaterno}` === `${this.state.aPaterno} ${this.state.aMaterno}`)
                        usuarioSeleccionado.push(usuario);
                    
                    else if (usuario.aPaterno === this.state.aPaterno)
                        usuarioSeleccionado.push(usuario);
                    
                    else if(usuario.aMaterno === this.state.aMaterno)
                        usuarioSeleccionado.push(usuario);
                });
                break;
                
            case 'Por matrícula':
                this.state.usuarios.forEach(usuario => {
                    if (usuario.academico[0].matricula === this.state.matricula)
                        usuarioSeleccionado.push(usuario);
                });
                break;
                
            case 'Por carrera':
                this.state.usuarios.forEach(usuario => {
                    if (usuario.academico[0].carrera === this.state.carrera)
                        usuarioSeleccionado.push(usuario);
                });
                break;
                
            case 'Por estado':
                this.state.usuarios.forEach(usuario => {
                    if (`${usuario.published ? 'Activo' : 'Inactivo'}` === this.state.estado)
                        usuarioSeleccionado.push(usuario);
                });
                break;
        
            default:
                break;
        }
        // inserta en el arreglo todos los ID de los usuarios consultados
        usuarioSeleccionado.forEach(usuario => usuarioSeleccionado_id.push(usuario._id));
        // Actualizaicón de estado
        // Con esto, se actualiza la lista de usuarios mostrados y seleccionados para generar credenciales
        this.setState({
            userQry:usuarioSeleccionado,
            usersForCredential: usuarioSeleccionado_id,
            userSelected:'',
            nombre: '',
            aPaterno: '',
            aMaterno: ''
        });
    }

    // Cuando el componenente es renderizado
    componentDidMount() {
        this.getUsuarios();
        this.getModulos();
    }

    // Renderiza los datos del usuario seleccionado
    renderUserSelected () {
        if (this.state.userSelected.nombre) {
            var arrIds = [];
            arrIds.push(this.state.userSelected._id);
            return(
                <UserSelected
                usuario={this.state.userSelected}
                datos={{filas: [
                    { seccion:[
                        {etiqueta: 'matrícula', dato: this.state.userSelected.academico[0].matricula},
                        {etiqueta: 'curp', dato: this.state.userSelected.curp},
                        {etiqueta: 'gpo. sanguíneo', dato: this.state.userSelected.sanguineo},
                    ]},
                    { seccion:[
                        {etiqueta: 'email', dato: this.state.userSelected.contacto[0].email},
                        {etiqueta: 'tel / tel. Emergencia', dato: `${this.state.userSelected.contacto[0].telefono} | ${this.state.userSelected.contacto[0].telEmergencia}`}
                    ]},
                    { seccion:[
                        {etiqueta: 'dirección', dato: `${this.state.userSelected.direccion[0].calle} ${this.state.userSelected.direccion[0].numero}, ${this.state.userSelected.direccion[0].localidad}, ${this.state.userSelected.direccion[0].ciudad}, ${this.state.userSelected.direccion[0].estado}. C.P.  ${this.state.userSelected.direccion[0].cp}`}
                    ]}
                ]}}
                botones={['Eliminar', 'Editar', 'Credencial']}
                permisos={this.state.permisos}
                cardClick={() => this.getCredenciales(arrIds, 'UPPCredencial1')}
                />
            )
        }
        return(
            <div className="centrado">
                <span className="text no-seleccionado">No ha seleccionado un alumno</span>
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
                            <h1 className="resize-title-alu title">Buscar alumno por...</h1><br/>
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

                <div className="fila" style={{maxHeight:'calc(100vh - 380px)' , minHeight:'401px'}}>
                    <div className="contenedor blanco full_width relleno">
                        <div className="contenidoMod">
                            <div className="fila justificado">
                                <div className="columns">
                                    <h1 className="title">Alumnos</h1>
                                    <div className="desc-modulo">

                                    <p className="texto"><BiIcons.BiHelpCircle/>  Para conocer más detalles del alumno, haga click sobre él. De ser necesario,</p><p className="texto" style={{marginTop:0}}> seleccione el botón a la derecha para generar las credenciales de todos los alumnos de la tabla.</p>
                                    </div>
                                </div>
                                <div className="columns">
                                    <SubmitButton
                                    styles='large-text'
                                    text='Generar credenciales'
                                    onclick={() => this.getCredenciales(this.state.usersForCredential, 'UPPCredencial1')}
                                    />
                                </div>
                            </div>

                            { this.state.userQry.length === 0 ? <><br/><br/><span className="texto_mediano"> Alumnos no encontrados </span></> :
                            <div>
                            <table className="tabla">
                                <tbody>
                                    <tr>
                                        <th style={{minWidth:'25px'}}/>
                                        <th className="adjustable_td">Nombre completo</th>
                                        <th className="matricula">Matricula</th>
                                        <th className="adjustable_td">Carrera</th>
                                        <th className="rol">Cuatrimestre</th>
                                        <th className="activo-tabla" style={{borderLeft:'none'}}>Activo</th>
                                    </tr>
                                </tbody>
                            </table>
                            <div className="datos-tabla">

                            <table className="tabla" style={{marginTop:0}}>
                                <tbody>

                                    {/* Carga los datos de los alumnos */}
                                    {
                                    this.state.userQry.length > 0 ?
                                    this.state.userQry.map((usuario, usIndex) => {
                                        return(
                                            <tr key = {usIndex} onClick={() => this.setState({userSelected:usuario})}>
                                                <td style={{minWidth:'25px', padding: '15px 0px'}}>
                                                    <Checkbox
                                                    key = {usIndex}
                                                    onClick={(e) => {
                                                        this.selectUserForCard(usuario, e.target.value)
                                                    }}/>
                                                </td>
                                                <td className="adjustable_td">{`${usuario.nombre} ${usuario.aPaterno} ${usuario.aMaterno} `}</td>
                                                <td className="matricula">{usuario.academico[0].matricula}</td>
                                                <td className="adjustable_td">{usuario.academico[0].carrera}</td>
                                                <td className="rol">{usuario.academico[0].cuatrimestre}</td>
                                                <td className="activo-tabla" style={{borderLeft:'none'}}> {usuario.published ? 'Sí' : 'No'}</td>
                                            </tr>
                                        )
                                    }):
                                    <div className="centrado">
                                        <Loader/>
                                    </div>}
                                </tbody>
                            </table>
                            </div>
                            </div>
                            }
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default ConsultaAlumnos
