import React from "react";
import { Layout, Menu, Avatar, Typography, Button, Divider } from "antd";
import { FileOutlined, PlusOutlined, SettingOutlined, QuestionCircleOutlined, LogoutOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import "../css/sider.css"; 

const { Sider } = Layout;
const { Text } = Typography;

const Sidebar = () => {
    return (
        <Sider width={250} style={{ backgroundColor: "#001529", boxShadow: "2px 0 5px rgba(0,0,0,0.1)" }}>
            <div className="sider-header">
                <img src="/logo.png" alt="Logo" style={{ width: '40%', margin: '20px auto', display: 'block' }} />
                <h2 style={{ textAlign: "center", fontWeight: "bold", fontSize: "18px", color: "#fff" }}>SigNier</h2>
            </div>

            <Menu mode="inline" defaultSelectedKeys={["1"]} style={{ borderRight: 0, marginTop: '40px', backgroundColor: "#001529" }}>
                <Menu.Item key="1" icon={<FileOutlined style={{ fontSize: '20px', color: "#fff" }} />} className="ant-menu-item">
                    <Link to="/documentos"><Text style={{ color: "#fff" }}>Documentos</Text></Link>
                </Menu.Item>
                <Menu.Item key="2" icon={<FileOutlined style={{ fontSize: '20px', color: "#fff" }} />} className="ant-menu-item">
                    <Link to="/documentoUsuario"><Text style={{ color: "#fff" }}>Meus Documentos</Text></Link>
                </Menu.Item>
                <Menu.Item key="3" icon={<PlusOutlined style={{ fontSize: '20px', color: "#fff" }} />} className="ant-menu-item">
                    <Link to="/novoDocumento"><Text style={{ color: "#fff" }}>Novo Documento</Text></Link>
                </Menu.Item>
                <Divider style={{ backgroundColor: "#fff" }} />
                <Menu.Item key="4" icon={<SettingOutlined style={{ fontSize: '20px', color: "#fff" }} />} className="ant-menu-item">
                    <Link to="/configuracoes"><Text style={{ color: "#fff" }}>Configurações</Text></Link>
                </Menu.Item>
                <Menu.Item key="5" icon={<QuestionCircleOutlined style={{ fontSize: '20px', color: "#fff" }} />} className="ant-menu-item">
                    <Link to="/ajuda"><Text style={{ color: "#fff" }}>Ajuda</Text></Link>
                </Menu.Item>
                <Divider style={{ backgroundColor: "#fff" }} />
                <Menu.Item key="6" icon={<LogoutOutlined style={{ fontSize: '20px', color: "#fff" }} />} className="ant-menu-item">
                    <Button type="link" style={{ color: "#fff", padding: 0 }} onClick={() => { localStorage.removeItem("token"); window.location.href = '/'; }}>
                        <Text style={{ color: "#fff" }}>Sair</Text>
                    </Button>
                </Menu.Item>
            </Menu>

            <div className="sider-footer">
                <Avatar size={40} src="https://randomuser.me/api/portraits/men/32.jpg" />
                <div style={{ marginLeft: "10px" }}>
                    <Text style={{ fontSize: "14px", fontWeight: "bold", color: "#fff" }}>Jonathan Doe</Text>
                </div>
            </div>
        </Sider>
    );
};

export default Sidebar;
