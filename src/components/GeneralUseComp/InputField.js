import React, { Component } from 'react'
import './InputField.css'

// Customized input field
export class InputField extends Component {
    render() {
        return (
            <div className="inputField">
                <input
                    className={`input ${this.props.noBorder ? 'no-border': ''}`}
                    style={this.props.style}
                    type={ this.props.type }
                    placeholder={ this.props.placeholder }
                    value= {this.props.value}
                    name={this.props.name}
                    onChange={ (e) => this.props.onChange(e.target.value) }
                ></input>
            </div>
        )
    }
}

export default InputField
