import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css';
import App from './App';
import Login from './login';
import reportWebVitals from './reportWebVitals';
import Register from './Register';
import DocumentosUsuario from './Documentos_Usuario';
import Documentos from './Documentos';
import DocumentoDetalhes from './DocumentoDetalhes';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Router>
    <Routes>
        <Route path="/" element={<Login />} />  
        <Route path="/app" element={<App />} /> 
        <Route path="/registro" element={<Register />} />
        <Route path="/documento/:id" element={<DocumentoDetalhes />} />
        <Route path="/documentos" element={<Documentos />} />
        <Route path="/documentoUsuario" element={<DocumentosUsuario />} />
      </Routes>
    </Router>
  </React.StrictMode>
);

reportWebVitals();
