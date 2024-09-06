import React from "react";
import { Form, Input, Button, message, Card, Typography } from "antd";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const { Title, Text } = Typography;

const Register = () => {
  const navigate = useNavigate();

  const onFinish = async (values) => {
    try {
      const { username, email, password } = values;
      const response = await axios.post("http://localhost:5000/api/auth/cadastro", {
        username,
        email,
        password,
      });

      const { token } = response.data;
      localStorage.setItem("token", token);

      message.success("Usuário cadastrado com sucesso!");
      navigate("/documentos");
    } catch (error) {
      if (error.response && error.response.data) {
        message.error(error.response.data.msg || "Erro ao cadastrar usuário.");
      } else {
        message.error("Erro ao cadastrar usuário.");
      }
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
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
          Cadastro
        </Title>
        <Text style={{ display: "block", textAlign: "center", marginBottom: "24px" }}>
          Crie uma nova conta preenchendo os dados abaixo.
        </Text>
        <Form
          name="register"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          layout="vertical"
        >
          <Form.Item
            name="username"
            label="Nome de usuário"
            rules={[
              {
                required: true,
                message: "Por favor, insira seu nome de usuário!",
              },
            ]}
          >
            <Input placeholder="Nome de usuário" />
          </Form.Item>

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
                backgroundColor: "#4096ff",
                borderColor: "#4096ff",
              }}
            >
              Cadastrar
            </Button>
          </Form.Item>

          <Form.Item>
            <div style={{ textAlign: "center" }}>
              <span>Já tem uma conta? </span>
              <a href="/">Entrar</a>
            </div>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Register;