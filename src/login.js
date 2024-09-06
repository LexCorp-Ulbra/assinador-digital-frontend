import React, { useState } from "react";
import { Form, Input, Button, message, Divider, Card, Typography } from "antd";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const { Title, Text } = Typography;

const Login = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        {
          email: values.email,
          password: values.password,
        }
      );
      localStorage.setItem("token", response.data.token);
      message.success("Login realizado com sucesso!");
      setLoading(false);
      navigate("/documentos");
    } catch (error) {
      setLoading(false);
      if (error.response && error.response.data.msg) {
        message.error(error.response.data.msg);
      } else {
        message.error("Erro ao realizar o login. Tente novamente.");
      }
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
    message.error("Por favor, corrija os erros e tente novamente.");
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "#f0f2f5",
      }}
    >
      <Card style={{ maxWidth: "400px", width: "100%", padding: "40px" }}>
        <Title level={2} style={{ textAlign: "center", marginBottom: "24px" }}>
          Assinador Virtual
        </Title>
        <Text style={{ display: "block", textAlign: "center", marginBottom: "24px" }}>
          Faça login para continuar.
        </Text>
        <Form
          name="login"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          layout="vertical"
        >
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: "Por favor, insira seu email!" },
              { type: "email", message: "Por favor, insira um email válido!" },
            ]}
          >
            <Input placeholder="Insira seu email" />
          </Form.Item>

          <Form.Item
            name="password"
            label="Senha"
            rules={[{ required: true, message: "Por favor, insira sua senha!" }]}
          >
            <Input.Password placeholder="Insira sua senha" />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              style={{
                width: "100%",
                backgroundColor: "#0095f6",
                borderColor: "#0095f6",
              }}
              loading={loading}
            >
              Entrar
            </Button>
          </Form.Item>
        </Form>
        <Divider />
        <div style={{ textAlign: "center" }}>
          <span>Não tem uma conta? </span>
          <a href="/registro">Cadastre-se</a>
        </div>
      </Card>
    </div>
  );
};

export default Login;