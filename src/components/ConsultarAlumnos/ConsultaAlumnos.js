import React, { Component } from 'react'
import axios from 'axios'
import { Modal } from 'react-responsive-modal';
// Íconos e imágenes
import imgBusqueda from '../ConsultarUsuarios/img/busqueda.jpg'
import * as BiIcons from 'react-icons/bi'
import * as GrIcons from 'react-icons/gr'
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
import "react-responsive-modal/styles.css"

export class ConsultaAlumnos extends Component {

    // Estado de la case
    state = {
        modalEliminar:false,
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
        permisos: [],
        // Para cuando se estén obteniendo los usuarios del servidor
        cargandoUs: true,
        // Permiten la actualización de la tabla en los checkbox
        cambioTabla:true,
        cambioTablaAlt:false,

        btnBajaLogDisabled:false,
        btnBajaFisDisabled:false,
        btnMuchasCredDisabled: false
    }
    // Obtiene los usuarios del servidor
    getUsuarios = async () => {
        let res = await fetch('https://node-server-credenciales.herokuapp.com/api/users', {
            method: 'get',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
            credentials: 'include'
        }); // From API

        let result = await res.json();
        if (result && res.status === 200){
            var usuarios = [];
            var usuarios_id = [];
            const query = this.props.profesores ? 'Profesor' : 'Alumno';
            result
                .filter(usuario => usuario.rol[0].nombre === query)
                .forEach(usuario => {
                    usuarios.push(usuario);
                    usuarios_id.push(usuario._id);
                })
            this.setState({
                usuarios: usuarios,
                userQry: usuarios,
                usersForCredential: usuarios_id,
                cargandoUs: false
            })
        }
    }

    // Obtiene los modulos del servidor
    getModulos = async () => {
        const res = await axios.get(`https://node-server-credenciales.herokuapp.com/api/users/${UserStore.id}`);
        if (res.status === 200)
            this.setState({permisos: res.data.rol[0].modulos[1].permisos});
    }
    
    // Realiza la actualización de estado entre la baja lógica y la física
    bajaLogica = async() =>{
        const newUsuario = {
            academico: [{ 
                matricula: this.state.userSelected.academico[0].matricula,
                carrera: this.state.userSelected.academico[0].carrera,
                cuatrimestre: this.state.userSelected.academico[0].cuatrimestre,
                estatus: false 
            }],
        };

        this.setState({btnBajaLogDisabled: true});
        await axios.put(`https://node-server-credenciales.herokuapp.com/api/users/${this.state.userSelected._id}`,newUsuario)
            .then(res => {
                if (res.status === 200){
                    alert('Usuario modificado exitosamente.');
                    this.actualizarTabla();
                    this.setState({ modalEliminar:false });
                }
                else if(res.status !== 500)
                    alert('Ha ocurrido un error. Inténtelo nuevamente.');
                else
                    alert('Ha ocurrido un error con la conexión al servidor.');
            })
            .catch(error => console.error(error));

        this.setState({btnBajaLogDisabled: false});
        
    }
    // Eliminación total del usuario
    bajaFisica = async() =>{
        this.setState({btnBajaFisDisabled: true});
        await axios.delete(`https://node-server-credenciales.herokuapp.com/api/users/${this.state.userSelected._id}`)
            .then(res => {
                if (res.status === 200){
                    alert('Usuario eliminado con éxito.');
                    this.actualizarTabla();
                    this.setState({ modalEliminar:false ,userSelected:[] });
                }
                else if(res.status !== 500)
                    alert('Ha ocurrido un error. Inténtelo nuevamente.');
                else
                    alert('Ha ocurrido un error con la conexión al servidor.');
            })
            .catch(error => console.error(error));
        this.setState({btnBajaFisDisabled: false});
    }

    // Obtiene el archivo PDF en base 64
    getCredenciales = async (datos, formato) => {
        this.setState({btnMuchasCredDisabled: true});
        const enviados = {
            usuarios: datos,
            formato: formato
        };
        console.log(enviados);
        const res = await axios.post('https://node-server-credenciales.herokuapp.com/cards', enviados);
        this.setState({btnMuchasCredDisabled: false});
        this.generarArchivo(res.data.pdf, 'Credenciales');
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
        this.setState({
            cambioTabla: !this.state.cambioTabla,
            cambioTablaAlt: !this.state.cambioTablaAlt
        });
    }
    // Busca todos
    busqueda = () => {
        // Sólo obtiene los ID para la seleccion de credenciales
        var usuarios_id = [];
        this.state.usuarios.forEach(usuario =>  usuarios_id.push(usuario._id));
        // Actualización de estado para mostrar en tabla y en lista de credenciales
        this.setState({
            userQry:this.state.usuarios,
            usersForCredential: usuarios_id,
            cambioTabla: !this.state.cambioTabla,
            cambioTablaAlt: !this.state.cambioTablaAlt
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
                    if (`${usuario.academico[0].estatus ? 'Activo' : 'Inactivo'}` === this.state.estado)
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
            aMaterno: '',
            cambioTabla: !this.state.cambioTabla,
            cambioTablaAlt: !this.state.cambioTablaAlt
        });
    }

    // Cuando el componenente es renderizado
    componentDidMount() {
        this.getUsuarios();
        this.getModulos();
    }

    // Llamado antes de que se renderice el módulo
    componentDidUpdate(preProps, preState) {
        if (preProps.profesores !== this.props.profesores){
            this.setState({cargandoUs : true});
            this.getUsuarios();
        }
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
                eliminarClick={() => this.setState({modalEliminar:true})}
                btnCardDisabled={this.state.btnMuchasCredDisabled}
                cardClick={() => {
                    this.getCredenciales(arrIds, this.props.profesores ? 'UPPCredencial2' : 'UPPCredencial1');
                    alert('Se está generando el archivo para su descarga.');
                }}
                />
            )
        }
        return(
            <div className="centrado">
                <span className="text no-seleccionado">No ha seleccionado un {this.props.profesores ? 'profesor' : 'alumno'}.</span>
            </div>
        )
    }
    // Abre un modal para seleccionar el tipo de eliminación que desea efectuar
    modalEliminar = () => {
        return(
            <div>
                <Modal open={this.state.modalEliminar} onClose={() => this.setState({ modalEliminar:false })}>
                    <div style={{color:'#555555'}}>
                            {/* Botón de cancelación */}
                            <h1 className="title">
                                <GrIcons.GrCircleInformation/>
                                <span>Sobre la eliminación</span>
                            </h1><br/>
                            <p>Una <b>baja lógica</b> es la desactivación del usuario sin que se pierdan</p>
                            <p> sus datos almacenados en el sistema.</p>
                            <p>Por otro lado, una <b>baja física</b> es la eliminación definitiva de un </p>
                            <p>usuario dentro del sistema; es decir, sus datos serán borrados</p><p> del sistema.</p><br/>
                            <p>¿Qué clase de eliminación desea efectuar?</p><br/>
                        <div className="fila justificado" style={{textAlign:'center', marginTop:'10px'}}>
                            <SubmitButton
                                text="Baja lógica"
                                disabled={this.state.btnBajaLogDisabled}
                                onclick={() => this.bajaLogica() }
                                styles="no_margin"
                            />
                            
                            {/* Botón para salvar los cambios */}
                            <SubmitButton
                                text="Baja física"
                                disabled={this.state.btnBajaFisDisabled}
                                onclick={() => {
                                    if (window.confirm('Los datos serán eliminados de forma permanente, ¿Está seguro?'))
                                        this.bajaFisica()
                                    else
                                        this.setState({ modalEliminar:false });
                                } }
                                styles="no_margin"
                            />
                        </div>
                    </div>
                </Modal>
            </div>
        )
    }
    // Deja los datos de la tabla vacíos y realiza nuevamente la petición al servidor
    // para obtener los usuarios registrados como alumnos
    actualizarTabla = () => {
        this.setState({
            usuarios : [], // Ususarios de la petición al servidor
            userQry : [], // Ususarios consultados
            usersForCredential: [], // IDs de usuarios para credencial
            cargandoUs: true
        })
        this.getUsuarios()
    }
    // Permite, a través de un checkbox, seleccionar todos los usuarios para 
    // generar credenciales o no
    todosCredencial = (e) => {
        var usuarios_id = [];
        if (e.target.checked)
            this.state.userQry.forEach(usuario => usuarios_id.push(usuario._id));
        this.setState({
            usersForCredential:usuarios_id,
            cambioTabla: !this.state.cambioTabla,
            cambioTablaAlt: !this.state.cambioTablaAlt
        });
    }

    // Renderiza la tabla con los datos en userQry y usersForCredential
    renderTabla = () =>{
        if (this.state.cargandoUs)
            return(<Loader/>)
        if(this.state.userQry.length === 0)
            return(<><br/><br/><span className="texto_mediano"> {this.props.profesores ? 'Profesores' : 'Alumnos'} no encontrados </span></>)
        else
        // Sólo renderiza en caso de  que no se esté cargando o la lista no esté vacía
        return(
            <div>
            <table className="tabla">
                <tbody>
                    <tr>
                        {/* Headers */}
                        <th style={{minWidth:'25px'}}>
                            <Checkbox
                                set={this.state.userQry.length === this.state.usersForCredential.length}
                                onClick={e => this.todosCredencial(e)}
                            />
                        </th>
                        <th className="adjustable_td">Nombre completo</th>
                        <th className="matricula">Matricula</th>
                        <th className="adjustable_td">Carrera</th>
                        {!this.props.profesores ? <th className="rol">Cuatrimestre</th> : <></>}
                        <th className="activo-tabla" style={{borderLeft:'none'}}>Activo</th>
                    </tr>
                </tbody>
            </table>
            <div className="datos-tabla">

            <table className="tabla" style={{marginTop:0}}>
                <tbody>

                    {/* Carga los datos de los alumnos */}
                    {/* El checkbox se activa si están en la lista de usersForCredential */}
                    {
                    this.state.userQry.length > 0 ?
                    this.state.userQry.map((usuario, usIndex) => {
                        return(
                            <tr key = {usIndex} onClick={() => this.setState({userSelected:usuario})}>
                                <td style={{minWidth:'25px', padding: '15px 0px'}}>
                                    <Checkbox
                                    key = {usIndex}
                                    set={this.state.usersForCredential.includes(usuario._id)}
                                    onClick={(e) => {
                                        this.selectUserForCard(usuario, e.target.value)
                                    }}/>
                                </td>
                                <td className="adjustable_td">{`${usuario.nombre} ${usuario.aPaterno} ${usuario.aMaterno} `}</td>
                                <td className="matricula">{usuario.academico[0].matricula}</td>
                                <td className="adjustable_td">{usuario.academico[0].carrera}</td>
                                {!this.props.profesores ? <td className="rol">{usuario.academico[0].cuatrimestre}</td> : <></>}
                                <td className="activo-tabla" style={{borderLeft:'none'}}> {usuario.academico[0].estatus ? 'Sí' : 'No'}</td>
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
        )
    }

    // Renderizado del módulo
    render() {
        return (
            <div className="modulo max-1357px">
                {this.modalEliminar()}
                <div className="resize-columna justificado ">
                    <div className="contenedor blanco full_width mh_img">
                        <img src={imgBusqueda} alt="" className="img_contenedor_principal"></img>
                        <div className="contenidoMod">
                            <h1 className="resize-title-alu title">Buscar {this.props.profesores ? 'profesor' : 'alumno'} por...</h1><br/>
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
                                    <h1 className="title">{this.props.profesores ? 'Profesores' : 'Alumnos'}</h1>
                                    <div className="desc-modulo">

                                    <p className="texto"><BiIcons.BiHelpCircle/>  Para conocer más detalles del {this.props.profesores ? 'profesor' : 'alumno'}, haga click sobre él. De ser necesario,</p><p className="texto" style={{marginTop:0}}> seleccione el botón a la derecha para generar las credenciales de todos los {this.props.profesores ? 'profesores' : 'alumnos'} de la tabla.</p>
                                    </div>
                                </div>
                                <div className="columns">
                                    <SubmitButton
                                    styles='large-text'
                                    disabled={this.state.btnMuchasCredDisabled}
                                    text='Generar credenciales'
                                    onclick={() => {
                                        this.getCredenciales(this.state.usersForCredential, this.props.profesores ? 'UPPCredencial2' : 'UPPCredencial1');
                                        alert('Se está preparando el archivo para su descarga.');
                                    }}
                                    />
                                </div>
                            </div>
                            
                            {/* Permite renderizar la tabla de nuevo al buscar */}
                            {this.state.cambioTabla === true ? this.renderTabla()  : ''}
                            {this.state.cambioTablaAlt === true ? this.renderTabla()  : ''}

                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default ConsultaAlumnos
