import { extendObservable } from 'mobx';

export class UserStore {
    constructor() {
        extendObservable (this, {
            loading: true,
            isLoggedIn: false,
            id: '',
            username: '',
            name: '',
            lastName: '',
            role: '',
            photo: '',
            email: '',
            Usuarios:[],
            Alumnos: [],
            Credenciales: []
        })
    }
}
// Exports a new insance
export default new UserStore();
