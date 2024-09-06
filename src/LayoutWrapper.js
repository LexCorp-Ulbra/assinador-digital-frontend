import React from "react";
import { Layout, Menu, Button, Divider } from "antd";
import { FileOutlined, PlusOutlined, LogoutOutlined } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";

const { Header, Footer, Sider, Content } = Layout;

const headerStyle = {
  textAlign: "center",
  color: "#fff",
  height: 64,
  lineHeight: "64px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "0 24px",
  backgroundColor: "#0095f6",
};

const siderStyle = {
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

const menuItemStyle = {
  fontSize: "16px",
  padding: "16px 24px",
};

const iconStyle = {
  fontSize: "18px",
  color: "#fff",
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
        <Menu theme="dark" mode="inline" style={{ border: "none" }}>
          <Menu.Item key="1" icon={<FileOutlined style={iconStyle} />} style={menuItemStyle}>
            <Link to="/documentos" style={{ color: "#fff" }}>Documentos</Link>
          </Menu.Item>
          <Divider style={{ margin: 0, backgroundColor: "#fff" }} />
          <Menu.Item key="2" icon={<FileOutlined style={iconStyle} />} style={menuItemStyle}>
            <Link to="/documentoUsuario" style={{ color: "#fff" }}>Meus Documentos</Link>
          </Menu.Item>
          <Divider style={{ margin: 0, backgroundColor: "#fff" }} />
          <Menu.Item key="3" icon={<PlusOutlined style={iconStyle} />} style={menuItemStyle}>
            <Link to="/novoDocumento" style={{ color: "#fff" }}>Novo Documento</Link>
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout>
        <Header style={headerStyle}>
          <div style={{ fontSize: "18px", fontWeight: "bold" }}>
            SigNier
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
        <Footer style={footerStyle}>SigNier ©2024</Footer>
      </Layout>
    </Layout>
  );
};

export default LayoutWrapper;