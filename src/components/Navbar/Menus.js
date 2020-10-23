// Data for the sidebar
export const Menus = [
    {
        title: 'Usuarios',
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
                path: '/usuarios/consultar',
            }
            // {
            //     name: 'Modificar usuarios',
            //     cName: 'inside-text',
            //     path: '/',
            // },
            // {
            //     name: 'Eliminar usuarios',
            //     cName: 'inside-text',
            //     path: '/',
            // }
        ]
    },
    {
        title: 'Alumnos',
        cName: 'nav-text',
        subMenus: [
            {
                name: 'Crear alumnos',
                cName: 'inside-text',
                path: '/alumnos/crear',
            },
            {
                name: 'Consultar alumnos',
                cName: 'inside-text',
                path: '/alumnos/consultar',
            }
            // {
            //     name: 'Modificar alumnos',
            //     cName: 'inside-text',
            //     path: '/',
            // },
            // {
            //     name: 'Eliminar alumnos',
            //     cName: 'inside-text',
            //     path: '/',
            // }
        ]
    },
    {
        title: 'Credenciales',
        cName: 'nav-text',
        subMenus: [
            // {
            //     name: 'Consultar credenciales',
            //     cName: 'inside-text',
            //     path: '/',
            // },
            {
                name: 'Modificar formato',
                cName: 'inside-text',
                path: '/',
            }
        ]
    },
]