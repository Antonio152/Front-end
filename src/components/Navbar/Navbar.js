//snippet rfce
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios'

import * as FaIcons from 'react-icons/fa'; // This way you import all Font Awesome Icons
import * as AiIcons from 'react-icons/ai';
import * as BiIcons from 'react-icons/bi';
import { Link } from 'react-router-dom';
import './Navbar.css'
import { IconContext } from 'react-icons'

import Logo from './img/logo-linea.jpg'

import Accordion from '../Accordion/Accordion'
import UserStore from '../Stores/UserStore'

import Loader from '../GeneralUseComp/Loader'

//This function makes that when you click outside some component, it dissapears
function useOutsideClick(ref, callback, when) {
    const savedCallback = useRef(callback);
    useEffect(() => {
        savedCallback.current = callback
    });
    function handler(event) {
        if (ref.current && !ref.current.contains(event.target)) {
            savedCallback.current();
        }
    }
    useEffect(() => { // after each render
        if (when) {
            document.addEventListener("click",handler)
            return () => document.removeEventListener("click", handler)
        }
    });
}

// Navbar and sidebar fuction
function Navbar(props) {
    // var modules = [];
    const [modules, setModules] = useState([]);

    // Appear and disappear sidebar and menu behavior
    const [sidebar, setSidebar] = useState(window.innerWidth > 1365 ? true: false)
    const [menuBars, setMenuBars] = useState(window.innerWidth > 1365 ? true: false)
    const [confMenu, setConfMenu] = useState(false)
    // Toggles the state of the navbar
    const showSideBar = () => {
        setSidebar(!sidebar);
        setMenuBars(!menuBars);
        setConfMenu(false);
        props.activateNavbar()
    }
    const showConfMenu = () => setConfMenu(!confMenu)
    const hideConfMenu = () => setConfMenu(false)


    const confMenuRef = useRef(); // Uses the function for outside click

    // Close conf menu by clicking outside
    // (ref: the element, calback: affected dom element, when: boolean when happen?)
    useOutsideClick(confMenuRef, hideConfMenu, confMenu)
    // Similiar to ComponentDidMount 
    useEffect(() => {
        async function getUser() {
            const uri = `http://localhost:4000/api/users/${UserStore.id}`;
            const res = await axios.get(uri);
            if (res.data.rol[0].modulos)
                setModules({modules: res.data.rol[0].modulos});
        }
        getUser();
    }, []); // Is executed once

    return (
        <div>
            {/* Principal sidebar */}
            <IconContext.Provider value={{color:'768597'}}>
                <div className="navbar">
                    <Link to="#" className={menuBars ? 'menu-bars active': 'menu-bars'}>
                        <BiIcons.BiChevronsRight className={menuBars ? 'activate-button active': 'activate-button'} onClick={ showSideBar }/>
                    </Link>
                </div>
                {/* Define if is active or not */}
                <nav className={sidebar ? 'nav-menu active': 'nav-menu'}>
                    <ul className="nav-menu-items" >
                        <li className="navbar-toggle" >
                            <Link to="/dashboard" className="menu-bars main-title" >
                                <div className="fila">
                                    <img src={Logo} alt="" style={{maxWidth:'40px', paddingTop:'5px'}}/>
                                    <p style={{padding:'10px 0px 0px 10px', fontSize:'28px'}}> Mandatum</p>
                                </div>
                            </Link>
                         </li>
                         {/* Configuration button */}
                         <li className="navbar-toggle mini">
                            <span className="desc-text">Información general</span>
                            <button className="right-icon" onClick={showConfMenu}>
                                <FaIcons.FaUserCog />
                            </button>
                         </li>
                        
                        {/* Map all the menus into the Menus JSarray file */}
                        {/* Map every submenu inside the menus array too */}
                        {modules.modules !== undefined ? 
                        modules.modules.map((menu, index) => {
                            var concPermisos = '';
                            menu.permisos.forEach((permiso, perIndex) => {
                                concPermisos += `${perIndex === 0 ? '': ', '} ${permiso} ${menu.nombre.toLowerCase().replace('credenciales','')}`
                            });
                            return(
                                <Accordion
                                key={index}
                                title={ menu.nombre }
                                subMenus={concPermisos}
                                content={
                                    menu.permisos
                                    .filter(subMenu => subMenu !== 'Eliminar')
                                    .filter(subMenu => subMenu !== 'Modificar')
                                    .map((subMenu, smIndex) => {
                                        return(
                                            <li key={ smIndex } className='inside-text'>
                                                <Link className="link" to={ `/dashboard/${menu.nombre.toLowerCase()}/${subMenu.toLowerCase().replace(' ','-')}` }>
                                                    <AiIcons.AiOutlineCaretRight/>
                                                    <span>{ `${subMenu} ${menu.nombre.toLowerCase()!=='credenciales' ? menu.nombre.toLowerCase() : ''}` }</span>
                                                </Link>
                                            </li>
                                        )
                                    })
                                }
                                >
                                </Accordion>
                            )
                        })
                        : 
                            <div>
                                <Loader/>
                            </div>
                        }
                        
                    </ul>
                    <div className="profile-info-section">
                        <div className="profile-img" id="profile_img">
                            <img className="userLogo" alt="" src={`data:image/jpg;base64,${props.profile_photo}`}></img>
                            {/* <Example data={photo} /> */}
                        </div>
                        <div className="profile-desc">
                            <div className="profile-role">
                                {props.profile_role}
                            </div>
                            <div className="profile-name">
                                {props.profile_name}
                            </div>
                            <div className="profile-name">
                                {props.profile_lastName}
                            </div>
                        </div>
                    </div>
                </nav>
                
            </IconContext.Provider>
            {/* Menu that appears when config button is clicked */}
            <div ref={confMenuRef} className={confMenu ? 'conf-menu active': 'conf-menu'}>
                <Link className="link-config" to='/dashboard/mi-cuenta' onClick={() => hideConfMenu()}>
                    <AiIcons.AiOutlineCaretRight/>
                    <span>Gestionar mi cuenta</span>
                </Link>
                <Link className="link-config" to='/dashboard/acerca-de' onClick={() => hideConfMenu()}>
                    <AiIcons.AiOutlineCaretRight/>
                    <span>Acerca de</span>
                </Link>
            </div>
        </div>
    )
}


export default Navbar

