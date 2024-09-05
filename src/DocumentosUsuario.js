// MeusDocumentos.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Spin, Alert, Button } from 'antd';
import { Link } from 'react-router-dom';
import LayoutWrapper from './LayoutWrapper';

const DocumentosUsuario = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/documents/my-documents', {
          headers: {
            'x-auth-token': token,
          },
        });
        setDocuments(response.data);
        setLoading(false);
      } catch (err) {
        setError('Erro ao buscar seus documentos. Tente novamente.');
        setLoading(false);
      }
    };

    fetchDocuments();
  }, []);

  const columns = [
    {
      title: 'Título',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Assinado por',
      dataIndex: 'signedBy',
      key: 'signedBy',
      render: (text, record) => (record.signedBy ? record.signedBy.username : 'Não assinado'),
    },
    {
      title: 'Criado em',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (text) => new Date(text).toLocaleDateString(),
    },
    {
      title: 'Ações',
      key: 'action',
      render: (text, record) => (
        <Button type="link">
          <Link to={`/documentos/${record._id}`}>Ver Detalhes</Link>
        </Button>
      ),
    },
  ];

  if (loading) {
    return (
      <LayoutWrapper>
        <Spin tip="Carregando seus documentos..." />
      </LayoutWrapper>
    );
  }

  if (error) {
    return (
      <LayoutWrapper>
        <Alert message="Erro" description={error} type="error" />
      </LayoutWrapper>
    );
  }

  return (
    <LayoutWrapper>
      <div style={{ padding: '24px', backgroundColor: '#fff' }}>
        <h2>Meus Documentos</h2>
        <Table
          columns={columns}
          dataSource={documents}
          rowKey="_id"
          pagination={{ pageSize: 10 }}
        />
      </div>
    </LayoutWrapper>
  );
};

export default DocumentosUsuario;
