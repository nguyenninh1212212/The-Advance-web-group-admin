import React from "react";
import { Layout as RaLayout } from "react-admin";
import { useNavigate } from "react-router-dom";
import CustomAppBar from "./Component/CustomAppBar";

const Layout = (props: any) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("accessToken");
        navigate("/login");
    };

    return <RaLayout {...props} appBar={(props) => <CustomAppBar {...props} onLogout={handleLogout} />} />;
};

export default Layout;
