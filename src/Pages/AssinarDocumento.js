// src/components/AssinarDocumento.js

import React, { useState } from "react";
import {
  Form,
  Upload,
  Button,
  Typography,
  Card,
  message,
  Spin,
  Alert,
} from "antd";
import { UploadOutlined, FileTextOutlined } from "@ant-design/icons";
import axios from "axios";
import LayoutWrapper from "../Components/LayoutWrapper"; // Ajuste o caminho conforme a estrutura do seu projeto

const { Title, Text } = Typography;

const AssinarDocumento = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Função para lidar com a submissão do formulário
  const onFinish = async (values) => {
    const { documento, chavePrivada } = values;

    if (!documento || documento.length === 0) {
      message.error("Por favor, faça o upload do documento.");
      return;
    }

    if (!chavePrivada || chavePrivada.length === 0) {
      message.error("Por favor, faça o upload da chave privada.");
      return;
    }

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("documento", documento[0].originFileObj);
    formData.append("chavePrivada", chavePrivada[0].originFileObj);

    try {
      const token = localStorage.getItem("token"); // Certifique-se de que o token está armazenado no localStorage

      const response = await axios.post(
        "http://localhost:5000/api/documentos/assinar",
        formData,
        {
          headers: {
            "x-auth-token": token,
            "Content-Type": "multipart/form-data",
          },
          responseType: "blob", // Importante para lidar com o download do arquivo
        }
      );

      // Extrair o nome do arquivo a partir do cabeçalho 'content-disposition'
      const disposition = response.headers["content-disposition"];
      let filename = "assinatura_digital.txt"; // Nome padrão

      if (disposition && disposition.indexOf("attachment") !== -1) {
        const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
        const matches = filenameRegex.exec(disposition);
        if (matches != null && matches[1]) {
          filename = matches[1].replace(/['"]/g, "");
        }
      }

      // Criar uma URL para o blob recebido
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", filename); // Definir o nome do arquivo para download
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);

      message.success("Documento assinado e assinatura baixada com sucesso.");
      form.resetFields();
    } catch (err) {
      console.error("Erro ao assinar documento:", err);
      setError(
        err.response?.data?.error || "Erro ao assinar o documento. Tente novamente."
      );
      message.error(
        err.response?.data?.error || "Erro ao assinar o documento. Tente novamente."
      );
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
          maxWidth: "600px",
          margin: "40px auto",
          padding: "24px",
          borderRadius: "12px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Title level={3} style={{ textAlign: "center" }}>
          Assinar Documento Digitalmente
        </Title>
        <Text type="secondary" style={{ display: "block", textAlign: "center", marginBottom: "24px" }}>
          Faça o upload do documento e da sua chave privada para gerar a assinatura digital.
        </Text>

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
            name="documento"
            label="Documento"
            rules={[
              { required: true, message: "Por favor, faça o upload do documento." },
            ]}
          >
            <Upload
              name="documento"
              accept=".txt,.pdf,.doc,.docx" // Ajuste os tipos de arquivos conforme necessário
              multiple={false}
              beforeUpload={beforeUpload}
              maxCount={1}
            >
              <Button icon={<UploadOutlined />}>Clique para Upload do Documento</Button>
            </Upload>
          </Form.Item>

          <Form.Item
            name="chavePrivada"
            label="Chave Privada (.pem)"
            rules={[
              { required: true, message: "Por favor, faça o upload da chave privada." },
            ]}
          >
            <Upload
              name="chavePrivada"
              accept=".pem"
              multiple={false}
              beforeUpload={beforeUpload}
              maxCount={1}
            >
              <Button icon={<UploadOutlined />}>Clique para Upload da Chave Privada</Button>
            </Upload>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block disabled={loading}>
              {loading ? <Spin /> : "Assinar Documento"}
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </LayoutWrapper>
  );
};

export default AssinarDocumento;
