// src/components/ValidarDocumento.js

import React, { useState } from "react";
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
  Upload,
  Form,
} from "antd";
import { UploadOutlined, FileSearchOutlined } from "@ant-design/icons";
import axios from "axios";
import LayoutWrapper from '../Components/LayoutWrapper'; // Ajuste o caminho conforme a estrutura do seu projeto

const { Title, Text } = Typography;

const ValidarDocumento = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [validationResult, setValidationResult] = useState(null);
  const [error, setError] = useState(null);

  // Função para lidar com a submissão do formulário
  const onFinish = async (values) => {
    const { assinaturaDigital, documento, certificado } = values;

    // Verificar se todos os arquivos foram carregados
    if (
      !assinaturaDigital ||
      assinaturaDigital.length === 0 ||
      !documento ||
      documento.length === 0 ||
      !certificado ||
      certificado.length === 0
    ) {
      message.error("Por favor, faça o upload de todos os arquivos necessários.");
      return;
    }

    setLoading(true);
    setValidationResult(null);
    setError(null);

    const formData = new FormData();
    formData.append("assinaturaDigital", assinaturaDigital[0].originFileObj);
    formData.append("documento", documento[0].originFileObj);
    formData.append("certificado", certificado[0].originFileObj);

    try {
      const token = localStorage.getItem("token"); // Certifique-se de que o token está armazenado no localStorage

      const response = await axios.post(
        "http://localhost:5000/api/documentos/validar",
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
      form.resetFields();
    } catch (err) {
      console.error("Erro ao validar assinatura:", err);
      setError(err.response?.data?.error || "Erro ao validar assinatura.");
      message.error(err.response?.data?.error || "Erro ao validar assinatura.");
    } finally {
      setLoading(false);
    }
  };

  // Função para validar os tipos de arquivos
  const beforeUpload = (file) => {
    return false; // Impede upload automático
  };

  return (
    <LayoutWrapper>
      <Card
        style={{
          maxWidth: "800px",
          margin: "40px auto",
          padding: "24px",
          borderRadius: "12px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Title level={3} style={{ textAlign: "center" }}>
          Validar Assinatura do Documento
        </Title>
        <Text type="secondary" style={{ display: "block", textAlign: "center", marginBottom: "24px" }}>
          Faça o upload do documento, da assinatura digital e do certificado para validar a assinatura.
        </Text>
        <Divider />

        {error && (
          <Alert
            message="Erro"
            description={error}
            type="error"
            showIcon
            style={{ marginBottom: "24px" }}
          />
        )}

        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
        >
          <Form.Item
            name="assinaturaDigital"
            label="Assinatura Digital (.txt, .sig)"
            rules={[
              { required: true, message: "Por favor, faça o upload da assinatura digital." },
            ]}
          >
            <Upload
              name="assinaturaDigital"
              accept=".txt,.sig"
              multiple={false}
              beforeUpload={beforeUpload}
              maxCount={1}
              showUploadList={{
                showRemoveIcon: true,
              }}
            >
              <Button icon={<UploadOutlined />}>Clique para Upload da Assinatura Digital</Button>
            </Upload>
          </Form.Item>

          <Form.Item
            name="documento"
            label="Documento (.txt, .pdf, .doc, .docx)"
            rules={[
              { required: true, message: "Por favor, faça o upload do documento." },
            ]}
          >
            <Upload
              name="documento"
              accept=".txt,.pdf,.doc,.docx"
              multiple={false}
              beforeUpload={beforeUpload}
              maxCount={1}
              showUploadList={{
                showRemoveIcon: true,
              }}
            >
              <Button icon={<UploadOutlined />}>Clique para Upload do Documento</Button>
            </Upload>
          </Form.Item>

          <Form.Item
            name="certificado"
            label="Certificado Digital (.pem)"
            rules={[
              { required: true, message: "Por favor, faça o upload do certificado digital." },
            ]}
          >
            <Upload
              name="certificado"
              accept=".pem"
              multiple={false}
              beforeUpload={beforeUpload}
              maxCount={1}
              showUploadList={{
                showRemoveIcon: true,
              }}
            >
              <Button icon={<UploadOutlined />}>Clique para Upload do Certificado</Button>
            </Upload>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block disabled={loading}>
              {loading ? <Spin /> : "Validar Assinatura"}
            </Button>
          </Form.Item>
        </Form>

        <Divider />

        {loading && (
          <div style={{ textAlign: "center", marginTop: "24px" }}>
            <Spin tip="Validando assinatura..." />
          </div>
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
            {validationResult.valid ? (
              <>
                <Text strong>Assinado por: </Text>
                <Text>{validationResult.signedBy || "Desconhecido"}</Text>
                <br />
                <Text strong>Assinado em: </Text>
                <Text>{validationResult.signedAt ? new Date(validationResult.signedAt).toLocaleString() : "Desconhecido"}</Text>
              </>
            ) : (
              <Text type="danger">A assinatura não é válida para o documento fornecido.</Text>
            )}
          </Card>
        )}
      </Card>
    </LayoutWrapper>
  );
};

export default ValidarDocumento;
