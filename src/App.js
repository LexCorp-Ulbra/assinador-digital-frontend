import React, { useState } from 'react';
import forge from 'node-forge';
import { Button, Select, Input, message, Modal, Typography, List, Row, Col, Divider } from 'antd';
import './App.css';
import MenuPrincipal from './Menu';


function App() {
  const [users, setUsers] = useState([
    { name: 'Carlos', privateKey: null, publicKey: null },
    { name: 'Helyézer', privateKey: null, publicKey: null },
    { name: 'Luís', privateKey: null, publicKey: null },
    { name: 'Felipe', privateKey: null, publicKey: null }
  ]);
  const [selectedUser, setSelectedUser] = useState(users[0]);
  const [plainText, setPlainText] = useState('');
  const [documents, setDocuments] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [userKeys, setUserKeys] = useState({ publicKey: '', privateKey: '' });

  const generateRSAKeys = (userIndex) => {
    if (users[userIndex].privateKey && users[userIndex].publicKey) {
      message.info(`${users[userIndex].name} já possui chaves RSA.`);
      return;
    }
  
    const keypair = forge.pki.rsa.generateKeyPair({ bits: 2048 });
    const privateKeyPEM = forge.pki.privateKeyToPem(keypair.privateKey);
    const publicKeyPEM = forge.pki.publicKeyToPem(keypair.publicKey);
  
    const updatedUsers = [...users];
    updatedUsers[userIndex].privateKey = privateKeyPEM;
    updatedUsers[userIndex].publicKey = publicKeyPEM;
    setUsers(updatedUsers);
  
    message.success(`Chaves RSA geradas para ${updatedUsers[userIndex].name}`);
  };
  
  const signDocument = () => {
    const user = selectedUser;
    if (!user.privateKey) {
      message.error(`Gere as chaves para ${user.name} primeiro!`);
      return;
    }

    const md = forge.md.sha256.create();
    md.update(plainText, 'utf8');

    const privateKeyObj = forge.pki.privateKeyFromPem(user.privateKey);
    const signature = privateKeyObj.sign(md);

    const currentDateTime = new Date().toLocaleString();

    setDocuments([...documents, { plainText, signature, dateTime: currentDateTime, user }]);
    setPlainText('');
  };

  const saveWithoutSigning = () => {
    const user = selectedUser;
    const currentDateTime = new Date().toLocaleString();
    setDocuments([...documents, { plainText, signature: null, dateTime: currentDateTime, user }]);
    setPlainText('');
  };

  const verifySignature = (signature, originalMessage, documentUser) => {
    if (!signature) {
      message.warning('Este documento não foi assinado.');
      return;
    }

    const md = forge.md.sha256.create();
    md.update(originalMessage, 'utf8');

    const publicKeyObj = forge.pki.publicKeyFromPem(documentUser.publicKey);
    const verified = publicKeyObj.verify(md.digest().bytes(), signature);

    if (verified) {
      message.success(`Assinatura válida!\nUsuário: ${documentUser.name}`);
    } else {
      message.error('Assinatura inválida!');
    }
  };

  const showKeys = () => {
    if (!selectedUser.privateKey || !selectedUser.publicKey) {
      message.warning('O usuário ainda não gerou as chaves.');
      return;
    }

    setUserKeys({
      publicKey: selectedUser.publicKey,
      privateKey: selectedUser.privateKey,
    });
    setIsModalVisible(true);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Seja Bem Vindo Usuário</h1>
        <Divider orientation="left">ADICIONAR DOCUMENTO</Divider>

        <Row gutter={16} style={{ marginTop: '20px' }}>
          <Col>
            <Button 
              type="primary" 
              onClick={() => generateRSAKeys(users.findIndex(user => user.name === selectedUser.name))}
              className="action-button"
            >
              Gerar Chaves RSA
            </Button>
          </Col>
          <Col>
            <Button 
              onClick={showKeys}
              className="action-button"
            >
              Exibir Chaves
            </Button>
          </Col>
          <Col>
            <Button 
              type="primary" 
              onClick={signDocument}
              className="action-button"
            >
              Assinar Documento
            </Button>
          </Col>
          <Col>
            <Button 
              onClick={saveWithoutSigning}
              className="action-button"
            >
              Salvar sem Assinar
            </Button>
          </Col>
          <Col>
          
          </Col>
        </Row>
      </header>

      <Modal
        title={`Chaves de ${selectedUser.name}`}
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={[
          <Button key="close" type="primary" onClick={() => setIsModalVisible(false)}>
            Fechar
          </Button>,
        ]}
      >
        <Typography.Paragraph copyable={{ text: userKeys.publicKey }}>
          <strong>Chave Pública:</strong> <br /> {userKeys.publicKey}
        </Typography.Paragraph>
        <Typography.Paragraph copyable={{ text: userKeys.privateKey }}>
          <strong>Chave Privada:</strong> <br /> {userKeys.privateKey}
        </Typography.Paragraph>
      </Modal>
    </div>
  );
}

export default App;
