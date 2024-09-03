import React from 'react';
import { useParams } from 'react-router-dom';
import { Card, Descriptions, Button } from 'antd';
import { useNavigate } from 'react-router-dom';

const DocumentoDetalhes = () => {
  const { id } = useParams();  // Obtém o ID do documento a partir da URL
  const navigate = useNavigate();

  // Aqui você pode buscar os detalhes do documento usando o ID. Por enquanto, vamos usar dados simulados.
  const documento = {
    id: id,
    text: `Conteúdo do Documento ${id}`,
    dateTime: 'Data/Hora',
    user: 'Nome do Usuário',
    assinatura: 'Assinatura Digital Simulada'
  };

  return (
    <Card title={`Detalhes do Documento ${id}`} bordered={false} style={{ maxWidth: 800, margin: '0 auto', marginTop: 20 }}>
      <Descriptions bordered>
        <Descriptions.Item label="ID do Documento">{documento.id}</Descriptions.Item>
        <Descriptions.Item label="Usuário">{documento.user}</Descriptions.Item>
        <Descriptions.Item label="Data e Hora">{documento.dateTime}</Descriptions.Item>
        <Descriptions.Item label="Texto">{documento.text}</Descriptions.Item>
        <Descriptions.Item label="Assinatura">{documento.assinatura}</Descriptions.Item>
      </Descriptions>
      <Button type="primary" style={{ marginTop: 20 }} onClick={() => navigate(-1)}>
        Voltar
      </Button>
    </Card>
  );
};

export default DocumentoDetalhes;
