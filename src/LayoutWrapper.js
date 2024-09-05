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
  backgroundColor: "#4096ff",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "0 24px",
};

const siderStyle = {
  color: "#fff",
  backgroundColor: "#1677ff",
};

const footerStyle = {
  textAlign: "center",
  color: "#fff",
  backgroundColor: "#4096ff",
};

const layoutStyle = {
  minHeight: "100vh",
};

const LayoutWrapper = ({ children }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <Layout style={layoutStyle}>
      <Sider style={siderStyle}>
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
          <div>Assinador Digital</div>
          <Button
            type="primary"
            icon={<LogoutOutlined />}
            onClick={handleLogout}
            style={{ backgroundColor: "#ff4d4f", borderColor: "#ff4d4f" }}
          >
            Sair
          </Button>
        </Header>
        <Content
          style={{
            textAlign: "left",
            padding: "24px",
            color: "#333",
            backgroundColor: "#fff",
          }}
        >
          {children}
        </Content>
        <Footer style={footerStyle}>Assinador Virtual ©2024</Footer>
      </Layout>
    </Layout>
  );
};

export default LayoutWrapper;
