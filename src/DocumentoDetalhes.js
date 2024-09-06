import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import {
  Spin,
  Alert,
  Collapse,
  Divider,
  Button,
  message,
  Typography,
  Card,
} from "antd";
import { LockOutlined, EditOutlined } from "@ant-design/icons";
import LayoutWrapper from "./LayoutWrapper";

const { Panel } = Collapse;
const { Title } = Typography;

const containerStyle = {
  padding: "24px",
  backgroundColor: "#fff",
  borderRadius: "8px",
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  margin: "0 auto",
  maxWidth: "800px",
};

const textStyle = {
  marginBottom: "16px",
  wordBreak: "break-word",
  whiteSpace: "pre-wrap",
};

const buttonStyle = {
  marginTop: "16px",
};

const DocumentoDetalhes = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [document, setDocument] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isValid, setIsValid] = useState(null);
  const [isDocumentSigned, setIsDocumentSigned] = useState(false);
  const [isUserAuthor, setIsUserAuthor] = useState(false);

  const fetchDocument = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `http://localhost:5000/api/documents/${id}`,
        {
          headers: {
            "x-auth-token": token,
          },
        }
      );
      console.log(response.data);
      setDocument(response.data);
      setIsDocumentSigned(!!response.data.signature);

      const { data: user } = await axios.get(
        "http://localhost:5000/api/auth/me",
        {
          headers: {
            "x-auth-token": token,
          },
        }
      );
      setIsUserAuthor(response.data.createdBy._id === user._id);

      setLoading(false);
    } catch (err) {
      setError("Erro ao buscar detalhes do documento. Tente novamente.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocument();
  }, [id]);

  const handleValidateSignature = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:5000/api/documents/validate",
        {
          documentId: id,
          signature: document.signature,
        },
        {
          headers: {
            "x-auth-token": token,
          },
        }
      );
      if (response.data.valid) {
        message.success("Assinatura válida.");
      } else {
        message.error("Assinatura inválida.");
      }
      setIsValid(response.data.valid);
    } catch (err) {
      message.error("Erro ao validar assinatura.");
    }
  };

  const handleSignDocument = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `http://localhost:5000/api/documents/${id}/sign`,
        {},
        {
          headers: {
            "x-auth-token": token,
          },
        }
      );
      message.success("Documento assinado com sucesso.");
      fetchDocument();
    } catch (err) {
      message.error("Erro ao assinar o documento.");
    }
  };

  if (loading) {
    return (
      <LayoutWrapper>
        <Spin tip="Carregando detalhes do documento..." />
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

  if (!document) {
    return (
      <LayoutWrapper>
        <Alert
          message="Documento não encontrado"
          description="O documento que você está tentando visualizar não existe."
          type="warning"
        />
      </LayoutWrapper>
    );
  }

  return (
    <LayoutWrapper>
      <Card style={containerStyle}>
        <Button
          type="primary"
          onClick={() => navigate(-1)}
          style={{ marginBottom: "16px" }}
        >
          Voltar
        </Button>
        <Title level={4}>Detalhes do Documento</Title>
        <p style={textStyle}>
          <strong>Título:</strong> {document.title}
        </p>
        <p style={textStyle}>
          <strong>Assinado por:</strong>{" "}
          {document.signedBy ? document.signedBy.username : "Não assinado"}
        </p>
        <p style={textStyle}>
          <strong>Chave pública do assinante:</strong>{" "}
          {document.signedBy ? document.signedBy.publicKey : "Não assinado"}
        </p>
        <p style={textStyle}>
          <strong>Assinatura:</strong>{" "}
          {document.signature ? document.signature : "Nenhuma assinatura"}
        </p>
        <p style={textStyle}>
          <strong>Criado por:</strong>{" "}
          {document.createdBy ? document.createdBy.username : "Desconhecido"}
        </p>
        <p style={textStyle}>
          <strong>Criado em:</strong>{" "}
          {new Date(document.createdAt).toLocaleDateString()}
        </p>
        {document.signedAt && (
          <p style={textStyle}>
            <strong>Assinado em:</strong>{" "}
            {new Date(document.signedAt).toLocaleDateString()}
          </p>
        )}
        <Divider />
        <Collapse defaultActiveKey={["1"]} ghost>
          <Panel header="Conteúdo do Documento" key="1">
            <p>{document.content}</p>
          </Panel>
        </Collapse>
        {isDocumentSigned && (
          <Button
            type="primary"
            icon={<LockOutlined />}
            onClick={handleValidateSignature}
            style={buttonStyle}
          >
            Validar Assinatura
          </Button>
        )}
        {!isDocumentSigned && isUserAuthor && (
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={handleSignDocument}
            style={buttonStyle}
          >
            Assinar Documento
          </Button>
        )}
      </Card>
    </LayoutWrapper>
  );
};

export default DocumentoDetalhes;
