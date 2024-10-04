import React from "react";
import { Layout, Menu, Avatar, Typography, Button, Divider } from "antd";
import { FileOutlined, PlusOutlined, SettingOutlined, QuestionCircleOutlined, LogoutOutlined, SafetyCertificateOutlined, SearchOutlined, FileSearchOutlined } from "@ant-design/icons";
import { Link, useLocation } from "react-router-dom";
import "../css/sider.css";

const { Sider } = Layout;
const { Text } = Typography;

const Sidebar = () => {
    const location = useLocation(); // Pega a localização atual (rota)

    // Definir a chave correta com base na URL atual
    const selectedKey = () => {
        if (location.pathname === "/documentos") return "1";
        if (location.pathname === "/documentoUsuario") return "2";
        if (location.pathname === "/novoDocumento") return "3";
        if (location.pathname === "/criarCertificado") return "4";
        return "1"; // Padrão se nenhum item for encontrado
    };

    return (
        <Sider width={250} style={{ backgroundColor: "#001529", boxShadow: "2px 0 5px rgba(0,0,0,0.1)" }}>
            <div className="sider-header">
                <img src="/logo.png" alt="Logo" style={{ width: '40%', margin: '20px auto', display: 'block' }} />
                <h2 style={{ textAlign: "center", fontWeight: "bold", fontSize: "18px", color: "#fff" }}>SigNier</h2>
            </div>

            <Menu
                mode="inline"
                selectedKeys={[selectedKey()]} // Define o item selecionado
                style={{ borderRight: 0, marginTop: '40px', backgroundColor: "#001529" }}
            >
                <Menu.ItemGroup key="g1" title={<Text style={{ color: "#fff" }}>Documentos</Text>} style={{ marginBottom: '10px' }}>
                    {/* <Menu.Item key="1" icon={<FileOutlined style={{ fontSize: '20px', color: "#fff" }} />} className="ant-menu-item">
                        <Link to="/documentos"><Text style={{ color: "#fff" }}>Todos Documentos</Text></Link>
                    </Menu.Item> */}
                    <Menu.Item key="1" icon={<PlusOutlined style={{ fontSize: '20px', color: "#fff" }} />} className="ant-menu-item">
                        <Link to="/assinar"><Text style={{ color: "#fff" }}>Assinar Documento</Text></Link>
                    </Menu.Item>

                    {/* <Menu.Item key="3" icon={<PlusOutlined style={{ fontSize: '20px', color: "#fff" }} />} className="ant-menu-item">
                        <Link to="/novoDocumento"><Text style={{ color: "#fff" }}>Novo Documento</Text></Link>
                    </Menu.Item> */}
                </Menu.ItemGroup>

                <Divider style={{ backgroundColor: "#fff" }} />

                <Menu.ItemGroup key="g2" title={<Text style={{ color: "#fff" }}>Certificados</Text>}>
                    <Menu.Item key="4" icon={<SafetyCertificateOutlined style={{ fontSize: '20px', color: "#fff" }} />} className="ant-menu-item">
                        <Link to="/criarCertificado"><Text style={{ color: "#fff" }}>Novo Certificado</Text></Link>
                    </Menu.Item>
                    {/* Adicione mais itens de certificados aqui, se necessário */}
                </Menu.ItemGroup>

                <Divider style={{ backgroundColor: "#fff" }} />

                <Menu.ItemGroup key="g2" title={<Text style={{ color: "#fff" }}>Validar</Text>}>
                    <Menu.Item key="2" icon={<FileSearchOutlined style={{ fontSize: '20px', color: "#fff" }}/>}>
                        <Link to="/validar"><Text style={{ color: "#fff" }}>Validar</Text></Link>
                    </Menu.Item>
                </Menu.ItemGroup>

                <Divider style={{ backgroundColor: "#fff" }} />

                <Menu.Item key="5" icon={<SettingOutlined style={{ fontSize: '20px', color: "#fff" }} />} className="ant-menu-item">
                    <Link to="/configuracoes"><Text style={{ color: "#fff" }}>Configurações</Text></Link>
                </Menu.Item>
                <Menu.Item key="6" icon={<QuestionCircleOutlined style={{ fontSize: '20px', color: "#fff" }} />} className="ant-menu-item">
                    <Link to="/ajuda"><Text style={{ color: "#fff" }}>Ajuda</Text></Link>
                </Menu.Item>

                <Divider style={{ backgroundColor: "#fff" }} />

                <Menu.Item key="7" icon={<LogoutOutlined style={{ fontSize: '20px', color: "#fff" }} />} className="ant-menu-item">
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
