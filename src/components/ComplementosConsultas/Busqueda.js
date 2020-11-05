import React, { Component } from 'react'
import SelectField from '../GeneralUseComp/SelectField'
import SubmitButton from '../GeneralUseComp/SubmitButton'
import InputField from '../GeneralUseComp/InputField'
import '../ConsultarUsuarios/ConsultaUsuarios.css'
import * as BiIcons from 'react-icons/bi'

export class Busqueda extends Component {
    render() {
        return (
            <div className="fila justificado">
                {this.props.inputs.inputs.map((input, inputIndex) => {
                    if (input.classification === 'inputField')
                        return(
                            <InputField
                                key={inputIndex}
                                type='text'
                                placeholder={input.placeholder}
                                value={input.vaule}
                                name={input.name}
                                onChange={ (val) => input.onChange(val) }/>
                        )
                    if (input.classification === 'select')
                        return(
                            <SelectField
                                key={inputIndex}
                                options={ input.options
                                }
                                value={input.vaule}
                                name={input.name}
                                onChange={(e) => input.onChange(e)}/>
                        )
                    return ('');
                })}
                <SubmitButton
                    styles=' btn-blanco no_margin no_padding width-auto size18 input-size'
                    icon={<BiIcons.BiSearch/>}
                    onclick={() => this.props.onClick() }
                    />
            </div>
        )
    }
}

export default Busqueda
