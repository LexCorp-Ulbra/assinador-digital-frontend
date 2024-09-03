import React, { useState } from 'react';
import { AppstoreOutlined, MailOutlined, UserOutlined } from '@ant-design/icons';
import { Menu, Modal } from 'antd';
import { Link } from 'react-router-dom';

const items = [
  {
    label: <Link to="/documentos">Documentos</Link>,
    key: 'mail',
    icon: <MailOutlined />,
  },

  {
    label: 'Usuario',
    key: 'user',
    icon: <UserOutlined />,
    children: [
      {
        type: 'group',
        label: 'Meus Documentos',
        children: [
          {
            label: <Link to="/documentoUsuario">Documentos</Link>,
            key: 'setting:1',
          },
        ],
      },
      {
        type: 'group',
        label: 'Minhas Chaves',
        children: [
          {
            label: 'Publica',
            key: 'setting:3',
          },
          {
            label: 'Privada',
            key: 'setting:4',
          },
        ],
      },
    ],
  },
];

const MenuPrincipal = () => {
  const [current, setCurrent] = useState('mail');
  const [isPublicaModalOpen, setIsPublicaModalOpen] = useState(false);
  const [isPrivadaModalOpen, setIsPrivadaModalOpen] = useState(false);

  const onClick = (e) => {
    console.log('click ', e);
    setCurrent(e.key);

    if (e.key === 'setting:3') { // Verifica se o item clicado é 'Publica'
      setIsPublicaModalOpen(true);
    } else if (e.key === 'setting:4') { // Verifica se o item clicado é 'Privada'
      setIsPrivadaModalOpen(true);
    }
  };

  const handlePublicaModalOk = () => {
    setIsPublicaModalOpen(false);
  };

  const handlePublicaModalCancel = () => {
    setIsPublicaModalOpen(false);
  };

  const handlePrivadaModalOk = () => {
    setIsPrivadaModalOpen(false);
  };

  const handlePrivadaModalCancel = () => {
    setIsPrivadaModalOpen(false);
  };

  return (
    <>
      <Menu onClick={onClick} selectedKeys={[current]} mode="horizontal" items={items} />
      
      <Modal
        title="Informações sobre Chave Pública"
        open={isPublicaModalOpen}
        onOk={handlePublicaModalOk}
        onCancel={handlePublicaModalCancel}
      >
        <p>Conteúdo sobre Chave Pública...</p>
      </Modal>

      <Modal
        title="Informações sobre Chave Privada"
        open={isPrivadaModalOpen}
        onOk={handlePrivadaModalOk}
        onCancel={handlePrivadaModalCancel}
      >
        <p>Conteúdo sobre Chave Privada...</p>
      </Modal>
    </>
  );
};

export default MenuPrincipal;
