import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Website from './Website'
import './index.css'
import IncomeTax from './pages/IncomeTax'
import GST from './pages/GST'
import Corporate from './pages/Corporate'
import Admin from './pages/Admin'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Website />} />
        <Route path='/incometax' element={<IncomeTax />} />
        <Route path='/gst' element={<GST />} />
        <Route path='/corporate' element={<Corporate />} />
        <Route path='/admin' element={<Admin />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)
