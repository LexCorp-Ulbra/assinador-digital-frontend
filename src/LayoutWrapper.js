import React from "react";
import { Layout, Menu, Button } from "antd";
import { FileOutlined, PlusOutlined, LogoutOutlined } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";

const { Header, Footer, Sider, Content } = Layout;

const headerStyle = {
  textAlign: "center",
  color: "#fff",
  height: 64,
  paddingInline: 48,
  lineHeight: "64px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "0 24px",
  backgroundColor: "#0095f6",
};

const siderStyle = {
  color: "#fff",
  backgroundColor: "#0095f6",
};

const footerStyle = {
  textAlign: "center",
  color: "#fff",
  backgroundColor: "#0095f6",
  padding: "16px",
};

const layoutStyle = {
  minHeight: "100vh",
};

const contentStyle = {
  padding: "24px",
  margin: 0,
  minHeight: 280,
  backgroundColor: "#f0f2f5",
};

const buttonStyle = {
  backgroundColor: "#ff4d4f",
  borderColor: "#ff4d4f",
  borderRadius: "4px",
  fontWeight: "bold",
};

const LayoutWrapper = ({ children }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <Layout style={layoutStyle}>
      <Sider style={siderStyle} width={256}>
        <Menu theme="dark" mode="inline">
          <Menu.Item key="1" icon={<FileOutlined />}>
            <Link to="/documentos">Documentos</Link>
          </Menu.Item>
          <Menu.Item key="2" icon={<FileOutlined />}>
            <Link to="/documentoUsuario">Meus Documentos</Link>
          </Menu.Item>
          <Menu.Item key="3" icon={<PlusOutlined />}>
            <Link to="/novoDocumento">Novo Documento</Link>
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout>
        <Header style={headerStyle}>
          <div style={{ fontSize: "18px", fontWeight: "bold" }}>
            Assinador Digital
          </div>
          <Button
            type="primary"
            icon={<LogoutOutlined />}
            onClick={handleLogout}
            style={buttonStyle}
          >
            Sair
          </Button>
        </Header>
        <Content style={contentStyle}>{children}</Content>
        <Footer style={footerStyle}>Assinador Virtual ©2024</Footer>
      </Layout>
    </Layout>
  );
};

export default LayoutWrapper;
