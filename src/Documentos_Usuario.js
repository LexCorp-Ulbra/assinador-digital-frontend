import React, { useState } from 'react';
import { Button, Modal, Input, Divider, List, notification, message } from 'antd';
import forge from 'node-forge';
import MenuPrincipal from './Menu';

const { TextArea } = Input;

const initialData = [
  { id: 1, text: 'Documento 1', dateTime: 'Data/Hora', user: 'Usuario' },
  { id: 2, text: 'Documento 2', dateTime: 'Data/Hora', user: 'Usuario' },
  { id: 3, text: 'Documento 3', dateTime: 'Data/Hora', user: 'Usuario' },
  { id: 4, text: 'Documento 4', dateTime: 'Data/Hora', user: 'Usuario' },
  { id: 5, text: 'Documento 5', dateTime: 'Data/Hora', user: 'Usuario' },
];

const DocumentosUsuario = () => {
  const [plainText, setPlainText] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isKeyModalOpen, setIsKeyModalOpen] = useState(false); // Estado para o modal de chaves
  const [documents, setDocuments] = useState(initialData);
  const [editingDoc, setEditingDoc] = useState(null);
  const [users, setUsers] = useState([{ name: 'Usuario', privateKey: null, publicKey: null }]); // Simula uma lista de usuários
  const [userName, setUserName] = useState('Usuario'); // Defina o nome do usuário conforme necessário

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

  const showModal = () => {
    setIsModalOpen(true);
  };

  const showKeyModal = () => {
    setIsKeyModalOpen(true);
  };

  const handleOk = () => {
    if (plainText.trim() === '') {
      message.warning('O texto não pode estar vazio!');
      return;
    }
    // Salvar o documento
    const newDocument = {
      id: documents.length + 1, // Gera um ID único baseado no comprimento da lista
      text: plainText,
      dateTime: new Date().toLocaleString(), // Data e hora atual
      user: userName,
    };

    setDocuments([...documents, newDocument]); // Adiciona o novo documento à lista
    setPlainText(''); // Limpa o texto digitado
    setIsModalOpen(false); // Fecha o modal

    // Exibir notificação de sucesso
    notification.success({
      message: 'Documento Salvo com Sucesso',
      description: 'Seu documento foi salvo e está disponível na lista.',
    });
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setIsEditModalOpen(false);
    setIsKeyModalOpen(false); // Fecha o modal de chaves
  };

  const handleSign = (id) => {
    const userIndex = 0; // Índice do usuário atual na lista de usuários (no seu caso, parece ser um único usuário)
    generateRSAKeys(userIndex); // Gera as chaves RSA para o usuário, se ainda não existirem

    message.success(`Documento com ID: ${id} assinado com sucesso!`);
  };

  const handleEdit = (doc) => {
    setEditingDoc(doc);
    setPlainText(doc.text);
    setIsEditModalOpen(true);
  };

  const handleDelete = (id) => {
    setDocuments(documents.filter(doc => doc.id !== id));
    message.success('Documento excluído com sucesso!');
  };

  const handleEditSave = () => {
    if (plainText.trim() === '') {
      message.warning('O texto não pode estar vazio!');
      return;
    }
    const updatedDocuments = documents.map(doc =>
      doc.id === editingDoc.id
        ? { ...doc, text: plainText, dateTime: new Date().toLocaleString() }
        : doc
    );
    setDocuments(updatedDocuments);
    setPlainText('');
    setEditingDoc(null);
    setIsEditModalOpen(false);
  };

  const handleVerifySignature = (id) => {
    message.info(`Documento com ID: ${id} foi assinado!`);
  };

  return (
    <>
      <MenuPrincipal />
      <Button type="primary" onClick={showModal}>
        Novo Documento
      </Button>
      <Button onClick={showKeyModal} style={{ marginLeft: '10px' }}>
        Chaves do Usuario
      </Button>
      <Modal title="Novo Documento" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
        <TextArea
          value={plainText}
          onChange={(e) => setPlainText(e.target.value)}
          rows={4}
          placeholder="Digite seu texto aqui"
          style={{ marginTop: '10px', width: '100%' }}
        />
        <Button type="primary" onClick={() => handleSign(documents.length + 1)} style={{ marginTop: '10px', marginRight: '10px' }}>
          Assinar
        </Button>
        <Button onClick={handleOk} style={{ marginTop: '10px' }}>
          Salvar
        </Button>
      </Modal>
      <Modal
        title="Chaves do Usuário"
        open={isKeyModalOpen}
        onOk={handleCancel}
        onCancel={handleCancel}
      >
        {users[0].privateKey ? (
          <>
            <Divider orientation="left">Chave Pública</Divider>
            <TextArea value={users[0].publicKey} rows={6} readOnly />
            <Divider orientation="left">Chave Privada</Divider>
            <TextArea value={users[0].privateKey} rows={6} readOnly />
          </>
        ) : (
          <p>Chaves ainda não geradas.</p>
        )}
      </Modal>
      <Modal
        title="Editar Documento"
        open={isEditModalOpen}
        onOk={handleEditSave}
        onCancel={handleCancel}
      >
        <TextArea
          value={plainText}
          onChange={(e) => setPlainText(e.target.value)}
          rows={4}
          placeholder="Digite seu texto aqui"
          style={{ marginTop: '10px', width: '100%' }}
        />
      </Modal>
      <Divider orientation="left">MEUS DOCUMENTOS</Divider>
      <List
        size="large"
        header={<div>DOCUMENTOS</div>}
        footer={<div>FIM DOCUMENTOS</div>}
        bordered
        dataSource={documents}
        renderItem={(item) => (
          <List.Item
            actions={[
              <Button type="primary" onClick={() => handleVerifySignature(item.id)}>
                Verificar Assinatura
              </Button>,
              <Button onClick={() => handleEdit(item)}>
                Editar
              </Button>,
              <Button type="primary" danger onClick={() => handleDelete(item.id)}>
                Excluir
              </Button>,
            ]}
          >
            {item.text} - {item.dateTime} - {item.user}
          </List.Item>
        )}
      />
    </>
  );
};

export default DocumentosUsuario;
