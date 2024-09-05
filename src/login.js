import React, { useState } from "react";
import { Form, Input, Button, message, Divider } from "antd";
import axios from "axios";
import { useNavigate } from "react-router-dom";

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
      navigate("/documentos")
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
        maxWidth: "400px",
        margin: "0 auto",
        padding: "50px",
        textAlign: "center",
      }}
    >
      <h1 style={{ fontFamily: "cursive", marginBottom: "20px" }}>
        Assinador Virtual
      </h1>
      <Form
        name="login"
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        style={{ textAlign: "left" }}
      >
        <Form.Item
          name="email"
          rules={[
            { required: true, message: "Por favor, insira seu email!" },
            { type: "email", message: "Por favor, insira um email válido!" },
          ]}
        >
          <Input placeholder="Email" />
        </Form.Item>

        <Form.Item
          name="password"
          rules={[{ required: true, message: "Por favor, insira sua senha!" }]}
        >
          <Input.Password placeholder="Senha" />
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
        <Form.Item>
          <a href="#forgot-password" style={{ float: "left" }}>
            Esqueceu a senha?
          </a>
        </Form.Item>
      </Form>
      <Divider />
      <div>
        <span>Não tem uma conta? </span>
        <a href="/registro">Cadastre-se</a>
      </div>
    </div>
  );
};

export default Login;
