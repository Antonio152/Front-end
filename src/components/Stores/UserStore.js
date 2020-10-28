import { extendObservable } from 'mobx';
// ALMACENA LOS DATOS DEL USUARIO LOGUEADO
export class UserStore {
    constructor() {
        extendObservable (this, {
            loading: true,
            isLoggedIn: false,
            id: '',
            username: '',
            name: '',
            lastNameP: '',
            lastNameM: '',
            role: '',
            photo: '',
            email: '',
            street: '',
            streetNo: '',
            location: '',
            city: '',
            postalCode: '',
            state: '',
            tel: '',
            telEmer: '',
            Usuarios:[],
            Alumnos: [],
            Credenciales: []
        })
    }
}
// Exports a new insance
export default new UserStore();
