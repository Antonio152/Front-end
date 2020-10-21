// Esto es un comentario de prueba

import React, {Component} from 'react';
import { observer } from 'mobx-react'
import './App.css';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
// import 'bootstrap/dist/css/bootstrap.min.css';
import * as BiIcons from 'react-icons/bi';

// Componentes
import UserStore from './components/Stores/UserStore';
import LoginForm from './components/LoginForm/LoginForm'
import SubmitButton from './components/GeneralUseComp/SubmitButton'
import Navbar from './components/Navbar/Navbar'

// Módulos
import ConsultaUsuarios from './components/ConsultarUsuarios/ConsultaUsuarios'
import ConsultaAlumnos from './components/ConsultarAlumnos/ConsultaAlumnos'
import ConsultaCredencial from './components/ConsultaCredencial/ConsultaCredencial'
import MainComponent from './components/Main/MainComponent';



class App extends Component {

  state = {
    navActivado: true
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

      console.log(result);

      if (result && result.success) {
        UserStore.isLoggedIn = false;
        UserStore.username = '';
      }
    } catch (error) {
      console.log(error);
    }
  }

  changeNavbar() {
    this.setState({navActivado: !this.state.navActivado})
    console.log(this.state.navActivado)
  }
  
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

      console.log(result);
      
      
      // If it's logged in
      if (result && result.success) {
        var apellidos = `${result.apellidoPaterno} ${result.apellidoMaterno ? result.apellidoMaterno : ''}`;
        UserStore.loading = false;
        UserStore.isLoggedIn = true;
        UserStore.username = result.username;
        UserStore.name = result.nombre;
        UserStore.lastName = apellidos;
        UserStore.role = result.role;
        UserStore.photo = result.foto;
        UserStore.email = result.contacto[0].email;
        result.modulos.forEach(module => {
          UserStore.modules.push(module)
        });
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
    if (UserStore.loading) {
      return (
        <div className="app">
          <div className="container">
            <span>Loading, please wait...</span>
          </div>
        </div>
      );
    }
    else {
      if(UserStore.isLoggedIn){
        if (UserStore.role !== 'Alumno')
          return (
            <Router>
              <Navbar 
                profile_name={UserStore.name} 
                profile_photo={UserStore.photo} 
                profile_lastName = {UserStore.lastName}
                profile_role={UserStore.role}
                activateNavbar = {() => this.changeNavbar()}
              />
              <SubmitButton
                  styles={'right-icon top'}
                  icon={<BiIcons.BiLogOut className="logout-icon"/>}
                  text = {'Logout'}
                  disabled = {false}
                  onclick = {() => this.doLogout()}
              />
              <div className={this.state.navActivado ? 'contenido nav-activado' : 'contenido'}>
                <MainComponent
                  profile_name={UserStore.name} 
                  profile_lastName = {UserStore.lastName}
                  profile_photo={UserStore.photo} 
                  profile_role={UserStore.role}
                  profile_email={UserStore.email}
                  />
                <Switch>
                    <Route path='/usuarios/consulta' component= {ConsultaUsuarios} />
                    <Route path='/alumnos/consulta' component= {ConsultaAlumnos} />
                </Switch>
              </div>
            </Router>
          );
        else
          return (
            <Router>
              <Navbar 
                profile_name={UserStore.name} 
                profile_photo={UserStore.photo} 
                profile_lastName = {UserStore.lastName}
                profile_role={UserStore.role}
                activateNavbar = {() => this.changeNavbar()}
              />
              <SubmitButton
                  styles={'right-icon top'}
                  icon={<BiIcons.BiLogOut className="logout-icon"/>}
                  text = {'Logout'}
                  disabled = {false}
                  onclick = {() => this.doLogout()}
              />
              <div className={this.state.navActivado ? 'contenido nav-activado' : 'contenido'}>
                <Switch>
                    <Route path='/:userId' component= {ConsultaCredencial} />
                </Switch>
              </div>
            </Router>
          );
      }
      return(
        <div className="app">
          <div className="container">
            <LoginForm/>
          </div>
        </div>
      );

    }
  }
}

export default observer(App); //app listening for changes
