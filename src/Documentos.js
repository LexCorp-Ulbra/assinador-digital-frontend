import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Card, Row, Col, Spin, Alert, Tag, Typography, Empty } from "antd";
import LayoutWrapper from "./LayoutWrapper";

const { Text } = Typography;

const cardStyle = {
  borderRadius: 8,
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  margin: "8px 8px 16px",
  height: "160px",
  display: "flex",
  flexDirection: "column",
  position: "relative",
};

const contentStyle = {
  flex: 1,
  overflow: "hidden",
  display: "-webkit-box",
  WebkitBoxOrient: "vertical",
  WebkitLineClamp: 2,
  textOverflow: "ellipsis",
  whiteSpace: "normal",
};

const footerStyle = {
  paddingTop: "8px",
  marginTop: "8px",
  fontSize: "14px",
  textAlign: "center",
  borderTop: "1px solid #ddd",
};

const tagStyle = {
  position: "absolute",
  top: "10px",
  right: "10px",
};

const Documentos = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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

  const truncateTitle = (title, maxLength = 30) => {
    return title.length > maxLength
      ? `${title.substring(0, maxLength)}...`
      : title;
  };

  const truncateContent = (content, maxLength = 20) => {
    return content.length > maxLength
      ? `${content.substring(0, maxLength)}...`
      : content;
  };

  const getStatusTag = (signature) => {
    return signature ? (
      <Tag color="green" style={tagStyle}>
        Assinado
      </Tag>
    ) : (
      <Tag color="red" style={tagStyle}>
        Não Assinado
      </Tag>
    );
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

  if (documents.length === 0) {
    return (
      <LayoutWrapper>
        <Typography.Title level={4} style={{ textAlign: "center" }}>
          Nenhum Documento Encontrado
        </Typography.Title>
        <Empty description="Não há documentos disponíveis no momento." />
      </LayoutWrapper>
    );
  }

  return (
    <LayoutWrapper>
      <Typography.Title
        level={2}
        style={{ textAlign: "center", marginBottom: "24px" }}
      >
        Documentos
      </Typography.Title>
      <Row gutter={24}>
        {documents.map((item) => (
          <Col span={8} key={item._id}>
            <Card
              title={truncateTitle(item.title)}
              bordered={true}
              style={cardStyle}
              onClick={() => handleCardClick(item._id)}
              hoverable
            >
              {getStatusTag(item.signature)}
              <div style={contentStyle}>
                <Text>{truncateContent(item.content)}</Text>
              </div>
              <div style={footerStyle}>
                <div>
                  Criado por:{" "}
                  {item.createdBy ? item.createdBy.username : "Desconhecido"}
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
