// Esto es un comentario de prueba

import React, {Component} from 'react';
import { observer } from 'mobx-react'
import './App.css';
import { BrowserRouter as Router, Route, Switch, Link, Redirect } from 'react-router-dom';
// import 'bootstrap/dist/css/bootstrap.min.css';
import * as BiIcons from 'react-icons/bi';

// Componentes
import UserStore from './components/Stores/UserStore';
import LoginForm from './components/LoginForm/LoginForm'
import SubmitButton from './components/GeneralUseComp/SubmitButton'
import Navbar from './components/Navbar/Navbar'

// Módulos
import AltaUsuarios from './components/AgregarUsuarios/AltaUsuarios'
import ConsultaUsuarios from './components/ConsultarUsuarios/ConsultaUsuarios'
import AltaAlumnos from './components/AgregarAlumnos/AltaAlumnos'
import ConsultaAlumnos from './components/ConsultarAlumnos/ConsultaAlumnos'
import ConsultaCredencial from './components/ConsultaCredencial/ConsultaCredencial'
import ModificarCredencial from './components/FormatoCredenciales/ModificarCredencial'
import MainComponent from './components/Main/MainComponent'
import PaginaNoEncontrada from './components/PaginaNoEncontrada/PaginaNoEncontrada'
import AcercaDe from './components/AcercaDe/AcercaDe'
import MyAccount from './components/MyAccount/MyAccount'


import Loader from './components/GeneralUseComp/Loader';

class App extends Component {

  state = {
    navActivado: window.innerWidth > 1365 ? true: false,
  }

  // For logging out
  async doLogout () {
    try {
      // Check if user is logged in or not
      let res = await fetch('http://localhost:4000/session/logout', {
        method: 'post',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      }); // From API

      let result = await res.json();

      // Regresa al estado original
      if (result && result.success) {
        UserStore.isLoggedIn = false;
        UserStore.username = '';
        UserStore.id = '';
        UserStore.name = '';
        UserStore.lastName = '';
        UserStore.role = '';
        UserStore.photo = '';
        UserStore.email = '';
        UserStore.Usuarios = [];
        UserStore.Alumnos = [];
        UserStore.Credenciales = [];
      }
    } catch (error) {
      console.log(error);
    }
  }

  changeNavbar = () => this.setState({navActivado: !this.state.navActivado})
  
  // When component loads
  async componentDidMount () {
    try {
      // Check if user is logged in or not
      let res = await fetch('http://localhost:4000/session/isLoggedIn', {
        method: 'post',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      }); // From API

      let result = await res.json();

      // If it's logged in
      if (result && result.success) {
        UserStore.loading = false;
        UserStore.isLoggedIn = true;
        UserStore.username = result.username;
        UserStore.id = result._id;
        UserStore.name = result.nombre;
        UserStore.lastNameP = result.apellidoPaterno;
        UserStore.curp = result.curp;
        UserStore.rh = result.seguroSocial[0].gpoSanguineo;
        UserStore.numSS = result.seguroSocial[0].numSos;
        UserStore.lastNameM = result.apellidoMaterno ? result.apellidoMaterno : '';
        UserStore.role = result.role;
        UserStore.photo = result.foto;
        UserStore.email = result.contacto[0].email;
        UserStore.tel = result.contacto[0].telefono;
        UserStore.telEmer = result.contacto[0].telEmergencia;
        UserStore.street = result.direccion[0].calle;
        UserStore.streetNo = result.direccion[0].numero;
        UserStore.location = result.direccion[0].localidad;
        UserStore.city = result.direccion[0].ciudad;
        UserStore.postalCode = result.direccion[0].cp;
        UserStore.state = result.direccion[0].estado;
        //Asignación de permisos
        if(UserStore.role !== 'Alumno'){
          if(result.modulos[0].permisos)
            UserStore.Usuarios = result.modulos[0].permisos;
          if(result.modulos[1].permisos)
            UserStore.Alumnos = result.modulos[1].permisos;
          if(result.modulos[2].permisos)
            UserStore.Credenciales = result.modulos[2].permisos;
        }
        else {
          UserStore.career = result.datosAcademicos[0].carrera;
          UserStore.idStudent = result.datosAcademicos[0].matricula;
          UserStore.grade = result.datosAcademicos[0].cuatrimestre;
          UserStore.aca_estatus = result.datosAcademicos[0].estatus;
          if(result.modulos[0].permisos)
            UserStore.Credenciales = result.modulos[0].permisos;
        }
      }
      else {
        UserStore.loading = false;
        UserStore.isLoggedIn = false;
      }
    } catch (error) {
      UserStore.loading = false;
      UserStore.isLoggedIn = false;
    }
  }

  render() {
    // En caso de que se estén cargando datos del servidor
    if (UserStore.loading && !UserStore.isLoggedIn) {
      return (
        <div className="app">
          <div className="container">
              <div className="absoluto-centrado" style={{top:'calc(50% - 16px)'}}>
                  <Loader/>
              </div>
          </div>
        </div>
      );
    }
    // Verifica si se encuentra logueado y ya se cargó todo
    else {
      if(UserStore.isLoggedIn && UserStore.id && (UserStore.Alumnos[0] || UserStore.Credenciales[0])){
        // En caso de ser alumno
        if (UserStore.role !== 'Alumno')
          return (
            <Router>
              {/* Barra de navegación */}
              <Navbar 
                profile_name={UserStore.name} 
                profile_photo={UserStore.photo} 
                profile_lastName = {`${UserStore.lastNameP} ${UserStore.lastNameM ? UserStore.lastNameM : ''}`}
                profile_role={UserStore.role}
                activateNavbar = {() => this.changeNavbar()}
              />
              <Link to='/'>
              <SubmitButton
                  styles={'right-icon top'}
                  icon={<BiIcons.BiLogOut className="logout-icon"/>}
                  text = {'Salir'}
                  disabled = {false}
                  minText= {true}
                  onclick = {() => {this.doLogout()}}/>
              </Link>

              <div className={this.state.navActivado ? 'contenido nav-activado' : 'contenido'}>
                <Switch>
                    <Route exact path="/auth">
                      <Redirect to='/dashboard' />
                    </Route>
                    <Route path='/dashboard' exact component= {MainComponent} />
                    {/* Para los usuarios con acceso a los datos de los usuarios */}
                    {UserStore.Usuarios.map((permiso, perIndex) => {
                      
                      if (permiso === 'Consultar')
                        return(<Route key={perIndex} path='/dashboard/usuarios/consultar' component= {ConsultaUsuarios} />)
                      if (permiso === 'Crear')
                        // La razón de escribir el componente como función flecha anónima es debido a que de esa forma, es posible actualizar el componente completo al cambiar la ruta
                        return(<Route key={perIndex} path='/dashboard/usuarios/crear' component= {(props) => (<AltaUsuarios timestamp = {new Date().toString()} miUsuario={false} {...props}/>)} />)
                      if (permiso === 'Modificar')
                        return(<Route key={perIndex} path='/dashboard/usuarios/editar/:id' component= {(props) => (<AltaUsuarios timestamp = {new Date().toString()} miUsuario={false} {...props}/>)} />)
                      else
                        return('')
                    })}

                    {/* Para los usuarios con acceso a los datos de los alumnos  */}
                    {UserStore.Alumnos.map((permiso, perIndex) => {
                      
                      if (permiso === 'Consultar')
                        return(<Route key={perIndex} path='/dashboard/alumnos/consultar' component= {ConsultaAlumnos} />)
                      if (permiso === 'Crear')
                        // La razón de escribir el componente como función flecha anónima es debido a que de esa forma, es posible actualizar el componente completo al cambiar la ruta
                        return(<Route key={perIndex} path='/dashboard/alumnos/crear' component= {(props) => (<AltaUsuarios timestamp = {new Date().toString()} miUsuario={false} {...props}/>)} />)
                      if (permiso === 'Modificar')
                        return(<Route key={perIndex} path='/dashboard/alumnos/editar/:id' component= {(props) => (<AltaUsuarios timestamp = {new Date().toString()} miUsuario={false} {...props}/>)} />)
                      else
                        return('')
                    })}

                    {/* Para los usuarios con acceso a la modificación de credenciales  */}
                    {UserStore.Credenciales.map((permiso, perIndex) => {
                      
                      if (permiso === 'Modificar formato')
                        return(<Route key={perIndex} path='/dashboard/credenciales/modificar-formato' component= {ModificarCredencial} />)
                      else
                      return('')
                    })}
                    {/* <Route path='/dashboard/mi-cuenta' component= {MyAccount} /> */}
                    <Route path='/dashboard/mi-cuenta' component= {(props) => (<AltaUsuarios timestamp = {new Date().toString() } miUsuario={true} {...props}/>)} />
                    <Route path='/dashboard/acerca-de' component= {AcercaDe} />
                    <Route component={PaginaNoEncontrada} />
                </Switch>
              </div>
            </Router>
          );
        else
          // En caso de ser alumno
          return (
            <Router>
              <Navbar 
                profile_name={UserStore.name} 
                profile_photo={UserStore.photo} 
                profile_lastName = {`${UserStore.lastNameP} ${UserStore.lastNameM ? UserStore.lastNameM : ''}`}
                profile_role={UserStore.role}
                activateNavbar = {() => this.changeNavbar()}
              />
              <Link to='/'>
              <SubmitButton
                  styles={'right-icon top'}
                  icon={<BiIcons.BiLogOut className="logout-icon"/>}
                  text = {'Salir'}
                  disabled = {false}
                  minText= {true}
                  onclick = {() => this.doLogout()}/>
              </Link>
              <div className={this.state.navActivado ? 'contenido nav-activado' : 'contenido'}>
                <Switch>
                    <Route exact path="/auth">
                      <Redirect to='/dashboard' />
                    </Route>
                    <Route path='/dashboard' exact component= {MainComponent} />
                    {/* {UserStore.Usuarios[2] === 'Consultar' ? <Route path='/usuarios/consultar' component= {ConsultaUsuarios} /> : <Redirect to='/' />} */}
                    {UserStore.Credenciales[0] === 'Generar formato' ? <Route path='/dashboard/credenciales/generar-formato' component= {ConsultaCredencial} /> : <Redirect to='/notFound' />}
                    <Route path='/dashboard/mi-cuenta' component= {MyAccount} />
                    <Route path='/dashboard/acerca-de' component= {AcercaDe} />
                    <Route component={PaginaNoEncontrada} />
                </Switch>
              </div>
            </Router>
          );
      }
      // Si no ha iniciado sesión 
      return(
        <div className="app">
          <div className="container">
            <Router>
              <Switch>
                <Route exact path="/">
                    <Redirect to="/auth" />
                </Route>
                <Route path='/auth' component= {LoginForm} />
              </Switch>
                
            </Router>
            
          </div>
        </div>
      );

    }
  }
}

export default observer(App); //app listening for changes
