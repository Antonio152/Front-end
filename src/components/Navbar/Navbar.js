//snippet rfce
import React, { useState, useEffect, useRef } from 'react';

import * as FaIcons from 'react-icons/fa'; // This way you import all Font Awesome Icons
import * as AiIcons from 'react-icons/ai';
import { Link } from 'react-router-dom';
import { Menus } from './Menus'
import './Navbar.css'
import { IconContext } from 'react-icons'

import Accordion from '../Accordion/Accordion'

import userImg from './img/profesor.png'


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
    }, [when]);
}

// Navbar and sidebar fuction
function Navbar(props) {
    
    // Appear and disappear sidebar and menu behavior
    const [sidebar, setSidebar] = useState(false)
    const [menuBars, setMenuBars] = useState(false)
    const [confMenu, setConfMenu] = useState(false)
    const showSideBar = () => {
        setSidebar(!sidebar)
        setMenuBars(!menuBars)
        setConfMenu(false)
    }
    const showConfMenu = () => setConfMenu(!confMenu)
    const hideConfMenu = () => setConfMenu(false)

    // Travels inside the menus as submenus an concatenate them into a string
    const subMenuToString = (array) => {
        var nameSubMenus = '';
        array.map((subMenu, smIndex) => { nameSubMenus += `${subMenu.name}, ` })
        return nameSubMenus;
    }

    const confMenuRef = useRef();

    // Close conf menu by clicking outside
    // (ref: the element, calback: affected dom element, when: boolean when happen?)
    useOutsideClick(confMenuRef, hideConfMenu, confMenu)

    return (
        <div>
            {/* Principal sidebar */}
            <IconContext.Provider value={{color:'768597'}}>
                <div className="navbar">
                    <Link to="#" className={menuBars ? 'menu-bars active': 'menu-bars'}>
                        <FaIcons.FaBars onClick={ showSideBar }/>
                    </Link>
                </div>
                {/* Define if is active or not */}
                <nav className={sidebar ? 'nav-menu active': 'nav-menu'}>
                    <ul className="nav-menu-items" >
                        <li className="navbar-toggle" onClick={ showSideBar }>
                            <Link to="#" className="menu-bars">
                                {/* <AiIcons.AiOutlineClose /> */}
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
                        { Menus.map((menu, index) => {
                            return (
                                <Accordion
                                key={index}
                                title={ menu.title }
                                icon={ menu.icon }
                                subMenus={ subMenuToString(menu.subMenus) }
                                content={
                                    menu.subMenus.map((subMenu, smIndex) => {
                                        return(
                                            <li key={ smIndex } className={ subMenu.cName }>
                                                <Link className="link" to={ subMenu.path }>
                                                    <AiIcons.AiOutlineCaretRight/>
                                                    <span>{ subMenu.name }</span>
                                                </Link>
                                            </li>
                                        )
                                    })
                                }
                                >
                                </Accordion>
                            )
                        })}
                    </ul>
                    <div className="profile-info-section">
                        <div className="profile-img">
                            <img className="userLogo" src={userImg}></img>
                        </div>
                        <div className="profile-desc">
                            <div className="profile-role">
                                {props.profile_role}
                            </div>
                            <div className="profile-name">
                                {props.profile_name}
                            </div>
                        </div>
                    </div>
                </nav>
                
            </IconContext.Provider>
            {/* Menu that appears when config button is clicked */}
            <div ref={confMenuRef} className={confMenu ? 'conf-menu active': 'conf-menu'}>
                <Link className="link-config" to='/'>
                    <AiIcons.AiOutlineCaretRight/>
                    <span>Gestionar mi cuenta</span>
                </Link>
                <Link className="link-config" to='/'>
                    <AiIcons.AiOutlineCaretRight/>
                    <span>Acerca de</span>
                </Link>
            </div>
        </div>
    )
}

export default Navbar
