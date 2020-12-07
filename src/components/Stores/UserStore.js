import { extendObservable, action } from 'mobx';
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
            curp: '',
            rh: '',
            numSS: '',
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
            career: '',
            idStudent: '',
            aca_estatus: true,
            grade: '',
            Usuarios:[],
            Alumnos: [],
            Profesores: [],
            Credenciales: []
        })
    }
    // En caso de que haya accedido con éxito
    setMiUsuario = action((result) => {
        if (result && result.success) {
            this.loading = false;
            this.isLoggedIn = true;
            this.name = result.nombre;
            this.lastNameP = result.aPaterno;
            this.lastNameM = result.aMaterno ? result.aMaterno : '';
            this.rh = result.rh;
            this.photo = result.foto;
            this.email = result.contacto[0].email;
            this.tel = result.contacto[0].telefono;
            this.telEmer = result.contacto[0].telEmergencia;
            this.street = result.direccion[0].calle;
            this.streetNo = result.direccion[0].numero;
            this.location = result.direccion[0].localidad;
            this.city = result.direccion[0].ciudad;
            this.postalCode = result.direccion[0].cp;
            this.state = result.direccion[0].estado;
            return true;
        }
        return false
    })
    // En caso de que haya accedido con éxito
    setData = action((result) => {
        console.log(result);
        if (result && result.success) {
            this.loading = false;
            this.isLoggedIn = true;
            this.username = result.username;
            this.id = result._id;
            this.name = result.nombre;
            this.lastNameP = result.apellidoPaterno;
            this.lastNameM = result.apellidoMaterno ? result.apellidoMaterno : '';
            this.curp = result.curp;
            this.rh = result.seguroSocial[0].gpoSanguineo;
            this.numSS = result.seguroSocial[0].numSos;
            this.role = result.role;
            this.photo = result.foto;
            this.email = result.contacto[0].email;
            this.tel = result.contacto[0].telefono;
            this.telEmer = result.contacto[0].telEmergencia;
            this.street = result.direccion[0].calle;
            this.streetNo = result.direccion[0].numero;
            this.location = result.direccion[0].localidad;
            this.city = result.direccion[0].ciudad;
            this.postalCode = result.direccion[0].cp;
            this.state = result.direccion[0].estado;
            //Asignación de permisos
            if(this.role !== 'Alumno' && this.role !== 'Profesor'){
                if(result.modulos[0].permisos)
                    this.Usuarios = result.modulos[0].permisos;
                if(result.modulos[1].permisos)
                    this.Alumnos = result.modulos[1].permisos;
                if(result.modulos[2].permisos)
                    this.Profesores = result.modulos[2].permisos;
                if(result.modulos[3].permisos)
                    this.Credenciales = result.modulos[3].permisos;
            }
            else {
                this.career = result.datosAcademicos[0].carrera;
                this.idStudent = result.datosAcademicos[0].matricula;
                this.grade = result.datosAcademicos[0].cuatrimestre;
                this.aca_estatus = result.datosAcademicos[0].estatus;
                // Sólo tiene permiso de generar su credencial
                if(result.modulos[3].permisos)
                this.Credenciales = result.modulos[3].permisos;
            }
            return true;
        }
        else if (result && result.success === false) {
            this.loading = false;
            this.isLoggedIn = false;
            return false;
        }
    })
    // En caso de haber existido un error en el logueo
    gotError = action(() => {
        this.loading = false;
        this.isLoggedIn = false;
    })
    // Para resetear los datos al estado inicial
    reset = action(() => {
        this.loading= false;
        this.isLoggedIn= false;
        this.id= '';
        this.username= '';
        this.name= '';
        this.lastNameP= '';
        this.lastNameM= '';
        this.curp= '';
        this.rh= '';
        this.numSS= '';
        this.role= '';
        this.photo= '';
        this.email= '';
        this.street= '';
        this.streetNo= '';
        this.location= '';
        this.city= '';
        this.postalCode= '';
        this.state= '';
        this.tel= '';
        this.telEmer= '';
        this.career= '';
        this.idStudent= '';
        this.registro='';
        this.aca_estatus= true;
        this.grade= '';
        this.Usuarios=[];
        this.Alumnos= [];
        this.Profesores= [];
        this.Credenciales= [];
    })
    // Cuando esté cargando la sesión 
    isLoading = () => {
        return this.loading && !this.isLoggedIn;
    }
    // Para cuando se esté logueado en el sistema
    loggedIntoSystem = () => {
        return this.isLoggedIn && this.id && (this.Alumnos[0] || this.Credenciales[0] || this.Usuarios[0] || this.Profesores[0]);
    }
}
// Exports a new insance
export default new UserStore();
