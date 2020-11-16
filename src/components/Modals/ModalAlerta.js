import React, { Component } from 'react'
import { Modal } from 'react-responsive-modal';
import SubmitButton from '../GeneralUseComp/SubmitButton'
import * as AiIcons from 'react-icons/ai';
import * as RiIcons from 'react-icons/ri';
import * as GrIcons from 'react-icons/gr';
import "react-responsive-modal/styles.css"

export class ModalAlerta extends Component {
    
    state = {
        open: true
    }

    close = () => this.setState({ open:false });

    componentDidMount() {
        
        console.log('Hola')
    }

    render() {
        var icono = <GrIcons.GrCircleInformation/>;
        this.props.contenido.tipo === 'Advertencia' ? icono = <RiIcons.RiAlertLine/> : icono = <AiIcons.AiOutlineCloseCircle/>
        console.log('Renderizando')
        
        return (
            <div>
                <Modal open={this.state.open} onClose={() => this.closing()}>
                    <h1 className="title">
                        {icono}
                        {this.props.contenido.tipo}
                    </h1>
                    <p>{this.props.contenido.msg}</p>
                    <SubmitButton
                        text="Aceptar"
                        styles="no_margin"
                        onclick={() => this.props.contenido.accion()}
                        // onClose={window.location = `/dashboard/${this.state.alumnos ? 'alumnos' : 'usuarios'}/consultar`}
                    />
                </Modal>
            </div>
        )
    }
}

export default ModalAlerta
