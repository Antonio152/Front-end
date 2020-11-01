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

    

    render() {
        return (
            <div>
                <input type="checkbox" 
                value={this.state.isChecked}
                onChange={this.handleCheck} 
                checked={this.state.isChecked}
                onClick = {(e) => this.props.onClick(e)}
                />
            </div>
        )
    }
}

export default Checkbox
