import React, { useState } from "react";
import { Form, Input, Button, message, Divider, Typography } from "antd";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../index";

const { Title } = Typography;

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
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <div style={{ display: "flex", flex: 1 }}>
        <div
          style={{
            flex: 1,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "0 40px",
            backgroundColor: "#fff",
          }}
        >
          <div style={{ maxWidth: "400px", width: "100%" }}>
            <Title
              level={2}
              style={{ textAlign: "left", marginBottom: "24px" }}
            >
              Faça login no{" "}
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
            <Form
              name="login"
              initialValues={{ remember: true }}
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
              layout="vertical"
            >
              <Form.Item
                name="email"
                label="E-mail"
                rules={[
                  {
                    required: true,
                    message: "Por favor, insira seu e-mail!",
                  },
                  {
                    type: "email",
                    message: "Por favor, insira um e-mail válido!",
                  },
                ]}
              >
                <Input placeholder="example@email.com" />
              </Form.Item>

              <Form.Item
                name="password"
                label="Senha"
                rules={[
                  {
                    required: true,
                    message: "Por favor, insira sua senha!",
                  },
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
                  loading={loading}
                >
                  Login
                </Button>
              </Form.Item>
            </Form>

            <Divider />

            <div style={{ textAlign: "center" }}>
              <span>Não tem uma conta? </span>
              <a href="/registro">Cadastro</a>
            </div>
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
    </div>
  );
};

export default Login;
