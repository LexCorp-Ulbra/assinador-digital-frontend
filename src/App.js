import React, { useState } from 'react';
import forge from 'node-forge';
import './App.css';

function App() {
  // Estados para armazenar o texto plano, documentos, chave privada e chave pública
  const [plainText, setPlainText] = useState('');
  const [documents, setDocuments] = useState([]);
  const [privateKey, setPrivateKey] = useState(null);
  const [publicKey, setPublicKey] = useState(null);

  // Função para gerar chaves RSA de 2048 bits e armazená-las nos estados
  const generateRSAKeys = () => {
    const keypair = forge.pki.rsa.generateKeyPair({ bits: 2048 }); // Geração do par de chaves
    const privateKeyPEM = forge.pki.privateKeyToPem(keypair.privateKey); // Converter chave privada para PEM
    const publicKeyPEM = forge.pki.publicKeyToPem(keypair.publicKey);   // Converter chave pública para PEM
    
    setPrivateKey(privateKeyPEM); // Armazenar a chave privada no estado
    setPublicKey(publicKeyPEM);   // Armazenar a chave pública no estado
    
    // Exibir as chaves no console (opcional)
    console.log("Chave Privada RSA 2048:");
    console.log(privateKeyPEM);
    console.log("\nChave Pública RSA 2048:");
    console.log(publicKeyPEM);
  };

  // Função para assinar o documento utilizando a chave privada
  const signDocument = () => {
    if (!privateKey) { // Verifica se a chave privada foi gerada
      alert('Gere as chaves primeiro!');
      return;
    }

    // Criação do hash SHA-256 do texto plano
    const md = forge.md.sha256.create();
    md.update(plainText, 'utf8');

    // Assinatura do hash com a chave privada
    const privateKeyObj = forge.pki.privateKeyFromPem(privateKey);
    const signature = privateKeyObj.sign(md);

    // Adicionar o documento assinado à lista de documentos
    setDocuments([...documents, { plainText, signature }]);
    setPlainText(''); // Limpar o campo de texto após a assinatura
  };

  // Função para salvar o documento sem assiná-lo
  const saveWithoutSigning = () => {
    // Adicionar o documento sem assinatura à lista de documentos
    setDocuments([...documents, { plainText, signature: null }]);
    setPlainText(''); // Limpar o campo de texto após salvar
  };

  // Função para verificar a assinatura de um documento
  const verifySignature = (signature, originalMessage) => {
    if (!signature) { // Verifica se o documento foi assinado
      alert('Este documento não foi assinado.');
      return;
    }

    if (!publicKey) { // Verifica se a chave pública foi gerada
      alert('Gere as chaves primeiro!');
      return;
    }

    // Criação do hash SHA-256 do texto original
    const md = forge.md.sha256.create();
    md.update(originalMessage, 'utf8');

    // Verificação da assinatura usando a chave pública
    const publicKeyObj = forge.pki.publicKeyFromPem(publicKey);
    const verified = publicKeyObj.verify(md.digest().bytes(), signature);

    // Exibir mensagem de resultado da verificação
    if (verified) {
      alert('Assinatura válida!');
    } else {
      alert('Assinatura inválida!');
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Assinador Digital com RSA</h1>
        
        {/* Botão para gerar as chaves RSA */}
        <button onClick={generateRSAKeys}>Gerar Chaves RSA</button>
        
        {/* Campo de texto para o usuário digitar o documento */}
        <textarea
          value={plainText}
          onChange={(e) => setPlainText(e.target.value)}
          rows="4"
          cols="50"
          placeholder="Digite seu texto aqui"
        />
        <br />
        {/* Botão para assinar o documento */}
        <button onClick={signDocument}>Assinar Documento</button>
        
        {/* Botão para salvar o documento sem assinar */}
        <button onClick={saveWithoutSigning}>Salvar sem Assinar</button>

        <h2>Documentos</h2>
        {/* Lista de documentos assinados ou salvos */}
        <ul>
          {documents.map((doc, index) => (
            <li key={index}>
              {doc.plainText}
              {/* Botão para verificar a assinatura do documento */}
              <button onClick={() => verifySignature(doc.signature, doc.plainText)}>Verificar Assinatura</button>
            </li>
          ))}
        </ul>
      </header>
    </div>
  );
}

export default App;