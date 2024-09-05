import React from "react";
import { Form, Input, Button, message } from "antd";
import { useNavigate } from "react-router-dom";
import axios from "axios";

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
        maxWidth: "400px",
        margin: "0 auto",
        padding: "50px",
        textAlign: "center",
      }}
    >
      <h1 style={{ fontFamily: "cursive", marginBottom: "20px" }}>Cadastro</h1>
      <Form
        name="register"
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        style={{ textAlign: "left" }}
      >
        <Form.Item
          name="username"
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
          rules={[{ required: true, message: "Por favor, insira seu email!" }]}
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
              backgroundColor: "#4096ff",
              borderColor: "#4096ff",
            }}
          >
            Cadastrar
          </Button>
        </Form.Item>

        <Form.Item>
          <span>Já tem uma conta? </span>
          <a href="/">Entrar</a>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Register;
