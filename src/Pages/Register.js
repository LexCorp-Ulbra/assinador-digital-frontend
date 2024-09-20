import React from "react";
import { Form, Input, Button, message, Typography } from "antd";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const { Title, Text } = Typography;

const Register = () => {
  const navigate = useNavigate();

  const onFinish = async (values) => {
    try {
      const { username, email, password } = values;
      const response = await axios.post(
        "http://localhost:5000/api/auth/cadastro",
        {
          username,
          email,
          password,
        }
      );

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
    <div style={{ display: "flex", height: "100vh" }}>
      <div
        style={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "40px",
          backgroundColor: "#fff",
        }}
      >
        <div style={{ maxWidth: "400px", width: "100%" }}>
          <Title
            level={2}
            style={{ textAlign: "center", marginBottom: "24px" }}
          >
            Crie uma conta no{" "}
            <span
              style={{
                fontFamily: "'Poppins', sans-serif",
                fontSize: "24px",
                fontWeight: "bold",
                color: "#0095f6",
              }}
            >
              SigNier
            </span>
          </Title>
          <Text
            style={{
              display: "block",
              textAlign: "center",
              marginBottom: "24px",
            }}
          >
            Preencha os dados abaixo para criar uma nova conta.
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
              label="E-mail"
              rules={[
                { required: true, message: "Por favor, insira seu e-mail!" },
                {
                  type: "email",
                  message: "Por favor, insira um e-mail válido!",
                },
              ]}
            >
              <Input placeholder="Insira seu e-mail" />
            </Form.Item>

            <Form.Item
              name="password"
              label="Senha"
              rules={[
                { required: true, message: "Por favor, insira sua senha!" },
              ]}
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
        </div>
      </div>
      <div
        style={{
          flex: 1,
          backgroundImage: `url('/validade-jurídica.jpg')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
    </div>
  );
};

export default Register;
