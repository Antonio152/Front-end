import React from 'react'
import * as FaIcons from 'react-icons/fa'; // This way you import all Font Awesome Icons
import * as IoIcons from 'react-icons/io';

// Data for the sidebar
export const Menus = [
    {
        title: 'Usuarios',
        icon: <FaIcons.FaUsersCog size={24}/>,
        iconWidth: '24px',
        cName: 'nav-text',
        subMenus: [
            {
                name: 'Crear usuarios',
                cName: 'inside-text',
                path: '/',
            },
            {
                name: 'Consultar usuarios',
                cName: 'inside-text',
                path: '/usuarios/consulta',
            },
            {
                name: 'Modificar usuarios',
                cName: 'inside-text',
                path: '/',
            },
            {
                name: 'Eliminar usuarios',
                cName: 'inside-text',
                path: '/',
            }
        ]
    },
    {
        title: 'Alumnos',
        path: '/',
        icon: <IoIcons.IoMdSchool size={24}/>,
        cName: 'nav-text',
        subMenus: [
            {
                name: 'Crear alumnos',
                cName: 'inside-text',
                path: '/',
            },
            {
                name: 'Consultar alumnos',
                cName: 'inside-text',
                path: '/alumnos/consulta',
            },
            {
                name: 'Modificar alumnos',
                cName: 'inside-text',
                path: '/',
            },
            {
                name: 'Eliminar alumnos',
                cName: 'inside-text',
                path: '/',
            }
        ]
    },
    {
        title: 'Credenciales',
        path: '/',
        icon: <FaIcons.FaRegCreditCard size={24}/>,
        cName: 'nav-text',
        subMenus: [
            {
                name: 'Consultar credenciales',
                cName: 'inside-text',
                path: '/',
            },
            {
                name: 'Modificar formato',
                cName: 'inside-text',
                path: '/',
            }
        ]
    },
]