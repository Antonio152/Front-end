import React, { Component } from 'react'
import * as AiIcons from 'react-icons/ai';

import './InputFile.css'

export class InputFile extends Component {
    render() {
        return (
            <div>
                <input 
                type="file" 
                name="file" 
                id="file" 
                className={`inputfile ${this.props.styles}`} 
                onChange = {() => this.props.onChange()}
                />
                <label htmlFor="file"><AiIcons.AiOutlineCloudUpload/> Subir</label>
            </div>
        )
    }
}

export default InputFile
