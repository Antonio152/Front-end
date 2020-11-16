import React, { Component } from 'react'
import './InputField.css'
// Customized select field
export class SelectField extends Component {
    render() {
        var valor = this.props.value;
        if (typeof this.props.value === 'boolean')
            valor = this.props.value ? 'Activo' : 'Inactivo'
        return (
            <select 
            className={`input mg_top ${this.props.styles}`}
            value={valor} 
            name={this.props.name}
            onChange={this.props.onChange}>
                {this.props.options.nombre.map((option, opIndex) => {
                    if (typeof option === 'boolean')
                        option = option ? 'Activo' : 'Inactivo'
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
