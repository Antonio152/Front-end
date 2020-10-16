import { extendObservable } from 'mobx';

export class UserStore {
    constructor() {
        extendObservable (this, {
            loading: true,
            isLoggedIn: false,
            username: '',
            name: '',
            lastName: '',
            role: '',
            photo: '',
            modules: [{ type: String }]
        })
    }
}
// Exports a new insance
export default new UserStore();
