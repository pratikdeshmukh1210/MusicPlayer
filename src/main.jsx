import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import MusicRouter from './router/MusicRouter.jsx'
import { Provider } from 'react-redux'
import {store } from './stores/store.jsx'

createRoot(document.getElementById('root')).render(
  <Provider  store={store}>
    <MusicRouter/> 
  </Provider>
  
)
