import React, { Component } from 'react'
import axios from 'axios'

import { withRouter, Redirect } from 'react-router-dom';

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

// Íconos del módulo
import * as AiIcons from 'react-icons/ai'
import * as BiIcons from 'react-icons/bi'
import * as RiIcons from 'react-icons/ri'
 // Componentes
import InputField from '../GeneralUseComp/InputField'
import SubmitButton from '../GeneralUseComp/SubmitButton'
import BtnSeccion from './BtnSeccion'
import Checkbox from '../GeneralUseComp/Checkbox'
import SelectField from '../GeneralUseComp/SelectField'
import Loader from '../GeneralUseComp/Loader'
import OpenModal from '../Modals/OpenModal'
// Datos
import foto from './foto.json'
import UserStore from '../Stores/UserStore'
// Hojas de estilo
import './MyAccount.css'
import '../GeneralUseComp/InputFile.css'
// Complementos
const Compress = require('compress.js')
var bcrypt = require('bcryptjs')

// prop "miUsuario" hace referencia a que es el usuario logueado el que edita su perfil

export class AltaUsuarios extends Component {
    imgRef = React.createRef();

    initialState = {
        uri: window.location.href,

        zona: 'cuenta', // zona de edición del usuario
        editar: this.props.miUsuario ? true : false,  // si se está editando o agregando un nuevo usuario
        alumnos: window.location.href.includes('alumnos'), // si el usuario editado es un alumno
        profesores: window.location.href.includes('profesores'), // si el usuario editado es un alumno
        // Datos que serán llenados por el usuario o por la API
        username: this.props.miUsuario ? UserStore.username : '',
        password: '', 
        passwordRepeat: '',
        fotoAnt: this.props.miUsuario ? UserStore.photo : foto.base64,
        foto: this.props.miUsuario ? UserStore.photo : foto.base64,
        nombre: this.props.miUsuario ? UserStore.name : '',
        aPaterno: this.props.miUsuario ? UserStore.lastNameP : '',
        aMaterno: this.props.miUsuario ? UserStore.lastNameM : '',
        curp: this.props.miUsuario ? UserStore.curp : '',
        sanguineo: this.props.miUsuario ? UserStore.rh : '',
        con_telefono: this.props.miUsuario ? UserStore.tel : '',
        con_email: this.props.miUsuario ? UserStore.email : '',
        con_telEmergencia: this.props.miUsuario ? UserStore.telEmer : '',
        dir_numero: this.props.miUsuario ? UserStore.streetNo : '',
        dir_calle: this.props.miUsuario ? UserStore.street : '',
        dir_localidad: this.props.miUsuario ? UserStore.location : '',
        dir_ciudad: this.props.miUsuario ? UserStore.city : '',
        dir_estado: this.props.miUsuario ? UserStore.state : '',
        dir_cp: this.props.miUsuario ? UserStore.postalCode : '',
        aca_carrera: this.props.miUsuario && UserStore.role === 'Alumno' ? UserStore.career : 'Ingeniería en Software',
        aca_matricula: this.props.miUsuario && UserStore.role === 'Alumno' ? UserStore.idStudent : '',
        aca_cuatrimestre: this.props.miUsuario && UserStore.role === 'Alumno' ? UserStore.grade : '1',
        aca_registro: new Date(),
        aca_estatus: this.props.miUsuario && UserStore.aca_estatus === 'Alumno' ? UserStore.aca_estatus : true,
        // Modulos con acceso
        rol: this.props.miUsuario ? UserStore.role : window.location.href.includes('alumnos') ? 'Alumno' : window.location.href.includes('profesores') ? 'Profesor' : 'Super Administrador',

        permisos_usuarios: this.props.miUsuario ? UserStore.Usuarios :  window.location.href.includes('alumnos') ? ['','','',''] : ['Crear', 'Modificar', 'Consultar', 'Eliminar'],

        permisos_alumnos: this.props.miUsuario ? UserStore.Alumnos :  window.location.href.includes('alumnos') ? ['','','',''] : ['Crear', 'Modificar', 'Consultar', 'Eliminar'],

        permisos_profesores: this.props.miUsuario ? UserStore.Profesores :  window.location.href.includes('profesores') ? ['','','',''] : ['Crear', 'Modificar', 'Consultar', 'Eliminar'],

        permisos_usuarios_ant: this.props.miUsuario ? UserStore.Usuarios :  window.location.href.includes('alumnos') ? ['','','',''] : ['Crear', 'Modificar', 'Consultar', 'Eliminar'],

        permisos_alumnos_ant: this.props.miUsuario ? UserStore.Alumnos :  window.location.href.includes('alumnos') ? ['','','',''] : ['Crear', 'Modificar', 'Consultar', 'Eliminar'],

        permisos_profesores_ant: this.props.miUsuario ? UserStore.Profesores :  window.location.href.includes('profesores') ? ['','','',''] : ['Crear', 'Modificar', 'Consultar', 'Eliminar'],

        permisos_credenciales: this.props.miUsuario ? UserStore.Credenciales :  window.location.href.includes('alumnos') || window.location.href.includes('profesores')  ? ['Generar formato'] : ['Modificar formato'],
        // Para la actualización de roles
        // se utiliza un alternativo para que REACT identifique el cambio
        cambioRol: true,
        cambioRolAlt:false,
        // Si se encuentran cargando los datos
        isLoading: false,
        // Si lo que desea hacer es cambiar su contraseña
        isPswChanged: false,

        btnPswDisabled: false,
        btnGuardarDisabled: false,

        redireccionar: false

        // alerta: {msg:'',tipo:'', accion: () => {}}
    }

    state = this.initialState;

    // Vacía los permisos del usuario
    permisosVacios = () => this.setState({
        permisos_usuarios:['','','',''],
        permisos_alumnos:['','','',''],
        permisos_profesores:['','','',''],
        permisos_usuarios_ant:['','','',''],
        permisos_alumnos_ant:['','','',''],
        permisos_profesores_ant:['','','',''],
        permisos_credenciales:['']
    });

    // Cuando carga el componente
    componentDidMount = async () => {
        // Carga los datos del usuario buscado
        if (this.props.match.params.id !== undefined){
            // Estado listo para llenar con datos buscados
            this.setState({isLoading:true});
            this.permisosVacios();
            // Petición 
            await axios.get(`https://node-server-credenciales.herokuapp.com/api/users/${this.props.match.params.id}`)
                .then(res => {
                    // Usuario obtenido por el servidor
                    const usuario = res.data;
                    // Arreglo asignado a usuarios que no tengan ninguna clase de permiso sobre un módulo
                    const perVacio = ['','','','']
                    // Actualización de estado
                    this.setState({
                        editar: true,
                        username: usuario.username,
                        fotoAnt: usuario.foto,
                        foto: usuario.foto,
                        rol: usuario.rol[0].nombre,
                        nombre: usuario.nombre,
                        aPaterno: usuario.aPaterno,
                        aMaterno: usuario.aMaterno,
                        curp: usuario.curp,
                        sanguineo: usuario.sanguineo,
                        con_telefono: usuario.contacto[0].telefono,
                        con_email: usuario.contacto[0].email,
                        con_telEmergencia: usuario.contacto[0].telEmergencia,
                        dir_numero: usuario.direccion[0].numero,
                        dir_calle: usuario.direccion[0].calle,
                        dir_localidad: usuario.direccion[0].localidad,
                        dir_ciudad: usuario.direccion[0].ciudad,
                        dir_estado: usuario.direccion[0].estado,
                        dir_cp: usuario.direccion[0].cp,
                        // Realiza comparaciones. En caso de que no se trate de un usuario o un profesor, entonces implica que no se agregará dicho permiso
                        ...(usuario.rol[0].nombre !== 'Alumno' && usuario.rol[0].nombre !== 'Profesor' && 
                        {permisos_usuarios:usuario.rol[0].modulos[0].permisos !== undefined ? usuario.rol[0].modulos[0].permisos : perVacio}),

                        ...(usuario.rol[0].nombre !== 'Alumno' && usuario.rol[0].nombre !== 'Profesor' && 
                        {permisos_alumnos:usuario.rol[0].modulos[1].permisos !== undefined ? usuario.rol[0].modulos[1].permisos : perVacio}),

                        ...(usuario.rol[0].nombre !== 'Alumno' && usuario.rol[0].nombre !== 'Profesor' && 
                        {permisos_profesores:usuario.rol[0].modulos[2].permisos !== undefined ? usuario.rol[0].modulos[2].permisos : perVacio}),

                        permisos_credenciales:usuario.rol[0].modulos[3].permisos !== undefined ? usuario.rol[0].modulos[3].permisos : perVacio,

                        ...(usuario.rol[0].nombre !== 'Alumno' && usuario.rol[0].nombre !== 'Profesor' && 
                        {permisos_usuarios_ant: usuario.rol[0].modulos[0].permisos !== undefined ? usuario.rol[0].modulos[0].permisos : perVacio}),

                        ...(usuario.rol[0].nombre !== 'Alumno' && usuario.rol[0].nombre !== 'Profesor' && 
                        {permisos_alumnos_ant: usuario.rol[0].modulos[1].permisos !== undefined ? usuario.rol[0].modulos[1].permisos : perVacio}),
                        
                        ...(usuario.rol[0].nombre !== 'Alumno' && usuario.rol[0].nombre !== 'Profesor' && 
                        {permisos_profesores_ant: usuario.rol[0].modulos[2].permisos !== undefined ? usuario.rol[0].modulos[2].permisos : perVacio}),

                        isLoading: false
                    });
                    // En caso de que el usuario modificado sea un alumno
                    if (usuario.rol[0].nombre === 'Alumno' || usuario.rol[0].nombre === 'Profesor') {
                        this.setState({
                            aca_carrera: usuario.academico[0].carrera,
                            aca_matricula: usuario.academico[0].matricula,
                            // Permiso sólo para alumnos
                            ...(usuario.rol[0].nombre === 'Alumno' && {aca_cuatrimestre: usuario.academico[0].cuatrimestre}),
                            aca_estatus: usuario.academico[0].estatus,
                            aca_registro: new Date(usuario.academico[0].registro)
                        });
                        // console.log('Esta fecha: ', new Date())
                        // console.log(new Date(usuario.academico[0].registro))
                    }
                })
                .catch((error) => {
                    console.error(error)
                    alert(`El usuario con el id ${this.props.match.params.id} no existe.\nSerá redirigido a la página anterior...`);
                    window.history.go(-1);  // Regresa una ventana hacia atrás
                });
            
        }
        else {
            this.cambiarRoles();
        }

    }

    // Llamado antes de que se renderice el módulo
    // En otras palabras, se va a accionar en cuanto se cambie la uri
    componentDidUpdate(preProps, preState) {
        if(preState.uri !== window.location.href){
            this.setState(this.initialState);
            this.setState({
                uri:window.location.href,
                rol: this.props.miUsuario ? UserStore.role : window.location.href.includes('alumnos') ? 'Alumno' : window.location.href.includes('profesores') ? 'Profesor' : 'Super Administrador'
            });
            this.cambiarRoles();
        }
    }

    // Agrega los módulos a los cuales tiene acceso el usuario buscado
    verificaModulos = () => {
        var modulos = [];
        modulos.push({
            nombre: 'Usuarios',
            permisos: this.state.permisos_usuarios.filter(permiso => permiso !== '')
        })
        modulos.push({
            nombre: 'Alumnos',
            permisos: this.state.permisos_alumnos.filter(permiso => permiso !== '')
        })
        modulos.push({
            nombre: 'Profesores',
            permisos: this.state.permisos_profesores.filter(permiso => permiso !== '')
        })
        modulos.push({
            nombre: 'Credenciales',
            permisos: this.state.permisos_credenciales.filter(permiso => permiso !== '')
        })
        return modulos;
    }

    reasignarStore = async () => {
        await axios.get(`https://node-server-credenciales.herokuapp.com/api/users/${UserStore.id}`)
            .then(res => {
                const result = Object.assign(res.data, {success: true});
                UserStore.setMiUsuario(result);
                alert('Usuario modificado exitosamente.');
                this.setState({redireccionar: true});
            })
            .catch(error => console.error(error));
    }

    // Para guardar cambios
    guardarUsuario = async () => {
        const modulos = this.verificaModulos();
        var newUsuario = {};
        var datosListos = true;

        const regexNombre = /^[a-zA-ZÀ-ÿ\u00f1\u00d1]+(\s*[a-zA-ZÀ-ÿ\u00f1\u00d1]*)*[a-zA-ZÀ-ÿ\u00f1\u00d1]+$/g;
        //validaciones
        if((this.state.username === '' || this.state.password === '') && !this.props.miUsuario && !this.state.editar){
            alert('Rectifique los datos de la cuenta, no deben estar vacios')
            datosListos = false;
        }
        if((this.state.nombre === '' || this.state.aPaterno === '' || ! regexNombre.test(this.state.nombre)) && ! regexNombre.test(this.state.aPaterno) && ! regexNombre.test(this.state.aMaterno)){
            alert('Rectifique los datos de su nombre')
            datosListos = false;
        }
        if(this.state.curp === ''){
            alert('Es necesario que ingrese su CURP')
            datosListos = false;
        }
        if(this.state.dir_cp === '' || this.state.dir_ciudad === '' || this.state.dir_estado === '' || ! /^[0-9]/.test(this.state.dir_cp)){
            alert('Rectifique los datos de la dirección')
            datosListos = false;
        }
        if((this.state.alumnos || this.state.profesores) && this.state.aca_matricula === ''){
            alert('Rectifique los datos de su matrícula')
            datosListos = false;
        }
        if(this.state.con_email === '' || ! /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(this.state.con_email)){
            alert('Rectifique que el correo electrónico sea correcto')
            datosListos = false;
        }
        if(this.state.con_telefono === '' || this.state.con_telEmergencia === '' || ! /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/im.test(this.state.con_telefono) || ! /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/im.test(this.state.con_telEmergencia)){
            alert('Rectifique el / los números de teléfono')
            datosListos = false;
        }
        if(datosListos === false){
            return;
        }else{
            datosListos = true;
            // La contraseña se debe de actualizar por separado
            if (!this.state.isPswChanged)
                newUsuario = {
                    ...(!this.state.editar && {username: this.state.username}),
                    ...(!this.state.editar && {password: this.state.password}),
                    foto: this.state.foto,
                    nombre: this.state.nombre,
                    aPaterno: this.state.aPaterno,
                    aMaterno: this.state.aMaterno,
                    curp: this.state.curp,
                    sanguineo: this.state.sanguineo,
                    rol: [{
                        nombre: this.state.rol,
                        modulos: modulos
                    }],
                    contacto: [{
                        telefono: this.state.con_telefono,
                        email:this.state.con_email,
                        telEmergencia: this.state.con_telEmergencia
                    }],
                    direccion: [{
                        numero: this.state.dir_numero,
                        calle: this.state.dir_calle,
                        localidad: this.state.dir_localidad,
                        ciudad: this.state.dir_ciudad,
                        estado: this.state.dir_estado,
                        cp: this.state.dir_cp
                    }],
                    academico: [{
                        matricula: this.state.aca_matricula,
                        carrera: this.state.aca_carrera,
                        cuatrimestre: this.state.aca_cuatrimestre,
                        registro: this.state.aca_registro,
                        estatus: this.state.aca_estatus
                    }],
                    published: true
                };
            else
                newUsuario = {
                    password: bcrypt.hashSync(this.state.password,9)
                };
            
            this.setState({btnPswDisabled: true, btnGuardarDisabled: true});
            // Para editar o modificar el usuario
            if (this.state.editar)
                await axios.put(`https://node-server-credenciales.herokuapp.com/api/users/${this.props.miUsuario ? UserStore.id : this.props.match.params.id}`,newUsuario)
                    .then(res => {
                        if (res.status === 200){

                            if(this.props.miUsuario) {
                                this.reasignarStore();
                            }

                            // Si es que se modifica ya sea el usuario o sólo su contraseña
                            else if (!this.state.isPswChanged){
                                alert('Usuario modificado exitosamente.\nRedirigiendo...');
                                this.setState({redireccionar:true});
                                // window.location = this.props.miUsuario ? '/dashboard' : `/dashboard/${this.state.alumnos ? 'alumnos' : this.state.profesores ? 'profesores' : 'usuarios'}/consultar`
                            }
                            else{
                                alert('La contraseña ha sido modificada.');
                                this.setState({isPswChanged:false, password: '',  passwordRepeat: ''});
                            }
                        }
                        else if(res.status !== 500)
                            alert('Ha ocurrido un error. Inténtelo nuevamente.');
                        else
                            alert('Ha ocurrido un error con la conexión al servidor.');
                    })
                    .catch(error => console.error(error));
            else
                // En caso de que se deseé agregar un nuevo usuario
                await axios.post('https://node-server-credenciales.herokuapp.com/api/users', newUsuario)
                    .then(res => {
                        if (res.data.existente) {
                            alert('Ya existe un usuario registrado con ese email o nombre de usuario.');
                            return;
                        }
                        else if (res.status === 200){
                            alert('Usuario registrado exitosamente.\nRedirigiendo...');
                            // Regresa a la ventana de consultas
                            this.setState({redireccionar:true});
                            // window.location = `/dashboard/${this.state.alumnos ? 'alumnos' : this.state.profesores ? 'profesores' : 'usuarios'}/consultar`;
                        }
                        else if(res.status !== 500)
                            alert('Ha ocurrido un error. Inténtelo nuevamente.');
                        else
                            alert('Ha ocurrido un error con la conexión al servidor.');
                    })
                    .catch(error => console.error(error));
            this.setState({btnPswDisabled: false, btnGuardarDisabled: false});
        }
    }

    // cerrarModal = () => this.refs.alerta.close();
    // Al cambiar los roles del select
    // Realiza el cambio de permisos del usuario
    cambiarRoles = () => {
        // Permisos predefinidos
        const permisos = ['Crear', 'Modificar', 'Consultar', 'Eliminar'];

        this.setState({
            permisos_usuarios_ant: this.state.permisos_usuarios,
            permisos_alumnos_ant: this.state.permisos_alumnos,
            permisos_profesores_ant: this.state.permisos_profesores,
            cambioRol: !this.state.cambioRol,
            cambioRolAlt: !this.state.cambioRolAlt
        })

        if (this.state.rol === 'Super Administrador'){
            this.setState({
                permisos_usuarios: permisos,
                permisos_alumnos: permisos,
                permisos_profesores: permisos,
                permisos_credenciales: ['Modificar formato'],
            });
            return;
        }
        if (this.state.rol === 'Administrador del sistema'){
            this.setState({
                permisos_usuarios: permisos,
                permisos_alumnos: ['','','',''],
                permisos_profesores: ['','','',''],
                permisos_credenciales: ['Modificar formato'],
            });
            return;
        }
        if (this.state.rol === 'Administrador de la escuela'){
            this.setState({
                permisos_usuarios: ['','','',''],
                permisos_alumnos: permisos,
                permisos_profesores: permisos,
                permisos_credenciales: ['Modificar formato'],
            });
            return;
        }
        if (this.state.rol === 'Consultor'){
            this.setState({
                permisos_usuarios: ['','','Consultar',''],
                permisos_alumnos: ['','','Consultar',''],
                permisos_profesores: ['','','Consultar',''],
                permisos_credenciales: [''],
            });
            return;
        }
        if (this.state.rol === 'Consultor del sistema'){
            this.setState({
                permisos_usuarios: ['','','Consultar',''],
                permisos_alumnos: ['','','',''],
                permisos_profesores: ['','','',''],
                permisos_credenciales: [''],
            });
            return;
        }
        if (this.state.rol === 'Consultor de la escuela'){
            this.setState({
                permisos_usuarios: ['','','',''],
                permisos_alumnos: ['','','Consultar',''],
                permisos_profesores: ['','','Consultar',''],
                permisos_credenciales: [''],
            });
            return;
        }
        if (this.state.rol === 'Diseñador'){
            this.setState({
                permisos_usuarios: ['','','',''],
                permisos_alumnos: ['','','',''],
                permisos_profesores: ['','','',''],
                permisos_credenciales: ['Modificar formato'],
            });
            return;
        }
        if (this.state.rol === 'Alumno' || this.state.rol === 'Profesor'){
            this.setState({
                permisos_usuarios: ['','','',''],
                permisos_alumnos: ['','','',''],
                permisos_profesores: ['','','',''],
                permisos_credenciales: ['Generar formato'],
            });
            return;
        }
    }
    // Permite la apertura del modal de cambio de contraseña
    apartadoPassword = () => {
        // En caso de que se deseé o no cambiar la contraseña
        if (!this.state.isPswChanged)
            return(
                <div style={{textAlign:'center', marginTop:'10px'}}>
                    <SubmitButton
                        text="Cambiar contraseña"
                        icon={<BiIcons.BiLock/>}
                        onclick={() => {
                            // Al hacer click, desencadena la apertura del modal
                            this.setState({ isPswChanged:true });
                        }}
                        styles="no_margin"
                    />
                </div>
            )
        return (
            <div>
                <OpenModal
                    // Cuando se cierra el modal
                    onClose = {() => {
                        this.setState({
                            password: '', 
                            passwordRepeat: '',
                            isPswChanged:false
                        });
                        return;
                    }}
                    contenido={
                        <>
                        {/* Inputs de contraseña */}
                        {this.inputTextEditable('Nueva contraseña', this.state.password, 'password','password', 32)}
                        {this.inputTextEditable('Repita contraseña', this.state.passwordRepeat, 'password','passwordRepeat', 32)}
                        <div className="fila" style={{textAlign:'center', marginTop:'10px'}}>
                            {/* Botón de cancelación */}
                            <SubmitButton
                                text="Cancelar"
                                onclick={() => {
                                    this.setState({
                                        password: '', 
                                        passwordRepeat: '',
                                        isPswChanged:false
                                    });
                                    return;
                                }}
                                styles="no_margin blanco btn-blanco"
                            />
                            {/* Botón para salvar los cambios */}
                            <SubmitButton
                                text="Guardar"
                                disabled = { this.state.btnPswDisabled }
                                onclick={() => {
                                    // Realiza la validación de contraseñas
                                    if (this.state.password !== this.state.passwordRepeat)
                                    {
                                        this.setState({
                                            password: '', 
                                            passwordRepeat: ''});
                                        alert('Las contraseñas no coinciden');
                                        return;
                                    }
                                    // Si todo es correcto, guarda la contraseña
                                    this.state.password.length > 0 ? this.guardarUsuario() : alert('La contraseña no puede ser vacía');
                                    this.apartadoPassword();
                                }}
                                styles="no_margin"
                            />
                        </div>
                        </>
                    }
                />
            </div>
        );
    }

    // Renderiza los inputs en base a la sección en la que se encuentre
    renderDatos = () => {
        if (this.state.zona === 'cuenta')
            return(
                <div>
                    {this.props.miUsuario ? 
                    <div className="columns">
                        <span className="etiqueta" style={{marginLeft:'0'}}>ROL</span>
                        <span className="span-descriptivo" style={{color:'#b4b4b4'}}>{this.state.rol}</span>
                    </div>
                    :
                    this.inputSelectEditable(
                        'ROL',
                        'rol',
                        this.state.rol,
                        {nombre:[ 'Super Administrador', 'Administrador del sistema', 'Administrador de la escuela', 'Consultor', 'Consultor del sistema', 'Consultor de la escuela', 'Diseñador', 'Alumno', 'Profesor']}
                    )}
                    {/* En caso de que se deseé editar un usuario */}
                    {this.state.editar ? 
                    <div className="columns">
                        <span className="etiqueta" style={{marginLeft:'0'}}>NOMBRE DE USUARIO*</span>
                        <span className="span-descriptivo" style={{color:'#b4b4b4'}}>{this.state.username}</span>
                    </div> :
                    this.inputTextEditable('Nombre de usuario*', this.state.username, 'text', 'username', 12)
                    }
                    {this.state.editar ? this.apartadoPassword() : this.inputTextEditable('Contraseña*', this.state.password, 'password','password', 32) }
                </div>
            )

        if (this.state.zona === 'personales')
            return(
                <div>
                    {this.inputTextEditable('Nombre(s)*', this.state.nombre, 'text', 'nombre', 50)}

                    {this.inputTextEditable('Apellido paterno*',this.state.aPaterno, 'text', 'aPaterno', 50)}

                    {this.inputTextEditable('Apellido materno',this.state.aMaterno, 'text', 'aMaterno', 50)}
                    {this.props.miUsuario ? 
                    <div className="columns">
                        <span className="etiqueta" style={{marginLeft:'0'}}>CURP</span>
                        <span className="span-descriptivo" style={{color:'#b4b4b4'}}>{this.state.curp}</span>
                    </div>
                    :
                    <div className="fila">
                        {this.inputTextEditable('CURP*',this.state.curp, 'text', 'curp', 18)}
                        <div className="inp-numero">
                            {this.inputSelectEditable(
                                'RH',
                                'sanguineo',
                                this.state.sanguineo,
                                {nombre:[ 'O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+']}
                            )}
                        </div>
                    </div>
                    }
                </div>
            )

        if (this.state.zona === 'direccion')
            return(
                <div>
                    <div className="fila">
                        {this.inputTextEditable('Calle',this.state.dir_calle, 'text', 'dir_calle', 50)}
                        <div className="inp-numero">
                            {this.inputTextEditable('Numero',this.state.dir_numero, 'text', 'dir_numero', 5)}
                        </div>
                    </div>
                    <div className="fila">
                        {this.inputTextEditable('Localidad',this.state.dir_localidad, 'text', 'dir_localidad', 80)}
                        <div className="inp-numero">
                            {this.inputTextEditable('C.P.*',this.state.dir_cp, 'text', 'dir_cp', 7)}
                        </div>
                    </div>
                    {this.inputTextEditable('Ciudad*',this.state.dir_ciudad, 'text', 'dir_ciudad', 50)}

                    {this.inputTextEditable('Estado*',this.state.dir_estado, 'text', 'dir_estado', 50)}
                </div>
            )
        if (this.state.zona === 'contacto')
            return(
                <div>
                    {
                        this.state.editar || this.props.miUsuario ?
                        <div className="columns">
                            <span className="etiqueta" style={{marginLeft:'0'}}>CORREO ELECTRÓNICO</span>
                            <span className="span-descriptivo" style={{color:'#b4b4b4'}}>{this.state.con_email}</span>
                        </div>
                        :
                        this.inputTextEditable('Correo electrónico*',this.state.con_email, 'text', 'con_email', 50)
                    }
                    
                    {this.inputTextEditable('Teléfono*',this.state.con_telefono, 'text', 'con_telefono', 10)}

                    {this.inputTextEditable('Teléfono Emer.*',this.state.con_telEmergencia, 'text', 'con_telEmergencia', 10)}
                </div>
            )
        if (this.state.zona === 'academico')
            return(
                <div>
                    {console.log(UserStore)}
                    { UserStore.role !== 'Alumno' && UserStore.role !== 'Profesor' ?
                    this.inputTextEditable('Matrícula*',this.state.aca_matricula, 'text', 'aca_matricula', 10) : 
                    <div className="columns">
                        <span className="etiqueta" style={{marginLeft:'0'}}>MATRÍCULA</span>
                        <span className="span-descriptivo" style={{color:'#b4b4b4'}}>{UserStore.idStudent}</span>
                    </div>
                    }

                    {this.inputSelectEditable(
                        'CARRERA',
                        'aca_carrera',
                        UserStore.role !== 'Alumno' && UserStore.role !== 'Profesor' ? this.state.aca_carrera : UserStore.career,
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
                    {UserStore.role !== 'Alumno' && UserStore.role !== 'Profesor' && !window.location.href.includes('profesores') ? 
                    <div className="inp-numero">
                        {this.inputSelectEditable(
                            'Cuatrimestre',
                            'aca_cuatrimestre',
                            this.state.aca_cuatrimestre,
                            {nombre:[ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]}
                        )}
                    </div>
                    : 
                    <></>
                    }
                    {UserStore.role !== 'Alumno' && UserStore.role !== 'Profesor' ? 
                    <><div className="inp-numero">
                        {this.inputSelectEditable(
                            'Estado',
                            'aca_estatus',
                            this.state.aca_estatus,
                            {nombre:[ true, false]}
                        )}
                    </div>


                    <div className="columns texto-editable">
                        <div className="fila">
                            <span className="etiqueta" style={{marginLeft:'0'}}>FECHA DE REGISTRO</span>
                            <RiIcons.RiAddLine className="lapiz-icon"/>
                        </div>
                        
                        <DatePicker
                            className="input mg_top no-border"
                            selected = {this.state.aca_registro}
                            onChange={fecha => this.setState({aca_registro : fecha})}
                        />
                    </div></> : <></>
                    }

                </div>
            )
    }
    // Estado cambia con los select
    setSelectValue = (e) => {
        var asignacion = e.target.value;
        if (asignacion === 'Activo')
            asignacion = true
        if (asignacion === 'Inactivo')
            asignacion = false;
        this.setState({
            [e.target.name] : asignacion
        },() => this.cambiarRoles());
    }

    // Estado cambia con inputs
    setInputValue = (property, val, maxLenght) => {
        var regex; 
        if (property === 'curp'){
            regex = /^[a-zA-Z0-9]+$/i
            if (!regex.test(val) && val.length > 0)
                return
            val = val.toUpperCase();
        }
        if (property === 'username'){
            regex = /^[a-z0-9+._]+$/i
            if (!regex.test(val) && val.length > 0)
                return
            val = val.trim();
        }

        if (property === 'aMaterno' || property === 'aPaterno' || property === 'nombre') {
            regex = /^[ \-a-zA-ZÀ-ÿ\u00f1\u00d1]*$/g;
            if (!regex.test(val) && val.length > 0)
                return;
        }

        if (property === 'con_telefono' || property === 'con_telEmergencia' || property === 'dir_numero'  || property === 'dir_cp') {
            regex = /^[ +()\-.0-9]+$/i
            if (!regex.test(val) && val.length > 0)
                return
        }

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

    // Al hacer click sobre uno de los checkboxes
    handleCheckbox = (e, index, permiso, modulo) => {
        switch (modulo) {
            case 'Usuarios':
                e.target.checked ? this.state.permisos_usuarios.splice(index,1,permiso) : this.state.permisos_usuarios.splice(index,1,'');
                break;
            case 'Alumnos':
                e.target.checked ? this.state.permisos_alumnos.splice(index,1,permiso) : this.state.permisos_alumnos.splice(index,1,'');
                break;
            case 'Profesores':
                e.target.checked ? this.state.permisos_profesores.splice(index,1,permiso) : this.state.permisos_profesores.splice(index,1,'');
                break;
            default:
                e.target.checked ? this.state.permisos_credenciales.splice(index,1,permiso) : this.state.permisos_credenciales.splice(index,1,'');
        }
    }
    // Renderiza los checkboxes con permisos a los cuales tiene acceso el usuario
    renderPermisos = () => {
        var nombreMod ='';
        // Variable de módulos predefinidos
        const modulos = [
            { nombre:'Usuarios', permisos: ['Crear', 'Modificar', 'Consultar', 'Eliminar'] },
            { nombre:'Alumnos', permisos: ['Crear', 'Modificar', 'Consultar', 'Eliminar'] },
            { nombre:'Profesores', permisos: ['Crear', 'Modificar', 'Consultar', 'Eliminar'] }
        ];
        return(
        <div className="columns">
            <div className="fila">
                {
                //Recorre todos los módulos del arreglo definido anteriormente
                modulos.map((modulo,modIndex) => {
                    return(
                    <div className={'columns'} key={modIndex}> 
                    <div className="columns">
                        <span className="etiqueta" style={{marginLeft:'0'}}>{modulo.nombre.toUpperCase()}</span>
                        {/* Recorre cada uno de los permisos del módulo */}
                        {modulo.permisos.map((permiso, perIndex) => {
                            nombreMod = modulo.nombre === 'Usuarios' ? this.state.permisos_usuarios : modulo.nombre === 'Alumnos' ? this.state.permisos_alumnos : this.state.permisos_profesores;
                            // En caso de que el permiso se encuentre en el arreglo de permisos del módulo, lo marca como seleccionado, sino, únicamente lo renderiza.
                            return(
                            <div className="fila" style={{color:'#555555'}} key={perIndex}>
                                <span>
                                <Checkbox 
                                disabled={true}
                                set={nombreMod.includes(permiso)}
                                onClick={(e) => this.handleCheckbox(e,perIndex,{permiso},modulo.nombre)} /> 
                                </span>
                                <span>{permiso}</span>
                            </div>   
                            )
                        })}
                    </div>
                    </div>
                )})
                }
            </div>
            <span className="etiqueta" style={{marginLeft:'0'}}>CREDENCIALES</span>
            <div className="columns">
                <div className="fila" style={{color:'#555555'}}>
                    {/* Checkbox de las credenciales */}
                    {/* Para cada checkbox, revisa si incluye el permiso asignado a cada checkbox */}
                    <span>
                        <Checkbox 
                            disabled={true}
                            set={this.state.permisos_credenciales.includes('Modificar formato')}
                            onClick={(e) => this.handleCheckbox(e,0,'Modificar formato','Credenciales')} />
                    </span>
                    <span>Modificar formato</span>
                </div>
                <div className="fila" style={{color:'#555555'}}>
                    <span>
                        <Checkbox 
                            disabled={true}
                            set={this.state.permisos_credenciales.includes('Generar formato')}
                            onClick={(e) => this.handleCheckbox(e,0,'Generar formato','Credenciales')} />
                    </span>
                    <span>Generar formato</span>
                </div>
            </div>
            
        </div>
        )
    }

    redireccionar() {
        if( this.state.redireccionar )
        return(
            <div>
                {this.props.miUsuario ? <Redirect to="/dashboard"/> : 
                this.state.alumnos ? <Redirect to='/dashboard/alumnos/consultar'/> :
                this.state.profesores ? <Redirect to='/dashboard/profesores/consultar'/> :
                <Redirect to='/dashboard/usuarios/consultar'/> 
                }
            </div>
                    
        )
    }

    render() {
        if(this.state.isLoading)
            return(<Loader/>)
        else
        return (
            <div className="main_fila main">
                {this.redireccionar()}
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
                                // Verifica que la foto sea cuadrada al 95%
                                if (this.imgRef.current.clientHeight >= this.imgRef.current.clientWidth * 0.95 || this.imgRef.current.clientHeight <= this.imgRef.current.clientWidth * 1.05)
                                    this.setState({
                                        fotoAnt : this.state.foto
                                    })
                                else{
                                    this.setState({
                                        foto: this.state.fotoAnt
                                    })
                                    alert('La relación de aspecto debe ser cuadrada')
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
                            activo={this.state.zona === 'direccion' ? true : false}
                            nombre='Dirección'
                            descripcion='Calle, número, localidad, ciudad, estado, C.P.'
                            onclick={ () => this.setState({zona:'direccion'}) }
                        />
                        
                        {window.location.href.includes('alumnos') || window.location.href.includes('profesores') || UserStore.role === 'Alumno' || UserStore.role === 'Profesor' ?
                        <BtnSeccion
                            activo={this.state.zona === 'academico' ? true : false}
                            nombre='Académico'
                            descripcion={window.location.href.includes('profesores') ? 'Carrera, matrícula' : 'Carrera, cuatrimestre, matrícula'}
                            onclick={ () => this.setState({zona:'academico'}) }
                        />
                        : <></>}

                        <BtnSeccion
                            activo={this.state.zona === 'contacto' ? true : false}
                            nombre='Contacto'
                            descripcion='Correo electrónico, teléfono, teléfono de emergencia'
                            onclick={ () => this.setState({zona:'contacto'}) }
                        />

                        <div style={{textAlign:'center', marginTop:'10px'}}>
                            <SubmitButton
                            text={this.state.editar ? 'Guardar cambios' : 'Agregar usuario'}
                            icon={this.state.editar ? <BiIcons.BiUserCheck/> : <BiIcons.BiUserPlus/>}
                            disabled = { this.state.btnGuardarDisabled }
                            onclick={() => {this.guardarUsuario();}}
                            styles="no_margin"
                            />
                        </div>
                        
                    </div>
                </div>
                <div className="columns">
                    <div className="columns col-iz">
                        <div className="caja-main-iz" style={{height:'auto'}}>
                            <div className="columns">
                                {this.renderDatos()}
                            </div>
                        </div>
                    </div>
                    {this.state.zona === 'cuenta' /*&& this.state.permisos_usuarios.length !== 0*/ ? 
                    <div className="columns col-iz">
                        <div className="caja-main-iz" style={{height:'auto'}}>
                            <div className="columns">
                                <span className="etiqueta" style={{marginLeft:'0'}}>PERMISOS DEL ROL</span>
                                <div className="fila">

                                    {this.state.cambioRol === true ? this.renderPermisos()  : ''}
                                    {this.state.cambioRolAlt === true ? this.renderPermisos()  : ''}

                                </div>
                                
                            </div>
                        </div>
                    </div> : ''}

                </div>

            </div>
        )
    }
}

export default withRouter(AltaUsuarios) 
