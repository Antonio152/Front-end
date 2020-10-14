import { extendObservable } from 'mobx';

export class UserStore {
    constructor() {
        extendObservable (this, {
            loading: true,
            isLoggedIn: false,
            username: '',
            name: '',
            role: '',
            modules: []
        })
    }
}
// Exports a new insance
export default new UserStore();
