import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Card, Row, Col, Spin, Alert } from 'antd';
import LayoutWrapper from './LayoutWrapper';

const cardStyle = {
  borderRadius: 8,
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  margin: 8,
  height: '200px',
  display: 'flex',
  flexDirection: 'column',
};

const contentStyle = {
  flex: 1,
  overflow: 'hidden',
  display: '-webkit-box',
  WebkitBoxOrient: 'vertical',
  WebkitLineClamp: 2,
  textOverflow: 'ellipsis',
  whiteSpace: 'normal',
};

const footerStyle = {
  paddingTop: '8px',
  borderTop: '1px solid #ddd',
  fontSize: '14px',
  textAlign: 'center',
  backgroundColor: '#fff',
};

const Documentos = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/documents', {
          headers: {
            'x-auth-token': token,
          },
        });
        setDocuments(response.data);
        setLoading(false);
      } catch (err) {
        setError('Erro ao buscar documentos. Tente novamente.');
        setLoading(false);
      }
    };

    fetchDocuments();
  }, []);

  const handleCardClick = (id) => {
    navigate(`/documento/${id}`);
  };

  if (loading) {
    return (
      <LayoutWrapper>
        <Spin tip="Carregando documentos..." />
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
      <Row gutter={24}>
        {documents.map((item) => (
          <Col span={8} key={item._id}>
            <Card
              title={item.title}
              bordered={true}
              style={cardStyle}
              onClick={() => handleCardClick(item._id)}
              hoverable
            >
              <div style={contentStyle}>
                <p>{item.content}</p>
              </div>
              <div style={footerStyle}>
                <div>
                  Criado por: {item.createdBy ? item.createdBy.username : 'Desconhecido'}
                </div>
              </div>
            </Card>
          </Col>
        ))}
      </Row>
    </LayoutWrapper>
  );
};

export default Documentos;