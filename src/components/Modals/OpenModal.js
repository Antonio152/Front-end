import React, { Component } from 'react'
import { Modal } from 'react-responsive-modal';
import SubmitButton from '../GeneralUseComp/SubmitButton'
import * as BiIcons from 'react-icons/bi';
import "react-responsive-modal/styles.css"

export class OpenModal extends Component {

    state = {
        open: true
    }

    closing = () => {
        this.props.onClose();
        this.setState({ open:false });
    }

    render() {
        return (
            <div>
                <Modal open={this.state.open} onClose={() => this.closing()}>
                    {this.props.contenido}
                </Modal>
            </div>
        )
    }
}

export default OpenModal
