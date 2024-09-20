import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./index.css";
import Login from "./Pages/login";
import reportWebVitals from "./reportWebVitals";
import Register from "./Pages/Register";
import DocumentosUsuario from "./DocumentosUsuario";
import Documentos from "./Pages/Documentos";
import DocumentoDetalhes from "./DocumentoDetalhes";
import NovoDocumento from "./Pages/NovoDocumento";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/registro" element={<Register />} />
        <Route path="/documento/:id" element={<DocumentoDetalhes />} />
        <Route path="/documentos" element={<Documentos />} />
        <Route path="/documentoUsuario" element={<DocumentosUsuario />} />
        <Route path="/novoDocumento" element={<NovoDocumento />} />
      </Routes>
    </Router>
  </React.StrictMode>
);

reportWebVitals();
