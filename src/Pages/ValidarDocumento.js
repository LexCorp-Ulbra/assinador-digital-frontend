// src/components/ValidarDocumento.js

import React, { useState, useEffect } from "react";
import {
  Button,
  Typography,
  Alert,
  Spin,
  Card,
  Divider,
  Row,
  Col,
  message,
  Tag,
  Select,
  Upload,
} from "antd";
import { UploadOutlined, FileSearchOutlined } from "@ant-design/icons";
import axios from "axios";
import LayoutWrapper from '../Components/LayoutWrapper'; // Verifique o caminho conforme a estrutura do seu projeto

const { Title, Text } = Typography;
const { Option } = Select;

const ValidarDocumento = () => {
  const [documents, setDocuments] = useState([]);
  const [selectedDocumentId, setSelectedDocumentId] = useState(null);
  const [signatureFile, setSignatureFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [validationResult, setValidationResult] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:5000/api/documents", {
          headers: {
            "x-auth-token": token,
          },
        });
        setDocuments(response.data);
      } catch (err) {
        console.error("Erro ao buscar documentos:", err);
        message.error("Erro ao buscar documentos.");
      }
    };

    fetchDocuments();
  }, []);

  const handleUploadSignature = (file) => {
    setSignatureFile(file);
    return false; // Impede upload automático
  };

  const handleValidate = async () => {
    if (!selectedDocumentId || !signatureFile) {
      message.error("Por favor, selecione um documento e carregue a assinatura.");
      return;
    }

    setLoading(true);
    setValidationResult(null);
    setError(null);

    const formData = new FormData();
    formData.append('signature', signatureFile);

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `http://localhost:5000/api/documents/${selectedDocumentId}/validate`,
        formData,
        {
          headers: {
            "x-auth-token": token,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setValidationResult(response.data);
      message.success("Validação realizada com sucesso.");
    } catch (err) {
      console.error("Erro ao validar assinatura:", err);
      setError(err.response?.data?.error || "Erro ao validar assinatura.");
      message.error("Erro ao validar assinatura.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <LayoutWrapper>
      <Card style={{ maxWidth: "800px", margin: "24px auto", padding: "24px" }}>
        <Title level={3} style={{ textAlign: "center" }}>
          Validar Assinatura do Documento
        </Title>
        <Divider />
        <Row gutter={[16, 16]} justify="center">
          <Col xs={24} sm={24}>
            <Select
              placeholder="Selecione um Documento"
              style={{ width: "100%" }}
              onChange={(value) => setSelectedDocumentId(value)}
              value={selectedDocumentId}
            >
              {documents.map((doc) => (
                <Option key={doc._id} value={doc._id}>
                  {doc.title}
                </Option>
              ))}
            </Select>
          </Col>
          <Col xs={24} sm={24}>
            <Upload
              beforeUpload={handleUploadSignature}
              accept=".txt,.sig" // Ajuste os tipos de arquivos conforme necessário
              maxCount={1}
              showUploadList={{ showRemoveIcon: true }}
            >
              <Button icon={<UploadOutlined />}>Upload da Assinatura</Button>
            </Upload>
          </Col>
        </Row>
        <Row justify="center" style={{ marginTop: "24px" }}>
          <Button
            type="primary"
            icon={<FileSearchOutlined />}
            onClick={handleValidate}
            disabled={!selectedDocumentId || !signatureFile}
          >
            Validar Assinatura
          </Button>
        </Row>
        <Divider />
        {loading && (
          <div style={{ textAlign: "center", marginTop: "24px" }}>
            <Spin tip="Validando assinatura..." />
          </div>
        )}
        {error && (
          <Alert
            message="Erro"
            description={error}
            type="error"
            showIcon
            style={{ marginTop: "24px" }}
          />
        )}
        {validationResult && (
          <Card style={{ marginTop: "24px" }}>
            <Title level={4}>Resultado da Validação</Title>
            <Text strong>Status: </Text>
            {validationResult.valid ? (
              <Tag color="green">Assinatura Válida</Tag>
            ) : (
              <Tag color="red">Assinatura Inválida</Tag>
            )}
            <Divider />
            {validationResult.valid && (
              <>
                <Text strong>Assinado por: </Text>
                <Text>{validationResult.signedBy}</Text>
                <br />
                <Text strong>Assinado em: </Text>
                <Text>{new Date(validationResult.signedAt).toLocaleString()}</Text>
              </>
            )}
          </Card>
        )}
      </Card>
    </LayoutWrapper>
  );
};

export default ValidarDocumento;
