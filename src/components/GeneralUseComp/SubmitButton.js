import React, { Component } from 'react'
import './SubmitButton.css'
// Customized submit button
export class SubmitButton extends Component {
    render() {
        return (
            <div className="submitButton">
                <button
                    className={`btn ${this.props.styles} ${this.props.disabled ? 'disabled' : ''}`}
                    disabled={this.props.disabled}
                    onClick={ () => this.props.onclick() }
                >
                    {this.props.icon}
                    <span className={`text-btn `}>{this.props.minText && window.innerWidth < 885 ? '' : this.props.text}</span>
                </button>
            </div>
        )
    }
}

export default SubmitButton;
