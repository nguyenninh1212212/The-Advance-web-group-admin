import { Admin, Resource } from "react-admin";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Comment, People, PostAdd } from "@mui/icons-material";
import { Layout } from "./Layout";
import dataProvider from "./dataProvider";
import UserList from "./pages/users/user";
import UserShow from "./pages/users/usershow";
import PostList from "./pages/posts/post";
import Dashboard from "./pages/dashboard/Dashboard";
import Login from "./pages/auth/Login";

export const App = () => {
    const isAuthenticated = !!localStorage.getItem("accessToken"); // Kiểm tra token

    return (
        <BrowserRouter>
            <Routes>
                <Route
                    path="/login"
                    element={<Login />}
                />
                <Route
                    path="/*"
                    element={
                        isAuthenticated ? (
                            <Admin layout={Layout} dataProvider={dataProvider} dashboard={Dashboard}>
                                <Resource name="user" list={UserList} icon={People} show={UserShow} />
                                <Resource name="posts" list={PostList} icon={PostAdd} />
                                <Resource name="comments" list={PostList} icon={Comment} />
                            </Admin>
                        ) : (
                            <Navigate to="/login" />
                        )
                    }
                />
            </Routes>
        </BrowserRouter>
    );
};


