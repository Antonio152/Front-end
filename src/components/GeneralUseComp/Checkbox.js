import React, { Component } from 'react'

export class Checkbox extends Component {
    state = {
        isChecked: true
    }

    handleCheck = () => {
        this.setState({
            isChecked: !this.state.isChecked
        })
    }

    setTrue = () => {
        this.setState({
            isChecked: true
        })
    }

    setFalse = () => {
        this.setState({
            isChecked: false
        })
    }

    componentDidMount = () => {
        if (this.props.set) this.setTrue();
        else this.setFalse();
        // this.props.set ? this.setTrue : this.setFalse;
    }

    render() {
        return (
            <div>
                <input type="checkbox" 
                value={this.state.isChecked}
                onChange={this.handleCheck} 
                checked={this.state.isChecked}
                disabled={this.props.disabled}
                onClick = {(e) => this.props.onClick(e)}
                />
            </div>
        )
    }
}

export default Checkbox
