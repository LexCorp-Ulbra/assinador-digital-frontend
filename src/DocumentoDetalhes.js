// src/components/DocumentoDetalhes.js

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
  Upload,
  Descriptions,
  Row,
  Col,
} from "antd";
import {
  EditOutlined,
  UploadOutlined,
  DownloadOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";
import LayoutWrapper from "./Components/LayoutWrapper";
import forge from "node-forge";

const { Panel } = Collapse;
const { Title } = Typography;

// Estilos
const containerStyle = {
  padding: "24px",
  backgroundColor: "#fff",
  borderRadius: "8px",
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  margin: "24px auto",
  maxWidth: "900px",
};

const sectionStyle = {
  marginTop: "24px",
};

const uploadSectionStyle = {
  marginTop: "16px",
};

const DocumentoDetalhes = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [doc, setDoc] = useState(null); // Renomeado de 'document' para 'doc'
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDocumentSigned, setIsDocumentSigned] = useState(false);
  const [isUserAuthor, setIsUserAuthor] = useState(false);
  const [certificatePem, setCertificatePem] = useState(null);
  const [privateKeyPem, setPrivateKeyPem] = useState(null);
  const [privateKey, setPrivateKey] = useState(null);
  const [publicKey, setPublicKey] = useState(null);

  // Definição de uploadProps dentro do componente para garantir escopo
  const uploadProps = {
    accept: ".pem",
    multiple: false,
    beforeUpload: () => false, // Impede o upload automático
  };

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
      console.log("Documento Fetch:", response.data);
      setDoc(response.data); // Atualizado de 'document' para 'doc'
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
      console.error("Erro ao buscar documento:", err);
      setError("Erro ao buscar detalhes do documento. Tente novamente.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocument();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    console.log("Estado Atual após Upload:", {
      certificatePem,
      privateKey,
    });
  }, [certificatePem, privateKey]);

  // Função para processar o upload de certificados e chaves privadas
  const handleUploadCertificates = (file, type) => {
    const reader = new FileReader();
    reader.onload = () => {
      const pem = reader.result;
      console.log(`Arquivo ${type} carregado:`, pem.substring(0, 100) + '...');
      if (type === "certificate") {
        setCertificatePem(pem);
        try {
          const cert = forge.pki.certificateFromPem(pem);
          const pubKey = cert.publicKey;
          setPublicKey(pubKey);
          console.log("Chave pública extraída:", pubKey);
          message.success("Certificado carregado com sucesso.");
        } catch (error) {
          console.error("Erro ao processar o certificado:", error);
          message.error("Certificado inválido. Por favor, verifique o arquivo.");
        }
      } else if (type === "privateKey") {
        setPrivateKeyPem(pem);
        try {
          const privKey = forge.pki.privateKeyFromPem(pem);
          setPrivateKey(privKey);
          console.log("Chave privada carregada e parseada com sucesso.");
          message.success("Chave privada carregada com sucesso.");
        } catch (error) {
          console.error("Erro ao processar a chave privada:", error);
          message.error("Chave privada inválida. Por favor, verifique o arquivo.");
        }
      }
    };
    reader.onerror = () => {
      console.error("Erro ao ler o arquivo:", file.name);
      message.error("Erro ao ler o arquivo.");
    };
    reader.readAsText(file);
  };

  // Função para baixar a assinatura digital automaticamente em formato ZIP
  const handleDownloadSignature = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`http://localhost:5000/api/documents/${id}/signature/zip`, {
        headers: {
          "x-auth-token": token,
        },
        responseType: 'blob', // Importante para dados binários
      });

      // Criação de uma URL para o blob recebido
      const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/zip' }));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `assinatura_digital_${id}.zip`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
      console.log("Assinatura digital baixada com sucesso.");
      message.success("Assinatura digital baixada com sucesso.");
    } catch (error) {
      console.error("Erro ao baixar a assinatura:", error);
      message.error("Erro ao baixar a assinatura.");
    }
  };

  const handleSignDocument = async () => {
    if (!privateKey) {
      message.error("Chave privada não carregada.");
      return;
    }
  
    if (!certificatePem) {
      message.error("Certificado não carregado.");
      return;
    }
  
    try {
      // Gerar assinatura
      const md = forge.md.sha256.create();
      md.update(doc.content, "utf8"); // Atualizado de 'document' para 'doc'
      const signature = privateKey.sign(md);
  
      // Converter assinatura para base64 para facilitar o transporte
      const signatureBase64 = forge.util.encode64(signature);
      console.log("Assinatura Base64:", signatureBase64); // Adicione este log
  
      const token = localStorage.getItem("token");
      await axios.post(
        `http://localhost:5000/api/documents/${id}/sign`,
        {
          signature: signatureBase64,
          certificate: certificatePem, // Enviar o certificado para associar ao documento
        },
        {
          headers: {
            "x-auth-token": token,
          },
        }
      );
      message.success("Documento assinado com sucesso.");
      await fetchDocument();
      await handleDownloadSignature(); // Baixa a assinatura automaticamente
    } catch (err) {
      console.error("Erro ao assinar documento:", err);
      message.error("Erro ao assinar o documento.");
    }
  };

  const handleDownloadCertificate = () => {
    if (!certificatePem) {
      message.error("Certificado não carregado.");
      return;
    }

    const element = document.createElement("a");
    const file = new Blob([certificatePem], { type: "application/x-pem-file" });
    element.href = URL.createObjectURL(file);
    element.download = "certificado.pem";
    document.body.appendChild(element); // Necessário para Firefox
    element.click();
    document.body.removeChild(element);
    window.URL.revokeObjectURL(element.href);
    console.log("Certificado baixado com sucesso.");
    message.success("Certificado baixado com sucesso.");
  };

  if (loading) {
    return (
      <LayoutWrapper>
        <Spin tip="Carregando detalhes do documento..." size="large" />
      </LayoutWrapper>
    );
  }

  if (error) {
    return (
      <LayoutWrapper>
        <Alert message="Erro" description={error} type="error" showIcon />
      </LayoutWrapper>
    );
  }

  if (!doc) { // Atualizado de 'document' para 'doc'
    return (
      <LayoutWrapper>
        <Alert
          message="Documento não encontrado"
          description="O documento que você está tentando visualizar não existe."
          type="warning"
          showIcon
        />
      </LayoutWrapper>
    );
  }

  return (
    <LayoutWrapper>
      <Card style={containerStyle}>
        <Row justify="space-between" align="middle">
          <Col>
            <Button
              type="link"
              icon={<ArrowLeftOutlined />}
              onClick={() => navigate(-1)}
            >
              Voltar
            </Button>
          </Col>
          <Col>
            <Title level={4} style={{ margin: 0 }}>
              Detalhes do Documento
            </Title>
          </Col>
          <Col></Col>
        </Row>
        <Divider />
        <Descriptions
          bordered
          column={{ xs: 1, sm: 1, md: 2 }}
          size="middle"
          style={sectionStyle}
        >
          <Descriptions.Item label="Título">{doc.title}</Descriptions.Item>
          <Descriptions.Item label="Assinado por">
            {doc.signedBy ? doc.signedBy.username : "Não assinado"}
          </Descriptions.Item>
          <Descriptions.Item label="Criado por">
            {doc.createdBy ? doc.createdBy.username : "Desconhecido"}
          </Descriptions.Item>
          <Descriptions.Item label="Criado em">
            {new Date(doc.createdAt).toLocaleDateString()}
          </Descriptions.Item>
          {doc.signedAt && (
            <Descriptions.Item label="Assinado em">
              {new Date(doc.signedAt).toLocaleDateString()}
            </Descriptions.Item>
          )}
        </Descriptions>

        <Divider />

        <Collapse defaultActiveKey={["1"]} ghost>
          <Panel header="Conteúdo do Documento" key="1">
            <Typography.Paragraph>{doc.content}</Typography.Paragraph>
          </Panel>
        </Collapse>

        <Divider />

        <Row gutter={[16, 16]} justify="center" style={sectionStyle}>
          <Col>
            <Button
              type="primary"
              icon={<EditOutlined />}
              onClick={handleSignDocument}
              disabled={!certificatePem || !privateKey}
            >
              Assinar Documento
            </Button>
          </Col>
          {isDocumentSigned && (
            <Col>
              <Button
                type="default"
                icon={<DownloadOutlined />}
                onClick={handleDownloadCertificate}
              >
                Baixar Certificado
              </Button>
            </Col>
          )}
        </Row>

        {isUserAuthor && (
          <>
            <Divider />
            <Card
              title="Carregar Certificado e Chave Privada"
              type="inner"
              style={uploadSectionStyle}
            >
              <Row gutter={[16, 16]}>
                <Col xs={24} sm={12}>
                  <Upload
                    {...uploadProps}
                    onChange={(info) => {
                      if (info.file.status !== "uploading") {
                        handleUploadCertificates(info.file, "certificate");
                      }
                    }}
                  >
                    <Button icon={<UploadOutlined />}>
                      Upload do Certificado (.pem)
                    </Button>
                  </Upload>
                </Col>
                <Col xs={24} sm={12}>
                  <Upload
                    {...uploadProps}
                    onChange={(info) => {
                      if (info.file.status !== "uploading") {
                        handleUploadCertificates(info.file, "privateKey");
                      }
                    }}
                  >
                    <Button icon={<UploadOutlined />}>
                      Upload da Chave Privada (.pem)
                    </Button>
                  </Upload>
                </Col>
              </Row>
            </Card>
          </>
        )}
      </Card>
    </LayoutWrapper>
  );
};

export default DocumentoDetalhes;
