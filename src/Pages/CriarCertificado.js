import React, { useState } from 'react';
import { Form, Input, Button, Layout, Typography, Card, message, Spin } from 'antd';
import LayoutWrapper from '../Components/LayoutWrapper';
import moment from 'moment';
import axios from 'axios';

const { Content } = Layout;
const { Title, Text } = Typography;

const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

const buttonLayout = {
  wrapperCol: { span: 16, offset: 8 },
};

const CriarCertificado = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false); // Estado para o spinner de carregamento

  const handleFinish = async (values) => {
    setLoading(true);  // Inicia o carregamento
    try {
      const dataInicioValidade = moment();  // Data atual
      const dataTerminoValidade = moment(dataInicioValidade).add(1, 'year').format('YYYY-MM-DD');

      const certificadoData = {
        countryName: values.countryName,
        stateOrProvinceName: values.stateOrProvinceName,
        localityName: values.localityName,
        organizationName: values.organizationName,
        commonName: values.commonName,
        startDate: dataInicioValidade.format('YYYY-MM-DD'),
        endDate: dataTerminoValidade,
      };

      // Recupera o token armazenado no localStorage
      const token = localStorage.getItem('token');

      if (!token) {
        throw new Error('Token de autenticação não encontrado. Por favor, faça login novamente.');
      }

      // Enviar os dados para o backend com o cabeçalho de autenticação correto
      const response = await axios.post('http://localhost:5000/api/keys', certificadoData, 
        {
          responseType: 'blob',  // Para receber o arquivo ZIP
          headers: {
            'x-auth-token': token,
          },
        }
      );

      // Verifica o tipo de resposta
      const contentType = response.headers['content-type'];
      if (contentType === 'application/json') {
        // Caso o backend retorne um erro em JSON
        const reader = new FileReader();
        reader.onload = () => {
          try {
            const errorData = JSON.parse(reader.result);
            throw new Error(errorData.error || 'Erro desconhecido.');
          } catch (parseError) {
            throw new Error('Erro ao processar a resposta do servidor.');
          }
        };
        reader.readAsText(response.data);
      }

      // Mostrar uma mensagem de sucesso
      message.success('Certificado criado com sucesso!');

      // Criar um link para download do arquivo ZIP
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      // Extrair o nome do arquivo do cabeçalho de resposta ou usar um nome padrão
      const contentDisposition = response.headers['content-disposition'];
      let fileName = 'chaves.zip';
      if (contentDisposition) {
        const fileNameMatch = contentDisposition.match(/filename="?([^"]+)"?/);
        if (fileNameMatch && fileNameMatch.length === 2) {
          fileName = fileNameMatch[1];
        }
      }
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      // Verifique se o erro é um Blob (resposta de erro do backend)
      if (error instanceof TypeError && error.message === 'Failed to fetch') {
        message.error('Erro de rede. Verifique sua conexão.');
      } else {
        message.error(`Erro ao criar o certificado: ${error.message || 'Tente novamente.'}`);
      }
      console.error('Erro:', error);
    } finally {
      setLoading(false);  // Finaliza o carregamento
    }
  };

  return (
    <LayoutWrapper>
      <Content style={{ padding: '40px', backgroundColor: '#f0f2f5' }}>
        <Card style={{ maxWidth: '800px', margin: '0 auto', padding: '24px' }}>
          <Title level={2} style={{ textAlign: 'center', marginBottom: '24px' }}>
            Criar Certificado X.509
          </Title>
          <Text style={{ display: 'block', marginBottom: '24px', textAlign: 'center' }}>
            Preencha os detalhes abaixo para criar um novo certificado X.509.
          </Text>
          <Form
            {...formItemLayout}
            form={form}
            name="criarCertificado"
            onFinish={handleFinish}
            style={{ maxWidth: '100%' }}
          >
            <Form.Item
              name="countryName"
              label="Nome do País"
              rules={[{ required: true, message: 'Por favor, insira o nome do país!' }]}
            >
              <Input placeholder="Insira o nome do país" />
            </Form.Item>

            <Form.Item
              name="stateOrProvinceName"
              label="Estado/Província"
              rules={[{ required: true, message: 'Por favor, insira o estado ou província!' }]}
            >
              <Input placeholder="Insira o estado ou província" />
            </Form.Item>

            <Form.Item
              name="localityName"
              label="Localidade"
              rules={[{ required: true, message: 'Por favor, insira a localidade!' }]}
            >
              <Input placeholder="Insira a localidade" />
            </Form.Item>

            <Form.Item
              name="organizationName"
              label="Nome da Organização"
              rules={[{ required: true, message: 'Por favor, insira o nome da organização!' }]}
            >
              <Input placeholder="Insira o nome da organização" />
            </Form.Item>

            <Form.Item
              name="commonName"
              label="Nome Comum"
              rules={[{ required: true, message: 'Por favor, insira o seu nome!' }]}
            >
              <Input placeholder="Insira o seu nome" />
            </Form.Item>

            <Form.Item label="Data de Início de Validade">
              <Input value={moment().format('YYYY-MM-DD')} disabled />
            </Form.Item>

            <Form.Item label="Data de Término de Validade">
              <Input value={moment().add(1, 'year').format('YYYY-MM-DD')} disabled />
            </Form.Item>

            <Form.Item {...buttonLayout}>
              <Button type="primary" htmlType="submit" block disabled={loading}>
                {loading ? <Spin /> : 'Criar Certificado'}
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </Content>
    </LayoutWrapper>
  );
};

export default CriarCertificado;
