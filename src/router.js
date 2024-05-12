import React from "react";
import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/users/homePage";
import { ROUTERS } from "./utils/router";
import MasterLayout from "./pages/users/theme/masterLayout";
import ProfilePage from "./pages/users/profilePage";
import MenuDetails from "./pages/users/theme/header/MenuDetails";
import SubMenuDetails from "./pages/users/theme/header/SubMenuDetails";
import SubSubMenuDetails from "./pages/users/theme/header/SubSubMenuDetails";
import ProductDetails from "./pages/users/product/index";
import SearchResultsPage from "./component/SearchResultsPage";
import Cart from "./pages/users/Cart/Cart";
import Login from "./pages/users/login/login";
import Register from "./pages/users/login/Register";
import TabMenu from "./pages/users/custumer/TabMenu";

const renderUserRouter = () => {
  const userRouters = [
    {
      path: ROUTERS.USER.HOME,
      element: <HomePage />,
    },
    {
      path: ROUTERS.USER.PROFILE,
      element: <ProfilePage />,
    },

    {
      path: "/category/:menuId",
      element: <MenuDetails />,
    },
    {
      path: "/category/parentid/:subMenuId",
      element: <SubMenuDetails />,
    },
    {
      path: "/product/categoryId/:subSubMenuId",
      element: <SubSubMenuDetails />,
    },
    {
      path: "/product/:productId",
      element: <ProductDetails />,
    },
    {
      path: "/search",
      element: <SearchResultsPage />,
    },
    {
      path: "/cart",
      element: <Cart />,
    },
    {
      path: "/Login",
      element: <Login />,
    },
    {
      path: "/Register",
      element: <Register />,
    },
    {
      path: "/Custumer",
      element: <TabMenu />,
    },
  ];

  return (
    <MasterLayout>
      <Routes>
        {userRouters.map((item, key) => (
          <Route key={key} path={item.path} element={item.element} />
        ))}
      </Routes>
    </MasterLayout>
  );
};

const RouterCustom = () => {
  return renderUserRouter();
};

export default RouterCustom;
