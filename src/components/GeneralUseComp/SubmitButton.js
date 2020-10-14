import React, { Component } from 'react'
import './SubmitButton.css'

export class SubmitButton extends Component {
    render() {
        return (
            <div className="submitButton">
                <button
                    className={`btn ${this.props.styles}`}
                    disabled={this.props.disabled}
                    onClick={ () => this.props.onclick() }
                >
                    {this.props.icon}
                    <span className="text-btn">{this.props.text}</span>
                </button>
            </div>
        )
    }
}

export default SubmitButton;
