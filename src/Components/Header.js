import React from "react";
import { Layout, Button } from "antd";
import { LogoutOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import "../css/Header.css";

const { Header } = Layout;

const HeaderBar = () => {

  return (
    <Header className="layout-header">
      <div className="header-title">Painel de Documentos</div>
    </Header>
  );
};

export default HeaderBar;
