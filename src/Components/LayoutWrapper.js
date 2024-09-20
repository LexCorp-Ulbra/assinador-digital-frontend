import React from "react";
import { Layout } from "antd";
import Sidebar from "./Sidebar";
import HeaderBar from "./Header";
import FooterBar from "./Footer";

const { Content } = Layout;

const LayoutWrapper = ({ children }) => {
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sidebar />
      <Layout>
        <HeaderBar />
        <Content style={{ margin: "24px 16px", padding: 24, background: "#fff", minHeight: 280 }}>
          {children}
        </Content>
        <FooterBar />
      </Layout>
    </Layout>
  );
};

export default LayoutWrapper;
