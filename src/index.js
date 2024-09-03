import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css';
import App from './App';
import Login from './login';
import reportWebVitals from './reportWebVitals';
import Register from './Register';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />  
        <Route path="/app" element={<App />} /> 
        <Route path='/registro' element={<Register/>}></Route>
      </Routes>
    </Router>
  </React.StrictMode>
);

reportWebVitals();
