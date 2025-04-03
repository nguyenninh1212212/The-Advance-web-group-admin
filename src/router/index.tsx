import Home from "../page/Home/Home";
import Header from "../layout/Header";
import Login from "../page/Auth/Login";
import Register from "../page/Auth/Register";
import HomeLayout from "../layout/HomeLayout";
import ResultSearch from "../page/Result/ResultSearch";
const RoutesConfig = () => {
  const publicRoutes = [
    {
      path: "/auth/login",
      component: Login,
    },
    {
      path: "/auth/register",
      component: Register,
    },
    {
      path: "/",
      component: Home,
      layout: HomeLayout,
    },
    {
      path: "/filter",
      component: ResultSearch,
      layout: Header,
    },
  ];

  const privateRoutes = [
    // {
    //   path: "/",
    //   component: Home,
    //   layout: HomeLayout,
    // },
    {
      path: "/filter",
      component: ResultSearch,
      layout: Header,
    },
  ];

  return { publicRoutes, privateRoutes };
};

export default RoutesConfig;
