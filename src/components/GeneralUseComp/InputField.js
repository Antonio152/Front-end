import React, { Component } from 'react'
import './InputField.css'

export class InputField extends Component {
    render() {
        return (
            <div className="inputField">
                <input
                    className="input"
                    type={ this.props.type }
                    placeholder={ this.props.placeholder }
                    value= {this.props.value}
                    name={this.props.name}
                    onChange={ (e) => this.props.onChange(e.target.value) }
                    // onChange={ this.props.onChange }
                ></input>
            </div>
        )
    }
}

export default InputField
