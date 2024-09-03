import React from 'react';
import { Form, Input, Button, Divider } from 'antd';
import { GoogleOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

const Login = () => {
    const navigate = useNavigate();

    const onFinish = (values) => {
        const { email, password } = values;

        // Verifica se as credenciais são as corretas
        if (email === 'Luis@gmail.com' && password === 'senha12345') {
            console.log('Login bem-sucedido');
            navigate('/Documentos');  // Redireciona para a página do App
        } else {
            console.log('Falha no login: Credenciais inválidas');
        }
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
                    name="email"
                    rules={[{ required: true, message: 'Por favor, insira seu email!' }]}
                >
                    <Input placeholder="Email" />
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
                <span>Não tem uma conta? </span>
                <Link to="/registro">Cadastre-se</Link> 
            </div>
        </div>
    );
};

export default Login;
