import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Button, Switch, message, Layout, Typography, Card } from 'antd';
import LayoutWrapper from '../Components/LayoutWrapper';

const { Content } = Layout;
const { Title, Text } = Typography;

const formItemLayout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 16 },
};

const buttonLayout = {
  wrapperCol: { span: 16, offset: 4 },
};

const NovoDocumento = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [signDocument, setSignDocument] = useState(false);

  const handleSwitchChange = (checked) => {
    setSignDocument(checked);
  };

  const handleFinish = async (values) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        'http://localhost:5000/api/documents',
        {
          title: values.title,
          content: values.content,
          signDocument,
        },
        {
          headers: {
            'x-auth-token': token,
          },
        }
      );
      message.success('Documento criado com sucesso.');
      navigate('/documentos');
    } catch (error) {
      message.error('Erro ao criar documento.');
    }
  };

  return (
    <LayoutWrapper>
      <Content style={{ padding: '40px', backgroundColor: '#f0f2f5' }}>
        <Card style={{ maxWidth: '800px', margin: '0 auto', padding: '24px' }}>
          <Title level={2} style={{ textAlign: 'center', marginBottom: '24px' }}>
            Criar Novo Documento
          </Title>
          <Text style={{ display: 'block', marginBottom: '24px', textAlign: 'center' }}>
            Preencha os detalhes abaixo para criar um novo documento.
          </Text>
          <Form
            {...formItemLayout}
            form={form}
            name="novoDocumento"
            onFinish={handleFinish}
            initialValues={{ signDocument: false }}
            style={{ maxWidth: '100%' }}
          >
            <Form.Item
              name="title"
              label="Título"
              rules={[{ required: true, message: 'Por favor, insira o título do documento!' }]}
            >
              <Input placeholder="Insira o título do documento" />
            </Form.Item>
            <Form.Item
              name="content"
              label="Conteúdo"
              rules={[{ required: true, message: 'Por favor, insira o conteúdo do documento!' }]}
            >
              <Input.TextArea rows={6} placeholder="Escreva o conteúdo do documento" />
            </Form.Item>
            <Form.Item {...buttonLayout}>
              <Button type="primary" htmlType="submit" block>
                Criar Documento
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </Content>
    </LayoutWrapper>
  );
};

export default NovoDocumento;
