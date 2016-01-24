import React from 'react'
import ReactDOM from 'react-dom'
import App from './app.jsx'


// Base container
const stage = document.createElement('div')
stage.className = 'stage'
document.body.appendChild(stage)

// Render
ReactDOM.render(<App />, stage)
