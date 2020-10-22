import React, { Component } from 'react'
import './Loader.css'

export class Loader extends Component {
    render() {
        return (
            <div className="lds-ring"><div></div><div></div><div></div><div></div></div>
        )
    }
}

export default Loader
// Obtenido de: https://loading.io/css/