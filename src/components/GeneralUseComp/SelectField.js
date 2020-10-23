import React, { Component } from 'react'
import './InputField.css'
// Customized select field
export class SelectField extends Component {
    render() {
        return (
            <select 
            className="input mg_top" 
            value={this.props.value} 
            name={this.props.name}
            onChange={this.props.onChange}>
                {this.props.options.nombre.map((option, opIndex) => {
                    return(
                        <option 
                            key={opIndex} 
                            value={option}
                            className="option">
                            {option}
                        </option>
                    );
                })}
            </select>
        )
    }
}

export default SelectField
