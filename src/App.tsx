import { Admin, Resource, ShowGuesser } from "react-admin";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Category, Comment, People, PostAdd } from "@mui/icons-material";
import Layout from "./Layout";
import dataProvider from "./dataProvider";
import UserList from "./pages/users/user";
import UserShow from "./pages/users/usershow";
import PostList from "./pages/category/category";
import Dashboard from "./pages/dashboard/Dashboard";
import { Login } from "./pages/auth/Login";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CategoriesList from "./pages/category/category";
import StoryList from "./pages/Story/storylist";

export const App = () => {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/*"
          element={(
              <Admin
                layout={Layout}
                dataProvider={dataProvider}
                dashboard={Dashboard}
              >
                <Resource
                  name="user"
                  list={UserList}
                  icon={People}
                  show={UserShow}
                />
                <Resource 
                  name="category" 
                  list={CategoriesList} 
                  icon={Category} 
                  //show={ShowGuesser}
                />
                <Resource 
                  name="story" 
                  list={StoryList} 
                  icon={Comment} />
              </Admin>
            )
          }
        />
      </Routes>

      <ToastContainer
        position="top-right"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <ToastContainer />
    </BrowserRouter>
  );
};
