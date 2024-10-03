import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Card, Row, Col, Spin, Alert, Tag, Typography, Empty, Pagination } from "antd";
import { FileTextOutlined } from "@ant-design/icons"; // Importando ícone de documento
import LayoutWrapper from "../Components/LayoutWrapper";

const { Text, Title } = Typography;

const Documentos = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1); // Controle da página atual
  const [pageSize, setPageSize] = useState(6); // Controle do número de itens por página
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "http://localhost:5000/api/documents",
          {
            headers: {
              "x-auth-token": token,
            },
          }
        );
        setDocuments(response.data);
        setLoading(false);
      } catch (err) {
        setError("Erro ao buscar documentos. Tente novamente.");
        setLoading(false);
      }
    };

    fetchDocuments();
  }, []);

  const handleCardClick = (id) => {
    navigate(`/documento/${id}`);
  };

  const truncateText = (text, maxLength) => {
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
  };

  const handlePageChange = (page, size) => {
    setCurrentPage(page);
    setPageSize(size);
  };

  const renderDocuments = () => {
    if (loading) {
      return (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
          <Spin tip="Carregando documentos..." />
        </div>
      );
    }

    if (error) {
      return <Alert message="Erro" description={error} type="error" />;
    }

    if (documents.length === 0) {
      return (
        <div style={{ textAlign: "center", padding: "40px" }}>
          <Title level={4}>Nenhum Documento Encontrado</Title>
          <Empty description="Não há documentos disponíveis no momento." />
        </div>
      );
    }

    // Cálculo dos documentos a serem exibidos na página atual
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedDocuments = documents.slice(startIndex, endIndex);

    return (
      <>
        <Row gutter={[16, 16]} justify="center">
          {paginatedDocuments.map((item) => (
            <Col xs={24} sm={12} md={8} key={item._id}>
              <Card
                bordered={true}
                style={{
                  borderRadius: 12,
                  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                  display: "flex",
                  flexDirection: "column",
                  position: "relative",
                  margin: "16px 0",
                  padding: "16px",
                }}
                onClick={() => handleCardClick(item._id)}
                hoverable
              >
                <div style={{ display: "flex", alignItems: "center", marginBottom: "12px" }}>
                  <FileTextOutlined style={{ fontSize: "24px", marginRight: "10px", color: "#1890ff" }} />
                  <Text strong style={{ fontSize: "16px" }}>
                    {truncateText(item.title, 40)}
                  </Text>
                </div>
                <div
                  style={{
                    flex: 1,
                    overflow: "hidden",
                    display: "-webkit-box",
                    WebkitBoxOrient: "vertical",
                    WebkitLineClamp: 2,
                    textOverflow: "ellipsis",
                    whiteSpace: "normal",
                    marginBottom: "16px",
                  }}
                >
                  <Text>{truncateText(item.content, 80)}</Text>
                </div>
                <div
                  style={{
                    paddingTop: "8px",
                    fontSize: "14px",
                    textAlign: "center",
                    borderTop: "1px solid #ddd",
                  }}
                >
                  Criado por: {item.createdBy ? item.createdBy.username : "Desconhecido"}
                </div>
              </Card>
            </Col>
          ))}
        </Row>
        <Pagination
          current={currentPage}
          pageSize={pageSize}
          total={documents.length}
          onChange={handlePageChange}
          showSizeChanger // Para permitir que o usuário altere o número de itens por página
        />
      </>
    );
  };

  return (
    <LayoutWrapper>
      <Title level={2} style={{ textAlign: "center", marginBottom: "24px" }}>
        Documentos
      </Title>
      {renderDocuments()}
    </LayoutWrapper>
  );
};

export default Documentos;
