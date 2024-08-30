import React from 'react';
import { Form, Input, Button, Divider } from 'antd';
import { GoogleOutlined } from '@ant-design/icons';

const Login = () => {
    const onFinish = (values) => {
        console.log('Success:', values);
    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    return (
        <div style={{ maxWidth: '400px', margin: '0 auto', padding: '50px', textAlign: 'center' }}>
            <h1 style={{ fontFamily: 'cursive', marginBottom: '20px' }}>Assinador Virtual</h1>
            <Form
                name="login"
                initialValues={{ remember: true }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                style={{ textAlign: 'left' }}
            >
                <Form.Item
                    name="username"
                    rules={[{ required: true, message: 'Por favor, insira seu telefone, nome de usuário ou email!' }]}
                >
                    <Input placeholder="Telefone, nome de usuário ou email" />
                </Form.Item>

                <Form.Item
                    name="password"
                    rules={[{ required: true, message: 'Por favor, insira sua senha!' }]}
                >
                    <Input.Password placeholder="Senha" />
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit" style={{ width: '100%', backgroundColor: '#0095f6', borderColor: '#0095f6' }}>
                        Entrar
                    </Button>
                </Form.Item>

                <Divider>OU</Divider>

                <Form.Item>
                    <Button icon={<GoogleOutlined />} style={{ width: '100%', backgroundColor: '#db4a39', color: 'white', borderColor: '#db4a39' }}>
                        Entrar com o Google
                    </Button>
                </Form.Item>

                <Form.Item>
                    <a href="#forgot-password" style={{ float: 'left' }}>Esqueceu a senha?</a>
                </Form.Item>
            </Form>

            <Divider />

            <div>
                <span>Não tem uma conta? </span><a href="#register">Cadastre-se</a>
            </div>
        </div>
    );
};

export default Login;
