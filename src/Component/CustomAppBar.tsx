import React from "react";
import { AppBar, UserMenu } from "react-admin";
import { MenuItem } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";

const CustomUserMenu = ({ onLogout }: { onLogout: () => void }) => (
    <UserMenu>
        <MenuItem onClick={onLogout}> {/* Gọi hàm logout khi nhấn */}
            <LogoutIcon style={{ marginRight: 8 }} /> {/* Icon logout */}
            Đăng xuất
        </MenuItem>
    </UserMenu>
);

const CustomAppBar = ({ onLogout, ...props }: { onLogout: () => void }) => {
    return <AppBar {...props} userMenu={<CustomUserMenu onLogout={onLogout} />} />;
};

export default CustomAppBar;
