// NovoDocumento.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Button, Switch, message, Layout } from 'antd';
import LayoutWrapper from './LayoutWrapper';

const { Content } = Layout;

const formItemLayout = {
  labelCol: { span: 4 },
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
      const response = await axios.post(
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
      <Content style={{ padding: '24px', backgroundColor: '#fff' }}>
        <Form
          {...formItemLayout}
          form={form}
          name="novoDocumento"
          onFinish={handleFinish}
          initialValues={{ signDocument: false }}
        >
          <Form.Item
            name="title"
            label="Título"
            rules={[{ required: true, message: 'Por favor, insira o título do documento!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="content"
            label="Conteúdo"
            rules={[{ required: true, message: 'Por favor, insira o conteúdo do documento!' }]}
          >
            <Input.TextArea rows={6} />
          </Form.Item>
          <Form.Item
            name="signDocument"
            label="Assinar Documento"
            valuePropName="checked"
          >
            <Switch onChange={handleSwitchChange} />
          </Form.Item>
          <Form.Item {...buttonLayout}>
            <Button type="primary" htmlType="submit">
              Criar Documento
            </Button>
          </Form.Item>
        </Form>
      </Content>
    </LayoutWrapper>
  );
};

export default NovoDocumento;
