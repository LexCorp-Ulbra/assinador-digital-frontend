import React, { useState } from 'react';
import forge from 'node-forge';
import './App.css';

const styles = {
  App: {
    margin:'auto',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#000',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    maxWidth: '600px',
    width: '100%',
  },

  AppHeader: {
    textAlign: 'center',
  },

  h1: {
    
    fontSize: '40px',
    marginBottom: '20px',
    color:'#fff'
  },

  textarea: {
    width: '100%',
    padding: '10px',
    marginTop: '10px',
    marginBottom: '20px',
    borderRadius: '4px',
    border: '1px solid #cccccc',
    fontSize: '16px',
  },

  button: {
    backgroundColor: '#007bff',
    color: 'white',
    padding: '10px 15px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px',
    marginRight: '10px',
    transition: 'background-color 0.3s ease',
  },

  h2: {
    color: '#fff',
    fontSize: '20px',
    marginTop: '30px',
    marginBottom: '10px',
  },

  ul: {
    listStyleType: 'none',
    padding: 0,
  },

  li: {
    backgroundColor: '#f9f9f9',
    padding: '10px',
    marginBottom: '10px',
    borderRadius: '4px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  liButton: {
    backgroundColor: '#28a745',
    marginRight: 0,
    borderRadius:'8px'
  },
};

function App() {
  const [plainText, setPlainText] = useState('');
  const [documents, setDocuments] = useState([]);
  const [privateKey, setPrivateKey] = useState(null);
  const [publicKey, setPublicKey] = useState(null);
  const [signature, setSignature] = useState(null);
  const [hasGeneratedKeys, setHasGeneratedKeys] = useState(false);

  const generateRSAKeys = () => {
    const keypair = forge.pki.rsa.generateKeyPair({ bits: 2048 });
    const privateKeyPEM = forge.pki.privateKeyToPem(keypair.privateKey);
    const publicKeyPEM = forge.pki.publicKeyToPem(keypair.publicKey);

    setPrivateKey(privateKeyPEM);
    setPublicKey(publicKeyPEM);
    setHasGeneratedKeys(true);

    console.log("Chave Privada RSA 2048:");
    console.log(privateKeyPEM);
    console.log("\nChave Pública RSA 2048:");
    console.log(publicKeyPEM);
  };

  const signDocument = () => {
    if (!privateKey) {
      alert('Gere as chaves primeiro!');
      return;
    }

    const md = forge.md.sha256.create();
    md.update(plainText, 'utf8');

    const privateKeyObj = forge.pki.privateKeyFromPem(privateKey);
    const signature = privateKeyObj.sign(md);

    setSignature(signature); // Armazena a assinatura no estado
    alert('Documento assinado!');
  };

  const saveDocument = () => {
    if (!signature) {
      alert('O documento precisa ser assinado antes de ser salvo.');
      return;
    }

    setDocuments([...documents, { plainText, signature }]);
    setPlainText('');
    setSignature(null); // Reseta a assinatura após salvar
  };

  const verifySignature = (signature, originalMessage) => {
    if (!signature) {
      alert('Este documento não foi assinado.');
      return;
    }

    if (!publicKey) {
      alert('Gere as chaves primeiro!');
      return;
    }

    const md = forge.md.sha256.create();
    md.update(originalMessage, 'utf8');

    const publicKeyObj = forge.pki.publicKeyFromPem(publicKey);
    const verified = publicKeyObj.verify(md.digest().bytes(), signature);

    if (verified) {
      alert('Assinatura válida!');
    } else {
      alert('Assinatura inválida!');
    }
  };

  return (
    <div style={styles.App}>
      <header style={styles.AppHeader}>
        <h1 style={styles.h1}>Assinador Digital com RSA</h1>
        
        {/* Botão para gerar as chaves RSA */}
        <button style={styles.button} onClick={generateRSAKeys}>Gerar Chaves RSA</button>
        
        {/* Campo de texto para o usuário digitar o documento */}
        <textarea
          style={styles.textarea}
          value={plainText}
          onChange={(e) => setPlainText(e.target.value)}
          rows="4"
          cols="50"
          placeholder="Digite seu texto aqui"
        />
        <br />

        {/* Botões só aparecem se as chaves foram geradas */}
        {hasGeneratedKeys && (
          <>
            <button style={styles.button} onClick={signDocument}>Assinar Documento</button>
            <button style={styles.button} onClick={saveDocument}>Salvar</button>
          </>
        )}

        <h2 style={styles.h2}>Documentos</h2>
        
        <ul style={styles.ul}>
          {documents.map((doc, index) => (
            <li key={index} style={styles.li}>
              {doc.plainText}
              <button style={styles.liButton} onClick={() => verifySignature(doc.signature, doc.plainText)}>Verificar Assinatura</button>
            </li>
          ))}
        </ul>
      </header>
    </div>
  );
}

export default App;


