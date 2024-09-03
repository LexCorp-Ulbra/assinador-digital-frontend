import React, { useState } from 'react';
import { Button, Modal, Input, Divider, List, message } from 'antd';
import MenuPrincipal from './Menu';
import App from './App';
import { useNavigate } from 'react-router-dom';
import './Documentos.css';


const { TextArea } = Input;

const data = [
  { id: 1, text: 'Documento 1', dateTime: 'Data/Hora', user: 'Usuario' },
  { id: 2, text: 'Documento 2', dateTime: 'Data/Hora', user: 'Usuario' },
  { id: 3, text: 'Documento 3', dateTime: 'Data/Hora', user: 'Usuario' },
  { id: 4, text: 'Documento 4', dateTime: 'Data/Hora', user: 'Usuario' },
  { id: 5, text: 'Documento 5', dateTime: 'Data/Hora', user: 'Usuario' },
];

const Documentos = () => {
  const [plainText, setPlainText] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleDocumentClick = (id) => {
    navigate(`/documento/${id}`);
  };

  return (
    <>
      <MenuPrincipal />
      <App/>
      <Divider orientation="left">DOCUMENTOS</Divider>
      <List
        size="large"
        header={<div>DOCUMENTOS</div>}
        footer={<div>FIM DOCUMENTOS</div>}
        bordered
        dataSource={data}
        renderItem={(item) => (
          <List.Item
          className="list-item"
            onClick={() => handleDocumentClick(item.id)}
            actions={[
              <Button type="primary">
                Verificar Assinatura
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

export default Documentos;

