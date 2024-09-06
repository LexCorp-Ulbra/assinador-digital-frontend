import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, Spin, Alert, Button, Tag } from "antd";
import { Link } from "react-router-dom";
import LayoutWrapper from "./LayoutWrapper";

const DocumentosUsuario = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "http://localhost:5000/api/documents/mydocuments",
          {
            headers: {
              "x-auth-token": token,
            },
          }
        );
        setDocuments(response.data);
        setLoading(false);
      } catch (err) {
        setError("Erro ao buscar seus documentos. Tente novamente.");
        setLoading(false);
      }
    };

    fetchDocuments();
  }, []);

  const columns = [
    {
      title: "Título",
      dataIndex: "title",
      key: "title",
      render: (text) => <strong>{text}</strong>,
    },
    {
      title: "Assinado",
      dataIndex: "signature",
      key: "signed",
      render: (signature) =>
        signature ? (
          <Tag color="green">Assinado</Tag>
        ) : (
          <Tag color="volcano">Não Assinado</Tag>
        ),
    },
    {
      title: "Criado em",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (text) => new Date(text).toLocaleDateString(),
    },
    {
      title: "Ações",
      key: "action",
      render: (text, record) => (
        <Button type="primary">
          <Link to={`/documento/${record._id}`}>Ver Detalhes</Link>
        </Button>
      ),
    },
  ];

  const tableStyle = {
    borderRadius: "8px",
    overflow: "hidden",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    borderColor: "#f0f0f0",
  };

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
      <div style={{ padding: "24px", backgroundColor: "#fff" }}>
        <h2 style={{ marginBottom: "24px" }}>Meus Documentos</h2>
        <Table
          columns={columns}
          dataSource={documents}
          rowKey="_id"
          pagination={{ pageSize: 10 }}
          style={tableStyle}
        />
      </div>
    </LayoutWrapper>
  );
};

export default DocumentosUsuario;
